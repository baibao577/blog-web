<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand" to="/">
            <i class="bi bi-book"></i> My Blog
          </router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link class="nav-link" to="/" active-class="active" exact
                  >Home</router-link
                >
              </li>
              <li v-if="!user" class="nav-item">
                <router-link class="nav-link" to="/login" active-class="active"
                  >Login</router-link
                >
              </li>
              <li v-else class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ user.name }}
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="logout"
                      >Logout</a
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="py-4">
      <router-view></router-view>
    </main>

    <footer class="bg-light text-center text-muted py-3 mt-4">
      <div class="container">
        &copy; {{ new Date().getFullYear() }} My Blog. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import eventBus from "@/utils/eventBus";

const user = ref(null);
const router = useRouter();

const loadUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  user.value = null;
  router.push("/login");
};

const handleLogin = (userData) => {
  user.value = userData;
};

onMounted(() => {
  loadUser();
  eventBus.on("login", handleLogin);
});

onUnmounted(() => {
  eventBus.off("login", handleLogin);
});
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
}

.navbar-brand i {
  margin-right: 0.5rem;
}
</style>
