const API_KEY = "16ee77c6";




document.querySelectorAll(".tab-link").forEach(tab => {
    tab.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active from all
        document.querySelectorAll(".tab-link").forEach(t => {
            t.classList.remove("active", "text-white", "border-b-2", "border-blue-500");
            t.classList.add("text-red-500");
        });

        // Add active to clicked
        this.classList.add("active", "text-white", "border-b-2", "border-blue-500");
        this.classList.remove("text-gray-400");
    });
});



// Category Filter Buttons

const categoryButtons = document.querySelectorAll(".category-btn");
const movieCards = document.querySelectorAll(".movie-card");

categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const isActive = btn.classList.contains("bg-red-800");
        const category = btn.getAttribute("data-category");

        // Reset all buttons
        categoryButtons.forEach(b => {
            b.classList.remove("bg-red-800", "text-white");
            b.classList.add("bg-gray-800", "text-gray-300");
        });

        if (!isActive) {
            // Make clicked button active
            btn.classList.remove("bg-gray-800", "text-gray-300");
            btn.classList.add("bg-red-800", "text-white");

            // Filter movies
            movieCards.forEach(card => {
                if (category === "all" || card.getAttribute("data-category") === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        } else {
            // Toggle OFF = show all
            movieCards.forEach(card => card.style.display = "block");
        }
    });
});



// Navbar Search → Redirect to Search Page

document.addEventListener("DOMContentLoaded", () => {
    const searchInputs = [
        document.getElementById("search-navbar-desktop"),
        document.getElementById("search-navbar-mobile")
    ];

    searchInputs.forEach(input => {
        if (input) {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    const query = e.target.value.trim();
                    if (query) {
                        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    });
});



// Search Page Logic (search.html)

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    const resultsContainer = document.getElementById("searchResults");

    if (query && resultsContainer) {
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
            .then(res => res.json())
            .then(data => {
                resultsContainer.innerHTML = "";

                if (data.Response === "True") {
                    data.Search.forEach(movie => {
                        const card = document.createElement("div");
                        card.className = "bg-gray-900 rounded-xl shadow-md overflow-hidden group";

                        card.innerHTML = `
              <a href="movie.html?id=${movie.imdbID}">
                <div class="w-full h-72 overflow-hidden">
                  <img class="w-full h-full object-cover" 
                       src="${movie.Poster !== "N/A" ? movie.Poster : './assets/images/placeholder.jpg'}" 
                       alt="${movie.Title}" />
                </div>
              </a>
              <div class="p-3 text-center">
                <h5 class="text-sm font-semibold truncate">${movie.Title}</h5>
                <p class="text-xs text-gray-400">${movie.Year}</p>
              </div>
            `;

                        resultsContainer.appendChild(card);
                    });
                } else {
                    resultsContainer.innerHTML = `<p class="text-center text-red-400">No results found for "${query}"</p>`;
                }
            })
            .catch(err => {
                console.error(err);
                resultsContainer.innerHTML = `<p class="text-center text-red-400">Error fetching results 😢</p>`;
            });
    }
});


