import csv
from datetime import datetime, time, timedelta
from decimal import Decimal
from django.http import HttpResponse
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdmin
from .models import Order, OrderItem

PERIODS = {"today": 1, "7days": 7, "30days": 30, "90days": 90}

def report_data(period):
    days = PERIODS[period]
    today = timezone.localdate()
    start = today - timedelta(days=days-1)
    start_dt = timezone.make_aware(datetime.combine(start, time.min))
    end_dt = timezone.make_aware(datetime.combine(today+timedelta(days=1), time.min))
    orders = Order.objects.filter(created_at__gte=start_dt, created_at__lt=end_dt)
    sales_orders = orders.exclude(status=Order.Status.CANCELLED)
    # Revenue is order value excluding cancellations, not confirmed payments or profit.
    sales = sales_orders.aggregate(v=Sum("total"))["v"] or Decimal("0")
    counts = {key: 0 for key, _ in Order.Status.choices}
    for row in orders.values("status").annotate(n=Count("id")):
        counts[row["status"]] = row["n"]
    daily_orders = {r["day"]: r["n"] for r in orders.annotate(day=TruncDate("created_at", tzinfo=timezone.get_current_timezone())).values("day").annotate(n=Count("id"))}
    daily_sales = {r["day"]: r["v"] for r in sales_orders.annotate(day=TruncDate("created_at", tzinfo=timezone.get_current_timezone())).values("day").annotate(v=Sum("total"))}
    chart = [{"date": (start+timedelta(days=i)).isoformat(), "orders": daily_orders.get(start+timedelta(days=i), 0), "sales": str(daily_sales.get(start+timedelta(days=i), Decimal("0")))} for i in range(days)]
    items = list(OrderItem.objects.filter(order__in=sales_orders).values("product_name").annotate(quantity=Sum("quantity"), revenue=Sum("line_total")).order_by("-quantity", "product_name")[:10])
    for item in items:
        item["revenue"] = str(item["revenue"])
    return {"period": period, "currency": "AED", "summary": {"orders": orders.count(), "sales": str(sales), "average_order_value": str(round(sales / sales_orders.count(), 2)) if sales_orders.count() else "0.00", "customers": orders.values("phone").distinct().count(), "cancelled": counts["cancelled"]}, "status_counts": counts, "chart": chart, "best_sellers": items}

class AdminReports(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        period = request.query_params.get("period", "30days")
        if period not in PERIODS:
            return Response({"detail": "Invalid period."}, status=400)
        return Response(report_data(period))

class AdminReportsCSV(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        period = request.query_params.get("period", "30days")
        if period not in PERIODS:
            return Response({"detail": "Invalid period."}, status=400)
        report = report_data(period)
        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="jazi-report-{period}.csv"'
        response.write("\ufeff")
        writer = csv.writer(response)
        writer.writerow(["Date", "Orders", "Order value (AED)"])
        for row in report["chart"]:
            writer.writerow([row["date"], row["orders"], row["sales"]])
        writer.writerow([])
        writer.writerow(["Status", "Count"])
        for key, value in report["status_counts"].items():
            writer.writerow([key, value])
        writer.writerow([])
        writer.writerow(["Product", "Quantity", "Order value (AED)"])
        for item in report["best_sellers"]:
            writer.writerow([item["product_name"], item["quantity"], item["revenue"]])
        return response
