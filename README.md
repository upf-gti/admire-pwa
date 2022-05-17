# AdMiRe App

<!-- badges -->

[![node package](https://img.shields.io/badge/node-v16.13.2-brightgreen)](https://nodejs.org/es/) [![npm package](https://img.shields.io/badge/npm-v8.4.1-red)](https://www.npmjs.com/) [![pnpm package](https://img.shields.io/badge/pnpm-v6.29.2-orange)](https://pnpm.io/es/)

<!-- END badges -->

<img src="https://media.githubusercontent.com/media/upf-gti/admire-pwa/master/src/assets/img/logo.png" height="200" align="right">

> The AdMiRe Project is an European Project financed by the Horizon 2020 EU Programme. The project objective is to provide solutions based on Mixed Reality (MR) technologies that will enable audiences at home to be incorporated into the live TV Program they are watching and to interact with people in the TV studio.

###### Project

Currently, TV audiences can only interact with the shows they are watching through social media or hybrid broadcast broadband TV. Additionally, content creators in film, TV or live productions face technical challenges that result in less engaging content. The EU-funded AdMiRe project aims to tackle both these problems by developing, validating and demonstrating innovative solutions based on mixed reality technology. These solutions will enable audiences at home to be incorporated into the live TV programme they are watching and to interact with people in the TV studio. They will also provide content creators with tools that radically improve talent immersion and interaction with computer-generated elements.

###### App

The app serves the following features:
- Offline-capable (via [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/))
- `Add to Home Screen` feature on Android and iOS supported devices to launch the app from the home screen
- Privacy-focused (We don't collect any personal data)
- Lightweight (The app is only ~5MB)
- Dark mode

## Installation

To run the application you need a node/npm environment and execute the following steps:

```bash
npm install -g pnpm
```

Once with `pnpm` installed, run the following command to install the application dependencies:

```bash
pnpm install
```

To run, build or deploy the application, you can use:

```bash
# run app
pnpm start
# build app
pnpm run build
# deply app
pnpm run deploy
```

### Help

If deploy does not work, try cleaning cache, removing node modules and reinstalling again before re-run.

## Resources

- [React-bootstrap 5 Components](https://react-bootstrap.github.io/components/alerts)
- [Darkmode](https://www.cssscript.com/dark-mode-switcher-for-bootstrap-5/#:~:text=An%20experimental%20dark%20mode%20%28dark%20theme%29%20switcher%20for,styles%20for%20Bootstrap%205%20and%20its%20UI%20components)
- [Safari debugging](https://arundhaduti.github.io/2020/06/13/RemoteDebuggingSafari.html)
- [Brainstorm3d](https://admire-dev-lobby.brainstorm3d.com/)
