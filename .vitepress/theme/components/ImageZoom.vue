<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/*
  글 안의 이미지를 클릭하면 모달로 크게 보여줘요.
  링크로 감싼 이미지(<a><img></a>)는 링크가 우선이라 건드리지 않아요.
  닫기: 아무 곳이나 클릭, Esc, 닫기 버튼
*/
const dialog = ref<HTMLDialogElement>()
const src = ref('')
const alt = ref('')
const caption = ref('')

const SELECTOR = '.vp-doc img:not(a img)'

function open(img: HTMLImageElement) {
  src.value = img.currentSrc || img.src
  alt.value = img.alt
  caption.value = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim() ?? ''
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function onClick(e: MouseEvent) {
  const img = (e.target as Element).closest?.(SELECTOR)
  if (img instanceof HTMLImageElement) open(img)
}

// 키보드로도 열 수 있게: 이미지에 Tab으로 이동한 뒤 Enter 또는 Space
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const img = e.target
  if (img instanceof HTMLImageElement && img.matches(SELECTOR)) {
    e.preventDefault()
    open(img)
  }
}

function markImages() {
  document.querySelectorAll<HTMLImageElement>(SELECTOR).forEach((img) => {
    img.tabIndex = 0
    img.setAttribute('role', 'button')
    img.setAttribute('aria-haspopup', 'dialog')
  })
}

const route = useRoute()
watch(
  () => route.path,
  () => nextTick(markImages)
)

onMounted(() => {
  markImages()
  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <dialog ref="dialog" class="ob-zoom" aria-label="이미지 크게 보기" @click="close">
    <figure>
      <img :src="src" :alt="alt" />
      <figcaption v-if="caption">{{ caption }}</figcaption>
    </figure>
    <button class="close" type="button" aria-label="닫기" @click="close">✕</button>
  </dialog>
</template>

<style scoped>
.ob-zoom {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 24px;
  border: 0;
  background: transparent;
  cursor: zoom-out;
}
.ob-zoom[open] {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ob-zoom-in 0.2s ease-out;
}
.ob-zoom::backdrop {
  background: rgba(10, 10, 12, 0.93);
}

figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 100%;
  max-height: 100%;
}
img {
  display: block;
  max-width: min(100%, 1600px);
  max-height: calc(100vh - 120px);
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
figcaption {
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: #d4d5d8;
  text-align: center;
  word-break: keep-all;
}

.close {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  transition: background 0.15s ease;
}
.close:hover,
.close:focus-visible {
  background: rgba(255, 255, 255, 0.24);
}

@keyframes ob-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ob-zoom[open] {
    animation: none;
  }
}
</style>
