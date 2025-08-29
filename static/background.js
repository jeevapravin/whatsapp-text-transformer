// Create the context menu item when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "smart-text-helper",
    title: "Smart Text Helper",
    contexts: ["selection"] // This makes it appear only when text is highlighted.
  });
});

// Listen for a click on our context menu item.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "smart-text-helper" && info.selectionText) {
    // Save the selected text to local storage for the popup to retrieve.
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // After saving, open the popup window.
      chrome.action.openPopup();
    });
  }
});