/* Create context menu item for converting selected text only. */
chrome.contextMenus.create({
  title: "Convert Chinese Characters",
  contexts: ["selection"],
  onclick: (info) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "select", text: info.selectionText });
    });
  },
});

//// chrome.browserAction.setBadgeTextColor({ color: "white" });
chrome.browserAction.setBadgeBackgroundColor({ color: "white" });

// expose this function to popup script via global window
window.toggleAutoBadge = (value) => chrome.browserAction.setBadgeText({ text: value ? "A" : "" });

/* Retrieve initial state of auto mode from local storage. */
chrome.storage.local.get({ auto: false }, ({ auto }) => window.toggleAutoBadge(auto));
