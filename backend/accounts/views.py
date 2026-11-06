from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsEmployee, IsAdmin


from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from .serializers import AdminEmployeeSerializer

User = get_user_model()



class CSRFAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response(
            {
                "csrfToken": get_token(request),
            },
            status=status.HTTP_200_OK,
        )


class EmployeeLoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = str(
            request.data.get("username", "")
        ).strip()

        password = str(
            request.data.get("password", "")
        )

        if not username or not password:
            return Response(
                {
                    "detail": (
                        "Username and password "
                        "are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request=request,
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "detail": (
                        "Invalid username or password."
                    )
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_staff:
            return Response(
                {
                    "detail": (
                        "This account does not have "
                        "employee access."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user)

        return Response(
            {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": (
                        "admin"
                        if user.is_superuser
                        else "employee"
                    ),
                    "is_admin": user.is_superuser,
                },
            },
            status=status.HTTP_200_OK,
        )


class EmployeeSessionAPIView(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        user = request.user

        return Response(
            {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": (
                        "admin"
                        if user.is_superuser
                        else "employee"
                    ),
                    "is_admin": user.is_superuser,
                },
            },
            status=status.HTTP_200_OK,
        )

class AdminSessionAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        user = request.user

        return Response(
            {
                "authenticated": True,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": "admin",
                    "is_admin": True,
                },
            },
            status=status.HTTP_200_OK,
        )
    
class EmployeeLogoutAPIView(APIView):
    permission_classes = [IsEmployee]

    def post(self, request):
        logout(request)

        return Response(
            {
                "authenticated": False,
            },
            status=status.HTTP_200_OK,
        )



class AdminEmployeeListCreateAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        employees = User.objects.filter(
            is_staff=True,
            is_superuser=False,
        ).order_by("-date_joined")

        serializer = AdminEmployeeSerializer(
            employees,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = AdminEmployeeSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()

        return Response(
            AdminEmployeeSerializer(employee).data,
            status=status.HTTP_201_CREATED,
        )


class AdminEmployeeDetailAPIView(APIView):
    permission_classes = [IsAdmin]

    def get_employee(self, employee_id):
        return get_object_or_404(
            User,
            pk=employee_id,
            is_staff=True,
            is_superuser=False,
        )

    def get(self, request, employee_id):
        employee = self.get_employee(employee_id)

        serializer = AdminEmployeeSerializer(employee)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, employee_id):
        employee = self.get_employee(employee_id)

        serializer = AdminEmployeeSerializer(
            employee,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, employee_id):
        employee = self.get_employee(employee_id)
        employee.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )
