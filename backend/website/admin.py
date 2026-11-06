from django.contrib import admin

from .models import HeroSettings, OurStorySettings, VisitSettings , TalabatSettings, InstagramSettings

@admin.register(HeroSettings)
class HeroSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "signature_name",
        "signature_label",
        "updated_at",
    )

    readonly_fields = ("updated_at",)

    def has_add_permission(self, request):
        return not HeroSettings.objects.filter(pk=1).exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(OurStorySettings)
class OurStorySettingsAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "updated_at",
    )

    readonly_fields = ("updated_at",)

    fieldsets = (
        (
            "Our Story Content",
            {
                "fields": (
                    "eyebrow",
                    "title",
                    "first_paragraph",
                    "second_paragraph",
                )
            },
        ),
        (
            "Image",
            {
                "fields": (
                    "image",
                )
            },
        ),
        (
            "System",
            {
                "fields": (
                    "updated_at",
                )
            },
        ),
    )

    def has_add_permission(self, request):
        return not OurStorySettings.objects.filter(pk=1).exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(VisitSettings)
class VisitSettingsAdmin(admin.ModelAdmin):
    list_display = ("title", "address", "phone", "updated_at")

    readonly_fields = ("updated_at",)

    fieldsets = (
        (
            "Visit JAZI Content",
            {
                "fields": (
                    "eyebrow",
                    "title",
                    "description",
                    "address",
                )
            },
        ),
        (
            "Opening Hours",
            {
                "fields": (
                    "opening_hours_line_1",
                    "opening_hours_line_2",
                )
            },
        ),
       (
            "Contact & Map",
            {
                "fields": (
                    "phone",
                    "google_maps_url",
                    "latitude",
                    "longitude",
                )
            },
        ),
        (
            "System",
            {
                "fields": ("updated_at",)
            },
        ),
    )

    def has_add_permission(self, request):
        return not VisitSettings.objects.filter(pk=1).exists()

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(TalabatSettings)
class TalabatSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "button_text",
        "updated_at",
    )

    readonly_fields = ("updated_at",)

    fieldsets = (
        (
            "Content",
            {
                "fields": (
                    "eyebrow",
                    "title",
                    "description",
                    "button_text",
                )
            },
        ),
        (
            "Talabat",
            {
                "fields": (
                    "talabat_url",
                    "background_image",
                )
            },
        ),
        (
            "System",
            {
                "fields": ("updated_at",)
            },
        ),
    )

    def has_add_permission(self, request):
        return not TalabatSettings.objects.filter(pk=1).exists()

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(InstagramSettings)
class InstagramSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "updated_at",
    )

    readonly_fields = ("updated_at",)

    fieldsets = (
        (
            "Instagram",
            {
                "fields": (
                    "eyebrow",
                    "username",
                    "instagram_url",
                )
            },
        ),
        (
            "Gallery",
            {
                "fields": (
                    "image_1",
                    "image_2",
                    "image_3",
                    "image_4",
                )
            },
        ),
        (
            "System",
            {
                "fields": ("updated_at",)
            },
        ),
    )

    def has_add_permission(self, request):
        return not InstagramSettings.objects.filter(pk=1).exists()

    def has_delete_permission(self, request, obj=None):
        return False