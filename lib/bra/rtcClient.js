"use strict";

const PING_PERIOD = 5 * 1000;
const DEBUG_STYLE = "background: hsla(0, 0%, 13%, 1); color: hsla(74, 64%, 60%, 1)";

export const RTCEvent =
{
	ClientConnected:        "client_connected",
	ClientDisconnected:     "client_disconnected",
    Error:                  "error",
    IncomingCall:           "incoming_call",
    CallAccepted:           "call_accepted",
    CallCanceled:           "call_canceled",
    CallOpened:             "call_opened",
    CallClosed:             "call_closed",
    CallHangup:             "call_hangup"
};

export function RTCClient( defaultStream )
{
//#region Variables
    if( !defaultStream )
    {
        defaultStream = new MediaStream();
    }

    let responses = { };
    let events = { };

    let token = null;
    let calls = { };
    let socket = null;
    let keepAliveTimeout = null;
//#endregion

//#region Methods
    /**
     * Add a function that will be called whenever the specified event is emitted.
     */
    let on = function( event, listener )
    {
        if( Object.values(RTCEvent).indexOf(event) == -1 )
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
        if( Object.values(RTCEvent).indexOf(event) == -1 )
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
        if( Object.values(RTCEvent).indexOf(event) == -1 )
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
     * Connect to the server.
     */
    let connect = function( url, accessToken )
    {
        token = accessToken;
        socket = new WebSocket(url + "?token=" + token);

        socket.onopen = onOpen;
        socket.onmessage = onMessage;
        socket.onclose = onClose;
    };

    /**
     * Disconnect from the server.
     */
    let disconnect = function()
    {
        socket?.close();
    };

    /**
     * Event handler called when the connection is opened.
     */
    let onOpen = function( event )
    {
        console.log("%c" + "connected" + "%o", DEBUG_STYLE, socket.url);
        startKeepAlive();
        emit(RTCEvent.ClientConnected, { url: socket.url });
    };

    /**
     * Event handler called when the connection is closed.
     */
    let onClose = function( event )
    {
        console.log("%c" + "disconnected" + "%o", DEBUG_STYLE, socket.url);
        stopKeepAlive();
        emit(RTCEvent.ClientDisconnected, { url: socket.url });
    };

    /**
     * Event handler called when a message is received from the server.
     */
    let onMessage = function( msg )
    {
        let message = JSON.parse(msg.data);
        if( message.event === "pong" )
        {
            return;
        }

        console.log(" %c%s" + "%o", DEBUG_STYLE, message.event, message.data);

        // Check whether the message needs internal handling.
        switch( message.event )
        {
            case "call_response":           handleCallResponse(message);            break;
            case "incoming_call":           handleIncomingCall(message);            break;
            case "call_accepted":           handleCallAccepted(message);            break;
            case "call_canceled":           handleCallCanceled(message);            break;
            case "remote_offer":            handleRemoteOffer(message);             break;
            case "remote_answer":           handleRemoteAnswer(message);            break;
            case "remote_candidate":        handleRemoteCandidate(message);         break;
            case "call_hangup":             handleCallHangup(message);              break;
        }

        // Check whether the message has a response listener.
        if( message.data.uuid in responses )
        {
            let response = responses[message.data.uuid];
            delete responses[message.data.uuid];
            delete message.data.uuid;
            response(message);
            return;
        }

        // Check whether the message has an event.
        emit(message.event, message);
    };

    /**
     * Send a message to the server.
     */
    let sendMessage = function( message, response )
    {
        if( !socket || socket.readyState !== WebSocket.OPEN )
        {
            return false;
        }

        // Set the token.
        message.data.token = token;

        // Generate a UUID.
        message.data.uuid = uuid();

        // Add the response listener.
        if( response instanceof Function )
        {
            responses[message.data.uuid] = response;
        }

        // Send the message.
        let msg = JSON.stringify(message);
        socket.send(msg);
        if( message.event !== "ping" )
        {
            console.log(" %c%s" + "%o", DEBUG_STYLE, message.event, msg);
        }

        return true;
    };

    /**
     * Start a keep alive timeout.
     */
    let startKeepAlive = function()
    {
        if( !socket || socket.readyState !== WebSocket.OPEN )
        {
            return;
        }

        ping();

        keepAliveTimeout = window.setTimeout(startKeepAlive, PING_PERIOD);
    };

    /**
     * Stop the keep alive timeout.
     */
    let stopKeepAlive = function()
    {
        window.clearTimeout(keepAliveTimeout);
    };

    /**
     * Send a ping to the server.
     */
    let ping = function()
    {
        let message =
        {
            event: "ping",
            data: { }
        };
        return sendMessage(message);
    };

    /**
     * Get the specified call.
     */
    let getCall = function( callid )
    {
        return (callid in calls) ? calls[callid] : null;
    };

    /**
     * Get all the calls.
     */
    let getCalls = function()
    {
        return calls;
    };

    /**
     * Call a user.
     * @param {Object} options - Optional parameters: callid, response.
     */
    let call = function( callee, options = {} )
    {
        let msg =
        {
            event: "call",
            data:
            {
                callee: callee,
                callid: options?.callid
            }
        };
        return sendMessage(msg, options?.response);
    };

    /**
     * Close a call.
     */
    let closeCall = function( callid )
    {
        if( !(callid in calls) )
        {
            return false;
        }

        let call = calls[callid];
        call.close();
        delete(calls[callid]);

        emit(RTCEvent.CallClosed, { call: call });

        return true;
    };

    /**
     * Accept a call.
     * @param {Object} options - Optional parameters: response.
     */
    let acceptCall = function( callid, options = {} )
    {
        if( !(callid in calls) )
        {
            return false;
        }

        let call = calls[callid];

        let msg =
        {
            event: "accept_call",
            data:
            {
                callid: call.callid
            }
        };
        return sendMessage(msg, options?.response);
    };

    /**
     * Cancel a call.
     * @param {Object} options - Optional parameters: response.
     */
    let cancelCall = function( callid, options = {} )
    {
        if( !(callid in calls) )
        {
            return false;
        }

        // Delete the call.
        let call = calls[callid];
        delete calls[callid];

        let msg =
        {
            event: "cancel_call",
            data:
            {
                callid: call.callid
            }
        };
        return sendMessage(msg, options?.response);
    };

    /**
     * Hang up a call. If call ID is undefined then all calls are hang up.
     * @param {Object} options - Optional parameters: response.
     */
    let hangup = function( callid, options = {} )
    {
        if( callid ) // Close the call.
        {
            if( !closeCall(callid) )
            {
                return false;
            }

            let msg =
            {
                event: "hangup",
                data:
                {
                    callid: callid
                }
            };
            return sendMessage(msg, options?.response);
        }
        else // Close all the calls.
        {
            for( let id in calls )
            {
                if( !closeCall(id) )
                {
                    continue;
                }

                let msg =
                {
                    event: "hangup",
                    data:
                    {
                        callid: id
                    }
                };
                sendMessage(msg);
            }

            calls = { };

            return true;
        }
    };

    /**
     * Generate a universally unique identifier.
     * Reference: RFC 4122 https://www.ietf.org/rfc/rfc4122.txt
     */
    let uuid = function()
    {
        return uuidv4();
    };

    /**
     * Generate a universally unique identifier v4.
     * Reference: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
     */
    let uuidv4 = function()
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };
//#endregion

//#region EventHandlers
    /**
     * Call response event handler.
     */
    let handleCallResponse = function( event )
    {
        // Create the call.
        let call = new RTCCall(event.data.callid, event.data.caller, event.data.callee, JSON.parse(event.data.iceServers));
        calls[call.callid] = call;
    };

    /**
     * Incoming call event handler.
     */
    let handleIncomingCall = function( event )
    {
        // Create the call.
        let call = new RTCCall(event.data.callid, event.data.caller, event.data.callee, JSON.parse(event.data.iceServers));
        calls[call.callid] = call;
    };

    /**
     * Call accepted event handler.
     */
    let handleCallAccepted = function( event )
    {
        // Create the peer connection.
        let call = calls[event.data.callid];
        let rtcConfiguration = { iceServers: call.iceServers };
        let peerConnection = new RTCPeerConnection(rtcConfiguration);
        call.bind(peerConnection, true);

        // Handle the peer connection lifecycle.
        peerConnection.oniceconnectionstatechange = function( other )
        {
            handleIceConnectionStateChange(call);
        }

        // Generate candidates.
        peerConnection.onicecandidate = function( other )
        {
            if( !other.candidate || other.candidate === "" ) // Empty if the RTCIceCandidate is an "end of candidates" indicator.
            {
                return;
            }

            let msg =
            {
                event: "candidate",
                data:
                {
                    callid: event.data.callid,
                    candidate: JSON.stringify(other.candidate)
                }
            };
            sendMessage(msg);
        };

        peerConnection.onnegotiationneeded = function( other )
        {
            // Generate offer.
            peerConnection.createOffer().then(function( sdp )
            {
                // Set caller local description.
                peerConnection.setLocalDescription(sdp);

                let msg =
                {
                    event: "offer",
                    data:
                    {
                        callid: event.data.callid,
                        offer: JSON.stringify(sdp)
                    }
                };
                sendMessage(msg);
            });
        };

        // Add the tracks. This action triggers the ICE negotiation process.
        let tracks = defaultStream.getTracks();
        tracks.forEach(track => peerConnection.addTrack(track));

        // Create a default data channel to avoid renegotiation.
        peerConnection.createDataChannel("default");
    };

    /**
     * Call canceled event handler.
     */
    let handleCallCanceled = function( event )
    {
        closeCall(event.data.callid);
    };

    /**
     * Remote offer event handler.
     */
    let handleRemoteOffer = function( event )
    {
        // Create the peer connection.
        let call = calls[event.data.callid];
        let rtcConfiguration = { iceServers: call.iceServers };
        let peerConnection = new RTCPeerConnection(rtcConfiguration);
        call.bind(peerConnection, false);

        // Handle the peer connection lifecycle.
        peerConnection.oniceconnectionstatechange = function( other )
        {
            handleIceConnectionStateChange(call);
        }

        // Set the callee remote description.
        peerConnection.setRemoteDescription(JSON.parse(event.data.offer));

        // Gather the pending candidates.
        call.gatherPendingCandidates();

        // Generate the candidates.
        peerConnection.onicecandidate = function( other )
        {
            if( !other.candidate || other.candidate === "" ) // Empty if the RTCIceCandidate is an "end of candidates" indicator.
            {
                return;
            }

            let msg =
            {
                event: "candidate",
                data:
                {
                    callid: event.data.callid,
                    candidate: JSON.stringify(other.candidate)
                }
            };
            sendMessage(msg);
        };

        // Add the tracks.
        let tracks = defaultStream.getTracks();
        tracks.forEach(track => peerConnection.addTrack(track));

        // Create the answer.
        window.setTimeout(function()
        {
            peerConnection.createAnswer().then(function( sdp )
            {
                // Set the callee local description.
                peerConnection.setLocalDescription(sdp);

                let msg =
                {
                    event: "answer",
                    data:
                    {
                        callid: event.data.callid,
                        answer: JSON.stringify(sdp)
                    }
                };
                sendMessage(msg);
            });
        }, 500);
    };

    /**
     * Remote answer event handler.
     */
    let handleRemoteAnswer = function( event )
    {
        if( event.data.callid in calls )
        {
            let answer = JSON.parse(event.data.answer);

            // Set the caller remote description.
            calls[event.data.callid].setRemoteDescription(answer);
        }
    };

    /**
     * Remote candidate event handler.
     */
    let handleRemoteCandidate = function( event )
    {
        let candidate = JSON.parse(event.data.candidate);
        if( !candidate || !candidate.candidate || candidate.candidate === "" ) // Empty if the RTCIceCandidate is an "end of candidates" indicator.
        {
            return;
        }

        if( event.data.callid in calls )
        {
            let call = calls[event.data.callid];
            call.addCandidate(candidate);
        }
    };

    /**
     * Call hangup event handler.
     */
    let handleCallHangup = function( event )
    {
        closeCall(event.data.callid);
    };

    /**
     * ICE connection state change event handler.
     */
    let handleIceConnectionStateChange = async function( call )
    {
        let state = call.getState();
        console.log("%c" + "Connection State" + "%o%o", DEBUG_STYLE, call.callid, state);

        switch( state )
        {
            case "failed":
            case "disconnected":
            case "closed":
            {
                hangup(call.callid);
                break;
            }
            case "new":
            case "checking":
            case "completed":
            {
                break;
            }
            case "connected":
            {
                let stream = call.getRemoteStream();
                console.log("%c" + RTCEvent.CallOpened + "%o%o", DEBUG_STYLE, call.callid, stream);
                emit(RTCEvent.CallOpened, { call: call, stream: stream });
                break;
            }
        }
    };
//#endregion

    return {
        on,
        off,
        connect,
        disconnect,
        getCall,
        getCalls,
        call,
        acceptCall,
        cancelCall,
        hangup
    };
}

