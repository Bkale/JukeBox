(()=>{

    // Throw error on empty required parameters
    function reqParam() {
      throw new Error('This is a required param!');
    }
    // Grab html tag elements for DOM Manipulation
    const inputField = document.querySelector('.js-searchword')
    const submit = document.querySelector('.js-submit')
    const topSongs = document.querySelector('.js-topSongs')
    const portrait = document.querySelector('.js-portrait')
    const playlist = document.querySelector('.js-playlist')

    //Validates Search Query for empty strings *Returns value as promise
    const validateSearch = (value) => {
      return new Promise((resolve, reject) => {
          if (value.trim() === "") {
              reject('Input a valid value');
          }
          resolve(value);
      });
    };

    //########  RUNS SEARCH QUERY  #############
    //###PROMISES- PROMISES- PROMISES ##########
    const runSearchQuery = () => {
      const {value} = inputField
      let artistID;
      //VALIDATE USER INPUT
      validateSearch(value)
      .then((query) => {
          inputField.value = '';
          inputField.setAttribute('disabled', 'disabled');
          submit.setAttribute('disabled', 'disabled'); // Disable input and button elemnets.
          //Get Artist ID
            return SpotifyAPI.getId(query)
      })
      .then((artistId) => { // GET TOPS SONGS
        artistID = artistId.artists.items[0]
        return  SpotifyAPI.getTopSongs(artistId.artists.items[0].id)
        inputField.removeAttribute('disabled');
        submit.removeAttribute('disabled');
      })
      .then((topSongs) =>{ // RENDER TOPS SONGS AND GET RELATED ARTIST
        renderTopSongs(topSongs);
        return SpotifyAPI.getRelatedArtist(artistID.id)
      })
      .then((relatedArtists)=>{// RENDER ARTIST INFORMATION(IMAGE,NAME,RELATEDARTIST)
        renderArtistInfo(artistID,relatedArtists)
      })
      .catch((error) => {
        throw new Error(error);
      })
    }// END OF RUNSEARCHQUERY FUNCTION

    /*******************
  		RENDER CONTENT TO DOM
  	********************/

    function renderArtistInfo(artist, relatedArtists){
      //ARTIST UI
      portrait.innerHTML = "";
      const name = document.createElement('h1')
      name.innerText = artist.name
      const photo = document.createElement('img')
      photo.src = artist.images[0].url

      //RELATED ARTISTS UI
      const container = document.createElement('div')
      container.classList.add('relatedArtistContainer')
      const title = document.createElement('h2')
      title.classList.add('title')
      title.innerText = "Related Artists"
      container.appendChild(title)

      const circleContainer = document.createElement('div')
      circleContainer.classList.add('circleContainer')
      for(let i = 0; i < 3; i++){
        const circle = document.createElement('div')
        circle.classList.add('relatedArtistCirle')
        circle.innerText = relatedArtists.artists[i].name.substring(0,13)

        circle.addEventListener('click',()=>{
          const promise = SpotifyAPI.getId(relatedArtists.artists[i].name)
          promise.then((artist)=>{
            //Get Artists Top Songs
            SpotifyAPI.getRelatedArtist(artist.artists.items[0].id).then((relatedArtists)=>{
              renderArtistInfo(artist.artists.items[0],relatedArtists)
            })
            const promise = SpotifyAPI.getTopSongs(artist.artists.items[0].id)
            promise.then((res) => {
              renderTopSongs(res)
            })
          })
        })
        circleContainer.appendChild(circle)
      }

      container.appendChild(circleContainer)
      portrait.appendChild(name)
      portrait.appendChild(photo)
      portrait.appendChild(container)
    }//END RENDER ARTISTIFO

    //Render Top Songs
    function renderTopSongs(songs){
      topSongs.innerHTML = "";
      const title = document.createElement('h1')
      title.classList.add('title')
      title.innerText = 'Top 10'
      topSongs.appendChild(title)

      for(const song of songs.tracks){
        const {name, preview_url, id} = song
        const trackContainer = document.createElement('section')

        const songName = document.createElement('h1')
        songName.innerText = name.substring(0, 20)

        const audio = new Audio(preview_url)

        const playBtn = document.createElement('div')
        playBtn.classList.add('circle')

        const icon = document.createElement('i')
        icon.classList.add('play','icon')

        playBtn.appendChild(icon)
        playBtn.addEventListener('click',()=>{
          if(audio.paused === true){
            audio.play()
            icon.classList.remove('play','icon')
            icon.classList.add('pause','icon')
          } else {
            audio.pause()
            icon.classList.remove('pause','icon')
            icon.classList.add('play','icon')
          }
        })

        const fav = document.createElement('button')
        fav.classList.add('ui', 'green', 'button')
        fav.innerText = "Favorite"
        fav.addEventListener('click',()=>{
          PlaylistManager.addTrack(id)
          SpotifyAPI.getTracks(PlaylistManager.tracks).then((tracks)=>{
            playlist.innerHTML = ""
            for(let i = 0; i < tracks.length; i ++){
              renderPlaylist(tracks[i], i)
            }
          })
        })

        trackContainer.appendChild(songName)
        trackContainer.appendChild(playBtn)
        trackContainer.appendChild(fav)
        topSongs.appendChild(trackContainer)
      }
    }//RENDER TOP SONGS

    //Render Playlist Songs
    function renderPlaylist(track,i){
      const currentIndex = i;
      const {id,preview_url,name} = track
      const imageUrl = track.album.images[1].url;

      const playlistTrack = document.createElement('div');
      playlistTrack.classList.add('ui', 'card', 'trackid-' + id);
      playlistTrack.innerHTML = `
        <div class="item playlist-track trackid-${id}">
        <a href="#" class="playlist-close js-playlist-close">
        <i class="icon remove"></i>
        </a>
        <div class="ui tiny image">
        <img src="${imageUrl}">
        </div>
        <div class="middle aligned content playlist-content">
        ${name}
        </div>
        </div>
        <audio controls style="width: 100%;">
        <source src="${preview_url}">
        </audio>
        `
      playlist.appendChild(playlistTrack)

      //AUTOPLAY FUNCTIONALITY
      const audio = playlistTrack.querySelector('audio');
      audio.addEventListener('play', () => {
          PlaylistManager.currentSong = currentIndex;
      });
      audio.addEventListener('ended', () => {
          console.log('done!')
          const nextTrackId = PlaylistManager.getNextSong();

          setTimeout(() => {
              document.querySelector(`.trackid-${nextTrackId} audio`).play();
          }, 1000);
      })

      // REMOVE SONG FROM PLAYLIST
      const closeBtn = playlistTrack.querySelector('.js-playlist-close');
      closeBtn.addEventListener('click', () => {
          if (PlaylistManager.currentSong === currentIndex) {
              const nextTrackId = PlaylistManager.getNextSong();

              setTimeout(() => {
                  document.querySelector(`.trackid-${nextTrackId} audio`).play();
              }, 500);
          }
          PlaylistManager.removeById(id);
          playlist.removeChild(playlistTrack);
      })
    }//END OF RENDERPLAYLIST


  //################  SUBMIT ##########################
  submit.addEventListener('click', (e) => runSearchQuery())
  inputField.addEventListener('keydown', (e) => {
    //Object Destructuring  const {keyCode, which} = e
    const {keyCode, which} = e;
    if(keyCode === 13){
      runSearchQuery()
    }
  })

})();
