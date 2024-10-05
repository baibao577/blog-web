import { createRouter, createWebHistory } from "vue-router";
import ActivityPage from "../components/ActivityPage.vue";
import PostDetail from "../components/PostDetail.vue";
import CategoryPosts from "../components/CategoryPosts.vue";
import LoginPage from "../components/LoginPage.vue";
import EditPost from "../components/EditPost.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "activity",
      component: ActivityPage,
    },
    {
      path: "/post/:id",
      name: "post-detail",
      component: PostDetail,
    },
    {
      path: "/category/:id",
      name: "category-posts",
      component: CategoryPosts,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/post/edit/:id?",
      name: "edit-post",
      component: EditPost,
    },
  ],
});

export default router;
