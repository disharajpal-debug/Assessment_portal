from django.http import JsonResponse


def api_root(request):
    """Root URL for the API server — no HTML UI here; use the React app (e.g. Vite on :5173)."""
    return JsonResponse(
        {
            "service": "Assessment Portal API",
            "docs": "Use the frontend dev server for the UI, or call these paths:",
            "paths": {
                "admin": "/admin/",
                "auth": "/api/auth/",
                "assessment": "/api/assessment/",
                "questions": "/api/questions/",
            },
        }
    )


def v1_models(request):
    """
    OpenAI-compatible stub endpoint.

    Some tooling tries calling `GET /v1/models` on an OpenAI-compatible base URL.
    Your assessment portal backend doesn't implement that API, but returning a valid
    shape avoids repeated 404 noise in the dev console.
    """
    return JsonResponse(
        {
            "object": "list",
            "data": [],
        }
    )