// Movie Details Page Logic (movie.html)

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    const movieDetails = document.getElementById("movieDetails");

    if (movieId && movieDetails) {
        fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}&plot=full`)
            .then(res => res.json())
            .then(movie => {
                if (movie.Response === "True") {
                    movieDetails.innerHTML = `
            <div>
              <img src="${movie.Poster !== "N/A" ? movie.Poster : './assets/images/placeholder.jpg'}" 
                   alt="${movie.Title}" 
                   class="rounded-xl shadow-lg w-full object-cover">
            </div>
            <div class="space-y-4">
              <h2 class="text-3xl font-bold">${movie.Title}</h2>
              <p class="text-gray-400">${movie.Year} · ${movie.Runtime} · ${movie.Genre}</p>
              <p class="text-yellow-400 font-medium">⭐ ${movie.imdbRating} / 10</p>
              <p class="text-sm text-gray-300">${movie.Plot}</p>
              <p class="text-sm"><span class="font-semibold">Director:</span> ${movie.Director}</p>
              <p class="text-sm"><span class="font-semibold">Actors:</span> ${movie.Actors}</p>
              <p class="text-sm"><span class="font-semibold">Writer:</span> ${movie.Writer}</p>
              <p class="text-sm"><span class="font-semibold">Language:</span> ${movie.Language}</p>
            </div>
          `;
                } else {
                    movieDetails.innerHTML = `<p class="text-red-400">Movie details not found 😢</p>`;
                }
            })
            .catch(err => {
                console.error(err);
                movieDetails.innerHTML = `<p class="text-red-400">Error loading details 😢</p>`;
            });
    }
});



// Discover a Movie (Randomized)

const discoverBtn = document.getElementById("discoverBtn");
const discoverDisplay = document.getElementById("discoverMovieDisplay");

// Function to fetch random movies from OMDb
async function fetchRandomMovies() {
    const randomKeywords = ["love", "war", "space", "king", "dragon", "girl", "night", "city"];
    const randomWord = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    const url = `https://www.omdbapi.com/?s=${randomWord}&apikey=${API_KEY}&type=movie`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            const movies = data.Search.slice(0, 6); // Get 6 movies
            renderDiscoverMovies(movies);
        } else {
            discoverDisplay.innerHTML = `<p class="text-white text-center">No movies found. Try again 🎬</p>`;
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function renderDiscoverMovies(movies) {
    discoverDisplay.classList.remove("hidden");
    discoverDisplay.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "bg-gray-900 rounded-xl shadow-md overflow-hidden group";

        card.innerHTML = `
            <a href="movie.html?id=${movie.imdbID}">
                <div class="w-full h-72 overflow-hidden">
                    <img class="w-full h-full object-cover transition duration-300 transform group-hover:scale-105"
                         src="${movie.Poster !== "N/A" ? movie.Poster : './assets/images/placeholder.jpg'}" 
                         alt="${movie.Title}" />
                </div>
            </a>
            <div class="p-3 text-center">
                <h5 class="text-sm font-semibold truncate">${movie.Title}</h5>
                <p class="text-xs text-gray-400">${movie.Year}</p>
            </div>
        `;

        discoverDisplay.appendChild(card);
    });
}

if (discoverBtn) {
    discoverBtn.addEventListener("click", (e) => {
        e.preventDefault();
        fetchRandomMovies();
    });
}



// Render My List Page

document.addEventListener("DOMContentLoaded", () => {
  const myListContainer = document.getElementById("myListContainer");
  if (myListContainer) {
    const myList = JSON.parse(localStorage.getItem("myList")) || [];

    if (myList.length > 0) {
      myList.forEach(movie => {
        const card = document.createElement("div");
        card.className = "bg-gray-900 rounded-xl shadow-md overflow-hidden group";

        card.innerHTML = `
          <div class="w-full h-72 overflow-hidden">
            <img class="w-full h-full object-cover" 
                 src="${movie.poster}" 
                 alt="${movie.title}" />
          </div>
          <div class="p-3 text-center">
            <h5 class="text-sm font-semibold text-white truncate">${movie.title}</h5>
            <p class="text-xs text-gray-400">${movie.year}</p>
            <p class="text-yellow-400 text-sm">${movie.rating}</p>
            <button class="mt-3 px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 remove-from-list">
              ❌ Remove
            </button>
          </div>
        `;

        myListContainer.appendChild(card);
      });
    } else {
      myListContainer.innerHTML = `<p class="text-center text-gray-400 col-span-full">No movies in your list yet 🎬</p>`;
    }
  }
});


// Remove From My List

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-list")) {
    const title = e.target.closest(".bg-gray-900").querySelector("h5").innerText;

    let myList = JSON.parse(localStorage.getItem("myList")) || [];
    myList = myList.filter(m => m.title !== title);
    localStorage.setItem("myList", JSON.stringify(myList));

    e.target.closest(".bg-gray-900").remove();
  }
});


