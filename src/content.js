import { Converter } from "opencc-js";

const defaultSettings = { origin: "cn", target: "hk", auto: false };

function convertTitle(origin, target) {
  const convert = Converter({ from: origin, to: target });
  document.title = convert(document.title);
}

function convertAllTextNodes(origin, target) {
  const convert = Converter({ from: origin, to: target });
  const iterateTextNodes = (node, callback) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    for (let textNode; (textNode = walker.nextNode()); ) callback(textNode);
  };
  let count = 0;
  iterateTextNodes(document.body, (textNode) => {
    const originalText = textNode.nodeValue;
    const convertedText = convert(originalText);
    if (convertedText === originalText) return;
    (textNode.nodeValue = convertedText) && count++;
  });
  return count;
}

function convertSelectedTextNodes(origin, target) {
  const convert = Converter({ from: origin, to: target });
  const iterateTextNodes = (nodes, callback) => {
    for (const node of nodes) {
      if (node.nodeType === 3) callback(node);
      else iterateTextNodes(node.childNodes, callback);
    }
  };
  const range = window.getSelection().getRangeAt(0);
  const contents = range.cloneContents();
  iterateTextNodes([contents], (textNode) => {
    const originalText = textNode.nodeValue;
    const convertedText = convert(originalText);
    if (convertedText === originalText) return;
    return (textNode.nodeValue = convertedText);
  });
  // FIXME: the DOM structure messes up
  //   when the selected text spans across multiple containers
  range.deleteContents() || range.insertNode(contents);
}

/* Mount trigger to auto convert when DOM changes. */
let currentURL = "";
const lang = document.documentElement.lang;
if (!lang || lang.startsWith("zh"))
  new MutationObserver(async () => {
    const settings = await chrome.storage.local.get(defaultSettings);
    if (!settings.auto || settings.origin === settings.target) return;
    if (currentURL !== window.location.href) {
      currentURL = window.location.href;
      convertTitle(settings.origin, settings.target);
    }
    convertAllTextNodes(settings.origin, settings.target);
  }).observe(document.body, { childList: true, subtree: true });

/* Run convert once DOM ready when in auto mode. */
chrome.storage.local.get(defaultSettings).then((settings) => {
  if (!settings.auto) return;
  convertTitle(settings.origin, settings.target);
  convertAllTextNodes(settings.origin, settings.target);
});

/* Run convert on all nodes when triggered by button click in popup. */
// NOTE: listener itself cannot be async function, see https://stackoverflow.com/questions/48107746.
chrome.runtime.onMessage.addListener(({ action }, _, sendResponse) => {
  (async () => {
    const settings = await chrome.storage.local.get(defaultSettings);
    if (settings.origin !== settings.target) {
      if (action === "click") {
        const start = Date.now();
        convertTitle(settings.origin, settings.target);
        const count = convertAllTextNodes(settings.origin, settings.target);
        sendResponse({ count, time: Date.now() - start });
      } else if (action === "select") convertSelectedTextNodes(settings.origin, settings.target);
    }
  })();
  return true; // eliminate error: 'the message port closed before a response was received'
});
