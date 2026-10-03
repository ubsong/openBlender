// ─────────────────────────────────────────────────────────────
// 잡지(책) 목록 — 서재 화면과 사이드바가 모두 이 파일을 읽어요.
// 새 잡지를 추가하려면: 1) 아래 배열에 한 항목 추가  2) 같은 이름의 폴더 만들기
// 새 글을 추가하려면:   해당 섹션 폴더에 .md 파일만 넣으면 사이드바에 자동으로 나타나요.
// ─────────────────────────────────────────────────────────────

/** 지금 최신 블렌더 버전. 새 버전이 나오면 여기만 고치면
 *  그보다 낮은 버전 기준 글에 "구버전 기준" 안내가 자동으로 붙어요. */
export const latestBlender = '5.2'
export const latestBlenderLabel = '5.2 LTS'

export interface Section {
  title: string
  /** 잡지 폴더 안의 하위 폴더 이름 */
  dir: string
  /** 'desc'면 파일명 역순(최신 글이 위로). 기본은 'asc' */
  order?: 'asc' | 'desc'
}

export interface Magazine {
  /** 폴더 이름이자 주소(/beginner/) */
  id: string
  title: string
  subtitle: string
  /** 표지 아래쪽에 찍히는 문구 */
  issue: string
  /** open = 읽을 수 있음, soon = 준비 중(서재에 진열만) */
  status: 'open' | 'soon'
  /** 표지 그림 */
  motif: 'cube' | 'sphere' | 'grid' | 'torus'
  color: string // 표지 바탕
  ink: string // 표지 글자
  accent: string // 표지 그림/강조
  sections: Section[]
}

export const magazines: Magazine[] = [
  {
    id: 'beginner',
    title: '블렌더 입문',
    subtitle: '처음 켜서 첫 렌더까지',
    issue: '5.2 기준',
    status: 'open',
    motif: 'cube',
    color: '#27598c',
    ink: '#f3f7fb',
    accent: '#f5792a',
    sections: [
      { title: '시작하기', dir: '01-start' },
      { title: '모델링', dir: '02-model' },
      { title: '재질과 렌더', dir: '03-look' },
      { title: '움직이기', dir: '04-motion' }
    ]
  },
  {
    id: 'whats-new',
    title: '달라진 점',
    subtitle: '새 버전이 나올 때마다',
    issue: '릴리스 노트',
    status: 'open',
    motif: 'grid',
    color: '#f5792a',
    ink: '#1d1d1f',
    accent: '#1d1d1f',
    sections: [{ title: '2026년', dir: '2026', order: 'desc' }]
  },
  {
    id: 'geometry-nodes',
    title: '지오메트리 노드',
    subtitle: '노드로 모양 만들기',
    issue: '준비 중',
    status: 'soon',
    motif: 'torus',
    color: '#1f6f5c',
    ink: '#eaf6f1',
    accent: '#ffd36b',
    sections: []
  },
  {
    id: 'character',
    title: '캐릭터 모델링',
    subtitle: '얼굴부터 손까지',
    issue: '준비 중',
    status: 'soon',
    motif: 'sphere',
    color: '#6d3a5c',
    ink: '#f9eef4',
    accent: '#8fd3c4',
    sections: []
  }
]
