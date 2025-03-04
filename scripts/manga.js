/* 
By Khyle
Once the user has searched or entered a manga in the search ar, it twould call the searchManga function
*/
function pageLoaded(){
    const form = document.getElementById('search_form_manga');
    form.addEventListener("submit", searchManga);
}

window.addEventListener("load", pageLoaded);

/* 
By Khyle
This function fetches the user's search query
It also handles the searching of manga. it fetches from https://kitsu.io/api/edge/manga and embeds the user's search query
Once the data is successfuly fetched, it will call the updateDom() function
*/
function searchManga(event) {
    event.preventDefault();

    const apiUrl = 'https://kitsu.io/api/edge/manga';
    const form = new FormData(this);
    const searchTitle = form.get("search");

    const queryParams = `filter[text]=${encodeURIComponent(searchTitle)}`;

    const urlWithParams = `${apiUrl}?${queryParams}`;

    fetch(urlWithParams)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        updateDom(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


/* 
By Khyle
This code handles the sorting of the top manga displays
*/
const sortButton = document.getElementById("sortButton");

sortButton.addEventListener("click", function () {
    const filterDropdown = document.getElementById("filterDropdown").value;
    console.log(filterDropdown);
    
    switch (filterDropdown) {
        case "highestScore":
            fetchTopManga();
        break;    

        case "lowestScore":
            fetchLowestManga();
        break;

        case "highestMemberNo":
            fetchTopMangaMembers();
        break;

        case "lowestMemberNo":
            fetchLowestMangaMembers();
        break;

        case "latestReleaseDate":
            fetchTopMangaReleaseDate();
        break;

        case "oldestReleaseDate":
            fetchOldestMangaReleaseDate();
        break;    
        
        default:
            console.log("Nothing being fetched");
        break;    
    }
});

/* 
By Khyle
This function fetches the top 10 manga with highest number of members
*/
function fetchTopMangaMembers(){
    const apiUrl = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=-userCount';
    

    fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
     })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function fetches the top 10 manga with lowest number of members
*/
function fetchLowestMangaMembers(){
    const apiUrl = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=userCount';
    

    fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
     })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function fetches the top 10 manga with the latest release date
*/
function fetchTopMangaReleaseDate(){
    const apiUrl = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=-startDate';

    fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function fetches the top 10 manga with the oldest release date
*/
function fetchOldestMangaReleaseDate(){
    const apiUrl = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=startDate';

    fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function updates the search results page of the manga.html, from the fetched data
*/
function updateDom(data){
    const searchResults = document.querySelector('#manga-list');
    let updatedHTML = "";

    // Data is inside data so make new data out of data
    mangaData = data.data;
    if (mangaData) {
        for (let i = 0; i < mangaData.length; i++) {
            console.log(mangaData[i].attributes.canonicalTitle); //validation purposes
            let id = mangaData[i].id;

            updatedHTML += `
                <div class="series"> 
                    <a href = "javascript:void(0)" onclick="showMangaDescription(this)"><img src="${mangaData[i].attributes.posterImage.original}" alt="Manga Result ${i+1}" id = "${id}"></a>
                    <span class="series-caption">${mangaData[i].attributes.canonicalTitle}</span>
                </div>   
            `;
        }
        searchResults.innerHTML = `
            <h2>Search Results:</h2>
            <div>${updatedHTML}</div>
        `;

        searchResults.addEventListener('click', (event) => {
            if (event.target.classList.contains('read')) {
                const mangaId = event.target.parentNode.classList[0];
                fetchChapters(mangaId);
            }
        });
    } else {
        searchResults.innerHTML = "<p>No results found.</p>";
    }
}

/* 
By Khyle
This function fetches the top 10 manga based on the highest rating
*/
function fetchTopManga() {
    const url = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=-averageRating';

    fetch(url)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function fetches the top 10 manga with the lowest rating
*/
function fetchLowestManga() {
    const url = 'https://kitsu.io/api/edge/manga?page[limit]=10&sort=averageRating';

    fetch(url)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        populatePage(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

/* 
By Khyle
This function populates the top mangas in the web application
The data fetched may be based from ratings, release date, and number of members
*/
function populatePage(data) {

    topManga = data.data;

    for(let i = 0; i < topManga.length; i++) {
        let imageSource = topManga[i].attributes.posterImage.original;
        let averageRating  = topManga[i].attributes.averageRating;
        let memberNumbers = topManga[i].attributes.userCount;
        let releaseDate = topManga[i].attributes.createdAt;
        let mangaName = topManga[i].attributes.canonicalTitle;
        let mangaID = topManga[i].id;

        let imageID = `topManga${i+1} pic`;
        let descriptionID = `topmanga${i+1} desc`;
        let scoreID = `topmanga${i+1} score`;   

        console.log(imageID);
        console.log(descriptionID);
        console.log(scoreID);
        
        imageAlt = `img[alt="Manga pic ${i+1}"]`;
        console.log(imageAlt);
        let imageElement = document.querySelector(imageAlt);;
        console.log(imageElement.src);
        let descriptionElement = document.getElementById(descriptionID);
        let scoreElement = document.getElementById(scoreID);

        imageElement.src = imageSource;
        descriptionElement.innerHTML = `Name: ${mangaName} <br> Classification: Manga <br> Release Date: ${releaseDate} <br> Members: ${memberNumbers}`;
        scoreElement.innerText = averageRating;
        imageElement.id = mangaID;
        console.log(imageElement.id);
    }

}

/* 
By Khyle
This function fetches the id of the clicked img
This allowss the fetched id to be integrated into the next page
Once integrated, it transfers to the manga-info.html
*/
function showMangaDescription(clickedElement) {
    var imageID = clickedElement.querySelector('img').id;
  
    window.location.href = `manga-info.html?id=${imageID}`;
}

/* 
By Khyle
This top manga is set as default to the mangas with highest ratings
*/
fetchTopManga();



