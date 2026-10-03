// 폴더 구조에서 사이드바를 자동으로 만들어요. (Node에서만 실행: config에서만 import)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { magazines } from './magazines'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** 글 제목: frontmatter의 title → 첫 번째 # 제목 → 파일 이름 순서로 찾아요 */
function readTitle(file: string): string {
  const text = fs.readFileSync(file, 'utf-8')
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const t = fm?.[1].match(/^title:\s*["']?(.+?)["']?\s*$/m)
  if (t) return t[1]
  const h1 = text.match(/^#\s+(.+)$/m)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

function listArticles(
  magId: string,
  dir: string,
  order: 'asc' | 'desc' = 'asc'
): DefaultTheme.SidebarItem[] {
  const abs = path.join(root, magId, dir)
  if (!fs.existsSync(abs)) return []
  const names = fs
    .readdirSync(abs)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  if (order === 'desc') names.reverse()
  return names.map((f) => ({
    text: readTitle(path.join(abs, f)),
    link: `/${magId}/${dir}/${f.replace(/\.md$/, '')}`
  }))
}

export function buildSidebar(): DefaultTheme.SidebarMulti {
  const sidebar: DefaultTheme.SidebarMulti = {}
  for (const m of magazines) {
    if (m.status !== 'open') continue
    sidebar[`/${m.id}/`] = [
      { text: `${m.title} 소개`, link: `/${m.id}/` },
      ...m.sections.map((s) => ({
        text: s.title,
        collapsed: true, // 접어두되, 지금 읽는 글이 속한 묶음은 자동으로 펼쳐져요
        items: listArticles(m.id, s.dir, s.order)
      }))
    ]
  }
  return sidebar
}
