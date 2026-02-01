const state = {
  aTime: null,
  bTime: null,
  loopEnabled: false,
  video: null,
  panel: null,
  timeUpdateHandler: null,
  loopToggle: null,
  displayA: null,
  displayB: null,
  displayLoop: null
};

const formatTime = (seconds) => {
  if (seconds === null || Number.isNaN(seconds)) {
    return "--:--";
  }
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const updateDisplay = () => {
  if (!state.displayA || !state.displayB || !state.displayLoop || !state.loopToggle) {
    return;
  }

  state.displayA.textContent = formatTime(state.aTime);
  state.displayB.textContent = formatTime(state.bTime);
  state.displayLoop.textContent = state.loopEnabled ? "ON" : "OFF";
  state.loopToggle.disabled = state.aTime === null || state.bTime === null;
  state.loopToggle.checked = state.loopEnabled;
};

const resetMarkers = () => {
  state.aTime = null;
  state.bTime = null;
  state.loopEnabled = false;
  updateDisplay();
};

const ensurePanel = (player) => {
  if (state.panel && state.panel.isConnected) {
    if (state.panel.parentElement !== player) {
      player.appendChild(state.panel);
    }
    return;
  }

  const panel = document.createElement("div");
  panel.className = "yt-loop-marker-panel";

  const buttonsRow = document.createElement("div");
  buttonsRow.className = "yt-loop-marker-row";

  const setAButton = document.createElement("button");
  setAButton.type = "button";
  setAButton.textContent = "A地点を設定";
  setAButton.addEventListener("click", () => {
    if (!state.video) {
      return;
    }
    state.aTime = state.video.currentTime;
    if (state.bTime !== null && state.aTime > state.bTime) {
      state.bTime = null;
      state.loopEnabled = false;
    }
    updateDisplay();
  });

  const setBButton = document.createElement("button");
  setBButton.type = "button";
  setBButton.textContent = "B地点を設定";
  setBButton.addEventListener("click", () => {
    if (!state.video) {
      return;
    }
    state.bTime = state.video.currentTime;
    if (state.aTime !== null && state.bTime < state.aTime) {
      state.aTime = null;
      state.loopEnabled = false;
    }
    updateDisplay();
  });

  const loopLabel = document.createElement("label");
  loopLabel.className = "yt-loop-marker-toggle";

  const loopToggle = document.createElement("input");
  loopToggle.type = "checkbox";
  loopToggle.addEventListener("change", () => {
    if (state.aTime === null || state.bTime === null) {
      loopToggle.checked = false;
      return;
    }
    state.loopEnabled = loopToggle.checked;
    updateDisplay();
  });

  const loopText = document.createElement("span");
  loopText.textContent = "ループ";

  loopLabel.appendChild(loopToggle);
  loopLabel.appendChild(loopText);

  buttonsRow.appendChild(setAButton);
  buttonsRow.appendChild(setBButton);
  buttonsRow.appendChild(loopLabel);

  const statusRow = document.createElement("div");
  statusRow.className = "yt-loop-marker-row";

  const aStatus = document.createElement("div");
  aStatus.className = "yt-loop-marker-status";
  aStatus.innerHTML = "A: <span class=\"yt-loop-marker-value\"></span>";

  const bStatus = document.createElement("div");
  bStatus.className = "yt-loop-marker-status";
  bStatus.innerHTML = "B: <span class=\"yt-loop-marker-value\"></span>";

  const loopStatus = document.createElement("div");
  loopStatus.className = "yt-loop-marker-status";
  loopStatus.innerHTML = "Loop: <span class=\"yt-loop-marker-value\"></span>";

  statusRow.appendChild(aStatus);
  statusRow.appendChild(bStatus);
  statusRow.appendChild(loopStatus);

  panel.appendChild(buttonsRow);
  panel.appendChild(statusRow);

  player.appendChild(panel);

  state.panel = panel;
  state.loopToggle = loopToggle;
  state.displayA = aStatus.querySelector("span");
  state.displayB = bStatus.querySelector("span");
  state.displayLoop = loopStatus.querySelector("span");

  updateDisplay();
};

const attachToVideo = (video) => {
  if (state.video === video) {
    return;
  }

  if (state.video && state.timeUpdateHandler) {
    state.video.removeEventListener("timeupdate", state.timeUpdateHandler);
  }

  state.video = video;
  resetMarkers();

  state.timeUpdateHandler = () => {
    if (!state.loopEnabled || state.aTime === null || state.bTime === null) {
      return;
    }
    if (state.video.currentTime >= state.bTime) {
      state.video.currentTime = state.aTime;
    }
  };

  state.video.addEventListener("timeupdate", state.timeUpdateHandler);
};

const initialize = () => {
  const player = document.querySelector("#movie_player");
  const video = document.querySelector("#movie_player video");
  if (!player || !video) {
    return;
  }

  ensurePanel(player);
  attachToVideo(video);
};

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "jump" || !state.video) {
    return;
  }

  const targetTime = message.target === "A" ? state.aTime : state.bTime;
  if (targetTime === null) {
    return;
  }
  state.video.currentTime = targetTime;
  state.video.play();
});

initialize();

const observer = new MutationObserver(() => {
  initialize();
});

observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("yt-navigate-finish", () => {
  initialize();
});
