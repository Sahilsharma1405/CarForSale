# api/permissions.py
from rest_framework import permissions

from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # This is the important part.
        # We check if the object we're looking at (obj) has a 'seller' attribute.
        # If it does (meaning it's a Car object), we check if the seller is the current user.
        if hasattr(obj, 'seller'):
            return obj.seller == request.user
        
        # If the object doesn't have a 'seller', we check if it has a 'car' attribute.
        # If it does (meaning it's a CarImage object), we check the seller of its parent car.
        if hasattr(obj, 'car'):
            return obj.car.seller == request.user
        
        return False