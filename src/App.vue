<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

onMounted(() => {
  console.log('Vue App mounted')
})
</script>
