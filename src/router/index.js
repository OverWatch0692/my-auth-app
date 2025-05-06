import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './auth-guard';

// Import components/views
import LoginForm from '../components/LoginForm.vue';
import UserProfile from '../components/UserProfile.vue';
import Dashboard from '../views/Dashboard.vue'; // Ensure this file exists

export const setupRouter = (authService) => {
  const routes = [
    {
      path: '/',
      redirect: '/dashboard', // Simplified redirect
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginForm,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: UserProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login', // Catch-all fallback
    },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  // Global navigation guard
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !authService.currentUser.value) {
      next({ path: '/login' });
    } else {
      next();
    }
  });

  return router;
};
