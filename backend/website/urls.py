from django.urls import path
from .views import HeroSettingsAPIView, OurStorySettingsAPIView , VisitSettingsAPIView , TalabatSettingsAPIView,InstagramSettingsAPIView

from .views import (
    AdminHeroSettingsAPIView,
    AdminOurStorySettingsAPIView,
    AdminVisitSettingsAPIView,
    AdminTalabatSettingsAPIView,
    AdminInstagramSettingsAPIView,
)


urlpatterns = [
    path("hero/", HeroSettingsAPIView.as_view(), name="hero-settings"),
    path("our-story/", OurStorySettingsAPIView.as_view(), name="our-story-settings"),
    path("visit/",VisitSettingsAPIView.as_view(),name="visit-settings"),
    path("talabat/", TalabatSettingsAPIView.as_view(), name="talabat-settings",),
    path("instagram/",InstagramSettingsAPIView.as_view(),name="instagram-settings",),
    
    # ==========================================
    # ADMIN WEBSITE SETTINGS
    # ==========================================

    path(
        "admin/settings/hero/",
        AdminHeroSettingsAPIView.as_view(),
        name="admin-hero-settings",
    ),

    path(
        "admin/settings/our-story/",
        AdminOurStorySettingsAPIView.as_view(),
        name="admin-our-story-settings",
    ),

    path(
        "admin/settings/visit/",
        AdminVisitSettingsAPIView.as_view(),
        name="admin-visit-settings",
    ),

    path(
        "admin/settings/talabat/",
        AdminTalabatSettingsAPIView.as_view(),
        name="admin-talabat-settings",
    ),

    path(
        "admin/settings/instagram/",
        AdminInstagramSettingsAPIView.as_view(),
        name="admin-instagram-settings",
    ),

]
urlpatterns += [
    path("order-availability/", __import__("website.operations_views", fromlist=["PublicOrderAvailability"]).PublicOrderAvailability.as_view()),
    path("admin/settings/operations/", __import__("website.operations_views", fromlist=["AdminOperations"]).AdminOperations.as_view()),
    path("admin/settings/business-hours/", __import__("website.operations_views", fromlist=["AdminBusinessHours"]).AdminBusinessHours.as_view()),
    path("admin/security/password/", __import__("website.operations_views", fromlist=["AdminPasswordChange"]).AdminPasswordChange.as_view()),
    path("admin/security/logout-others/", __import__("website.operations_views", fromlist=["AdminLogoutOtherSessions"]).AdminLogoutOtherSessions.as_view()),
]
