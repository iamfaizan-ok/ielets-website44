"""Dual JWT authentication: Django SimpleJWT + Supabase Auth JWT (HS256/RS256)."""

from django.conf import settings
from django.contrib.auth import get_user_model
import jwt
from jwt import PyJWKClient
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


class SupabaseOrSimpleJWTAuthentication(JWTAuthentication):
    """Validates SimpleJWT first; falls back to Supabase HS256/RS256 JWT."""

    def authenticate_header(self, request) -> str:
        return 'Bearer realm="api"'

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
            user = self.get_user(validated_token)
            if not user.is_active:
                raise AuthenticationFailed("User account is suspended.")
            return user, validated_token
        except (InvalidToken, TokenError):
            pass

        # 2. Fallback to Supabase JWT
        payload = self._decode_supabase_token(raw_token)
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
            raise AuthenticationFailed("User account is suspended.")

        return user, payload

    def _decode_supabase_token(self, raw_token: bytes) -> dict:
        supabase_secret = getattr(settings, "SUPABASE_JWT_SECRET", "")
        supabase_url = getattr(settings, "SUPABASE_URL", "").rstrip("/")
        if not supabase_secret and not supabase_url:
            raise AuthenticationFailed("Invalid or expired authentication token.")

        try:
            unverified_header = jwt.get_unverified_header(raw_token)
            alg = unverified_header.get("alg", "HS256")
            if alg == "RS256" and supabase_url:
                jwks_client = PyJWKClient(f"{supabase_url}/auth/v1/.well-known/jwks.json")
                signing_key = jwks_client.get_signing_key_from_jwt(raw_token).key
                return jwt.decode(
                    raw_token, signing_key, algorithms=["RS256"], audience="authenticated"
                )
            if not supabase_secret:
                raise AuthenticationFailed("Invalid or expired authentication token.")
            return jwt.decode(
                raw_token, supabase_secret, algorithms=["HS256"], audience="authenticated"
            )
        except jwt.PyJWTError as exc:
            raise AuthenticationFailed("Invalid Supabase token.") from exc
