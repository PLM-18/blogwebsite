<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <header>
      <nav class="navbar">
        <router-link to="/" class="logo">Blog App</router-link>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
        </div>
        <button @click="toggleDarkMode" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </nav>
    </header>
    <main class="container">
      <router-view />
    </main>
    <footer>
      <p>&copy; {{ new Date().getFullYear() }} Blog App</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isDarkMode: false
    };
  },
  created() {
    // Load theme preference from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Default to user's preference
      this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  color: #212529;
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
  background-color: #212529;
  color: #f8f9fa;
}

.dark-mode a {
  color: #61dafb;
}

.dark-mode .navbar {
  background-color: #343a40;
}

.dark-mode .card {
  background-color: #343a40;
  border-color: #495057;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: inherit;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.container {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

footer {
  padding: 1rem;
  text-align: center;
  background-color: inherit;
  margin-top: auto;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card-meta {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.dark-mode .card-meta {
  color: #adb5bd;
}

.card-content {
  line-height: 1.6;
}

select, button {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

.dark-mode select, .dark-mode button {
  background-color: #343a40;
  color: #f8f9fa;
  border-color: #495057;
}

.filter-container {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>