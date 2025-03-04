const base_url = 'https://api.jikan.moe/v4';

window.addEventListener("load", function () {
    fetchSearchQuery();
});

/*
By Psalmer
Fetches the url's substring in order to determine the anime id to be searched
*/
function fetchSearchQuery() {
    var urlSplit = window.location.search.substring(1);
    var id = urlSplit.split("=")[1];
    console.log(`User's query is anime ID "${id}"`);
    fetchAnimeInformation(id);
    fetchCharacterInformation(id);
    fetchEpisodeInformation(id);
}

/*
By Psalmer
Fetches the anime information and passes it to the updateBodyAnime function
*/
function fetchAnimeInformation(id){
    const url = `https://api.jikan.moe/v4/anime/${id}/full`;

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
By Psalmer
Get the anime title and change the metadata title
*/
function changeHeadTitle(data){
    const titleElement = document.querySelector('head title');
    titleElement.textContent = `${data}`;
}

/*
By Psalmer 
Updates the information of the page based on the anime id
*/
function updateBodyAnime(data){
    const searchResults = document.getElementById('body');
    const trailerDiv = document.querySelector('.trailer');
    let updatedHTML = "";

    // Data is inside data so make new data out of data
    animeData = data.data;
    changeHeadTitle(animeData.title);
    console.log(animeData);
    if (animeData) {
        let youtubeTrailer = animeData.trailer?.embed_url || "Trailer information not available.";
        let streamingLink = animeData.streaming[0]?.url || "Streaming information not available.";
        let producers = animeData.producers[0]?.name || "Producer information not available.";
        let studiosLink = animeData.studios[0]?.url || "#";
        let studiosName = animeData.studios[0]?.name || "Studio information not available.";
        let openingTheme = animeData.theme.openings[0] || "Opening theme information not available.";
        let endingTheme = animeData.theme.endings[0] || "Ending theme information not available.";
        
        trailerDiv.innerHTML = `
        <iframe id="player" width="640" height="360" src="${animeData.trailer.embed_url}" frameborder="0" allowfullscreen="1"></iframe>
        <img src="/images/close.png" class="close" onclick="toggle()">
        `; 

        updatedHTML += `
        <div class="anime-poster">
            <img src="${animeData.images.jpg.image_url}" alt="Poster">
        </div>
        <div class="anime-info">
            <h2 class="anime-title"><a href="${animeData.url}">${animeData.title}</a></h2>
            <p class="anime-description">
                ${animeData.synopsis}
            </p>
            <p><strong>Release Date:</strong> ${animeData.aired.from}</p>
            <p><strong>Genre:</strong><a href="${animeData.genres[0].url}">${animeData.genres[0].name}</a></p>
            <p><strong>Episodes:</strong> ${animeData.episodes}</p>
            <p><strong>MyAnimeList Score:</strong> ${animeData.score}</p>
            <div class="container-series">
                <div class="series-info">
                    <table class="series-table">
                        <tr>
                            <th>Type:</th>
                            <td>TV</td>
                        </tr>
                        <tr>
                            <th>Status:</th>
                            <td>Airing: ${animeData.airing}</td>
                        </tr>
                        <tr>
                            <th>Duration:</th>
                            <td>${animeData.duration}</td>
                        </tr>
                        <tr>
                            <th>Producers:</th>
                            <td>${producers}</td>
                        </tr>
                        <tr>
                            <th>Studios:</th>
                            <td><a href="${studiosLink}">${studiosName}</a></td>
                        </tr>
                        <tr>
                            <th>Year:</th>
                            <td>${animeData.year}</td>
                        </tr>
                        <tr>
                            <th>Streaming At:</th>
                            <td><a href="${streamingLink}">${streamingLink}</a></td>
                        </tr>
                        <tr>
                            <th>Theme Songs:</th>
                            <td>Opening: ${openingTheme} Ending: ${endingTheme}</td>
                        </tr>
                        <tr>
                            <th>Trailer Songs:</th>
                            <td>Trailer: <a href="${youtubeTrailer}">${youtubeTrailer}</a></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        `;
    
        searchResults.innerHTML = `
                ${updatedHTML}
        `;

    } else {
        searchResults.innerHTML = "<p>No results found.</p>";
    }
}

/*
By Psalmer
Fetches the character information and passes it to the updateCharactersAndVoices function
*/
function fetchCharacterInformation(id){
    const url = `https://api.jikan.moe/v4/anime/${id}/characters`;

    console.log(url);

    fetch(url)
    .then(res=> {
        console.log(res);
        return res.json();
    })
    .then(data => {
        console.log(data);
        updateCharactersAndVoices(data);
    }) 
    .catch(err=>console.warn(err.message));
}

/*
By Psalmer 
Updates the information of the character portion based on the anime id
*/
function updateCharactersAndVoices(data) {
    const characterList = document.getElementById('character-list');
    let updatedHTML = "";

    // Data is inside data so make new data out of data
    characterData = data.data;
    let counter = 0;
    if (characterData) {
        for (let i = 0; i < 12; i++) {
            let voiceActor = characterData[i]?.voice_actors[0]?.person?.name || "Voice Actor information not available.";
            let voiceActorRef = characterData[i]?.voice_actors[0]?.person?.url || "https://myanimelist.net";
            let characterImage = characterData[i].character.images.jpg.image_url;
            let characterName = characterData[i].character.name;
            let role = characterData[i].role;
        
            updatedHTML += `
            <td>
                <img src="${characterImage}" alt="${characterName}">
                <p id="character">Character: <br>${characterName}</p>
                <p id="role">Role: ${role}</p>
                <p id="voice-actor"> <a href="${voiceActorRef}"> VA (JP): <br> ${voiceActor} </a><br>Japanese</p>
            </td>
            `;
            counter++;
            if (counter > 10) {
                break;
            }
        }
        
        characterList.innerHTML = `
        <tr>
                ${updatedHTML}
        </tr>
        `;
    } else {
        characterList.innerHTML = "<p>No results found.</p>";
    }
}

/*
By Psalmer
Fetches the episode information and passes it to the updateCharactersAndVoices function
*/
function fetchEpisodeInformation(id){
    const url = `https://api.jikan.moe/v4/anime/${id}/episodes`;

    console.log(url);

    fetch(url)
    .then(res=> {
        console.log(res);
        return res.json();
    })
    .then(data => {
        console.log(data);
        updateEpisodesAndVoices(data);
    }) 
    .catch(err=>console.warn(err.message));
}

/*
By Psalmer 
Updates the information of the episode portion based on the anime id
*/
function updateEpisodesAndVoices(data) {
    const episodeList = document.getElementById('episodes-container');
    episodeList.innerHTML = "<div></div>";
    let updatedHTML = "";
    // Data is inside data so make new data out of data
    episodeData = data.data;
    if (episodeData) {
        episodeData.forEach((episode) => {
            let episodeID = episode.mal_id || "Episode ID not available.";
            let episodeTitle = episode.title || "Episode title not available.";
            let episodeURL = episode.url || "#";
            let episodeAired = episode.aired || "Airing information not available.";
            let episodeScore = episode.score || "Score information not available.";
        
            updatedHTML += `
                <tr>
                    <td>${episodeID}</td>
                    <td id="episodes${episodeID} desc"><a href="${episodeURL}">${episodeTitle}</a></td>
                    <td id="episodes${episodeID} desc">${episodeAired}</td>
                    <td id="episodes${episodeID} score">${episodeScore}</td>
                </tr>
            `;
        });
        
        episodeList.innerHTML = `
        <table class = "episodes">
            <tr>
                <th>#</th>
                <th>Episode Title</th>
                <th>Aired</th>
                <th>Poll</th>
            </tr>
                ${updatedHTML}
        </table>
        `;
    } else {
        episodeList.innerHTML = "<p>No results found.</p>";
    }
}

/*
By Crisha
Click the 'watch trailer' button in order to make the button active and 
when it's active the trailer of the anime is shown
*/
function toggle() {
    var trailer = document.querySelector(".trailer");
    var video = trailer.querySelector("iframe");
    trailer.classList.toggle("active");
    video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}


  
  