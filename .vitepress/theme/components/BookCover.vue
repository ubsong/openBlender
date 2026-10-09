<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, withBase } from 'vitepress'
import type { Magazine } from '../../magazines'
import { data as covers } from '../covers.data'

const props = defineProps<{
  magazine: Magazine
  count: number
  updated?: string
  isNew: boolean
}>()

const router = useRouter()
const opening = ref(false)
const isOpen = computed(() => props.magazine.status === 'open')
const href = computed(() => withBase(`/${props.magazine.id}/`))

// public/covers/<id>.webp 같은 이미지가 있으면 이미지 표지, 없으면 코드로 그린 표지.
// 이미지를 못 불러오면(주소가 틀렸을 때 등) 코드 표지로 돌아가요.
const imageFailed = ref(false)
const coverSrc = computed(() => {
  const src = covers[props.magazine.id]
  return src && !imageFailed.value ? withBase(src) : undefined
})

const caption = computed(() => {
  if (!isOpen.value) return '준비 중'
  const parts = [`${props.count}편`]
  if (props.updated) {
    const d = new Date(props.updated)
    parts.push(
      new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(d) +
        ' 업데이트'
    )
  }
  return parts.join(' · ')
})

// 표지가 열리는 모션을 보여준 뒤 이동해요. 모션 줄이기 설정이면 바로 이동.
function onClick(e: MouseEvent) {
  if (!isOpen.value) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  e.preventDefault()
  opening.value = true
  window.setTimeout(() => router.go(`/${props.magazine.id}/`), 520)
}

// 표지 그림용: 원환체(토러스) 고리
const rings = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  const cx = 50 + 30 * Math.cos(a)
  const cy = 52 + 17 * Math.sin(a)
  return { cx, cy, rot: (a * 180) / Math.PI + 90 }
})
</script>

