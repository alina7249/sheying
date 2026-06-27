<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <Toaster position="top-right" richColors />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

onMounted(() => {
  console.log('Vue App mounted')
})
</script>
