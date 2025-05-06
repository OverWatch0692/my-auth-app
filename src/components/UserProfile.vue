<template>
  <div class="profile">
    <h2>User Profile</h2>
    <div v-if="authService.currentUser.value">
      <div class="profile-info">
        <p><strong>Username:</strong> {{ authService.currentUser.value.username }}</p>
        <p v-if="authService.currentUser.value.email">
          <strong>Email:</strong> {{ authService.currentUser.value.email }}
        </p>
      </div>
      <LogoutButton />
    </div>
    <div v-else>
      <p>You are not logged in.</p>
      <router-link to="/login">Go to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import LogoutButton from './LogoutButton.vue';

const authService = inject('auth');
</script>

<style scoped>
.profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-bottom: 20px;
}
</style>