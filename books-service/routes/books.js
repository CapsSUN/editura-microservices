// // routes/books.js
// const express = require("express");
// const router = express.Router();
// const Book = require("../models/Book");
// const axios = require("axios");

// // const AUTHORS_API_URL =
// //   process.env.AUTHORS_API_URL || "http://localhost:5000/api/authors";

// // GET: Căutare avansată
// router.get("/search", async (req, res) => {
//   const { title, genre, author, startDate, endDate } = req.query;
//   const filters = {};

//   if (title) filters.title = { $regex: title, $options: "i" };
//   if (genre) filters.genre = genre;
//   if (author) filters.authors = author;
//   if (startDate || endDate) {
//     filters.publishedDate = {};
//     if (startDate) filters.publishedDate.$gte = new Date(startDate);
//     if (endDate) filters.publishedDate.$lte = new Date(endDate);
//   }

//   try {
//     const books = await Book.find(filters).populate("authors");
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la căutarea cărților" });
//   }
// });

// // GET: Obține toate cărțile cu paginare
// router.get("/", async (req, res) => {
//   const { page = 1, limit = 5 } = req.query; // Setează valori implicite pentru pagină și limită
//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   if (
//     isNaN(pageNumber) ||
//     isNaN(limitNumber) ||
//     pageNumber <= 0 ||
//     limitNumber <= 0
//   ) {
//     return res.status(400).json({
//       error: "Parametrii paginii și limitei trebuie să fie numere pozitive.",
//     });
//   }

//   try {
//     // Calculează datele pentru paginare
//     const books = await Book.find()
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber);

//     const totalBooks = await Book.countDocuments(); // Numărul total de cărți

//     // Returnează datele paginării
//     res.json({
//       data: books,
//       totalPages: Math.ceil(totalBooks / limitNumber),
//       currentPage: pageNumber,
//       totalBooks,
//     });
//   } catch (error) {
//     console.error("Eroare la obținerea cărților cu paginare:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea cărților" });
//   }
// });

// // Obține toate cărțile cu detaliile autorilor// GET /api/books - Obține toate cărțile
// // router.get("/", async (req, res) => {
// //   try {
// //     const books = await Book.find(); // Afișează toate cărțile
// //     res.json(books);
// //   } catch (error) {
// //     console.error("Eroare la obținerea cărților:", error.message);
// //     res.status(500).json({ error: "Eroare la obținerea cărților" });
// //   }
// // });

// // Creează o nouă carte
// // router.post("/", async (req, res) => {
// //   try {
// //     const { title, authors, genre, isbn, publishedDate } = req.body;
// //     const book = new Book({ title, authors, genre, isbn, publishedDate });
// //     await book.save();
// //     res.status(201).json(book);
// //   } catch (error) {
// //     console.error("Eroare la crearea cărții:", error.message);
// //     res.status(500).json({ error: "Eroare la crearea cărții" });
// //   }
// // });

// // POST: Creează o carte nouă
// router.post("/", async (req, res) => {
//   const { title, authors, genre, isbn, publishedDate } = req.body;

//   try {
//     // Validează autorii prin API Gateway
//     const invalidAuthors = [];
//     for (const authorId of authors) {
//       try {
//         await axios.get(`${AUTHORS_API_URL}/${authorId}`); // API Gateway validează autorul
//       } catch (error) {
//         invalidAuthors.push(authorId);
//       }
//     }

//     if (invalidAuthors.length > 0) {
//       return res.status(400).json({
//         error: "Următorii autori nu sunt validați:",
//         invalidAuthors,
//       });
//     }

//     // Creează cartea
//     const book = new Book({ title, authors, genre, isbn, publishedDate });
//     await book.save();

//     res.status(201).json({ message: "Cartea a fost adăugată cu succes", book });
//   } catch (error) {
//     console.error("Eroare la adăugarea cărții:", error.message);
//     res.status(500).json({ error: "Eroare la adăugarea cărții" });
//   }
// });

// // GET /api/books/:id - Obține o carte după ID
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const book = await Book.findById(req.params.id);
// //     if (!book)
// //       return res.status(404).json({ error: "Cartea nu a fost găsită" });
// //     res.json(book);
// //   } catch (error) {
// //     console.error("Eroare la obținerea cărții:", error.message);
// //     res.status(500).json({ error: "Eroare la obținerea cărții" });
// //   }
// // });

// // router.get("/:id", async (req, res) => {
// //   try {
// //     // Găsește cartea și populate pentru recenzii (reviews este local)
// //     const book = await Book.findById(req.params.id).populate("reviews");

// //     if (!book) {
// //       return res.status(404).json({ error: "Cartea nu a fost găsită" });
// //     }

// //     // Obține detalii despre autori folosind API-ul autorilor
// //     const authorIds = book.authors;
// //     const authorDetails = await Promise.all(
// //       authorIds.map(async (authorId) => {
// //         const response = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
// //         return response.data; // Returnează detaliile autorului
// //       })
// //     );

// //     // Returnează toate datele împreună
// //     res.json({
// //       ...book.toObject(), // Convertește documentul Mongoose în obiect simplu
// //       authors: authorDetails, // Include detalii complete despre autori
// //     });
// //   } catch (error) {
// //     console.error("Eroare la obținerea detaliilor cărții:", error.message);
// //     res.status(500).json({ error: "Eroare la obținerea detaliilor cărții" });
// //   }
// // });

