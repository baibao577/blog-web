<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header">Login</div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                {{ isLoading ? "Logging in..." : "Login" }}
              </button>
            </form>
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios";
import eventBus from "@/utils/eventBus";

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await axios.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    const { id, name, access_token } = response.data;

    // Store the token and user info in localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify({ id, name }));

    // Emit login event
    eventBus.emit("login", { id, name });

    // Redirect to home page
    router.push("/");
  } catch (err) {
    error.value = "Invalid username or password";
  } finally {
    isLoading.value = false;
  }
};
</script>
