<template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {{ authService.currentUser.value?.username }}!</p>
      
      <div class="dashboard-actions">
        <router-link to="/profile">View Profile</router-link>
        <LogoutButton />
      </div>
    </div>
  </template>
  
  <script setup>
  import { inject } from 'vue';
  import LogoutButton from '../components/LogoutButton.vue';
  
  const authService = inject('auth');
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .dashboard-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
  
  a {
    padding: 8px 16px;
    background-color: #2196f3;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  </style>