// // GET: Obține detaliile unei cărți, inclusiv autorii și recenziile
// router.get("/:id", async (req, res) => {
//   try {
//     const bookId = req.params.id;

//     // Verifică dacă ID-ul este prezent
//     if (!bookId) {
//       return res.status(400).json({ error: "ID-ul cărții este necesar" });
//     }

//     // Găsește cartea în baza de date și populate pentru recenzii
//     const book = await Book.findById(bookId).populate("reviews");

//     if (!book) {
//       return res.status(404).json({ error: "Cartea nu a fost găsită" });
//     }

//     // Obține detalii despre autori prin API Gateway
//     const authorDetails = await Promise.all(
//       book.authors.map(async (authorId) => {
//         try {
//           const response = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
//           return response.data;
//         } catch (error) {
//           console.error(
//             `Eroare la obținerea detaliilor autorului ${authorId}:`,
//             error.message
//           );
//           return { error: `Detalii indisponibile pentru autorul ${authorId}` };
//         }
//       })
//     );

//     res.json({
//       ...book.toObject(), // Conversie la obiect pentru a adăuga date
//       authors: authorDetails, // Include detalii complete despre autori
//     });
//   } catch (error) {
//     console.error("Eroare la obținerea detaliilor cărții:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea detaliilor cărții" });
//   }
// });

// // PUT /api/books/:id - Actualizează o carte după ID
// router.put("/:id", async (req, res) => {
//   try {
//     const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!book)
//       return res.status(404).json({ error: "Cartea nu a fost găsită" });
//     res.json(book);
//   } catch (error) {
//     console.error("Eroare la actualizarea cărții:", error.message);
//     res.status(500).json({ error: "Eroare la actualizarea cărții" });
//   }
// });

// // DELETE /api/books/:id - Șterge o carte după ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
//     if (!book)
//       return res.status(404).json({ error: "Cartea nu a fost găsită" });
//     res.json({ message: "Cartea a fost ștearsă cu succes" });
//   } catch (error) {
//     console.error("Eroare la ștergerea cărții:", error.message);
//     res.status(500).json({ error: "Eroare la ștergerea cărții" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const axios = require("axios");

const AUTHORS_API_URL =
  process.env.AUTHORS_API_URL || "http://localhost:5000/api/authors";

// *** ROUTE: Căutare avansată ***
router.get("/search", async (req, res) => {
  const { title, genre, author, startDate, endDate } = req.query;
  const filters = {};

  if (title) filters.title = { $regex: title, $options: "i" };
  if (genre) filters.genre = genre;
  if (author) filters.authors = author;
  if (startDate || endDate) {
    filters.publishedDate = {};
    if (startDate) filters.publishedDate.$gte = new Date(startDate);
    if (endDate) filters.publishedDate.$lte = new Date(endDate);
  }

  try {
    const books = await Book.find(filters).populate("authors");
    res.json(books);
  } catch (error) {
    console.error("Eroare la căutarea cărților:", error.message);
    res.status(500).json({ error: "Eroare la căutarea cărților" });
  }
});

// *** ROUTE: Obține toate cărțile cu paginare ***
router.get("/", async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalBooks = await Book.countDocuments();

    res.json({
      data: books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: Number(page),
      totalBooks,
    });
  } catch (error) {
    console.error("Eroare la obținerea cărților:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărților" });
  }
});

// *** ROUTE: Creează o nouă carte ***
router.post("/", async (req, res) => {
  const { title, authors, genre, isbn, publishedDate } = req.body;

  try {
    // Validarea autorilor prin API Gateway
    for (const authorId of authors) {
      const authorResponse = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
      if (!authorResponse.data) {
        return res
          .status(400)
          .json({ error: `Autorul cu ID ${authorId} nu există.` });
      }
    }

    const book = new Book({ title, authors, genre, isbn, publishedDate });
    await book.save();
    res.status(201).json({ message: "Cartea a fost adăugată cu succes", book });
  } catch (error) {
    console.error("Eroare la adăugarea cărții:", error.message);
    res.status(500).json({ error: "Eroare la adăugarea cărții" });
  }
});

// *** ROUTE: Obține detaliile unei cărți ***
router.get("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    if (!bookId) {
      return res.status(400).json({ error: "ID-ul cărții este necesar." });
    }

    const book = await Book.findById(bookId).populate("reviews");
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }

    const authorDetails = await Promise.all(
      book.authors.map(async (authorId) => {
        try {
          const response = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
          return response.data;
        } catch (error) {
          console.error(
            `Eroare la obținerea detaliilor autorului ${authorId}:`,
            error.message
          );
          return { error: `Detalii indisponibile pentru autorul ${authorId}` };
        }
      })
    );

    res.json({
      ...book.toObject(),
      authors: authorDetails,
    });
  } catch (error) {
    console.error("Eroare la obținerea detaliilor cărții:", error.message);
    res.status(500).json({ error: "Eroare la obținerea detaliilor cărții." });
  }
});

// *** ROUTE: Actualizează o carte ***
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }
    res.json(book);
  } catch (error) {
    console.error("Eroare la actualizarea cărții:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea cărții." });
  }
});

// *** ROUTE: Șterge o carte ***
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }
    res.json({ message: "Cartea a fost ștearsă cu succes." });
  } catch (error) {
    console.error("Eroare la ștergerea cărții:", error.message);
    res.status(500).json({ error: "Eroare la ștergerea cărții." });
  }
});

module.exports = router;
