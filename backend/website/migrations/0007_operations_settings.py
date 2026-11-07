from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [("website", "0006_instagramsettings")]
    operations = [
        migrations.CreateModel(name="OperationsSettings", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("business_name", models.CharField(default="JAZI", max_length=120)),
            ("logo", models.ImageField(blank=True, null=True, upload_to="website/branding/")),
            ("email", models.EmailField(blank=True, max_length=254)),
            ("whatsapp", models.CharField(blank=True, max_length=30)),
            ("currency", models.CharField(default="AED", max_length=3)),
            ("accepting_orders", models.BooleanField(default=True)),
            ("minimum_order", models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ("preparation_minutes", models.PositiveSmallIntegerField(default=20)),
            ("enforce_business_hours", models.BooleanField(default=False)),
            ("temporarily_closed", models.BooleanField(default=False)),
            ("order_sound_enabled", models.BooleanField(default=True)),
            ("updated_at", models.DateTimeField(auto_now=True)),
        ]),
        migrations.CreateModel(name="BusinessHour", fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("weekday", models.PositiveSmallIntegerField(unique=True)),
            ("is_open", models.BooleanField(default=True)),
            ("opens_at", models.TimeField(default="09:00")),
            ("closes_at", models.TimeField(default="23:00")),
        ], options={"ordering": ["weekday"]}),
    ]
