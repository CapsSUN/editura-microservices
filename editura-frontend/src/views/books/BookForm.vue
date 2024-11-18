<template>
  <div class="book-form-container">
    <h1>{{ isEditing ? "Editează Carte" : "Adaugă Carte" }}</h1>
    <form @submit.prevent="handleSubmit" class="book-form">
      <label>
        Titlu:
        <input type="text" v-model="form.title" required />
      </label>
      <label>
        Gen:
        <input type="text" v-model="form.genre" required />
      </label>
      <label>
        ISBN:
        <input type="text" v-model="form.isbn" required />
      </label>
      <label>
        Autori:
        <input
          type="text"
          v-model="form.authorsInput"
          placeholder="Adaugă ID-uri separate prin virgulă"
        />
      </label>
      <div class="form-actions">
        <button type="submit" class="submit-btn">
          {{ isEditing ? "Actualizează" : "Adaugă" }}
        </button>
        <button type="button" class="cancel-btn" @click="cancel">
          Anulează
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "BookForm",
  data() {
    return {
      isEditing: false,
      form: {
        title: "",
        genre: "",
        isbn: "",
        authorsInput: "",
      },
    };
  },
  methods: {
    async fetchBookDetails() {
      if (this.isEditing) {
        try {
          const response = await axios.get(`/books/${this.$route.params.id}`);
          const { title, genre, isbn, authors } = response.data;
          this.form = {
            title,
            genre,
            isbn,
            authorsInput: authors.map((a) => a._id).join(", "),
          };
        } catch (error) {
          console.error(
            "Eroare la obținerea detaliilor cărții:",
            error.message
          );
        }
      }
    },
    async handleSubmit() {
      try {
        const payload = {
          ...this.form,
          authors: this.form.authorsInput.split(",").map((id) => id.trim()),
        };
        if (this.isEditing) {
          await axios.put(`/books/${this.$route.params.id}`, payload);
        } else {
          await axios.post("/books", payload);
        }
        this.$router.push("/books");
      } catch (error) {
        console.error(
          `Eroare la ${this.isEditing ? "actualizarea" : "adăugarea"} cărții:`,
          error.message
        );
      }
    },
    cancel() {
      this.$router.push("/books");
    },
  },
  mounted() {
    this.isEditing = !!this.$route.params.id;
    this.fetchBookDetails();
  },
};
</script>

<style scoped>
.book-form-container {
  font-family: Arial, sans-serif;
  margin: 20px auto;
  max-width: 600px;
  background: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.8rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 20px;
}

.book-form label {
  display: block;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
}

.book-form input {
  width: 100%;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  transition: border-color 0.2s;
}

.book-form input:focus {
  border-color: #3498db;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.submit-btn {
  background-color: #3498db;
  color: white;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}
</style>
