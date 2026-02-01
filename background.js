chrome.commands.onCommand.addListener((command) => {
  if (command !== "jump-to-a" && command !== "jump-to-b") {
    return;
  }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const [tab] = tabs;
    if (!tab?.id) {
      return;
    }

    const target = command === "jump-to-a" ? "A" : "B";
    chrome.tabs.sendMessage(tab.id, { type: "jump", target });
  });
});
