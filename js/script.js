let currentSong = new Audio()
let songs
let currFolder
async function getSongs(folder) {
  currFolder = folder
  let a = await fetch(`/${folder}/`)
  let response = await a.text()
  let div = document.createElement('div')
  div.innerHTML = response
  let as = div.getElementsByTagName('a')
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith('mp3')) {
      // songs.push(element.href.split(`/${folder}/`)[1].split('.')[0])
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }

    // show all the songs in the playlist
    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const song of songs) {
      songUL.innerHTML +=
        `<li>
                  <div class="songlist1">
                      <img class="invert" src="img/music.svg" alt="music">
                      <div class="info">
                          <div>${song.split('.')[0].replaceAll('%20', ' ')}</div>
                          <div>Bhavishya</div>
                      </div>
                  </div>
                  <div>   
                      <img class="invert" src="img/play.svg" alt="">
                  </div>
              </li>`
    }
  
    // Attach event listener to each song
    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach((e) => {
      e.addEventListener('click', () => {
        playMusic(e.querySelector('.info').firstElementChild.innerHTML)
      })
    })

    return songs
}
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (music, pause = false) => {
  currentSong.src = `/${currFolder}/` + music
  if (!pause) {
    currentSong.play()
    play.src = 'img/pause.svg'
  }
  document.querySelector('.songinfo').innerHTML = decodeURI(music)
  document.querySelector('.songtime').innerHTML = '00:00 / 00:00'
}

// Display albums on the page
async function displayAlbums(){
  let a = await fetch(`/songs/`)
  let response = await a.text()
  let div = document.createElement('div')
  div.innerHTML = response
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector('.cardContainer')
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    if (e.href.includes('/songs')){
      let folder = e.href.split('/').slice(-2)[0]
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json()
      cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <img src="songs/${folder}/cover.jpg"
            alt="">
        <h3>${response.title}</h3>
        <p>${response.description}</p>
      </div>`   
    }
  }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName('card')).forEach((e) => {
      e.addEventListener('click', async (item) => {
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        // console.log(songs);
        
        playMusic(songs[0])
      }
      )
    }
    )
  
}

async function main() {
  // Songs
  await getSongs("songs/h")
  playMusic(songs[0], true)



  // Attach event listener to play, previous and next buttons
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = 'img/pause.svg'
    } else {
      currentSong.pause()
      play.src = 'img/play.svg'
    }
  })

  displayAlbums()

  //event for timeupdation
  currentSong.addEventListener('timeupdate', () => {
    document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
  })

  // Add eventlistener to seekbar
  document.querySelector('.seekbar').addEventListener('click', (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector('.circle').style.left = percent + '%'
    currentSong.currentTime = (currentSong.duration * percent) / 100
  })

  // Add a event listener for hamburger
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = '0%'
  })

  // Add a event listener for cross
  document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-120%'
  })

  // Add event listener to previous
  previous.addEventListener('click', () => {
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])

    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })

  // Add event listener to next
  next.addEventListener('click', () => {
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])

    if (songs.length > index + 1) {
      playMusic(songs[index + 1])
    }
  })

  // Add event to volume
  document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
    currentSong.volume = parseInt(e.target.value) / 100
  })

  // Add the event listener to mute the track
  volume.addEventListener('click', (e) => {
    if (e.target.src.includes('img/volume.svg')){
      e.target.src = e.target.src.replace('img/volume.svg', 'img/mute.svg')
      currentSong.volume = 0
      document.querySelector('.range').getElementsByTagName('input')[0].value = 0
    } else {
      e.target.src = e.target.src.replace('img/mute.svg', 'img/volume.svg')
      currentSong.volume = 0.1
      document.querySelector('.range').getElementsByTagName('input')[0].value = 10

    }
  }
  )

}
main()