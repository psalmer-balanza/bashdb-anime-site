/* 
By Khyle
This function fetches the id of the manga on the url, and passes it to fetch Manga description
On page load, this method is already called
*/
function fetchMangaID(){
    var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === "id") {
                fetchMangaGenre(pair[1]);
                fetchMangaDescription(pair[1]);
                fetchMangaCharacters(pair[1]);
            }
        }
}

//onload, update manga-description containers - updateDOM
fetchMangaID();

/* 
By Khyle
This function fetches the descsription of a specific manga, based on the passed mangaId in the fetchMangaIdD function
*/
function fetchMangaDescription(mangaId) {
    const apiUrl = `https://kitsu.io/api/edge/manga/${mangaId}`;

    fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Access the manga's description from the response data
        console.log(data); //for testing/validation purposes
        updateDOM(data);
    })
    .catch((error) => {
        console.error('Error:', error);
     });
}

function fetchMangaGenre(mangaId) {
    genreURL = `https://kitsu.io/api/edge/manga/${mangaId}/genres`

    fetch(genreURL)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        genreElement = document.getElementById("genres");
        genreData = data.data;
        console.log("This is genre data");
        const mangaGenres = genreData.map((genre) => genre.attributes.name); //array of objects that fetches each genres of a manga
        if (mangaGenres.length == 0) {
            genreElement.innerHTML = `<strong>Genres: </strong> No Genre Data Found`;
        } else {
            genreElement.innerHTML = `<strong>Genres: </strong> ${mangaGenres}`;
        }
        
    })
    .catch((error) => {
        console.error('Error:', error);
     });
    
}

/* 
By Khyle
This function fetches the characteres of a specific manga, based on the passed mangaId in the fetchMangaIdD function
If there are no characters, it outputs "No Data Found"
*/
function fetchMangaCharacters(mangaId) {
    const apiUrl = `https://kitsu.io/api/edge/manga/${mangaId}/characters`;
    const characterList = document.getElementById('character-list'); 

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {

            const mangaCharactersData = data.data;
            console.log("Character data:")

            if (mangaCharactersData.length != 0) {
                const characterPromises = [];

            for (let i = 0; i < mangaCharactersData.length; i++) {
                let characterId = mangaCharactersData[i].id;
                console.log(characterId);

                console.log(`https://kitsu.io/api/edge/media-characters/${characterId}/character`);
                const characterPromise = fetch(`https://kitsu.io/api/edge/media-characters/${characterId}/character`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((characterDetails) => {
                        console.log(characterDetails); // For testing/validation purposes
                        let characterName = characterDetails.data.attributes.canonicalName;
                        console.log(characterName);
                        let characterImage = characterDetails.data.attributes.image.original;

                        return `
                            <td>
                                <img src="${characterImage}" alt="${characterName}">
                                <p id="character">${characterName}</p>
                            </td>
                        `;
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                characterPromises.push(characterPromise);
            }

            // Use Promise.all to wait for all fetching to complete
            // without promise, it goes through the updateCharastersPlaceHolder() without adding the content and it is not readable outside .then statement
            Promise.all(characterPromises)
                .then((charactersHTML) => {
                    const updatedHTML = `<tr>${charactersHTML.join('')}</tr>`;
                    updateCharactersPlaceHolder(updatedHTML);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            } else {
                characterList.innerHTML = "No data about characters found";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/* 
By Khyle
This function updates the character place holder, which is called by the fetchMangaCharacters() function, once all the characters are added
*/
function updateCharactersPlaceHolder(htmlLines){
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = `<tr>${htmlLines}</tr>`;
}

/* 
By Khyle
This function fetches the manga's title and puts in into the web application's title
*/
function changeHeadTitle(data){
    const titleElement = document.getElementById('head-title');
    titleElement.textContent = data.attributes.canonicalTitle;
}


/* 
By Khyle
This function updates the placeholder of the manga-info.html
This uses queryselectors and getElementbyID to obtain the elements, and innerHTML and innerText to edit the element's contents.
*/
function updateDOM(data){
    mangaData = data.data;
    changeHeadTitle(mangaData);

    imageElement = document.getElementById("poster");
    titleElement = document.querySelector("h2.manga-title");
    descriptionElement = document.querySelector("p.manga-description")
    ageRatingElement = document.getElementById("ageRating");
    ageRatingGuideElement = document.getElementById("ageRatingGuide");
    popularityRankElement = document.getElementById("popularityRank");
    statusElement = document.getElementById("status");
    membersCountElement = document.getElementById("membersCount");
    ratingElement = document.getElementById("rating");

    mangaImage = mangaData.attributes.posterImage.original;
    mangaTitle = mangaData.attributes.canonicalTitle;
    mangaDescription = mangaData.attributes.description;
    mangaAgeRate = mangaData.attributes.ageRating;
    mangaAgeRateGuide = mangaData.attributes.ageRatingGuide;
    mangaPopularityRank = mangaData.attributes.ratingRank;
    mangaStatus = mangaData.attributes.status;
    mangaMembers = mangaData.attributes.userCount;
    mangaRate = mangaData.attributes.averageRating;

    imageElement.src = mangaImage;
    titleElement.innerText = mangaTitle;
    descriptionElement.innerText = mangaDescription;
    ageRatingElement.innerHTML = `<strong>Age Rating:</strong> ${mangaAgeRate}`;
    ageRatingGuideElement.innerHTML = `<strong>Age Rating Guide:</strong> ${mangaAgeRateGuide}`;
    popularityRankElement.innerHTML = `<strong>Popularity Rank:</strong> ${mangaPopularityRank}`;
    statusElement.innerHTML = `<strong>Status:</strong> ${mangaStatus}`;
    membersCountElement.innerHTML = `<strong>Number of members:</strong> ${mangaMembers}`;
    ratingElement.innerHTML = `<strong>Rating:</strong> ${mangaRate}`;
}

