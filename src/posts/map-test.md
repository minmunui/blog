---
title: "미디어 임베딩 테스트 (Map & YouTube)"
date: 2026-01-01T17:05:00.000Z
description: "마크다운 파일 내에 지도와 유튜브 영상을 넣는 방법입니다."
tags: ["guide", "embed"]
visible: true
layout: layouts/post.njk
---

Eleventy 설정에 `html: true`가 되어 있어, `<iframe>` 태그를 자유롭게 사용할 수 있습니다.

## 1. 유튜브 영상 (YouTube)

유튜브 영상의 **공유 -> 퍼가기 (Embed)** 버튼을 눌러 나오는 코드를 복사해서 붙여넣으세요.
반응형으로 꽉 차게 보이려면 `aspect-video`와 `w-full` 클래스로 감싸주면 완벽합니다.

<div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg my-8">
  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=abcdefg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

---

## 2. 구글 지도 (Google Maps)

<div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg my-4">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.272195971661!2d129.0817023!3d35.1795543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ecbd27a92c01%3A0xe53c07e0573752e2!2z67aA7IKw5rSR7Jet7IqkIOyLnOyLJTsrI!5e0!3m2!1sko!2skr!4v1704100000000!5m2!1sko!2skr" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
