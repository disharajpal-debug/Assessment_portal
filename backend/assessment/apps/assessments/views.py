from django.shortcuts import get_object_or_404
import sys
import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .serializers import AssessmentSerializer, AssessorAssignmentSerializer
from .models import Assessment, AssessorAssignment, Response as ResponseModel
from apps.users.models import User
from apps.users.permissions import (
    IsAssessorOrAdminRole,
    IsClientRole,
    IsRoleSuperUser,
    IsRoleAdmin,
)

logger = logging.getLogger(__name__)


def _assessor_sector_codes(user):
    return list(user.assessor_sectors.values_list("code", flat=True))


def _as_date(value):
    if not value:
        return None
    try:
        return timezone.datetime.fromisoformat(value).date()
    except Exception:
        return None


class AssessmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role in ['admin', 'superuser']:
            queryset = (
                Assessment.objects.select_related('user').all().order_by('-created_at')
            )
        elif request.user.role == 'assessor':
            allowed_sectors = _assessor_sector_codes(request.user)
            assigned_client_ids = AssessorAssignment.objects.filter(
                assessor=request.user
            ).values_list("client_id", flat=True)
            queryset = (
                Assessment.objects.select_related('user')
                .filter(
                    sector__in=allowed_sectors,
                    user_id__in=assigned_client_ids,
                )
                .order_by('-created_at')
            )
        else:
            queryset = Assessment.objects.filter(user=request.user).order_by(
                '-created_at'
            )
        serializer = AssessmentSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.user.role == 'client':
            target_user = request.user
        else:
            client_id = request.data.get('client_id')
            if not client_id:
                return Response(
                    {
                        'detail': 'client_id is required when creating an assessment for a client.',
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            client = get_object_or_404(User, pk=client_id, role='client')
            if request.user.role == 'assessor':
                if not AssessorAssignment.objects.filter(
                    assessor=request.user, client=client
                ).exists():
                    return Response(
                        {'detail': 'This client is not assigned to you.'},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                sector = serializer.validated_data.get('sector')
                allowed = set(_assessor_sector_codes(request.user))
                if sector and allowed and sector not in allowed:
                    return Response(
                        {'detail': 'Sector not allowed for your assessor profile.'},
                        status=status.HTTP_403_FORBIDDEN,
                    )
            target_user = client

        serializer.save(
            user=target_user,
            created_by=request.user,
            updated_by=request.user,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AssessmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        if request.user.role in ["admin", "superuser"]:
            return get_object_or_404(Assessment, pk=pk)
        if request.user.role == "assessor":
            return get_object_or_404(
                Assessment,
                pk=pk,
                sector__in=_assessor_sector_codes(request.user),
            )
        return get_object_or_404(Assessment, pk=pk, user=request.user)

    def get(self, request, pk):
        assessment = self.get_object(request, pk)
        serializer = AssessmentSerializer(assessment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssessmentUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        assessment = get_object_or_404(Assessment, pk=pk)

        if request.user.role in ["admin", "superuser"]:
            return assessment

        if request.user.role == "assessor":
            # Assessors can update only assigned clients' assessments.
            allowed = AssessorAssignment.objects.filter(
                assessor=request.user,
                client=assessment.user,
            ).exists()
            if not allowed:
                return None
            if assessment.sector not in set(_assessor_sector_codes(request.user)):
                return None
            return assessment

        # Clients can update only their own draft assessment.
        if assessment.user_id != request.user.id:
            return None
        if assessment.status != "draft":
            return None
        return assessment

    def put(self, request, pk):
        assessment = self.get_object(request, pk)
        if assessment is None:
            return Response(
                {"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN
            )
        serializer = AssessmentSerializer(assessment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssessmentReviewView(APIView):
    """
    Assessor/Admin review endpoint:
    - GET loads a client's submitted assessment (with responses_out)
    - PUT replaces responses (including highlight/lowlight/recommendation) and tracks reviewed_by/reviewed_at
    """

    permission_classes = [IsAuthenticated, IsAssessorOrAdminRole]

    def get_object(self, request, pk):
        assessment = get_object_or_404(Assessment, pk=pk)

        # If assessor, restrict to assigned clients only.
        if request.user.role == "assessor":
            if assessment.sector not in set(_assessor_sector_codes(request.user)):
                return None
            allowed = AssessorAssignment.objects.filter(
                assessor=request.user,
                client=assessment.user,
            ).exists()
            if not allowed:
                return None

        return assessment

    def get(self, request, pk):
        assessment = self.get_object(request, pk)
        if assessment is None:
            return Response(
                {"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN
            )
        return Response(
            AssessmentSerializer(assessment).data, status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        assessment = self.get_object(request, pk)
        if assessment is None:
            return Response(
                {"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN
            )

        # Validate top-level assessment fields (responses are handled manually below)
        serializer = AssessmentSerializer(assessment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        responses_in = request.data.get("responses") or []
        if not isinstance(responses_in, list) or len(responses_in) == 0:
            return Response(
                {"responses": "At least one response is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Replace response rows for this assessment.
        ResponseModel.objects.filter(assessment=assessment).delete()
        for r in responses_in:
            ResponseModel.objects.create(
                assessment=assessment,
                question_id=str(r.get("question_id") or ""),
                selected_option=str(r.get("selected_option") or ""),
                highlight=r.get("highlight") or "",
                lowlight=r.get("lowlight") or "",
                recommendation=r.get("recommendation") or "",
            )

        # Persist top-level recalculated fields from assessor review payload.
        for field in ("sector", "score", "status"):
            if field in validated:
                setattr(assessment, field, validated[field])

        # Mark review tracking
        assessment.updated_by = request.user
        assessment.reviewed_by = request.user
        assessment.reviewed_at = timezone.now()
        assessment.save(
            update_fields=[
                "sector",
                "score",
                "status",
                "updated_by",
                "reviewed_by",
                "reviewed_at",
                "updated_at",
            ]
        )

        return Response(
            AssessmentSerializer(assessment).data, status=status.HTTP_200_OK
        )


class AssessmentSubmitView(APIView):
    permission_classes = [IsAuthenticated, IsClientRole]

    def post(self, request, pk):
        assessment = get_object_or_404(Assessment, pk=pk, user=request.user)
        assessment.status = 'submitted'
        assessment.updated_by = request.user
        assessment.save(update_fields=['status', 'updated_by', 'updated_at'])
        serializer = AssessmentSerializer(assessment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAssessorOrAdminRole]

    def get(self, request):
        from apps.users.models import User

        if request.user.role == "assessor":
            allowed = _assessor_sector_codes(request.user)
            total_clients = User.objects.filter(
                role='client', sector__in=allowed
            ).count()
            total_assessments = Assessment.objects.filter(sector__in=allowed).count()
            pending = Assessment.objects.filter(
                status='draft', sector__in=allowed
            ).count()
            completed = Assessment.objects.filter(
                status='submitted', sector__in=allowed
            ).count()
        else:
            total_clients = User.objects.filter(role='client').count()
            total_assessments = Assessment.objects.count()
            pending = Assessment.objects.filter(status='draft').count()
            completed = Assessment.objects.filter(status='submitted').count()

        return Response(
            {
                'totalClients': total_clients,
                'totalAssessments': total_assessments,
                'pending': pending,
                'completed': completed,
            },
            status=status.HTTP_200_OK,
        )


class ClientListView(APIView):
    permission_classes = [IsAuthenticated, IsAssessorOrAdminRole]

    def get(self, request):
        from apps.users.models import User
        from apps.users.serializers import UserSerializer

        if request.user.role == "assessor":
            clients = User.objects.filter(
                role='client',
                sector__in=_assessor_sector_codes(request.user),
            )
        else:
            clients = User.objects.filter(role='client')
        serializer = UserSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssessorAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAssessorOrAdminRole]

    def get(self, request):
        from apps.users.models import User

        assessor = request.user
        if assessor.role == "admin":
            return Response(
                {"detail": "Admin analytics is not supported on this endpoint."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sector_filter = request.query_params.get("sector")
        start_date = _as_date(request.query_params.get("start_date"))
        end_date = _as_date(request.query_params.get("end_date"))
        overdue_days = int(request.query_params.get("overdue_days", 7))

        assignment_qs = AssessorAssignment.objects.select_related("client").filter(
            assessor=assessor
        )
        if sector_filter:
            assignment_qs = assignment_qs.filter(client__sector=sector_filter)

        assigned_clients = list(assignment_qs.values_list("client_id", flat=True))
        clients_qs = User.objects.filter(id__in=assigned_clients)
        if sector_filter:
            clients_qs = clients_qs.filter(sector=sector_filter)

        assessments_qs = Assessment.objects.select_related("user").filter(
            user_id__in=assigned_clients
        )
        if sector_filter:
            assessments_qs = assessments_qs.filter(sector=sector_filter)
        if start_date:
            assessments_qs = assessments_qs.filter(created_at__date__gte=start_date)
        if end_date:
            assessments_qs = assessments_qs.filter(created_at__date__lte=end_date)

        assessments = list(assessments_qs.order_by("-updated_at"))
        now = timezone.now()
        overdue_threshold = now - timezone.timedelta(days=overdue_days)

        latest_by_client = {}
        for a in assessments:
            prev = latest_by_client.get(a.user_id)
            if prev is None or (a.updated_at or a.created_at) > (
                prev.updated_at or prev.created_at
            ):
                latest_by_client[a.user_id] = a

        status_counts = {"pending": 0, "in_progress": 0, "completed": 0}
        sector_company_counts = {}
        overdue_items = []
        not_started = []
        upcoming_deadlines = []
        completed_on_time = 0
        total_completed = 0

        for client in clients_qs:
            sector = client.sector or "unknown"
            if sector not in sector_company_counts:
                sector_company_counts[sector] = {
                    "sector": sector,
                    "total_companies": 0,
                    "completed": 0,
                    "pending": 0,
                    "in_progress": 0,
                }
            sector_company_counts[sector]["total_companies"] += 1

            latest = latest_by_client.get(client.id)
            if latest is None:
                client_status = "pending"
                not_started.append(
                    {
                        "company_name": client.company_name or client.username,
                        "client_name": client.username,
                        "sector": sector,
                    }
                )
            elif latest.reviewed_at:
                client_status = "completed"
            elif latest.status == "submitted":
                client_status = "in_progress"
            elif latest.status == "draft":
                client_status = "in_progress"
            else:
                client_status = "pending"

            status_counts[client_status] += 1
            sector_company_counts[sector][client_status] += 1

            if client_status == "completed":
                total_completed += 1
                if latest.reviewed_at and latest.created_at:
                    if (latest.reviewed_at - latest.created_at).days <= overdue_days:
                        completed_on_time += 1
            if client_status != "completed":
                ref_date = (
                    (latest.updated_at or latest.created_at)
                    if latest
                    else now - timezone.timedelta(days=999)
                )
                if ref_date < overdue_threshold:
                    overdue_items.append(
                        {
                            "company_name": client.company_name or client.username,
                            "client_name": client.username,
                            "sector": sector,
                            "status": client_status,
                            "last_updated": ref_date,
                        }
                    )
                else:
                    upcoming_deadlines.append(
                        {
                            "company_name": client.company_name or client.username,
                            "client_name": client.username,
                            "sector": sector,
                            "status": client_status,
                            "target_by": ref_date + timezone.timedelta(days=overdue_days),
                        }
                    )

        timeline = {}
        for a in assessments:
            if not a.reviewed_at:
                continue
            bucket = a.reviewed_at.date().isoformat()
            timeline[bucket] = timeline.get(bucket, 0) + 1

        timeline_data = [
            {"date": d, "completed": c}
            for d, c in sorted(timeline.items(), key=lambda x: x[0])
        ]

        reviewed_assessments = [a for a in assessments if a.reviewed_at]
        avg_time_days = 0
        if reviewed_assessments:
            durations = [
                max(
                    0,
                    ((a.reviewed_at or a.updated_at or now) - (a.created_at or now)).days,
                )
                for a in reviewed_assessments
            ]
            avg_time_days = round(sum(durations) / len(durations), 1) if durations else 0

        total_companies = clients_qs.count()
        completion_rate = round(
            (status_counts["completed"] / total_companies) * 100, 1
        ) if total_companies else 0
        on_time_rate = round(
            (completed_on_time / total_completed) * 100, 1
        ) if total_completed else 0
        performance_score = round(((completion_rate * 0.7) + (on_time_rate * 0.3)) / 20, 2)
        performance_score = min(5, max(0, performance_score))

        if performance_score >= 4.5:
            badge = "Elite"
        elif performance_score >= 3.8:
            badge = "Strong"
        elif performance_score >= 3.0:
            badge = "Steady"
        else:
            badge = "Needs Attention"

        recent_activity = []
        for a in assessments[:10]:
            company = a.user.company_name or a.user.username
            if a.reviewed_at:
                status_text = "completed"
            elif a.status == "submitted":
                status_text = "in_progress"
            elif a.status == "draft":
                status_text = "in_progress"
            else:
                status_text = "pending"
            recent_activity.append(
                {
                    "assessment_id": a.id,
                    "company_name": company,
                    "client_name": a.user.username,
                    "sector": a.sector,
                    "status": status_text,
                    "last_updated": a.updated_at or a.created_at,
                }
            )

        return Response(
            {
                "kpis": {
                    "total_companies_assigned": total_companies,
                    "total_assessments_completed": status_counts["completed"],
                    "pending_assessments": status_counts["pending"],
                    "in_progress_assessments": status_counts["in_progress"],
                    "completion_rate": completion_rate,
                },
                "status_distribution": status_counts,
                "sector_performance": list(
                    sorted(sector_company_counts.values(), key=lambda x: x["sector"])
                ),
                "timeline": timeline_data,
                "workload": {
                    "companies_per_sector": list(
                        sorted(sector_company_counts.values(), key=lambda x: x["sector"])
                    ),
                    "average_assessment_time_days": avg_time_days,
                    "overdue_assessments_count": len(overdue_items),
                    "overdue_assessments": overdue_items[:20],
                },
                "recent_activity": recent_activity,
                "alerts": {
                    "overdue_assessments": overdue_items[:10],
                    "not_started_companies": not_started[:10],
                    "upcoming_deadlines": upcoming_deadlines[:10],
                },
                "performance": {
                    "score_out_of_5": performance_score,
                    "badge": badge,
                    "completion_rate": completion_rate,
                    "on_time_completion_rate": on_time_rate,
                },
            },
            status=status.HTTP_200_OK,
        )


class AssessorDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAssessorOrAdminRole]

    def get(self, request):
        try:
            logger.info(request.method)
            logger.info(request.get_full_path())

            from apps.users.models import User

            assessor = request.user
            if assessor.role != "assessor":
                return Response(
                    {"detail": "Only assessors can use this endpoint."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            sector_filter = request.query_params.get("sector")
            start_date = _as_date(request.query_params.get("start_date"))
            end_date = _as_date(request.query_params.get("end_date"))
            overdue_days = int(request.query_params.get("overdue_days", 7))

            assignment_qs = AssessorAssignment.objects.select_related("client").filter(
                assessor=assessor
            )
            if sector_filter:
                assignment_qs = assignment_qs.filter(client__sector=sector_filter)

            assigned_client_ids = list(assignment_qs.values_list("client_id", flat=True))
            clients_qs = User.objects.filter(id__in=assigned_client_ids)
            if sector_filter:
                clients_qs = clients_qs.filter(sector=sector_filter)

            assessments_qs = Assessment.objects.select_related("user").filter(
                user_id__in=assigned_client_ids
            )
            if sector_filter:
                assessments_qs = assessments_qs.filter(sector=sector_filter)
            if start_date:
                assessments_qs = assessments_qs.filter(created_at__date__gte=start_date)
            if end_date:
                assessments_qs = assessments_qs.filter(created_at__date__lte=end_date)

            assessments = list(assessments_qs.order_by("-updated_at"))
            now = timezone.now()
            overdue_threshold = now - timezone.timedelta(days=overdue_days)

            latest_by_client = {}
            for a in assessments:
                prev = latest_by_client.get(a.user_id)
                if prev is None or (a.updated_at or a.created_at) > (prev.updated_at or prev.created_at):
                    latest_by_client[a.user_id] = a

            summary = {"total_assigned": clients_qs.count(), "done": 0, "in_review": 0, "pending": 0}
            sector_map = {}
            not_started = []
            long_pending = []

            for client in clients_qs:
                sector = client.sector or "unknown"
                if sector not in sector_map:
                    sector_map[sector] = {"sector": sector, "total_companies": 0, "done": 0, "pending": 0}
                sector_map[sector]["total_companies"] += 1

                latest = latest_by_client.get(client.id)
                if latest is None:
                    status_key = "pending"
                    not_started.append(
                        {
                            "company_name": client.company_name or client.username,
                            "client_name": client.username,
                            "sector": sector,
                        }
                    )
                elif latest.reviewed_at:
                    status_key = "done"
                elif latest.status in ["submitted", "draft"]:
                    status_key = "in_review"
                else:
                    status_key = "pending"

                summary[status_key] += 1
                if status_key == "done":
                    sector_map[sector]["done"] += 1
                else:
                    sector_map[sector]["pending"] += 1

                if status_key != "done":
                    ref_date = (latest.updated_at or latest.created_at) if latest else None
                    if ref_date and ref_date < overdue_threshold:
                        long_pending.append(
                            {
                                "company_name": client.company_name or client.username,
                                "client_name": client.username,
                                "sector": sector,
                                "status": status_key,
                                "last_updated": ref_date,
                            }
                        )

            status_data = [
                {"name": "Done", "value": summary["done"]},
                {"name": "In Review", "value": summary["in_review"]},
                {"name": "Pending", "value": summary["pending"]},
            ]

            daily_map = {}
            weekly_map = {}
            for a in assessments:
                if not a.reviewed_at:
                    continue
                reviewed_date = a.reviewed_at.date()
                day_key = reviewed_date.isoformat()
                week_start = reviewed_date - timezone.timedelta(days=reviewed_date.weekday())
                week_key = week_start.isoformat()
                daily_map[day_key] = daily_map.get(day_key, 0) + 1
                weekly_map[week_key] = weekly_map.get(week_key, 0) + 1

            progress = {
                "daily": [{"date": d, "done": c} for d, c in sorted(daily_map.items(), key=lambda x: x[0])],
                "weekly": [{"week": d, "done": c} for d, c in sorted(weekly_map.items(), key=lambda x: x[0])],
            }

            recent_work = []
            for a in assessments[:10]:
                if a.reviewed_at:
                    status_text = "Done"
                elif a.status in ["submitted", "draft"]:
                    status_text = "In Review"
                else:
                    status_text = "Pending"
                recent_work.append(
                    {
                        "assessment_id": a.id,
                        "company_name": a.user.company_name or a.user.username,
                        "client_name": a.user.username,
                        "sector": a.sector,
                        "status": status_text,
                        "last_updated": a.updated_at or a.created_at,
                    }
                )

            return Response(
                {
                    "summary": summary,
                    "status_data": status_data,
                    "sector_data": list(sorted(sector_map.values(), key=lambda x: x["sector"])),
                    "progress": progress,
                    "pending_work": {
                        "not_started": not_started[:20],
                        "long_pending": long_pending[:20],
                    },
                    "recent_work": recent_work,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            logger.error("Error at %s %s : " % (exc_traceback.tb_lineno, e))
            return Response({"error": str(e)}, status=500)


class SuperUserSummaryView(APIView):
    """
    Summary card data for the SuperUser control panel.
    """

    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get(self, request):
        from apps.sectors.models import Sector
        from apps.users.models import User

        total_users = User.objects.count()
        total_assessments = Assessment.objects.count()
        total_sectors = Sector.objects.count()

        active_assessors = (
            AssessorAssignment.objects.filter().values("assessor_id").distinct().count()
        )

        return Response(
            {
                "totalUsers": total_users,
                "totalAssessments": total_assessments,
                "totalSectors": total_sectors,
                "activeAssessors": active_assessors,
            },
            status=status.HTTP_200_OK,
        )


class AssessorAssignmentListCreateView(APIView):
    """
    SuperUser: create/list/delete client->assessor mappings.
    """

    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get(self, request):
        queryset = AssessorAssignment.objects.select_related("client", "assessor").all()
        serializer = AssessorAssignmentSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AssessorAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        # Best-effort audit fields.
        assignment.created_by = request.user
        assignment.updated_by = request.user
        assignment.save(update_fields=["created_by", "updated_by"])
        serializer = AssessorAssignmentSerializer(assignment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AssessorAssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get_object(self, pk):
        return AssessorAssignment.objects.get(pk=pk)

    def put(self, request, pk):
        assignment = self.get_object(pk)
        serializer = AssessorAssignmentSerializer(
            assignment, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        assignment.updated_by = request.user
        assignment.save(update_fields=["updated_by"])
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        assignment = self.get_object(pk)
        assignment.delete()
        return Response(
            {"detail": "Assignment deleted."}, status=status.HTTP_204_NO_CONTENT
        )


class AdminSummaryView(APIView):
    """
    Summary card data for the Admin operations dashboard.
    """

    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get(self, request):
        from apps.users.models import User

        total_clients = User.objects.filter(role="client").count()
        total_assessors = User.objects.filter(role="assessor", is_active=True).count()

        total_assessments = Assessment.objects.count()
        pending = Assessment.objects.filter(status="draft").count()
        completed = Assessment.objects.filter(status="submitted").count()

        return Response(
            {
                "totalClients": total_clients,
                "totalAssessors": total_assessors,
                "totalAssessments": total_assessments,
                "pendingAssessments": pending,
                "completedAssessments": completed,
            },
            status=status.HTTP_200_OK,
        )


class AdminClientListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get(self, request):
        from apps.users.models import User
        from apps.users.serializers import UserSerializer

        clients = User.objects.filter(role="client").order_by("-date_joined")
        return Response(
            UserSerializer(clients, many=True).data, status=status.HTTP_200_OK
        )

    def post(self, request):
        from apps.users.serializers import RegisterSerializer, UserSerializer

        data = {**request.data, "role": "client"}
        serializer = RegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AdminClientDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get_object(self, pk):
        from apps.users.models import User

        return get_object_or_404(User, pk=pk, role="client")

    def put(self, request, pk):
        from apps.users.serializers import AdminUserUpdateSerializer, UserSerializer

        user = self.get_object(pk)
        serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(
            {"detail": "Client deleted."}, status=status.HTTP_204_NO_CONTENT
        )


class AdminAssessorListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get(self, request):
        from apps.users.models import User
        from apps.users.serializers import UserSerializer

        assessors = User.objects.filter(role="assessor").order_by("-date_joined")
        return Response(
            UserSerializer(assessors, many=True).data, status=status.HTTP_200_OK
        )

    def post(self, request):
        from apps.users.serializers import RegisterSerializer, UserSerializer

        data = {**request.data, "role": "assessor"}
        serializer = RegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AdminAssessorDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get_object(self, pk):
        from apps.users.models import User

        return get_object_or_404(User, pk=pk, role="assessor")

    def put(self, request, pk):
        from apps.users.serializers import AdminUserUpdateSerializer, UserSerializer

        user = self.get_object(pk)
        serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(
            {"detail": "Assessor deleted."}, status=status.HTTP_204_NO_CONTENT
        )


class AdminAssignmentListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get(self, request):
        queryset = AssessorAssignment.objects.select_related("client", "assessor").all()
        serializer = AssessorAssignmentSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AssessorAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        assignment.created_by = request.user
        assignment.updated_by = request.user
        assignment.save(update_fields=["created_by", "updated_by"])
        return Response(
            AssessorAssignmentSerializer(assignment).data,
            status=status.HTTP_201_CREATED,
        )


class AdminAssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRoleAdmin]

    def get_object(self, pk):
        return get_object_or_404(AssessorAssignment, pk=pk)

    def put(self, request, pk):
        assignment = self.get_object(pk)
        serializer = AssessorAssignmentSerializer(
            assignment, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        assignment.updated_by = request.user
        assignment.save(update_fields=["updated_by"])
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        assignment = self.get_object(pk)
        assignment.delete()
        return Response(
            {"detail": "Assignment deleted."}, status=status.HTTP_204_NO_CONTENT
        )
