
from rest_framework.permissions import BasePermission


class IsEmployee(BasePermission):
    message = "Employee access is required."

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_staff
        )


class IsAdmin(BasePermission):
    message = "Admin access is required."

    def has_permission(self, request, view):
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_staff
            and user.is_superuser
        )
