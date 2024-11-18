<template>
  <div>
    <h1>Lista de Autori</h1>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <ul>
      <li v-for="author in authors" :key="author._id">
        <h2 @click="goToDetails(author._id)">{{ author.name }}</h2>
        <p>
          <strong>Data nașterii:</strong> {{ formatDate(author.birthDate) }}
        </p>
        <button @click="goToEdit(author._id)">Editează</button>
        <button @click="deleteAuthor(author._id)">Șterge</button>
      </li>
    </ul>
    <button @click="goToAdd">Adaugă un Autor</button>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "AuthorList",
  data() {
    return {
      authors: [],
      errorMessage: "",
    };
  },
  methods: {
    async fetchAuthors() {
      try {
        const response = await axios.get("/authors");
        this.authors = response.data || [];
      } catch (error) {
        this.errorMessage = "Eroare la obținerea autorilor";
        console.error("Eroare la obținerea autorilor:", error.message);
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString();
    },
    goToDetails(id) {
      this.$router.push(`/authors/${id}`);
    },
    goToEdit(id) {
      this.$router.push(`/authors/edit/${id}`);
    },
    goToAdd() {
      this.$router.push(`/authors/add`);
    },
    async deleteAuthor(id) {
      try {
        await axios.delete(`/authors/${id}`);
        this.fetchAuthors();
      } catch (error) {
        this.errorMessage = "Eroare la ștergerea autorului";
        console.error("Eroare la ștergerea autorului:", error.message);
      }
    },
  },
  created() {
    this.fetchAuthors();
  },
};
</script>

<style scoped>
li {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}
li:hover {
  background-color: #f5f5f5;
}
button {
  margin-right: 10px;
}
.error {
  color: red;
  font-weight: bold;
}
</style>
