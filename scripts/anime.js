const base_url = 'https://api.jikan.moe/v4';

/*
By Psalmer
Event handler for the page being loaded  
*/
function pageLoaded() {
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchMedia);
    // const searchInput = document.querySelector('.search-input');
    // searchInput.addEventListener("keypress", function(event) {
    //     if (event.key === 'Enter') {
    //         searchFilteredAnime();
    //     }
    // });
}

window.addEventListener("load", function () {
    fetchRecentlyReleasedAnime();
    pageLoaded();
});
/*
By Psalmer
Searches event listener for clicking enter on the search bar
*/
function searchMedia(event){
    event.preventDefault();
    
    const form = new FormData(this);
    const query = form.get("search");
    localStorage.setItem('searchQuery', query);
    if(localStorage.getItem('searchMediaType') == 'Manga') {
        window.location.href = `search-results.html?manga?=${query}`;
    } else {
        window.location.href = `search-results.html?anime?=${query}`;
    }
}

/*
By Psalmer
For dropdown*/
function dropdownEvent() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}

/* 
By Psalmer
Change dropdown list thumbnail text to anime/manga and change localstorage to anime/manga 
For reference when clicking the search
*/
function selectSearchMedia(mediaType) {
    localStorage.setItem('searchMediaType', mediaType);
    document.querySelector('.dropbtn').innerText = mediaType;
}
/*
By Mark
Fetches the recent animes
*/
function fetchRecentlyReleasedAnime() {
    const queryParams = new URLSearchParams({
        sort: "desc",
        order_by: "start_date",
        page: 1,
    });

    const url = `${base_url}/anime?${queryParams}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            displaySearchedAnime(data);
        })
        .catch((error) => console.error('Error', error));
}

/*
By Mark, Psalmer
Display the anime
*/
function displaySearchedAnime(data) {
    const searchResults = document.querySelector('#anime');
    let updatedHTML = "";

    const animeData = data.data;

    if (animeData) {
        console.log(animeData);
        animeData.forEach((anime) => {
            updatedHTML += `
                <div class="anime-item">
                    <a href="javascript:void(0)" onclick="showAnimeDescription(this)"><img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-image" id="${anime.mal_id}"></a>
                    <a href="javascript:void(0)" onclick="showAnimeDescription(this)" id="${anime.mal_id}"><h3>${anime.title}</h3></a>
                </div>
            `;
        });

        searchResults.innerHTML = `
            <div class="gallery">
                ${updatedHTML}
            </div>
        `;
    } else {
        searchResults.innerHTML = "<p>No anime found, please try a different query.</p>";
    }
}

/*
By Psalmer
Searches event listener for clicking enter on the search bar
*/
function searchMedia(event){
    event.preventDefault();
    
    const form = new FormData(this);
    const query = form.get("search");
    localStorage.setItem('searchQuery', query);
    if(localStorage.getItem('searchMediaType') == 'Manga') {
        window.location.href = `search-results.html?manga?=${query}`;
    } else {
        window.location.href = `search-results.html?anime?=${query}`;
    }
}

/**By Psalmer
 * When an image is clicked, take the ID of the anime and open anime-info with the id in the url */
function showAnimeDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
    console.log(imageID);
    window.location.href = `anime/anime-info.html?id=${imageID}`;
}

/*
By Khyle and Psalmer
Concatenates all of the search filters and invokes the search within the same page (does not redirect to search-results.html)
*/function searchFilteredAnime() {
    // Get the values from the forms
    var searchInput = document.querySelector('.search-input').value;

    const selectedTypeTv = document.getElementById('type-tv').value;
    const selectedRating = document.getElementById('rating').value;
    const selectedGenre = document.getElementById('genre').value;
    const selectedOrderBy = document.getElementById('order-by').value;
    const selectedSortBy = document.getElementById('sort').value;
    const selectedAiringStatus = document.getElementById('airing-status').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    var sfwCheckbox = document.getElementById('checkbox-id').checked;

    // Print them out for clarity
    console.log('Input value:', searchInput);
    console.log('Type:', selectedTypeTv);
    console.log('Rating:', selectedRating);
    console.log('Genre:', selectedGenre);
    console.log('Order By:', selectedOrderBy);
    console.log('Sort:', selectedSortBy);
    console.log('Airing Status:', selectedAiringStatus);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('SFW:', sfwCheckbox);

    // Special handling for sfw value
    let sfwParam = sfwCheckbox ? '?sfw?' : '';

    // Assign to variables before URL in order to keep the URL concatenation simple
    let searchQuery = `q=${searchInput || ""}`;
    let typeTv = selectedTypeTv ? `&type=${selectedTypeTv}` : "";
    let rating = selectedRating ? `&rating=${selectedRating}` : "";
    let genre = selectedGenre ? `&genres=${selectedGenre}` : "";
    let orderBy = selectedOrderBy ? `&order_by=${selectedOrderBy}` : "";
    let sort = selectedSortBy ? `&sort=${selectedSortBy}` : "";
    let airingStatus = selectedAiringStatus ? `&status=${selectedAiringStatus}` : "";
    let start = startDate ? `&start_date=${startDate}` : "";
    let end = endDate ? `&end_date=${endDate}` : "";

    let searchUrl = `https://api.jikan.moe/v4/anime?${searchQuery}${sfwParam}${typeTv}${rating}${genre}${orderBy}${sort}${airingStatus}${start}${end}`;

    console.log("URL: ", searchUrl);

    fetch(searchUrl)
        .then((res) => res.json())
        .then((data) => {
            displaySearchedAnime(data);
        })
        .catch((error) => console.error('Error', error));
}


/*
By Psalmer
Resets the values, this is for the clear button 
*/
function resetAnimeFilters() {
    document.querySelector('.search-input').value = "";
    document.getElementById('type-tv').value = "";
    document.getElementById('rating').value = "";
    document.getElementById('genre').value = "";
    document.getElementById('order-by').value = "";
    document.getElementById('sort').value = "";
    document.getElementById('airing-status').value = "";
    document.getElementById('start-date').value = "";
    document.getElementById('end-date').value = "";
    document.getElementById('checkbox-id').checked = false;
}
