# Eleventy Notion Blog

Notion을 CMS로 사용하는 정적 블로그입니다. Eleventy로 만들어졌으며, Notion에 글을 쓰면 자동으로 블로그에 포스팅됩니다.

## 주요 기능
- Notion 데이터베이스의 글을 자동으로 가져와 마크다운으로 변환합니다.
- GitHub Actions를 통해 글을 가져오고 사이트를 배포하는 과정이 자동화되어 있습니다.
- Tailwind CSS를 사용하여 깔끔하게 디자인했습니다.

## Notion 데이터베이스 설정
블로그와 연동할 Notion 데이터베이스에는 아래 속성들이 포함되어야 합니다. 이름이 다르면 작동하지 않으니 주의해 주세요.

| 속성명 | 유형 | 설명 |
|---|---|---|
| **이름** | Title | 글 제목 |
| **작성상태** | Status | `작성 완료` 상태인 글만 발행됩니다. |
| **연동일시** | Date | 글 발행 날짜 (비어있으면 페이지 생성일 사용) |
| **요약** | Text | 글 목록에 표시될 짧은 설명 |
| **태그** | Multi-select | 태그 목록 |
| **카테고리** | Select | 카테고리 |
| **썸네일** | URL | (선택사항) 글 목록에 표시될 이미지 주소 |

---

## 사용법 1: 로컬에서 실행하기
개발이나 테스트를 위해 내 컴퓨터에서 실행하는 방법입니다.

### 1. 설치
```bash
git clone https://github.com/minmunui/blog.git
cd blog
npm install
```

### 2. 환경변수 설정
프로젝트 최상위 경로에 `.env` 파일을 생성하고 다음 정보를 입력합니다.
- 토큰은 Notion Developers 사이트에서 통합을 생성하여 얻습니다.
- 데이터베이스 ID는 브라우저 주소창이나 페이지 링크 복사를 통해 확인합니다.

```
NOTION_TOKEN=secret_your_token_here
NOTION_DATABASE_ID=your_database_id_here
```

### 3. 실행
```bash
# Notion에서 글 다운로드
npm run notion

# 개발 서버 실행 (http://localhost:8080)
npm run dev
```

---

## 사용법 2: GitHub Actions로 자동 배포하기
GitHub 저장소에 올리고 자동으로 배포되게 하는 방법입니다. 로컬의 `.env` 파일은 보안상 업로드할 수 없으므로, GitHub의 기능을 이용해 환경변수를 등록해야 합니다.

### 1. Secrets 등록
자신의 GitHub 저장소 페이지에서 다음 메뉴로 이동합니다.
1. 상단의 **Settings** 탭 클릭
2. 왼쪽 메뉴의 **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 버튼 클릭

다음 두 가지 변수를 각각 등록해 주세요. 값은 로컬 `.env`에 적었던 것과 동일합니다.
- **Name**: `NOTION_TOKEN` / **Secret**: (토큰 값 붙여넣기)
- **Name**: `NOTION_DATABASE_ID` / **Secret**: (데이터베이스 ID 붙여넣기)

### 2. 배포
- `main` 브랜치에 코드를 푸시하면 자동으로 Actions가 실행되어 블로그가 배포됩니다.
- Notion에 글을 새로 썼다면, GitHub Actions 탭에서 워크플로우를 수동으로 실행하거나 빈 커밋을 푸시하여 갱신할 수 있습니다.

---

## 예시
이 코드로 배포된 실제 블로그는 아래 링크에서 확인할 수 있습니다.
https://minmunui.github.io/blog
