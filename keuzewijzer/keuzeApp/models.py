from django.db import models

class Semester(models.Model):
     name = models.CharField(max_length=200)
     #x = models.FloatField()                 is this necessary??
     #y = models.FloatField()
     link = models.URLField(blank=True, null=True)
     #is_highlighted = models.BooleanField(default=False)

     def __str__(self):
        return self.name

class Connection(models.Model):
    from_semester = models.ForeignKey(Semester, related_name='from_connections', on_delete=models.CASCADE)
    to_semester = models.ForeignKey(Semester, related_name='to_connections', on_delete=models.CASCADE)

    def __str__(self):
         return f"from {self.from_semester.name} -> to {self.to_semester.name}"