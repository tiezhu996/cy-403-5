import { createRouter, createWebHistory } from 'vue-router';
import CourseBookPage from '@/pages/CourseBookPage.vue';
import InstructorDashboardPage from '@/pages/InstructorDashboardPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MyBookingsPage from '@/pages/MyBookingsPage.vue';
import WorkshopDetailPage from '@/pages/WorkshopDetailPage.vue';
import WorkshopsPage from '@/pages/WorkshopsPage.vue';
import { useAuthStore } from '@/stores/user';
import { UserRole } from '@/types/enums';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workshops' },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/workshops', component: WorkshopsPage },
    { path: '/workshops/:id', component: WorkshopDetailPage },
    { path: '/courses/:id/book', component: CourseBookPage, meta: { requiresAuth: true } },
    { path: '/my-bookings', component: MyBookingsPage, meta: { requiresAuth: true } },
    {
      path: '/instructor/dashboard',
      component: InstructorDashboardPage,
      meta: { requiresAuth: true, roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.bootstrap();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  const roles = to.meta.roles as UserRole[] | undefined;
  if (roles?.length && !auth.canUse(roles)) {
    return '/workshops';
  }
  return true;
});

export default router;

