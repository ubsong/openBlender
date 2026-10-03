<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import BookCover from './BookCover.vue'
import { magazines, latestBlenderLabel } from '../../magazines'
import { data as articles } from '../recent.data'

// "NEW" 표시는 브라우저에서 오늘 날짜 기준으로 계산해요 (21일 이내에 고친 글이 있으면 NEW)
const NEW_DAYS = 21
const now = ref(0)

onMounted(() => {
  now.value = Date.now()
  document.documentElement.classList.add('ob-shelf-page')
})
onBeforeUnmount(() => document.documentElement.classList.remove('ob-shelf-page'))

function infoOf(id: string) {
  const list = articles.filter((a) => a.mag === id)
  const body = list.filter((a) => !a.isIndex)
  return {
    count: body.length,
    updated: list[0]?.updated // 로더가 최신순으로 정렬해 줘요
  }
}

function isNew(id: string) {
  const u = infoOf(id).updated
  if (!u || !now.value) return false
  return now.value - Date.parse(u) <= NEW_DAYS * 86400000
}

const recent = computed(() => articles.filter((a) => !a.isIndex).slice(0, 6))
const magTitle = (id: string) => magazines.find((m) => m.id === id)?.title ?? ''
const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso)
  )
</script>

<template>
  <div class="shelf-page">
    <header class="head">
      <h1>openBlender</h1>
      <p class="tagline">새 버전이 나올 때마다 글도 함께 고쳐 쓰는 블렌더 웹 잡지</p>
      <p class="latest">지금 최신 블렌더는 {{ latestBlenderLabel }}이에요.</p>
    </header>

    <section class="stage" aria-label="잡지 진열대">
      <div class="floor" aria-hidden="true">
        <div class="grid"></div>
        <div class="axis-x"></div>
      </div>

      <ul class="shelf">
        <li v-for="m in magazines" :key="m.id">
          <BookCover
            :magazine="m"
            :count="infoOf(m.id).count"
            :updated="infoOf(m.id).updated"
            :is-new="isNew(m.id)"
          />
        </li>
      </ul>
    </section>

    <section class="recent" aria-labelledby="recent-h">
      <h2 id="recent-h">최근에 고친 글</h2>
      <ol>
        <li v-for="a in recent" :key="a.url">
          <a :href="withBase(a.url)">{{ a.title }}</a>
          <span class="where">{{ magTitle(a.mag) }}</span>
          <time class="when" :datetime="a.updated">{{ fmt(a.updated) }}</time>
        </li>
      </ol>
    </section>

    <footer class="foot">
      <p>
        openBlender는 개인이 만드는 비공식 학습 자료이며 Blender Foundation과 관계가 없어요.
        Blender는 Blender Foundation의 상표예요.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.shelf-page {
  --grid: rgba(255, 255, 255, 0.07);
  min-height: 100vh;
  padding: 0 24px 56px;
  color: #e9eaec;
  background: linear-gradient(180deg, #3b3c40 0%, #2a2b2e 38%, #1c1d20 100%);
  font-family: var(--ob-sans);
}

.head {
  max-width: 1080px;
  margin: 0 auto;
  padding: 56px 0 8px;
}
.head h1 {
  margin: 0;
  font-family: var(--ob-serif);
  font-weight: 900;
  font-size: clamp(34px, 5vw, 52px);
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.tagline {
  margin: 14px 0 0;
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: #cfd1d5;
  word-break: keep-all;
}
.latest {
  margin: 6px 0 0;
  font-size: 14px;
  color: #ffa028;
}

/* ── 진열대: 블렌더 뷰포트의 바닥 그리드 위에 책이 서 있어요 ── */
.stage {
  position: relative;
  max-width: 1080px;
  margin: 28px auto 0;
  padding: 44px 8px 40px;
  overflow: hidden;
  isolation: isolate;
}
.floor {
  position: absolute;
  inset: 0;
  z-index: -1;
  perspective: 520px;
  perspective-origin: 50% 0%;
  mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 100%);
}
.grid {
  position: absolute;
  left: -20%;
  right: -20%;
  top: 28%;
  bottom: -30%;
  background-image: linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 56px 56px;
  transform-origin: 50% 0%;
  transform: rotateX(58deg);
}
.axis-x {
  position: absolute;
  left: 0;
  right: 0;
  top: 76%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(213, 76, 76, 0.75) 12%, rgba(213, 76, 76, 0.75) 88%, transparent);
}

.shelf {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 44px;
  align-items: end;
}
.shelf li {
  margin: 0;
  padding: 0 4px;
}

/* ── 최근 업데이트 ── */
.recent {
  max-width: 1080px;
  margin: 28px auto 0;
}
.recent h2 {
  margin: 0 0 12px;
  font-family: var(--ob-serif);
  font-size: 22px;
  font-weight: 700;
  border: 0;
  padding: 0;
}
.recent ol {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 720px;
}
.recent li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 18px;
  align-items: baseline;
  padding: 11px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}
.recent a {
  color: #f3f4f6;
  text-decoration: none;
  font-weight: 600;
}
.recent a:hover,
.recent a:focus-visible {
  color: #ffa028;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.where,
.when {
  font-size: 13px;
  color: #9fa1a7;
}

.foot {
  max-width: 1080px;
  margin: 44px auto 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: #84868c;
}
.foot p {
  margin: 0;
  max-width: 560px;
}

@media (max-width: 860px) {
  .shelf {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px 28px;
  }
  .stage {
    padding-top: 36px;
  }
}
@media (max-width: 520px) {
  .shelf-page {
    padding: 0 16px 40px;
  }
  .head {
    padding-top: 36px;
  }
  .recent li {
    grid-template-columns: 1fr auto;
  }
  .where {
    display: none;
  }
}
</style>
