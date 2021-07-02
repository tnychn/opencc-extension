import { Converter } from "opencc-js";

function iterateTextNodes(node, callback) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  for (let n; (n = walker.nextNode()); ) callback(n);
}

function convertAllTextNodes(origin, target) {
  let i = 0;
  const convert = Converter({ from: origin, to: target });
  iterateTextNodes(document.body, (childNode) => {
    const originalText = childNode.nodeValue;
    const convertedText = convert(originalText);
    if (convertedText === originalText) return;
    childNode.nodeValue = convertedText;
    i++;
  });
  return i;
}

/* Mount trigger to auto convert when DOM changes */
const lang = document.documentElement.lang;
if (!lang || lang.startsWith("zh"))
  new MutationObserver(() => {
    chrome.storage.local.get({ origin: "cn", target: "hk", auto: false }, (items) => {
      if (!items.auto || items.origin === items.target) return;
      convertAllTextNodes(items.origin, items.target);
    });
  }).observe(document.body, { childList: true, subtree: true });

/* Run convert on all nodes when triggered by button click in popup */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  const start = Date.now();
  const i = convertAllTextNodes(request.origin, request.target);
  sendResponse({ i, time: Date.now() - start });
});
