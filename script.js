// =====================
// Avaloria Main Script
// =====================

// --------- GLOBAL STAR RENDERING FUNCTION ---------
function renderStars(rating) {
    let out = '';
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5;
    for (let i = 0; i < full; i++) out += '<i class="fas fa-star"></i>';
    if (half) out += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) out += '<i class="far fa-star"></i>';
    return out;
}

// --------- VIDEO POPUP SECTION ---------
document.addEventListener('DOMContentLoaded', () => {
    // Video Popup Elements
    const watchBtn = document.getElementById("watch-btn");
    const videoPopup = document.getElementById("videoPopup");
    const ytPlayer = document.getElementById("ytPlayer");
    const closeBtn = document.getElementById("closeBtn");

    if (watchBtn && videoPopup && ytPlayer && closeBtn) {
        watchBtn.addEventListener("click", () => {
            videoPopup.style.display = "flex";
            // Add autoplay param
            let src = ytPlayer.src;
            if (!src.includes("autoplay=1")) {
                ytPlayer.src = src.includes("?") ? src + "&autoplay=1" : src + "?autoplay=1";
            }
        });

        closeBtn.addEventListener("click", closeVideoPopup);
        videoPopup.addEventListener("click", (e) => {
            if (e.target === videoPopup) closeVideoPopup();
        });

        document.addEventListener("keydown", (e) => {
            if (videoPopup.style.display === "flex" && e.key === "Escape") closeVideoPopup();
        });

        function closeVideoPopup() {
            videoPopup.style.display = "none";
            // Remove autoplay param to stop video
            ytPlayer.src = ytPlayer.src.replace(/[?&]autoplay=1/, "");
        }
    }
});

// --------- MOBILE MENU TOGGLE ---------
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
});

// --------- SMOOTH SCROLL ANIMATION ---------
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .feature-box');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}
document.querySelectorAll('.card, .feature-box').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// --------- WISHLIST (localStorage) ---------
function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem('avaloria_wishlist')) || [];
    } catch {
        return [];
    }
}
function setWishlist(arr) {
    localStorage.setItem('avaloria_wishlist', JSON.stringify(arr));
}
function toggleWishlist(id) {
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    setWishlist(list);
    updateAllWishlistButtons();
}
function updateAllWishlistButtons() {
    const list = getWishlist();
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (list.includes(id)) {
            btn.classList.add('wished');
            btn.textContent = '♥ In Wishlist';
        } else {
            btn.classList.remove('wished');
            btn.textContent = '♡ Add to Wishlist';
        }
    });
}

// --------- PLACES RENDERING (Popular & Hidden) ---------
document.addEventListener('DOMContentLoaded', () => {
    // Popular Places
    const placesGrid = document.getElementById('placesGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-box input');
    let placesData = [];
    let activeCategory = 'All';
    let searchTerm = '';

    if (placesGrid) {
        fetch('./places.json')
            .then(res => res.json())
            .then(data => {
                placesData = data;
                renderPlaces(placesData);
                setupFilters();
            })
            .catch(err => {
                console.error('places.json fetch error:', err);
                placesGrid.innerHTML = '<p>Could not load places data.</p>';
            });
    }

    function renderPlaces(data) {
        placesGrid.innerHTML = '';
        if (!data || data.length === 0) {
            placesGrid.innerHTML = '<p>No places found.</p>';
            return;
        }
        data.forEach(place => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <a href="place.html?id=${encodeURIComponent(place.id)}" style="text-decoration:none; color:inherit;">
                    <div class="card-img">
                        <img src="${place.images && place.images.length ? place.images[0] : ''}" alt="${place.title}">
                    </div>
                    <div class="card-content">
                        <h3>${place.title}</h3>
                        <p>${place.short || place.summary || ''}</p>
                        <div class="card-meta">
                            <span class="rating">${renderStars(place.rating)} ${place.rating.toFixed(1)}</span>
                            <p><strong>District:</strong> ${place.district}</p>
                        </div>
                    </div>
                </a>
                <button class="btn wishlist-btn" data-id="${place.id}">♡ Add to Wishlist</button>
            `;
            placesGrid.appendChild(card);
        });
        // Wishlist button listeners
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                toggleWishlist(id);
            });
        });
        updateAllWishlistButtons();
        animateOnScroll();
    }

    function setupFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-category');
                runFilterSearch();
            });
        });
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value.trim().toLowerCase();
                runFilterSearch();
            });
        }
    }

    function runFilterSearch() {
        let filtered = placesData.slice();
        if (activeCategory && activeCategory.toLowerCase() !== 'all') {
            filtered = filtered.filter(p => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
        }
        if (searchTerm) {
            filtered = filtered.filter(p =>
                (p.title && p.title.toLowerCase().includes(searchTerm)) ||
                (p.short && p.short.toLowerCase().includes(searchTerm))
            );
        }
        renderPlaces(filtered);
    }

    // Hidden Places
    const hiddenPlacesContainer = document.querySelector('.hidden-places .places-grid');
    if (hiddenPlacesContainer) {
        fetch('hidden-places.json')
            .then(res => res.json())
            .then(data => {
                hiddenPlacesContainer.innerHTML = '';
                data.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div class="card-img">
                            <img src="${place.image}" alt="Place Image">
                        </div>
                        <div class="card-content">
                            <h3>${place.name}</h3>
                            <p>${place.description}</p>
                            <div class="card-meta">
                                <div class="rating">
                                    ${renderStars(place.rating || 0)}
                                </div>
                            </div>
                        </div>
                    `;
                    hiddenPlacesContainer.appendChild(card);
                });
                animateOnScroll();
            });
    }
});

