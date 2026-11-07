from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from accounts.permissions import IsAdmin
from .models import OperationsSettings, BusinessHour
from .operations import OperationsSerializer, BusinessHourSerializer, can_accept_orders

class PublicOrderAvailability(APIView):
    permission_classes = []
    def get(self, request):
        allowed, reason = can_accept_orders()
        settings = OperationsSettings.load()
        return Response({"accepting_orders": allowed, "reason": reason, "minimum_order": str(settings.minimum_order), "preparation_minutes": settings.preparation_minutes, "currency": settings.currency, "order_sound_enabled": settings.order_sound_enabled})

class AdminOperations(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def get(self, request):
        return Response(OperationsSerializer(OperationsSettings.load(), context={"request": request}).data)
    def patch(self, request):
        obj = OperationsSettings.load()
        serializer = OperationsSerializer(obj, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AdminBusinessHours(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        result = []
        for weekday in range(7):
            obj, _ = BusinessHour.objects.get_or_create(weekday=weekday)
            result.append(BusinessHourSerializer(obj).data)
        return Response(result)
    @transaction.atomic
    def put(self, request):
        if not isinstance(request.data, list) or len(request.data) != 7:
            return Response({"detail": "Provide exactly seven days."}, status=400)
        seen = set()
        validated = []
        for item in request.data:
            s = BusinessHourSerializer(data=item)
            s.is_valid(raise_exception=True)
            day = s.validated_data["weekday"]
            if day not in range(7) or day in seen:
                return Response({"detail": "Each weekday 0-6 must appear exactly once."}, status=400)
            seen.add(day)
            validated.append(s.validated_data)
        for item in validated:
            day = item.pop("weekday")
            BusinessHour.objects.update_or_create(weekday=day, defaults=item)
        return self.get(request)

class AdminPasswordChange(APIView):
    permission_classes = [IsAdmin]
    def post(self, request):
        old = request.data.get("current_password", "")
        new = request.data.get("new_password", "")
        if not request.user.check_password(old):
            return Response({"detail": "Current password is incorrect."}, status=400)
        try:
            validate_password(new, user=request.user)
        except ValidationError as error:
            return Response({"detail": " ".join(error.messages)}, status=400)
        request.user.set_password(new)
        request.user.save(update_fields=["password"])
        update_session_auth_hash(request, request.user)
        return Response({"detail": "Password updated."})

class AdminLogoutOtherSessions(APIView):
    permission_classes = [IsAdmin]
    def post(self, request):
        # Rotate session auth hash to invalidate other sessions for this account.
        user = request.user
        if not user.check_password(request.data.get("current_password", "")):
            return Response({"detail": "Current password is incorrect."}, status=400)
        # Changing the password hash salt preserves the password but invalidates other sessions.
        from django.contrib.auth.hashers import identify_hasher
        encoded = user.password
        hasher = identify_hasher(encoded)
        user.password = hasher.encode(request.data["current_password"], hasher.salt())
        user.save(update_fields=["password"])
        update_session_auth_hash(request, user)
        return Response({"detail": "Other login sessions have been invalidated."})
