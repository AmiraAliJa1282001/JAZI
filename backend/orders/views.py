from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsEmployee


from datetime import datetime, time, timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from datetime import date
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

from accounts.permissions import IsAdmin

from .models import Order, OrderItem

from .models import Order
from .serializers import (
    OrderCreateSerializer,
    OrderDetailSerializer,
    EmployeeOrderSerializer,
)


class OrderCreateAPIView(APIView):
    def post(self, request):
        from website.operations import can_accept_orders
        from website.models import OperationsSettings
        from menu.models import Product
        allowed, reason = can_accept_orders()
        if not allowed:
            return Response({"detail": reason}, status=status.HTTP_403_FORBIDDEN)
        settings = OperationsSettings.load()
        raw_items = request.data.get("items", [])
        # Validate quantities/product availability using the existing serializer first.
        serializer = OrderCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        computed_total = sum((item["product"].price * item["quantity"] for item in serializer.validated_data["items"]), Decimal("0.00"))
        if computed_total < settings.minimum_order:
            return Response({"detail": f"Minimum order is {settings.minimum_order} AED."}, status=status.HTTP_400_BAD_REQUEST)
        order = serializer.save()

        response_serializer = (
            OrderDetailSerializer(order)
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class OrderTrackAPIView(APIView):
    def post(self, request):
        order_number = str(
            request.data.get(
                "order_number",
                ""
            )
        ).strip().upper()

        phone = str(
            request.data.get(
                "phone",
                ""
            )
        ).strip()

        if not order_number or not phone:
            return Response(
                {
                    "detail": (
                        "Order number and phone "
                        "number are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = (
                Order.objects
                .prefetch_related("items")
                .get(
                    order_number=order_number,
                    phone=phone,
                )
            )

        except Order.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "We couldn't find an order "
                        "matching these details."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderDetailSerializer(
            order
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class EmployeeOrderListAPIView(APIView):
    permission_classes = [IsEmployee]
    def get(self, request):
        orders = (
            Order.objects
            .prefetch_related(
                "items__product"
            )
            .all()
        )

        serializer = EmployeeOrderSerializer(
            orders,
            many=True,
            context={
                "request": request,
            },
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class EmployeeOrderStatusAPIView(APIView):
    permission_classes = [IsEmployee]

    ALLOWED_TRANSITIONS = {
        Order.Status.PENDING: {
            Order.Status.CONFIRMED,
            Order.Status.CANCELLED,
        },

        Order.Status.CONFIRMED: {
            Order.Status.PREPARING,
            Order.Status.CANCELLED,
        },

        Order.Status.PREPARING: {
            Order.Status.READY,
        },

        Order.Status.READY: {
            Order.Status.COMPLETED,
        },

        Order.Status.COMPLETED: set(),
        Order.Status.CANCELLED: set(),
    }

    def patch(self, request, order_number):
        new_status = str(
            request.data.get("status", "")
        ).strip().lower()

        # 1. Make sure a status was provided
        if not new_status:
            return Response(
                {
                    "detail": "Order status is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Find the order
        try:
            order = (
                Order.objects
                .prefetch_related("items__product")
                .get(
                    order_number=order_number.upper()
                )
            )
        except Order.DoesNotExist:
            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        current_status = order.status

        # 3. Make sure current status is known
        allowed_next_statuses = (
            self.ALLOWED_TRANSITIONS.get(
                current_status
            )
        )

        if allowed_next_statuses is None:
            return Response(
                {
                    "detail": (
                        "The current order status "
                        "is not valid."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4. Prevent changing to the same status
        if new_status == current_status:
            return Response(
                {
                    "detail": (
                        f"Order is already "
                        f"{order.get_status_display()}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 5. Validate transition
        if new_status not in allowed_next_statuses:
            allowed_labels = [
                dict(Order.Status.choices).get(
                    value,
                    value.title(),
                )
                for value in allowed_next_statuses
            ]

            if not allowed_labels:
                return Response(
                    {
                        "detail": (
                            f"{order.get_status_display()} "
                            "orders cannot be changed."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "detail": (
                        "Invalid status transition. "
                        f"Order is currently "
                        f"{order.get_status_display()}. "
                        "Allowed next status: "
                        f"{', '.join(allowed_labels)}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 6. Update status
        order.status = new_status

        order.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        # 7. Return updated order
        serializer = EmployeeOrderSerializer(
            order,
            context={
                "request": request
            },
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class EmployeeOrderHistoryAPIView(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        orders = (
            Order.objects
            .prefetch_related("items__product")
            .filter(
                status__in=[
                    Order.Status.COMPLETED,
                    Order.Status.CANCELLED,
                ]
            )
            .order_by("-updated_at")
        )

        serializer = EmployeeOrderSerializer(
            orders,
            many=True,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class AdminAnalyticsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        period = request.query_params.get(
            "period", "today"
        )

        allowed_periods = {
            "today": 1,
            "7days": 7,
            "30days": 30,
        }

        if period not in allowed_periods:
            return Response(
                {"detail": "Invalid analytics period."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        days = allowed_periods[period]

        now = timezone.localtime()
        today = now.date()
        start_date = today - timedelta(days=days - 1)

        start_datetime = timezone.make_aware(
            datetime.combine(start_date, time.min),
            timezone.get_current_timezone(),
        )

        end_datetime = timezone.make_aware(
            datetime.combine(
                today + timedelta(days=1),
                time.min,
            ),
            timezone.get_current_timezone(),
        )

        orders = Order.objects.filter(
            created_at__gte=start_datetime,
            created_at__lt=end_datetime,
        )

        total_orders = orders.count()

        # Cancelled orders are excluded from revenue.
        valid_orders = orders.exclude(
            status=Order.Status.CANCELLED
        )

        total_sales = (
            valid_orders.aggregate(
                amount=Sum("total")
            )["amount"]
            or Decimal("0.00")
        )

        # Customers are identified by phone number.
        unique_customers = (
            orders.values("phone")
            .distinct()
            .count()
        )

        status_counts = {
            value: 0
            for value, label in Order.Status.choices
        }

        for item in orders.values("status").annotate(
            count=Count("id")
        ):
            status_counts[item["status"]] = item["count"]

        # Best-selling product by quantity sold.
        best_sellers = (
            OrderItem.objects.filter(
                order__in=valid_orders
            )
            .values("product_id", "product_name")
            .annotate(
                quantity_sold=Sum("quantity")
            )
            .order_by("-quantity_sold", "product_name")[:5]
        )

        best_sellers_data = [
            {
                "product_id": item["product_id"],
                "name": item["product_name"],
                "quantity_sold": item["quantity_sold"],
            }
            for item in best_sellers
        ]

        # Group orders by restaurant-local date.
        daily_orders = (
            orders.annotate(
                day=TruncDate(
                    "created_at",
                    tzinfo=timezone.get_current_timezone(),
                )
            )
            .values("day")
            .annotate(count=Count("id"))
        )

        daily_sales = (
            valid_orders.annotate(
                day=TruncDate(
                    "created_at",
                    tzinfo=timezone.get_current_timezone(),
                )
            )
            .values("day")
            .annotate(amount=Sum("total"))
        )

        orders_by_day = {
            item["day"]: item["count"]
            for item in daily_orders
        }

        sales_by_day = {
            item["day"]: item["amount"]
            for item in daily_sales
        }

        chart = []

        for offset in range(days):
            day = start_date + timedelta(days=offset)

            chart.append({
                "date": day.isoformat(),
                "orders": orders_by_day.get(day, 0),
                "sales": str(
                    sales_by_day.get(
                        day, Decimal("0.00")
                    )
                ),
            })

        recent_orders = list(
            orders.order_by("-created_at")
            .values(
                "order_number",
                "customer_name",
                "status",
                "total",
                "created_at",
            )[:5]
        )

        for order in recent_orders:
            order["total"] = str(order["total"])

        return Response({
            "period": period,
            "currency": "AED",
            "summary": {
                "total_orders": total_orders,
                "total_sales": str(total_sales),
                "unique_customers": unique_customers,
                "popular_item": (
                    best_sellers_data[0]["name"]
                    if best_sellers_data
                    else None
                ),
            },
            "status_counts": status_counts,
            "chart": chart,
            "best_sellers": best_sellers_data,
            "recent_orders": recent_orders,
        })



class AdminOrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminOrderListAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        search = request.query_params.get(
            "search", ""
        ).strip()

        order_status = request.query_params.get(
            "status", ""
        ).strip().lower()

        date_from = request.query_params.get(
            "date_from", ""
        ).strip()

        date_to = request.query_params.get(
            "date_to", ""
        ).strip()

        valid_statuses = {
            value for value, _ in Order.Status.choices
        }

        if order_status and order_status not in valid_statuses:
            return Response(
                {"detail": "Invalid order status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for value in (date_from, date_to):
            if value:
                try:
                    date.fromisoformat(value)
                except ValueError:
                    return Response(
                        {
                            "detail": (
                                "Invalid date format. "
                                "Use YYYY-MM-DD."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        if date_from and date_to and date_from > date_to:
            return Response(
                {
                    "detail": (
                        "date_from cannot be after date_to."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        orders = (
            Order.objects
            .prefetch_related("items__product")
            .order_by("-created_at", "-id")
        )

        if search:
            orders = orders.filter(
                Q(order_number__icontains=search)
                | Q(customer_name__icontains=search)
                | Q(phone__icontains=search)
            )

        if order_status:
            orders = orders.filter(status=order_status)

        if date_from:
            orders = orders.filter(
                created_at__date__gte=date_from
            )

        if date_to:
            orders = orders.filter(
                created_at__date__lte=date_to
            )

        paginator = AdminOrderPagination()

        page = paginator.paginate_queryset(
            orders,
            request,
            view=self,
        )

        serializer = EmployeeOrderSerializer(
            page,
            many=True,
            context={"request": request},
        )

        return paginator.get_paginated_response(
            serializer.data
        )


class AdminOrderDetailAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, order_number):
        try:
            order = (
                Order.objects
                .prefetch_related("items__product")
                .get(
                    order_number=order_number.upper()
                )
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = EmployeeOrderSerializer(
            order,
            context={"request": request},
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )



class AdminOrderStatusAPIView(EmployeeOrderStatusAPIView):
    permission_classes = [IsAdmin]
