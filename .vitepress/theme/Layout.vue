<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import BookShelf from './components/BookShelf.vue'
import ArticleMeta from './components/ArticleMeta.vue'

const { frontmatter } = useData()
</script>

<template>
  <!-- 메인(서재): index.md 의 frontmatter 에 layout: shelf -->
  <BookShelf v-if="frontmatter.layout === 'shelf'" />

  <!-- 그 밖의 모든 페이지: 사이드바 + 본문 문서 화면 -->
  <DefaultTheme.Layout v-else>
    <template #sidebar-nav-before>
      <a class="back-to-shelf" :href="withBase('/')">← 서재로 돌아가기</a>
    </template>
    <template #doc-before>
      <ArticleMeta />
    </template>
  </DefaultTheme.Layout>
</template>
