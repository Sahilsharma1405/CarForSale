from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Car,CarImage

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True,style={'input_type':'password'})

    class Meta:
        model=User
        fields=('username','password','email')

    def create(self, validated_data):
        user=User.objects.create_user(username=validated_data['username'], email=validated_data['email'],password=validated_data['password'])
        
        return user
    
class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model=CarImage
        fields=['id','image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        # The 'obj.image_url.url' gives the partial path.
        # 'request.build_absolute_uri' prepends the domain (e.g., http://127.0.0.1:8000)
        if request and obj.image_url:
            return request.build_absolute_uri(obj.image_url.url)
        return None

class CarSerializer(serializers.ModelSerializer):
    images=CarImageSerializer(many=True,read_only=True)
    seller=serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model=Car
        fields=[
            'id','seller','brand','model','year','price','km_driven','description','owner_type','city','transmission','fuel_type','body_type','created_at','images'
        ]