import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
// import { useUserStore } from "../stores/UserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LoginView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

// router.beforeEach(async (to) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ["/"];
//   const authRequired = !publicPages.includes(to.path);
//   const auth = useUserStore();
//   console.log(auth.user);

//   if (authRequired && !auth.isAuthenticated) {
//     auth.returnUrl = to.fullPath;
//     return "/";
//   }
// });

export default router;
