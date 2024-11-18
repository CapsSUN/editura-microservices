import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import apiClient from "./plugins/axios";

const app = createApp(App);
app.config.globalProperties.$http = apiClient;
app.use(router).mount("#app");
