/**
 * Project AEGIS - Application Bootstrapper & Global Forecaster Keyboard Hub
 * Ministry of Earth Sciences (MoES) / NCMRWF (SIH PS-26079)
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Project AEGIS: AI Forecast Bust Intelligence Platform...");

  // Instantiate Map Engine
  const mapEngine = new AegisMapEngine(
    "geographicMap",
    (district, leadDay) => {
      if (window.aegisUI) {
        window.aegisUI.currentHazard = mapEngine.currentHazard;
        document.querySelectorAll(".hazard-chip").forEach(chip =>
          chip.classList.toggle("active", chip.dataset.hazard === mapEngine.currentHazard));
        window.aegisUI.updateInspector(district, leadDay);
        window.aegisUI.updateNationalStats();
        window.aegisUI.syncLayerControls();
      }
    }
  );

  // Instantiate UI Controller
  window.aegisUI = new AegisUIController(mapEngine);

  // Global Keyboard Shortcuts for Operational Forecasters
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
      document.getElementById("searchDropdown")?.classList.add("hidden");
      return;
    }
    // If typing in search box, do not trigger shortcuts
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;
    if (document.querySelector(".modal-backdrop:not(.hidden)")) return;
    if (e.code === "Space" && e.target.closest("button, [role='button']")) return;

    // Space: Play/Pause timeline animation
    if (e.code === "Space") {
      e.preventDefault();
      const playBtn = document.getElementById("btnPlayPause");
      if (playBtn) playBtn.click();
    }

    // Number keys 1 - 9, 0: Jump to Lead Day 1 - 10
    if (e.key >= "1" && e.key <= "9") {
      const day = parseInt(e.key, 10);
      const slider = document.getElementById("leadDaySlider");
      if (slider) {
        slider.value = day;
        slider.dispatchEvent(new Event("input"));
      }
    } else if (e.key === "0") {
      const slider = document.getElementById("leadDaySlider");
      if (slider) {
        slider.value = 10;
        slider.dispatchEvent(new Event("input"));
      }
    }

    // L key: Toggle Layers Sidebar
    if (e.key === "l" || e.key === "L") {
      const sidebar = document.getElementById("layerControllerSidebar");
      const btn = document.getElementById(sidebar?.classList.contains("collapsed") ? "btnOpenSidebarFloating" : "btnToggleSidebar");
      if (btn) btn.click();
    }

    // I or D key: Toggle District Inspector Drawer
    if (e.key === "i" || e.key === "I" || e.key === "d" || e.key === "D") {
      const inspector = document.getElementById("districtInspector");
      const btnClose = document.getElementById("btnCloseInspector");
      const btnOpen = document.getElementById("btnOpenInspectorFloating");
      if (inspector && inspector.classList.contains("collapsed")) {
        if (btnOpen) btnOpen.click();
      } else {
        if (btnClose) btnClose.click();
      }
    }

    // + / =: Zoom In
    if (e.key === "+" || e.key === "=") {
      const btn = document.getElementById("btnZoomIn");
      if (btn) btn.click();
    }

    // - / _: Zoom Out
    if (e.key === "-" || e.key === "_") {
      const btn = document.getElementById("btnZoomOut");
      if (btn) btn.click();
    }

    // R: Reset Map View
    if (e.key === "r" || e.key === "R") {
      const btn = document.getElementById("btnResetView");
      if (btn) btn.click();
    }

    // H: Toggle Hotspots Mode
    if (e.key === "h" || e.key === "H") {
      const btnAll = document.getElementById("viewModeAll");
      const btnHot = document.getElementById("viewModeHotspots");
      if (btnHot && btnHot.classList.contains("active")) {
        if (btnAll) btnAll.click();
      } else if (btnHot) {
        btnHot.click();
      }
    }

    // ? key: Open Keyboard Shortcuts Guide
    if (e.key === "?") {
      const modal = document.getElementById("modalShortcuts");
      if (modal) modal.classList.toggle("hidden");
    }

  });

  console.log("Project AEGIS initialized successfully. Operational layers active.");
});
