<template>
  <div class="container">
    <h1 class="my-4">Posts in {{ categoryName }}</h1>
    <div class="row">
      <div class="col-md-8">
        <div v-if="isLoading" class="text-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="posts.items.length === 0" class="card">
          <div class="card-body text-center">
            <i class="bi bi-emoji-frown display-1 text-muted mb-3"></i>
            <h2 class="card-title">No Posts Found</h2>
            <p class="card-text">
              There are currently no posts in this category. Check back later or
              explore other categories!
            </p>
          </div>
        </div>
        <div v-else>
          <div v-for="post in posts.items" :key="post.id" class="card mb-4">
            <div class="card-body">
              <h2 class="card-title">
                <router-link
                  :to="{ name: 'post-detail', params: { id: post.id } }"
                >
                  {{ post.title }}
                </router-link>
              </h2>
              <p class="card-text">{{ post.content.substring(0, 100) }}...</p>
              <p class="text-muted">
                By {{ post.author.name }} | {{ formatDate(post.createdAt) }}
              </p>
              <router-link
                :to="{ name: 'post-detail', params: { id: post.id } }"
                class="btn btn-primary"
              >
                Read More
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <nav v-if="posts.totalPages > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage - 1)"
                  >Previous</a
                >
              </li>
              <li
                v-for="page in posts.totalPages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(page)"
                  >{{ page }}</a
                >
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === posts.totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage + 1)"
                  >Next</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Navigation</h5>
            <router-link
              :to="{ name: 'activity' }"
              class="btn btn-secondary w-100 mb-2"
            >
              &larr; Back to All Posts
            </router-link>
            <button
              @click="randomCategory"
              class="btn btn-outline-primary w-100"
            >
              Explore Random Category
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios";

const route = useRoute();
const router = useRouter();
const posts = ref({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 });
const categoryName = ref("");
const currentPage = ref(1);
const isLoading = ref(true);
const categories = ref([]);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/posts", {
      params: {
        categoryId: route.params.id,
        page: currentPage.value,
        limit: posts.value.limit,
        orderBy: "DESC",
      },
    });
    posts.value = response.data;
    if (response.data.items.length > 0) {
      categoryName.value = response.data.items[0].category.name;
    } else {
      await fetchCategoryName();
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCategoryName = async () => {
  try {
    const response = await axios.get(`/categories/${route.params.id}`);
    categoryName.value = response.data.name;
  } catch (error) {
    console.error("Error fetching category name:", error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("/categories");
    categories.value = response.data.items;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const changePage = (page) => {
  if (page >= 1 && page <= posts.value.totalPages) {
    currentPage.value = page;
  }
};

const randomCategory = () => {
  if (categories.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * categories.value.length);
    const randomCategoryId = categories.value[randomIndex].id;
    router.push({ name: "category-posts", params: { id: randomCategoryId } });
  }
};

onMounted(() => {
  fetchPosts();
  fetchCategories();
});

watch(
  () => route.params.id,
  () => {
    currentPage.value = 1;
    fetchPosts();
  }
);

watch(currentPage, () => {
  fetchPosts();
});
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
}

.card-text {
  color: #6c757d;
}

.pagination {
  justify-content: center;
}

.bi-emoji-frown {
  font-size: 4rem;
}
</style>
