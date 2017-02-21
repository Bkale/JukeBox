const playlist = {};

/*******************
  PLAYLIST MANAGEMENT
********************/

const PlaylistManager = {};

PlaylistManager.tracks = []; //HOLDS TRACKID OF EACH SONG IN PLAYLIST

PlaylistManager.currentSong = 0; // CURRENT SONG

PlaylistManager.addTrack = (trackId = reqParam()) => {
  PlaylistManager.tracks.push(trackId)
}; // PlaylistManager.addTrack

PlaylistManager.removeById = (id) => {
    for (let i = 0; i < PlaylistManager.tracks.length; i++) {
        const track = PlaylistManager.tracks[i];
        if (track === id) {
            PlaylistManager.tracks.splice(i, 1);
            break;
        }
    }
}


PlaylistManager.getNextSong = () => {
    PlaylistManager.currentSong++;
    let {tracks, currentSong} = PlaylistManager;
    const len = tracks.length;

    if (currentSong === len) {
        currentSong = 0;
    }
    return tracks[currentSong];
}; // END OF GETNEXTSONG Function
