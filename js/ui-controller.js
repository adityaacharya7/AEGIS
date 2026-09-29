/**
 * Project AEGIS - UI Controller
 * Orchestrates Timeline Scrubber, District Inspector Drawer, Modals, Layers & Search
 * Ministry of Earth Sciences (MoES) / NCMRWF (SIH PS-26079)
 */

class AegisUIController {
  constructor(mapEngine) {
    this.map = mapEngine;
    this.currentLeadDay = 4;
    this.currentHazard = "all";
    this.isPlaying = false;
    this.playTimer = null;

    this.init();
  }

  init() {
    this.setupTimelineScrubber();
    this.setupLayerControls();
    this.setupHazardSelector();
    this.setupDistrictSearch();
    this.setupModals();
    this.setupInspectorDrawer();
    this.setupSidebarToggle();
    this.setupQuickActions();

    if (window.matchMedia("(max-width: 1120px)").matches) {
      this.setDrawer("layerControllerSidebar", false);
      this.setDrawer("districtInspector", false);
    }

    // Initial render with default district
    const defaultDist = DISTRICT_DATABASE.find(d => d.id === this.map.selectedDistrictId) || DISTRICT_DATABASE[0];
    this.updateInspector(defaultDist, this.currentLeadDay, false);
    this.updateNationalStats();
    this.updateLeadSummary(this.currentLeadDay);
  }

