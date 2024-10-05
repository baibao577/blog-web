<template>
  <div class="container">
    <h1 class="my-4">{{ isNewPost ? "Create New Post" : "Edit Post" }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="post.title"
          required
        />
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <textarea
          class="form-control"
          id="content"
          v-model="post.content"
          rows="10"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select
          class="form-select"
          id="category"
          v-model="post.categoryId"
          required
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select class="form-select" id="status" v-model="post.status" required>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div class="mt-3">
        <button type="submit" class="btn btn-primary">
          {{ isNewPost ? "Create" : "Update" }}
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-secondary ms-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios";

const route = useRoute();
const router = useRouter();

const post = ref({ title: "", content: "", categoryId: null, status: "draft" });
const categories = ref([]);
const isNewPost = computed(() => !route.params.id);

const user = computed(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

const fetchPost = async () => {
  if (!isNewPost.value) {
    try {
      const response = await axios.get(`/posts/${route.params.id}`);
      post.value = {
        ...response.data,
        categoryId: response.data.category.id,
      };
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Failed to fetch the post. Redirecting to home page.");
      router.push({ name: "activity" });
    }
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("/categories", {
      params: {
        limit: 100,
        orderBy: "ASC",
      },
    });
    categories.value = response.data.items;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const handleSubmit = async () => {
  try {
    const postData = {
      title: post.value.title,
      content: post.value.content,
      categoryId: post.value.categoryId,
      status: post.value.status,
    };

    if (isNewPost.value) {
      if (!user.value || !user.value.id) {
        throw new Error("User not logged in or user ID not available");
      }
      postData.authorId = user.value.id;
    }

    let response;
    if (isNewPost.value) {
      response = await axios.post("/posts", postData);
    } else {
      response = await axios.put(`/posts/${route.params.id}`, postData);
    }

    router.push({ name: "post-detail", params: { id: response.data.id } });
  } catch (error) {
    console.error("Error saving post:", error);
    alert("Failed to save the post. Please try again.");
  }
};

const handleCancel = () => {
  if (isNewPost.value) {
    router.push({ name: "activity" });
  } else {
    router.push({ name: "post-detail", params: { id: route.params.id } });
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchPost();
});
</script>
