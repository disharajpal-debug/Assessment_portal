import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.sectors.models import Sector


class Command(BaseCommand):
    help = "Import (upsert) Sector records from a JSON file."

    def add_arguments(self, parser):
        parser.add_argument(
            "json_path",
            type=str,
            nargs="?",
            default=None,
            help="Path to sectors.json (default: backend/assessment/seed/sectors.json).",
        )

    def handle(self, *args, **options):
        base_dir = Path(__file__).resolve().parents[4]  # .../backend/assessment
        default_path = base_dir / "seed" / "sectors.json"

        json_path = Path(options["json_path"] or default_path).resolve()
        if not json_path.exists():
            raise CommandError(f"JSON file not found: {json_path}")

        try:
            payload = json.loads(json_path.read_text(encoding="utf-8"))
        except Exception as exc:
            raise CommandError(f"Failed to parse JSON: {exc}") from exc

        if not isinstance(payload, list):
            raise CommandError("Invalid JSON: expected a list of {code, name} objects.")

        count = 0
        with transaction.atomic():
            for item in payload:
                code = (item or {}).get("code")
                name = (item or {}).get("name")
                if not code or not name:
                    raise CommandError("Each sector must include 'code' and 'name'.")
                Sector.objects.update_or_create(code=str(code), defaults={"name": str(name)})
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Imported sectors: {count}"))

