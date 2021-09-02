const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const cd = $('.cd')
const nameSong = $('.nameSong h2')
const nameWriter = $('.nameWriter h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const player = $('.player')
const playlist = $('.playlist')
const dashboard = $('.dashboard')

const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const playBtn = $('.btn-toggle-play')

const progress = $('.progress')
const progressBar = $('.progressBar')

const app = {
    currentIndex : 0,
    isRepeat : false,
    isRandom : false,
    isPlaying : false,
    isTimeplaying : false,

    arrayTemp: [],
    count: 0,
    songs: [
        {
            name: "Cô đơn không muốn về nhà",
            singer: "Mr.Siro",
            path: "./assets/songs/song1.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
        {
            name: "Đánh mất em",
            singer: "Quang",
            path: "./assets/songs/song2.mp3",
            img: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
        },
        {
            name: "Đã từng vỗ giá",
            singer: "Mr.Siro",
            path: "./assets/songs/song3.mp3",
            img: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
        },
        {
            name: "Mãi mãi không phải anh",
            singer: "Thanh Bình",
            path: "./assets/songs/song4.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
            },
        {
            name: "Mùa đông đã quá lạnh",
            singer: "Mr.Siro",
            path: "./assets/songs/song5.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
        {
            name: "Mùa xa nhau",
            singer: "Mr.Siro",
            path: "./assets/songs/song6.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
        {
            name: "Nàng thơ",
            singer: "Hoàng Dũng",
            path: "./assets/songs/song7.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
        {
            name: "Những gì anh nói",
            singer: "Mr.Siro",
            path: "./assets/songs/song8.mp3",
            img: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
    ],

    // Render
    render: function () {
        const playlist = $('.playlist')
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${ index === this.currentIndex ? "active" : ""}" data-index= ${index}>
                <div class="thmub" style="background-image: url('${song.img}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML = htmls.join("")
    },

    // Load Current Song
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },


    loadCurrentSong: function () {
        nameSong.textContent = this.currentSong.name
        nameWriter.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
        }
        $$('.song')[this.currentIndex].classList.add('active')
    },
    // handleEvent
    handleEvent: function () {
        const _this = this
        
        const cdWidth = cd.offsetWidth

        // Scroll window
        document.onscroll = function () {
            const scrollTop = window.scrollY 
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0
        }
        // playlist.onscroll = function () {
        //     console.log(playlist.onscrollY)
        // }
        // playlist.addEventListener('swiped-up', function (e) {
        //     cd.style.width = "48px";
        //     this.style.marginTop = "320px"
        //     this.style.height = "400px"
        // })

        // Input range ontimeupdate
        audio.ontimeupdate = function () {
            if(audio.duration && !_this.isTimeplaying) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
                progressBar.style.width = progressPercent + "%"
            }
        }

        // onchange progress

        progress.onchange = function (e) {
            _this.isTimeplaying = false
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime;
            
        }
        progress.onpointerdown   = function(e) {
            _this.isTimeplaying = true;
        }
        

        // Prev start next
        playBtn.onclick = function () {
            if(!_this.isPlaying) {
                audio.play()
            } else (
                audio.pause()
            )
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
        }
        nextBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playrandomSong()
            } else {
                _this.nextSong()
            }
            audio.play();
            // _this.render();
            _this.scrollToActiveSong()
        }
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playrandomSong()
            } else {
                _this.prevSong()
            }
            audio.play();
            // _this.render();
            _this.scrollToActiveSong()
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Onclick playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
                if( songNode || !e.target.closest('.option')) {
                    if(songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong();
                        // _this.render();
                        audio.play()
                    }
                    if(e.target.closest('.option')) {

                    }
                }
        }
    },

    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playrandomSong: function () {
        let newIndex
        this.arrayTemp.push(this.currentIndex)
        if(this.arrayTemp.length === this.songs.length) {
            this.arrayTemp = []
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.arrayTemp.includes(newIndex))
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        if(this.currentIndex <= 3) {
            $('.song.active').scrollIntoView({
                behavior : "smooth",
                block: "end"
              })
        } else {
            $('.song.active').scrollIntoView({
                behavior : "smooth",
                block: "center"
              })
        }
      },


    start: function () {
        this.render()
        
        this.handleEvent()

        this.defineProperties()

        this.loadCurrentSong()
    }
}

app.start()