  // 1. TIMELINE SCRUBBER (Day 1 - 10)
  setupTimelineScrubber() {
    const slider = document.getElementById("leadDaySlider");
    const playBtn = document.getElementById("btnPlayPause");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const ticks = document.querySelectorAll(".timeline-tick");

    const updateLeadDay = (day) => {
      this.currentLeadDay = parseInt(day, 10);
      if (slider) slider.value = this.currentLeadDay;

      // Update Top Indicator
      const badge = document.getElementById("currentLeadDayBadge");
      if (badge) badge.textContent = `DAY ${this.currentLeadDay} (+${this.currentLeadDay * 24} hrs)`;

      const date = new Date(2026, 8, 27 + this.currentLeadDay);
      const dateText = document.getElementById("currentLeadDateText");
      if (dateText) {
        dateText.textContent = `Valid: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }

      // Update ticks active classes
      ticks.forEach(t => {
        const d = parseInt(t.getAttribute("data-day"), 10);
        t.setAttribute("aria-current", d === this.currentLeadDay ? "step" : "false");
        t.classList.remove("active-current");
        if (d === this.currentLeadDay) {
          t.classList.add("active-current");
        } else if (d < this.currentLeadDay) {
          t.classList.add("active");
        } else {
          t.classList.remove("active");
        }
      });

      // Update dynamic summary pill
      this.updateLeadSummary(this.currentLeadDay);

      // Update Map Engine & Inspector
      this.map.setLeadDay(this.currentLeadDay);
      const currentDist = DISTRICT_DATABASE.find(d => d.id === this.map.selectedDistrictId) || DISTRICT_DATABASE[0];
      this.updateInspector(currentDist, this.currentLeadDay, false);
      this.updateNationalStats();
    };

    if (slider) {
      slider.addEventListener("input", (e) => updateLeadDay(e.target.value));
    }

    ticks.forEach(tick => {
      tick.setAttribute("role", "button");
      tick.setAttribute("tabindex", "0");
      tick.setAttribute("aria-label", `Select forecast day ${tick.getAttribute("data-day")}`);
      tick.setAttribute("aria-current", Number(tick.getAttribute("data-day")) === this.currentLeadDay ? "step" : "false");
      tick.addEventListener("click", () => {
        const day = tick.getAttribute("data-day");
        updateLeadDay(day);
      });
      tick.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          updateLeadDay(tick.getAttribute("data-day"));
        }
      });
    });

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (this.isPlaying) {
          clearInterval(this.playTimer);
          this.isPlaying = false;
          if (playIcon) playIcon.classList.remove("hidden");
          if (pauseIcon) pauseIcon.classList.add("hidden");
          playBtn.setAttribute("title", "Play 10-Day Forecast Animation");
        } else {
          this.isPlaying = true;
          if (playIcon) playIcon.classList.add("hidden");
          if (pauseIcon) pauseIcon.classList.remove("hidden");
          playBtn.setAttribute("title", "Pause Forecast Animation");

          this.playTimer = setInterval(() => {
            let nextDay = this.currentLeadDay + 1;
            if (nextDay > 10) nextDay = 1;
            updateLeadDay(nextDay);
          }, 1500);
        }
      });
    }
  }

  // Update dynamic lead-time summary text
  updateLeadSummary(day) {
    const summary = document.getElementById("leadBustRiskSummary");
    if (!summary) return;

    if (day <= 2) {
      summary.textContent = "Minimal Run Drift (High Model Trust)";
      summary.style.color = "var(--trust-high)";
    } else if (day <= 4) {
      summary.textContent = "Elevated Drift (Moderate Caution)";
      summary.style.color = "var(--trust-med)";
    } else if (day <= 7) {
      summary.textContent = "Severe Bifurcation (High Bust Plume)";
      summary.style.color = "var(--trust-low)";
    } else {
      summary.textContent = "Extreme Chaos Spread (Forecast Inversion Likely)";
      summary.style.color = "var(--trust-crit)";
    }
  }

  // 2. LAYER CONTROLS (Toggles & Opacity Sliders)
  setupLayerControls() {
    this.layerControls = [
      ["Alerts", "alerts"], ["Districts", "districts"], ["Synoptic", "synoptic"],
      ["Drift", "drift"], ["Bust", "bust"], ["NWP", "nwp"], ["Basemap", "basemap"]
    ];
    this.layerControls.forEach(([suffix, key]) => {
      const toggle = document.getElementById("toggleLayer" + suffix);
      const slider = document.getElementById("opacity" + suffix);
      const label = toggle.closest(".layer-item").querySelector(".layer-name").textContent;
      toggle.setAttribute("aria-label", "Show " + label);
      slider.setAttribute("aria-label", label + " opacity");
      toggle.addEventListener("change", () => {
        this.map.layerState[key].visible = toggle.checked;
        this.map.applyLayerStyles();
        this.syncLayerControls();
      });
      slider.addEventListener("input", () => {
        this.map.layerState[key].opacity = Number(slider.value) / 100;
        this.map.applyLayerStyles();
        this.syncLayerControls();
      });
    });
    document.getElementById("btnResetLayers").addEventListener("click", () => {
      this.map.layerState = JSON.parse(JSON.stringify(this.map.defaultLayers));
      this.map.applyLayerStyles();
      this.syncLayerControls();
    });
    this.syncLayerControls();
  }

  syncLayerControls() {
    this.layerControls.forEach(([suffix, key]) => {
      const state = this.map.layerState[key];
      const toggle = document.getElementById("toggleLayer" + suffix);
      const slider = document.getElementById("opacity" + suffix);
      const available = key !== "nwp" || ["rainfall", "cyclone"].includes(this.currentHazard);
      toggle.checked = state.visible;
      toggle.disabled = !available;
      slider.value = Math.round(state.opacity * 100);
      slider.disabled = !available || !state.visible;
      document.getElementById("valOpacity" + suffix).textContent = slider.value + "%";
      toggle.closest(".layer-item").classList.toggle("is-off", !available || !state.visible);
      toggle.closest(".layer-item").title = available ? "" : "Rainfall labels are available in rainfall and cyclone scenarios.";
    });
  }

  // 3. HAZARD SELECTOR
  setupHazardSelector() {
    const chips = document.querySelectorAll(".hazard-chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentHazard = chip.getAttribute("data-hazard");
        this.map.setHazard(this.currentHazard);
        this.syncLayerControls();
        this.updateNationalStats();

        // Update inspector for the newly focused hazard district
        const matching = DISTRICT_DATABASE.find(d => d.id === this.map.selectedDistrictId);
        if (matching) {
          this.updateInspector(matching, this.currentLeadDay, false);
        }
      });
    });
  }

  // 4. DISTRICT SEARCH AUTOCOMPLETE
  setupDistrictSearch() {
    const input = document.getElementById("districtSearchInput");
    const dropdown = document.getElementById("searchDropdown");

    if (!input || !dropdown) return;

    input.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        dropdown.classList.add("hidden");
        return;
      }

      const matches = DISTRICT_DATABASE.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.primaryHazard.toLowerCase().includes(q)
      );

      dropdown.innerHTML = "";
      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="search-dropdown-item text-slate">No matching sample districts</div>`;
      } else {
        matches.slice(0, 12).forEach(m => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "search-dropdown-item";
          item.dataset.districtId = m.id;
          const data = m.leadTimes[this.currentLeadDay] || m.leadTimes[4];
          item.innerHTML = `
            <div>
              <div class="search-item-title"><b>${m.name}</b>, ${m.state}</div>
              <div class="text-caption">${m.region} • ${m.vulnerabilityDNA.terrain}</div>
            </div>
            <span class="badge-${data.status} font-mono font-bold">Trust: ${data.trust}%</span>
          `;
          item.addEventListener("click", () => {
            this.map.selectDistrict(m.id);
            dropdown.classList.add("hidden");
            input.value = `${m.name}, ${m.state}`;
          });
          dropdown.appendChild(item);
        });
      }
      dropdown.classList.remove("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    // Enter key selects first match
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = dropdown.querySelector(".search-dropdown-item[data-district-id]");
        if (first) first.click();
      }
    });
  }

  // 5. SIDEBAR & DRAWER TOGGLES (Zero Whitespace Glitch)
  setDrawer(id, open) {
    const small = window.matchMedia("(max-width: 1120px)").matches;
    const panel = document.getElementById(id);
    const hadFocus = panel.contains(document.activeElement);
    const buttonId = id === "layerControllerSidebar" ? "btnOpenSidebarFloating" : "btnOpenInspectorFloating";
    panel.classList.toggle("collapsed", !open);
    panel.inert = !open;
    document.getElementById(buttonId).classList.toggle("hidden", open);
    if (open && small) {
      const other = id === "layerControllerSidebar" ? "districtInspector" : "layerControllerSidebar";
      this.setDrawer(other, false);
      document.getElementById(id === "layerControllerSidebar" ? "btnToggleSidebar" : "btnCloseInspector").focus({ preventScroll: true });
    }
    if (!open && hadFocus) document.getElementById(buttonId).focus({ preventScroll: true });
  }

  setupSidebarToggle() {
    document.getElementById("btnToggleSidebar").addEventListener("click", () => this.setDrawer("layerControllerSidebar", false));
    document.getElementById("btnOpenSidebarFloating").addEventListener("click", () => this.setDrawer("layerControllerSidebar", true));
    const screen = window.matchMedia("(max-width: 1120px)");
    screen.addEventListener("change", e => {
      this.setDrawer("layerControllerSidebar", !e.matches);
      this.setDrawer("districtInspector", !e.matches);
    });
  }

  setupInspectorDrawer() {
    document.getElementById("btnCloseInspector").addEventListener("click", () => this.setDrawer("districtInspector", false));
    document.getElementById("btnOpenInspectorFloating").addEventListener("click", () => this.setDrawer("districtInspector", true));
  }

  // 6. UPDATE RIGHT DISTRICT INTELLIGENCE DRAWER
  updateInspector(district, leadDay, open = true) {
    if (!district) return;
    const inspector = document.getElementById("districtInspector");
    const btnOpenFloating = document.getElementById("btnOpenInspectorFloating");

    if (inspector && open) {
      this.setDrawer("districtInspector", true);
      inspector.querySelector(".inspector-content-scroll").scrollTop = 0;
    }

    const data = district.leadTimes[leadDay] || district.leadTimes[4];

    // District Header
    const nameEl = document.getElementById("inspectorDistrictName");
    const stateEl = document.getElementById("inspectorStateName");
    if (nameEl) nameEl.textContent = district.name;
    if (stateEl) stateEl.textContent = `${district.state} • ${district.region}`;

    // Trust Score Radial Gauge Animation (Circumference = 2 * PI * 50 = 314)
    const gaugeScoreNum = document.getElementById("gaugeScoreNum");
    const gaugeFillCircle = document.getElementById("gaugeFillCircle");
    const statusBadge = document.getElementById("inspectorBustStatusBadge");

    if (gaugeScoreNum) gaugeScoreNum.textContent = data.trust;
    if (gaugeFillCircle) {
      const offset = 314 * (1 - (data.trust / 100));
      gaugeFillCircle.style.strokeDashoffset = offset;

      let color = "var(--trust-high)";
      if (data.status === "med") color = "var(--trust-med)";
      if (data.status === "low") color = "var(--trust-low)";
      if (data.status === "crit") color = "var(--trust-crit)";

      gaugeFillCircle.style.stroke = color;
      gaugeScoreNum.style.color = color;
    }

    if (statusBadge) {
      if (data.status === "crit") {
        statusBadge.textContent = "CRITICAL BUST RISK";
        statusBadge.className = "risk-badge-pill badge-low";
      } else if (data.status === "low") {
        statusBadge.textContent = "ELEVATED BUST RISK";
        statusBadge.className = "risk-badge-pill badge-crit";
      } else if (data.status === "med") {
        statusBadge.textContent = "MODERATE CAUTION";
        statusBadge.className = "risk-badge-pill badge-med";
      } else {
        statusBadge.textContent = "HIGH MODEL TRUST";
        statusBadge.className = "risk-badge-pill badge-high";
      }
    }

    // Metadata lines
    const bustProbEl = document.getElementById("inspectorBustProb");
    const driftIndexEl = document.getElementById("inspectorDriftIndex");
    if (bustProbEl) bustProbEl.textContent = `${data.bustProb}%`;
    if (driftIndexEl) {
      driftIndexEl.textContent = `${data.drift.toFixed(2)} (${data.drift > 0.7 ? 'Severe Jump' : (data.drift > 0.4 ? 'Moderate' : 'Stable')})`;
    }

    // Conformal Prediction Envelope
    const nwpEl = document.getElementById("inspectorNwpVal");
    const envEl = document.getElementById("inspectorEnvelopeVal");
    if (nwpEl) nwpEl.textContent = `${data.nwpRain} mm`;
    if (envEl) envEl.textContent = `[${data.envelope[0]} — ${data.envelope[1]} mm]`;

    const fillBar = document.getElementById("envelopeFillBar");
    if (fillBar) {
      fillBar.style.width = `${Math.min(100, (data.bustProb * 1.1))}%`;
    }

    // Innovation 1: Run-to-Run Drift Sparkline
    const driftContainer = document.getElementById("driftBarsContainer");
    if (driftContainer && district.driftHistory) {
      driftContainer.innerHTML = "";
      const maxVal = Math.max(...district.driftHistory.map(h => h.value), 100);

      district.driftHistory.forEach(item => {
        const heightPct = Math.max(16, (item.value / maxVal) * 100);
        const col = document.createElement("div");
        col.className = "drift-bar-col";
        col.innerHTML = `
          <span class="bar-val font-mono">${item.value}mm</span>
          <div class="bar-rect" style="height: ${heightPct}%; background-color: ${item.run.includes('Now') ? 'var(--trust-crit)' : 'var(--primary)'};"></div>
          <span class="bar-label font-mono">${item.run}</span>
        `;
        driftContainer.appendChild(col);
      });
    }

    // Innovation 2: SHAP Meteorologist Reason Cards
    const shapList = document.getElementById("shapReasonsList");
    if (shapList && district.shapReasons) {
      shapList.innerHTML = "";
      district.shapReasons.forEach(reason => {
        const row = document.createElement("div");
        row.className = "shap-reason-row";
        row.innerHTML = `
          <div>
            <div class="shap-reason-text">${reason.feature}</div>
            <div class="text-caption">${reason.desc}</div>
          </div>
          <span class="shap-impact-badge font-mono">${reason.impact}</span>
        `;
        shapList.appendChild(row);
      });
    }

    // Innovation 3: Historical Synoptic Twin
    if (district.synopticTwin) {
      const simEl = document.getElementById("inspectorTwinSimilarity");
      const titleEl = document.getElementById("inspectorTwinTitle");
      const descEl = document.getElementById("inspectorTwinDesc");
      if (simEl) simEl.textContent = `${district.synopticTwin.similarity} Match`;
      if (titleEl) titleEl.textContent = district.synopticTwin.title;
      if (descEl) descEl.textContent = district.synopticTwin.summary;

      const stats = document.querySelector(".twin-stats");
      if (stats) {
        stats.innerHTML = `
          <span>Event Date: <b>${district.synopticTwin.date}</b></span>
          <span>Historical Discrepancy: <b>${district.synopticTwin.errorDelta}</b></span>
        `;
      }
    }

    // Playbook Checklist
    const playbook = document.getElementById("inspectorPlaybookList");
    if (playbook && district.sopPlaybook) {
      playbook.innerHTML = "";
      district.sopPlaybook.forEach(sop => {
        const li = document.createElement("li");
        li.textContent = sop;
        playbook.appendChild(li);
      });
    }
  }

  // 7. NATIONAL KPI & CRITICAL BADGES
  updateNationalStats() {
    const stats = calculateNationalStats(this.currentLeadDay, this.currentHazard);
    const badge = document.getElementById("criticalCountBadge");
    if (badge) badge.textContent = `${stats.criticalDistricts} Districts`;

    const trustScore = document.getElementById("nationalTrustScore");
    if (trustScore) {
      trustScore.textContent = `${stats.meanTrust}%`;
      trustScore.style.color = stats.meanTrust > 65 ? "var(--trust-high)" : (stats.meanTrust > 40 ? "var(--trust-med)" : "var(--trust-crit)");
    }
  }

  // 8. MODALS SETUP (Model Drift Lab, API Sandbox, Shortcuts)
  setupModals() {
    const modalLab = document.getElementById("modalModelLab");
    const modalApi = document.getElementById("modalApiSandbox");
    const modalShortcuts = document.getElementById("modalShortcuts");

    const btnOpenLab = document.getElementById("btnOpenModelLab");
    const btnCloseLab = document.getElementById("btnCloseModelLab");
    const btnCloseLab2 = document.getElementById("btnCloseModelLab2");

    const btnOpenApi = document.getElementById("btnOpenApiModal");
    const btnCloseApi = document.getElementById("btnCloseApiModal");

    const btnOpenShortcuts = document.getElementById("btnOpenShortcuts");
    const btnCloseShortcuts = document.getElementById("btnCloseShortcuts");

    if (btnOpenLab && modalLab) {
      btnOpenLab.addEventListener("click", () => {
        modalLab.classList.remove("hidden");
        this.renderDivergenceChart();
      });
    }
    if (btnCloseLab && modalLab) btnCloseLab.addEventListener("click", () => modalLab.classList.add("hidden"));
    if (btnCloseLab2 && modalLab) btnCloseLab2.addEventListener("click", () => modalLab.classList.add("hidden"));
    document.getElementById("btnDownloadChart")?.addEventListener("click", () => {
      const chart = document.querySelector("#divergenceChartContainer svg");
      if (!chart) return;
      const svg = new XMLSerializer().serializeToString(chart);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "aegis-divergence-example.svg";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    if (btnOpenApi && modalApi) btnOpenApi.addEventListener("click", () => {
      modalApi.classList.remove("hidden");
      document.querySelector(".api-tab.active")?.click();
    });
    if (btnCloseApi && modalApi) btnCloseApi.addEventListener("click", () => modalApi.classList.add("hidden"));

    if (btnOpenShortcuts && modalShortcuts) {
      btnOpenShortcuts.addEventListener("click", () => modalShortcuts.classList.remove("hidden"));
    }
    if (btnCloseShortcuts && modalShortcuts) {
      btnCloseShortcuts.addEventListener("click", () => modalShortcuts.classList.add("hidden"));
    }

    // Close on backdrop click
    [modalLab, modalApi, modalShortcuts].forEach(modal => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.add("hidden");
        });
      }
    });

    // High-Risk Pill Click Action
    const highRiskPill = document.getElementById("highRiskPill");
    if (highRiskPill) {
      highRiskPill.style.cursor = "pointer";
      highRiskPill.title = "Click to filter critical bust hotspots";
      highRiskPill.addEventListener("click", () => {
        const btnHot = document.getElementById("viewModeHotspots");
        if (btnHot) btnHot.click();
      });
    }

    // API Sandbox Tabs
    const tabs = document.querySelectorAll(".api-tab");
    const codeBlock = document.getElementById("apiCodeBlock");

    const currentDist = () => DISTRICT_DATABASE.find(d => d.id === this.map.selectedDistrictId) || DISTRICT_DATABASE[0];

    const getSnippets = () => {
      const d = currentDist();
      const data = d.leadTimes[this.currentLeadDay] || d.leadTimes[4];
      return {
        curl: `# Route example only; this prototype has no API server.\ncurl -X GET "https://example.invalid/api/v1/confidence/${d.id}?lead_day=${this.currentLeadDay}&hazard=${this.currentHazard}" \\
     -H "Authorization: Bearer YOUR_TOKEN" \\
     -H "Accept: application/json"`,
        json: `{\n  "district": "${d.name}",\n  "state": "${d.state}",\n  "lead_day": ${this.currentLeadDay},\n  "target_timestamp": "${new Date(Date.UTC(2026, 8, 27 + this.currentLeadDay)).toISOString()}",\n  "nwp_predicted_rain_mm": ${data.nwpRain},\n  "calibrated_trust_score": ${data.trust},\n  "bust_probability": ${data.bustProb},\n  "forecast_drift_index": ${data.drift.toFixed(2)},\n  "conformal_90_envelope": [${data.envelope[0]}, ${data.envelope[1]}],\n  "top_shap_drivers": [\n    "${d.shapReasons[0]?.feature || 'Orographic Lift'}",\n    "${d.shapReasons[1]?.feature || 'Bulk Wind Shear'}"\n  ],\n  "historical_twin": "${d.synopticTwin.title} (${d.synopticTwin.similarity})"\n}`,
        cap: `<?xml version="1.0" encoding="UTF-8"?>\n<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n  <identifier>AEGIS-BUST-2026-0927-${d.id.toUpperCase()}</identifier>\n  <sender>demo@example.invalid</sender>\n  <sent>2026-09-27T20:00:00+05:30</sent>\n  <status>Test</status>\n  <msgType>Alert</msgType>\n  <scope>Public</scope>\n  <info>\n    <category>Met</category>\n    <event>Illustrative NWP Forecast Bust Hazard</event>\n    <urgency>Expected</urgency>\n    <severity>Severe</severity>\n    <certainty>Possible</certainty>\n    <headline>Forecast uncertainty scenario for ${escapeXml(d.name)} Lead Day ${this.currentLeadDay}</headline>\n    <description>NWP predicts ${data.nwpRain}mm; sample bust probability ${data.bustProb}% with interval [${data.envelope[0]}-${data.envelope[1]}mm].</description>\n    <area>\n      <areaDesc>${escapeXml(d.name)} District, ${escapeXml(d.state)}</areaDesc>\n      <circle>${d.geo[1]},${d.geo[0]},45.0</circle>\n    </area>\n  </info>\n</alert>`,
        python: `# Route example only; this prototype has no API server.\nimport requests\n\nurl = "https://example.invalid/api/v1/confidence/${d.id}"\nheaders = {"Authorization": "Bearer YOUR_TOKEN"}\nparams = {"lead_day": ${this.currentLeadDay}, "hazard": "${this.currentHazard}"}\n\nresponse = requests.get(url, headers=headers, params=params)\ndata = response.json()\n\nprint(f"District: {data['district']}")\nprint(f"Trust Score: {data['calibrated_trust_score']}/100")\nprint(f"Bust Probability: {data['bust_probability']}%")\nprint(f"Realistic Envelope: {data['conformal_90_envelope']} mm")`
      };
    };

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const tName = tab.getAttribute("data-tab");
        const snips = getSnippets();
        if (codeBlock && snips[tName]) {
          codeBlock.textContent = snips[tName];
        }
      });
    });

    const copyBtn = document.getElementById("btnCopyApiSnippet");
    if (copyBtn && codeBlock) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = "Copied to Clipboard!";
          setTimeout(() => copyBtn.textContent = original, 2000);
        });
      });
    }

    const runBtn = document.getElementById("btnRunApiTest");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        const jsonTab = document.querySelector('.api-tab[data-tab="json"]');
        if (jsonTab) jsonTab.classList.add("active");
        const snips = getSnippets();
        if (codeBlock) codeBlock.textContent = snips.json;
      });
    }
  }

  // 9. QUICK ACTION EXPORTS (CAP XML & GeoJSON)
  setupQuickActions() {
    const btnExportCap = document.getElementById("btnExportCapXml");
    const btnCopyGeoJson = document.getElementById("btnCopyGeoJson");

    if (btnExportCap) {
      btnExportCap.addEventListener("click", () => {
        const d = DISTRICT_DATABASE.find(dist => dist.id === this.map.selectedDistrictId) || DISTRICT_DATABASE[0];
        const data = d.leadTimes[this.currentLeadDay] || d.leadTimes[4];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>AEGIS-${d.id.toUpperCase()}-D${this.currentLeadDay}</identifier>
  <sender>demo@example.invalid</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Test</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>NWP Forecast Bust Warning</event>
    <urgency>Expected</urgency>
    <severity>${data.status === 'crit' ? 'Extreme' : 'Severe'}</severity>
    <certainty>Possible</certainty>
    <headline>Illustrative model uncertainty for ${escapeXml(d.name)}, ${escapeXml(d.state)}</headline>
    <description>Illustrative scenario. Lead Day ${this.currentLeadDay} forecast bust probability is ${data.bustProb}%. Trust Score: ${data.trust}/100. Conformal envelope [${data.envelope[0]} - ${data.envelope[1]} mm].</description>
    <area><areaDesc>${escapeXml(d.name)}, ${escapeXml(d.state)}</areaDesc><circle>${d.geo[1]},${d.geo[0]},45.0</circle></area>
  </info>
</alert>`;
        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CAP_ALERT_${d.id}_Day${this.currentLeadDay}.xml`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }

    if (btnCopyGeoJson) {
      btnCopyGeoJson.addEventListener("click", () => {
        const d = DISTRICT_DATABASE.find(dist => dist.id === this.map.selectedDistrictId) || DISTRICT_DATABASE[0];
        const data = d.leadTimes[this.currentLeadDay] || d.leadTimes[4];
        const geojson = {
          type: "Feature",
          properties: {
            district: d.name,
            state: d.state,
            leadDay: this.currentLeadDay,
            trustScore: data.trust,
            bustProbability: data.bustProb,
            forecastDriftIndex: data.drift,
            conformalRange: data.envelope
          },
          geometry: {
            type: "Point",
            coordinates: d.geo
          }
        };
        navigator.clipboard.writeText(JSON.stringify(geojson, null, 2)).then(() => {
          const original = btnCopyGeoJson.textContent;
          btnCopyGeoJson.textContent = "GeoJSON Copied!";
          setTimeout(() => btnCopyGeoJson.textContent = original, 2000);
        });
      });
    }
  }

  // 10. RENDER SVG DIVERGENCE CHART IN MODEL LAB
  renderDivergenceChart() {
    const container = document.getElementById("divergenceChartContainer");
    if (!container) return;

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 650 140">
        <!-- Grid lines -->
        <line x1="50" y1="20" x2="620" y2="20" stroke="#E2E8F0" stroke-dasharray="3 3"/>
        <line x1="50" y1="60" x2="620" y2="60" stroke="#E2E8F0" stroke-dasharray="3 3"/>
        <line x1="50" y1="100" x2="620" y2="100" stroke="#E2E8F0" stroke-dasharray="3 3"/>

        <!-- Axes -->
        <line x1="50" y1="120" x2="620" y2="120" stroke="#94A3B8" stroke-width="1.5"/>
        <line x1="50" y1="10" x2="50" y2="120" stroke="#94A3B8" stroke-width="1.5"/>

        <!-- Day labels -->
        <text x="50" y="135" font-size="10" font-family="var(--font-mono)" fill="#64748B">Day 1</text>
        <text x="180" y="135" font-size="10" font-family="var(--font-mono)" fill="#64748B">Day 3</text>
        <text x="320" y="135" font-size="10" font-family="var(--font-mono)" font-weight="700" fill="#DC2626">Day 5 (Bifurcation)</text>
        <text x="460" y="135" font-size="10" font-family="var(--font-mono)" fill="#64748B">Day 7</text>
        <text x="590" y="135" font-size="10" font-family="var(--font-mono)" fill="#64748B">Day 10</text>

        <!-- NCUM Curve (Blue) -->
        <path d="M 50 115 Q 200 110 320 85 T 620 25" fill="none" stroke="#1E40AF" stroke-width="2.5"/>
        <circle cx="320" cy="85" r="4" fill="#1E40AF"/>

        <!-- GFS Curve (Green) -->
        <path d="M 50 117 Q 200 112 320 95 T 620 45" fill="none" stroke="#059669" stroke-width="2"/>

        <!-- WRF Curve (Red) -->
        <path d="M 50 112 Q 200 100 320 70 T 620 15" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="4 2"/>

        <!-- Chaos Divergence Threshold line -->
        <line x1="320" y1="10" x2="320" y2="120" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="2 2"/>
        <text x="326" y="25" font-size="9" font-weight="700" fill="#DC2626">Numerical Chaos Threshold</text>
      </svg>
    `;
  }
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  }[char]));
}
