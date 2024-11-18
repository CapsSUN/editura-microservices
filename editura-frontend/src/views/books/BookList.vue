<template>
  <div class="book-list-container">
    <h1>Lista de Cărți</h1>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <ul class="book-list">
      <li v-for="book in books" :key="book._id" class="book-item">
        <h2 @click="goToDetails(book._id)" class="book-title">
          {{ book.title }}
        </h2>
        <p><strong>Gen:</strong> {{ book.genre }}</p>
        <div class="actions">
          <button @click="editBook(book._id)" class="edit-btn">Editează</button>
          <button @click="deleteBook(book._id)" class="delete-btn">
            Șterge
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "BookList",
  data() {
    return {
      books: [],
      errorMessage: "",
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get("/books");
        this.books = response.data?.data || [];
      } catch (error) {
        this.errorMessage = "Eroare la obținerea cărților";
        console.error("Eroare la obținerea cărților:", error.message);
      }
    },
    goToDetails(id) {
      this.$router.push(`/books/${id}`);
    },
    editBook(id) {
      this.$router.push(`/books/edit/${id}`);
    },
    async deleteBook(id) {
      if (confirm("Sigur doriți să ștergeți această carte?")) {
        try {
          await axios.delete(`/books/${id}`);
          this.books = this.books.filter((book) => book._id !== id);
        } catch (error) {
          this.errorMessage = "Eroare la ștergerea cărții";
          console.error("Eroare la ștergerea cărții:", error.message);
        }
      }
    },
  },
  created() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.book-list-container {
  font-family: Arial, sans-serif;
  color: #333;
  margin: 20px auto;
  max-width: 800px;
  padding: 10px;
}

h1 {
  font-size: 2rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-title {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 10px;
  cursor: pointer;
}

.book-title:hover {
  text-decoration: underline;
}

.book-item p {
  font-size: 1rem;
  color: #555;
}

.book-item:hover {
  background-color: #ecf0f1;
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.error {
  text-align: center;
  color: red;
  font-weight: bold;
  margin: 20px 0;
}
</style>
