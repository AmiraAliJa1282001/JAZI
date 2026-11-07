from django.urls import path

from .views import (
    OrderCreateAPIView,
    OrderTrackAPIView,
    EmployeeOrderListAPIView,
    EmployeeOrderStatusAPIView,
    EmployeeOrderHistoryAPIView,
    AdminAnalyticsAPIView,
    AdminOrderListAPIView,
    AdminOrderDetailAPIView,
    AdminOrderStatusAPIView,
    
)


urlpatterns = [
    path(
        "",
        OrderCreateAPIView.as_view(),
        name="order-create",
    ),

    path(
        "track/",
        OrderTrackAPIView.as_view(),
        name="order-track",
    ),
    path(
        "employee/",
        EmployeeOrderListAPIView.as_view(),
        name="employee-order-list",
    ),
    path(
        "employee/<str:order_number>/status/",
        EmployeeOrderStatusAPIView.as_view(),
        name="employee-order-status",
    ),
    path(
        "employee/history/",
        EmployeeOrderHistoryAPIView.as_view(),
        name="employee-order-history",
    ),
    path(
        "admin/analytics/",
        AdminAnalyticsAPIView.as_view(),
        name="admin-analytics",
    ),

    path(
        "admin/orders/",
        AdminOrderListAPIView.as_view(),
        name="admin-order-list",
    ),
    
    path(
        "admin/orders/<str:order_number>/status/",
        AdminOrderStatusAPIView.as_view(),
        name="admin-order-status",
    ),

        path(
        "admin/orders/<str:order_number>/",
        AdminOrderDetailAPIView.as_view(),
        name="admin-order-detail",
    ),

]
from .reports import AdminReports, AdminReportsCSV
urlpatterns += [
    path("admin/reports/", AdminReports.as_view()),
    path("admin/reports/csv/", AdminReportsCSV.as_view()),
]
