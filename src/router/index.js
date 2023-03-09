import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/Monitor",
    },
    {
      path: "/Monitor",
      name: "Monitor",
      component: () => import("@/views/Monitor.vue"),
    },
    {
      path: "/BeMonitored",
      name: "BeMonitored",
      component: () => import("@/views/BeMonitored.vue"),
    },
  ],
});

export default router;
