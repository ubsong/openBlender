# openBlender

새 버전이 나올 때마다 글도 함께 고쳐 쓰는 **블렌더 웹 잡지**예요.
서점 진열대 같은 메인 화면에서 잡지를 고르면, 사이드바 + 본문 스크롤의 문서형 읽기 화면으로 들어가요.

- 프레임워크: [VitePress](https://vitepress.dev) (글 = 마크다운 파일 하나)
- 서재 화면: `.vitepress/theme/components/BookShelf.vue`, 표지: `BookCover.vue`
- DB, 로그인 없음 (1단계는 정적 사이트)

## 실행하기

Node.js 18 이상이 필요해요.

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 배포용 파일 생성 (.vitepress/dist)
npm run preview    # 빌드 결과 미리보기
```

## 폴더 구조

```
openblender/
├─ index.md                  서재(메인). layout: shelf
├─ beginner/                 잡지 한 권 = 폴더 하나
│  ├─ index.md               잡지 소개
│  ├─ 01-start/              묶음(큰 카테고리) = 하위 폴더
│  │  └─ 01-install.md       글 = 마크다운 파일 하나
│  └─ ...
├─ whats-new/                달라진 점 (버전별 릴리스 정리)
├─ public/                   파비콘, 이미지
└─ .vitepress/
   ├─ magazines.ts           잡지 목록, 최신 블렌더 버전 (가장 자주 만지는 파일)
   ├─ sidebar.ts             폴더에서 사이드바 자동 생성
   ├─ config.mts             사이트 설정
   └─ theme/                 화면 컴포넌트와 스타일
```

## 자주 하는 작업

### 글 추가하기
묶음 폴더에 `.md` 파일을 넣으면 사이드바에 자동으로 나타나요. 파일 이름 순서대로 정렬되니 `03-xxx.md`처럼 번호를 붙여 주세요.

글 맨 위에는 이 정보를 꼭 적어 주세요.

```md
---
title: 글 제목
blender: "5.2"          # 이 글을 확인한 블렌더 버전
updated: "2026-10-03"   # 마지막으로 고친 날 (따옴표 필수)
---

# 글 제목
```

### 새 묶음(카테고리) 추가하기
1. 잡지 폴더 안에 하위 폴더를 만들어요. (예: `beginner/05-sculpt/`)
2. `.vitepress/magazines.ts`의 해당 잡지 `sections`에 `{ title: '스컬프트', dir: '05-sculpt' }`를 추가해요.

### 새 잡지(책) 추가하기
1. 프로젝트 맨 위에 폴더를 만들어요. (예: `geometry-nodes/`) 안에 `index.md`와 묶음 폴더를 넣어요.
2. `.vitepress/magazines.ts`의 `magazines` 배열에서 해당 항목의 `status`를 `'soon'` → `'open'`으로 바꾸고 `sections`를 채워요. 새 항목이라면 한 덩어리를 새로 추가해요.

### 새 블렌더 버전이 나왔을 때
1. `.vitepress/magazines.ts`의 `latestBlender`, `latestBlenderLabel`을 새 버전으로 바꿔요.
2. 그러면 이전 버전 기준인 모든 글 맨 위에 "구버전 기준" 안내가 **자동으로** 붙어요.
3. 글을 새 버전에서 확인하고, 고쳤다면 `blender`와 `updated` 값을 새로 적어요. 안내가 사라지고, 서재의 "최근에 고친 글"과 표지의 NEW 표시도 갱신돼요.
4. `whats-new/2026/` 폴더에 새 버전 정리 글을 추가해요.

### "이 글 고치기 제안" 링크 켜기
GitHub에 올린 뒤 `.vitepress/config.mts`의 `repo`에 저장소 주소를 넣으면, 글 아래에 수정 제안 링크가 생겨요. 독자가 PR로 오타나 최신화 제안을 보낼 수 있어요.

## 배포
`npm run build` 결과물(`.vitepress/dist`)은 정적 파일이라서 GitHub Pages, Cloudflare Pages, Netlify 어디든 올릴 수 있어요. 주소에 `.html`이 없는 깨끗한 주소(`cleanUrls`)를 쓰고 있어서, 호스팅이 이를 지원하는지 확인해 주세요. (위 세 곳은 지원해요.)

## 알아 둘 점
- **이름과 상표**: 사이트 이름에 "Blender"가 들어가 있어요. 공개하기 전에 Blender Foundation의 상표 사용 안내를 확인하고, 필요하면 이름을 바꿔 주세요. 서재 하단에 비공식 자료라는 안내를 넣어 두었어요.
- **콘텐츠 출처와 라이선스**: 공식 매뉴얼이나 릴리스 노트를 바탕으로 정리할 때는 각 자료의 라이선스와 출처 표기 조건을 직접 확인하세요. 이 잡지의 글 자체를 어떤 라이선스로 공개할지도 정해서 `LICENSE`에 적어 주세요.
- **글꼴**: Pretendard(본문)와 Noto Serif KR(제목)을 CDN에서 불러와요. 오프라인 환경이면 `.vitepress/config.mts`의 `head`에서 링크를 빼고 `custom.css`의 글꼴 설정을 바꿔 주세요.
