# Eleventy Notion Blog

Notion을 CMS로 사용하는 정적 블로그 생성기입니다. Eleventy(11ty)를 기반으로 구축되었으며, 마크다운 변환과 GitHub Actions를 통한 자동 배포를 지원합니다.

## 🚀 제공하는 기능
- **Notion 연동**: Notion 데이터베이스에 글을 작성하면 자동으로 가져와 블로그 포스트로 변환합니다.
- **자동 배포**: GitHub Actions를 통해 코드를 푸시하거나 수동으로 실행하면 자동으로 블로그가 업데이트됩니다.
- **이미지 최적화**: Notion의 이미지를 가져오거나 외부 링크로 처리합니다.
- **커스텀 디자인**: Tailwind CSS를 활용한 깔끔하고 모던한 UI.

## 📝 프로젝트 사용법

### 1. 사전 준비 (Prerequisites)
- [Node.js](https://nodejs.org/) (v18 이상 권장)
- GitHub 계정
- Notion 계정

### 2. 설치 및 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/minmunui/blog.git

# 폴더 이동
cd blog

# 의존성 설치
npm install

# 로컬 서버 실행 (http://localhost:8080)
npm run dev
```

### 3. 환경 변수 설정 (.env)
프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력하세요.

```properties
# Notion 통합 토큰 (Notion Developers에서 생성)
NOTION_TOKEN=secret_your_token_here

# 블로그 글이 저장된 Notion 데이터베이스 ID
NOTION_DATABASE_ID=your_database_id_here
```

### 4. Notion 데이터베이스 구성
연동할 Notion 데이터베이스에는 반드시 다음 속성(Property)들이 포함되어야 합니다. (이름이 정확해야 합니다!)

| 속성명 | 유형(Type) | 설명 |
|---|---|---|
| **이름** | Title | 글 제목으로 사용됩니다. |
| **작성상태** | Status | `작성 완료` 상태인 글만 블로그에 발행됩니다. |
| **연동일시** | Date | 글의 발행 날짜로 사용됩니다. (없으면 생성일시 사용) |
| **요약** | Text | 글 목록에서 보여질 간단한 설명입니다. |
| **태그** | Multi-select | 글의 태그 목록입니다. |
| **카테고리** | Select | 글의 카테고리 분류입니다. |
| **썸네일** | URL | (선택사항) 글 목록에 표시될 대표 이미지 URL입니다. |

### 5. 수동으로 글 가져오기
로컬에서 Notion 글을 테스트로 가져오려면 다음 명령어를 사용하세요:
```bash
npm run notion
```

## 🌐 예시
이 코드로 배포된 실제 블로그는 아래 링크에서 확인할 수 있습니다.
- **URL**: [https://minmunui.github.io/blog](https://minmunui.github.io/blog)
