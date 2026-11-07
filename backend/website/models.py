from django.db import models


class HeroSettings(models.Model):
    background_image = models.ImageField(
        upload_to="website/hero/",
        blank=True,
        null=True
    )

    description = models.TextField(
        default=(
            "Premium flavours, crafted with quality ingredients. "
            "Order your favourites and pick them up when they’re ready."
        )
    )

    signature_name = models.CharField(
        max_length=100,
        default="Lobster Roll"
    )

    signature_label = models.CharField(
        max_length=100,
        default="SIGNATURE DISH"
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hero Settings"
        verbose_name_plural = "Hero Settings"

    def save(self, *args, **kwargs):
        # Force this model to always use one database row.
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Homepage Hero"

class OurStorySettings(models.Model):
    eyebrow = models.CharField(
        max_length=100,
        default="OUR SOUL AT JAZI"
    )

    title = models.CharField(
        max_length=200,
        default="A Love Letter to the Sea"
    )

    first_paragraph = models.TextField(
        default=(
            "JAZI was born from a simple belief: that the finest "
            "ingredients deserve more than a stage — they deserve "
            "to be part of your everyday moments."
        )
    )

    second_paragraph = models.TextField(
        default=(
            "We bring together the bold flavours of the sea with "
            "the warmth of cafe culture, crafting signature dishes, "
            "refreshing drinks, and indulgent desserts — all made "
            "for takeaway, and all served with heart."
        )
    )

    image = models.ImageField(
        upload_to="website/our-story/",
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Our Story Settings"
        verbose_name_plural = "Our Story Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Our Story"

class VisitSettings(models.Model):
    eyebrow = models.CharField(
        max_length=100,
        default="FIND US"
    )

    title = models.CharField(
        max_length=150,
        default="Visit JAZI"
    )

    description = models.TextField(
        default=(
            "Find us easily and pick up your order. "
            "We're here to serve you with great food and fast service."
        )
    )

    address = models.CharField(
        max_length=255,
        default="Dubai, UAE"
    )

    opening_hours_line_1 = models.CharField(
        max_length=150,
        default="Mon – Fri: 8am – 11pm"
    )

    opening_hours_line_2 = models.CharField(
        max_length=150,
        default="Sat – Sun: 9am – Midnight"
    )

    phone = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    google_maps_url = models.URLField(
        blank=True,
        default=""
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Visit JAZI Settings"
        verbose_name_plural = "Visit JAZI Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Visit JAZI"


class TalabatSettings(models.Model):
    eyebrow = models.CharField(
        max_length=100,
        default="PREFER DELIVERY?"
    )

    title = models.CharField(
        max_length=200,
        default="Order JAZI through Talabat"
    )

    description = models.TextField(
        default=(
            "Get your favourite dishes delivered "
            "to your door via Talabat."
        )
    )

    button_text = models.CharField(
        max_length=100,
        default="Order on Talabat"
    )

    talabat_url = models.URLField(
        default="https://www.talabat.com/uae/jazi-lobster-cafeteria"
    )

    background_image = models.ImageField(
        upload_to="website/talabat/",
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Talabat Section"
        verbose_name_plural = "Talabat Section"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Talabat Section"

class InstagramSettings(models.Model):
    eyebrow = models.CharField(
        max_length=100,
        default="FOLLOW US"
    )

    username = models.CharField(
        max_length=100,
        default="@jazihouse"
    )

    instagram_url = models.URLField(
        default="https://www.instagram.com/jazihouse/"
    )

    image_1 = models.ImageField(
        upload_to="website/instagram/",
        blank=True,
        null=True
    )

    image_2 = models.ImageField(
        upload_to="website/instagram/",
        blank=True,
        null=True
    )

    image_3 = models.ImageField(
        upload_to="website/instagram/",
        blank=True,
        null=True
    )

    image_4 = models.ImageField(
        upload_to="website/instagram/",
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Instagram Section"
        verbose_name_plural = "Instagram Section"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Instagram Section"

class OperationsSettings(models.Model):
    business_name = models.CharField(max_length=120, default="JAZI")
    logo = models.ImageField(upload_to="website/branding/", blank=True, null=True)
    email = models.EmailField(blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    currency = models.CharField(max_length=3, default="AED")
    accepting_orders = models.BooleanField(default=True)
    minimum_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    preparation_minutes = models.PositiveSmallIntegerField(default=20)
    enforce_business_hours = models.BooleanField(default=False)
    temporarily_closed = models.BooleanField(default=False)
    order_sound_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def save(self, *args, **kwargs):
        self.pk = 1
        return super().save(*args, **kwargs)


class BusinessHour(models.Model):
    weekday = models.PositiveSmallIntegerField(unique=True)
    is_open = models.BooleanField(default=True)
    opens_at = models.TimeField(default="09:00")
    closes_at = models.TimeField(default="23:00")

    class Meta:
        ordering = ["weekday"]
