/* Create context menu item for converting selected text only */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Convert",
    contexts: ["selection"],
    onclick: (info) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "select", text: info.selectionText });
      });
    },
  });
});
