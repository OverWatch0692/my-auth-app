<template>
    <button @click="handleLogout" :disabled="isLoggingOut">
      {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
    </button>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';
  
  const authService = inject('auth');
  const router = useRouter();
  const isLoggingOut = ref(false);
  
  const handleLogout = async () => {
    isLoggingOut.value = true;
    await authService.logout();
    isLoggingOut.value = false;
    router.push('/login');
  };
  </script>
  
  <style scoped>
  button {
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>