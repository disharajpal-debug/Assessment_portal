import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.questions.models import QuestionCatalog


class Command(BaseCommand):
    help = "Import (upsert) QuestionCatalog records from a JSON export file."

    def add_arguments(self, parser):
        parser.add_argument(
            "json_path",
            type=str,
            nargs="?",
            default=None,
            help="Path to question_catalog.json (default: backend/assessment/seed/question_catalog.json).",
        )
        parser.add_argument(
            "--clear-missing",
            action="store_true",
            help="If set, delete DB catalogs that are not present in the JSON.",
        )

    def handle(self, *args, **options):
        base_dir = Path(__file__).resolve().parents[4]  # .../backend/assessment
        default_path = base_dir / "seed" / "question_catalog.json"

        json_path = Path(options["json_path"] or default_path).resolve()
        if not json_path.exists():
            raise CommandError(f"JSON file not found: {json_path}")

        try:
            payload = json.loads(json_path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise CommandError(f"Failed to parse JSON: {exc}") from exc

        catalogs = (payload or {}).get("catalogs") or {}
        basic = catalogs.get("basic")
        functional = catalogs.get("functional")
        sector_map = catalogs.get("sector") or {}

        if not isinstance(basic, list) or not isinstance(functional, list) or not isinstance(sector_map, dict):
            raise CommandError("Invalid JSON format: expected catalogs.basic(list), catalogs.functional(list), catalogs.sector(dict).")

        desired_keys = set()

        def upsert(category: str, sector_code: str | None, definition):
            if not isinstance(definition, list):
                raise CommandError(f"Invalid definition for {category}/{sector_code}: expected list.")
            obj, created = QuestionCatalog.objects.update_or_create(
                category=category,
                sector_code=sector_code,
                defaults={"definition": definition},
            )
            desired_keys.add((category, sector_code))
            return obj, created

        with transaction.atomic():
            upsert("basic", None, basic)
            upsert("functional", None, functional)

            for sector_code, definition in sector_map.items():
                upsert("sector", str(sector_code), definition)

            if options["clear_missing"]:
                for c in QuestionCatalog.objects.all():
                    if (c.category, c.sector_code) not in desired_keys:
                        c.delete()

        self.stdout.write(self.style.SUCCESS(f"Imported catalogs: {len(desired_keys)}"))

