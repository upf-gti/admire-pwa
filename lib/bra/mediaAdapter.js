"use strict";

export const MediaEvent =
{
	GotDevices:         "got_devices",
	ErrorDevices:       "error_devices",
    GotResolutions:     "got_resolutions",
    GotStream:          "got_stream",
    ErrorStream:        "error_stream"
};

export function MediaAdapter()
{
    let events = { };

    let audioStream = null;
    let videoStream = null;
    let mediaStream = null;

    let audioDevices = { }; // audioDevices[label] = deviceId
    let videoDevices = { }; // videoDevices[label] = deviceId

    let resolutions =
    {
        "Undefined":    { },
        "320x240":      { width: 320,	height: 240 },	// QVGA 4:3
        "640x360":      { width: 640,	height: 360 },	// nHD 16:9
        "640x480":      { width: 640,	height: 480 },	// VGA 4:3
        "1280x720":     { width: 1280,	height: 720 },	// HD 16:9
        "1920x1080":    { width: 1920,	height: 1080 },	// FullHD 16:9
        "3840x2160":    { width: 3840,	height: 2160 },	// 4k 16:9
        //"7680x4320":    { width: 7680,	height: 4320 }	// 8k 16:9
    };

    let audioConstraints =
    {
        audio:
        {
            deviceId: { exact: undefined }
        }
    };

    let videoConstraints =
    {
        video:
        {
            deviceId: { exact: undefined },
            width: { exact: undefined },
            height: { exact: undefined },
            frameRate: { ideal: 60 }
        }
    };

    let settings =
    {
        audio: "None", // label
        video: "None", // label
        resolution: "Undefined", // resolutions key
    };

    let previousAudioConstraints = null;
    let previousVideoConstraints = null;

    /**
     * Add a function that will be called whenever the specified event is emitted.
     */
    let on = function( event, listener )
    {
        if( Object.values(MediaEvent).indexOf(event) == -1 )
        {
            return false;
        }

        if( !(listener instanceof Function) )
        {
            return false;
        }

        if( typeof events[event] !== "object" )
        {
            events[event] = [];
        }

        events[event].push(listener);

        return true;
    };

    /**
     * Remove the function previously added to be called whenever the specified event is emitted.
     */
    let off = function( event, listener )
    {
        if( Object.values(MediaEvent).indexOf(event) == -1 )
        {
            return false;
        }

        if( !(listener instanceof Function) )
        {
            return false;
        }

        if( typeof events[event] === "object" )
        {
            let index = events[event].indexOf(listener);
            if( index > -1 )
            {
                events[event].splice(index, 1);
                return true;
            }
        }

        return false;
    };

    /**
     * Emit the specified event.
     */
    let emit = function( event )
    {
        if( Object.values(MediaEvent).indexOf(event) == -1 )
        {
            return false;
        }

        let args = [].slice.call(arguments, 1);

        if( typeof events[event] === "object" )
        {
            let listeners = events[event].slice();
            for( let i = 0; i < listeners.length; i++ )
            {
                listeners[i].apply(this, args);
            }
        }

        return true;
    };

    /**
     * Start the media adapter.
     */
    let start = async function()
    {
        if( !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices )
        {
            return false;
        }

        // Create a dummy stream.
        audioStream = new SilenceStream();
        videoStream = new BlackStream();
        mediaStream = mixStreams(audioStream, videoStream);

        await window.navigator.mediaDevices.getUserMedia({ audio: true });
        await window.navigator.mediaDevices.getUserMedia({ video: true });
        await findDevices();

        return true;
    };

    /**
     * Find the available input and output devices.
     */
    let findDevices = async function()
    {
        return getDevices().then(gotDevices).catch(errorDevices);
    };

    /**
     * Request a list of the available input and output devices.
     */
    let getDevices = function()
    {
        return window.navigator.mediaDevices.enumerateDevices();
    };

    /**
     * Success handler of the get devices function.
     */
    let gotDevices = function( deviceInfos )
    {
        audioDevices = { };
        videoDevices = { };

        // Add inputs for silence and black streams.
        audioDevices["None"] = "";
        videoDevices["None"] = "";

        let a = 0, v = 0;
        for( let deviceInfo of deviceInfos )
        {
            if( deviceInfo.kind === "audioinput" )
            {
                let label = (deviceInfo.label === "" ) ? ("Audio input " + a) : deviceInfo.label;
                audioDevices[label] = deviceInfo.deviceId;
                a++;
            }

            if( deviceInfo.kind === "videoinput" )
            {
                let label = (deviceInfo.label === "" ) ? ("Video input " + v) : deviceInfo.label;
                videoDevices[label] = deviceInfo.deviceId;
                v++;
            }
        }

        emit(MediaEvent.GotDevices, { audioDevices: audioDevices, videoDevices: videoDevices, settings: settings });
        emit(MediaEvent.GotResolutions, { resolutions: resolutions, settings: settings });
    };

    /**
     * Error handler of the get devices function.
     */
    let errorDevices = function( error )
    {
        let message = "Device request not allowed in the browser";
        emit(MediaEvent.ErrorDevices, { error: error, message: message });
    };

    /**
     * Set the audio device.
     */
    let setAudio = function( device )
    {
        if( !device )
        {
            device = "None";
        }

        if( !(device in audioDevices) )
        {
            let error = "DeviceNotFound";
            let message = "Audio device " + device + " not found";
            emit(MediaEvent.ErrorStream, { error: error, message: message, settings: settings });
            device = "None";
        }

        if( device === "None" )
        {
            // Update settings.
            settings.audio = device;

            // Get dummy stream.
            audioStream = new SilenceStream();
            mediaStream = mixStreams(audioStream, videoStream);

            emit(MediaEvent.GotStream, { stream: mediaStream, settings: settings });
        }
        else
        {
            // Save previous constraints.
            previousAudioConstraints = clone(audioConstraints);

            // Update constraints.
            let deviceId = audioDevices[device];
            audioConstraints.audio.deviceId.exact = deviceId;

            getAudioStream();
        }
    };

    /**
     * Set the video device and resolution.
     */
    let setVideo = function( device, resolution = "Undefined" )
    {
        if( !device )
        {
            device = "None";
            resolution = "Undefined";
        }

        if( !resolution )
        {
            resolution = "Undefined";
        }

        if( !(device in videoDevices) )
        {
            let error = "DeviceNotFound";
            let message = "Video device " + device + " not found";
            emit(MediaEvent.ErrorStream, { error: error, message: message, settings: settings });
            device = "None";
        }

        if( !(resolution in resolutions) )
        {
            let error = "ResolutionNotFound";
            let message = "Resolution " + resolution + " not found";
            emit(MediaEvent.ErrorStream, { error: error, message: message, settings: settings });
            resolution = "Undefined";
        }

        if( device === "None" )
        {
            // Update settings.
            settings.video = device;
            settings.resolution = resolution;

            // Get dummy stream.
            let width = resolutions[resolution].width;
            let height = resolutions[resolution].height;
            videoStream = new BlackStream(width, height);
            mediaStream = mixStreams(audioStream, videoStream);

            emit(MediaEvent.GotStream, { stream: mediaStream, settings: settings });
        }
        else
        {
            // Save previous constraints.
            previousVideoConstraints = clone(videoConstraints);

            // Update constraints.
            let deviceId = videoDevices[device];
            videoConstraints.video.deviceId.exact = deviceId;
            let width = resolutions[resolution].width;
            let height = resolutions[resolution].height;
            videoConstraints.video.width.exact = width;
            videoConstraints.video.height.exact = height;

            getVideoStream();
        }
    };

    /**
     * Request an audio stream.
     */
    let getAudioStream = function()
    {
        mediaStream = null;
        stopStream(audioStream);
        return window.navigator.mediaDevices.getUserMedia(audioConstraints).then(gotAudioStream).catch(errorAudioStream);
    };

    /**
     * Request a video stream.
     */
    let getVideoStream = function()
    {
        mediaStream = null;
        stopStream(videoStream);
        return window.navigator.mediaDevices.getUserMedia(videoConstraints).then(gotVideoStream).catch(errorVideoStream);
    };

    /**
     * Success handler of the get audio stream function.
     */
    let gotAudioStream = async function( stream )
    {
        let audioTrack = stream.getAudioTracks()[0];

        // Check whether the label is listed, enumerateDevices returns an empty label if the permission for accessing the mediadevice is not given.
        if( !(audioTrack.label in audioDevices) )
        {
            await findDevices();
        }

        // Update settings.
        settings.audio = audioTrack.label;

        audioStream = stream;
        mediaStream = mixStreams(audioStream, videoStream);

        emit(MediaEvent.GotStream, { stream: mediaStream, settings: settings });
    };

    /**
     * Success handler of the get video stream function.
     */
    let gotVideoStream = async function( stream )
    {
        // Video track.
        let videoTrack = stream.getVideoTracks()[0];
        let videoTrackSettings = videoTrack.getSettings();

        // Check whether the label is listed, enumerateDevices returns an empty label if the permission for accessing the mediadevice is not given.
        if( !(videoTrack.label in videoDevices) )
        {
            await findDevices();
        }

        // Check whether the resolution is already listed.
        let width = videoTrackSettings.width;
        let height = videoTrackSettings.height;
        let resolution = width + "x" + height;
        if( !resolutions[resolution] )
        {
            // Add the resolution.
            resolutions[resolution] = { width: width, height: height };

            // Sort resolutions.
            resolutions = Object.entries(resolutions).sort((a, b) => (a[1].width || Number.NEGATIVE_INFINITY) > (b[1].width || Number.NEGATIVE_INFINITY)).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            emit(MediaEvent.GotResolutions, { resolutions: resolutions, settings: settings });
        }

        // Update video constraints.
        videoConstraints.video.width.exact = width;
        videoConstraints.video.height.exact = height;

        // Update settings.
        settings.video = videoTrack.label;
        settings.resolution = resolution;

        videoStream = stream;
        mediaStream = mixStreams(audioStream, videoStream);

        emit(MediaEvent.GotStream, { stream: mediaStream, settings: settings });
    };

    /**
     * Return a semantic error string from the specified error.
     */
    let errorStream = function( error )
    {
        let message = "";
        if( error.name === "NotFoundError" || error.name === "DevicesNotFoundError" )
        {
            message = "Required track is missing";
        }
        else if( error.name === "NotReadableError" || error.name === "TrackStartError" )
        {
            message = "Microphone or Webcam are already in use";
        }
        else if( error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError" )
        {
            //message = "Constraints cannot be satisfied";
            message = "Invalid device settings";
        }
        else if( error.name === "NotAllowedError" || error.name === "PermissionDeniedError" )
        {
            message = "Permission denied in browser";
        }
        else if( error.name === "TypeError" || error.name === "TypeError" )
        {
            message = "Empty constraints object";
        }
        else
        {
            message = "Unknown error";
        }

        return message;
    };

    /**
     * Error handler of the get audio stream function.
     */
    let errorAudioStream = function( error )
    {
        let message = errorStream(error);
        emit(MediaEvent.ErrorStream, { error: error.name, message: message, settings: settings });

        if( previousAudioConstraints )
        {
            audioConstraints = clone(previousAudioConstraints);
            previousAudioConstraints = null;
            getAudioStream();
        }
    };

    /**
     * Error handler of the get video stream function.
     */
    let errorVideoStream = function( error )
    {
        let message = errorStream(error);
        emit(MediaEvent.ErrorStream, { error: error.name, message: message, settings: settings });

        if( previousVideoConstraints )
        {
            videoConstraints = clone(previousVideoConstraints);
            previousVideoConstraints = null;
            getVideoStream();
        }
    };

    /**
     * Mix two streams with 1 audio and 1 video tracks into one.
     */
    let mixStreams = function( audioStream, videoStream )
    {
        let audioTracks = audioStream.getAudioTracks();
        if( !audioTracks || audioTracks.length === 0 )
        {
            return null;
        }

        let videoTracks = videoStream.getVideoTracks();
        if( !videoTracks || videoTracks.length === 0 )
        {
            return null;
        }

        let stream = new MediaStream();
        stream.addTrack(audioTracks[0]);
        stream.addTrack(videoTracks[0]);

        return stream;
    };

    /**
     * Stop a stream, stopping its tracks.
     */
    let stopStream = function( stream )
    {
        stream.getTracks().forEach(track => track.stop());
    };

    /**
     * Return a clone of the object.
     */
    let clone = function( object )
    {
        return JSON.parse(JSON.stringify(object));
    };

    return {
        on,
        off,
        start,
        findDevices,
        getDevices,
        setAudio,
        setVideo
    };
}

export function SilenceTrack()
{
    let stream = new SilenceStream();
    let track = stream.getAudioTracks()[0];
    return track;
}

export function BlackTrack( width = 320, height = 240 )
{
    let stream = new BlackStream(width, height);
    let track = stream.getVideoTracks()[0];
    return track;
}

export function SilenceStream()
{
    let audioContext = new AudioContext();

    let gainNode = audioContext.createGain();
    let oscillatorNode = audioContext.createOscillator();
    oscillatorNode.connect(gainNode);
    let destination = gainNode.connect(audioContext.createMediaStreamDestination());

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    oscillatorNode.start();

    let stream = destination.stream;
    return stream;
}

export function BlackStream( width = 320, height = 240 )
{
    let canvas = window.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext("2d");
    let interval = null;
    function render()
    {
        if( !context )
        {
            window.clearInterval(interval);
            return;
        }

        context.fillRect(0, 0, width, height);
        // context.beginPath();
        // context.rect(0, 0, width, height);
        // context.fillStyle = "blue";
        // context.fill();
    }
    interval = window.setInterval(render, 1000);

    let stream = canvas.captureStream();
    return stream;
}

export function DummyStream()
{
    let silenceStream = new SilenceStream();
    let blackStream = new BlackStream();
    let silenceTrack = silenceStream.getAudioTracks()[0];
    let blackTrack = blackStream.getVideoTracks()[0];
    let stream = new MediaStream([silenceTrack, blackTrack]);

    /**
     * Return the audio track.
     */
    let getAudioTrack = function()
    {
        return silenceTrack;
    };

    /**
     * Return the video track.
     */
    let getVideoTrack = function()
    {
        return blackTrack;
    };

    /**
     * Return the stream.
     */
    let getStream = function()
    {
        return stream;
    };

    return {
        getAudioTrack,
        getVideoTrack,
        getStream
    };
}