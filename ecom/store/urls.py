from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),       # Home page
    path("about/", views.about, name="about"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),  # 👈 fixed here
    path("register/", views.register_user, name="register"),
    path("product/<int:pk>", views.product, name="product"),

]
