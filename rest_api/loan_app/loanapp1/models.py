from django.db import models

# Create your models here.
from django.db import models


class Customer(models.Model):
    accountnumber = models.IntegerField(unique=True)
    issuedate = models.DateTimeField(auto_now_add=True)
    interestrate = models.DecimalField(max_digits=5, decimal_places=2)
    tenure = models.PositiveIntegerField()
    emidue = models.FloatField()

    def __str__(self):
        return str(self.accountnumber)

class Payment(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"{self.customer.accountnumber} - {self.status}"