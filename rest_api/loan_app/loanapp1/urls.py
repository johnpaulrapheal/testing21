from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api),
    path('customers/', views.get_customers),
    path('payments/', views.make_payment),
    path('payments/<str:account_number>/', views.payment_history),
]