from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Car,CarImage

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True,style={'input_type':'password'})

    class Meta:
        model=User
        fields=('username','password','email','is_staff')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        
        return user
    
class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model=CarImage
        fields=['id','image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if request and obj.image_url:
            return request.build_absolute_uri(obj.image_url.url)
        return None

class CarSerializer(serializers.ModelSerializer):
    images=CarImageSerializer(many=True,read_only=True)
    seller=serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model=Car
        fields=[
            'id','seller','brand','model','year','price','km_driven','description','owner_type','city','transmission','fuel_type','body_type','created_at','images','status'
        ]