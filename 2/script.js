const VIDEO_SOURCES = [
  "./materials/ca75bd89b538a6bd5ca3ad38e402845a_raw.mp4",
  "./materials/edf431a0c66b6823099fe515a536b5ec_raw.mp4",
  "./materials/0054ff64078e1d478f74e69f3205a987.mp4"
];
let currentVideoIndex = 0;

const phoneFrame = document.getElementById("phoneFrame");
const callVideo = document.getElementById("callVideo");
const videoScreen = document.getElementById("videoScreen");
const videoPlaceholder = document.getElementById("videoPlaceholder");
const videoOverlay = document.getElementById("videoOverlay");
const answerButton = document.getElementById("answerButton");
const previewButton = document.getElementById("previewButton");
const rejectButton = document.getElementById("rejectButton");
const hangupButton = document.getElementById("hangupButton");
const incomingActions = document.getElementById("incomingActions");
const connectedActions = document.getElementById("connectedActions");
const statusText = document.getElementById("statusText");
const callerLabel = document.getElementById("callerLabel");
const callBadge = document.getElementById("callBadge");
const metaState = document.getElementById("metaState");
const callDuration = document.getElementById("callDuration");
const videoSourceLabel = document.getElementById("videoSourceLabel");
const callTip = document.getElementById("callTip");
const placeholderTitle = document.getElementById("placeholderTitle");
const placeholderText = document.getElementById("placeholderText");
const controlButtons = Array.from(document.querySelectorAll("[data-control]"));
const switchCameraButton = document.getElementById("switchCameraButton");

let timerId = null;
let startTime = 0;
let connected = false;
let sourceAttempted = false;
let cameraFacing = "front";

videoSourceLabel.textContent = VIDEO_SOURCES[currentVideoIndex].split('/').pop();

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setPlaybackMessage(title, text) {
  placeholderTitle.textContent = title;
  placeholderText.textContent = text;
}

function showPlaceholder() {
  videoPlaceholder.hidden = true;
  videoOverlay.hidden = true;
  callVideo.hidden = true;
  callVideo.removeAttribute("src");
  callVideo.load();
  videoScreen.classList.remove("is-playback-ready", "is-playing");
}

function showConnectedShell() {
  phoneFrame.classList.add("is-connected-state");
  incomingActions.hidden = true;
  connectedActions.hidden = false;
  statusText.textContent = "电话已经接通，正在准备播放视频……";
  callerLabel.textContent = "已接通视频电话";
  callBadge.textContent = "通话中";
  metaState.textContent = "已接听";
  callTip.classList.add("is-hidden");
}

function startTimer() {
  startTime = Date.now();
  callDuration.textContent = "00:00";
  timerId = window.setInterval(() => {
    callDuration.textContent = formatDuration(Date.now() - startTime);
  }, 1000);
}

async function loadAndPlayVideo() {
  if (sourceAttempted) {
    return;
  }

  sourceAttempted = true;
  videoOverlay.hidden = false;
  videoOverlay.querySelector(".video-chip").textContent = "正在连接视频";

  try {
    callVideo.src = VIDEO_SOURCES[currentVideoIndex];
    callVideo.hidden = false;
    videoPlaceholder.hidden = true;
    videoScreen.classList.add("is-playback-ready");
    await callVideo.play();
    videoScreen.classList.add("is-playing");
    videoOverlay.hidden = true;
    statusText.textContent = "视频已开始播放。";
    metaState.textContent = "播放中";
  } catch (error) {
    console.warn("视频暂时无法播放，等待你放入文件后再试。", error);
    showPlaceholder();
    videoPlaceholder.hidden = false;
    setPlaybackMessage(
      "视频播放失败",
      "请检查视频文件路径是否正确。"
    );
    statusText.textContent = "还没有找到视频文件，请检查文件。";
    metaState.textContent = "等待视频";
    sourceAttempted = false;
  }
}

function connectCall() {
  if (connected) {
    return;
  }

  connected = true;
  showConnectedShell();
  startTimer();
  loadAndPlayVideo();
}

function resetCall() {
  connected = false;
  window.clearInterval(timerId);
  timerId = null;
  currentVideoIndex = 0;
  videoSourceLabel.textContent = VIDEO_SOURCES[currentVideoIndex].split('/').pop();
  callDuration.textContent = "00:00";
  statusText.textContent = "正在接受邀请..";
  callerLabel.textContent = "视频通话邀请";
  callBadge.textContent = "视频通话";
  metaState.textContent = "未接听";
  incomingActions.hidden = false;
  connectedActions.hidden = true;
  callTip.classList.remove("is-hidden");
  phoneFrame.classList.remove("is-connected-state");
  phoneFrame.classList.remove("is-video-playing");
  sourceAttempted = false;
  showPlaceholder();
}

answerButton.addEventListener("click", connectCall);
rejectButton.addEventListener("click", resetCall);

previewButton.addEventListener("click", () => {
  callBadge.textContent = "视频通话";
  statusText.textContent = "这个页面已经准备好播放视频了。";
  setPlaybackMessage(
    "先看一眼页面",
    "点击接听即可连续播放你准备好的视频。"
  );
  videoOverlay.hidden = true;
  videoPlaceholder.hidden = true;
  metaState.textContent = "未接听";
});

hangupButton.addEventListener("click", resetCall);

switchCameraButton.addEventListener("click", () => {
  cameraFacing = cameraFacing === "front" ? "rear" : "front";
  statusText.textContent = cameraFacing === "front" ? "摄像头已经切回前置。" : "摄像头已经切到后置。";
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("is-off");
    button.setAttribute("aria-pressed", String(!isActive));

    const onLabel = button.dataset.onLabel || "已开启";
    const offLabel = button.dataset.offLabel || "已关闭";
    const label = button.querySelector(".feature-button__label");

    if (label) {
      label.textContent = isActive ? offLabel : onLabel;
    }
  });
});

callVideo.addEventListener("play", () => {
  videoScreen.classList.add("is-playing");
  videoScreen.classList.remove("is-playback-ready");
  phoneFrame.classList.add("is-video-playing");
  videoOverlay.hidden = true;
  metaState.textContent = "播放中";
  statusText.textContent = "视频正在播放。";
});

callVideo.addEventListener("pause", () => {
  if (!connected) {
    return;
  }

  metaState.textContent = "已暂停";
});

callVideo.addEventListener("ended", () => {
  if (currentVideoIndex < VIDEO_SOURCES.length - 1) {
    currentVideoIndex++;
    callVideo.src = VIDEO_SOURCES[currentVideoIndex];
    videoSourceLabel.textContent = VIDEO_SOURCES[currentVideoIndex].split('/').pop();
    callVideo.play().catch(console.error);
  } else {
    statusText.textContent = "视频播放结束了，你可以重新接听再看一遍。";
    metaState.textContent = "已播放完";
    phoneFrame.classList.remove("is-video-playing");
    resetCall();
  }
});

callBadge.textContent = "视频通话";
showPlaceholder();