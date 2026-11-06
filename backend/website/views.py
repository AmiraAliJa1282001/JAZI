from rest_framework.generics import RetrieveAPIView

from .models import HeroSettings, OurStorySettings, VisitSettings, TalabatSettings,InstagramSettings
from .serializers import (
    HeroSettingsSerializer,
    OurStorySettingsSerializer,
    VisitSettingsSerializer,
    TalabatSettingsSerializer,
    InstagramSettingsSerializer
)


from rest_framework.generics import RetrieveUpdateAPIView
from accounts.permissions import IsAdmin

class HeroSettingsAPIView(RetrieveAPIView):
    serializer_class = HeroSettingsSerializer

    def get_object(self):
        return HeroSettings.load()


class OurStorySettingsAPIView(RetrieveAPIView):
    serializer_class = OurStorySettingsSerializer

    def get_object(self):
        return OurStorySettings.load()

class VisitSettingsAPIView(RetrieveAPIView):
    serializer_class = VisitSettingsSerializer

    def get_object(self):
        return VisitSettings.load()

class TalabatSettingsAPIView(RetrieveAPIView):
    serializer_class = TalabatSettingsSerializer

    def get_object(self):
        return TalabatSettings.load()

class InstagramSettingsAPIView(RetrieveAPIView):
    serializer_class = InstagramSettingsSerializer

    def get_object(self):
        return InstagramSettings.load()


# ==========================================
# ADMIN WEBSITE SETTINGS
# ==========================================

class AdminHeroSettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = HeroSettingsSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return HeroSettings.load()


class AdminOurStorySettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = OurStorySettingsSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return OurStorySettings.load()


class AdminVisitSettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = VisitSettingsSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return VisitSettings.load()


class AdminTalabatSettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = TalabatSettingsSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return TalabatSettings.load()


class AdminInstagramSettingsAPIView(RetrieveUpdateAPIView):
    serializer_class = InstagramSettingsSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return InstagramSettings.load()
