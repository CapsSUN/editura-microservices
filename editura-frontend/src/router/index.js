import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/DashboardView.vue";
import Books from "../views/BooksView.vue";
import Contracts from "../views/ContractsView.vue";
import Reviews from "../views/ReviewsView.vue";
import BookList from "../views/books/BookList.vue";
import BookForm from "../views/books/BookForm.vue";
import BookDetails from "../views/books/BookDetails.vue";
import Author from "../views/authors/AuthorList.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/books",
    component: Books,
    children: [
      { path: "", name: "BookList", component: BookList },
      { path: "add", name: "AddBook", component: BookForm },
      { path: "edit/:id", name: "EditBook", component: BookForm },
      { path: ":id", name: "BookDetails", component: BookDetails },
    ],
  },
  {
    path: "/authors",
    name: "Authors",
    component: Author,
  },
  { path: "/contracts", name: "Contracts", component: Contracts },
  { path: "/reviews", name: "Reviews", component: Reviews },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
