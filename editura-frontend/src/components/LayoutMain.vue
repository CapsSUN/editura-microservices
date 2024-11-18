<template>
  <div>
    <header>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/books">Cărți</router-link>
        <router-link to="/authors">Autori</router-link>
        <router-link to="/contracts">Contracte</router-link>
        <router-link to="/reviews">Recenzii</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
/* General header styles */
header {
  background: linear-gradient(90deg, #1e3c72, #2a5298);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Navigation bar styling */
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

/* Navigation links */
nav a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

/* Hover effect for links */
nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Active link styling */
router-link-active {
  background-color: rgba(255, 255, 255, 0.4);
  color: #fff;
  pointer-events: none;
}

/* Main content area */
main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive styles */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 0.5rem;
  }
  nav a {
    font-size: 0.9rem;
    width: 100%;
    text-align: center;
  }
}
</style>
