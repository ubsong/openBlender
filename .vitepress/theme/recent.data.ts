// 빌드할 때 모든 글의 제목/수정일을 모아서 서재 화면에 넘겨줘요.
import { createContentLoader } from 'vitepress'
import { magazines } from '../magazines'

export interface ArticleInfo {
  url: string
  mag: string
  title: string
  updated: string
  blender?: string
  isIndex: boolean
}

declare const data: ArticleInfo[]
export { data }

export default createContentLoader(
  magazines.filter((m) => m.status === 'open').map((m) => `${m.id}/**/*.md`),
  {
    transform(raw): ArticleInfo[] {
      return raw
        .filter((p) => p.frontmatter.updated)
        .map((p) => ({
          url: p.url,
          mag: p.url.split('/').filter(Boolean)[0],
          title: String(p.frontmatter.title ?? ''),
          updated: String(p.frontmatter.updated),
          blender: p.frontmatter.blender ? String(p.frontmatter.blender) : undefined,
          isIndex: p.url.endsWith('/')
        }))
        .sort((a, b) => b.updated.localeCompare(a.updated))
    }
  }
)
