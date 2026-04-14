from rest_framework.permissions import BasePermission


class RolePermission(BasePermission):
    allowed_roles = ()

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or user.role in self.allowed_roles
            )
        )


class IsAdminRole(RolePermission):
    allowed_roles = ('admin',)


class IsAssessorRole(RolePermission):
    allowed_roles = ('assessor',)


class IsClientRole(RolePermission):
    allowed_roles = ('client',)


class IsAssessorOrAdminRole(RolePermission):
    allowed_roles = ('assessor', 'admin')


class IsRoleSuperUser(BasePermission):
    """
    Strict role protection: allow only users whose `role === "superuser"`.
    Does NOT use Django's `is_superuser` bypass, per product requirement.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and getattr(user, "role", None) == "superuser")


class IsRoleAdmin(BasePermission):
    """
    Strict role protection: allow only users whose `role === "admin"`.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and getattr(user, "role", None) == "admin")
