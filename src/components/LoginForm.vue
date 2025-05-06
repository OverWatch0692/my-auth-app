<!-- 5. Login Component (src/components/LoginForm.vue) -->
<template>
  <div class="login-container">
    <div v-if="authService.isLoading.value" class="loading">Loading...</div>
    
    <form @submit.prevent="handleSubmit" v-else>
      <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
      
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          required
          autocomplete="username"
        />
      </div>
      
      <div class="form-group" v-if="!isLogin">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
          autocomplete="email"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required
          autocomplete="current-password"
        />
      </div>
      
      <div v-if="authService.error.value" class="error-message">
        {{ authService.error.value }}
      </div>
      
      <div class="form-actions">
        <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        <button type="button" @click="toggleMode">
          {{ isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const authService = inject('auth');
const router = useRouter();

const isLogin = ref(true);
const form = ref({
  username: '',
  password: '',
  email: ''
});

const handleSubmit = async () => {
  let success;
  
  if (isLogin.value) {
    success = await authService.login(form.value.username, form.value.password);
  } else {
    success = await authService.signup(
      form.value.username, 
      form.value.password, 
      form.value.email
    );
  }
  
  if (success) {
    router.push('/dashboard');
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  authService.error.value = null;
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #f44336;
  margin: 10px 0;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

button[type="button"] {
  background-color: transparent;
  color: #2196f3;
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>`