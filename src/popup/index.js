import "./index.css"; // include stylesheet in build process

import { Converter } from "opencc-js";

const $originSelect = document.getElementById("origin");
const $targetSelect = document.getElementById("target");
const $swapButton = document.getElementById("swap");
const $textbox = document.getElementById("textbox");
const $convertButton = document.getElementById("convert");
const $autoCheckbox = document.getElementById("auto");
const $footer = document.getElementsByTagName("footer")[0];

function toggleAutoBadge(value) {
  if (value) {
    chrome.browserAction.setBadgeText({ text: "A" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#808080" });
  } else chrome.browserAction.setBadgeText({ text: "" });
}

function textboxConvert() {
  const [origin, target] = [$originSelect.value, $targetSelect.value];
  if (origin === target) return;
  const convert = Converter({ from: origin, to: target });
  const originalText = $textbox.value;
  const convertedText = convert(originalText);
  if (convertedText !== originalText) $textbox.value = convertedText;
}

/* Retrieve values from local storage and restore options when shown */
chrome.storage.local.get({ origin: "cn", target: "hk", auto: false }, (settings) => {
  $originSelect.value = settings.origin;
  $targetSelect.value = settings.target;
  $autoCheckbox.checked = settings.auto;
  $convertButton.disabled = settings.origin === settings.target;
  toggleAutoBadge(settings.auto);
});

/* User changes origin option */
$originSelect.addEventListener("change", (event) => {
  chrome.storage.local.set({ origin: event.currentTarget.value });
  $convertButton.disabled = $targetSelect.value === event.currentTarget.value;
  if ($textbox.value) textboxConvert();
});

/* User changes target option */
$targetSelect.addEventListener("change", (event) => {
  chrome.storage.local.set({ target: event.currentTarget.value });
  $convertButton.disabled = $originSelect.value === event.currentTarget.value;
  if ($textbox.value) textboxConvert();
});

/* User clicks swap button */
$swapButton.addEventListener("click", () => {
  chrome.storage.local.set({ origin: $targetSelect.value, target: $originSelect.value });
  const originValue = $originSelect.value;
  $originSelect.value = $targetSelect.value;
  $targetSelect.value = originValue;
  if ($textbox.value) textboxConvert();
});

/* User inputs text in textbox */
let timeout;
$textbox.addEventListener("input", () => {
  // debounce 750ms: wait for typing to stop
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(textboxConvert, 750);
});

/* User clicks convert button */
$convertButton.addEventListener("click", () => {
  $convertButton.disabled = true;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "click" }, (response) => {
      $convertButton.disabled = false;
      if (response !== undefined) $footer.innerText = `${response.count} nodes changed in ${response.time}ms`;
      else $footer.innerHTML = `<span style="color: red; font-weight: bold;">PAGE PROTECTED BY BROWSER</span>`;
    });
  });
});

/* User checks auto convert */
$autoCheckbox.addEventListener("change", (event) => {
  chrome.storage.local.set({ auto: event.currentTarget.checked });
  toggleAutoBadge(event.currentTarget.checked);
});
