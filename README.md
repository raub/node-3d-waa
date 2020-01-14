# Node.js 3D WebAudio

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://nodei.co/npm/3d-webaudio-raub.png?compact=true)](https://www.npmjs.com/package/3d-webaudio-raub)

[![Build Status](https://api.travis-ci.com/node-3d/3d-webaudio-raub.svg?branch=master)](https://travis-ci.com/node-3d/3d-webaudio-raub)
[![CodeFactor](https://www.codefactor.io/repository/github/node-3d/3d-webaudio-raub/badge)](https://www.codefactor.io/repository/github/node-3d/3d-webaudio-raub)

> npm i 3d-webaudio-raub


## Synopsis

WebAudio plugin for Node.js 3D Core.

This plugin injects WebAudio API into Node3D's `window`.

```
const { webaudio, window } = init({ plugins: ['3d-webaudio-raub'] });
// webaudio.AudioContext === window.AudioContext === global.AudioContext
```

**This module is WORK IN PROGRESS.** Some features are missing for good.

---

First, import/init the plugin:

```
const init3dCore = require('3d-core-raub');

const { webaudio, window } = init3dCore({ plugins: ['3d-qml-raub'] });

// webaudio.AudioContext === window.AudioContext === global.AudioContext

// ...
```

For the full contents of currently exported `webaudio` object, see the
docs of [webaudio-raub](https://github.com/node-3d/webaudio-raub). This plugin
reexports those as is.
