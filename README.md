<h1 align="center">opencc-extension</h1>

<p align="center"><img src="./1.gif" width="50%" /></p>

A browser extension that converts all text in the current active tab between different Chinese variants.

> This extension is powered by [opencc-js](https://github.com/nk2028/opencc-js),
> which is a JavaScript API wrapper based on the great [OpenCC](https://github.com/BYVoid/OpenCC) project.

Most of the variants supported by OpenCC are supported:

- `cn`: Simplified Chinese (Mainland China)
- `hk`: Traditional Chinese (Hong Kong)
- `tw`: Traditional Chinese (Taiwan)
  - `twp`: Traditional Chinese (Taiwan) with native phrases
- ~~`t`: Traditional Chinese (OpenCC standard)~~
- ~~`jp`: Japanese Shinjitai~~

Only Chrome and Firefox are tested.
Other browsers may also work but are not guaranteed to.

## Features

- Minimalist user interface.
- Fast performance (using [`TreeWalker`](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)).
- Converts dynamically rendered text in [auto mode](#auto-mode)
  (using [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)).
- Other features of OpenCC.
  - 嚴格區分「一簡對多繁」和「一簡對多異」。
  - 完全兼容異體字，可以實現動態替換。
  - 嚴格審校一簡對多繁詞條，原則爲「能分則不合」。
  - 支持中國大陸、臺灣、香港異體字和地區習慣用詞轉換，如「裏」「裡」、「鼠標」「滑鼠」。

## Installation

> This extension will soon be available on
> [Chrome Web Store](https://chrome.google.com/webstore) and [Firefox Add-ons](https://addons.mozilla.org).

### Manually

1. Download [`opencc.zip`]() from [releases](https://github.com/tnychn/opencc-extension/releases/latest).
2. Extract the zip file.
3. Load the extension in broswer:

**Chrome**

4. Navigate to [`chrome://extensions`](chrome://extensions).
5. Enable developer mode.
6. Load unpacked from the extracted folder.

**Firefox**

4. Navigate to [`about:debugging`](about:debugging) (This Firefox).
5. Load temporary add-on from the `manifest.json` file in the extracted folder.

## Usage

Specify the language settings in the extension popup.

<table><tr><td>
  <strong>Origin</strong> → <strong>Target</strong>
</td></tr></table>

- **Origin**: the original Chinese text variant in the webpage
- **Target**: the desired Chinese text variant to be converted into

### Auto Mode

<p align="center"><img src="./2.gif" width="40%" /></p>

When auto mode is enabled, a grey badge with the letter `A` appears on the corner of the extension icon.

All text in the webpage of the current active tab is converted whenever it loads or is updated.

> **NOTE:** For performance reason, auto mode will not convert text on webpages which
> explicitly specify their `lang` attributes to be languages other than `zh` in their HTML documents.

## Credit

- OpenCC: https://github.com/BYVoid/OpenCC
- opencc-js: https://github.com/nk2028/opencc-js

---

<p align="center">
  <sub><strong>Made with ♥︎ by tnychn</strong></sub>
  <br>
  <sub><strong>MIT © 2021 Tony Chan</strong></sub>
</p>