<template>
  <figure class="book-wrap" :class="{ soon: !isOpen }">
    <component
      :is="isOpen ? 'a' : 'div'"
      class="book"
      :class="{ opening }"
      :href="isOpen ? href : undefined"
      :aria-label="isOpen ? `${magazine.title} 읽기` : `${magazine.title} (준비 중)`"
      :style="{
        '--bg': magazine.color,
        '--ink': magazine.ink,
        '--accent': magazine.accent
      }"
      @click="onClick"
    >
      <span class="shadow" aria-hidden="true"></span>

      <span class="body">
        <!-- 책 안쪽: 표지가 열리면 첫 페이지가 보여요 -->
        <span class="pages" aria-hidden="true">
          <span class="first-page">
            <i class="l t"></i><i class="l"></i><i class="l"></i><i class="l s"></i>
            <i class="l g"></i><i class="l"></i><i class="l"></i><i class="l s"></i>
          </span>
        </span>

        <span class="cover">
          <span class="face front" :class="{ 'has-image': coverSrc }">
            <!-- 이미지 표지: 제목까지 이미지에 들어 있어서 글자는 그리지 않아요 -->
            <img
              v-if="coverSrc"
              class="cover-image"
              :src="coverSrc"
              alt=""
              decoding="async"
              draggable="false"
              @error="imageFailed = true"
            />

            <span class="spine" aria-hidden="true"></span>

            <!-- 코드 표지: 이미지가 없을 때 -->
            <template v-if="!coverSrc">
              <svg class="motif" viewBox="0 0 100 100" aria-hidden="true" fill="none"
                stroke="var(--accent)" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
                <template v-if="magazine.motif === 'cube'">
                  <polygon points="50,10 88,32 50,54 12,32" />
                  <polygon points="12,32 50,54 50,96 12,74" />
                  <polygon points="88,32 50,54 50,96 88,74" />
                  <g fill="var(--accent)" stroke="none">
                    <rect x="47.5" y="7.5" width="5" height="5" /><rect x="85.5" y="29.5" width="5" height="5" />
                    <rect x="9.5" y="29.5" width="5" height="5" /><rect x="47.5" y="51.5" width="5" height="5" />
                    <rect x="47.5" y="93.5" width="5" height="5" /><rect x="9.5" y="71.5" width="5" height="5" />
                    <rect x="85.5" y="71.5" width="5" height="5" />
                  </g>
                </template>

                <template v-else-if="magazine.motif === 'sphere'">
                  <circle cx="50" cy="50" r="40" />
                  <ellipse cx="50" cy="50" rx="40" ry="13" />
                  <ellipse cx="50" cy="29" rx="34" ry="9" />
                  <ellipse cx="50" cy="71" rx="34" ry="9" />
                  <ellipse cx="50" cy="50" rx="14" ry="40" />
                  <ellipse cx="50" cy="50" rx="28" ry="40" />
                </template>

                <template v-else-if="magazine.motif === 'grid'">
                  <line v-for="i in 9" :key="'v' + i" :x1="50" :y1="22"
                    :x2="(i - 1) * 12.5" :y2="96" />
                  <line v-for="(y, i) in [34, 46, 60, 76, 96]" :key="'h' + i"
                    :x1="50 - (y - 22) * 0.68" :y1="y" :x2="50 + (y - 22) * 0.68" :y2="y" />
                  <line x1="3" y1="60" x2="97" y2="60" stroke-width="2.4" />
                </template>

                <template v-else>
                  <ellipse cx="50" cy="52" rx="44" ry="28" />
                  <ellipse cx="50" cy="52" rx="16" ry="8" />
                  <ellipse v-for="(r, i) in rings" :key="i" :cx="r.cx" :cy="r.cy" rx="13" ry="5.5"
                    :transform="`rotate(${r.rot} ${r.cx} ${r.cy})`" />
                </template>
              </svg>

              <span class="title">{{ magazine.title }}</span>
              <span class="sub">{{ magazine.subtitle }}</span>
              <span class="foot"><span>openBlender</span><span>{{ magazine.issue }}</span></span>
            </template>

            <span v-if="isNew" class="new">NEW</span>
          </span>
          <span class="face back" aria-hidden="true"></span>
        </span>

        <!-- 블렌더에서 오브젝트를 선택하면 생기는 주황색 외곽선 -->
        <span class="select-outline" aria-hidden="true"></span>
      </span>
    </component>

    <figcaption class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.book-wrap {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.book {
  --w: 100%;
  display: block;
  position: relative;
  width: var(--w);
  aspect-ratio: 2 / 3;
  perspective: 1200px;
  container-type: inline-size;
  color: inherit;
  text-decoration: none;
  outline: none;
}
.soon .book {
  cursor: default;
}
.soon .body {
  filter: saturate(0.55) brightness(0.8);
}

/* ── 바닥에 드리운 그림자 ── */
.shadow {
  position: absolute;
  left: 4%;
  right: -4%;
  bottom: -14px;
  height: 26px;
  background: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) 70%);
  filter: blur(5px);
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.body {
  position: absolute;
  inset: 0;
  display: block;
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* ── 책 안쪽(페이지 더미) ── */
.pages {
  position: absolute;
  inset: 3px -6px 3px 4px;
  display: block;
  border-radius: 1px 4px 4px 1px;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0) 12%),
    repeating-linear-gradient(0deg, #f1efe9 0 2px, #dcd9d0 2px 3px);
}
.first-page {
  position: absolute;
  inset: 0 6px 0 0;
  padding: 14% 12% 0 14%;
  display: flex;
  flex-direction: column;
  gap: 5%;
  background: #f7f6f2;
  border-radius: 1px 3px 3px 1px;
  box-shadow: inset 6px 0 8px -6px rgba(0, 0, 0, 0.35);
}
.first-page .l {
  display: block;
  height: 3.2cqw;
  border-radius: 2px;
  background: #cfccc2;
}
.first-page .l.t {
  height: 6cqw;
  width: 62%;
  background: #8d8a80;
}
.first-page .l.s {
  width: 56%;
}
.first-page .l.g {
  margin-top: 4%;
}

