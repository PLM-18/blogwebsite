<template>
  <nav class="navbar p-4" :class="{ 'is-dark': isDark }">
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold">Blog Platform</NuxtLink>
      <div class="flex items-center">
        <button @click="toggleDarkMode" class="p-2 rounded-full">
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
}

.navbar.is-dark {
  background-color: #222;
  color: white;
}
</style>