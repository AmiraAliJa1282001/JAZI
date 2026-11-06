
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class AdminEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "date_joined",
            "password",
        ]
        read_only_fields = ["id", "date_joined"]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username is required."
            )

        queryset = User.objects.filter(
            username__iexact=value
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError(
                "Password cannot be empty."
            )

        validate_password(value, user=self.instance)
        return value

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({
                "password": "Password is required."
            })

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")

        employee = User(
            **validated_data,
            is_staff=True,
            is_superuser=False,
        )
        validate_password(password, user=employee)
        employee.set_password(password)
        employee.save()

        return employee

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password is not None:
            validate_password(password, user=instance)
            instance.set_password(password)

        instance.save()
        return instance
