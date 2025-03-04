const base_url = 'https://api.jikan.moe/v4';
/*
By Psalmer 
Event handler for when the page is loaded
*/
function pageLoaded() {
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchMedia);
}

window.addEventListener("load", function () {
    fetchTopAnime();
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
By Psalmer
Gets the top anime
*/
function fetchTopAnime() {
    fetch("https://api.jikan.moe/v4/top/anime")
        .then((res) => res.json())
        .then((data) => {
            updateDom(data);
        })
        .catch((error) => console.error('Error', error));
}

/* 
By Psalmer
Updates the search-results elements with the results by updating the innerHTML. Iterates through the 
data.data[n] array returned by the query.
*/
function updateDom(data){
    const searchResults = document.getElementById('browse-anime');
    let updatedHTML = "";

    // Data is inside data so make new data out of data
    animeData = data.data;
    let rank = 0;
    if (animeData) {
        animeData.forEach(anime => {
            rank++;
            // Trim the synopsis first
            //const trimmedSynopsis = limitSynopsis(anime.synopsis);
            updatedHTML += `
            <tr>
                <td>${rank}</td>
                <td><a href="javascript:void(0)" onclick="showAnimeDescription(this)"><img src = "${anime.images.jpg.image_url}" id="${anime.mal_id}" alt ="Anime pic ${rank}" class=1></a></td>
                <td id ="browse-anime${rank} desc">Name: ${anime.title} <br> Classification: Anime <br> Aired From: ${anime.aired.from} <br> Members: ${anime.members}</td>
                <td id ="browse-anime${rank} score">${anime.score}</td>
            </tr>
            `;
        });

        searchResults.innerHTML = `
            <tr>
                <th>Rank</th>
                <th>Anime</th>
                <th>Info</th>
                <th>Score</th>
            </tr>
            ${updatedHTML}
        `;
    } else {
        searchResults.innerHTML = "<p>Error loading requests, please reload the page.</p>";
    }
}

/**By Psalmer
 * When an image is clicked, take the ID of the anime and open anime-info with the id in the url */
function showAnimeDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
    console.log(imageID);
    window.location.href = `anime-info.html?id=${imageID}`;
}