export function RTCCall( callid, caller, callee, iceServers )
{
//#region Variables
    let connection = null;
    let candidates = [];
    let channels = { };
    let initiator = false;
//#endregion

//#region Methods
    /**
     * Bind the call to a peer connection.
     */
    let bind = function( peerConnection, isInitiator )
    {
        if( !(peerConnection instanceof RTCPeerConnection) )
        {
            return false;
        }

        connection = peerConnection;
        initiator = isInitiator;

        // Handle the data channel event internally to track the data channels lifecycle.
        connection.addEventListener("datachannel", function( event )
        {
            channels[event.channel.label] = event.channel;

            // Handle the close event.
            event.channel.addEventListener("onclose", function( event )
            {
                delete channels[event.channel.label];
            });
        });

        return true;
    };

    /**
     * Close the call.
     */
    let close = function()
    {
        connection?.close();
    };

    /**
     * Return whether the user is the initiator.
     */
    let isInitiator = function()
    {
        return initiator;
    };

    /**
     * Get the call state.
     */
    let getState = function()
    {
        return (connection) ? connection.iceConnectionState : "closed";
    };

    /**
     * Get the call stats.
     */
    let getStats = async function()
    {
        if( !connection )
        {
            return;
        }

        let callStats = { callid: callid, caller: caller, callee: callee };

        return await connection.getStats(null).then(function( stats )
        {
            // Get the stats of the succeeded candidate pair.
            let pairStats = null;
            stats.forEach(report =>
            {
                //console.log(report);
                if( report.type === "candidate-pair" && (report.selected === true || report.state === "succeeded") )
                {
                    pairStats = report;
                }
            });

            // Get the stats of the local and remote candidates.
            if( pairStats )
            {
                stats.forEach(report =>
                {
                    if( report.id === pairStats.localCandidateId )
                    {
                        callStats.localType = report.candidateType;
                        callStats.localAddress = report.address ?? report.ip;
                        callStats.localPort = report.port;
                        callStats.localProtocol = report.protocol;
                    }
                    if( report.id === pairStats.remoteCandidateId )
                    {
                        callStats.remoteType = report.candidateType;
                        callStats.remoteAddress = report.address ?? report.ip;
                        callStats.remotePort = report.port;
                        callStats.remoteProtocol = report.protocol;
                    }
                });
            }

            return Promise.resolve(callStats);
        });
    };

    /**
     * Add a candidate or save it for gathering.
     */
    let addCandidate = function( candidate )
    {
        if( !connection )
        {
            candidates.push(candidate);
        }
        else
        {
            connection.addIceCandidate(candidate);
        }
    };

    /**
     * Gather the pending candidates.
     */
    let gatherPendingCandidates = function()
    {
        if( candidates.length > 0 )
        {
            candidates.forEach(candidate => connection.addIceCandidate(candidate));
            candidates = [];
        }
    };

    /**
     * Set the remote session description.
     */
    let setRemoteDescription = function( description )
    {
        if( !connection )
        {
            return false;
        }

        connection.setRemoteDescription(description);

        return true;
    };

    /**
     * [NYI] Set the stream's bandwidth.
     * References:
     * https://webrtchacks.com/limit-webrtc-bandwidth-sdp/
     * https://stackoverflow.com/questions/57653899/how-to-increase-the-bitrate-of-webrtc
     */
    let setBandwidth = function( bandwidth )
    {
        if( !connection )
        {
            return false;
        }

        let senders = connection.getSenders();
        if( !senders )
        {
            return false;
        }

        for( let i = 0; i < senders.length; i++ )
        {
            let sender = senders[i];
            let parameters = sender.getParameters();
            if( !parameters.encodings )
            {
                parameters.encodings = [{ }];
            }

            parameters.encodings[0].maxBitrate = bandwidth * 1000;

            sender.setParameters(parameters);
        }

        return true;
    };

    /**
     * Get the remote audio track specified by index.
     */
    let getRemoteAudioTrack = function ( index = 0 )
    {
        if( !connection )
        {
            return null;
        }

        let receivers = connection.getReceivers();
        if( !receivers )
        {
            return null;
        }

        let tracks = [];
        for( let i = 0; i < receivers.length; i++ )
        {
            let receiver = receivers[i];
            if( receiver.track.kind === "audio" )
            {
                tracks.push(receiver.track);
            }
        }

        if( index >= 0 && index < tracks.length )
        {
            return tracks[index];
        }

        return null;
    };

    /**
     * Get the remote video track specified by index.
     */
    let getRemoteVideoTrack = function ( index = 0 )
    {
        if( !connection )
        {
            return null;
        }

        let receivers = connection.getReceivers();
        if( !receivers )
        {
            return null;
        }

        let tracks = [];
        for( let i = 0; i < receivers.length; i++ )
        {
            let receiver = receivers[i];
            if( receiver.track.kind === "video" )
            {
                tracks.push(receiver.track);
            }
        }

        if( index >= 0 && index < tracks.length )
        {
            return tracks[index];
        }

        return null;
    };

    /**
     * Get the remote stream of the peer connection composed by all the audio and video tracks.
     */
    let getRemoteStream = function()
    {
        if( !connection )
        {
            return null;
        }

        let receivers = connection.getReceivers();
        if( !receivers )
        {
            return null;
        }

        let tracks = [];
        for( let i = 0; i < receivers.length; i++ )
        {
            let receiver = receivers[i];
            if( receiver.track )
            {
                tracks.push(receiver.track);
            }
        }

        if( tracks.length === 0 )
        {
            return null;
        }

        let stream = new MediaStream();
        for( let i = 0; i < tracks.length; i++ )
        {
            let track = tracks[i];
            stream.addTrack(track);
        }

        return stream;
    };

    /**
     * Replace the local audio track specified by index.
     */
    let replaceLocalAudioTrack = function( track, index = 0 )
    {
        if( !connection || !track )
        {
            return false;
        }

        let audioSenders = [];
        let senders = connection.getSenders();
        for( let i = 0; i < senders.length; i++ )
        {
            let sender = senders[i];
            if( sender.track && sender.track.kind === "audio" )
            {
                audioSenders.push(sender);
            }
        }

        if( index >= 0 && index < audioSenders.length )
        {
            audioSenders[index].replaceTrack(track);
            return true;
        }

        return false;
    };

    /**
     * Replace the local video track specified by index.
     */
    let replaceLocalVideoTrack = function( track, index = 0 )
    {
        if( !connection || !track )
        {
            return false;
        }

        let videoSenders = [];
        let senders = connection.getSenders();
        for( let i = 0; i < senders.length; i++ )
        {
            let sender = senders[i];
            if( sender.track && sender.track.kind === "video" )
            {
                videoSenders.push(sender);
            }
        }

        if( index >= 0 && index < videoSenders.length )
        {
            videoSenders[index].replaceTrack(track);
            return true;
        }

        return false;
    };
//#endregion

//#region DataChannel
    /**
     * Open a data channel.
     */
    let openChannel = function( label )
    {
        if( !connection || label in channels )
        {
            return false;
        }

        let channel = connection.createDataChannel(label);
        channels[label] = channel;

        // Handle the close event.
        channel.addEventListener("onclose", function( event )
        {
            delete channels[channel.label];
        });

        return true;
    };

    /**
     * Close a data channel.
     */
    let closeChannel = function( label )
    {
        if( !connection || !(label in channels) )
        {
            return false;
        }

        let channel = channels[label];
        channel.close();
        delete channels[label];

        return true;
    };

    /**
     * Set a callback for the data channel event.
     */
    let onDataChannel = function( callback )
    {
        if( !connection )
        {
            return false;
        }

        connection.addEventListener("datachannel", callback);

        return true;
    };

    /**
     * Set a callback to a data channel open event.
     */
    let onChannelOpen = function( label, callback )
    {
        if( !connection || !(label in channels) || !(callback instanceof Function) )
        {
            return false;
        }

        let channel = channels[label];
        channel.onopen = callback;

        return true;
    };

    /**
     * Set a callback to a data channel close event.
     */
    let onChannelClose = function( label, callback )
    {
        if( !connection || !(label in channels) || !(callback instanceof Function) )
        {
            return false;
        }

        let channel = channels[label];
        channel.addEventListener("onclose", callback);

        return true;
    };

    /**
     * Set a callback to a data channel error event.
     */
    let onChannelError = function( label, callback )
    {
        if( !connection || !(label in channels) || !(callback instanceof Function) )
        {
            return false;
        }

        let channel = channels[label];
        channel.onerror = callback;

        return true;
    };

    /**
     * Set a callback to a data channel message event.
     */
    let onChannelMessage = function( label, callback )
    {
        if( !connection || !(label in channels) || !(callback instanceof Function) )
        {
            return false;
        }

        let channel = channels[label];
        channel.onmessage = callback;

        return true;
    };

    /**
     * Send data through an opened channel.
     */
    let sendData = function( label, data )
    {
        if( !connection || !(label in channels) )
        {
            return false;
        }

        let channel = channels[label];
        if( channel.readyState !== "open" )
        {
            return false;
        }

        channel.send(data);

        return true;
    };
//#endregion

    return {
        get callid() { return callid; },
        get caller() { return caller; },
        get callee() { return callee; },
        get iceServers() { return iceServers; },
        bind,
        close,
        isInitiator,
        getState,
        getStats,
        addCandidate,
        gatherPendingCandidates,
        setRemoteDescription,
        setBandwidth,
        getRemoteAudioTrack,
        getRemoteVideoTrack,
        getRemoteStream,
        replaceLocalAudioTrack,
        replaceLocalVideoTrack,
        openChannel,
        closeChannel,
        onDataChannel,
        onChannelOpen,
        onChannelClose,
        onChannelError,
        onChannelMessage,
        sendData
    };
}