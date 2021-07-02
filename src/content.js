import { Converter } from "opencc-js";

const defaultSettings = { origin: "cn", target: "hk", auto: false };

function convertAllTextNodes(origin, target) {
  const convert = Converter({ from: origin, to: target });
  const iterateTextNodes = (node, callback) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    for (var textNode, i = 0; (textNode = walker.nextNode()); callback(textNode) && i++);
    return i;
  };
  return iterateTextNodes(document.body, (textNode) => {
    const originalText = textNode.nodeValue;
    const convertedText = convert(originalText);
    if (convertedText === originalText) return;
    return (textNode.nodeValue = convertedText);
  });
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
    if (action === "click") {
      const start = Date.now();
      const i = convertAllTextNodes(settings.origin, settings.target);
      sendResponse({ i, time: Date.now() - start });
    }
  });
  return true; // eliminate error: 'the message port closed before a response was received'
});
