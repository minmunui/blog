---
title: "Tutorials"
layout: single
permalink: /tutorials/
collection: tutorials
entries_layout: grid
classes: wide
---

관리자가 글을 작성할 때, 참고할 만한 레퍼런스들입니다.

{% for tutorial in site.tutorials %}
  <div class="tutorial-item">
    <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
  </div>
{% endfor %}