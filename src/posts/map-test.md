---
title: "지도 임베딩 테스트 (Google & Naver)"
date: 2026-01-01T17:00:00.000Z
description: "마크다운 파일 내에 구글 지도와 네이버 지도를 넣는 방법입니다."
tags: ["guide", "maps"]
visible: true
layout: layouts/post.njk
---

네, **HTML 태그 사용**이 허용되어 있기 때문에 `<iframe>` 태그를 사용하여 지도를 쉽게 넣을 수 있습니다!

## 1. 구글 지도 (Google Maps)

구글 지도에서 **공유 -> 지도 퍼가기 (Embed a map)** 를 클릭하여 나오는 `<iframe>` 코드를 그대로 붙여넣으면 됩니다.

<div class="aspect-video w-full rounded-xl overflow-hidden shadow-lg my-4">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.272195971661!2d129.0817023!3d35.1795543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ecbd27a92c01%3A0xe53c07e0573752e2!2z67aA7IKw5rSR7Jet7IqkIOyLnOyLJTsrI!5e0!3m2!1sko!2skr!4v1704100000000!5m2!1sko!2skr" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>

---

## 2. 네이버 지도 (Naver Map)

네이버 지도는 PC 웹에서 **공유 > HTML 태그 복사** 기능을 통해 넣을 수 있습니다.
(다만 네이버 지도는 보통 스크립트 방식이나 특정 사이즈 고정 방식을 사용하므로, 반응형을 위해 스타일을 조금 조절해야 할 수도 있습니다.)

*예시 (SmartEditor 2.0 등 지원 종료로 인해, 네이버는 보통 정적인 이미지나 링크를 권장하며 동적 지도는 API 키가 필요한 경우가 많습니다. 가장 쉬운 방법은 구글 지도처럼 iframe을 지원하는 '네이버 지도 URL'을 찾는 것입니다.)*

만약 단순한 iframe 공유가 어렵다면, 아래처럼 **카카오맵**이나 **구글 지도**를 사용하는 것이 해외/국내 호환성 면에서 더 편리할 수 있습니다.

---

### 팁: 반응형으로 만들기
지도가 모바일에서도 잘 보이게 하려면, `width="100%"`를 주거나, `aspect-video` 같은 Tailwind 클래스로 감싸주면 좋습니다.

```html
<div class="aspect-video w-full">
  <iframe ... width="100%" height="100%"></iframe>
</div>
```
