// public/covers/ 에 "잡지 id" 이름의 이미지가 있으면 그 이미지를 표지로 써요.
// 예: public/covers/beginner.webp → 블렌더 입문 표지
// 없으면 magazines.ts 의 색/그림으로 코드가 표지를 그려요.
// (개발 서버에서는 파일을 넣거나 지우면 바로 반영돼요)
import path from 'node:path'
import { defineLoader } from 'vitepress'

const EXTS = ['webp', 'avif', 'jpg', 'jpeg', 'png']

/** 잡지 id → 표지 이미지 주소 (예: { beginner: '/covers/beginner.webp' }) */
export type Covers = Record<string, string>

declare const data: Covers
export { data }

export default defineLoader({
  watch: [`../../public/covers/*.{${EXTS.join(',')}}`],
  load(files: string[]): Covers {
    const covers: Covers = {}
    for (const file of files) {
      const ext = path.extname(file).slice(1).toLowerCase()
      const id = path.basename(file, path.extname(file))
      // 같은 id 로 여러 형식이 있으면 EXTS 순서(webp 우선)대로 골라요
      const prev = covers[id] && path.extname(covers[id]).slice(1)
      if (!prev || EXTS.indexOf(ext) < EXTS.indexOf(prev)) {
        covers[id] = `/covers/${path.basename(file)}`
      }
    }
    return covers
  }
})
