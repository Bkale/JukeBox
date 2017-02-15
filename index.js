(() => {
  //Can be moved to another JS file
  SC.initialize({
    client_id: '7e6000504572d932b02e7f412acb437c'
  });

  const submit = document.querySelector('.js-submit')
  const input = document.querySelector('.js-searchBar')
  const container = document.querySelector('.js-content')
  const playList = document.querySelector('.js-playlist')


//Validates Search and Calls get
  async function validateSearch() {
		const searchTerm = input.value;
		if (searchTerm.trim() === "") {
			alert('Please input a value!')
			return;
		}
		input.setAttribute('disabled', 'disabled');
		submit.setAttribute('disabled', 'disabled');

    await spotifySearch(searchTerm, renderTracks)
    input.removeAttribute('disabled')
    submit.removeAttribute('disabled')
	}



  function spotifySearch(searchTerm, callback){
    SC.get('/tracks', {
      q: searchTerm, license: 'cc-by-sa'
    }).then(function(tracks) {
      callback(tracks);
    })

  }
  function renderTracks(tracks){
    for(const track of tracks){
      console.log(track);

      const card = document.createElement('div')
      card.classList.add('card')

      const artwork = document.createElement('img')
      artwork.classList.add('artwork')
      track.artwork_url ? artwork.src = track.artwork_url : artwork.src = './assets/alt.jpg'
      const fav = document.createElement('button')
      fav.innerText = "Add To Favorites"

      fav.addEventListener('click',() => addToPlaylist(track.id))

      card.appendChild(artwork)
      card.appendChild(fav)
      container.appendChild(card)
    }
  }

  function addToPlaylist(songId){
    playList.style.display = 'flex'
    console.log(songId);
    //Render Playlist
  }


//****************   ONCLICK   ********************
  submit.addEventListener('click', (e) => validateSearch(e))
  document.addEventListener('keydown', (e) => {
      if(e.keyCode === 13){
        validateSearch()
      }
    })

//################# END OF CODE ######################
})()//End
