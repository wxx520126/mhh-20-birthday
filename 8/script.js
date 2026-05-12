// 定义一个播放列表，你可以随时在里面添加你的录音文件路径和标题
const playlist = [
    {
        title: "第一段语音：睡前的一封信",
        src: "audio/1.mp3"
    },
    {
        title: "第二段语音：给你讲个小故事",
        src: "audio/2.mp3"
    },
    {
        title: "第三段语音：晚安，好梦",
        src: "audio/3.mp3"
    }
];

let currentTrackIndex = 0;

const audioPlayer = document.getElementById('audio-player');
const trackTitle = document.getElementById('track-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        currentTrackIndex = index;
        audioPlayer.src = playlist[currentTrackIndex].src;
        trackTitle.innerText = playlist[currentTrackIndex].title;
        // 如果想让它自动播放，可以取消下面这行的注释（不过部分浏览器限制自动播放）
        // audioPlayer.play();
    }
}

// 播放下一首
nextBtn.addEventListener('click', () => {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= playlist.length) {
        nextIndex = 0; // 循环播放
    }
    loadTrack(nextIndex);
    audioPlayer.play();
});

// 播放上一首
prevBtn.addEventListener('click', () => {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
        prevIndex = playlist.length - 1; // 循环播放
    }
    loadTrack(prevIndex);
    audioPlayer.play();
});

// 当前音频播放完毕后，自动播放下一首
audioPlayer.addEventListener('ended', () => {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex < playlist.length) {
        loadTrack(nextIndex);
        audioPlayer.play();
    }
});

// 初始化加载第一首歌
loadTrack(0);
