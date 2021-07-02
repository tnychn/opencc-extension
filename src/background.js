/* Create context menu item for converting selected text only */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Convert",
    contexts: ["selection"],
    onclick: () => {
      // TODO: send message to content script to trigger conversion
    },
  });
});
