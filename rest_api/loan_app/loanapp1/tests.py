from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Customer, Payment


class LoanApiTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            accountnumber=1001,
            interestrate="7.50",
            tenure=12,
            emidue=1000.0,
        )
        self.payments_url = reverse("payments")

    def test_health_endpoint(self):
        response = self.client.get(reverse("test-api"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "API working")

    def test_get_customers(self):
        response = self.client.get(reverse("customers"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["accountnumber"], 1001)

    def test_create_payment(self):
        payload = {
            "account_number": 1001,
            "amount": "1000.00",
            "status": "PAID",
        }
        response = self.client.post(self.payments_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payment.objects.count(), 1)
        self.assertEqual(response.data["status"], "PAID")

    def test_list_payments(self):
        Payment.objects.create(customer=self.customer, amount="1000.00", status="PAID")
        response = self.client.get(self.payments_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
