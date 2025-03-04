const base_url = 'https://api.jikan.moe/v4';

/*
By Psalmer
Add anime to the container and create even listener for the search bar
*/
function pageLoaded(){
    updateAnimeContainer();
    updateNewsContainer();
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchMedia);
}

window.addEventListener("load", pageLoaded);
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
Update the container element with popular anime
*/
function updateAnimeContainer(){

    const url = 'https://api.jikan.moe/v4/top/anime';

    const animeList = document.querySelector('#anime-list');
    const imageBanner = document.querySelector('.anime-bg-container');
    let updatedHTML = "";
    let updatedBannerHTML = "";
    fetch(url)
    .then(res=> {
        console.log(res);
        return res.json();
    })
    .then(data => {
        animeData = data.data;
        console.log(data);
        if (animeData) {
            for (let i = 0; i < 21; i++) {
                const anime = animeData[i];
                console.log("updating");
                updatedHTML += `
                    <div class="series">
                        <a href="javascript:void(0)" onclick="showAnimeDescription(this)"><img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-image" id="${anime.mal_id}"/></a>
                        <span class="series-caption">${anime.title}</span>
                    </div>
                `;
                updatedBannerHTML += `
                    <img src = "${anime.images.jpg.image_url}" alt = "${anime.title}" > 
                `;
            }

            imageBanner.innerHTML = `
                ${updatedBannerHTML}
            `;

            animeList.innerHTML = `
                <li>${updatedHTML}</li>
            `;

        } else {
            animeList.innerHTML = "<p>No results found.</p>";
        }
    }) 
}

/**By Psalmer
 * When an image is clicked, take the ID of the anime and open anime-info with the id in the url */
function showAnimeDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
    console.log(imageID);
    window.location.href = `anime/anime-info.html?id=${imageID}`;
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
Updates the news bar
*/
function updateNewsContainer(){
    const url = 'https://api.jikan.moe/v4/anime/1/news';

    const newsDiv = document.querySelector('.news');
    let updatedHTML = "";
    fetch(url)
    .then(res=> {
        console.log(res);
        return res.json();
    })
    .then(data => {
        news = data.data;
        console.log("got the news");
        console.log(news);
        if (news) {
            news.forEach(newsInfo => {
                console.log("updating news");
                updatedHTML += `
                    <div class="article">
                    <img id="news-img" src="${newsInfo.images.jpg.image_url}" alt="anime-cover" onerror="this.onerror=null;this.src='images/160x220.png'" />
                        <div class="article-text">
                        <h1 id="news-title">
                            <a href="${newsInfo.url}"> ${newsInfo.title}</a>
                        </h1>
                        <div class="news-unit">
                            <p id="news-desc">${newsInfo.excerpt}<a href="${newsInfo.url}">Read more</a></p>
                            <p id="posted-on">Posted on ${newsInfo.date} by <a href="${newsInfo.author_url}">${newsInfo.author_username}</a>
                        </p>
                        </div>
                    </div>
                    </div>
                `;
            });
    
            newsDiv.innerHTML = `
                ${updatedHTML}
            `;
        } else {
            newsDiv.innerHTML = "<p>No results found. Please reload your browser</p>";
        }
    }) 
}