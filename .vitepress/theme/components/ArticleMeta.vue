<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { latestBlender, latestBlenderLabel } from '../../magazines'

/*
  글 맨 위에 "블렌더 몇 버전 기준인지 / 언제 고쳤는지"를 보여줘요.
  글의 frontmatter 에 아래처럼 적으면 돼요.

    blender: "5.2"          ← 이 글을 확인한 블렌더 버전
    updated: "2026-10-03"   ← 마지막으로 고친 날 (따옴표 필수)
    stale: false            ← (선택) 릴리스 노트처럼 구버전 안내가 필요 없는 글
*/
const { frontmatter } = useData()

const basis = computed(() => frontmatter.value.blender as string | undefined)
const updated = computed(() => frontmatter.value.updated as string | undefined)

function toNums(v: string) {
  return v.split('.').map((n) => parseInt(n, 10) || 0)
}
function isOlder(a: string, b: string) {
  const [a1, a2 = 0] = toNums(a)
  const [b1, b2 = 0] = toNums(b)
  return a1 < b1 || (a1 === b1 && a2 < b2)
}

const isBehind = computed(
  () => !!basis.value && frontmatter.value.stale !== false && isOlder(basis.value, latestBlender)
)

const updatedLabel = computed(() => {
  if (!updated.value) return ''
  const d = new Date(updated.value)
  if (Number.isNaN(d.getTime())) return updated.value
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(d)
})
</script>

<template>
  <div v-if="basis || updated" class="article-meta">
    <p class="line">
      <span v-if="basis" class="ver">블렌더 {{ basis }} 기준</span>
      <span v-if="basis && updated" class="sep" aria-hidden="true"></span>
      <time v-if="updated" :datetime="updated">{{ updatedLabel }} 수정</time>
    </p>

    <aside v-if="isBehind" class="stale" role="note">
      <p>
        이 글은 블렌더 {{ basis }} 기준으로 쓰였어요. 지금 최신은 {{ latestBlenderLabel }}이라서
        메뉴 이름이나 위치가 조금 다를 수 있어요.
        <a :href="withBase('/whats-new/')">달라진 점 보기</a>
      </p>
    </aside>
  </div>
</template>

<style scoped>
.article-meta {
  margin: 0 0 20px;
}
.line {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.ver {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
}
.stale {
  margin-top: 12px;
  padding: 10px 14px;
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 0 6px 6px 0;
}
.stale p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}
</style>
