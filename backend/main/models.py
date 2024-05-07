from django.db import models

# Create your models here.

class Main(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title

class Children(models.Model):
    name = models.CharField(max_length=60, blank=False, null=False)
    surname = models.CharField(max_length=60, blank=False, null=False )
    dateOfBirth = models.DateField(auto_now_add=False, blank=False, null=False)
    placeOfBirth = models.CharField(max_length=60, blank=False, null=False)
    dateOfAdmission  = models.DateTimeField(auto_now_add=False, blank=False, null=False)
    referralNumber = models.CharField(max_length=60)
    mother = models.CharField(max_length=60, blank=False, null=False)
    father = models.CharField(max_length=60, blank=False, null=False)
    legalGuardian = models.CharField(max_length=60, blank=False, null=False)
    siblings = models.IntegerField(default=0, blank=False, null=False)
    comments = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.name} {self.surname}"