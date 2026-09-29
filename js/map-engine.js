/* Geographic workspace. All assets and map geometry are stored locally. */
class AegisMapEngine {
  constructor(elementId, onDistrictSelect) {
    this.onDistrictSelect = onDistrictSelect;
    this.currentLeadDay = 4;
    this.currentHazard = "all";
    this.selectedDistrictId = "ratnagiri";
    this.viewMode = "all";
    this.defaultLayers = {
      basemap: { visible: true, opacity: 1 },
      nwp: { visible: false, opacity: 0.85 },
      bust: { visible: true, opacity: 0.5 },
      drift: { visible: false, opacity: 0.8 },
      synoptic: { visible: false, opacity: 0.85 },
      districts: { visible: true, opacity: 1 },
      alerts: { visible: false, opacity: 0.7 }
    };
    this.layerState = JSON.parse(JSON.stringify(this.defaultLayers));
    this.hazards = {
      all: "National forecast overview",
      rainfall: "Rainfall & flood risk",
      cyclone: "Cyclone uncertainty",
      heatwave: "Heatwave uncertainty",
      western_disturbance: "Western disturbances",
      fog: "Fog & low visibility"
    };
    this.homeBounds = L.latLngBounds([[6.5, 67], [36.8, 98]]);
    this.map = L.map(elementId, {
      zoomControl: false, minZoom: 2.5, maxZoom: 9,
      zoomSnap: 0.25, zoomDelta: 0.5, keyboard: true,
      maxBounds: [[-12, 40], [58, 122]], maxBoundsViscosity: 0.8,
      attributionControl: true, zoomAnimation: false, fadeAnimation: false
    });
    this.map.attributionControl.setPrefix(false);
    this.map.attributionControl.addAttribution(
      '<a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet</a> · ' +
      '<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>'
    );
    L.control.scale({ imperial: false, maxWidth: 100, position: "bottomleft" }).addTo(this.map);
    this.groups = {};
    ["basemap", "nwp", "bust", "drift", "synoptic", "alerts", "districts"].forEach((key, i) => {
      const pane = this.map.createPane("aegis-" + key);
      pane.style.zIndex = String(210 + i * 30);
      if (key !== "districts") pane.style.pointerEvents = "none";
      this.groups[key] = L.layerGroup();
    });
    this.markers = new Map();
    this.renderBasemap();
    this.resetView();
    this.renderLayers();
    this.setupControls();
    this.map.on("zoomend", () => this.renderMarkers());
    this.map.on("zoomend moveend", () => this.updateMapStatus());
    let resizeFrame;
    this.resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        this.map.invalidateSize({ pan: false, debounceMoveend: true });
        if (this.homeView) this.fitHome();
      });
    });
    this.resizeObserver.observe(document.getElementById(elementId));
    this.map.on("dragstart zoomstart", () => { if (!this.fitting) this.homeView = false; });
  }

  point(district) { return L.latLng(district.geo[1], district.geo[0]); }
  data(district) { return district.leadTimes[this.currentLeadDay]; }
  color(data) {
    return data.trust >= 80 ? "#16866a" : data.trust >= 50 ? "#b57b16" :
      data.trust >= 25 ? "#d66a32" : "#c54750";
  }
  matchesHazard(district) {
    return this.currentHazard === "all" || district.primaryHazard === this.currentHazard || district.secondaryHazard === this.currentHazard;
  }
  getVisibleDistricts() {
    return DISTRICT_DATABASE.filter(d => this.matchesHazard(d) &&
      (this.viewMode !== "hotspots" || this.data(d).bustProb > 70));
  }
  renderBasemap() {
    const pane = "aegis-basemap";
    L.geoJSON(AEGIS_BASEMAP, {
      pane: pane, interactive: false,
      style: feature => ({
        color: feature.properties.name === "India" ? "#9bb4bf" : "#c9d6d9",
        weight: feature.properties.name === "India" ? 1.5 : 0.8,
        fillColor: feature.properties.name === "India" ? "#fbfcf8" : "#e6ece8",
        fillOpacity: 1, smoothFactor: 0.5
      })
    }).addTo(this.groups.basemap);
    for (let lat = 0; lat <= 50; lat += 10) {
      L.polyline([[lat, 40], [lat, 120]], {
        pane: pane, interactive: false, color: "#91adb9", weight: 0.5, opacity: 0.22, dashArray: "3 6"
      }).addTo(this.groups.basemap);
    }
    for (let lon = 50; lon <= 110; lon += 10) {
      L.polyline([[-10, lon], [55, lon]], {
        pane: pane, interactive: false, color: "#91adb9", weight: 0.5, opacity: 0.22, dashArray: "3 6"
      }).addTo(this.groups.basemap);
    }
    [
      ["INDIA", 23, 79, "country"], ["PAKISTAN", 29.5, 68, "neighbor"],
      ["NEPAL", 28.4, 84.3, "neighbor"], ["CHINA", 34.5, 91, "neighbor"],
      ["BANGLADESH", 24.3, 90.3, "neighbor"], ["MYANMAR", 21, 95.5, "neighbor"],
      ["SRI LANKA", 7.3, 80.8, "neighbor"], ["ARABIAN SEA", 15, 66.5, "sea"],
      ["BAY OF BENGAL", 15, 88, "sea"], ["INDIAN OCEAN", 3, 78, "sea"]
    ].forEach(label => {
      L.marker([label[1], label[2]], {
        pane: pane, interactive: false, keyboard: false,
        icon: L.divIcon({
          className: "geo-label " + label[3], html: label[0],
          iconSize: [130, 20], iconAnchor: [65, 10]
        })
      }).addTo(this.groups.basemap);
    });
  }

  renderLayers() {
    Object.entries(this.groups).forEach(([key, group]) => {
      if (key !== "basemap") group.clearLayers();
    });
    this.markers.clear();
    const districts = this.getVisibleDistricts();
    districts.forEach(d => {
      const data = this.data(d);
      const point = this.point(d);
      const color = this.color(data);
      const circle = (group, options) => L.circleMarker(point, Object.assign({
        pane: "aegis-" + group, interactive: false
      }, options)).addTo(this.groups[group]);
      // Screen-sized symbols are statistical encodings, not geographical alert extents.
      circle("bust", { radius: 16 + data.bustProb * 0.13, stroke: false, fillColor: color, fillOpacity: 0.3 });
      circle("drift", { radius: 21 + data.drift * 13, color: "#7160a7", weight: 2,
        opacity: 0.9, dashArray: "3 5", fill: false });
      if (data.bustProb > 70) circle("alerts", {
        radius: 35, color: "#c54750", weight: 1.5, opacity: 0.9, fill: false, dashArray: "6 4"
      });
      const hazardTags = { rainfall: "RAIN", cyclone: "CYCLONE", heatwave: "HEAT",
        western_disturbance: "WESTERN", fog: "FOG" };
      L.marker(point, { pane: "aegis-synoptic", interactive: false, keyboard: false,
        icon: L.divIcon({ className: "geo-hazard-label", html: hazardTags[d.primaryHazard],
          iconSize: [56, 18], iconAnchor: [28, 40] })
      }).addTo(this.groups.synoptic);
      if (["rainfall", "cyclone"].includes(this.currentHazard)) {
        L.marker(point, { pane: "aegis-nwp", interactive: false, keyboard: false,
          icon: L.divIcon({ className: "geo-rain-label",
            html: data.nwpRain + " mm", iconSize: [60, 20], iconAnchor: [-19, -6] })
        }).addTo(this.groups.nwp);
      }
      const selected = d.id === this.selectedDistrictId;
      const marker = L.marker(point, {
        pane: "aegis-districts", keyboard: true, riseOnHover: true,
        title: d.name + " · trust " + data.trust + "/100",
        icon: L.divIcon({
          className: "geo-marker" + (selected ? " is-selected" : ""),
          html: '<span class="geo-pin" style="--pin-color:' + color + '">' + data.trust + "</span>",
          iconSize: [30, 30], iconAnchor: [15, 15]
        })
      });
      const tooltip = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = d.name;
      const details = document.createElement("span");
      details.textContent = "Trust " + data.trust + "/100 · Bust risk " + data.bustProb + "%";
      tooltip.append(name, details);
      marker.bindTooltip(tooltip, { className: "geo-tooltip", direction: "top", offset: [0, -16] });
      marker.on("add", () => {
        const el = marker.getElement();
        if (el) {
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", d.name + ", trust " + data.trust + " out of 100. Open details.");
          el.dataset.districtId = d.id;
        }
      });
      marker.on("click", () => this.selectDistrict(d.id, { focus: false }));
      this.markers.set(d.id, marker);

    });
    this.renderMarkers();
    this.applyLayerStyles();
    this.updateMapStatus();
  }

  renderMarkers() {
    this.groups.districts.clearLayers();
    const pending = this.getVisibleDistricts().slice();
    const zoom = this.map.getZoom();
    const near = (a, b) => this.map.project(this.point(a), zoom).distanceTo(this.map.project(this.point(b), zoom)) < 42;
    while (pending.length) {
      const cluster = [pending.shift()];
      if (zoom < 6) {
        let changed = true;
        while (changed) {
          changed = false;
          for (let i = pending.length - 1; i >= 0; i--) {
            if (cluster.some(d => near(d, pending[i]))) {
              cluster.push(pending.splice(i, 1)[0]);
              changed = true;
            }
          }
        }
      }
      if (cluster.length === 1) {
        const marker = this.markers.get(cluster[0].id);
        if (marker) this.groups.districts.addLayer(marker);
      } else {
        const bounds = L.latLngBounds(cluster.map(d => this.point(d)));
        const names = cluster.map(d => d.name).join(", ");
        const marker = L.marker(bounds.getCenter(), {
          pane: "aegis-districts", keyboard: true, title: "Zoom to " + names,
          icon: L.divIcon({ className: "geo-cluster", html: "<span>" + cluster.length + " sites</span>",
            iconSize: [56, 32], iconAnchor: [28, 16] })
        });
        marker.on("add", () => {
          marker.getElement().setAttribute("role", "button");
          marker.getElement().setAttribute("aria-label", "Zoom to " + cluster.length + " locations: " + names);
        });
        marker.on("click", () => {
          this.homeView = false;
          this.map.setView(bounds.getCenter(), Math.min(zoom + 2, 8), { animate: false });
        });
        this.groups.districts.addLayer(marker);
      }
    }
  }

  applyLayerStyles() {
    Object.entries(this.groups).forEach(([key, group]) => {
      const state = this.layerState[key];
      const available = key !== "nwp" || ["rainfall", "cyclone"].includes(this.currentHazard);
      const visible = state.visible && available;
      if (visible && !this.map.hasLayer(group)) this.map.addLayer(group);
      if (!visible && this.map.hasLayer(group)) this.map.removeLayer(group);
      this.map.getPane("aegis-" + key).style.opacity = String(state.opacity);
      this.map.getContainer().dataset[key + "Visible"] = String(visible);
      this.map.getContainer().dataset[key + "Opacity"] = String(state.opacity);
    });
    this.updateMapStatus();
  }
  setLeadDay(day) {
    const value = Number(day);
    if (!Number.isInteger(value) || value < 1 || value > 10) return;
    this.currentLeadDay = value;
    this.renderLayers();
  }
  setHazard(hazard) {
    if (!this.hazards[hazard]) return;
    this.currentHazard = hazard;
    const matching = DISTRICT_DATABASE.filter(d => this.matchesHazard(d));
    if (!matching.some(d => d.id === this.selectedDistrictId)) this.selectedDistrictId = matching[0]?.id;
    this.renderLayers();
    this.syncControls();
    this.resetView(false);
  }
  setViewMode(mode) {
    this.viewMode = mode === "hotspots" ? "hotspots" : "all";
    this.renderLayers();
    this.syncControls();
    const visible = this.getVisibleDistricts();
    if (this.viewMode === "hotspots" && visible.length) {
      this.homeView = false;
      this.map.fitBounds(L.latLngBounds(visible.map(d => this.point(d))).pad(0.25),
        { maxZoom: 6, padding: [55, 55], animate: false });
    } else this.resetView(false);
  }
  selectDistrict(id, options = {}) {
    const district = DISTRICT_DATABASE.find(d => d.id === id);
    if (!district) return;
    if (!this.matchesHazard(district)) this.currentHazard = district.primaryHazard;
    if (this.viewMode === "hotspots" && this.data(district).bustProb <= 70) this.viewMode = "all";
    this.selectedDistrictId = id;
    this.layerState.districts.visible = true;
    this.renderLayers();
    this.syncControls();
    if (options.focus !== false) {
      this.homeView = false;
      this.map.setView(this.point(district), Math.max(this.map.getZoom(), 6), { animate: false });
    }
    if (this.onDistrictSelect) this.onDistrictSelect(district, this.currentLeadDay);
  }
  fitHome() {
    this.fitting = true;
    this.map.fitBounds(this.homeBounds, { padding: [22, 24], animate: false });
    this.fitting = false;
    this.homeView = true;
  }
  resetView(clearFilter = true) {
    if (clearFilter && this.viewMode !== "all") {
      this.viewMode = "all";
      this.renderLayers();
    }
    this.fitHome();
    this.syncControls();
  }
  syncControls() {
    ["viewModeAll", "viewModeHotspots"].forEach((id, i) => {
      const active = this.viewMode === (i === 0 ? "all" : "hotspots");
      const button = document.getElementById(id);
      button?.classList.toggle("active", active);
      button?.setAttribute("aria-pressed", String(active));
    });
    const checkbox = document.getElementById("toggleLayerDistricts");
    if (checkbox) checkbox.checked = this.layerState.districts.visible;
  }
  updateMapStatus() {
    if (!this.map._loaded) return;
    const shown = this.getVisibleDistricts();
    const summary = document.getElementById("mapSummary");
    if (summary) summary.textContent = shown.length + " sample location" + (shown.length === 1 ? "" : "s") +
      (!this.layerState.districts.visible ? " · markers hidden" :
        this.viewMode === "hotspots" ? " · bust risk above 70%" : " · select a marker to inspect");
    const title = document.getElementById("mapHazardTitle");
    if (title) title.textContent = this.hazards[this.currentHazard];
    document.getElementById("mapEmptyState")?.classList.toggle("hidden", shown.length !== 0);
    const element = this.map.getContainer();
    element.dataset.zoom = this.map.getZoom().toFixed(2);
    element.dataset.visibleDistricts = shown.map(d => d.id).join(",");
    element.dataset.hazard = this.currentHazard;
    element.dataset.leadDay = String(this.currentLeadDay);
    element.dataset.selectedDistrict = this.selectedDistrictId || "";
    document.getElementById("btnZoomIn").disabled = this.map.getZoom() >= this.map.getMaxZoom();
    document.getElementById("btnZoomOut").disabled = this.map.getZoom() <= this.map.getMinZoom();
  }
  setupControls() {
    document.getElementById("btnZoomIn")?.addEventListener("click", () => this.map.zoomIn());
    document.getElementById("btnZoomOut")?.addEventListener("click", () => this.map.zoomOut());
    document.getElementById("btnResetView")?.addEventListener("click", () => this.resetView());
    document.getElementById("viewModeAll")?.addEventListener("click", () => this.setViewMode("all"));
    document.getElementById("viewModeHotspots")?.addEventListener("click", () => this.setViewMode("hotspots"));
    document.getElementById("btnClearMapFilter")?.addEventListener("click", () => this.setViewMode("all"));
  }
}
