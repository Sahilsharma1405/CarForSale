from django.contrib import admin
from .models import Car, CarImage

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1

# This decorator automatically registers the Car model with the custom CarAdmin class below it.
# It's the modern and recommended way to do this.
@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('id', 'model', 'brand', 'year', 'price', 'seller')
    list_filter = ('brand', 'city', 'fuel_type', 'transmission')
    search_fields = ('model', 'brand', 'description')
    inlines = [CarImageInline]
admin.site.register(CarImage)