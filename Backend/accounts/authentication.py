"""Dual JWT authentication: Django SimpleJWT + Supabase Auth JWT."""

from django.conf import settings
from django.contrib.auth import get_user_model
import jwt
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


class SupabaseOrSimpleJWTAuthentication(JWTAuthentication):
    """Validates SimpleJWT first; falls back to Supabase HS256 JWT if configured."""

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        # 1. Try SimpleJWT
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            pass

        # 2. Fallback to Supabase JWT
        supabase_secret = getattr(settings, "SUPABASE_JWT_SECRET", "")
        if not supabase_secret:
            raise AuthenticationFailed("Invalid or expired authentication token.")

        try:
            payload = jwt.decode(
                raw_token,
                supabase_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.PyJWTError as exc:
            raise AuthenticationFailed("Invalid Supabase token.") from exc

        sub = payload.get("sub")
        email = payload.get("email")
        if not sub or not email:
            raise AuthenticationFailed("Supabase token missing subject or email.")

        user = User.objects.filter(supabase_uid=sub).first()
        if user is None:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0][:120] + f"_{sub[:6]}",
                    "supabase_uid": sub,
                    "is_verified": bool(payload.get("email_confirmed_at")),
                },
            )
            if not created and not user.supabase_uid:
                user.supabase_uid = sub
                user.save(update_fields=["supabase_uid"])

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")

        return user, payload
