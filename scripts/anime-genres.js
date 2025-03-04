const base_url = 'https://api.jikan.moe/v4';

/*
By Psalmer
Simple event handler for when the page is loaded
*/
function pageLoaded() {
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchMedia);
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
        window.location.href = `../search-results.html?manga?=${query}`;
    } else {
        window.location.href = `../search-results.html?anime?=${query}`;
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
Fetches the recently released anime
*/
function fetchRecentlyReleasedAnime() {
    fetch("https://api.jikan.moe/v4/genres/anime")
        .then((res) => res.json())
        .then((data) => {
            displayGenres(data);
        })
        .catch((error) => console.error('Error', error));
}

/*
By Mark, Psalmer
Displays the recently released anime
*/
function displayGenres(data) {
    const searchResults = document.querySelector('#body');
    let updatedHTML = "";

    const genreData = data.data;

    if (genreData) {
        console.log(genreData);
        genreData.forEach((genre) => {
            updatedHTML += `
                <div class="genres">
                    <a href="${genre.url}">${genre.name}</a>
                    <a href="${genre.url}"><h3>Anime count: ${genre.count}</h3></a>
                </div>
            `;
        });

        searchResults.innerHTML = `
            <div class="gallery">
                ${updatedHTML}
            </div>
        `;
    } else {
        searchResults.innerHTML = "<p>No genres found. Please reload your browser.</p>";
    }
}