from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api, name='test-api'),
    path('customers/', views.get_customers, name='customers'),
    path('payments/', views.payments, name='payments'),
    path('payments/<str:account_number>/', views.payment_history, name='payment-history'),
]