/* ── 표지 ── */
.cover {
  position: absolute;
  inset: 0;
  display: block;
  transform-style: preserve-3d;
  transform-origin: left center;
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.face {
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
  backface-visibility: hidden;
  border-radius: 2px 6px 6px 2px;
}
.front {
  background: var(--bg);
  color: var(--ink);
  padding: 19cqw 10cqw 8cqw 14cqw;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.front.has-image {
  padding: 0;
}
.cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 2:3 비율과 조금 달라도 표지를 꽉 채워요 */
  user-select: none;
}
.back {
  transform: rotateY(180deg);
  background: color-mix(in srgb, var(--bg) 70%, black);
}
.spine {
  position: absolute;
  inset: 0 auto 0 0;
  width: 6.5cqw;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.34),
    rgba(255, 255, 255, 0.14) 55%,
    rgba(0, 0, 0, 0.06)
  );
}

.title {
  position: relative;
  z-index: 1;
  font-family: var(--ob-serif);
  font-weight: 900;
  font-size: 14.5cqw;
  line-height: 1.14;
  letter-spacing: -0.02em;
  word-break: keep-all;
}
.sub {
  position: relative;
  z-index: 1;
  margin-top: 4cqw;
  font-size: 5.4cqw;
  font-weight: 500;
  opacity: 0.86;
}
.motif {
  position: absolute;
  left: 20cqw;
  bottom: 17cqw;
  width: 58cqw;
  height: auto;
}
.foot {
  position: absolute;
  left: 14cqw;
  right: 10cqw;
  bottom: 7cqw;
  display: flex;
  justify-content: space-between;
  font-size: 4.1cqw;
  font-weight: 600;
  opacity: 0.8;
}
.new {
  position: absolute;
  top: 0;
  right: 8cqw;
  padding: 7cqw 3.2cqw 3cqw;
  background: var(--accent);
  color: var(--bg);
  font-size: 4.4cqw;
  font-weight: 800;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%);
}

/* ── 블렌더식 선택 외곽선 ── */
.select-outline {
  position: absolute;
  inset: -4px -8px -4px -4px;
  border: 2px solid #ffa028;
  border-radius: 4px 8px 8px 4px;
  opacity: 0;
  transform: translateZ(0);
  transition: opacity 0.15s ease;
  pointer-events: none;
}

/* ── 마우스를 올리거나 키보드로 이동했을 때 ── */
.book:not(.opening):is(:hover, :focus-visible) .body {
  transform: translateY(-8px);
}
.book:not(.opening):is(:hover, :focus-visible) .cover {
  transform: rotateY(-13deg);
}
.book:not(.opening):is(:hover, :focus-visible) .shadow {
  transform: scaleX(0.9);
  opacity: 0.7;
}
.book:is(:hover, :focus-visible) .select-outline,
.book.opening .select-outline {
  opacity: 1;
}
.soon .book:hover .select-outline {
  opacity: 0;
}
.soon .book:hover .body,
.soon .book:hover .cover,
.soon .book:hover .shadow {
  transform: none;
  opacity: 1;
}

/* ── 클릭하면 표지가 열려요 ── */
.book.opening .body {
  transform: translateY(-8px) scale(1.04);
}
.book.opening .cover {
  transform: rotateY(-118deg);
  transition-duration: 0.5s;
}

.caption {
  margin: 0;
  font-size: 13px;
  color: #a9abb0;
  font-variant-numeric: tabular-nums;
}
.soon .caption {
  color: #7d7f85;
}

@media (prefers-reduced-motion: reduce) {
  .body,
  .cover,
  .shadow,
  .select-outline {
    transition: none;
  }
}
</style>
