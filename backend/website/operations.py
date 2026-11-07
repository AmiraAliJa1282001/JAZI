from datetime import datetime, time
from django.utils import timezone
from rest_framework import serializers
from .models import OperationsSettings, BusinessHour

class OperationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationsSettings
        fields = ["business_name", "logo", "email", "whatsapp", "currency", "accepting_orders", "minimum_order", "preparation_minutes", "enforce_business_hours", "temporarily_closed", "order_sound_enabled"]

    def validate_currency(self, value):
        if value != "AED":
            raise serializers.ValidationError("JAZI currently supports AED only.")
        return value

    def validate_minimum_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Must be non-negative.")
        return value

    def validate_preparation_minutes(self, value):
        if value < 1 or value > 240:
            raise serializers.ValidationError("Must be between 1 and 240.")
        return value

class BusinessHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHour
        fields = ["weekday", "is_open", "opens_at", "closes_at"]
        extra_kwargs = {"weekday": {"validators": []}}


def can_accept_orders():
    settings = OperationsSettings.load()
    if not settings.accepting_orders or settings.temporarily_closed:
        return False, "Online ordering is currently paused."
    if settings.enforce_business_hours:
        now = timezone.localtime()
        hour = BusinessHour.objects.filter(weekday=now.weekday()).first()
        t = now.time().replace(tzinfo=None)
        open_now = False
        if hour is not None and hour.is_open:
            if hour.opens_at <= hour.closes_at:
                open_now = hour.opens_at <= t < hour.closes_at
            else:
                open_now = t >= hour.opens_at
        # For overnight hours, check previous day's opening window too.
        if not open_now:
            previous = BusinessHour.objects.filter(weekday=(now.weekday()-1)%7, is_open=True).first()
            if previous and previous.opens_at > previous.closes_at and t < previous.closes_at:
                open_now = True
        if not open_now:
            return False, "Online ordering is closed outside business hours."
    return True, ""
