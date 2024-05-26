from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from .models import Announcement
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import RegistrationForm, AnnouncementForm, UpdateAnnouncementForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseNotAllowed, HttpResponse
import json
from .models import UserProfile
from django.core.serializers import serialize

def get_user_announcement_list_by_id(request, id):
    user_announcements = Announcement.objects.filter(user_profile__id=id)
    serialized_announcements = serialize('json', user_announcements)
    return JsonResponse({'status': 'success', 'data': serialized_announcements})

@login_required
def get_user_announcement_list(request):
    user_announcements = Announcement.objects.filter(user_profile=request.user)
    return render(request, 'announcement/list_of_user_announcements.html', {'announcements': user_announcements})


def get_public_announcements(request):
    # Фільтруємо анонси за полем access
    announcements = Announcement.objects.filter(access='public')
    return render(request, 'announcement/list_of_public_announcements.html', {'announcements': announcements})

@login_required
def get_local_announcements(request):
    location = request.user.location
    # Fetch local announcements for the user's location
    announcements = Announcement.objects.filter(access='local', location__iexact=location)

    return render(request, 'announcement/list_of_local_announcements.html', {'announcements': announcements, 'location': location})
  

def get_announcement_by_id(request, id):
    announcement = Announcement.objects.get(id=id)
    # Перевіряємо доступ до анонсу
    serialized_announcement = serialize('json', [announcement])

    return JsonResponse({'status': 'success', 'data': serialized_announcement})

def create_announcement(request):

    if request.method == 'POST':
        data = json.loads(request.body)

        subject = data.get('subject')
        title = data.get('title')
        content = data.get('content')
        access = data.get('access')
        user_id = data.get('user_id')
        user = UserProfile.objects.get(pk=13)


        if request.user.is_authenticated:
            user_location = request.user.location
        else:
            user_location = None
        data1 = Announcement.objects.create(subject=subject,title=title,content=content,access=access,location=user_location, user_profile = user )
        data1.save()
        return JsonResponse({'status': 'success'})
    else:
        form = AnnouncementForm()

    return render(request, 'announcement/create_announcement.html', {'form': form})


def update_announcement(request, id):
    announcement = get_object_or_404(Announcement, id=id)
    print("here")

    if request.method == 'PUT':
        data = json.loads(request.body)
        print("here")
        subject = data.get('subject')
        title = data.get('title')
        content = data.get('content')
        access = data.get('access')

        # Update the fields if they are provided in the request
        if subject is not None:
            announcement.subject = subject
        if title is not None:
            announcement.title = title
        if content is not None:
            announcement.content = content
        if access is not None:
            announcement.access = access

        # Save the updated announcement
        announcement.save()
        return JsonResponse({'status': 'success'})
    else:
        form = UpdateAnnouncementForm(instance=announcement)

    return render(request, 'announcement/update_announcement.html', {'form': form, 'announcement': announcement})
    
def delete_announcement(request, id):
    announcement = get_object_or_404(Announcement, id=id)
    announcement.delete()
    return JsonResponse({'status': 'success'})


def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        password1 = data.get('password1')
        password2 = data.get('password2')
        location = data.get('location')
        username = data.get('username')

        if password1 != password2:
            return JsonResponse({'success': False, 'message': 'Passwords do not match'}, status=400)

        if UserProfile.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username is already taken'}, status=400)
        
        user = UserProfile.objects.create_user(username=username,password=password1, location=location)
        user.save()

        return JsonResponse({'status': 'success'})
    else:
        form = RegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username', '')
        password = data.get('password', '')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success', "user_id": user.id})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})


def home(request):
    return render(request, 'home.html')


def user_logout(request):
    logout(request)
    return redirect('home')  # Замініть 'home' на шлях, куди ви хочете перенаправити після виходу