// --------- LIGHTBOX FUNCTIONALITY (Images & Videos) ---------
function initLightbox(mediaArr) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const close = document.querySelector(".lightbox .close");
    const prev = document.querySelector(".lightbox .prev");
    const next = document.querySelector(".lightbox .next");

    let currentIndex = 0;

    function showMedia(index) {
        currentIndex = index;
        lightbox.style.display = "block";
        const item = mediaArr[index];
        if (item.type === 'image') {
            lightboxImg.style.display = 'block';
            lightboxImg.src = item.src;
            if (lightboxImg.nextElementSibling && lightboxImg.nextElementSibling.tagName === 'VIDEO') {
                lightboxImg.nextElementSibling.remove();
            }
        } else if (item.type === 'video') {
            lightboxImg.style.display = 'none';
            let video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = true;
            video.className = 'lightbox-video';
            if (lightboxImg.nextElementSibling && lightboxImg.nextElementSibling.tagName === 'VIDEO') {
                lightboxImg.nextElementSibling.remove();
            }
            lightboxImg.parentNode.insertBefore(video, lightboxImg.nextSibling);
        }
    }

    // Attach click listeners to gallery items
    document.querySelectorAll(".gallery-img, .gallery-video-thumb").forEach((el, i) => {
        el.addEventListener("click", () => showMedia(i));
    });

    close.onclick = () => {
        lightbox.style.display = "none";
        if (lightboxImg.nextElementSibling && lightboxImg.nextElementSibling.tagName === 'VIDEO') {
            lightboxImg.nextElementSibling.pause();
            lightboxImg.nextElementSibling.remove();
        }
    };
    prev.onclick = () => showMedia((currentIndex - 1 + mediaArr.length) % mediaArr.length);
    next.onclick = () => showMedia((currentIndex + 1) % mediaArr.length);

    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "block") {
            if (e.key === "ArrowLeft") prev.onclick();
            if (e.key === "ArrowRight") next.onclick();
            if (e.key === "Escape") close.onclick();
        }
    });
}

// --------- PLACE DETAIL PAGE LOGIC ---------
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('place.html')) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('placeContent');
    if (!id) {
        container.innerHTML = '<p>Invalid place.</p>';
        return;
    }
    fetch('./places.json')
        .then(res => res.json())
        .then(places => {
            const place = places.find(p => p.id === id);
            if (!place) {
                container.innerHTML = '<p>Place not found.</p>';
                return;
            }
            // Prepare media array for lightbox (images + videos)
            const mediaArr = [];
            (place.images || []).forEach(img => mediaArr.push({ type: 'image', src: img }));
            (place.videos || []).forEach(video => mediaArr.push({ type: 'video', src: video }));

            container.innerHTML = `
<div class="back-button-container">
    <a href="index.html" class="btn back-btn">← Back to List</a>
</div>
<div class="place-hero" style="background-image:url('${place.images && place.images.length ? place.images[0] : ''}')">
    <div class="overlay">
        <h1>${place.title}</h1>
        <div class="rating">
            ${renderStars(place.rating)} <span>${place.rating.toFixed(1)} / 5</span>
        </div>
    </div>
</div>
<div class="place-layout">
    <section>
        <h2>About ${place.title}</h2>
        <p>${place.long}</p>
        <h3>Gallery & Videos</h3>
        <div class="gallery">
            ${(place.images || []).map(img => `
                <img src="${img}" alt="${place.title}" class="gallery-img" loading="lazy">
            `).join('')}
            ${(place.videos || []).map(video => `
                <img src="https://img.youtube.com/vi/${extractYouTubeID(video)}/0.jpg" alt="Video" class="gallery-video-thumb" loading="lazy" data-video="${video}">
            `).join('')}
        </div>
        <h3>Features & Sights</h3>
        <ul>
            ${(place.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <h3>History & Culture</h3>
        <p>${place.history || 'Information not available'}</p>
        <h3>Transportation</h3>
        <p>${place.transportation || 'Information not available'}</p>
        <h3>Best Time to Visit</h3>
        <p>${place.best_Time || 'All year'}</p>
        <h3>Travel Summary</h3>
        <p>${place.summary || ''}</p>
        <h3>Reviews</h3>
        <div class="reviews">
            ${(place.reviews || []).map(r => `<p>${renderStars(r.rating)} - ${r.comment}</p>`).join('')}
        </div>
        <h3>FAQ</h3>
        <div class="faq">
          ${(place.faq || []).map(f => `<p><strong>Q:</strong> ${f.question} <br><strong>A:</strong> ${f.answer}</p>`).join('')}
    </section>
    <aside>
        <div class="details-box">
            <h3>Details</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>District:</strong> ${place.district}</li>
                <li><strong>Category:</strong> ${place.category}</li>
                <li><strong>Badge:</strong> ${place.badge}</li>
                <li><strong>Rating:</strong> ${place.rating.toFixed(1)} / 5</li>
                <li><strong>Location:</strong> ${place.location}</li>
                <li><strong>Culture:</strong> ${place.culture}</li>
            </ul>
        </div>
        <iframe src="${place.map}" loading="lazy" style="width:100%; height:300px; border:none;"></iframe>
        <button class="btn wishlist-btn" data-id="${place.id}">♡ Add to Wishlist</button>
    </aside>
</div>
            `;
            // Wishlist button
            document.querySelector('.wishlist-btn').addEventListener('click', function () {
                toggleWishlist(place.id);
            });
            updateAllWishlistButtons();

            // Lightbox for images/videos
            setTimeout(() => {
                initLightbox(mediaArr);
            }, 100);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p>Could not load place details.</p>';
        });

    // Helper: Extract YouTube video ID for thumbnail
    function extractYouTubeID(url) {
        const regExp = /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : '';
    }
});


