import { AuthService } from '../services/auth-services'; // Corrected file name
// 8. Route Guard (src/router/auth-guard.js)
export const authGuard = (authService) => {
    return (to, from, next) => {
      if (to.meta.requiresAuth && !authService.isAuthenticated()) {
        // Redirect to login page if not authenticated
        next({ name: 'Login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    };
  };
  
