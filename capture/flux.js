const { desktopCapturer, screen } = require('electron')
 
window.addEventListener('load', () => {

    const videoElement = document.querySelector('video');
    const audioSelect = document.querySelector('select#audioSource');
    const videoSelect = document.querySelector('select#videoSource');

    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices).then(getStream).catch(handleError);

    audioSelect.onchange = getStream;
    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label ||
                    'microphone ' + (audioSelect.length + 1);
                audioSelect.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || 'camera ' +
                    (videoSelect.length + 1);
                videoSelect.appendChild(option);
            } else {
                console.log('Found another kind of device: ', deviceInfo);
            }
        }
    }

    function getStream() {
        if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        const { width, height } = window.screen
        console.log(width)
        const constraints = {
            audio: {
                deviceId: { exact: audioSelect.value }
            },
            video: {
                deviceId: { exact: videoSelect.value },
                frameRate: { ideal: 60 },
                width: width,
                heigth: height * 0.50
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).
            then(gotStream).catch(handleError);
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        videoElement.srcObject = stream;
    }

    function handleError(error) {
        console.error('Error: ', error);
    }

    document.getElementById('fullScreenMode').addEventListener('click', () => {
      //  document.getElementById('menuToggle').style.display = 'none'
        videoElement.requestFullscreen()
        getStream()
     
    })
    document.addEventListener("fullscreenchange", function( event ) {

       console.log( document.fullscreenElement)
    
    });
})