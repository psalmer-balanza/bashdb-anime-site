const base_url = 'https://api.jikan.moe/v4';
const form = document.getElementById('search_form');
form.addEventListener("submit", searchMedia);

window.addEventListener("load", function () {
    fetchSearchQuery();
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
By Psalmer
Based on whether the user clicked on anime or manga, the script will call on searchAnime or searchManga
*/
function fetchSearchQuery() {
    var urlSplit = window.location.search.substring(1);

    const split = urlSplit.split("?=");

    //Update the header text
    const searchHeader = document.getElementById('search-results-h1');
    searchHeader.innerText = `Search results for: ${split[1]}`;

    if(split[0] == 'anime') {
        console.log("Searching anime");
        searchAnime(split[1]);
    } else {
        console.log["Searching manga"];
        searchManga(split[1]);
    }
}


/*
By Khyle
Opens the manga info page with a url containing the id of manga to be searched
*/
function showMangaDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
  
    window.location.href = `manga-info.html?id=${imageID}`;
}

/*
By Psalmer
Searches anime based on the 
*/
function searchAnime(query){
    const sfwTag = "sfw";
    const queryParams = new URLSearchParams({
        q: query,
        sfwTag,
        page: 1, 
    });

    const url = `${base_url}/anime?${queryParams}`;

    console.log(url);

    fetch(url)
    .then(res=> {
        console.log(res);
        return res.json();
    })
    .then(data => {
        console.log(data);
        updateBodyAnime(data);
    }) 
    .catch(err=>console.warn(err.message));
}

/* 
By Khyle
This function allows searching of manga, when the user selected Manga in the search bar
*/
function searchManga(query) {

    const apiUrl = 'https://kitsu.io/api/edge/manga';

    const queryParams = `filter[text]=${encodeURIComponent(query)}`;

    const urlWithParams = `${apiUrl}?${queryParams}`;

    fetch(urlWithParams)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data); // print results
        updateBodyManga(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
Once the searchManga returned the result, this function is called to update the content ofo tthe search-results.js
*/
function updateBodyManga(data){
    const searchResults = document.getElementById('body');
    let updatedHTML = "";

    mangaData = data.data;
    if (mangaData) {
        for (let i = 0; i < mangaData.length; i++) {
            console.log(mangaData[i].attributes.canonicalTitle); //validation purposes
            let id = mangaData[i].id;
            updatedHTML += `
                <div class="manga-item"> 
                    <h1>${mangaData[i].attributes.canonicalTitle}</h1>
                    <a href = "javascript:void(0)" onclick="showMangaDescription(this)"><img src="${mangaData[i].attributes.posterImage.original}" alt="Manga Result ${i+1}" id = "${id}"></a>
                </div>   
            `;
        }
        searchResults.innerHTML = `
            <div>${updatedHTML}</div>
        `;
    } else {
        searchResults.innerHTML = "<p>No results found.</p>";
    }

}

/* 
By Psalmer
Updates the search-results elements with the results using innerHTML. Iterates through the 
data.data array returned by the query.
*/
function updateBodyAnime(data){
    const searchResults = document.getElementById('body');
    let updatedHTML = "";

    // Data is inside data so make new data out of data
    animeData = data.data;

    if (animeData) {
        animeData.forEach(anime => {
            // Trim the synopsis first
            const trimmedSynopsis = limitSynopsis(anime.synopsis);
            updatedHTML += `
                <div class="anime-item">
                    <a href="javascript:void(0)" onclick="showAnimeDescription(this)"><img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-image" id="${anime.mal_id}"></a>
                    <a href="javascript:void(0)"><h1>${anime.title}</h1></a>
                    <p>${trimmedSynopsis}</p>
                </div>
            `;
        });

        searchResults.innerHTML = `
                ${updatedHTML}
        `;
    } else {
        searchResults.innerHTML = "<p>No results found.</p>";
    }
}

/*
By Psalmer
Opens the anime-info page with the url containing theid of the anime
*/
function showAnimeDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
    console.log(imageID);
    window.location.href = `anime/anime-info.html?id=${imageID}`;
}

/* 
By Psalmer
Accepts the raw synopsis and trims it down and ends with an elipsis
*/
function limitSynopsis(synopsis) {
    if (!synopsis) return ''; // handle the case when the synopsis is null

    const wordLimit = 50; // adjust to change word limit 
    const words = synopsis.split(" ");

    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
    } else {
        return synopsis;
    }
}


