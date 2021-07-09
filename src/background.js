/* Create context menu item for converting selected text only */
chrome.contextMenus.create({
  title: "Convert Chinese Characters",
  contexts: ["selection"],
  onclick: (info) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "select", text: info.selectionText });
    });
  },
});
