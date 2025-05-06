<template>
  <div class="app">
    <header>
      <h1>Vue Auth App</h1>
      <nav v-if="authService && authService.currentUser?.value">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/profile">Profile</router-link>
        <LogoutButton />
      </nav>
      <div v-else class="loading-message">
        <p>Loading or not authenticated...</p>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import LogoutButton from './components/LogoutButton.vue';

// Safely inject the auth service
const authService = inject('auth');
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

nav {
  display: flex;
  gap: 15px;
}

main {
  padding: 20px 0;
}

.loading-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #555;
}
</style>
