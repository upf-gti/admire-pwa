// eslint-disable

//import AdapterJS from 'adapterjs';
import { RTCEvent,   RTCClient }    from "./rtcClient.js";  // eslint-disable-line
import { LobbyEvent, LobbyClient }  from './lobbyClient.js';      // eslint-disable-line
import { MediaEvent, MediaAdapter } from "./mediaAdapter.js";   // eslint-disable-line
import { DummyStream }  from "./dummyStream.js";

const DEBUG = process.env.REACT_APP_DEBUG ?? false;

let appClient    = window.appClient    = new LobbyClient({ debug: DEBUG }),
    mediaAdapter = window.mediaAdapter = new MediaAdapter({ debug: DEBUG }),
    dummyStream  = window.dummyStream  = new DummyStream({ debug: DEBUG }),
    rtcClient    = window.rtcClient    = new RTCClient(dummyStream.getStream());

let APPEvent = LobbyEvent;

window.BRA = {
    APPEvent,
    RTCEvent,
    MediaEvent,
    rtcClient, 
    appClient,
    mediaAdapter,
    dummyStream
}

export {
   APPEvent,
   RTCEvent,
   MediaEvent,
   rtcClient, 
   appClient,
   mediaAdapter,
   dummyStream
}