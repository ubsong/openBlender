import { defineConfig } from 'vitepress'
import { magazines } from './magazines'
import { buildSidebar } from './sidebar'

// GitHub에 올린 뒤 저장소 주소를 넣으면 글 아래에 "이 글 고치기 제안" 링크가 생겨요.
// 예: 'https://github.com/내아이디/openblender'
const repo = ''

export default defineConfig({
  lang: 'ko-KR',
  title: 'openBlender',
  description: '새 버전이 나올 때마다 글도 함께 고쳐 쓰는 블렌더 웹 잡지',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
      }
    ]
  ],

  themeConfig: {
    nav: [
      { text: '서재', link: '/' },
      ...magazines
        .filter((m) => m.status === 'open')
        .map((m) => ({ text: m.title, link: `/${m.id}/`, activeMatch: `/${m.id}/` }))
    ],

    sidebar: buildSidebar(),

    outline: { level: [2, 3], label: '이 글의 목차' },
    docFooter: { prev: '이전 글', next: '다음 글' },
    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '목차',
    darkModeSwitchLabel: '화면 모드',
    lightModeSwitchTitle: '밝은 화면으로',
    darkModeSwitchTitle: '어두운 화면으로',
    skipToContentLabel: '본문으로 건너뛰기',

    editLink: repo
      ? { pattern: `${repo}/edit/main/:path`, text: '이 글 고치기 제안하기' }
      : undefined,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '검색', buttonAriaLabel: '검색' },
          modal: {
            displayDetails: '자세히 보기',
            resetButtonTitle: '지우기',
            backButtonTitle: '닫기',
            noResultsText: '찾는 글이 없어요',
            footer: {
              selectText: '선택',
              selectKeyAriaLabel: '엔터',
              navigateText: '이동',
              navigateUpKeyAriaLabel: '위쪽 화살표',
              navigateDownKeyAriaLabel: '아래쪽 화살표',
              closeText: '닫기',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    }
  }
})
