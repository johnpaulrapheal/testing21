from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer, Payment
from rest_framework import status
from .serializers import CustomerSerializer, PaymentSerializer


@api_view(['GET'])
def test_api(request):
    return Response({"message": "API working"})


@api_view(['GET'])
def get_customers(request):
    customers = Customer.objects.all()
    if not customers:
        return Response({"error": "customers not found"}, status=404)
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def make_payment(request):
    account_number = request.data.get("account_number")
    if not account_number:
        return Response({"error": "Account number is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        customer = Customer.objects.get(accountnumber=account_number)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = PaymentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(customer=customer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def payment_history(request, account_number):
    try:
        customer = Customer.objects.get(accountnumber=account_number)
    except Customer.DoesNotExist:
        return Response({"error": "Account not found"}, status=404)
    payments = Payment.objects.filter(customer=customer)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data, status=200)