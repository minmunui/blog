---
layout: layouts/post.njk
title: "About Me"
date: 2025-01-01
description: "Developer, Designer, and Creator."
image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000"
visible: true
---

## 📬 Contact

- **Email**: ehdwls1638@gmail.com
- **GitHub**: [https://www.github.com/minmunui](https://github.com/minmunui)


## 🛠 Skills

- **Frontend**: React, Vue, Next.js, Tailwind CSS
- **Backend**: Django, FastAPI

## ⏳ Timeline

<div class="not-prose mt-8 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/30 before:to-transparent">

  <!-- Item 1: 효성중공업 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/hyosung.jpeg' | url }}" alt="Hyosung Logo" class="w-full h-full object-contain">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="flex items-center gap-2 font-bold text-lg">
          효성중공업 산학과제
        </div>
        <time class="font-mono text-sm text-muted-foreground">2024.12 - 2025.06</time>
      </div>
      <div class="text-sm text-muted-foreground mb-2">유지보수 전략수립 최적화 알고리즘 고도화</div>
      <p class="text-sm mb-2">변압기 수명모델을 기반으로 최소비용, 최대성과를 달성하는 유지보수 전략 프로그램 개발.</p>
      <ul class="list-disc list-outside ml-4 text-xs text-muted-foreground space-y-1">
        <li>최적화 문제 모델링 및 UI 구성 및 개발.</li>
        <li>섭동분석 도입 및 통계적 이론 기반 강건성 모델 제안 및 개발.</li>
        <li>사용자에게 최적의 유지보수 비용을 제안하고 목표 민감도 달성 지원.</li>
      </ul>
    </div>
  </div>

  <!-- Item 2: 삼성중공업 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/samsung.svg' | url }}" alt="Samsung Logo" class="w-full h-full object-contain p-2">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="flex items-center gap-2 font-bold text-lg">
          삼성중공업 산학과제
        </div>
        <time class="font-mono text-sm text-muted-foreground">2024.05 - 2024.11</time>
      </div>
      <div class="text-sm text-muted-foreground mb-2">드론을 활용한 대용량 비정형 데이터 전송 기술 개발</div>
      <p class="text-sm mb-2">DJI 드론 촬영 이미지를 안드로이드 단말기를 통해 네트워크로 전송, 이미지들을 정합하여 통합 뷰 생성 및 조회 시스템 개발 납품.</p>
       <ul class="list-disc list-outside ml-4 text-xs text-muted-foreground space-y-1">
        <li>DJI SDK 기반 안드로이드 이미지 전송 앱 개발.</li>
        <li><a href="https://opendronemap.org/" class="font-medium underline underline-offset-2 decoration-primary/50 hover:decoration-primary">OpenDroneMap (ODM)</a> 기반 이미지 정합 파이프라인 개발.</li>
        <li>웹 기반 데이터 처리 상태 확인용 UI 개발.</li>
      </ul>
    </div>
  </div>

  <!-- Item 3: 부산대 석사 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/pusan_univ.png' | url }}" alt="PNU Logo" class="w-full h-full object-cover">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="flex items-center gap-2 font-bold text-lg">
          부산대학교 석사
        </div>
        <time class="font-mono text-sm text-muted-foreground">2024.03 - 2026.02</time>
      </div>
      <div class="text-sm text-muted-foreground mb-2">정보융합공학과 AI전공</div>
      <p class="text-sm">인공지능 심화 연구 및 산학 프로젝트 진행.</p>
      <p class="text-sm">졸업논문 : "드론 기반 광역 모니터링 지연 시간 최소화를 위한 효율적 데이터 전송 프로토콜 및 선택적 이미지 정합 기법 연구"</p>
    </div>
  </div>

  <!-- Item 4: 코드플레이스 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/pusan_univ.png' | url }}" alt="PNU Logo" class="w-full h-full object-cover">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="font-bold text-lg"><a href="https://code.pusan.ac.kr/" class="hover:underline">부산대 코드플레이스</a></div>
        <time class="font-mono text-sm text-muted-foreground">2023.04 - 2025.02</time>
      </div>
       <div class="text-sm text-muted-foreground mb-2">부산대학교 소프트웨어융합교육원</div>
      <p class="text-sm">오픈소스 <a href="https://github.com/QingdaoU/OnlineJudge" class="font-medium underline underline-offset-2 decoration-primary/50 hover:decoration-primary">Online Judge</a> 기반 코딩 교육 플랫폼 개발.</p>
      <ul class="list-disc list-outside ml-4 text-xs text-muted-foreground space-y-1">
        <li>사용자 페이지 프론트엔드 기능 구현 및 UI 기획/개발.</li>
        <li>부산대학교 소프트웨어융합교육원 요구사항 구현.</li>
      </ul>
    </div>
  </div>

  <!-- Item 5: 카카오 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-[#FAE100] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/kakao.png' | url }}" alt="Kakao Logo" class="w-full h-full object-contain p-2">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="flex items-center gap-2 font-bold text-lg">
          카카오 테크 캠퍼스 1기 프론트앤드 과정
        </div>
        <time class="font-mono text-sm text-muted-foreground">2023.04</time>
      </div>
       <div class="text-sm text-muted-foreground mb-2">산학협력 부트캠프</div>
      <p class="text-sm">웹 개발 심화 과정 수료 및 팀 프로젝트 수행.</p>
    </div>
  </div>

  <!-- Item 6: 부산대 학사 -->
  <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
     <div class="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden">
       <img src="{{ '/assets/infologo/pusan_univ.png' | url }}" alt="PNU Logo" class="w-full h-full object-cover">
    </div>
    <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex items-center justify-between space-x-2 mb-1">
        <div class="flex items-center gap-2 font-bold text-lg">
          부산대학교 학사
        </div>
        <time class="font-mono text-sm text-muted-foreground">2018.03 - 2024.02</time>
      </div>
       <div class="text-sm text-muted-foreground mb-2">전기컴퓨터공학부 정보컴퓨터공학전공</div>
      <p class="text-sm">컴퓨터 공학 기초 및 심화 지식 습득.</p>
    </div>
  </div>

</div>

