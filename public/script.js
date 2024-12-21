const userVideo = document.getElementById("user-video");
const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");

const state = {
    media: null,
    mediaRecorder: null,
};

const socket = io();

if (!window.MediaRecorder) {
    console.error('MediaRecorder is not supported in this browser.');
}

stopButton.addEventListener("click", async (e) => {
    startButton.innerText = "Start";
    startButton.disabled = false;
    stopButton.disabled = true;

    if (state.mediaRecorder) {
        state.mediaRecorder.stop();
        state.mediaRecorder = null;
        console.log("Recording stopped.");
    } else {
        console.error("No active recording to stop.");
    }
});

startButton.addEventListener("click", async (e) => {
    startButton.innerText = "Recording...";
    startButton.disabled = true;
    stopButton.disabled = false;

    if (state.media) {
        state.mediaRecorder = new MediaRecorder(state.media, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            mimeType: "video/webm"
        });

        state.mediaRecorder.ondataavailable = (e) => {
            // console.log("Data available:", e.data);
            socket.emit('stream', e.data);
        };

        state.mediaRecorder.onstart = () => {
            console.log("Recording started.");
        };

        state.mediaRecorder.onstop = () => {
            console.log("Recording stopped and finalized.");
        };

        state.mediaRecorder.onerror = (err) => {
            console.error("MediaRecorder error:", err);
        };

        state.mediaRecorder.start(25);
    } else {
        console.error("No media stream available to record.");
    }
});


window.addEventListener("load", async (e) => {
    try {
        const media = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        state.media = media;
        userVideo.srcObject = media;
    } catch (err) {
        console.error("Error accessing media devices:", err);
    }
});
