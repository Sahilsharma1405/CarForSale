from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.RegisterView.as_view(), name='register'),
    path('cars/',views.CarListCreateView.as_view(), name='car-list-create'),
    path('cars/<int:pk>/',views.CarDetailView.as_view(), name='car-detail'),
    path('cars/<int:car_pk>/images/', views.CarImageCreateView.as_view(), name='car-image-create'),
    path('my-cars/', views.UserCarListView.as_view(), name='my-cars'),
    path('contact/',views.ContactFormView.as_view(),name='contact'),
    path('current-user/', views.CurrentUserView.as_view(), name='current-user'),
    path('seller/<str:username>/', views.SellerDetailView.as_view(), name='seller-detail'),
    path('images/<int:pk>/', views.CarImageDeleteView.as_view(), name='car-image-delete'),
    path('predict-price/', views.PricePredictionView.as_view(), name='predict-price'),
    path('featured-cars/', views.FeaturedCarsView.as_view(), name='featured-cars'),
    path('admin/pending-cars/', views.PendingCarsView.as_view(), name='pending-cars'),
    path('admin/approve-car/<int:pk>/', views.approve_car, name='approve-car'),
    path('admin/reject-car/<int:pk>/', views.reject_car, name='reject-car'),
    path('admin/register-staff/', views.StaffRegisterView.as_view(), name='register-staff'),
]