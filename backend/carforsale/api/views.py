from django.shortcuts import render
from .serializers import RegisterSerializer,CarSerializer,CarImageSerializer
from .models import Car,CarImage
from rest_framework import generics,permissions
from rest_framework.parsers import MultiPartParser,FormParser # type: ignore
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
import pandas as pd
import joblib

class RegisterView(generics.CreateAPIView):
    serializer_class=RegisterSerializer

class CarListCreateView(generics.ListCreateAPIView):
    serializer_class=CarSerializer
    # This ensures only logged-in users can create a car listing
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Car.objects.all().order_by('-created_at')
        
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
    
    # This method automatically sets the 'seller' to the currently logged-in user
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

# This view will handle retrieving, updating, or deleting a single car
class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Car.objects.all()
    serializer_class=CarSerializer
    # This ensures only the user who created the listing can edit or delete it
    permission_classes=[IsOwnerOrReadOnly]
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
        # The 'image_url' field will now store the file itself
        serializer.save(car=car, image_url=self.request.data.get('image_url'))

class UserCarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This line filters the cars to only include those where the seller is the current user
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
                # Subject
                f"New Contact Form Message from {name}",
                # Message
                f"From: {email}\n\nMessage:\n{message}",
                # From Email
                'semprojectdemo4@gmail.com',
                # To Email (where you want to receive the message)
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
    serializer_class = RegisterSerializer # Reusing this serializer is fine
    lookup_field = 'username' # Fetch user by username

class CarImageDeleteView(generics.DestroyAPIView):
    queryset = CarImage.objects.all()
    serializer_class = CarImageSerializer
    permission_classes = [IsOwnerOrReadOnly]

    # This method ensures only the owner of the CAR can delete its image
    def get_object(self):
        obj = super().get_object()
        if obj.car.seller != self.request.user:
            raise PermissionDenied("You do not have permission to delete this image.")
        return obj
    
# api/views.py

# api/views.py

class PricePredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            pipeline = joblib.load('price_model.pkl')
        except FileNotFoundError:
            return Response({"error": "Model file not found."}, status=500)

        # The exact features the new model was trained on
        required_features = ['brand', 'model', 'year', 'km_driven', 'transmission', 'owner', 'fuel_type']
        
        input_data = request.data
        
        # Validate that all required features are present
        if not all(feature in input_data for feature in required_features):
            return Response({"error": "Missing one or more required fields."}, status=400)

        # Create a DataFrame from the input
        df_data = {feature: [input_data.get(feature)] for feature in required_features}
        
        try:
            input_df = pd.DataFrame.from_dict(df_data)
            prediction = pipeline.predict(input_df)
            
            return Response({'predicted_price': prediction[0]})
        except Exception as e:
            return Response({"error": f"Error during prediction: {str(e)}"}, status=400)

# api/views.py

# --- ADD THIS NEW VIEW ---
class FeaturedCarsView(generics.ListAPIView):
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny] # Anyone can see featured cars

    def get_queryset(self):
        # This orders all cars by price (highest first) and takes the top 3
        return Car.objects.all().order_by('-price')[:3]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context