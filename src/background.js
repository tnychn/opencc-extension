chrome.runtime.onInstalled.addListener(() => {
  /* Create context menu item for converting selected text only. */
  chrome.contextMenus.create({
    id: "convert-selection",
    title: "Convert Chinese Characters",
    contexts: ["selection"],
  });
  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "convert-selection") {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tabs[0].id, { action: "select", text: info.selectionText });
    }
  });
});

chrome.action.setBadgeBackgroundColor({ color: "white" });

/* Retrieve initial state of auto mode from local storage. */
chrome.storage.local.get({ auto: false }).then(({ auto }) => {
  chrome.action.setBadgeText({ text: auto ? "A" : "" });
});
