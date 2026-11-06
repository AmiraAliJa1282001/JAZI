from django.urls import path

from .views import (
    AdminSessionAPIView,
    CSRFAPIView,
    EmployeeLoginAPIView,
    EmployeeLogoutAPIView,
    EmployeeSessionAPIView,
    
    AdminEmployeeListCreateAPIView,
    AdminEmployeeDetailAPIView,

)


urlpatterns = [
    path(
        "csrf/",
        CSRFAPIView.as_view(),
        name="csrf",
    ),
    path(
        "login/",
        EmployeeLoginAPIView.as_view(),
        name="employee-login",
    ),
    path(
        "logout/",
        EmployeeLogoutAPIView.as_view(),
        name="employee-logout",
    ),
    path(
        "session/",
        EmployeeSessionAPIView.as_view(),
        name="employee-session",
    ),
    path(
        "admin/session/",
        AdminSessionAPIView.as_view(),
        name="admin-session",
    ),
    
    path(
        "admin/employees/",
        AdminEmployeeListCreateAPIView.as_view(),
        name="admin-employees",
    ),
    path(
        "admin/employees/<int:employee_id>/",
        AdminEmployeeDetailAPIView.as_view(),
        name="admin-employee-detail",
    ),

]