from django.shortcuts import render
from .serializers import RegisterSerializer,CarSerializer,CarImageSerializer
from .models import Car,CarImage
from rest_framework import generics,permissions,status
from rest_framework.parsers import MultiPartParser,FormParser # type: ignore
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
import pandas as pd
import joblib
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

class RegisterView(generics.CreateAPIView):
    serializer_class=RegisterSerializer

class CarListCreateView(generics.ListCreateAPIView):
    serializer_class=CarSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Car.objects.filter(status='Approved').order_by('-created_at')
        
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)
        brand = self.request.query_params.get('brand')
        if brand:
            queryset = queryset.filter(brand__iexact=brand)
        model = self.request.query_params.get('model')
        if model:
            queryset = queryset.filter(model__icontains=model)
        transmission = self.request.query_params.get('transmission')
        if transmission:
            queryset = queryset.filter(transmission__iexact=transmission)
        fuel_type = self.request.query_params.get('fuel_type')
        if fuel_type:
            queryset = queryset.filter(fuel_type__iexact=fuel_type)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_update(self, serializer):
        instance = self.get_object()
        was_approved = instance.status == 'Approved'
        serializer.save()
        if was_approved:
            instance.refresh_from_db()
            instance.status = 'Pending'
            instance.save()
            
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    

class CarImageCreateView(generics.CreateAPIView):
    queryset = CarImage.objects.all()
    serializer_class=CarImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] 

    def perform_create(self, serializer):
        car = Car.objects.get(pk=self.kwargs['car_pk'])
        serializer.save(car=car, image_url=self.request.data.get('image_url'))

class UserCarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Car.objects.filter(seller=self.request.user).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
class ContactFormView(APIView):
    permission_classes=[permissions.AllowAny]
    
    def post(self,request,*args,**kwargs):
        name=request.data.get('name')
        email=request.data.get('email')
        message=request.data.get('message')

        if not name or not email or not message:
            return Response({"error": "All fields are required."}, status=400)
        
        try:
            send_mail(
                # Subject  Message
                f"New Contact Form Message from {name}",
                # From Email
                f"From: {email}\n\nMessage:\n{message}",
                # To Email (where you want to receive the message)
                'semprojectdemo4@gmail.com',
                ['semprojectdemo4@example.com'],
                fail_silently=False,
            )
            return Response({"success": "Message sent successfully!"})
        except Exception as e:
            return Response({"error": f"An error occurred: {e}"}, status=500)
        

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = RegisterSerializer(request.user)
        return Response(serializer.data)
    
class SellerDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    lookup_field = 'username'

class CarImageDeleteView(generics.DestroyAPIView):
    queryset = CarImage.objects.all()
    serializer_class = CarImageSerializer
    permission_classes = [IsOwnerOrReadOnly]

    
    def get_object(self):
        obj = super().get_object()
        if obj.car.seller != self.request.user:
            raise PermissionDenied("You do not have permission to delete this image.")
        return obj
    
class PricePredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            pipeline = joblib.load('price_model.pkl')
        except FileNotFoundError:
            return Response({"error": "Model file not found."}, status=500)

        required_features = ['brand', 'model', 'year', 'km_driven', 'transmission', 'owner', 'fuel_type']
        
        input_data = request.data
        

        if not all(feature in input_data for feature in required_features):
            return Response({"error": "Missing one or more required fields."}, status=400)


        df_data = {feature: [input_data.get(feature)] for feature in required_features}
        
        try:
            input_df = pd.DataFrame.from_dict(df_data)
            prediction = pipeline.predict(input_df)
            
            return Response({'predicted_price': prediction[0]})
        except Exception as e:
            return Response({"error": f"Error during prediction: {str(e)}"}, status=400)


class FeaturedCarsView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Car.objects.filter(status='Approved').order_by('-price')[:3]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    

class PendingCarsView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Car.objects.filter(status='Pending').order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}

# This view handles approving a car.
@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_car(request, pk):
    try:
        car = Car.objects.get(pk=pk)
        car.status = 'Approved'
        
        car.save(update_fields=['status'])
        
        serializer = CarSerializer(car, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Car.DoesNotExist:
        return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'error': f"An unexpected error occurred: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_car(request, pk):
    try:
        car = Car.objects.get(pk=pk)
        car.status = 'Rejected'
        car.save(update_fields=['status'])
        
        serializer = CarSerializer(car, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Car.DoesNotExist:
        return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {'error': f"An unexpected error occurred: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
class StaffRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(is_staff=True)