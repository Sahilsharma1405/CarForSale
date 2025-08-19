from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Car(models.Model):
    # Basic info
    seller=models.ForeignKey(User,on_delete=models.CASCADE)
    brand=models.CharField(max_length=50)
    model=models.CharField(max_length=40)
    year=models.IntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    km_driven = models.IntegerField()
    description=models.TextField(blank=True,null=True)
    owner_type = models.CharField(max_length=20, choices=[('1st','1st Owner'),('2nd','2nd Owner'),('3rd','3rd Owner')],default='1st')
    city = models.CharField(max_length=50)
    transmission=models.CharField(
        max_length=20,
        choices=[('Automatic','Automatic'),('Manual','Manual')],
        default='Manual'
    )
    fuel_type = models.CharField(
        max_length=20,
        choices=[('Petrol', 'Petrol'), ('Diesel', 'Diesel'), ('CNG', 'CNG'), ('Electric', 'Electric')],
        default='Petrol'
    )
    body_type=models.CharField(max_length=50)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} {self.model} (ID: {self.id})"
    
class CarImage(models.Model):
    car=models.ForeignKey(Car,related_name='images',on_delete=models.CASCADE)
    image_url=models.ImageField(upload_to='car_images/')

    def __str__(self):
        return f"Images For car ID: {self.car.id}"