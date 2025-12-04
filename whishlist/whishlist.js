document.addEventListener("DOMContentLoaded", () => {
  const wishlistGrid = document.getElementById("wishlistGrid");
  const emptyMsg = document.getElementById("emptyMsg");

  // Wishlist data localStorage se lao
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  wishlist.forEach(place => {
    const card = document.createElement("div");
    card.className = "wishlist-card";

    card.innerHTML = `
      <img src="${place.images[0]}" alt="${place.title}">
      <div class="card-body">
        <h3>${place.title}</h3>
        <p>${place.district || "Madhya Pradesh"}</p>
        <a href="place.html?id=${encodeURIComponent(place.id)}" class="details-btn">View Details</a>
      </div>
    `;

    wishlistGrid.appendChild(card);
  });
});
