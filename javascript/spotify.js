const SpotifyAPI = {};


function reqParam() {
  throw new Error('This is a required param!');
}

//GET SONG ID FROM SPOTIFY
SpotifyAPI.getId = (query = reqParam(), type = 'artist') => {
  return new Promise((resolve,reject) => {
    const url = `https://api.spotify.com/v1/search?q=${query}&type=${type}`
    const http = new XMLHttpRequest();
    http.open('GET', url)
    http.onreadystatechange = () => {
      if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
        const data = JSON.parse(http.responseText);
        resolve(data)
      }
    }
    http.send()
  })
}; // SpotifyAPI.getId

  //GET SONGS IN PLAYLIST ARRAY FROM SPOTIFY
	SpotifyAPI.getTracks = async (trackIds = reqParam()) => {
    function __(url) {
      return new Promise((resolve, reject) => {
        const http = new XMLHttpRequest();
        http.open('GET', url)
        http.onreadystatechange = () => {
          if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
            const data = JSON.parse(http.responseText)
            resolve(data)
          }
        };
        http.send()
      });
    }

    let dataarr = []
    for(let i = 0; i < trackIds.length; i++){
      const url = `https://api.spotify.com/v1/tracks/${trackIds[i]}`
      const data = await __(url);
      dataarr.push(data);
    }

    return dataarr;
	}; // SpotifyAPI.getTracks

//GET RELATED ARTIST
SpotifyAPI.getRelatedArtist = (artistId) => {
  return new Promise((resolve,reject) => {
    const url = `https://api.spotify.com/v1/artists/${artistId}/related-artists`
    const http = new XMLHttpRequest();
    http.open('GET', url)
    http.onreadystatechange = () => {
      if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
        const data = JSON.parse(http.responseText);
         resolve(data)
      }
    }
    http.send()
  })
};//END OF RELATED ARTIST

//GET TOP SONGS
SpotifyAPI.getTopSongs = (artistId = reqParam()) => {
  return new Promise((resolve, reject)=>{
    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=SE`
    const http = new XMLHttpRequest();
    http.open('GET', url)
    http.onreadystatechange = () => {
      if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
        const data = JSON.parse(http.responseText);
          resolve(data)
      }
    }
    http.send()
  })

}; // SpotifyAPI.getTopSongs




// HINT3: if you use async / await here, the ^ above will
// look like this:
// SpotifyAPI.getTracks = async (trackIds = reqParam()) => {}
