function validateISBN(isbn) {
  const regex = /^(97(8|9))?\d{9}(\d|X)$/; // Format ISBN-10 sau ISBN-13
  return regex.test(isbn);
}

module.exports = { validateISBN };
