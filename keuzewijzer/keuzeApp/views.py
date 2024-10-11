from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("This is the default index view :)")

'''  
def semestersTest(request):
    semesters = Semester.objects.order_by("name")

    sem_names = [s.name for s in semesters]
    sem_links = [s.link for s in semesters]

    context = {
        'sem_names': sem_names,
        'sem_links': sem_links
    }
    return render(request, "test.html", context)
'''

