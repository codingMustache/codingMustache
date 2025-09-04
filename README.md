
Hello there!


{% assign base_year = 2022 %}
{% assign current_year = site.time | date: "%Y" | plus: 0 %}
{% assign diff = current_year | minus: base_year %}

I'm Jorge. 
From: Miami, Fl
Location: San Diego, CA
Exp: {{ diff }} years
