<template>
  <div class="book-details" v-if="book">
    <div class="book-header">
      <h1>{{ book.title }}</h1>
      <p><strong>Gen:</strong> {{ book.genre }}</p>
      <p><strong>ISBN:</strong> {{ book.isbn }}</p>
      <p><strong>Data publicării:</strong> {{ formattedDate }}</p>
    </div>
    <div class="book-authors">
      <h2>Autori</h2>
      <ul>
        <li v-for="author in book.authors" :key="author._id">
          <strong>{{ author.name }}</strong>
          <p>{{ author.bio || "Biografie indisponibilă." }}</p>
        </li>
      </ul>
    </div>
    <div class="book-reviews">
      <h2>Recenzii</h2>
      <ul v-if="book.reviews && book.reviews.length">
        <li v-for="review in book.reviews" :key="review._id">
          <div class="review">
            <strong>{{ review.user }}</strong
            >:
            <span>{{ review.comment }}</span>
            <span class="rating">({{ review.rating }}/5)</span>
          </div>
        </li>
      </ul>
      <p v-else>Nu există recenzii disponibile pentru această carte.</p>
    </div>
  </div>
  <div class="error-message" v-else-if="error">
    <p>{{ error }}</p>
  </div>
  <div class="loading" v-else>
    <p>Se încarcă detaliile cărții...</p>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "BookDetails",
  data() {
    return {
      book: null,
      error: null,
    };
  },
  computed: {
    formattedDate() {
      if (!this.book || !this.book.publishedDate) return "N/A";
      return new Date(this.book.publishedDate).toLocaleDateString();
    },
  },
  async created() {
    const bookId = this.$route.params.id;
    try {
      const response = await axios.get(`/books/${bookId}`);
      this.book = response.data;
    } catch (error) {
      console.error("Eroare la obținerea detaliilor cărții:", error.message);
      this.error = "Eroare la obținerea detaliilor cărții.";
    }
  },
};
</script>

<style scoped>
.book-details {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.book-header h1 {
  font-size: 2rem;
  color: #2c3e50;
}

.book-header p {
  margin: 5px 0;
  font-size: 1rem;
  color: #555;
}

.book-authors,
.book-reviews {
  margin-top: 20px;
}

.book-authors h2,
.book-reviews h2 {
  font-size: 1.5rem;
  color: #2980b9;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

.book-authors ul,
.book-reviews ul {
  list-style-type: none;
  padding: 0;
}

.book-authors li,
.book-reviews li {
  margin: 10px 0;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.review {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review .rating {
  color: #e67e22;
  font-weight: bold;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin: 20px;
}

.loading {
  text-align: center;
  margin: 20px;
  font-style: italic;
}
</style>
