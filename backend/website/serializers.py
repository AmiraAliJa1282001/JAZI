from rest_framework import serializers

from .models import HeroSettings, OurStorySettings,VisitSettings, TalabatSettings, InstagramSettings


class HeroSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSettings
        fields = [
            "background_image",
            "description",
            "signature_name",
            "signature_label",
        ]


class OurStorySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OurStorySettings
        fields = [
            "eyebrow",
            "title",
            "first_paragraph",
            "second_paragraph",
            "image",
        ]

class VisitSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitSettings
        fields = [
            "eyebrow",
            "title",
            "description",
            "address",
            "opening_hours_line_1",
            "opening_hours_line_2",
            "phone",
            "google_maps_url",
            "latitude",
            "longitude",
        ]

class TalabatSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TalabatSettings

        fields = [
            "eyebrow",
            "title",
            "description",
            "button_text",
            "talabat_url",
            "background_image",
        ]

class InstagramSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramSettings

        fields = [
            "eyebrow",
            "username",
            "instagram_url",
            "image_1",
            "image_2",
            "image_3",
            "image_4",
        ]