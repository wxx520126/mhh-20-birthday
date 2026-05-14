// 定义一个播放列表，你可以随时在里面添加你的录音文件路径和标题
const playlist = [
    {
        title: "专门录给你的助眠音频",
        src: "20260514_210123.m4a"
    }
];

let currentTrackIndex = 0;

const audioPlayer = document.getElementById('audio-player');
const trackTitle = document.getElementById('track-title');

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        currentTrackIndex = index;
        audioPlayer.src = playlist[currentTrackIndex].src;
        trackTitle.innerText = playlist[currentTrackIndex].title;
    }
}

// 播放完毕后重置到开头
audioPlayer.addEventListener('ended', () => {
    // 可以在这里决定要不要循环播放：audioPlayer.play();
});

// 初始化加载录音
loadTrack(0);
