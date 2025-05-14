<!-- u23629810, Philemon -->
<template>
  <nav class="navbar p-4" :class="{ 'is-dark': isDark }">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="text-xl font-bold">Blog Platform</NuxtLink>
        <div class="hidden sm:flex gap-4">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
          <NuxtLink to="/posts" class="hover:underline">Posts</NuxtLink>
          <NuxtLink to="/search" class="hover:underline">Search</NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <span v-if="isDark">🌞</span>
          <span v-else>🌙</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggleDarkMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
.navbar {
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #0f0937;
}

.navbar.is-dark {
  background-color: #0c0c0c;
  color: white;
}

a.router-link-active {
  font-weight: bold;
}
</style>