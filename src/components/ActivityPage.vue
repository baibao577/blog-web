<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center my-4">
      <h1>Latest Posts</h1>
      <router-link
        v-if="user"
        :to="{ name: 'edit-post' }"
        class="btn btn-primary"
        >Add New Post</router-link
      >
    </div>
    <div class="row">
      <div class="col-lg-9 col-md-8">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="post in posts.items" :key="post.id" class="col">
            <div
              class="card h-100"
              :class="{ 'border-primary': isOwnPost(post) }"
            >
              <div class="card-body d-flex flex-column">
                <h2 class="card-title h5">
                  <router-link
                    :to="{ name: 'post-detail', params: { id: post.id } }"
                  >
                    {{ post.title }}
                  </router-link>
                </h2>
                <p class="card-text flex-grow-1">
                  {{ post.content.substring(0, 100) }}...
                </p>
                <div class="mt-auto">
                  <p class="text-muted small mb-2">
                    By {{ post.author.name }} | {{ formatDate(post.createdAt) }}
                  </p>
                  <p class="mb-2">
                    <span class="badge bg-secondary">{{
                      post.category.name
                    }}</span>
                    <span v-if="isOwnPost(post)" class="badge bg-primary ms-1"
                      >Your Post</span
                    >
                  </p>
                  <router-link
                    :to="{ name: 'post-detail', params: { id: post.id } }"
                    class="btn btn-sm btn-primary"
                  >
                    Read More
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav v-if="posts.totalPages > 1" class="mt-4">
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
              v-for="page in paginationRange"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{
                page
              }}</a>
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
      <div class="col-lg-3 col-md-4">
        <div class="card category-sidebar">
          <div class="card-header">Categories</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="category in categories"
              :key="category.id"
              class="list-group-item"
            >
              <router-link
                :to="{ name: 'category-posts', params: { id: category.id } }"
              >
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// The script section remains largely unchanged
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios";

const route = useRoute();
const router = useRouter();

const posts = ref({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 });
const categories = ref([]);
const currentPage = ref(parseInt(route.query.page) || 1);

const user = computed(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

const paginationRange = computed(() => {
  const range = [];
  const totalPages = posts.value.totalPages;
  const currentPageVal = currentPage.value;

  for (
    let i = Math.max(1, currentPageVal - 2);
    i <= Math.min(totalPages, currentPageVal + 2);
    i++
  ) {
    range.push(i);
  }

  return range;
});

const fetchPosts = async () => {
  try {
    const response = await axios.get("/posts", {
      params: {
        page: currentPage.value,
        limit: posts.value.limit,
        orderBy: "DESC",
      },
    });
    posts.value = response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
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
    router.push({ query: { ...route.query, page } });
  }
};

const isOwnPost = (post) => {
  return user.value && post.author.id === user.value.id;
};

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = parseInt(newPage) || 1;
    fetchPosts();
  },
  { immediate: true }
);

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.card-title a {
  color: inherit;
  text-decoration: none;
}

.card-title a:hover {
  text-decoration: underline;
}

.category-sidebar .list-group-item {
  padding: 0.5rem 1rem;
}

.category-sidebar a {
  color: inherit;
  text-decoration: none;
  display: block;
}

.category-sidebar a:hover {
  text-decoration: underline;
}

.border-primary {
  border-width: 2px !important;
}
</style>
