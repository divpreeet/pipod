const mopidy_url = `ws://192.168.0.102:6600/mopidy/ws`
const statusDiv = document.getElementById("status");

// Dummy data for playlist
const playlist = [
  { title: "fein", artist: "bravis scott", albumArt: "https://placehold.co/400" },
  { title: "again fein", artist: "bravis scott", albumArt: "https://placehold.co/400" },
  { title: "AGSIN fein", artist: "bravis scott", albumArt: "https://placehold.co/400" },
];

let currentInd = 0;
let playing = false;

// DOM elements (use lowercase ids to match HTML)
const nowPlaying = document.getElementById("playing");
const artist = document.getElementById("artist");
const albumArt = document.getElementById("art");
const playPauseBtn = document.getElementById("play-pause");
const musicPlaylist = document.getElementById("playlist");

const mopidyWs = new WebSocket(mopidy_url)

mopidyWs.onopen = () => {
  statusDiv.textContent = "connected to mopqidy";
  console.log("mopdiy connected")
}

mopidyWs.onerror = (prob) => {
      statusDiv.textContent = "couldnt connect to mpidy";
      console.error(prob);
};

mopidyWs.onmessage = (event) => {
  console.log(event.data)
}

mopidyWs.onclose = () => {
  statusDiv.textContent = "disconnected"
}

function callMopidy(method, params = []) {
  if (mopidyWs.readyState === WebSocket.OPEN) {
    const request = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: method,
      params: params
    
    };
    mopidyWs.send(JSON.stringify(request));
  } else {
      statusDiv.textContent = "web socket not connected"
  }
}

function showNowPlaying() {
  const track = playlist[currentInd];
  nowPlaying.textContent = track.title;
  artist.textContent = track.artist;
  albumArt.style.backgroundImage = `url('${track.albumArt}')`;
}

function showPlaylist() {
  musicPlaylist.innerHTML = "";
  playlist.forEach((track, i) => {
    const item = document.createElement("div");
    item.className = "playlist-item" + (i === currentInd ? " active" : "");
    item.textContent = track.title;
    item.onclick = () => {
      currentInd = i;
      playing = true;
      updateUI();
      //get mopidy on pi to play song
    };
    musicPlaylist.appendChild(item);
  });
}

function toggleState() {
  playing = !playing;
  updateUI();
  // play pause 
}

function playNext() {
  currentInd = (currentInd + 1) % playlist.length;
  playing = true;
  updateUI();
  // nex track
}

function playPrev() {
  currentInd = (currentInd - 1 + playlist.length) % playlist.length;
  playing = true;
  updateUI();
  // last track
}

function updateUI() {
  showNowPlaying();
  showPlaylist();

  if (playing) {
    playPauseBtn.innerHTML = "&#10074;&#10074;";
  } else {
    playPauseBtn.innerHTML = '&#9658'
  }
}

playPauseBtn.addEventListener("click", toggleState);
document.getElementById("next").addEventListener("click", playNext);


document.getElementById("prev").addEventListener("click", playPrev);

updateUI();
