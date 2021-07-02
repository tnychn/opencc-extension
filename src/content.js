import { Converter } from "opencc-js";

const defaultSettings = { origin: "cn", target: "hk", auto: false };

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

/* Mount trigger to auto convert when DOM changes */
const lang = document.documentElement.lang;
if (!lang || lang.startsWith("zh"))
  new MutationObserver(() => {
    chrome.storage.local.get(defaultSettings, (settings) => {
      if (!settings.auto || settings.origin === settings.target) return;
      convertAllTextNodes(settings.origin, settings.target);
    });
  }).observe(document.body, { childList: true, subtree: true });

/* Run convert on all nodes when triggered by button click in popup */
chrome.runtime.onMessage.addListener(({ action }, _, sendResponse) => {
  chrome.storage.local.get(defaultSettings, (settings) => {
    if (settings.origin !== settings.target) {
      if (action === "click") {
        const start = Date.now();
        const count = convertAllTextNodes(settings.origin, settings.target);
        sendResponse({ count, time: Date.now() - start });
      } else if (action === "select") convertSelectedTextNodes(settings.origin, settings.target);
    }
  });
  return true; // eliminate error: 'the message port closed before a response was received'
});
