// app.js

// === Theme Toggle ===
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Change Button Icon Based On Theme
    if (document.body.classList.contains("light-mode")) {
      themeToggle.textContent = "☀️"; // Light Mode Icon
    } else {
      themeToggle.textContent = "🌙"; // Dark Mode Icon
    }
  });
}

// === Favorites (Optional Feature) ===
// We'll store favorites in localStorage
function toggleFavorite(animeId) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favs.includes(animeId)) {
    favs = favs.filter(id => id !== animeId);
  } else {
    favs.push(animeId);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  renderFavorites();
}

function renderFavorites() {
  const favContainer = document.querySelector(".favorites-list");
  if (!favContainer) return;

  favContainer.innerHTML = "";
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favs.length === 0) {
    favContainer.innerHTML = "<p>No Favorites Yet ❤️</p>";
    return;
  }

  favs.forEach(id => {
    const item = document.createElement("div");
    item.className = "fav-item";
    item.textContent = id; // You could make this more detailed
    favContainer.appendChild(item);
  });
}

// Run on page load
renderFavorites();
