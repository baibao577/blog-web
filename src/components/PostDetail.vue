<template>
  <div class="container" v-if="post">
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <article class="blog-post">
          <h1 class="blog-post-title my-4">{{ post.title }}</h1>
          <p class="blog-post-meta text-muted">
            {{ formatDate(post.createdAt) }} by {{ post.author.name }} |
            Category:
            <span class="badge bg-secondary">{{ post.category.name }}</span>
            <span v-if="isOwnPost" class="float-end">
              <button
                @click="editPost"
                class="btn btn-sm btn-outline-primary me-2"
              >
                Edit
              </button>
              <button @click="deletePost" class="btn btn-sm btn-outline-danger">
                Delete
              </button>
            </span>
          </p>
          <div class="blog-post-content" v-html="post.content"></div>
        </article>

        <div class="mt-5">
          <router-link :to="{ name: 'activity' }" class="btn btn-secondary">
            &larr; Back to Posts
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mt-5 text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios";

const route = useRoute();
const router = useRouter();
const post = ref(null);

const user = computed(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

const isOwnPost = computed(() => {
  return user.value && post.value && user.value.id === post.value.author.id;
});

const fetchPost = async () => {
  try {
    const response = await axios.get(`/posts/${route.params.id}`);
    post.value = response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("Failed to fetch the post. Redirecting to home page.");
    router.push({ name: "activity" });
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const editPost = () => {
  router.push({ name: "edit-post", params: { id: post.value.id } });
};

const deletePost = async () => {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      await axios.delete(`/posts/${post.value.id}`);
      router.push({ name: "activity" });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.blog-post-content {
  margin-top: 20px;
}

.badge {
  font-size: 0.9em;
}
</style>
