(() => {
  const groups = window.WORD_WALL_DATA || [];
  const state = { group: null, pageIndex: 0, activeStandard: null, labOpen: false, labStandard: null };
  const STORAGE_KEY = "mww-progress-v1";
  const VIDEO_TITLES = {
    "https://go.screenpal.com/watch/cOfO6KnOkoC": "Orientation: What Does It Mean?",
    "https://go.screenpal.com/watch/cOfO68nOkoR": "Congruence Through Transformations",
    "https://go.screenpal.com/watch/cOfOXjnOkDt": "Dilations: Orientation and Congruence",
    "https://go.screenpal.com/watch/cOfOX2nOkDE": "Rotations: Orientation and Congruence",
    "https://go.screenpal.com/watch/cOfOXwnOkbA": "Reflections: Orientation and Congruence",
    "https://go.screenpal.com/watch/cOfOX3nOkb2": "Translations: Orientation and Congruence",
    "https://go.screenpal.com/watch/cOfOlYnOkYh": "Understanding Clockwise and Counterclockwise Rotations",
    "https://go.screenpal.com/watch/cOfthunOpmB": "Determining Algebraic Rules for Rotations",
    "https://go.screenpal.com/watch/cOfOlonOkqU": "Determining the Algebraic Rule for Translations",
    "https://go.screenpal.com/watch/cOfUfhnOJ6F": "Developing the Algebraic Rule for Reflections",
    "https://go.screenpal.com/watch/cOfUhunOJbD": "Identifying Dilation Problems",
    "https://go.screenpal.com/watch/cOfUhlnOJo8": "Matching Translations to Rules, Graphs, and Descriptions",
    "https://go.screenpal.com/watch/cOfUhNnOJqz": "Solving Problems with Reflections",
    "https://go.screenpal.com/watch/cOfUhJnOJqe": "Understanding Rotation Rules and Graphs",
    "https://go.screenpal.com/watch/cOfU12nOJrp": "Understanding Transformations in Geometry",
    "https://go.screenpal.com/watch/cOfOlQnOkqo": "Area and Perimeter After a Dilation",
    "https://go.screenpal.com/watch/cThUFQn6C0K": "Corresponding Sides in Shapes",
    "https://go.screenpal.com/watch/cThUFRn6CvT": "Understanding Ratios in Geometry",
    "https://go.screenpal.com/watch/cThUbHn6CYE": "Determining Similar Figures",
    "https://go.screenpal.com/watch/cThUF2n6CZw": "Understanding Proportional Shapes",
    "https://go.screenpal.com/watch/cThUb3n6CD2": "Understanding Figure Dilation",
    "https://go.screenpal.com/watch/cThUF8n6CUW": "Understanding Dilation and Scale Factor",
    "https://go.screenpal.com/watch/cThvqin6m": "Using the Numeric Solver to Solve for x",
    "https://go.screenpal.com/watch/cThvq4n6mhL": "Simplifying Fractions with a Calculator",
    "https://go.screenpal.com/watch/cOnjf1n395j": "Dilation and Scale Factor in Geometry",
    "https://go.screenpal.com/watch/cOnjeJn39Cl": "Understanding Dilations: Changing Characteristics of Shapes",
    "https://go.screenpal.com/watch/cOnjfDn395a": "Orientation and Dilation",
    "https://go.screenpal.com/watch/cOnjewn39pp": "Exploring Dilations on a Coordinate Plane",
    "https://go.screenpal.com/watch/cOnDoQn03s4": "Identifying Dilation as an Enlargement or Reduction",
    "https://somup.com/cOnDoFWOTn": "Finding the Scale Factor with Coordinate Points",
    "https://somup.com/cOnDoTWOTd": "Understanding Algebraic Scale Factors",
    "https://go.screenpal.com/watch/cOnXVbn01bd": "Finding the Rise",
    "https://go.screenpal.com/watch/cOnXVun01FG": "Finding the Run",
    "https://go.screenpal.com/watch/cOnXVCn01qR": "Finding Slope from a Graph",
    "https://go.screenpal.com/watch/cOnDo4n03Pu": "Understanding Proportional Relationships",
    "https://somup.com/cOnDDfWOU8": "Understanding Unit Rate",
    "https://somup.com/cOnb2iWu3R": "Reading Proportional Graphs",
    "https://go.screenpal.com/watch/cOnTFTn0MMU": "Slope from a Table",
    "https://somup.com/cOnOfxWE0s": "Slope from a Graph",
    "https://go.screenpal.com/watch/cOnTFJn0MPL": "y-intercept from a Table",
    "https://somup.com/cOnOfkWEZU": "y-intercept from a Graph",
    "https://go.screenpal.com/watch/cOnTbgn0MEM": "Slope and y-intercept from a Situation",
    "https://somup.com/cOnIFYW01D": "Solving for Slope with the Calculator",
    "https://somup.com/cOnTbFW5aB": "Graphing Proportional Equations with the Calculator",
    "https://go.screenpal.com/watch/cOnOf8n0Nr2": "Using a Calculator Table to Find Slope and y-intercept",
    "https://go.screenpal.com/watch/cOnOhTn0NTU": "Using Graph Points to Find Slope and y-intercept"
  };
  const $ = (selector) => document.querySelector(selector);

  const dashboardView = $("#dashboardView");
  const workspaceView = $("#workspaceView");
  const groupList = $("#groupList");
  const mapHotspots = $("#mapHotspots");
  const search = $("#standardSearch");
  const lessonImage = $("#lessonImage");
  const videoDialog = $("#videoDialog");
  const videoFrame = $("#videoFrame");
  const videoDialogShell = $("#videoDialogShell");
  const lessonViewer = $("#lessonViewer");
  const transformLab = $("#transformLab");
  const standardsLab = $("#standardsLab");
  const lessonNavigation = $("#lessonNavigation");
  const lessonHotspots = $("#lessonHotspots");
  const whiteboardOverlay = $("#whiteboardOverlay");
  const whiteboardCanvas = $("#whiteboardCanvas");
  const whiteboardStage = $("#whiteboardStage");
  const whiteboardTextEntry = $("#whiteboardTextEntry");
  const openWhiteboardButton = $("#openWhiteboard");
  document.body.append(whiteboardOverlay, openWhiteboardButton);
  openWhiteboardButton.hidden = true;
  const WHITEBOARD_STORAGE_KEY = "mww-whiteboards-v1";
  const whiteboardState = {
    open: false,
    standard: null,
    tool: "pointer",
    color: "#10223d",
    width: 5,
    textSize: 30,
    operations: [],
    redo: [],
    draft: null,
    drawing: false,
    textPoint: null
  };

  function readProgress() {
    try {
      const progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { visited: {} };
      if ((progress.schemaVersion || 1) < 2) {
        if (progress.last?.groupId === "8-10") {
          progress.last.pageIndex = progress.last.pageIndex <= 1 ? 0 : progress.last.pageIndex - 1;
        }
        if (progress.visited?.["8-10"]) {
          progress.visited["8-10"] = [...new Set(progress.visited["8-10"].map(index => index <= 1 ? 0 : index - 1))];
        }
        progress.schemaVersion = 2;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
      if ((progress.schemaVersion || 2) < 3) {
        const moveForNewSupportPage = index => index >= 6 ? Math.min(index + 1, 8) : index;
        if (progress.last?.groupId === "8-10") progress.last.pageIndex = moveForNewSupportPage(progress.last.pageIndex);
        if (progress.visited?.["8-10"]) progress.visited["8-10"] = [...new Set(progress.visited["8-10"].map(moveForNewSupportPage))];
        progress.schemaVersion = 3;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
      if ((progress.schemaVersion || 3) < 4) {
        const moveForRedesigned82 = index => {
          if (index <= 1) return 0;
          if (index <= 3) return 1;
          if (index === 4) return 2;
          if (index <= 6) return 3;
          if (index === 7) return 4;
          if (index <= 9) return 5;
          if (index === 10) return 6;
          if (index <= 12) return 7;
          return 8;
        };
        if (progress.last?.groupId === "8-2") progress.last.pageIndex = moveForRedesigned82(progress.last.pageIndex);
        if (progress.visited?.["8-2"]) progress.visited["8-2"] = [...new Set(progress.visited["8-2"].map(moveForRedesigned82))];
        progress.schemaVersion = 4;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
      if ((progress.schemaVersion || 4) < 5) {
        const moveForRedesigned83 = index => {
          if (index <= 1) return 0;
          if (index <= 3) return 1;
          if (index === 4) return 2;
          if (index <= 6) return 3;
          if (index === 7) return 4;
          if (index <= 9) return 5;
          return 6;
        };
        if (progress.last?.groupId === "8-3") progress.last.pageIndex = moveForRedesigned83(progress.last.pageIndex);
        if (progress.visited?.["8-3"]) progress.visited["8-3"] = [...new Set(progress.visited["8-3"].map(moveForRedesigned83))];
        progress.schemaVersion = 5;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
      if ((progress.schemaVersion || 5) < 6) {
        const moveForRedesigned84 = index => {
          if (index <= 1) return 0;
          if (index <= 3) return 1;
          if (index === 4) return 2;
          if (index <= 6) return 3;
          if (index === 7) return 4;
          if (index <= 9) return 5;
          return 6;
        };
        if (progress.last?.groupId === "8-4") progress.last.pageIndex = moveForRedesigned84(progress.last.pageIndex);
        if (progress.visited?.["8-4"]) progress.visited["8-4"] = [...new Set(progress.visited["8-4"].map(moveForRedesigned84))];
        progress.schemaVersion = 6;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
      return progress;
    }
    catch { return { visited: {} }; }
  }

  function saveProgress() {
    const progress = readProgress();
    progress.last = {
      groupId: state.group.id,
      pageIndex: state.pageIndex,
      labStandard: state.labOpen ? state.labStandard : null
    };
    progress.visited ||= {};
    progress.visited[state.group.id] ||= [];
    if (!progress.visited[state.group.id].includes(state.pageIndex)) {
      progress.visited[state.group.id].push(state.pageIndex);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function filteredGroups(query = "") {
    const needle = query.trim().toLowerCase();
    if (!needle) return groups;
    return groups.filter(group =>
      [group.code, group.topic, ...group.standards].join(" ").toLowerCase().includes(needle)
    );
  }

  function renderDashboard(query = "") {
    const shown = filteredGroups(query);
    groupList.innerHTML = "";
    shown.forEach(group => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "group-card";
      button.dataset.accent = group.accent;
      button.innerHTML = `
        <span class="group-index">${group.number}</span>
        <span><strong>${group.code} · ${group.topic}</strong><small>${group.standards.join(" · ")}</small></span>
        <span class="group-arrow" aria-hidden="true">→</span>`;
      button.addEventListener("click", () => openGroup(group.id));
      groupList.append(button);
    });
    $("#groupCount").textContent = `${shown.length} ${shown.length === 1 ? "group" : "groups"}`;
    $("#emptyState").hidden = shown.length > 0;
  }

  function renderHotspots() {
    groups.forEach(group => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-hotspot";
      button.style.left = `${group.pos[0]}%`;
      button.style.top = `${group.pos[1]}%`;
      button.setAttribute("aria-label", `Open ${group.code}: ${group.topic}`);
      button.title = `${group.code}: ${group.topic}`;
      button.addEventListener("click", () => openGroup(group.id));
      mapHotspots.append(button);
    });
  }

  function updateContinueCard() {
    const progress = readProgress();
    const card = $("#continueCard");
    const group = groups.find(item => item.id === progress.last?.groupId);
    if (!group) { card.hidden = true; return; }
    const page = group.pages[progress.last.pageIndex] || group.pages[0];
    $("#continueText").textContent = progress.last.labStandard
      ? `${progress.last.labStandard} — Interactive lab`
      : `${group.code} · ${group.topic} — ${page.resource}`;
    card.hidden = false;
    card.onclick = () => openGroup(group.id, progress.last.pageIndex, progress.last.labStandard);
  }

  function showView(view) {
    dashboardView.classList.toggle("is-active", view === "dashboard");
    workspaceView.classList.toggle("is-active", view === "workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openGroup(id, requestedPage, requestedLab) {
    const group = groups.find(item => item.id === id);
    if (!group) return;
    state.group = group;
    const saved = readProgress().last;
    const entryPage = Number.isInteger(group.entryPageIndex) ? group.entryPageIndex : Math.min(1, group.pages.length - 1);
    state.pageIndex = Number.isInteger(requestedPage)
      ? requestedPage
      : saved?.groupId === id ? Math.min(saved.pageIndex, group.pages.length - 1) : entryPage;
    state.activeStandard = group.pages[state.pageIndex].standard || null;
    state.labOpen = false;
    $("#groupNumber").textContent = group.number;
    $("#groupCode").textContent = group.code;
    $("#groupTitle").textContent = group.topic;
    $("#locationLabel").textContent = `${group.code} · ${group.topic}`;
    renderStandards();
    renderPage();
    showView("workspace");
    if (requestedLab && LABS[requestedLab]) showStandardLab(requestedLab);
  }

  function renderStandards() {
    const container = $("#standardList");
    container.innerHTML = "";
    state.group.standards.forEach(code => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "standard-button";
      button.textContent = code;
      button.classList.toggle("is-active", code === state.activeStandard);
      button.addEventListener("click", () => {
        const index = state.group.pages.findIndex(page => page.standard === code);
        state.activeStandard = code;
        setPage(index >= 0 ? index : 1);
      });
      container.append(button);
    });
  }

  function setPage(index) {
    if (!state.group) return;
    if (whiteboardState.open) closeWhiteboard();
    state.pageIndex = Math.max(0, Math.min(index, state.group.pages.length - 1));
    state.labOpen = false;
    state.labStandard = null;
    const page = state.group.pages[state.pageIndex];
    if (page.standard) state.activeStandard = page.standard;
    renderStandards();
    renderPage();
  }

  function standardPages() {
    if (!state.activeStandard) return state.group.pages.slice(0, Math.min(3, state.group.pages.length));
    const pages = state.group.pages.filter(page => page.standard === state.activeStandard);
    return pages.length ? pages : state.group.pages;
  }

  function renderResourceTabs() {
    const container = $("#resourceTabs");
    container.innerHTML = "";
    const currentPage = state.group.pages[state.pageIndex];
    const isHub = Array.isArray(currentPage.substandardHotspots);
    container.hidden = isHub;
    if (isHub) return;
    standardPages().forEach(page => {
      const index = state.group.pages.indexOf(page);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "resource-tab";
      button.classList.toggle("is-active", !state.labOpen && index === state.pageIndex);
      button.textContent = page.resource;
      button.addEventListener("click", () => setPage(index));
      container.append(button);
    });
    if (LABS[state.activeStandard]) {
      const labButton = document.createElement("button");
      labButton.type = "button";
      labButton.className = "resource-tab lab-resource-tab";
      labButton.classList.toggle("is-active", state.labOpen);
      labButton.textContent = "▶ Interactive lab";
      labButton.addEventListener("click", () => showStandardLab(state.activeStandard));
      container.append(labButton);
    }
  }

  function renderSubstandardHotspots(page) {
    lessonHotspots.innerHTML = "";
    const hotspots = page.substandardHotspots || [];
    lessonHotspots.hidden = hotspots.length === 0;
    hotspots.forEach(hotspot => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "substandard-hotspot";
      button.style.left = `${hotspot.left}%`;
      button.style.top = `${hotspot.top}%`;
      button.style.width = `${hotspot.width}%`;
      button.style.height = `${hotspot.height}%`;
      button.setAttribute("aria-label", `Open ${hotspot.standard}: ${hotspot.label}`);
      button.title = `Open ${hotspot.standard}: ${hotspot.label}`;
      button.addEventListener("click", () => {
        const index = state.group.pages.findIndex(item => item.standard === hotspot.standard);
        if (index >= 0) setPage(index);
      });
      lessonHotspots.append(button);
    });
  }

  function renderVideos(page) {
    const overlay = $("#videoOverlays");
    const shelf = $("#videoShelf");
    const list = $("#videoList");
    overlay.innerHTML = "";
    list.innerHTML = "";
    shelf.hidden = page.videos.length === 0;
    (page.videoHotspots || []).forEach(video => {
      const displayTitle = VIDEO_TITLES[video.url] || video.title;
      const hotspot = document.createElement("button");
      hotspot.type = "button";
      hotspot.className = "video-hotspot";
      hotspot.style.left = `${video.left}%`;
      hotspot.style.top = `${video.top}%`;
      hotspot.style.width = `${video.width}%`;
      hotspot.style.height = `${video.height}%`;
      hotspot.setAttribute("aria-label", `Watch: ${displayTitle}`);
      hotspot.addEventListener("click", () => openVideo({ ...video, title: displayTitle }));
      overlay.append(hotspot);
    });
    page.videos.forEach(video => {
      const displayTitle = VIDEO_TITLES[video.url] || video.title;
      const shelfButton = document.createElement("button");
      shelfButton.type = "button";
      shelfButton.textContent = `▶ ${displayTitle}`;
      shelfButton.addEventListener("click", () => openVideo({ ...video, title: displayTitle }));
      list.append(shelfButton);
    });
  }

  function renderDots() {
    const progress = readProgress();
    const seen = progress.visited?.[state.group.id] || [];
    const container = $("#pageDots");
    container.innerHTML = "";
    state.group.pages.forEach((page, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "page-dot";
      dot.classList.toggle("is-active", index === state.pageIndex);
      dot.classList.toggle("is-seen", seen.includes(index) && index !== state.pageIndex);
      dot.setAttribute("aria-label", `Go to page ${index + 1}: ${page.resource}`);
      dot.addEventListener("click", () => setPage(index));
      container.append(dot);
    });
  }

  function renderProgress() {
    const seen = readProgress().visited?.[state.group.id] || [];
    const percent = Math.round((seen.length / state.group.pages.length) * 100);
    $("#progressText").textContent = `${percent}%`;
    $("#progressFill").style.width = `${percent}%`;
  }

  function renderPage() {
    const page = state.group.pages[state.pageIndex];
    document.body.classList.remove("lab-is-open");
    openWhiteboardButton.hidden = true;
    state.labOpen = false;
    state.labStandard = null;
    transformLab.hidden = true;
    standardsLab.hidden = true;
    lessonViewer.hidden = false;
    lessonNavigation.hidden = false;
    saveProgress();
    $("#pageKicker").textContent = page.standard || state.group.code;
    $("#pageTitle").textContent = page.resource;
    $("#pageCount").textContent = `Page ${state.pageIndex + 1} of ${state.group.pages.length}`;
    lessonImage.src = page.image;
    lessonImage.alt = `${state.group.code} ${state.group.topic}: ${page.resource}`;
    renderSubstandardHotspots(page);
    $("#previousPage").disabled = state.pageIndex === 0;
    $("#nextPage").disabled = state.pageIndex === state.group.pages.length - 1;
    renderResourceTabs();
    renderVideos(page);
    renderDots();
    renderProgress();
  }

  function showStandardLab(standard) {
    if (!LABS[standard]) return;
    document.body.classList.add("lab-is-open");
    openWhiteboardButton.hidden = false;
    state.labOpen = true;
    state.labStandard = standard;
    state.activeStandard = standard;
    lessonViewer.hidden = true;
    transformLab.hidden = true;
    standardsLab.hidden = false;
    $("#videoShelf").hidden = true;
    lessonNavigation.hidden = true;
    $("#pageKicker").textContent = standard;
    $("#pageTitle").textContent = "Interactive Lab";
    $("#pageCount").textContent = "Learn by doing";
    renderStandards();
    renderResourceTabs();
    renderStandardsLab(standard);
    saveProgress();
    standardsLab.scrollIntoView({ behavior: "smooth", block: "nearest" });
    openWhiteboard();
  }

  function showTransformationLab() {
    state.labOpen = true;
    lessonViewer.hidden = true;
    $("#videoShelf").hidden = true;
    lessonNavigation.hidden = true;
    transformLab.hidden = false;
    $("#pageKicker").textContent = "8.10C";
    $("#pageTitle").textContent = "Transformation Play Lab";
    $("#pageCount").textContent = "Interactive";
    renderResourceTabs();
    transformLab.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function openVideo(video) {
    $("#videoTitle").textContent = video.title;
    videoFrame.src = video.url.includes("go.screenpal.com/watch/")
      ? video.url.replace("/watch/", "/player/")
      : video.url;
    videoDialog.showModal();
  }

  function closeVideo() {
    videoFrame.src = "about:blank";
    videoDialogShell.classList.remove("is-expanded");
    videoDialog.close();
    $("#expandVideo span").textContent = "Expand";
  }

  function goHome() {
    if (whiteboardState.open) closeWhiteboard();
    document.body.classList.remove("lab-is-open");
    openWhiteboardButton.hidden = true;
    closeVideoIfOpen();
    $("#locationLabel").textContent = "Standards map";
    updateContinueCard();
    showView("dashboard");
  }

  function closeVideoIfOpen() {
    if (videoDialog.open) closeVideo();
  }

  function readSavedWhiteboards() {
    try { return JSON.parse(localStorage.getItem(WHITEBOARD_STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveWhiteboard() {
    if (!whiteboardState.standard) return;
    try {
      const boards = readSavedWhiteboards();
      boards[whiteboardState.standard] = {
        operations: whiteboardState.operations.slice(-300)
      };
      localStorage.setItem(WHITEBOARD_STORAGE_KEY, JSON.stringify(boards));
    } catch {
      $("#whiteboardHint").textContent = "Your browser could not save more whiteboard work, but this board will remain until the page closes.";
    }
  }

  function currentWhiteboardKey() {
    const standard = state.labStandard || "lab";
    const data = labRuntime.data || {};
    if (standard === "8.2A") return `${standard}:${data.phase || "sort"}:${data.visualIndex || 0}`;
    if (standard === "8.2B") return `${standard}:${data.phase || "numberLine"}:${data.phase === "application" ? data.applicationIndex || 0 : data.lineIndex || 0}`;
    if (standard === "8.10B") return `${standard}:activity`;
    return `${standard}:${data.index || 0}`;
  }

  function loadWhiteboard(boardKey) {
    const saved = readSavedWhiteboards()[boardKey] || {};
    whiteboardState.standard = boardKey;
    whiteboardState.operations = Array.isArray(saved.operations) ? saved.operations : [];
    whiteboardState.redo = [];
    whiteboardState.draft = null;
    whiteboardState.drawing = false;
  }

  function whiteboardPoint(event) {
    const rect = whiteboardCanvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    };
  }

  function drawWhiteboardOperation(context, operation, width, height) {
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = operation.color || "#10223d";
    context.fillStyle = operation.color || "#10223d";
    context.lineWidth = operation.width || 5;
    context.globalAlpha = operation.tool === "highlighter" ? .28 : 1;
    if (operation.tool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = Math.max(18, (operation.width || 5) * 2.6);
      context.globalAlpha = 1;
    }
    if (operation.tool === "text") {
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      context.font = `700 ${operation.size || 30}px Arial, sans-serif`;
      context.textBaseline = "top";
      context.fillText(operation.text, operation.point.x * width, operation.point.y * height);
    } else if (operation.tool === "line") {
      context.beginPath();
      context.moveTo(operation.start.x * width, operation.start.y * height);
      context.lineTo(operation.end.x * width, operation.end.y * height);
      context.stroke();
    } else if (operation.points?.length) {
      context.beginPath();
      context.moveTo(operation.points[0].x * width, operation.points[0].y * height);
      operation.points.slice(1).forEach(point => context.lineTo(point.x * width, point.y * height));
      if (operation.points.length === 1) context.lineTo(operation.points[0].x * width + .01, operation.points[0].y * height + .01);
      context.stroke();
    }
    context.restore();
  }

  function renderWhiteboard() {
    if (!whiteboardCanvas || !whiteboardStage) return;
    const rect = whiteboardStage.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(280, Math.round(rect.height));
    const density = Math.min(2, window.devicePixelRatio || 1);
    if (whiteboardCanvas.width !== Math.round(width * density) || whiteboardCanvas.height !== Math.round(height * density)) {
      whiteboardCanvas.width = Math.round(width * density);
      whiteboardCanvas.height = Math.round(height * density);
      whiteboardCanvas.style.width = `${width}px`;
      whiteboardCanvas.style.height = `${height}px`;
    }
    const context = whiteboardCanvas.getContext("2d");
    context.setTransform(density, 0, 0, density, 0, 0);
    context.clearRect(0, 0, width, height);
    whiteboardState.operations.forEach(operation => drawWhiteboardOperation(context, operation, width, height));
    if (whiteboardState.draft) drawWhiteboardOperation(context, whiteboardState.draft, width, height);
    const hint = $("#whiteboardHint");
    hint.hidden = whiteboardState.operations.length > 0 || Boolean(whiteboardState.draft);
    $("#whiteboardUndo").disabled = whiteboardState.operations.length === 0;
    $("#whiteboardRedo").disabled = whiteboardState.redo.length === 0;
  }

  function commitWhiteboardOperation(operation) {
    if (!operation) return;
    whiteboardState.operations.push(operation);
    if (whiteboardState.operations.length > 300) whiteboardState.operations.shift();
    whiteboardState.redo = [];
    whiteboardState.draft = null;
    saveWhiteboard();
    renderWhiteboard();
  }

  function updateWhiteboardTool(tool) {
    whiteboardState.tool = tool;
    const writing = tool !== "pointer";
    document.querySelectorAll("[data-whiteboard-tool]").forEach(button => {
      const active = button.dataset.whiteboardTool === tool;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    whiteboardCanvas.dataset.tool = tool;
    whiteboardCanvas.classList.toggle("is-writing", writing);
    document.body.classList.toggle("whiteboard-is-writing", whiteboardState.open && writing);
    if (!writing) {
      whiteboardState.drawing = false;
      whiteboardState.draft = null;
      whiteboardTextEntry.hidden = true;
      whiteboardState.textPoint = null;
      renderWhiteboard();
    }
    $("#whiteboardHint").textContent = tool === "text"
      ? "Click anywhere on the board, type your note, and press Enter."
      : tool === "line" ? "Drag from one point to another to make a straight line."
      : tool === "eraser" ? "Drag across any mark to erase it. Undo is available."
      : "Draw anywhere. Your work stays here when you return to the lab.";
  }

  function openWhiteboard() {
    if (!state.labStandard) return;
    const boardKey = currentWhiteboardKey();
    if (whiteboardState.standard !== boardKey) loadWhiteboard(boardKey);
    whiteboardState.open = true;
    whiteboardOverlay.hidden = false;
    document.body.classList.add("whiteboard-is-open");
    openWhiteboardButton.setAttribute("aria-expanded", "true");
    openWhiteboardButton.textContent = "✎ Tools open";
    updateWhiteboardTool("pointer");
    requestAnimationFrame(renderWhiteboard);
  }

  function closeWhiteboard() {
    if (!whiteboardState.open) return;
    saveWhiteboard();
    whiteboardState.open = false;
    whiteboardState.drawing = false;
    whiteboardState.draft = null;
    whiteboardTextEntry.hidden = true;
    whiteboardOverlay.hidden = true;
    document.body.classList.remove("whiteboard-is-open");
    document.body.classList.remove("whiteboard-is-writing");
    openWhiteboardButton.setAttribute("aria-expanded", "false");
    openWhiteboardButton.textContent = "✎ Writing tools";
    openWhiteboardButton.focus();
  }

  function syncWhiteboardQuestion() {
    if (!whiteboardState.open) return;
    const boardKey = currentWhiteboardKey();
    if (whiteboardState.standard === boardKey) return;
    saveWhiteboard();
    loadWhiteboard(boardKey);
    renderWhiteboard();
  }

  function showWhiteboardTextEntry(event) {
    const stageRect = whiteboardStage.getBoundingClientRect();
    const point = whiteboardPoint(event);
    whiteboardState.textPoint = point;
    whiteboardTextEntry.value = "";
    whiteboardTextEntry.style.left = `${Math.min(stageRect.width - 240, Math.max(8, event.clientX - stageRect.left))}px`;
    whiteboardTextEntry.style.top = `${Math.min(stageRect.height - 52, Math.max(8, event.clientY - stageRect.top))}px`;
    whiteboardTextEntry.hidden = false;
    requestAnimationFrame(() => whiteboardTextEntry.focus());
  }

  function commitWhiteboardText() {
    if (whiteboardTextEntry.hidden) return;
    const textValue = whiteboardTextEntry.value.trim();
    whiteboardTextEntry.hidden = true;
    if (!textValue || !whiteboardState.textPoint) return;
    commitWhiteboardOperation({
      tool: "text",
      color: whiteboardState.color,
      size: whiteboardState.textSize,
      point: whiteboardState.textPoint,
      text: textValue
    });
    whiteboardState.textPoint = null;
  }

  const LABS = {
    "8.5A": {
      title: "One Relationship, Four Representations",
      description: "Work through twelve proportional relationships. Each problem begins with a graph, equation, table, or real-world situation, and you build the other three representations. Use two quality points when graphing, complete every missing table value, and write each equation in the form y = kx + b.",
      summary: "You connected proportional graphs, equations, tables, and real-world situations. In every representation, the slope k is the constant of proportionality: it tells how much y changes for each increase of 1 in x. Every proportional graph is a straight line through the origin, every table includes the pair (0, 0), and every equation can be written as y = kx + 0. That is why all twelve y-intercepts were zero.",
      videos: [
        ["https://somup.com/cOefFGWNaN", "Proportional Relationships and Equations"],
        ["https://somup.com/cOefFfWNyn", "Graphing a Proportional Relationship"],
        ["https://somup.com/cOefF2WNyC", "Creating a Proportional Table"],
        ["https://somup.com/cOefqlWNAR", "Creating a Proportional Table with a Calculator"]
      ]
    },
    "8.5B": {
      title: "Non-Proportional: One Relationship, Four Representations",
      description: "Work through twelve non-proportional linear relationships. Each problem begins with a graph, equation, table, or real-world situation, and you build the other three representations. Use two quality points when graphing, complete every missing table value, and connect the rate of change m and initial value b in y = mx + b.",
      summary: "You connected non-proportional graphs, equations, tables, and real-world situations. The slope m tells how much y changes for each increase of 1 in x, while the y-intercept b tells the value of y when x = 0. Every relationship in this lab had a nonzero starting value, so its graph crossed the y-axis above zero and did not pass through the origin. You also learned that a table may not show x = 0 directly—you can use the constant rate of change to work backward and identify b.",
      videos: [
        ["https://go.screenpal.com/watch/cOefYvnZ2DB", "Graphing Non-Proportional Situations"],
        ["https://go.screenpal.com/watch/cOehIvnZDRZ", "Converting Non-Proportional Situations into Tables"],
        ["https://somup.com/cOefq8WNpX", "Converting Non-Proportional Situations into Equations"],
        ["https://go.screenpal.com/watch/cOefYvnZ2DB", "Graphing a Non-Proportional Situation with the Calculator"]
      ]
    },
    "8.5C": {
      title: "Bivariate Data Pattern Lab",
      description: "Create three original 10-point scatterplots, then sort twenty-eight more scatterplots by the kind of pattern they show. Look at the overall shape of the data: a linear relationship follows a straight-line trend, even when the points do not land perfectly on one line.",
      summary: "You created positive, negative, and no-association scatterplots and classified twenty-eight additional bivariate data sets. A positive linear association rises from left to right, while a negative linear association falls from left to right. The points do not have to form a perfect line; they must cluster around a straight-line trend. Curved patterns and data with no clear direction do not suggest a linear relationship.",
      videos: [
        ["https://somup.com/cOeh2oWPZP", "Understanding Bivariate Sets of Data"],
        ["https://go.screenpal.com/watch/cOeh2OnZbiF", "Positive Linear Association"],
        ["https://go.screenpal.com/watch/cOeh2OnZbiF", "Negative Linear Association"],
        ["https://go.screenpal.com/watch/cOeh2OnZbiF", "No Association"]
      ]
    },
    "8.5D": {
      title: "Trend Lines: Choose, Model, Predict",
      description: "Study ten realistic scatterplots with clustered data. First choose the line that best represents the overall trend; then use that line to make the closest reasonable prediction. The work-paper side of every problem stays open for your slope, equation, plotted answer choices, and other calculations.",
      summary: "You selected trend lines that passed through the middle of clustered data with roughly the same number of points above and below. You rejected lines that opposed the association or sat above or below nearly every point. Then you used each best-fit line to estimate values. A prediction from a trend line is an approximation, so the best answer is the reasonable value closest to the line—not necessarily an exact data point.",
      videos: [
        ["https://go.screenpal.com/watch/cOeh2AnZbQk", "Understanding and Creating Quality Trend Lines"],
        ["https://go.screenpal.com/watch/cOehoQnZbDb", "Using Trend Lines for Predictions"]
      ]
    },
    "8.5E": {
      title: "Direct Variation: Name It, Build It, Use It",
      description: "Work through six direct-variation situations. For each one, identify the independent and dependent variables, build k as a word ratio, substitute the known values to find the constant of variation, write y = kx, and use the equation to solve a new question.",
      summary: "You connected the language of direct variation to the equation y = kx. In every problem, x was the independent variable, y was the dependent variable, and k = y/x described how much y there is for one unit of x. Once k was known, the same constant was used to solve a new value in the situation.",
      videos: []
    },
    "8.5F": {
      title: "Proportional or Non-Proportional? Sort the Evidence",
      description: "Work through seven sets of six representations. Categorize tables, graphs, equations, real-world descriptions, and mathematical verbal descriptions as proportional or non-proportional. The number in each category changes from round to round, so use the mathematics instead of looking for a pattern.",
      summary: "You distinguished proportional from non-proportional relationships across tables, graphs, equations, and verbal descriptions. Proportional relationships can be written y = kx and pass through (0, 0). Non-proportional linear relationships have a nonzero starting value. For tables that do not show x = 0, you used the y/x ratios instead of guessing from a constant rate of change.",
      videos: []
    },
    "8.5G": {
      title: "Function Language Lab: Read It, Explain It",
      description: "Complete two parts. Part 1 has five questions where you choose the verbal description that correctly explains why a relation is or is not a function. Part 2 has ten mixed representations—ordered pairs, tables, mappings, and graphs—and you build the explanation yourself with dropdown statements using x/y, input/output, and independent/dependent language.",
      summary: "You identified functions and explained the reason in precise language. A function requires every input, x-value, or independent value to correspond to exactly one output, y-value, or dependent value. Different inputs are allowed to share the same output. A relation is not a function only when at least one input corresponds to more than one output.",
      videos: []
    },
    "8.5H": {
      title: "Which Does Not Belong? Proportionality Game",
      description: "Play through fifteen four-card rounds. Eight rounds keep all four cards in the same representation—two table rounds, two graph rounds, two situation rounds, and two equation rounds. Seven final rounds mix a table, graph, equation, and real-world situation. In every round, three relationships belong to one proportionality category and exactly one does not.",
      summary: "You compared linear relationships across tables, graphs, equations, and real-world situations. Proportional relationships have a constant ratio, pass through the origin, can be written y = kx, and have no starting amount. Non-proportional linear relationships have a nonzero starting value. You identified the odd relationship without relying on the representation type.",
      videos: []
    },
    "8.5I": {
      title: "Build the Equation: Find m, Find b, Write y = mx + b",
      description: "Write linear equations from fifteen different representations: verbal situations, ordered pairs, real-world situations that hide coordinate pairs inside the context, graphs, and tables. For every problem, type the slope and y-intercept first, then place those values into y = mx + b.",
      summary: "You wrote linear equations from verbal, numerical, tabular, graphical, and real-world representations. You identified slope as the rate of change, found the y-intercept as the value when x = 0, and used hidden coordinate pairs when the situation did not state the rate or starting value directly. Then you transferred m and b into y = mx + b.",
      videos: []
    },
    "8.4A": {
      title: "Slope: Do It With Me",
      description: "Choose four exact points on each line. The lab groups them into two pairs, and you complete the rise-first, run-second process for both pairs to prove that the slope stays the same. Pay attention to the value of each axis interval: the first five problems coach every move, and the final ten ask you to determine and enter both sets of signed changes yourself.",
      summary: "You calculated slope twice on every line and proved that any two pairs of points on the same line produce the same slope. The rise is the signed change in y, and the run is the signed change in x; when you move from the left point to the right point, the run is positive while the rise may be positive, negative, or zero. A vertical line has a run of zero, so both calculations show that its slope is undefined, while a horizontal line has a rise of zero and slope zero. You also connected the matching rise-over-run ratios to the equation and noticed that proportional lines pass through the origin while nonproportional lines have a nonzero y-intercept.",
      videos: [
        ["https://go.screenpal.com/watch/cOnXVbn01bd", "Finding the Rise"],
        ["https://go.screenpal.com/watch/cOnXVun01FG", "Finding the Run"],
        ["https://go.screenpal.com/watch/cOnXVCn01qR", "Finding Slope from a Graph"]
      ]
    },
    "8.4B": {
      title: "Proportional Relationships: Read It, Match It, Graph It",
      description: "Connect ten real-world proportional situations to their graphs. First, match five situations to the correct graph; then build five graphs by choosing two quality points, drawing the line, and submitting it for coaching. Every graph names the quantities on both axes and states what one interval represents so you can turn the unit rate into a reliable rise-and-run move.",
      summary: "You matched proportional situations to graphs and constructed graphs from two points of your choice. A proportional relationship has a constant unit rate, so its graph is a straight line through the origin and its slope equals the unit rate. Reading each axis interval before plotting helps you convert the rate into a grid move; multiply the rise and run by the same amount until both coordinates land on exact grid intersections. Two accurate points determine the line, and choosing points farther apart makes the relationship easier to verify.",
      videos: [
        ["https://go.screenpal.com/watch/cOnDo4n03Pu", "Understanding Proportional Relationships"],
        ["https://somup.com/cOnDDfWOU8", "Understanding Unit Rate"],
        ["https://somup.com/cOnb2iWu3R", "Reading Proportional Graphs"],
        ["https://somup.com/cOnTbFW5aB", "Graphing Proportional Equations with the Calculator"]
      ]
    },
    "8.3A": {
      title: "Similar Figures Ratio Builder",
      description: "Turn the second drawing so the figures are easier to compare, discover and color-match corresponding sides, then build valid proportions and solve for missing measures. The lab guides each decision and gives a helpful clue whenever a match or ratio needs another look.",
      summary: "You aligned similar figures, traced corresponding sides, and used color to keep ratios in the same order. A dilation preserves angle measures and creates proportional corresponding side lengths, even when the figures are drawn at different rotations on the page. Valid proportions compare Figure I to Figure II, use the reciprocal consistently, or compare matching pairs of sides within each figure. In real situations, mark corresponding lengths first, write one consistent proportion, and then solve for the missing measure.",
      videos: [
        ["https://go.screenpal.com/watch/cThUFQn6C0K", "Corresponding Sides in Shapes"],
        ["https://go.screenpal.com/watch/cThUFRn6CvT", "Understanding Ratios in Geometry"],
        ["https://go.screenpal.com/watch/cThUbHn6CYE", "Determining Similar Figures"],
        ["https://go.screenpal.com/watch/cThUF8n6CUW", "Understanding Dilation and Scale Factor"]
      ]
    },
    "8.3B": {
      title: "Dilation Attribute Explorer",
      description: "Choose the origin as the center of dilation, then drag one glowing vertex along its ray. The entire figure will grow or shrink with that point, helping you see which attributes change and which stay fixed.",
      summary: "You created five reductions and five enlargements with the origin as the center of dilation. Every coordinate, distance from the origin, side length, and perimeter is multiplied by the scale factor k, while area is multiplied by k². Corresponding angle measures, orientation, shape, and parallel relationships do not change, so the original figure and its dilation remain similar. A scale factor between 0 and 1 makes a reduction, and a scale factor greater than 1 makes an enlargement; when k is not 1, congruence is not preserved.",
      videos: [
        ["https://go.screenpal.com/watch/cOnjf1n395j", "Dilation and Scale Factor in Geometry"],
        ["https://go.screenpal.com/watch/cOnjeJn39Cl", "Changing and Unchanging Attributes"],
        ["https://go.screenpal.com/watch/cOnjfDn395a", "Orientation and Dilation"],
        ["https://go.screenpal.com/watch/cOnjewn39pp", "Dilations on a Coordinate Plane"]
      ]
    },
    "8.3C": {
      title: "Algebraic Dilation Rule Lab",
      description: "Connect descriptions, coordinate pairs, and figures on coordinate planes to algebraic dilation rules. Each question asks you to use the same multiplier for both coordinates and explain whether the result is a reduction, an enlargement, a translation, or not a dilation.",
      summary: "You matched verbal descriptions, coordinate pairs, and coordinate-plane figures to algebraic dilation rules. A dilation centered at the origin multiplies both coordinates by the same positive scale factor: (x, y) → (kx, ky). A scale factor between 0 and 1 creates a reduction, while a scale factor greater than 1 creates an enlargement. Adding constants describes a translation, and using different multipliers for x and y does not create a dilation because the figure’s proportions change.",
      videos: [
        ["https://go.screenpal.com/watch/cOnDoQn03s4", "Identifying Dilation as an Enlargement or Reduction"],
        ["https://somup.com/cOnDoFWOTn", "Finding the Scale Factor with Coordinate Points"],
        ["https://somup.com/cOnDoTWOTd", "Understanding Algebraic Scale Factors"]
      ]
    },
    "8.2A": {
      title: "Build the Real Number System",
      description: "First, drag or tap each number into its most specific category. Then choose the visual that correctly represents five relationships among the real-number sets.",
      summary: "You built the real-number system by simplifying and classifying different forms of numbers. Natural, whole, integer, and rational numbers are nested because every smaller set also belongs to the sets surrounding it. Repeating or terminating decimals are rational, while nonterminating, nonrepeating numbers are irrational. When classifying a number, simplify it first and then identify its most specific home.",
      videos: [
        ["https://go.screenpal.com/watch/cTe3f2niYMB", "Understanding Real Numbers"],
        ["https://go.screenpal.com/watch/cTe3fTniYLf", "Understanding Rational Numbers"],
        ["https://go.screenpal.com/watch/cTe3fAniYL5", "Understanding Integers and Whole Numbers"],
        ["https://go.screenpal.com/watch/cTe31JniYSa", "Understanding Whole Numbers"],
        ["https://go.screenpal.com/watch/cTe31LniYS9", "Understanding Natural Numbers"],
        ["https://go.screenpal.com/watch/cTe3fjniYMF", "Understanding Irrational Numbers"]
      ]
    },
    "8.2B": {
      title: "Estimate Square Roots on a Number Line",
      description: "Place square roots in relation to integers and unlabeled midpoint ticks. Then use square roots to find missing side lengths in five original real-world square-area problems.",
      summary: "You estimated square roots by locating the perfect squares on either side of each radicand. The closer the radicand is to one perfect square, the closer its square root is to that integer, and the unlabeled midpoint helps you decide which half of the interval contains the value. In square situations, area equals side length squared, so finding a missing side length requires the square root of the area. Use nearby perfect squares to check whether a calculator estimate is reasonable.",
      videos: [
        ["https://go.screenpal.com/watch/cTetFPniALx", "Squares and Square Roots"],
        ["https://go.screenpal.com/watch/cTetqeniANT", "Understanding Squaring Numbers"],
        ["https://go.screenpal.com/watch/cTeuclniBvT", "Area of a Square and Square Roots"],
        ["https://go.screenpal.com/watch/cTeucmniByc", "Understanding Square Roots"],
        ["https://go.screenpal.com/watch/cTeuc0niBwY", "Perfect Squares on a Number Line"],
        ["https://go.screenpal.com/watch/cTeuc4niBxX", "Understanding Non-Perfect Squares"]
      ]
    },
    "8.2C": {
      title: "Scientific Notation Place-Value Lab",
      description: "Convert very small and very large numbers in both directions, then identify the coefficient and exponent in scientific notation. Enter each response yourself so every zero and exponent sign matters.",
      summary: "You converted very small and very large values between standard notation and scientific notation. A positive exponent represents a value greater than or equal to one, while a negative exponent represents a value between zero and one. Zeros between nonzero digits are part of the number and must remain in the coefficient or standard-form value. A scientific-notation coefficient is at least 1 but less than 10, and the exponent records how many places the decimal moves.",
      videos: [
        ["https://go.screenpal.com/watch/cTffDtniSGz", "Understanding Decimal Notation"],
        ["https://go.screenpal.com/watch/cTffDUniSGN", "Understanding Scientific Notation"],
        ["https://go.screenpal.com/watch/cTfnFEniMN5", "Large Numbers to Scientific Notation"],
        ["https://go.screenpal.com/watch/cTfn31niLZE", "Expanding Scientific Notation"],
        ["https://go.screenpal.com/watch/cTfnF8niMP5", "Simplifying Scientific Notation"],
        ["https://go.screenpal.com/watch/cTfnqQniMSh", "Scientific to Standard Notation"],
        ["https://go.screenpal.com/watch/cTffDgniSHv", "Coefficients in Scientific Notation"],
        ["https://go.screenpal.com/watch/cTffbjniS7d", "Exponents in Scientific Notation"],
        ["https://go.screenpal.com/watch/cTffDLniSdW", "Base 10 in Scientific Notation"]
      ]
    },
    "8.2D": {
      title: "Order and Compare Real Numbers",
      description: "Order mixed real numbers on number lines and in sequences, then identify values that lie between two real numbers. Convert each form to a useful decimal approximation when the comparison is close.",
      summary: "You ordered and compared natural numbers, whole numbers, integers, rational numbers, and irrational numbers written in different forms. A decimal approximation creates a common form for comparing fractions, square roots, and familiar irrational values such as π. When negative values are involved, the number farther left on the number line is smaller, even when its absolute value is greater. To find a value between two numbers, first estimate both endpoints to the same decimal place and choose a value that is greater than the lower endpoint and less than the upper endpoint.",
      videoPlacement: "practice",
      videos: [
        ["https://go.screenpal.com/watch/cTfjqhnjQJj", "Using the Calculator to Order Real Numbers"],
        ["https://go.screenpal.com/watch/cTfl0bnj3pd", "Identifying a Value Between Two Numbers"]
      ]
    },
    "8.10A": {
      title: "Orientation + Congruence Lab",
      description: "Compare all four transformations on a coordinate plane. Name the exact transformation, then decide what happened to orientation and congruence.",
      summary: "You explored how translation, rotation, reflection, and dilation affect a figure. Translation and dilation keep the figure facing the same way, while rotations and reflections change its orientation in this word wall’s visual definition. Translations, rotations, and reflections preserve congruence because side lengths and angle measures stay the same. A dilation changes size, so it does not preserve congruence unless its scale factor is 1.",
      videos: [
        ["https://go.screenpal.com/watch/cOfO6KnOkoC", "Orientation: What Does It Mean?"],
        ["https://go.screenpal.com/watch/cOfO68nOkoR", "Congruence Through Transformations"],
        ["https://go.screenpal.com/watch/cOfOXjnOkDt", "Dilations: Orientation and Congruence"],
        ["https://go.screenpal.com/watch/cOfOX2nOkDE", "Rotations: Orientation and Congruence"],
        ["https://go.screenpal.com/watch/cOfOXwnOkbA", "Reflections: Orientation and Congruence"],
        ["https://go.screenpal.com/watch/cOfOX3nOkb2", "Translations: Orientation and Congruence"]
      ]
    },
    "8.10B": {
      title: "Congruence Sorting Lab",
      description: "Sort each transformation by the evidence it leaves behind, including its algebraic rule. Congruence is preserved only when size and shape stay the same.",
      summary: "You classified transformations by checking what happens to size and shape. Translations, rotations, and reflections are rigid transformations, so they preserve congruence. A dilation keeps the shape but changes the size when the scale factor is not 1. Use side lengths and angle measures as evidence instead of judging only by how a figure looks.",
      videos: [
        ["https://go.screenpal.com/watch/cOfO68nOkoR", "Congruence Through Transformations"]
      ]
    },
    "8.10C": {
      title: "Transformation + Rule Replay Challenge",
      description: "Press Play to observe a transformation, then identify the exact movement and its algebraic rule. The final exemplars reverse the thinking by giving you the rule first.",
      summary: "You connected visible transformations to their algebraic rules. Translations add constants to coordinates, reflections change the sign of one coordinate, rotations swap and change coordinate signs in predictable ways, and dilations multiply both coordinates by the same scale factor. You also worked backward from a rule to name the exact transformation. Use corresponding points and the origin as evidence whenever a diagram is difficult to interpret.",
      videos: [
        ["https://go.screenpal.com/watch/cOfOlYnOkYh", "Clockwise and Counterclockwise Vocabulary"],
        ["https://go.screenpal.com/watch/cOfthunOpmB", "Rotation Rules"],
        ["https://go.screenpal.com/watch/cOfOlonOkqU", "Translation Rules"],
        ["https://go.screenpal.com/watch/cOfUfhnOJ6F", "Reflection Rules"],
        ["https://go.screenpal.com/watch/cOfUhunOJbD", "Identifying Dilation Problems"],
        ["https://go.screenpal.com/watch/cOfUhlnOJo8", "Translation Problem Solving"],
        ["https://go.screenpal.com/watch/cOfUhNnOJqz", "Reflection Problem Solving"],
        ["https://go.screenpal.com/watch/cOfUhJnOJqe", "Rotation Problem Solving"]
      ]
    },
    "8.10D": {
      title: "Dilation Factor Drop Lab",
      description: "Compare two dilated figures centered at the origin. Drag the correct factor into the perimeter and area targets, or tap a factor and then tap a target.",
      summary: "You compared the perimeter and area of four dilated figures. If the scale factor is k, every length and the perimeter change by a factor of k. Area changes by a factor of k² because two dimensions are being scaled. This relationship works for enlargements and reductions, including fractional scale factors.",
      videos: [
        ["https://go.screenpal.com/watch/cOfOlQnOkqo", "Area and Perimeter After a Dilation"]
      ]
    }
  };

  const labRuntime = { standard: null, data: null, skipped: 0 };

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMathText(value) {
    return escapeHTML(value).replace(/(−?)√([0-9]+(?:\.[0-9]+)?|[A-Za-z])/g, (_, sign, radicand) => {
      const spoken = `${sign ? "negative " : ""}square root of ${radicand}`;
      const token = /^[A-Za-z]$/.test(radicand) ? `<mi>${radicand}</mi>` : `<mn>${radicand}</mn>`;
      return `<math class="radical-expression" display="inline" aria-label="${spoken}"><mrow>${sign ? "<mo>−</mo>" : ""}<msqrt>${token}</msqrt></mrow></math>`;
    });
  }

  function formatNumberDisplay(value) {
    return String(value).includes("<") ? value : formatMathText(value);
  }

  function setLabProgress(done, total, instruction) {
    $("#standardsLabProgress").textContent = `${done} of ${total} complete`;
    $("#standardsLabInstruction").textContent = instruction;
    $("#standardsLabProgressFill").style.width = `${total ? (done / total) * 100 : 0}%`;
  }

  function setLabFeedback(message, tone = "") {
    const feedback = $("#standardsLabFeedback");
    feedback.innerHTML = formatMathText(message);
    feedback.className = `lab-feedback${tone ? ` is-${tone}` : ""}`;
  }

  function showLabCompletion(standard) {
    const config = LABS[standard];
    const skippedNote = labRuntime.skipped
      ? ` You skipped ${labRuntime.skipped} ${labRuntime.skipped === 1 ? "problem" : "problems"}; restart the lab whenever you want to revisit them.`
      : "";
    $("#labCompletionTitle").textContent = labRuntime.skipped ? `${standard} pathway complete` : `${standard} connection complete`;
    $("#labCompletionText").textContent = `${config.summary}${skippedNote}`;
    $("#standardsLabCompletion").hidden = false;
    $("#skipLabProblem").disabled = true;
    setLabFeedback(labRuntime.skipped ? "You reached the end. Read the summary, then restart whenever you want to practice the skipped problems." : "Excellent work. Read the summary below and explain one connection in your own words.", labRuntime.skipped ? "" : "correct");
  }

  function renderLabVideos(standard) {
    const list = $("#standardsLabVideoList");
    list.innerHTML = "";
    list.closest(".standards-lab-videos").hidden = LABS[standard].videoPlacement === "practice";
    LABS[standard].videos.forEach(([url, title]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `▶ ${title}`;
      button.addEventListener("click", () => openVideo({ url, title }));
      list.append(button);
    });
  }

  function renderStandardsLab(standard, reset = false) {
    const config = LABS[standard];
    if (!config) return;
    if (reset || labRuntime.standard !== standard) {
      labRuntime.data = null;
      labRuntime.skipped = 0;
    }
    labRuntime.standard = standard;
    $("#skipLabProblem").disabled = false;
    $("#standardsLabBadge").textContent = `${standard} Lab`;
    $("#standardsLabTitle").textContent = config.title;
    $("#standardsLabDescription").textContent = config.description;
    $("#standardsLabCompletion").hidden = true;
    renderLabVideos(standard);
    if (standard === "8.2A") renderLab82A();
    if (standard === "8.2B") renderLab82B();
    if (standard === "8.2C") renderLab82C();
    if (standard === "8.2D") renderLab82D();
    if (standard === "8.3A") renderLab83A();
    if (standard === "8.3B") renderLab83B();
    if (standard === "8.3C") renderLab83C();
    if (standard === "8.4A") renderLab84A();
    if (standard === "8.4B") renderLab84B();
    if (standard === "8.5A") renderLab85A();
    if (standard === "8.5B") renderLab85B();
    if (standard === "8.5C") renderLab85C();
    if (standard === "8.5D") renderLab85D();
    if (standard === "8.5E") renderLab85E();
    if (standard === "8.5F") renderLab85F();
    if (standard === "8.5G") renderLab85G();
    if (standard === "8.5H") renderLab85H();
    if (standard === "8.5I") renderLab85I();
    if (standard === "8.10A") renderLabA();
    if (standard === "8.10B") renderLabB();
    if (standard === "8.10C") renderLabC();
    if (standard === "8.10D") renderLabD();
  }

  const LAB_ORIGIN = 300;
  const LAB_SCALE = 36;
  const BASE_TRIANGLE = [{ x: -5, y: 2 }, { x: -2, y: 2 }, { x: -3, y: 5 }];

  const SLOPE_LAB_TASKS = [
    { mode: "guided", title: "Positive slope through the origin", gridM: 1, gridB: 0, unitX: 1, unitY: 1 },
    { mode: "guided", title: "Negative slope with a y-intercept", gridM: -1, gridB: 2, unitX: 1, unitY: 2 },
    { mode: "guided", title: "Horizontal line", gridM: 0, gridB: 3, unitX: 2, unitY: 1 },
    { mode: "guided", title: "Vertical line", verticalX: 3, unitX: .5, unitY: 1 },
    { mode: "guided", title: "Positive slope with different axis units", gridM: 1, gridB: -1, unitX: .5, unitY: 2 },
    { mode: "independent", title: "Positive proportional line", gridM: 2, gridB: 0, unitX: 1, unitY: .5 },
    { mode: "independent", title: "Negative proportional line", gridM: -2, gridB: 0, unitX: 2, unitY: 1 },
    { mode: "independent", title: "Gentle positive slope", gridM: 1, gridB: 2, unitX: 2, unitY: .5 },
    { mode: "independent", title: "Steep negative slope", gridM: -1, gridB: -1, unitX: .5, unitY: 1 },
    { mode: "independent", title: "Horizontal line through the origin", gridM: 0, gridB: 0, unitX: .5, unitY: 2 },
    { mode: "independent", title: "Another vertical line", verticalX: -2, unitX: 2, unitY: .5 },
    { mode: "independent", title: "Positive slope with half-unit axes", gridM: 2, gridB: 0, unitX: .5, unitY: .5 },
    { mode: "independent", title: "Negative slope with a fractional intercept", gridM: -2, gridB: 1, unitX: 1, unitY: .5 },
    { mode: "independent", title: "Positive nonproportional line", gridM: .5, gridB: -1, unitX: 2, unitY: 2 },
    { mode: "independent", title: "Negative slope with unequal axis units", gridM: -1, gridB: 0, unitX: .5, unitY: 2 }
  ];

  const SLOPE_VIEW = { size: 640, originX: 320, originY: 280, step: 48, min: -5, max: 5 };

  function cleanSlopeNumber(value) {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
    return Math.abs(rounded) < .0001 ? 0 : rounded;
  }

  function displaySlopeNumber(value, showPositive = false) {
    const clean = cleanSlopeNumber(value);
    const magnitude = Math.abs(clean).toString();
    if (clean < 0) return `−${magnitude}`;
    return showPositive && clean > 0 ? `+${magnitude}` : magnitude;
  }

  function slopePointKey(point) {
    return `${point.gx},${point.gy}`;
  }

  function validSlopePoints(task) {
    const points = [];
    if (Number.isFinite(task.verticalX)) {
      for (let gy = SLOPE_VIEW.min; gy <= SLOPE_VIEW.max; gy += 1) points.push({ gx: task.verticalX, gy });
      return points;
    }
    for (let gx = SLOPE_VIEW.min; gx <= SLOPE_VIEW.max; gx += 1) {
      const gy = task.gridM * gx + task.gridB;
      if (gy < SLOPE_VIEW.min || gy > SLOPE_VIEW.max || Math.abs(gy - Math.round(gy)) > .001) continue;
      points.push({ gx, gy: Math.round(gy) });
    }
    return points;
  }

  function groupSlopePairs(points, task) {
    const makePair = (first, second, label) => {
      const ordered = [first, second].sort((a, b) => Number.isFinite(task.verticalX) ? a.gy - b.gy : a.gx - b.gx);
      return { start: ordered[0], end: ordered[1], label };
    };
    if (Number.isFinite(task.verticalX)) {
      const topToBottom = [...points].sort((a, b) => b.gy - a.gy);
      return [
        makePair(topToBottom[0], topToBottom[1], "Top pair"),
        makePair(topToBottom[2], topToBottom[3], "Bottom pair")
      ];
    }
    const leftToRight = [...points].sort((a, b) => a.gx - b.gx || a.gy - b.gy);
    return [
      makePair(leftToRight[0], leftToRight[1], "Left pair"),
      makePair(leftToRight[2], leftToRight[3], "Right pair")
    ];
  }

  function slopeScreenPoint(point) {
    return {
      x: SLOPE_VIEW.originX + point.gx * SLOPE_VIEW.step,
      y: SLOPE_VIEW.originY - point.gy * SLOPE_VIEW.step
    };
  }

  function slopeActualPoint(point, task) {
    return { x: cleanSlopeNumber(point.gx * task.unitX), y: cleanSlopeNumber(point.gy * task.unitY) };
  }

  function slopeWork(task, pair) {
    const first = slopeActualPoint(pair.start, task);
    const second = slopeActualPoint(pair.end, task);
    const rise = cleanSlopeNumber(second.y - first.y);
    const run = cleanSlopeNumber(second.x - first.x);
    const slope = run === 0 ? null : cleanSlopeNumber(rise / run);
    const intercept = Number.isFinite(task.verticalX) ? null : cleanSlopeNumber(task.gridB * task.unitY);
    return { first, second, rise, run, slope, intercept };
  }

  function slopeGcd(a, b) {
    let first = Math.abs(a);
    let second = Math.abs(b);
    while (second) [first, second] = [second, first % second];
    return first || 1;
  }

  function simplifiedSlopeText(rise, run) {
    if (run === 0) return "undefined";
    if (rise === 0) return "0";
    const scaledRise = Math.round(rise * 1000);
    const scaledRun = Math.round(run * 1000);
    const divisor = slopeGcd(scaledRise, scaledRun);
    const numerator = scaledRise / divisor;
    const denominator = scaledRun / divisor;
    if (denominator === 1) return displaySlopeNumber(numerator);
    return `${displaySlopeNumber(numerator)}/${displaySlopeNumber(denominator)}`;
  }

  function slopeEquation(task, work) {
    if (work.slope === null) return `x = ${displaySlopeNumber(task.verticalX * task.unitX)}`;
    const m = work.slope;
    const b = work.intercept;
    let xTerm = m === 0 ? "0" : m === 1 ? "x" : m === -1 ? "−x" : `${simplifiedSlopeText(m, 1)}x`;
    if (m === 0) return `y = ${displaySlopeNumber(b)}`;
    if (b > 0) xTerm += ` + ${displaySlopeNumber(b)}`;
    if (b < 0) xTerm += ` − ${displaySlopeNumber(Math.abs(b))}`;
    return `y = ${xTerm}`;
  }

  function slopeRelationship(task, work) {
    if (work.slope === null) return "Vertical line • not a proportional function";
    return work.intercept === 0 ? "Proportional • passes through (0, 0)" : `Nonproportional • y-intercept = ${displaySlopeNumber(work.intercept)}`;
  }

  function slopeRatioMarkup(work) {
    return `<span class="slope-ratio-label">m =</span><span class="slope-stacked-fraction"><span>${displaySlopeNumber(work.rise, true)}</span><span>${displaySlopeNumber(work.run, true)}</span></span><span class="slope-ratio-equals">=</span><strong>${simplifiedSlopeText(work.rise, work.run)}</strong>`;
  }

  function slopeGridMarkup(task) {
    let markup = "";
    for (let grid = SLOPE_VIEW.min; grid <= SLOPE_VIEW.max; grid += 1) {
      const x = SLOPE_VIEW.originX + grid * SLOPE_VIEW.step;
      const y = SLOPE_VIEW.originY - grid * SLOPE_VIEW.step;
      const axisClass = grid === 0 ? " slope-axis" : "";
      markup += `<line class="slope-grid-line${axisClass}" x1="${x}" y1="40" x2="${x}" y2="520"></line>`;
      markup += `<line class="slope-grid-line${axisClass}" x1="80" y1="${y}" x2="560" y2="${y}"></line>`;
      if (grid !== 0) {
        markup += `<text class="slope-tick-label" x="${x}" y="299" text-anchor="middle">${displaySlopeNumber(grid * task.unitX)}</text>`;
        markup += `<text class="slope-tick-label" x="302" y="${y + 4}" text-anchor="end">${displaySlopeNumber(grid * task.unitY)}</text>`;
      }
    }
    markup += `<text class="slope-axis-name" x="578" y="271">x</text><text class="slope-axis-name" x="330" y="28">y</text><circle class="slope-origin-dot" cx="320" cy="280" r="4"></circle>`;
    return markup;
  }

  function slopeLineMarkup(task) {
    if (Number.isFinite(task.verticalX)) {
      const x = slopeScreenPoint({ gx: task.verticalX, gy: 0 }).x;
      return `<line class="slope-given-line" x1="${x}" y1="20" x2="${x}" y2="540" clip-path="url(#slopeClip)"></line>`;
    }
    const first = slopeScreenPoint({ gx: -8, gy: task.gridM * -8 + task.gridB });
    const second = slopeScreenPoint({ gx: 8, gy: task.gridM * 8 + task.gridB });
    return `<line class="slope-given-line" x1="${first.x}" y1="${first.y}" x2="${second.x}" y2="${second.y}" clip-path="url(#slopeClip)"></line>`;
  }

  function slopeSelectedMarkup(data) {
    const membership = new Map();
    (data.pairs || []).forEach((pair, pairIndex) => {
      membership.set(slopePointKey(pair.start), { pairIndex, endpoint: "A" });
      membership.set(slopePointKey(pair.end), { pairIndex, endpoint: "B" });
    });
    return data.selected.map((point, index) => {
      const screen = slopeScreenPoint(point);
      const member = membership.get(slopePointKey(point));
      const paired = Boolean(member);
      const pairClass = member ? ` pair-${member.pairIndex + 1}` : "";
      const label = member ? `${member.pairIndex + 1}${member.endpoint}` : `P${index + 1}`;
      return `<g class="slope-selected-point${paired ? " is-paired" : ""}${pairClass}"><circle cx="${screen.x}" cy="${screen.y}" r="${paired ? 10 : 8}"></circle><text x="${screen.x + 12}" y="${screen.y - 12}">${label}</text></g>`;
    }).join("");
  }

  function slopeHitTargetsMarkup(task, data) {
    if (data.step !== "identify") return "";
    return validSlopePoints(task).map(point => {
      const screen = slopeScreenPoint(point);
      const actual = slopeActualPoint(point, task);
      return `<circle class="slope-point-hit" data-slope-gx="${point.gx}" data-slope-gy="${point.gy}" cx="${screen.x}" cy="${screen.y}" r="18" tabindex="0" role="button" aria-label="Select point (${displaySlopeNumber(actual.x)}, ${displaySlopeNumber(actual.y)})"></circle>`;
    }).join("");
  }

  function slopeMovementMarkup(task, data, work, pair, pairIndex) {
    if (!pair) return "";
    const active = pairIndex === data.pairIndex && !data.solved;
    const completed = Boolean(data.completedPairs?.[pairIndex]);
    const step = active ? data.step : completed ? "result" : "waiting";
    const start = slopeScreenPoint(pair.start);
    const end = slopeScreenPoint(pair.end);
    const corner = slopeScreenPoint({ gx: pair.start.gx, gy: pair.end.gy });
    const showRise = completed || ["run", "answer", "result"].includes(step);
    const showRun = completed || ["answer", "result"].includes(step);
    let markup = `<g class="slope-pair-path pair-${pairIndex + 1}${completed ? " is-complete" : ""}"><circle class="slope-pair-end" cx="${end.x}" cy="${end.y}" r="11"></circle>`;
    if (showRise) markup += `<line class="slope-rise-path" x1="${start.x}" y1="${start.y}" x2="${corner.x}" y2="${corner.y}"></line>`;
    if (showRun) markup += `<line class="slope-run-path" x1="${corner.x}" y1="${corner.y}" x2="${end.x}" y2="${end.y}"></line>`;
    if (showRise) markup += `<text class="slope-leg-label is-rise" x="${corner.x + 13}" y="${(start.y + corner.y) / 2}">${pairIndex + 1}: rise ${displaySlopeNumber(work.rise, true)}</text>`;
    if (showRun) markup += `<text class="slope-leg-label is-run" x="${(corner.x + end.x) / 2}" y="${corner.y - 13}" text-anchor="middle">${pairIndex + 1}: run ${displaySlopeNumber(work.run, true)}</text>`;
    if (active && (step === "rise" || step === "run")) {
      const resting = step === "rise" ? pair.start : { gx: pair.start.gx, gy: pair.end.gy };
      const handlePoint = data.dragPoint || resting;
      const handle = slopeScreenPoint(handlePoint);
      const zeroStep = step === "rise" ? work.rise === 0 : work.run === 0;
      if (!zeroStep) markup += `<g class="slope-drag-handle is-blinking" role="button" tabindex="0" aria-label="Drag to complete the ${step} for pair ${pairIndex + 1}"><circle cx="${handle.x}" cy="${handle.y}" r="15"></circle><circle cx="${handle.x}" cy="${handle.y}" r="5"></circle></g>`;
      if (task.mode === "guided") {
        const target = step === "rise" ? corner : end;
        markup += `<circle class="slope-guided-target" cx="${target.x}" cy="${target.y}" r="16"></circle>`;
      }
    }
    return markup + "</g>";
  }

  function slopeCoordinateList(data, task) {
    if (!data.selected.length) return "";
    return data.selected.map(point => {
      const actual = slopeActualPoint(point, task);
      return `<span>(${displaySlopeNumber(actual.x)}, ${displaySlopeNumber(actual.y)})</span>`;
    }).join("");
  }

  function slopeInstruction(task, data, work) {
    if (data.step === "identify") return `<h4>1. Identify four points</h4><p>Click four grid intersections that lie exactly on the line. Click a selected point again if you want to replace it.</p>`;
    const pairNumber = data.pairIndex + 1;
    const pairLabel = data.pairs?.[data.pairIndex]?.label || `Pair ${pairNumber}`;
    if (data.step === "rise") {
      if (work.rise === 0) return `<h4>${pairNumber}. ${pairLabel}: find the rise first</h4><p>The two points have the same y-value, so there is no vertical change.</p><button type="button" class="lab-action slope-zero-confirm" id="confirmSlopeZero">Confirm rise = 0</button>`;
      const guided = task.mode === "guided" ? ` The signed rise is <strong>${displaySlopeNumber(work.rise, true)}</strong>, so move ${work.rise > 0 ? "up" : "down"} ${displaySlopeNumber(Math.abs(work.rise))}.` : " Use the y-axis scale to determine how much the y-value changes.";
      return `<h4>${pairNumber}. ${pairLabel}: find the rise first</h4><p>Drag the blinking point vertically until it reaches the y-level of its paired point.${guided}</p>`;
    }
    if (data.step === "run") {
      if (work.run === 0) return `<h4>${pairNumber}. ${pairLabel}: find the run</h4><p>A vertical line has no horizontal change. Its run is zero, which makes the slope undefined.</p><button type="button" class="lab-action slope-zero-confirm" id="confirmSlopeZero">Confirm run = 0</button>`;
      const guided = task.mode === "guided" ? ` The run is <strong>${displaySlopeNumber(work.run, true)}</strong>, so move right ${displaySlopeNumber(work.run)}.` : " Use the x-axis scale to measure the horizontal change.";
      return `<h4>${pairNumber}. ${pairLabel}: find the run</h4><p>Now drag the blinking point straight right to its paired point.${guided}</p>`;
    }
    if (data.step === "answer") return `<h4>${pairNumber}. ${pairLabel}: name your changes</h4><p>Use the axis labels—not the number of grid spaces—to enter the signed rise and run for this pair.</p><div class="slope-answer-fields"><label>Signed rise<input id="slopeRiseAnswer" type="number" step="any" inputmode="decimal" value="${escapeHTML(data.answers.rise)}"></label><label>Run<input id="slopeRunAnswer" type="number" step="any" inputmode="decimal" value="${escapeHTML(data.answers.run)}"></label></div><button type="button" class="lab-action" id="checkSlopeWork">Check pair ${pairNumber}</button>`;
    return `<h4>Both calculations complete</h4><p>You used two different pairs of points and reached the same slope.</p>`;
  }

  function slopeResultsMarkup(task, data, works) {
    const completed = works.map((work, index) => ({ work, index })).filter(({ index }) => data.completedPairs?.[index]);
    if (!completed.length) return "";
    const proofRows = completed.map(({ work, index }) => `<div class="slope-pair-proof pair-${index + 1}"><span>Calculation ${index + 1} • ${escapeHTML(data.pairs[index].label)}</span><strong>rise ${displaySlopeNumber(work.rise, true)} • run ${displaySlopeNumber(work.run, true)}</strong><div class="slope-ratio-display">${slopeRatioMarkup(work)}</div></div>`).join("");
    const conclusion = data.solved
      ? `<div class="slope-equality-proof"><strong>Same line → same slope</strong><span>Both point pairs produce ${simplifiedSlopeText(works[0].rise, works[0].run)}.</span></div><div><span>Equation</span><strong>${slopeEquation(task, works[0])}</strong></div><p>${slopeRelationship(task, works[0])}</p>`
      : `<p class="slope-proof-prompt">Calculation 1 is complete. Now repeat rise over run with the second pair.</p>`;
    return `<section class="slope-result-card"><div class="slope-pair-proof-grid">${proofRows}</div>${conclusion}</section>`;
  }

  function resetSlopeTask(data) {
    data.selected = [];
    data.pairs = [];
    data.pairIndex = 0;
    data.completedPairs = [false, false];
    data.step = "identify";
    data.dragPoint = null;
    data.dragging = false;
    data.answers = { rise: "", run: "" };
    data.solved = false;
  }

  function completeSlopePair(data, task, work) {
    data.completedPairs[data.pairIndex] = true;
    const slopeText = simplifiedSlopeText(work.rise, work.run);
    data.dragPoint = null;
    data.answers = { rise: "", run: "" };
    if (data.pairIndex === 0) {
      data.pairIndex = 1;
      data.step = "rise";
      renderLab84A();
      return setLabFeedback(`Calculation 1 gives a slope of ${slopeText}. Now use the second pair to test whether the slope stays the same.`, "correct");
    }
    data.step = "result";
    data.solved = true;
    renderLab84A();
    setLabFeedback(`Both calculations give ${slopeText}. Different pairs of points on the same line produce the same slope.`, "correct");
  }

  function advanceSlopeMovement(data, task, work) {
    if (data.step === "rise") {
      data.step = "run";
      data.dragPoint = null;
      renderLab84A();
      return setLabFeedback(`Correct. The signed rise is ${displaySlopeNumber(work.rise, true)}. Now find the run by moving to the right.`, "correct");
    }
    data.dragPoint = null;
    if (task.mode === "guided") {
      completeSlopePair(data, task, work);
    } else {
      data.step = "answer";
      renderLab84A();
      setLabFeedback(`Pair ${data.pairIndex + 1} path complete. Enter its signed rise and run using the values marked on the axes.`);
    }
  }

  function renderLab84A() {
    if (!labRuntime.data) {
      labRuntime.data = { index: 0 };
      resetSlopeTask(labRuntime.data);
    }
    const data = labRuntime.data;
    if (data.index >= SLOPE_LAB_TASKS.length) return showLabCompletion("8.4A");
    const task = SLOPE_LAB_TASKS[data.index];
    const works = (data.pairs || []).map(pair => slopeWork(task, pair));
    const pair = data.pairs?.[data.pairIndex] || null;
    const work = works[data.pairIndex] || null;
    const completed = data.index + (data.solved ? 1 : 0);
    setLabProgress(completed, SLOPE_LAB_TASKS.length, task.mode === "guided" ? "Do it with me: calculate slope with both point pairs." : "Your turn: determine rise and run twice, then compare the slopes.");

    const selectedCount = data.selected.length;
    const pairMessage = pair
      ? `<div class="slope-pair-readout"><span>Calculation ${data.pairIndex + 1} of 2 • ${escapeHTML(pair.label)}</span><strong>(${displaySlopeNumber(work.first.x)}, ${displaySlopeNumber(work.first.y)}) → (${displaySlopeNumber(work.second.x)}, ${displaySlopeNumber(work.second.y)})</strong></div>`
      : `<div class="slope-point-counter"><strong>${selectedCount}/4</strong><span>points selected</span></div>`;
    const pairTrack = data.pairs?.length
      ? `<div class="slope-pair-track"><span class="${data.pairIndex === 0 && !data.solved ? "is-active" : "is-done"}">1 • ${escapeHTML(data.pairs[0].label)}</span><span class="${data.pairIndex === 1 && !data.solved ? "is-active" : data.solved ? "is-done" : ""}">2 • ${escapeHTML(data.pairs[1].label)}</span></div>`
      : "";
    const body = $("#standardsLabBody");
    body.innerHTML = `<div class="slope-lab-shell">
      <header class="slope-lab-header"><div><p class="lab-mini-title">Problem ${data.index + 1} of ${SLOPE_LAB_TASKS.length}</p><h4>${escapeHTML(task.title)}</h4></div><span class="slope-mode-chip ${task.mode}">${task.mode === "guided" ? "Do it with me" : "You do it"}</span></header>
      <div class="slope-lab-layout">
        <section class="slope-graph-card">
          <div class="slope-axis-scale"><span>x-axis: <strong>${displaySlopeNumber(task.unitX)}</strong> per interval</span><span>y-axis: <strong>${displaySlopeNumber(task.unitY)}</strong> per interval</span></div>
          <svg class="slope-lab-graph" data-slope-graph viewBox="0 0 640 560" role="img" aria-label="Coordinate plane with a ${escapeHTML(task.title.toLowerCase())}">
            <defs><clipPath id="slopeClip"><rect x="80" y="40" width="480" height="480" rx="12"></rect></clipPath></defs>
            <rect class="slope-graph-background" x="80" y="40" width="480" height="480" rx="12"></rect>
            ${slopeGridMarkup(task)}${slopeLineMarkup(task)}${slopeHitTargetsMarkup(task, data)}${slopeSelectedMarkup(data)}${works.map((pairWork, index) => slopeMovementMarkup(task, data, pairWork, data.pairs[index], index)).join("")}
          </svg>
          <div class="slope-coordinate-bank">${slopeCoordinateList(data, task) || "<span>Selected coordinates will appear here.</span>"}</div>
        </section>
        <aside class="slope-coaching-card">${pairMessage}${pairTrack}<div class="slope-step-track"><span class="${data.step === "identify" ? "is-active" : "is-done"}">1 Points</span><span class="${data.step === "rise" ? "is-active" : ["run","answer","result"].includes(data.step) ? "is-done" : ""}">2 Rise</span><span class="${data.step === "run" ? "is-active" : ["answer","result"].includes(data.step) ? "is-done" : ""}">3 Run</span><span class="${["answer","result"].includes(data.step) ? "is-active" : ""}">4 Connect</span></div><div class="slope-instruction-card">${slopeInstruction(task, data, work)}</div>${slopeResultsMarkup(task, data, works)}<button type="button" class="lab-next slope-next" id="nextSlopeProblem" ${data.solved ? "" : "hidden"}>${data.index === SLOPE_LAB_TASKS.length - 1 ? "Finish lab →" : "Next line →"}</button></aside>
      </div>
    </div>`;

    const graph = body.querySelector("[data-slope-graph]");
    if (data.step === "identify") {
      graph.addEventListener("click", event => {
        const targetPoint = event.target.closest?.("[data-slope-gx]");
        const rect = graph.getBoundingClientRect();
        const sx = (event.clientX - rect.left) * SLOPE_VIEW.size / rect.width;
        const sy = (event.clientY - rect.top) * 560 / rect.height;
        const gx = targetPoint ? Number(targetPoint.dataset.slopeGx) : Math.round((sx - SLOPE_VIEW.originX) / SLOPE_VIEW.step);
        const gy = targetPoint ? Number(targetPoint.dataset.slopeGy) : Math.round((SLOPE_VIEW.originY - sy) / SLOPE_VIEW.step);
        const snapped = slopeScreenPoint({ gx, gy });
        if (!targetPoint && Math.hypot(sx - snapped.x, sy - snapped.y) > 22) return setLabFeedback("Choose a precise grid intersection on the line.", "incorrect");
        const valid = validSlopePoints(task).find(point => point.gx === gx && point.gy === gy);
        if (!valid) return setLabFeedback("That intersection is not on the line. Trace the line to another exact grid crossing.", "incorrect");
        const existing = data.selected.findIndex(point => point.gx === gx && point.gy === gy);
        if (existing >= 0) {
          data.selected.splice(existing, 1);
          renderLab84A();
          return setLabFeedback("Point removed. Choose another point on the line.");
        }
        if (data.selected.length >= 4) return;
        data.selected.push(valid);
        if (data.selected.length === 4) {
          data.pairs = groupSlopePairs(data.selected, task);
          data.pairIndex = 0;
          data.step = "rise";
          renderLab84A();
          const grouping = Number.isFinite(task.verticalX) ? "the top two and bottom two points" : "the two left points and two right points";
          return setLabFeedback(`Four points found. The lab grouped ${grouping}. Begin Calculation 1 by finding the rise.`, "correct");
        }
        renderLab84A();
        setLabFeedback(`${data.selected.length} of 4 points selected. Keep tracing the same line.`);
      });
    }

    const zeroButton = $("#confirmSlopeZero");
    if (zeroButton) zeroButton.addEventListener("click", () => advanceSlopeMovement(data, task, work));

    const handle = body.querySelector(".slope-drag-handle");
    if (handle) {
      const resting = data.step === "rise" ? pair.start : { gx: pair.start.gx, gy: pair.end.gy };
      const target = data.step === "rise" ? { gx: pair.start.gx, gy: pair.end.gy } : pair.end;
      handle.addEventListener("pointerdown", event => {
        event.preventDefault();
        data.dragging = true;
        data.dragPoint = { ...resting };
        handle.setPointerCapture(event.pointerId);
      });
      handle.addEventListener("pointermove", event => {
        if (!data.dragging) return;
        event.preventDefault();
        const rect = graph.getBoundingClientRect();
        const gxRaw = ((event.clientX - rect.left) * SLOPE_VIEW.size / rect.width - SLOPE_VIEW.originX) / SLOPE_VIEW.step;
        const gyRaw = (SLOPE_VIEW.originY - (event.clientY - rect.top) * 560 / rect.height) / SLOPE_VIEW.step;
        data.dragPoint = data.step === "rise" ? { gx: resting.gx, gy: gyRaw } : { gx: gxRaw, gy: resting.gy };
        const screen = slopeScreenPoint(data.dragPoint);
        handle.querySelectorAll("circle").forEach(circle => { circle.setAttribute("cx", screen.x); circle.setAttribute("cy", screen.y); });
      });
      const finishDrag = event => {
        if (!data.dragging) return;
        event.preventDefault();
        data.dragging = false;
        if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        const closeEnough = data.dragPoint && Math.hypot(data.dragPoint.gx - target.gx, data.dragPoint.gy - target.gy) < .48;
        if (closeEnough) return advanceSlopeMovement(data, task, work);
        data.dragPoint = null;
        renderLab84A();
        setLabFeedback(data.step === "rise" ? "Keep the x-value fixed. Use the y-axis labels to stop at the second point’s y-level." : "Keep the y-value fixed and move right until you reach the second selected point.", "incorrect");
      };
      handle.addEventListener("pointerup", finishDrag);
      handle.addEventListener("pointercancel", finishDrag);
      handle.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        advanceSlopeMovement(data, task, work);
      });
    }

    const check = $("#checkSlopeWork");
    if (check) check.addEventListener("click", () => {
      data.answers.rise = $("#slopeRiseAnswer").value.trim();
      data.answers.run = $("#slopeRunAnswer").value.trim();
      if (data.answers.rise === "" || data.answers.run === "") return setLabFeedback("Enter both the signed rise and the run before checking.", "incorrect");
      const riseCorrect = Math.abs(Number(data.answers.rise) - work.rise) < .001;
      const runCorrect = Math.abs(Number(data.answers.run) - work.run) < .001;
      if (!riseCorrect || !runCorrect) {
        const clue = !riseCorrect ? `Recheck the y-axis: each interval is worth ${displaySlopeNumber(task.unitY)}, and direction determines the sign.` : `Recheck the x-axis: each interval is worth ${displaySlopeNumber(task.unitX)}.`;
        return setLabFeedback(clue, "incorrect");
      }
      completeSlopePair(data, task, work);
    });

    const next = $("#nextSlopeProblem");
    if (next) next.addEventListener("click", () => {
      if (data.index >= SLOPE_LAB_TASKS.length - 1) return showLabCompletion("8.4A");
      data.index += 1;
      resetSlopeTask(data);
      renderLab84A();
      setLabFeedback(data.index < 5 ? "New coached line ready. Identify four exact points and calculate slope twice." : "Your turn. Identify four exact points, then determine both sets of signed rise and run.");
    });
  }

  const PROPORTION_LAB_TASKS = [
    {
      phase: "match", title: "Smoothies for a study group",
      situation: "A smoothie shop charges $18 for 3 smoothies. The total cost y is proportional to the number of smoothies x.",
      xLabel: "number of smoothies", yLabel: "total cost ($)", xStep: 1, yStep: 3, rate: 6,
      options: [
        { slope: 3, intercept: 0, feedback: "This line represents $3 per smoothie. Divide $18 by 3 to find the unit rate." },
        { slope: 6, intercept: 6, feedback: "The rate is right, but this graph begins at $6. A proportional cost is $0 when 0 smoothies are purchased." },
        { slope: 6, intercept: 0 },
        { slope: 12, intercept: 0, feedback: "This line is twice as steep as the situation. Use $18 ÷ 3 to find the cost of one smoothie." }
      ], correct: 2,
      explanation: "$18 ÷ 3 = $6 per smoothie, so the graph passes through (0, 0), (1, 6), and (3, 18)."
    },
    {
      phase: "match", title: "Pages from a classroom printer",
      situation: "A classroom printer produces 4 pages in 2 minutes at a constant rate. The number of pages y is proportional to time x.",
      xLabel: "time (minutes)", yLabel: "number of pages", xStep: 1, yStep: 2, rate: 2,
      options: [
        { slope: 2, intercept: 0 },
        { slope: 1, intercept: 0, feedback: "This shows only 1 page per minute. Simplify 4 pages in 2 minutes to a unit rate." },
        { slope: 2, intercept: 2, feedback: "This graph already has 2 pages at 0 minutes, so it is not proportional." },
        { slope: 4, intercept: 0, feedback: "Four is the page count after 2 minutes, not the number of pages produced in 1 minute." }
      ], correct: 0,
      explanation: "4 ÷ 2 = 2 pages per minute, so y = 2x and the line passes through the origin."
    },
    {
      phase: "match", title: "Cycling at a steady pace",
      situation: "A cyclist travels 15 miles each hour. Distance y is proportional to riding time x.",
      xLabel: "time (hours)", yLabel: "distance (miles)", xStep: 1, yStep: 10, rate: 15,
      options: [
        { slope: 30, intercept: 0, feedback: "This graph shows 30 miles each hour. Use the distance traveled in exactly 1 hour." },
        { slope: 7.5, intercept: 0, feedback: "This rate is half of the stated rate. One hour corresponds to 15 miles." },
        { slope: 15, intercept: 15, feedback: "The slope matches, but a proportional trip begins at 0 miles when time is 0." },
        { slope: 15, intercept: 0 }
      ], correct: 3,
      explanation: "The unit rate is 15 miles per hour, so the graph contains (1, 15), (2, 30), and the origin."
    },
    {
      phase: "match", title: "Flour for several batches",
      situation: "A baker uses 3 cups of flour for 2 batches of muffins. Flour y is proportional to batches x.",
      xLabel: "number of batches", yLabel: "flour (cups)", xStep: 1, yStep: 1, rate: 1.5,
      options: [
        { slope: 3, intercept: 0, feedback: "Three cups are used for 2 batches, not for 1 batch. Find 3 ÷ 2." },
        { slope: 1.5, intercept: 0 },
        { slope: 1.5, intercept: 1.5, feedback: "This line begins with 1.5 cups before any batches are made. A proportional graph begins at the origin." },
        { slope: .75, intercept: 0, feedback: "This reverses part of the comparison. The graph needs cups per batch: 3 ÷ 2." }
      ], correct: 1,
      explanation: "3 ÷ 2 = 1.5 cups per batch, so y = 1.5x and the line passes through (0, 0)."
    },
    {
      phase: "match", title: "Filling a portable water tank",
      situation: "A hose adds 12 gallons to a tank in 3 minutes. Gallons y is proportional to time x.",
      xLabel: "time (minutes)", yLabel: "water (gallons)", xStep: 1, yStep: 5, rate: 4,
      options: [
        { slope: 3, intercept: 0, feedback: "Three is the number of minutes, not the gallons added each minute. Divide 12 by 3." },
        { slope: 12, intercept: 0, feedback: "Twelve gallons are added over 3 minutes, not every minute." },
        { slope: 4, intercept: 0 },
        { slope: 4, intercept: 4, feedback: "The rate is right, but this line starts with 4 gallons at time 0 and is not proportional." }
      ], correct: 2,
      explanation: "12 ÷ 3 = 4 gallons per minute, giving y = 4x through the origin."
    },
    {
      phase: "build", title: "Beads for friendship bracelets",
      situation: "Each friendship bracelet uses 8 beads. The total number of beads y is proportional to the number of bracelets x.",
      xLabel: "bracelets", yLabel: "beads", xStep: 2, yStep: 8, rate: 8,
      rateText: "8 beads per 1 bracelet", gridHint: "One bracelet is not a labeled x-value. Multiply both parts of the rate by the same number until x and y land on labeled ticks."
    },
    {
      phase: "build", title: "Walking a nature trail",
      situation: "A hiker walks ¾ mile every 10 minutes. Distance y is proportional to time x.",
      xLabel: "time (minutes)", yLabel: "distance (miles)", xStep: 4, yStep: .3, rate: .075,
      rateText: "0.075 mile per 1 minute", gridHint: "Neither 10 minutes nor ¾ mile is labeled on this graph. Use the unit rate to build an equivalent pair that lands on both sets of ticks."
    },
    {
      phase: "build", title: "Buying fruit by the pound",
      situation: "Two pounds of fruit cost $5. Total cost y is proportional to the number of pounds x.",
      xLabel: "fruit (pounds)", yLabel: "total cost ($)", xStep: 4, yStep: 5, rate: 2.5,
      rateText: "$2.50 per 1 pound", gridHint: "The given pair, 2 pounds and $5, is not a selectable grid intersection. Scale the unit rate to a different equivalent pair shown by the axes."
    },
    {
      phase: "build", title: "Filling reusable bottles",
      situation: "A dispenser fills 1.5 liters every 3 minutes. Liters y is proportional to time x.",
      xLabel: "time (minutes)", yLabel: "water (liters)", xStep: 2, yStep: 1, rate: .5,
      rateText: "0.5 liter per 1 minute", gridHint: "The stated pair, 3 minutes and 1.5 liters, falls between the labeled ticks. Build a new equivalent pair from the unit rate."
    },
    {
      phase: "build", title: "Reading distance on a map",
      situation: "Four centimeters on a map represent 10 kilometers. Actual distance y is proportional to map distance x.",
      xLabel: "map distance (cm)", yLabel: "actual distance (km)", xStep: 3, yStep: 7.5, rate: 2.5,
      rateText: "2.5 kilometers per 1 centimeter", gridHint: "The given pair, 4 centimeters and 10 kilometers, does not appear on these ticks. Multiply the unit rate to create a different equivalent pair."
    }
  ];

  const PROPORTION_VIEW = { width: 580, height: 500, left: 78, top: 34, plotWidth: 450, plotHeight: 390, cols: 5, rows: 5 };

  function proportionNumber(value) {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
    if (Math.abs(rounded) < .0001) return "0";
    return String(rounded);
  }

  function resetProportionTask(data) {
    data.selected = null;
    data.answered = false;
    data.points = [];
    data.graphed = false;
    data.solved = false;
  }

  function proportionScreenPoint(gx, gy, view = PROPORTION_VIEW) {
    return {
      x: view.left + gx * (view.plotWidth / view.cols),
      y: view.top + view.plotHeight - gy * (view.plotHeight / view.rows)
    };
  }

  function proportionLineEnds(slope, intercept, task) {
    const xMax = PROPORTION_VIEW.cols * task.xStep;
    const yMax = PROPORTION_VIEW.rows * task.yStep;
    const candidates = [];
    const add = (x, y) => {
      if (x < -1e-6 || x > xMax + 1e-6 || y < -1e-6 || y > yMax + 1e-6) return;
      if (!candidates.some(point => Math.abs(point.x - x) < .001 && Math.abs(point.y - y) < .001)) candidates.push({ x, y });
    };
    add(0, intercept);
    add(xMax, slope * xMax + intercept);
    if (Math.abs(slope) > 1e-8) {
      add(-intercept / slope, 0);
      add((yMax - intercept) / slope, yMax);
    }
    if (candidates.length < 2) return null;
    let best = [candidates[0], candidates[1]];
    let distance = -1;
    candidates.forEach((first, i) => candidates.slice(i + 1).forEach(second => {
      const next = Math.hypot(second.x - first.x, second.y - first.y);
      if (next > distance) { distance = next; best = [first, second]; }
    }));
    return best.map(point => proportionScreenPoint(point.x / task.xStep, point.y / task.yStep));
  }

  function proportionGridMarkup(task, interactive = false, compact = false) {
    const view = compact ? { width: 300, height: 238, left: 62, top: 20, plotWidth: 210, plotHeight: 160, cols: 5, rows: 5 } : PROPORTION_VIEW;
    let markup = `<rect class="proportion-plot-bg" x="${view.left}" y="${view.top}" width="${view.plotWidth}" height="${view.plotHeight}" rx="12"></rect>`;
    for (let gx = 0; gx <= view.cols; gx += 1) {
      const point = proportionScreenPoint(gx, 0, view);
      markup += `<line class="proportion-grid-line${gx === 0 ? " is-axis" : ""}" x1="${point.x}" y1="${view.top}" x2="${point.x}" y2="${view.top + view.plotHeight}"></line>`;
      markup += `<text class="proportion-tick" x="${point.x}" y="${view.top + view.plotHeight + (compact ? 16 : 22)}" text-anchor="middle">${proportionNumber(gx * task.xStep)}</text>`;
    }
    for (let gy = 0; gy <= view.rows; gy += 1) {
      const point = proportionScreenPoint(0, gy, view);
      markup += `<line class="proportion-grid-line${gy === 0 ? " is-axis" : ""}" x1="${view.left}" y1="${point.y}" x2="${view.left + view.plotWidth}" y2="${point.y}"></line>`;
      if (gy !== 0) markup += `<text class="proportion-tick" x="${view.left - 10}" y="${point.y + 4}" text-anchor="end">${proportionNumber(gy * task.yStep)}</text>`;
    }
    if (compact) {
      markup += `<text class="proportion-mini-axis-letter" x="${view.left + view.plotWidth + 10}" y="${view.top + view.plotHeight + 4}">x</text>`;
      markup += `<text class="proportion-mini-axis-letter" x="${view.left - 2}" y="${view.top - 7}">y</text>`;
      markup += `<text class="proportion-mini-axis-label" x="${view.left + view.plotWidth / 2}" y="225" text-anchor="middle">${task.xLabel}</text>`;
      markup += `<text class="proportion-mini-axis-label" transform="translate(15 ${view.top + view.plotHeight / 2}) rotate(-90)" text-anchor="middle">${task.yLabel}</text>`;
    } else {
      markup += `<text class="proportion-axis-label" x="${view.left + view.plotWidth / 2}" y="492" text-anchor="middle">${task.xLabel}</text>`;
      markup += `<text class="proportion-axis-label" transform="translate(20 ${view.top + view.plotHeight / 2}) rotate(-90)" text-anchor="middle">${task.yLabel}</text>`;
      markup += `<circle class="proportion-origin" cx="${view.left}" cy="${view.top + view.plotHeight}" r="5"></circle>`;
    }
    if (interactive) {
      for (let gx = 0; gx <= view.cols; gx += 1) for (let gy = 0; gy <= view.rows; gy += 1) {
        const point = proportionScreenPoint(gx, gy, view);
        markup += `<circle class="proportion-point-hit" tabindex="0" role="button" aria-label="Select (${proportionNumber(gx * task.xStep)}, ${proportionNumber(gy * task.yStep)})" data-proportion-gx="${gx}" data-proportion-gy="${gy}" cx="${point.x}" cy="${point.y}" r="16"></circle>`;
      }
    }
    return { markup, view };
  }

  function proportionLineMarkup(task, slope, intercept, className = "proportion-choice-line") {
    const ends = proportionLineEnds(slope, intercept, task);
    if (!ends) return "";
    return `<line class="${className}" x1="${ends[0].x}" y1="${ends[0].y}" x2="${ends[1].x}" y2="${ends[1].y}"></line>`;
  }

  function compactProportionGraph(task, option, index) {
    const view = { width: 300, height: 238, left: 62, top: 20, plotWidth: 210, plotHeight: 160, cols: 5, rows: 5 };
    const grid = proportionGridMarkup(task, false, true).markup;
    const xMax = view.cols * task.xStep;
    const yMax = view.rows * task.yStep;
    const candidates = [];
    const add = (x, y) => {
      if (x >= 0 && x <= xMax && y >= 0 && y <= yMax && !candidates.some(p => Math.abs(p.x-x)<.001 && Math.abs(p.y-y)<.001)) candidates.push({x,y});
    };
    add(0, option.intercept); add(xMax, option.slope*xMax+option.intercept);
    if (option.slope) { add(-option.intercept/option.slope,0); add((yMax-option.intercept)/option.slope,yMax); }
    let line = "";
    if (candidates.length >= 2) {
      const points = candidates.map(p => proportionScreenPoint(p.x/task.xStep,p.y/task.yStep,view));
      line = `<line class="proportion-choice-line" x1="${points[0].x}" y1="${points[0].y}" x2="${points[1].x}" y2="${points[1].y}"></line>`;
    }
    return `<svg class="proportion-mini-graph" viewBox="0 0 ${view.width} ${view.height}" aria-label="Graph ${String.fromCharCode(65 + index)}">${grid}${line}</svg>`;
  }

  function renderProportionMatch(data, task) {
    const axisMessage = `x-axis: 1 interval = ${proportionNumber(task.xStep)} ${task.xLabel} • y-axis: 1 interval = ${proportionNumber(task.yStep)} ${task.yLabel}`;
    return `
      <div class="proportion-task-shell">
        <header class="proportion-task-header"><div><p class="lab-mini-title">Match the situation • ${data.index + 1} of 5</p><h4>${task.title}</h4></div><span class="proportion-phase-chip">Read → Match</span></header>
        <section class="proportion-situation-card"><strong>Situation</strong><p>${task.situation}</p><div class="proportion-axis-brief"><span><b>x</b> = ${task.xLabel}</span><span><b>y</b> = ${task.yLabel}</span></div></section>
        <div class="proportion-interval-banner">Before choosing, read the scales: ${axisMessage}.</div>
        <div class="proportion-match-grid">
          ${task.options.map((option, index) => `<button type="button" class="proportion-graph-choice ${data.selected === index ? "is-selected" : ""} ${data.answered && index === task.correct ? "is-correct" : ""}" data-proportion-choice="${index}" ${data.answered ? "disabled" : ""}><span>Graph ${String.fromCharCode(65 + index)}</span>${compactProportionGraph(task, option, index)}</button>`).join("")}
        </div>
        <div class="proportion-actions"><button type="button" class="lab-action" id="checkProportionMatch" ${data.selected === null || data.answered ? "disabled" : ""}>Check match</button><button type="button" class="lab-next" id="nextProportionTask" ${data.answered ? "" : "hidden"}>Next situation →</button></div>
      </div>`;
  }

  function proportionSelectedMarkup(data, task) {
    let markup = "";
    (data.points || []).forEach((point, index) => {
      const screen = proportionScreenPoint(point.gx, point.gy);
      markup += `<g class="proportion-selected-point"><circle cx="${screen.x}" cy="${screen.y}" r="11"></circle><text x="${screen.x + 14}" y="${screen.y - 12}">P${index + 1} (${proportionNumber(point.x)}, ${proportionNumber(point.y)})</text></g>`;
    });
    if (data.graphed && data.points.length === 2) {
      const [first, second] = data.points;
      const run = second.x - first.x;
      if (Math.abs(run) > .0001) {
        const slope = (second.y - first.y) / run;
        const intercept = first.y - slope * first.x;
        markup = proportionLineMarkup(task, slope, intercept, "proportion-student-line") + markup;
      }
    }
    return markup;
  }

  function renderProportionBuild(data, task) {
    const grid = proportionGridMarkup(task, true, false).markup;
    const pointReadout = data.points.length ? data.points.map((point, index) => `P${index + 1} = (${proportionNumber(point.x)}, ${proportionNumber(point.y)})`).join(" • ") : "No points selected yet";
    return `
      <div class="proportion-task-shell">
        <header class="proportion-task-header"><div><p class="lab-mini-title">Build the graph • ${data.index - 4} of 5</p><h4>${task.title}</h4></div><span class="proportion-phase-chip build">Choose → Graph → Submit</span></header>
        <section class="proportion-situation-card"><strong>Situation</strong><p>${task.situation}</p><div class="proportion-axis-brief"><span><b>x</b> = ${task.xLabel}</span><span><b>y</b> = ${task.yLabel}</span></div></section>
        <div class="proportion-build-layout">
          <div class="proportion-graph-card">
            <div class="proportion-axis-scale"><span><b>x-axis:</b> 1 interval = ${proportionNumber(task.xStep)} ${task.xLabel}</span><span><b>y-axis:</b> 1 interval = ${proportionNumber(task.yStep)} ${task.yLabel}</span></div>
            <svg class="proportion-build-graph" viewBox="0 0 ${PROPORTION_VIEW.width} ${PROPORTION_VIEW.height}" aria-label="Interactive graph for ${task.title}">${grid}${proportionSelectedMarkup(data, task)}</svg>
            <div class="proportion-point-readout">${pointReadout}</div>
          </div>
          <aside class="proportion-coach-card">
            <div class="proportion-rate-card"><span>Unit rate / slope</span><strong>${task.rateText}</strong><p>${task.gridHint}</p></div>
            <ol class="proportion-coach-steps">
              <li><b>Start at (0, 0).</b> No input means no output in a proportional relationship.</li>
              <li><b>Turn the rate into a grid move.</b> Read what one interval means on each axis.</li>
              <li><b>Scale both parts together.</b> Repeat the same move to choose a second exact point farther away.</li>
            </ol>
            <p class="proportion-quality-note"><b>Quality points:</b> exact grid intersections on the relationship, separated by at least two grid intervals.</p>
            <div class="proportion-build-actions"><button type="button" class="lab-action" id="graphProportionLine" ${data.points.length === 2 ? "" : "disabled"}>Graph my line</button><button type="button" class="lab-action secondary" id="submitProportionGraph" ${data.graphed ? "" : "disabled"}>Submit graph</button><button type="button" class="lab-choice" id="clearProportionPoints">Clear points</button></div>
            <button type="button" class="lab-next" id="nextProportionTask" ${data.solved ? "" : "hidden"}>Next situation →</button>
          </aside>
        </div>
      </div>`;
  }

  function checkProportionGraph(data, task) {
    if (data.points.length !== 2) return setLabFeedback("Choose two exact grid points before submitting.", "incorrect");
    const [first, second] = data.points;
    const run = second.x - first.x;
    const rise = second.y - first.y;
    const gridDistance = Math.hypot(second.gx - first.gx, second.gy - first.gy);
    if (Math.abs(run) < .0001) return setLabFeedback(`Your two points have the same x-value, so the run is 0. Choose a second point to the right. Remember: 1 x-interval represents ${proportionNumber(task.xStep)} ${task.xLabel}.`, "incorrect");
    const slope = rise / run;
    const intercept = first.y - slope * first.x;
    const bothOnTarget = data.points.every(point => Math.abs(point.y - task.rate * point.x) < .001);
    if (Math.abs(intercept) > .001) return setLabFeedback(`Your line does not pass through (0, 0). A proportional relationship must include the origin because 0 ${task.xLabel} corresponds to 0 ${task.yLabel}.`, "incorrect");
    if (!bothOnTarget || Math.abs(slope - task.rate) > .001) return setLabFeedback(`Recheck the grid move. The x-axis changes by ${proportionNumber(task.xStep)} ${task.xLabel} per interval, while the y-axis changes by ${proportionNumber(task.yStep)} ${task.yLabel} per interval. ${task.gridHint}`, "incorrect");
    if (gridDistance < 2) return setLabFeedback("Both points are on the relationship, but they are too close together to be strong graphing points. Keep one point and choose another at least two grid intervals away.", "incorrect");
    data.solved = true;
    const next = $("#nextProportionTask");
    if (next) next.hidden = false;
    setLabFeedback(`Correct. Your points give rise ${proportionNumber(rise)} and run ${proportionNumber(run)}, so slope = ${proportionNumber(rise)} ÷ ${proportionNumber(run)} = ${proportionNumber(task.rate)}. The line passes through (0, 0) and models the situation.`, "correct");
  }

  function renderLab84B() {
    if (!labRuntime.data) labRuntime.data = { index: 0, selected: null, answered: false, points: [], graphed: false, solved: false };
    const data = labRuntime.data;
    if (data.index >= PROPORTION_LAB_TASKS.length) {
      setLabProgress(PROPORTION_LAB_TASKS.length, PROPORTION_LAB_TASKS.length, "All ten proportional situations completed.");
      return showLabCompletion("8.4B");
    }
    const task = PROPORTION_LAB_TASKS[data.index];
    const completed = data.index + (data.answered || data.solved ? 1 : 0);
    const phaseText = task.phase === "match" ? "Match a real-world situation to its proportional graph." : "Use the unit rate and axis intervals to construct the graph from two points.";
    setLabProgress(completed, PROPORTION_LAB_TASKS.length, phaseText);
    $("#standardsLabBody").innerHTML = task.phase === "match" ? renderProportionMatch(data, task) : renderProportionBuild(data, task);

    const nextTask = () => {
      if (data.index >= PROPORTION_LAB_TASKS.length - 1) return showLabCompletion("8.4B");
      data.index += 1;
      resetProportionTask(data);
      renderLab84B();
      setLabFeedback(data.index < 5 ? "Read the new situation, calculate its unit rate, and compare the four graphs." : "Choose two quality points. Read both axis intervals before turning the rate into a grid move.");
    };

    if (task.phase === "match") {
      document.querySelectorAll("[data-proportion-choice]").forEach(button => button.addEventListener("click", () => {
        data.selected = Number(button.dataset.proportionChoice);
        renderLab84B();
        setLabFeedback(`Graph ${String.fromCharCode(65 + data.selected)} selected. Check the origin, the axis scales, and the unit rate.`);
      }));
      $("#checkProportionMatch").addEventListener("click", () => {
        if (data.selected === task.correct) {
          data.answered = true;
          renderLab84B();
          setLabFeedback(`Correct. ${task.explanation}`, "correct");
        } else {
          setLabFeedback(task.options[data.selected].feedback, "incorrect");
        }
      });
      const next = $("#nextProportionTask");
      if (next) next.addEventListener("click", nextTask);
      return;
    }

    document.querySelectorAll("[data-proportion-gx]").forEach(hit => {
      const choose = () => {
        if (data.solved) return;
        const gx = Number(hit.dataset.proportionGx);
        const gy = Number(hit.dataset.proportionGy);
        const existing = data.points.findIndex(point => point.gx === gx && point.gy === gy);
        if (existing >= 0) data.points.splice(existing, 1);
        else {
          const point = { gx, gy, x: cleanSlopeNumber(gx * task.xStep), y: cleanSlopeNumber(gy * task.yStep) };
          if (data.points.length >= 2) data.points.shift();
          data.points.push(point);
        }
        data.graphed = false;
        renderLab84B();
        setLabFeedback(data.points.length === 2 ? "Two points selected. Click Graph my line to extend the line through the entire coordinate plane." : "Choose one more exact grid intersection.");
      };
      hit.addEventListener("click", choose);
      hit.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); } });
    });
    $("#graphProportionLine").addEventListener("click", () => {
      if (data.points.length !== 2) return;
      data.graphed = true;
      renderLab84B();
      setLabFeedback("Your line now extends through both selected points. Check whether it passes through the origin and whether its rise/run matches the unit rate, then submit.");
    });
    $("#submitProportionGraph").addEventListener("click", () => checkProportionGraph(data, task));
    $("#clearProportionPoints").addEventListener("click", () => {
      data.points = [];
      data.graphed = false;
      data.solved = false;
      renderLab84B();
      setLabFeedback("Points cleared. Start with (0, 0), then use the coached grid move to locate another point.");
    });
    const next = $("#nextProportionTask");
    if (next) next.addEventListener("click", nextTask);
  }

  const RELATION_LAB_TASKS = [
    {
      kind: "graph", title: "Notebooks at the school store", rate: 2.5, xStep: 1, yStep: 5,
      xLabel: "notebooks", yLabel: "total cost ($)", equation: "y = 2.5x",
      stimulus: "The graph shows the total cost y for x notebooks.",
      storyParts: ["At the school store, the cost increases by", "for each notebook. The cost of 0 notebooks is", "."],
      rateChoices: [[5,"$5.00"],[1.5,"$1.50"],[2.5,"$2.50"],[0.4,"$0.40"]],
      startChoices: [[2.5,"$2.50"],[0,"$0"],[5,"$5"],[-2.5,"-$2.50"]],
      table: [{x:0,y:0},{x:2,y:null,yAnswer:5},{x:null,xAnswer:4,y:10},{x:6,y:15}]
    },
    {
      kind: "graph", title: "Water flowing into garden beds", rate: .75, xStep: 2, yStep: 1.5,
      xLabel: "time (minutes)", yLabel: "water (liters)", equation: "y = 0.75x",
      stimulus: "The graph shows the liters of water y delivered in x minutes.",
      storyParts: ["The hose delivers", "for each minute. At 0 minutes, it has delivered", "."],
      rateChoices: [[1.5,"1.5 liters"],[.5,"0.5 liter"],[.75,"0.75 liter"],[3,"3 liters"]],
      startChoices: [[.75,"0.75 liter"],[1.5,"1.5 liters"],[-.75,"-0.75 liter"],[0,"0 liters"]],
      table: [{x:0,y:0},{x:4,y:3},{x:8,y:null,yAnswer:6},{x:null,xAnswer:12,y:9}]
    },
    {
      kind: "graph", title: "Pages printed over time", rate: 6, xStep: 1, yStep: 3,
      xLabel: "time (minutes)", yLabel: "pages printed", equation: "y = 6x",
      stimulus: "The graph shows the number of pages y printed in x minutes.",
      storyParts: ["The printer produces", "for each minute. Before printing begins, the number of pages printed is", "."],
      rateChoices: [[3,"3 pages"],[12,"12 pages"],[1/6,"1/6 page"],[6,"6 pages"]],
      startChoices: [[6,"6 pages"],[0,"0 pages"],[-6,"-6 pages"],[3,"3 pages"]],
      table: [{x:0,y:0},{x:1,y:6},{x:null,xAnswer:2,y:12},{x:3,y:null,yAnswer:18}]
    },
    {
      kind: "equation", title: "Beads used for bracelets", rate: 4, xStep: 1, yStep: 4,
      xLabel: "bracelets", yLabel: "beads", equation: "y = 4x",
      stimulus: "In the equation, x is the number of bracelets and y is the number of beads.",
      storyParts: ["A crafter uses", "for each bracelet. Before making any bracelets, the number of beads used is", "."],
      rateChoices: [[8,"8 beads"],[.25,"1/4 bead"],[0,"0 beads"],[4,"4 beads"]],
      startChoices: [[4,"4 beads"],[-4,"-4 beads"],[0,"0 beads"],[1,"1 bead"]],
      table: [{x:0,y:0},{x:2,y:null,yAnswer:8},{x:null,xAnswer:3,y:12},{x:5,y:20}]
    },
    {
      kind: "equation", title: "Fruit sold by weight", rate: 1.2, xStep: 2, yStep: 1.2,
      xLabel: "fruit (pounds)", yLabel: "total cost ($)", equation: "y = 1.2x",
      stimulus: "In the equation, x is the number of pounds and y is the total cost.",
      storyParts: ["The fruit costs", "for each pound. The cost of 0 pounds is", "."],
      rateChoices: [[2.4,"$2.40"],[1.2,"$1.20"],[.12,"$0.12"],[12,"$12.00"]],
      startChoices: [[1.2,"$1.20"],[2.4,"$2.40"],[-1.2,"-$1.20"],[0,"$0"]],
      table: [{x:0,y:0},{x:2,y:2.4},{x:4,y:null,yAnswer:4.8},{x:null,xAnswer:6,y:7.2}]
    },
    {
      kind: "equation", title: "Tickets for a school performance", rate: 7.5, xStep: 1, yStep: 15,
      xLabel: "tickets", yLabel: "total cost ($)", equation: "y = 7.5x",
      stimulus: "In the equation, x is the number of tickets and y is the total cost.",
      storyParts: ["Each ticket costs", ". If no tickets are purchased, the total cost is", "."],
      rateChoices: [[15,"$15.00"],[.75,"$0.75"],[7.5,"$7.50"],[75,"$75.00"]],
      startChoices: [[7.5,"$7.50"],[15,"$15"],[0,"$0"],[-7.5,"-$7.50"]],
      table: [{x:0,y:0},{x:2,y:15},{x:null,xAnswer:4,y:30},{x:6,y:null,yAnswer:45}]
    },
    {
      kind: "table", title: "Bundles of flower stems", rate: 3, xStep: 2, yStep: 3,
      xLabel: "bundles", yLabel: "flower stems", equation: "y = 3x",
      stimulus: "The table shows the number of stems y in x equal bundles.",
      storyParts: ["Each bundle contains", ". With 0 bundles, there are", "."],
      rateChoices: [[6,"6 stems"],[1/3,"1/3 stem"],[3,"3 stems"],[9,"9 stems"]],
      startChoices: [[3,"3 stems"],[-3,"-3 stems"],[6,"6 stems"],[0,"0 stems"]],
      table: [{x:0,y:0},{x:2,y:6},{x:4,y:12},{x:6,y:18}]
    },
    {
      kind: "table", title: "Trail distance on a map", rate: 2.5, xStep: 2, yStep: 5,
      xLabel: "map distance (cm)", yLabel: "actual distance (km)", equation: "y = 2.5x",
      stimulus: "The table compares map distance x to actual trail distance y.",
      storyParts: ["Each centimeter on the map represents", ". A map distance of 0 centimeters represents", "."],
      rateChoices: [[5,"5 kilometers"],[2.5,"2.5 kilometers"],[.4,"0.4 kilometer"],[10,"10 kilometers"]],
      startChoices: [[2.5,"2.5 kilometers"],[5,"5 kilometers"],[0,"0 kilometers"],[-2.5,"-2.5 kilometers"]],
      table: [{x:0,y:0},{x:2,y:5},{x:4,y:10},{x:6,y:15}]
    },
    {
      kind: "table", title: "Distance during walking intervals", rate: .75, xStep: 2, yStep: 3,
      xLabel: "10-minute intervals", yLabel: "distance (miles)", equation: "y = 0.75x",
      stimulus: "The table shows distance y after x ten-minute intervals.",
      storyParts: ["The walker travels", "during each 10-minute interval. Before the first interval, the distance traveled is", "."],
      rateChoices: [[1.5,"1.5 miles"],[.75,"0.75 mile"],[7.5,"7.5 miles"],[.075,"0.075 mile"]],
      startChoices: [[.75,"0.75 mile"],[1.5,"1.5 miles"],[-.75,"-0.75 mile"],[0,"0 miles"]],
      table: [{x:0,y:0},{x:2,y:1.5},{x:4,y:3},{x:6,y:4.5}]
    },
    {
      kind: "situation", title: "Buying oranges by the pound", rate: 2.5, xStep: 2, yStep: 5,
      xLabel: "oranges (pounds)", yLabel: "total cost ($)", equation: "y = 2.5x",
      stimulus: "Five pounds of oranges cost $12.50. The total cost y is proportional to the number of pounds x.",
      table: [{x:0,y:0},{x:2,y:null,yAnswer:5},{x:null,xAnswer:4,y:10},{x:8,y:20}]
    },
    {
      kind: "situation", title: "Filling a rain barrel", rate: 6, xStep: 2, yStep: 6,
      xLabel: "time (minutes)", yLabel: "water (gallons)", equation: "y = 6x",
      stimulus: "A hose adds 18 gallons to an empty rain barrel in 3 minutes at a constant rate. The amount of water y is proportional to time x.",
      table: [{x:0,y:0},{x:2,y:12},{x:4,y:null,yAnswer:24},{x:null,xAnswer:6,y:36}]
    },
    {
      kind: "situation", title: "Admission to a community event", rate: 7.5, xStep: 3, yStep: 22.5,
      xLabel: "tickets", yLabel: "total cost ($)", equation: "y = 7.5x",
      stimulus: "Four admission tickets cost $30. The total cost y is proportional to the number of tickets x.",
      table: [{x:0,y:0},{x:3,y:22.5},{x:null,xAnswer:6,y:45},{x:9,y:null,yAnswer:67.5}]
    }
  ];

  const NONPROPORTIONAL_RELATION_LAB_TASKS = [
    {
      kind: "graph", title: "Taxi ride with a starting fee", rate: 2, intercept: 4, xStep: 2, yStep: 4,
      xLabel: "distance (miles)", yLabel: "total fare ($)", equation: "y = 2x + 4",
      stimulus: "The graph shows the total taxi fare y after traveling x miles.",
      storyParts: ["The taxi fare increases by", "for each mile. Before any miles are traveled, the fare is", "."],
      rateChoices: [[4,"$4 per mile"],[1,"$1 per mile"],[2,"$2 per mile"],[.5,"$0.50 per mile"]],
      startChoices: [[2,"$2"],[8,"$8"],[0,"$0"],[4,"$4"]],
      table: [{x:2,y:8},{x:4,y:null,yAnswer:12},{x:null,xAnswer:6,y:16},{x:8,y:20}]
    },
    {
      kind: "graph", title: "Skate rental with an equipment fee", rate: 3, intercept: 6, xStep: 2, yStep: 6,
      xLabel: "time (hours)", yLabel: "total cost ($)", equation: "y = 3x + 6",
      stimulus: "The graph shows the total cost y to rent skates for x hours.",
      storyParts: ["The rental cost increases by", "for each hour. The equipment fee at 0 hours is", "."],
      rateChoices: [[6,"$6 per hour"],[3,"$3 per hour"],[2,"$2 per hour"],[9,"$9 per hour"]],
      startChoices: [[0,"$0"],[3,"$3"],[6,"$6"],[12,"$12"]],
      table: [{x:2,y:12},{x:null,xAnswer:4,y:18},{x:6,y:null,yAnswer:24},{x:8,y:30}]
    },
    {
      kind: "graph", title: "Ice pops remaining in a cooler", rate: -1, intercept: 10, xStep: 2, yStep: 2,
      xLabel: "time (hours)", yLabel: "ice pops remaining", equation: "y = -x + 10",
      stimulus: "The graph shows the number of ice pops y remaining after x hours.",
      storyParts: ["The number of ice pops changes by", "each hour. At 0 hours, the cooler contains", "."],
      rateChoices: [[1,"1 more ice pop"],[-2,"2 fewer ice pops"],[-1,"1 fewer ice pop"],[10,"10 fewer ice pops"]],
      startChoices: [[8,"8 ice pops"],[0,"0 ice pops"],[10,"10 ice pops"],[1,"1 ice pop"]],
      table: [{x:2,y:null,yAnswer:8},{x:4,y:6},{x:null,xAnswer:6,y:4},{x:8,y:2}]
    },
    {
      kind: "equation", title: "Community garden membership", rate: .5, intercept: 2, xStep: 2, yStep: 1,
      xLabel: "seed packets", yLabel: "total cost ($)", equation: "y = 0.5x + 2",
      stimulus: "In the equation, x is the number of seed packets and y is the total cost, including a membership fee.",
      storyParts: ["Each seed packet adds", "to the cost. The membership fee when 0 packets are purchased is", "."],
      rateChoices: [[2,"$2.00"],[.5,"$0.50"],[1,"$1.00"],[.25,"$0.25"]],
      startChoices: [[.5,"$0.50"],[0,"$0"],[4,"$4"],[2,"$2"]],
      table: [{x:2,y:3},{x:4,y:null,yAnswer:4},{x:null,xAnswer:6,y:5},{x:8,y:6}]
    },
    {
      kind: "equation", title: "Museum audio guide rental", rate: 4, intercept: 8, xStep: 1, yStep: 4,
      xLabel: "time (hours)", yLabel: "total charge ($)", equation: "y = 4x + 8",
      stimulus: "In the equation, x is the number of rental hours and y is the total audio-guide charge.",
      storyParts: ["The charge increases by", "for each hour. The checkout fee before any rental time is", "."],
      rateChoices: [[8,"$8 per hour"],[2,"$2 per hour"],[4,"$4 per hour"],[12,"$12 per hour"]],
      startChoices: [[4,"$4"],[8,"$8"],[0,"$0"],[16,"$16"]],
      table: [{x:2,y:16},{x:null,xAnswer:4,y:24},{x:6,y:null,yAnswer:32},{x:8,y:40}]
    },
    {
      kind: "equation", title: "Water draining from a display tank", rate: -.5, intercept: 5, xStep: 2, yStep: 1,
      xLabel: "time (minutes)", yLabel: "water remaining (liters)", equation: "y = -0.5x + 5",
      stimulus: "In the equation, x is elapsed time and y is the water remaining in a small display tank.",
      storyParts: ["The amount of water changes by", "each minute. At 0 minutes, the tank contains", "."],
      rateChoices: [[.5,"0.5 liter more"],[-1,"1 liter less"],[5,"5 liters less"],[-.5,"0.5 liter less"]],
      startChoices: [[.5,"0.5 liter"],[5,"5 liters"],[0,"0 liters"],[10,"10 liters"]],
      table: [{x:2,y:4},{x:4,y:null,yAnswer:3},{x:null,xAnswer:6,y:2},{x:8,y:1}]
    },
    {
      kind: "table", title: "Art studio reservation", rate: 1.5, intercept: 3, xStep: 2, yStep: 3,
      xLabel: "paint colors", yLabel: "total cost ($)", equation: "y = 1.5x + 3",
      stimulus: "The table shows the total studio cost y for x paint colors. Notice that x = 0 is not shown.",
      storyParts: ["Each paint color adds", "to the cost. Working backward to x = 0 shows a reservation fee of", "."],
      rateChoices: [[3,"$3.00"],[.5,"$0.50"],[1.5,"$1.50"],[6,"$6.00"]],
      startChoices: [[6,"$6"],[3,"$3"],[0,"$0"],[1.5,"$1.50"]],
      table: [{x:2,y:6},{x:4,y:9},{x:6,y:12},{x:8,y:15}]
    },
    {
      kind: "table", title: "Delivery order with a service charge", rate: 2.5, intercept: 5, xStep: 2, yStep: 5,
      xLabel: "items ordered", yLabel: "total charge ($)", equation: "y = 2.5x + 5",
      stimulus: "The table shows the total delivery charge y for x items. The row containing the y-intercept is not displayed.",
      storyParts: ["Each item adds", "to the charge. Extending the pattern back to x = 0 gives a service charge of", "."],
      rateChoices: [[5,"$5.00"],[2.5,"$2.50"],[1.25,"$1.25"],[10,"$10.00"]],
      startChoices: [[2.5,"$2.50"],[10,"$10"],[5,"$5"],[0,"$0"]],
      table: [{x:2,y:10},{x:4,y:15},{x:6,y:20},{x:8,y:25}]
    },
    {
      kind: "table", title: "Plant growth after transplanting", rate: .75, intercept: 1.5, xStep: 2, yStep: 1.5,
      xLabel: "time (weeks)", yLabel: "plant height (cm)", equation: "y = 0.75x + 1.5",
      stimulus: "The table shows the plant height y after x weeks. The plant already had height when the observations began.",
      storyParts: ["The plant grows", "each week. Extending the pattern to week 0 gives a starting height of", "."],
      rateChoices: [[1.5,"1.5 centimeters"],[.75,"0.75 centimeter"],[3,"3 centimeters"],[.375,"0.375 centimeter"]],
      startChoices: [[.75,"0.75 centimeter"],[0,"0 centimeters"],[3,"3 centimeters"],[1.5,"1.5 centimeters"]],
      table: [{x:2,y:3},{x:4,y:4.5},{x:6,y:6},{x:8,y:7.5}]
    },
    {
      kind: "situation", title: "Dog-walking appointment", rate: 6, intercept: 12, xStep: 1, yStep: 6,
      xLabel: "dogs", yLabel: "total charge ($)", equation: "y = 6x + 12",
      stimulus: "A dog walker charges a $12 appointment fee plus $6 for each dog. The total charge is y dollars for x dogs.",
      table: [{x:2,y:null,yAnswer:24},{x:null,xAnswer:4,y:36},{x:6,y:48},{x:8,y:null,yAnswer:60}]
    },
    {
      kind: "situation", title: "Bike rental with an unlock fee", rate: 1, intercept: 4, xStep: 2, yStep: 2,
      xLabel: "time (hours)", yLabel: "total cost ($)", equation: "y = x + 4",
      stimulus: "A bike-share company charges a $4 unlock fee and $1 for each hour. The total rental cost is y dollars after x hours.",
      table: [{x:2,y:6},{x:4,y:null,yAnswer:8},{x:null,xAnswer:6,y:10},{x:8,y:12}]
    },
    {
      kind: "situation", title: "Poster order with a setup charge", rate: 1.25, intercept: 2.5, xStep: 2, yStep: 2.5,
      xLabel: "posters", yLabel: "total cost ($)", equation: "y = 1.25x + 2.5",
      stimulus: "A print shop charges a $2.50 setup fee plus $1.25 for each poster. The total cost is y dollars for x posters.",
      table: [{x:2,y:null,yAnswer:5},{x:null,xAnswer:4,y:7.5},{x:6,y:10},{x:8,y:null,yAnswer:12.5}]
    }
  ];

  function resetRelationTask(data) {
    data.responses = {};
    data.points = [];
    data.graphed = false;
    data.graphCorrect = false;
    data.solved = false;
  }

  function relationInputValue(data, key) {
    return escapeHTML(data.responses?.[key] ?? "");
  }

  function parseRelationNumber(value) {
    const text = String(value ?? "").trim().replace(/\$/g, "");
    if (!text) return NaN;
    if (/^-?\d+(?:\.\d+)?\s*\/\s*-?\d+(?:\.\d+)?$/.test(text)) {
      const [numerator, denominator] = text.split("/").map(Number);
      return denominator ? numerator / denominator : NaN;
    }
    return Number(text);
  }

  function relationNearlyEqual(first, second) {
    return Number.isFinite(first) && Math.abs(first - second) < .001;
  }

  function relationSelectMarkup(data, key, choices, label) {
    const current = String(data.responses?.[key] ?? "");
    return `<label class="relation-inline-select"><span class="sr-only">${label}</span><select data-relation-field="${key}"><option value="">Choose...</option>${choices.map(([value,text]) => `<option value="${value}" ${current === String(value) ? "selected" : ""}>${text}</option>`).join("")}</select></label>`;
  }

  function relationTableMarkup(data, task, editable) {
    return `<div class="relation-table-wrap"><table class="relation-table"><thead><tr><th scope="col">x<br><small>${task.xLabel}</small></th><th scope="col">y<br><small>${task.yLabel}</small></th></tr></thead><tbody>${task.table.map((row,index) => `<tr><td>${editable && row.x === null ? `<input data-relation-field="table-${index}-x" value="${relationInputValue(data,`table-${index}-x`)}" inputmode="decimal" aria-label="Missing x-value in row ${index + 1}">` : proportionNumber(row.x)}</td><td>${editable && row.y === null ? `<input data-relation-field="table-${index}-y" value="${relationInputValue(data,`table-${index}-y`)}" inputmode="decimal" aria-label="Missing y-value in row ${index + 1}">` : proportionNumber(row.y)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function relationEquationMarkup(data, task, editable) {
    if (!editable) return `<div class="relation-equation-display" aria-label="${task.equation}">${task.equation}</div>`;
    const coefficient = Object.hasOwn(task,"intercept") ? "m" : "k";
    return `<div class="relation-equation-builder"><span>y =</span><input data-relation-field="equation-k" value="${relationInputValue(data,"equation-k")}" inputmode="decimal" aria-label="Slope or coefficient ${coefficient}" placeholder="${coefficient}"><span>x +</span><input data-relation-field="equation-b" value="${relationInputValue(data,"equation-b")}" inputmode="decimal" aria-label="y-intercept b" placeholder="b"></div>`;
  }

  function relationStoryMarkup(data, task) {
    return `<p class="relation-story-fill">${task.storyParts[0]} ${relationSelectMarkup(data,"story-rate",task.rateChoices,"Choose the unit rate")} ${task.storyParts[1]} ${relationSelectMarkup(data,"story-start",task.startChoices,"Choose the starting value")} ${task.storyParts[2]}</p>`;
  }

  function relationSelectedGraphMarkup(data, task) {
    let markup = "";
    if (data.graphed && data.points.length === 2) {
      const [first,second] = data.points;
      const run = second.x - first.x;
      if (Math.abs(run) > .0001) {
        const slope = (second.y - first.y) / run;
        const intercept = first.y - slope * first.x;
        markup += proportionLineMarkup(task,slope,intercept,`relation-student-line ${data.graphCorrect ? "is-correct" : "is-checking"}`);
      }
    }
    data.points.forEach((point,index) => {
      const screen = proportionScreenPoint(point.gx,point.gy);
      markup += `<g class="relation-selected-point"><circle cx="${screen.x}" cy="${screen.y}" r="10"></circle><text x="${screen.x + 13}" y="${screen.y - 12}">P${index + 1} (${proportionNumber(point.x)}, ${proportionNumber(point.y)})</text></g>`;
    });
    return markup;
  }

  function relationGraphMarkup(data, task, interactive) {
    const grid = proportionGridMarkup(task,interactive,false).markup;
    const target = interactive ? "" : proportionLineMarkup(task,task.rate,task.intercept ?? 0,"relation-target-line");
    return `<div class="relation-graph-wrap"><div class="proportion-axis-scale"><span><b>x-axis:</b> 1 interval = ${proportionNumber(task.xStep)}</span><span><b>y-axis:</b> 1 interval = ${proportionNumber(task.yStep)}</span></div><svg class="relation-graph" viewBox="0 0 ${PROPORTION_VIEW.width} ${PROPORTION_VIEW.height}" aria-label="${interactive ? "Interactive" : "Given"} graph for ${task.title}">${grid}${target}${interactive ? relationSelectedGraphMarkup(data,task) : ""}</svg>${interactive ? `<p class="relation-point-readout">${data.points.length ? data.points.map((point,index) => `P${index + 1} = (${proportionNumber(point.x)}, ${proportionNumber(point.y)})`).join(" • ") : "Choose two points on the relationship."}</p><div class="relation-graph-actions"><button type="button" class="lab-action" id="checkRelationGraph" ${data.points.length === 2 ? "" : "disabled"}>Draw and check my line</button><button type="button" class="lab-choice" id="clearRelationGraph">Clear points</button></div>` : ""}</div>`;
  }

  function relationStimulusMarkup(data, task) {
    if (task.kind === "graph") return relationGraphMarkup(data,task,false);
    if (task.kind === "equation") return `<div class="relation-stimulus-copy"><p>${task.stimulus}</p>${relationEquationMarkup(data,task,false)}</div>`;
    if (task.kind === "table") return `<div class="relation-stimulus-copy"><p>${task.stimulus}</p>${relationTableMarkup(data,task,false)}</div>`;
    return `<div class="relation-situation-stimulus"><span>Real-world situation</span><p>${task.stimulus}</p></div>`;
  }

  function bindRelationFields(data) {
    document.querySelectorAll("[data-relation-field]").forEach(field => {
      const save = () => { data.responses[field.dataset.relationField] = field.value; };
      field.addEventListener("input",save);
      field.addEventListener("change",save);
    });
  }

  function checkRelationGraph(data, task, standard) {
    if (data.points.length !== 2) return setLabFeedback("Choose two exact grid points before drawing the line.","incorrect");
    data.graphed = true;
    const [first,second] = data.points;
    const run = second.x - first.x;
    const rise = second.y - first.y;
    const gridDistance = Math.hypot(second.gx-first.gx,second.gy-first.gy);
    if (Math.abs(run) < .0001) {
      data.graphCorrect = false;
      renderRelationLab(standard);
      return setLabFeedback("Those points make a vertical line. Choose two points whose x-values are different.","incorrect");
    }
    const slope = rise/run;
    const intercept = first.y - slope*first.x;
    const targetIntercept = task.intercept ?? 0;
    const bothOnTarget = data.points.every(point => relationNearlyEqual(point.y,task.rate*point.x + targetIntercept));
    data.graphCorrect = bothOnTarget && relationNearlyEqual(slope,task.rate) && relationNearlyEqual(intercept,targetIntercept) && gridDistance >= 2;
    renderRelationLab(standard);
    if (!bothOnTarget || !relationNearlyEqual(slope,task.rate)) return setLabFeedback("The line is visible now, but at least one point is not on the relationship. Use the rate and both axis intervals to locate equivalent ordered pairs.","incorrect");
    if (!relationNearlyEqual(intercept,targetIntercept)) return setLabFeedback(`Your points create the right rate, but the starting value is not ${proportionNumber(targetIntercept)}. Trace the pattern back to x = 0.`,"incorrect");
    if (gridDistance < 2) return setLabFeedback("Both points work, but choose quality points at least two grid intervals apart so the line is reliable.","incorrect");
    setLabFeedback(`Graph correct. The line through your points has slope ${proportionNumber(task.rate)} and y-intercept ${proportionNumber(targetIntercept)}. Complete the remaining representations.`,"correct");
  }

  function relationTableIsCorrect(data,task) {
    return task.table.every((row,index) => {
      if (row.x === null && !relationNearlyEqual(parseRelationNumber(data.responses[`table-${index}-x`]),row.xAnswer)) return false;
      if (row.y === null && !relationNearlyEqual(parseRelationNumber(data.responses[`table-${index}-y`]),row.yAnswer)) return false;
      return true;
    });
  }

  function renderRelationLab(standard) {
    if (!labRuntime.data) {
      labRuntime.data = { index:0 };
      resetRelationTask(labRuntime.data);
    }
    const data = labRuntime.data;
    const tasks = standard === "8.5B" ? NONPROPORTIONAL_RELATION_LAB_TASKS : RELATION_LAB_TASKS;
    const relationshipType = standard === "8.5B" ? "non-proportional" : "proportional";
    const tableDirections = standard === "8.5B"
      ? "Use equal changes in x and y to find the rate of change. The x-values count by 2, and the y-intercept may not be shown in the table."
      : "Use the constant rate in both directions. You may enter fractions or decimals.";
    const equationDirections = standard === "8.5B"
      ? "Enter both the rate of change m and the nonzero y-intercept b."
      : "Keep the y-intercept space visible, even when its value is zero.";
    if (data.index >= tasks.length) {
      setLabProgress(tasks.length,tasks.length,`All twelve ${relationshipType} relationships completed.`);
      return showLabCompletion(standard);
    }
    const task = tasks[data.index];
    const kindLabel = task.kind === "graph" ? "Graph stimulus" : task.kind === "equation" ? "Equation stimulus" : task.kind === "table" ? "Table stimulus" : "Situation stimulus";
    const completed = data.index + (data.solved ? 1 : 0);
    setLabProgress(completed,tasks.length,`Question ${data.index + 1}: translate the ${task.kind} into the other three representations.`);
    const graphEditable = task.kind !== "graph";
    const tableEditable = task.kind !== "table";
    const equationEditable = task.kind !== "equation";
    const storyEditable = task.kind !== "situation";
    $("#standardsLabBody").innerHTML = `
      <section class="relation-lab-shell">
        <header class="relation-task-header"><div><p class="lab-mini-title">Question ${data.index + 1} of ${tasks.length}</p><h4>${task.title}</h4></div><span>${kindLabel}</span></header>
        <article class="relation-stimulus-card"><div class="relation-card-label">Start here: ${task.kind}</div>${relationStimulusMarkup(data,task)}${task.kind === "graph" ? `<p class="relation-stimulus-note">${task.stimulus}</p>` : ""}</article>
        <div class="relation-representation-grid">
          ${graphEditable ? `<article class="relation-work-card relation-graph-card"><h5><span>1</span> Graph it</h5><p>Select any two quality points. The line appears only after you submit the points.</p>${relationGraphMarkup(data,task,true)}</article>` : ""}
          ${tableEditable ? `<article class="relation-work-card"><h5><span>${graphEditable ? "2" : "1"}</span> Complete the table</h5><p>${tableDirections}</p>${relationTableMarkup(data,task,true)}</article>` : ""}
          ${equationEditable ? `<article class="relation-work-card"><h5><span>${graphEditable ? (tableEditable ? "3" : "2") : "2"}</span> Build the equation</h5><p>${equationDirections}</p>${relationEquationMarkup(data,task,true)}</article>` : ""}
          ${storyEditable ? `<article class="relation-work-card"><h5><span>3</span> Complete the situation</h5><p>Choose the statement that matches both the slope and the starting value.</p>${relationStoryMarkup(data,task)}</article>` : ""}
        </div>
        <div class="relation-submit-row"><button type="button" class="lab-action" id="checkRelationTask" ${data.solved ? "disabled" : ""}>Check all representations</button><button type="button" class="lab-next" id="nextRelationTask" ${data.solved ? "" : "hidden"}>${data.index === tasks.length - 1 ? "Finish lab" : "Next relationship →"}</button></div>
      </section>`;
    bindRelationFields(data);

    if (graphEditable) {
      document.querySelectorAll("[data-proportion-gx]").forEach(hit => {
        const choose = () => {
          if (data.solved) return;
          const gx = Number(hit.dataset.proportionGx);
          const gy = Number(hit.dataset.proportionGy);
          const existing = data.points.findIndex(point => point.gx === gx && point.gy === gy);
          if (existing >= 0) data.points.splice(existing,1);
          else {
            if (data.points.length >= 2) data.points.shift();
            data.points.push({gx,gy,x:cleanSlopeNumber(gx*task.xStep),y:cleanSlopeNumber(gy*task.yStep)});
          }
          data.graphed = false;
          data.graphCorrect = false;
          renderRelationLab(standard);
          setLabFeedback(data.points.length === 2 ? "Two points selected. Submit them to draw the full line." : "Choose one more point on the relationship.");
        };
        hit.addEventListener("click",choose);
        hit.addEventListener("keydown",event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); } });
      });
      $("#checkRelationGraph").addEventListener("click",() => checkRelationGraph(data,task,standard));
      $("#clearRelationGraph").addEventListener("click",() => {
        data.points = [];
        data.graphed = false;
        data.graphCorrect = false;
        renderRelationLab(standard);
        setLabFeedback("Graph points cleared. Use the relationship to choose two new ordered pairs.");
      });
    }

    $("#checkRelationTask").addEventListener("click",() => {
      document.querySelectorAll("[data-relation-field]").forEach(field => { data.responses[field.dataset.relationField] = field.value; });
      const missed = [];
      if (graphEditable && !data.graphCorrect) missed.push("graph");
      if (tableEditable && !relationTableIsCorrect(data,task)) missed.push("table");
      if (equationEditable) {
        const k = parseRelationNumber(data.responses["equation-k"]);
        const b = parseRelationNumber(data.responses["equation-b"]);
        if (!relationNearlyEqual(k,task.rate) || !relationNearlyEqual(b,task.intercept ?? 0)) missed.push("equation");
      }
      if (storyEditable) {
        const storyRate = parseRelationNumber(data.responses["story-rate"]);
        const storyStart = parseRelationNumber(data.responses["story-start"]);
        if (!relationNearlyEqual(storyRate,task.rate) || !relationNearlyEqual(storyStart,task.intercept ?? 0)) missed.push("real-world sentence");
      }
      if (missed.length) {
        const details = missed.map(item => item === "equation" ? "In y = mx + b, m is the rate of change and b is the output when x = 0." : item === "table" ? "Compare equal changes in x and y to find m, then work backward to x = 0 to check b." : item === "graph" ? "Submit two correct points before checking the whole problem." : "The sentence must name both the per-one change and the value when the input is zero.").join(" ");
        return setLabFeedback(`Recheck the ${missed.join(", ")}. ${details}`,"incorrect");
      }
      data.solved = true;
      renderRelationLab(standard);
      setLabFeedback(`All four representations agree: slope = ${proportionNumber(task.rate)}, y-intercept = ${proportionNumber(task.intercept ?? 0)}, and ${task.equation}.`,"correct");
    });

    const next = $("#nextRelationTask");
    if (next) next.addEventListener("click",() => {
      if (data.index >= tasks.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetRelationTask(data);
      renderRelationLab(standard);
      syncWhiteboardQuestion();
      setLabFeedback("New relationship ready. Start with the given representation and connect it to the other three.");
    });
  }

  function renderLab85A() { renderRelationLab("8.5A"); }
  function renderLab85B() { renderRelationLab("8.5B"); }

  const SCATTER_BUILD_TASKS = [
    { goal:"positive", title:"Create a positive linear association", prompt:"Plot exactly 10 points that generally rise from left to right and cluster around a straight-line trend." },
    { goal:"negative", title:"Create a negative linear association", prompt:"Plot exactly 10 points that generally fall from left to right and cluster around a straight-line trend." },
    { goal:"none", title:"Create a scatterplot with no association", prompt:"Plot exactly 10 points with no clear upward, downward, or curved pattern." }
  ];

  const SCATTER_PATTERN_LIBRARY = {
    posStrong: { answer:"linear", direction:"positive", points:[[1,1.4],[2,2.5],[3,2.8],[4,4.2],[5,4.7],[6,6.1],[7,6.4],[8,7.9],[9,8.6],[10,9.4]], explanation:"The points cluster around a straight line that rises from left to right, so the data suggest a positive linear relationship." },
    posModerate: { answer:"linear", direction:"positive", points:[[1,2.1],[2,1.8],[3,3.7],[4,3.1],[5,5.2],[6,4.8],[7,6.7],[8,6.1],[9,8.2],[10,7.7]], explanation:"The points have some scatter, but their overall pattern still follows a straight rising trend." },
    posShallow: { answer:"linear", direction:"positive", points:[[1,3.0],[2,3.6],[3,3.4],[4,4.1],[5,4.2],[6,5.0],[7,4.8],[8,5.6],[9,5.7],[10,6.3]], explanation:"The rise is gentle, but the data still cluster around a straight line with a positive direction." },
    posSteep: { answer:"linear", direction:"positive", points:[[1,.8],[2,1.9],[3,3.1],[4,3.8],[5,5.4],[6,5.9],[7,7.5],[8,8.0],[9,9.4]], explanation:"The steepness does not change the category; the points follow one straight rising trend." },
    negStrong: { answer:"linear", direction:"negative", points:[[1,9.2],[2,8.4],[3,7.6],[4,6.3],[5,5.7],[6,4.9],[7,3.6],[8,3.0],[9,1.7],[10,1.1]], explanation:"The points cluster around a straight line that falls from left to right, so the data suggest a negative linear relationship." },
    negModerate: { answer:"linear", direction:"negative", points:[[1,8.4],[2,9.0],[3,7.1],[4,7.6],[5,5.7],[6,6.1],[7,4.2],[8,4.8],[9,2.7],[10,3.1]], explanation:"The points are not perfectly aligned, but their overall pattern follows a straight falling trend." },
    negShallow: { answer:"linear", direction:"negative", points:[[1,7.1],[2,6.8],[3,6.9],[4,6.0],[5,6.2],[6,5.4],[7,5.3],[8,4.8],[9,4.4],[10,4.2]], explanation:"This is a shallow negative trend. The points still cluster around a straight line." },
    negSteep: { answer:"linear", direction:"negative", points:[[1,9.5],[2,8.6],[3,7.5],[4,6.1],[5,5.3],[6,4.0],[7,3.2],[8,1.8],[9,.9]], explanation:"The points follow one straight downward trend, so the relationship is linear and negative." },
    uCurve: { answer:"not-linear", points:[[1,8.5],[2,6.2],[3,4.4],[4,3.0],[5,2.5],[6,2.8],[7,4.0],[8,6.0],[9,8.3]], explanation:"The points form a U-shaped curve. A clear relationship exists, but it is not linear." },
    arch: { answer:"not-linear", points:[[1,2.0],[2,4.2],[3,6.4],[4,7.8],[5,8.5],[6,8.0],[7,6.6],[8,4.5],[9,2.1]], explanation:"The points form an arch instead of clustering around one straight line, so the relationship is not linear." },
    exp: { answer:"not-linear", points:[[1,1.1],[2,1.3],[3,1.5],[4,1.9],[5,2.4],[6,3.2],[7,4.4],[8,6.2],[9,8.8]], explanation:"The rate of increase becomes steeper. The curved pattern does not suggest a linear relationship." },
    decay: { answer:"not-linear", points:[[1,9.2],[2,6.5],[3,4.7],[4,3.6],[5,2.8],[6,2.3],[7,1.9],[8,1.6],[9,1.4]], explanation:"The data decrease quickly and then level off. That curve is not a straight-line trend." },
    circle: { answer:"not-linear", points:[[3,5],[3.6,7],[5,8],[6.5,7.4],[7.3,5.5],[7,3.4],[5.5,2.3],[4,3]], explanation:"The points loop around a center and do not follow one straight-line trend." },
    wave: { answer:"not-linear", points:[[1,5],[2,7.4],[3,8.2],[4,6.4],[5,4.1],[6,2.2],[7,2.8],[8,5.1],[9,7.3]], explanation:"The direction changes more than once, creating a curved wave rather than a linear pattern." },
    randomA: { answer:"not-linear", points:[[1,7.5],[2,2.0],[3,5.8],[4,8.5],[5,3.2],[6,6.7],[7,1.8],[8,8.0],[9,4.6],[10,6.0]], explanation:"The points are spread without a clear straight upward or downward trend, so they show no linear relationship." },
    randomB: { answer:"not-linear", points:[[1,3.0],[2,8.2],[3,1.6],[4,6.7],[5,4.5],[6,9.0],[7,2.7],[8,5.9],[9,7.6],[10,3.8]], explanation:"The data move up and down without clustering around a straight line, so they show no linear relationship." }
  };

  const SCATTER_CLASSIFY_ROUNDS = [
    { title:"Straight trend or curve?", plots:["posStrong","uCurve","negStrong","posModerate"] },
    { title:"Look beyond the direction", plots:["randomA","negModerate","arch","circle"] },
    { title:"Linear can have different slopes", plots:["posShallow","negShallow","posSteep","negSteep"] },
    { title:"Relationships that are not linear", plots:["uCurve","randomB","wave","arch"] },
    { title:"Separate straight trends from other patterns", plots:["posModerate","circle","randomA","negStrong"] },
    { title:"Scatter does not erase a linear trend", plots:["exp","negModerate","posStrong","negShallow"] },
    { title:"One straight-line pattern", plots:["randomB","posShallow","decay","uCurve"] }
  ];

  const SCATTER_TOTAL_TASKS = SCATTER_BUILD_TASKS.length + SCATTER_CLASSIFY_ROUNDS.length;

  function resetScatterTask(data) {
    data.points = [];
    data.choices = {};
    data.checked = false;
    data.solved = false;
    data.analysis = null;
  }

  function scatterCoordinates(point) {
    return Array.isArray(point)
      ? { x:Number(point[0]), y:Number(point[1]) }
      : { x:Number(point.x), y:Number(point.y) };
  }

  function scatterPointKey(point) {
    const coordinates = scatterCoordinates(point);
    return `${coordinates.x},${coordinates.y}`;
  }

  function scatterCorrelation(points, xAccessor = point => point.x, yAccessor = point => point.y) {
    if (points.length < 2) return 0;
    const xs = points.map(xAccessor);
    const ys = points.map(yAccessor);
    const meanX = xs.reduce((sum,value) => sum + value,0) / xs.length;
    const meanY = ys.reduce((sum,value) => sum + value,0) / ys.length;
    let numerator = 0;
    let xSquares = 0;
    let ySquares = 0;
    points.forEach((point,index) => {
      const dx = xs[index] - meanX;
      const dy = ys[index] - meanY;
      numerator += dx * dy;
      xSquares += dx * dx;
      ySquares += dy * dy;
    });
    const denominator = Math.sqrt(xSquares * ySquares);
    return denominator ? numerator / denominator : 0;
  }

  function analyzeCreatedScatter(points, goal) {
    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);
    const xRange = Math.max(...xs) - Math.min(...xs);
    const yRange = Math.max(...ys) - Math.min(...ys);
    const distinctX = new Set(xs).size;
    const r = scatterCorrelation(points);
    const meanX = xs.reduce((sum,value) => sum + value,0) / xs.length;
    const curveR = scatterCorrelation(points, point => (point.x - meanX) ** 2, point => point.y);
    if (xRange < 6 || yRange < 4 || distinctX < 7) {
      return { correct:false, r, curveR, message:"Spread the points across more of both axes. A useful scatterplot needs enough horizontal and vertical range for its overall pattern to be visible." };
    }
    if (goal === "positive") {
      if (r >= .75 && Math.abs(curveR) < .62) return { correct:true, r, curveR, message:"Your points form a clear straight trend that rises from left to right: a positive linear association." };
      if (r < 0) return { correct:false, r, curveR, message:"This pattern falls overall. For a positive association, higher x-values should generally be paired with higher y-values." };
      if (Math.abs(curveR) >= .62) return { correct:false, r, curveR, message:"Your points show a noticeable curve. Rearrange a few points so they cluster around one straight rising path." };
      return { correct:false, r, curveR, message:"The upward direction is not clear enough yet. Move a few points so the cloud follows a stronger straight rising trend." };
    }
    if (goal === "negative") {
      if (r <= -.75 && Math.abs(curveR) < .62) return { correct:true, r, curveR, message:"Your points form a clear straight trend that falls from left to right: a negative linear association." };
      if (r > 0) return { correct:false, r, curveR, message:"This pattern rises overall. For a negative association, higher x-values should generally be paired with lower y-values." };
      if (Math.abs(curveR) >= .62) return { correct:false, r, curveR, message:"Your points show a noticeable curve. Rearrange a few points so they cluster around one straight falling path." };
      return { correct:false, r, curveR, message:"The downward direction is not clear enough yet. Move a few points so the cloud follows a stronger straight falling trend." };
    }
    if (Math.abs(r) <= .25 && Math.abs(curveR) <= .45) return { correct:true, r, curveR, message:"Your points have no clear upward, downward, or curved pattern, so they show no association." };
    if (Math.abs(curveR) > .45 && Math.abs(r) <= .4) return { correct:false, r, curveR, message:"The straight-line direction is weak, but the points still form a curve. Mix the high and low points more randomly to show no association." };
    return { correct:false, r, curveR, message:"A direction is still visible. Mix the high and low y-values across the x-axis so the data do not rise or fall overall." };
  }

  function scatterDirectionLabel(r) {
    const strength = Math.abs(r) >= .75 ? "strong" : Math.abs(r) >= .45 ? "moderate" : Math.abs(r) >= .25 ? "weak" : "little";
    const direction = r > .08 ? "positive" : r < -.08 ? "negative" : "no clear";
    return `${strength} ${direction} straight-line trend`;
  }

  function scatterPlotMarkup(points, options = {}) {
    const interactive = Boolean(options.interactive);
    const selected = new Set(points.map(scatterPointKey));
    const width = 520;
    const height = 420;
    const left = 62;
    const right = 482;
    const top = 28;
    const bottom = 364;
    const sx = value => left + (value / 10) * (right - left);
    const sy = value => bottom - (value / 10) * (bottom - top);
    let grid = "";
    for (let value = 0; value <= 10; value += 1) {
      const x = sx(value);
      const y = sy(value);
      grid += `<line class="scatter-grid-line ${value === 0 ? "is-axis" : ""}" x1="${x}" y1="${top}" x2="${x}" y2="${bottom}"></line>`;
      grid += `<line class="scatter-grid-line ${value === 0 ? "is-axis" : ""}" x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line>`;
      if (value % 2 === 0) {
        grid += `<text class="scatter-tick" x="${x}" y="${bottom + 24}" text-anchor="middle">${value}</text>`;
        grid += `<text class="scatter-tick" x="${left - 14}" y="${y + 5}" text-anchor="end">${value}</text>`;
      }
    }
    const dots = points.map(point => {
      const coordinates = scatterCoordinates(point);
      return `<circle class="scatter-dot ${interactive ? "is-created" : ""}" cx="${sx(coordinates.x)}" cy="${sy(coordinates.y)}" r="${interactive ? 7 : 6}"></circle>`;
    }).join("");
    let hits = "";
    if (interactive) {
      for (let x = 0; x <= 10; x += 1) {
        for (let y = 0; y <= 10; y += 1) {
          const chosen = selected.has(`${x},${y}`);
          hits += `<circle class="scatter-hit ${chosen ? "is-selected" : ""}" cx="${sx(x)}" cy="${sy(y)}" r="11" tabindex="0" role="button" aria-label="${chosen ? "Remove" : "Plot"} point ${x}, ${y}" data-scatter-x="${x}" data-scatter-y="${y}"></circle>`;
        }
      }
    }
    return `<svg class="scatter-plot ${interactive ? "is-interactive" : ""}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${interactive ? "Interactive coordinate plane for building a scatterplot" : "Scatterplot of bivariate data"}">${grid}${dots}${hits}<text class="scatter-axis-label" x="${(left + right) / 2}" y="410" text-anchor="middle">x variable</text><text class="scatter-axis-label" x="18" y="${(top + bottom) / 2}" text-anchor="middle" transform="rotate(-90 18 ${(top + bottom) / 2})">y variable</text></svg>`;
  }

  function renderScatterBuilder(data, task) {
    const count = data.points.length;
    const statusMarkup = data.analysis ? `<div class="scatter-pattern-readout ${data.analysis.correct ? "is-correct" : "is-recheck"}"><span>Pattern check</span><strong>${scatterDirectionLabel(data.analysis.r)}</strong></div>` : "";
    $("#standardsLabBody").innerHTML = `
      <section class="scatter-lab-shell">
        <header class="scatter-task-header"><div><p class="lab-mini-title">Investigation ${data.index + 1} of ${SCATTER_TOTAL_TASKS}</p><h4>${task.title}</h4><p>${task.prompt}</p></div><span class="scatter-count ${count === 10 ? "is-ready" : ""}">${count}/10 points</span></header>
        <div class="scatter-builder-grid">
          <article class="scatter-graph-card"><div class="scatter-graph-wrap">${scatterPlotMarkup(data.points,{interactive:true})}</div><p class="scatter-tap-note">Tap a grid intersection to add a point. Tap a selected point to remove it.</p></article>
          <aside class="scatter-coach-card">
            <p class="lab-mini-title">Build, look, adjust</p>
            <ol><li>Spread your points across the graph.</li><li>Step back and look at the entire cloud.</li><li>Submit only when the pattern matches the goal.</li></ol>
            ${statusMarkup}
            <div class="scatter-point-list"><strong>Your ordered pairs</strong><p>${count ? data.points.map(point => `(${point.x}, ${point.y})`).join("  ·  ") : "Your plotted points will appear here."}</p></div>
            <div class="scatter-build-actions"><button type="button" class="lab-choice" id="undoScatterPoint" ${count ? "" : "disabled"}>Undo last point</button><button type="button" class="lab-choice" id="clearScatterPoints" ${count ? "" : "disabled"}>Clear all</button><button type="button" class="lab-action" id="checkScatterBuild" ${data.solved ? "disabled" : ""}>Check my pattern</button><button type="button" class="lab-next" id="nextScatterTask" ${data.solved ? "" : "hidden"}>Next investigation →</button></div>
          </aside>
        </div>
      </section>`;

    document.querySelectorAll("[data-scatter-x]").forEach(hit => {
      const choose = () => {
        if (data.solved) return;
        const point = {x:Number(hit.dataset.scatterX),y:Number(hit.dataset.scatterY)};
        const index = data.points.findIndex(candidate => scatterPointKey(candidate) === scatterPointKey(point));
        if (index >= 0) data.points.splice(index,1);
        else if (data.points.length >= 10) return setLabFeedback("You already have 10 points. Remove one before choosing a different location.","incorrect");
        else data.points.push(point);
        data.analysis = null;
        renderLab85C();
        setLabFeedback(data.points.length === 10 ? "Ten points plotted. Look at the overall pattern, then check it." : `${data.points.length} of 10 points plotted.`);
      };
      hit.addEventListener("click",choose);
      hit.addEventListener("keydown",event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); } });
    });
    $("#undoScatterPoint").addEventListener("click",() => { data.points.pop(); data.analysis = null; renderLab85C(); setLabFeedback("Last point removed."); });
    $("#clearScatterPoints").addEventListener("click",() => { data.points = []; data.analysis = null; renderLab85C(); setLabFeedback("Scatterplot cleared. Build a new 10-point pattern."); });
    $("#checkScatterBuild").addEventListener("click",() => {
      if (data.points.length !== 10) return setLabFeedback(`Plot exactly 10 points before checking. You still need ${10 - data.points.length}.`,"incorrect");
      data.analysis = analyzeCreatedScatter(data.points,task.goal);
      if (!data.analysis.correct) { renderLab85C(); return setLabFeedback(data.analysis.message,"incorrect"); }
      data.solved = true;
      renderLab85C();
      setLabFeedback(data.analysis.message,"correct");
    });
    const next = $("#nextScatterTask");
    if (next) next.addEventListener("click",() => advanceScatterLab(data));
  }

  function scatterClassificationCardMarkup(data, plotId, index) {
    const plot = SCATTER_PATTERN_LIBRARY[plotId];
    const choice = data.choices[index] || "";
    const correct = choice === plot.answer;
    const checkedClass = data.checked ? (correct ? "is-correct" : "is-incorrect") : "";
    const feedback = data.checked ? `<p class="scatter-card-feedback"><strong>${plot.answer === "linear" ? "Linear." : "Not linear."}</strong> ${plot.explanation}</p>` : "";
    return `<article class="scatter-classify-card ${checkedClass}" data-scatter-card="${index}"><header><span>Plot ${String.fromCharCode(65 + index)}</span><small>${choice ? choice.replace("-"," ") : "Choose a category"}</small></header><div class="scatter-mini-wrap">${scatterPlotMarkup(plot.points)}</div><div class="scatter-category-buttons"><button type="button" class="lab-choice ${choice === "linear" ? "is-selected" : ""}" data-scatter-choice="linear" data-plot-index="${index}">Linear</button><button type="button" class="lab-choice ${choice === "not-linear" ? "is-selected" : ""}" data-scatter-choice="not-linear" data-plot-index="${index}">Not linear</button></div>${feedback}</article>`;
  }

  function renderScatterClassifier(data, round) {
    const questionNumber = data.index + 1;
    const answered = Object.keys(data.choices).length;
    $("#standardsLabBody").innerHTML = `
      <section class="scatter-lab-shell">
        <header class="scatter-task-header"><div><p class="lab-mini-title">Investigation ${questionNumber} of ${SCATTER_TOTAL_TASKS}</p><h4>${round.title}</h4><p>Classify every scatterplot. Choose <strong>Linear</strong> when the points cluster around a straight-line trend. Choose <strong>Not linear</strong> for a curve or no clear association.</p></div><span class="scatter-count ${answered === 4 ? "is-ready" : ""}">${answered}/4 classified</span></header>
        <div class="scatter-classify-grid">${round.plots.map((plotId,index) => scatterClassificationCardMarkup(data,plotId,index)).join("")}</div>
        <div class="scatter-submit-row"><button type="button" class="lab-action" id="checkScatterClassify" ${data.solved ? "disabled" : ""}>Check all four</button><button type="button" class="lab-next" id="nextScatterTask" ${data.solved ? "" : "hidden"}>${data.index === SCATTER_TOTAL_TASKS - 1 ? "Finish lab" : "Next investigation →"}</button></div>
      </section>`;
    document.querySelectorAll("[data-scatter-choice]").forEach(button => button.addEventListener("click",() => {
      if (data.solved) return;
      data.choices[Number(button.dataset.plotIndex)] = button.dataset.scatterChoice;
      data.checked = false;
      renderLab85C();
      setLabFeedback(`${Object.keys(data.choices).length} of 4 plots classified. Consider the entire shape of each point cloud.`);
    }));
    $("#checkScatterClassify").addEventListener("click",() => {
      if (Object.keys(data.choices).length < 4) return setLabFeedback("Classify all four scatterplots before checking.","incorrect");
      data.checked = true;
      const incorrect = round.plots.filter((plotId,index) => data.choices[index] !== SCATTER_PATTERN_LIBRARY[plotId].answer).length;
      if (incorrect) { renderLab85C(); return setLabFeedback(`${incorrect} ${incorrect === 1 ? "plot needs" : "plots need"} another look. Read the orange explanations, correct the categories, and check again.`,"incorrect"); }
      data.solved = true;
      renderLab85C();
      setLabFeedback("All four classifications are correct. You used the overall shape of the data, not a single point.","correct");
    });
    const next = $("#nextScatterTask");
    if (next) next.addEventListener("click",() => advanceScatterLab(data));
  }

  function advanceScatterLab(data) {
    if (data.index >= SCATTER_TOTAL_TASKS - 1) return showLabCompletion("8.5C");
    data.index += 1;
    resetScatterTask(data);
    renderLab85C();
    syncWhiteboardQuestion();
    setLabFeedback(data.index < 3 ? "New creation challenge ready. Plot exactly 10 points." : "Four new scatterplots ready. Classify each by its overall shape.");
  }

  function renderLab85C() {
    if (!labRuntime.data) labRuntime.data = {index:0,points:[],choices:{},checked:false,solved:false,analysis:null};
    const data = labRuntime.data;
    if (data.index >= SCATTER_TOTAL_TASKS) return showLabCompletion("8.5C");
    const completed = data.index + (data.solved ? 1 : 0);
    const phaseLabel = data.index < 3 ? "Create your own point cloud" : "Classify four point clouds";
    setLabProgress(completed,SCATTER_TOTAL_TASKS,`Question ${data.index + 1}: ${phaseLabel}.`);
    if (data.index < SCATTER_BUILD_TASKS.length) return renderScatterBuilder(data,SCATTER_BUILD_TASKS[data.index]);
    renderScatterClassifier(data,SCATTER_CLASSIFY_ROUNDS[data.index - SCATTER_BUILD_TASKS.length]);
  }


  const DIRECT_VARIATION_TASKS = [
    {
      title:"Smoothie prep",
      situation:"A smoothie station uses 3 cups of strawberries to prepare 2 batches of smoothies.",
      statement:"The number of cups of strawberries, y, varies directly with the number of batches, x.",
      xLabel:"number of batches", yLabel:"cups of strawberries", xValue:2, yValue:3,
      k:1.5, targetLabel:"batches", targetValue:5, find:"y", answer:7.5, answerUnit:"cups of strawberries"
    },
    {
      title:"Lawn-mowing business",
      situation:"Malik mows 4 lawns in 5 hours.",
      statement:"The number of lawns mowed, y, is directly proportional to the number of hours worked, x.",
      xLabel:"hours worked", yLabel:"lawns mowed", xValue:5, yValue:4,
      k:0.8, targetLabel:"hours worked", targetValue:7.5, find:"y", answer:6, answerUnit:"lawns"
    },
    {
      title:"Electricity cost",
      situation:"Using 1,079 kilowatt-hours of electricity costs $129.48.",
      statement:"The cost of electricity, y, is proportional to the number of kilowatt-hours used, x.",
      xLabel:"kilowatt-hours used", yLabel:"cost in dollars", xValue:1079, yValue:129.48,
      k:0.12, targetLabel:"kilowatt-hours", targetValue:908, find:"y", answer:108.96, answerUnit:"dollars"
    },
    {
      title:"Dishwasher water use",
      situation:"An electric dishwasher uses 32 gallons of water to wash 4 loads of dishes.",
      statement:"The amount of water used, y, varies directly with the number of loads of dishes, x.",
      xLabel:"loads of dishes", yLabel:"gallons of water", xValue:4, yValue:32,
      k:8, targetLabel:"loads", targetValue:10, find:"y", answer:80, answerUnit:"gallons"
    },
    {
      title:"Gift baskets",
      situation:"Nikki can make 4 gift baskets in one-half hour.",
      statement:"The number of gift baskets, y, is directly proportional to the amount of time in hours, x.",
      xLabel:"time in hours", yLabel:"gift baskets made", xValue:0.5, yValue:4,
      k:8, targetLabel:"hours", targetValue:5, find:"y", answer:40, answerUnit:"gift baskets"
    },
    {
      title:"Direct variation with numbers",
      situation:"When x = 1/2, y = 75.",
      statement:"The value of y varies directly with x.",
      xLabel:"value of x", yLabel:"value of y", xValue:0.5, yValue:75,
      k:150, targetLabel:"x", targetValue:2.25, find:"y", answer:337.5, answerUnit:""
    }
  ];

  function directVariationNear(value, expected) {
    const number = parseRelationNumber ? parseRelationNumber(value) : Number(value);
    return Number.isFinite(number) && Math.abs(number - expected) < .001;
  }

  function directVariationOptions(task, selected, field) {
    const options = [task.xLabel, task.yLabel];
    return options.map(option => `<option value="${escapeHTML(option)}"${selected === option ? " selected" : ""}>${escapeHTML(option)}</option>`).join("");
  }

  function resetDirectVariationTask(data) {
    data.responses = {};
    data.solved = false;
  }

  function renderLab85E() {
    if (!labRuntime.data) labRuntime.data = { index:0, responses:{}, solved:false };
    const data = labRuntime.data;
    const task = DIRECT_VARIATION_TASKS[data.index];
    if (!task) return showLabCompletion("8.5E");
    const r = data.responses || (data.responses = {});
    const body = $("#standardsLabBody");
    const completed = data.index + (data.solved ? 1 : 0);
    setLabProgress(completed,DIRECT_VARIATION_TASKS.length,`Problem ${data.index + 1} of ${DIRECT_VARIATION_TASKS.length}: identify → ratio → k → equation → solve.`);

    body.innerHTML = `
      <section class="variation-lab-shell">
        <header class="variation-problem-card">
          <div><p class="lab-mini-title">Direct variation situation</p><h4>${escapeHTML(task.title)}</h4></div>
          <span class="variation-problem-count">${data.index + 1} / ${DIRECT_VARIATION_TASKS.length}</span>
          <p class="variation-situation">${escapeHTML(task.situation)}</p>
          <p class="variation-statement">${escapeHTML(task.statement)}</p>
        </header>

        <div class="variation-step-grid">
          <section class="variation-step-card">
            <span class="variation-step-number">1</span>
            <h5>Name x and y</h5>
            <p>Which quantity is independent? Which quantity depends on it?</p>
            <label>Independent variable — x
              <select data-variation-field="xLabel">
                <option value="">Choose x...</option>
                ${directVariationOptions(task,r.xLabel,"xLabel")}
              </select>
            </label>
            <label>Dependent variable — y
              <select data-variation-field="yLabel">
                <option value="">Choose y...</option>
                ${directVariationOptions(task,r.yLabel,"yLabel")}
              </select>
            </label>
          </section>

          <section class="variation-step-card">
            <span class="variation-step-number">2</span>
            <h5>Build k with words</h5>
            <p>Because y = kx, the constant is k = y ÷ x.</p>
            <div class="variation-fraction">
              <select data-variation-field="ratioTop"><option value="">top...</option>${directVariationOptions(task,r.ratioTop,"ratioTop")}</select>
              <span></span>
              <select data-variation-field="ratioBottom"><option value="">bottom...</option>${directVariationOptions(task,r.ratioBottom,"ratioBottom")}</select>
            </div>
            <small>Read it as “${escapeHTML(task.yLabel)} per ${escapeHTML(task.xLabel)}.”</small>
          </section>

          <section class="variation-step-card">
            <span class="variation-step-number">3</span>
            <h5>Substitute and find k</h5>
            <p>Now replace the words in your ratio with the numbers from the situation.</p>
            <div class="variation-fraction" aria-label="numeric ratio for k">
              <input data-variation-field="numericTop" inputmode="decimal" value="${escapeHTML(r.numericTop || "")}" placeholder="value of y" aria-label="numerator, value of y">
              <span></span>
              <input data-variation-field="numericBottom" inputmode="decimal" value="${escapeHTML(r.numericBottom || "")}" placeholder="value of x" aria-label="denominator, value of x">
            </div>
            <label>k = <input data-variation-field="k" inputmode="decimal" value="${escapeHTML(r.k || "")}" placeholder="solve for k"></label>
            <small>Use the values from the situation. Then divide y by x to find the constant of variation.</small>
          </section>

          <section class="variation-step-card">
            <span class="variation-step-number">4</span>
            <h5>Write the equation</h5>
            <div class="variation-equation-row"><span>y =</span><input data-variation-field="equationK" inputmode="decimal" value="${escapeHTML(r.equationK || "")}" aria-label="value of k in y equals kx"><span>x</span></div>
            <small>Use the same k you just found.</small>
          </section>
        </div>

        <section class="variation-solve-card">
          <div>
            <span class="variation-step-number">5</span>
            <p class="lab-mini-title">Use k to solve</p>
            <h5>${task.find === "y"
              ? `What is y when ${escapeHTML(task.targetLabel)} = ${task.targetValue}?`
              : `What is x when y = ${task.targetValue}?`}</h5>
            <p>Substitute the new value into your direct-variation equation.</p>
          </div>
          <div class="variation-solve-work">
            <span>y = ${task.k}(${task.targetValue})</span>
            <label>Answer <input data-variation-field="answer" inputmode="decimal" value="${escapeHTML(r.answer || "")}"> <strong>${escapeHTML(task.answerUnit)}</strong></label>
          </div>
        </section>

        <div class="relation-submit-row">
          <button class="lab-action" id="checkVariationTask" type="button">Check my reasoning</button>
          ${data.solved ? `<button class="lab-next" id="nextVariationTask" type="button">${data.index === DIRECT_VARIATION_TASKS.length - 1 ? "Finish lab →" : "Next situation →"}</button>` : ""}
        </div>
      </section>`;

    body.querySelectorAll("[data-variation-field]").forEach(field => {
      field.addEventListener("input",() => { data.responses[field.dataset.variationField] = field.value; });
      field.addEventListener("change",() => { data.responses[field.dataset.variationField] = field.value; });
    });

    $("#checkVariationTask").addEventListener("click",() => {
      body.querySelectorAll("[data-variation-field]").forEach(field => { data.responses[field.dataset.variationField] = field.value; });
      const missed = [];
      if (r.xLabel !== task.xLabel || r.yLabel !== task.yLabel) missed.push("variables");
      if (r.ratioTop !== task.yLabel || r.ratioBottom !== task.xLabel) missed.push("word ratio");
      if (!directVariationNear(r.numericTop,task.yValue) || !directVariationNear(r.numericBottom,task.xValue)) missed.push("number substitution");
      if (!directVariationNear(r.k,task.k)) missed.push("k");
      if (!directVariationNear(r.equationK,task.k)) missed.push("equation");
      if (!directVariationNear(r.answer,task.answer)) missed.push("final answer");
      if (missed.length) {
        const hint = missed.includes("variables")
          ? "Ask which quantity is chosen or changed first; that is x. The quantity that responds is y."
          : missed.includes("word ratio")
            ? "Build k as y/x: put the dependent variable on top and the independent variable on the bottom."
            : missed.includes("number substitution")
              ? "Use the numbers from the situation in the same order as your word ratio: the known y-value goes on top and the known x-value goes on the bottom."
            : missed.includes("k")
              ? "Now divide the number you placed on top by the number you placed on the bottom to find k."
              : missed.includes("equation")
                ? "Write y = kx using the exact k you found."
                : "Substitute the new x-value into y = kx and calculate y.";
        return setLabFeedback(`Recheck the ${missed.join(", ")}. ${hint}`,"incorrect");
      }
      data.solved = true;
      renderLab85E();
      setLabFeedback(`Correct. k = ${task.k}, so the direct-variation equation is y = ${task.k}x and the new value is ${task.answer}${task.answerUnit ? " " + task.answerUnit : ""}.`,"correct");
    });

    const next = $("#nextVariationTask");
    if (next) next.addEventListener("click",() => {
      if (data.index >= DIRECT_VARIATION_TASKS.length - 1) return showLabCompletion("8.5E");
      data.index += 1;
      resetDirectVariationTask(data);
      renderLab85E();
      syncWhiteboardQuestion();
      setLabFeedback("New direct-variation situation ready. Start by naming x and y.");
    });
  }


  const PROPORTIONAL_SORT_ROUNDS = [
    {
      title:"Round 1: Read every representation",
      items:[
        {id:"r1t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[1,3],[2,6],[4,12]],tableNote:"The table includes (0, 0), and every nonzero row has the same y/x ratio: 3."},
        {id:"r1t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,4],[1,6],[2,8],[4,12]],tableNote:"When x = 0, y = 4, so the relationship does not pass through the origin."},
        {id:"r1g",type:"graph",title:"Graph",answer:"proportional",m:.6,b:0},
        {id:"r1e",type:"equation",title:"Equation",answer:"proportional",text:"y = -3x"},
        {id:"r1w",type:"realworld",title:"Real-world situation",answer:"proportional",text:"A store charges $6 for each notebook. There is no additional fee."},
        {id:"r1v",type:"verbal",title:"Mathematical description",answer:"proportional",text:"y is the product of -5 and x."}
      ]
    },
    {
      title:"Round 2: Do not count the categories",
      items:[
        {id:"r2t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[-2,5],[2,-5],[4,-10]],tableNote:"The table includes (0, 0), and y/x is -2.5 for every nonzero x-value."},
        {id:"r2t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,-3],[2,1],[4,5],[6,9]],tableNote:"When x = 0, y = -3. The nonzero y-intercept makes the relationship non-proportional."},
        {id:"r2g",type:"graph",title:"Graph",answer:"non-proportional",m:-.5,b:2},
        {id:"r2e",type:"equation",title:"Equation",answer:"non-proportional",text:"y = 4x + 7"},
        {id:"r2w",type:"realworld",title:"Real-world situation",answer:"non-proportional",text:"A taxi ride costs $4 to start plus $2.50 for each mile traveled."},
        {id:"r2v",type:"verbal",title:"Mathematical description",answer:"non-proportional",text:"y is 5 less than the quotient of x and 7."}
      ]
    },
    {
      title:"Round 3: Mix the forms",
      items:[
        {id:"r3t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[2,1],[6,3],[10,5]],tableNote:"The table includes (0, 0), and each nonzero row has y/x = 1/2."},
        {id:"r3t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,5],[3,11],[6,17],[9,23]],tableNote:"The table starts at (0, 5), not (0, 0), so it is non-proportional."},
        {id:"r3g",type:"graph",title:"Graph",answer:"proportional",m:-.7,b:0},
        {id:"r3e",type:"equation",title:"Equation",answer:"proportional",text:"y = (3/4)x"},
        {id:"r3w",type:"realworld",title:"Real-world situation",answer:"non-proportional",text:"A streaming service charges a $12 monthly fee plus $3 for each movie rented."},
        {id:"r3v",type:"verbal",title:"Mathematical description",answer:"proportional",text:"y is one-third of x."}
      ]
    },
    {
      title:"Round 4: Tables without x = 0",
      items:[
        {id:"r4t1",type:"table",title:"Table A — x = 0 is hidden",answer:"proportional",challenge:true,rows:[[2,6],[5,15],[8,24],[11,33]],tableNote:"x = 0 is not shown. Check y/x instead: 6/2 = 3, 15/5 = 3, 24/8 = 3, and 33/11 = 3. The constant ratio shows y = 3x."},
        {id:"r4t2",type:"table",title:"Table B — x = 0 is hidden",answer:"non-proportional",challenge:true,rows:[[2,7],[5,16],[8,25],[11,34]],tableNote:"x = 0 is not shown. The table has a constant rate of change, but y/x is not constant: 7/2, 16/5, 25/8, and 34/11 are different. It follows y = 3x + 1, so it is non-proportional."},
        {id:"r4g",type:"graph",title:"Graph",answer:"non-proportional",m:.45,b:-2},
        {id:"r4e",type:"equation",title:"Equation",answer:"non-proportional",text:"y = -2x + 5"},
        {id:"r4w",type:"realworld",title:"Real-world situation",answer:"proportional",text:"A machine fills bottles at 18 ounces per bottle with no starting amount already in the container."},
        {id:"r4v",type:"verbal",title:"Mathematical description",answer:"non-proportional",text:"y is 8 more than 4 times x."}
      ]
    },
    {
      title:"Round 5: Same idea, different language",
      items:[
        {id:"r5t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[3,-6],[5,-10],[9,-18]],tableNote:"The table includes (0, 0), and y/x = -2 for every nonzero x-value."},
        {id:"r5t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,6],[2,10],[4,14],[7,20]],tableNote:"At x = 0, y = 6. That starting value keeps the relationship from being proportional."},
        {id:"r5g",type:"graph",title:"Graph",answer:"proportional",m:.35,b:0},
        {id:"r5e",type:"equation",title:"Equation",answer:"proportional",text:"y = 1.25x"},
        {id:"r5w",type:"realworld",title:"Real-world situation",answer:"proportional",text:"A recipe uses 2.5 cups of flour for each batch. No flour is used before any batches are made."},
        {id:"r5v",type:"verbal",title:"Mathematical description",answer:"proportional",text:"y equals the quotient of x and -4."}
      ]
    },
    {
      title:"Round 6: Watch the starting value",
      items:[
        {id:"r6t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[4,10],[8,20],[12,30]],tableNote:"The table includes (0, 0), and y/x = 2.5 for every nonzero x-value."},
        {id:"r6t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,-4],[1,-1],[3,5],[5,11]],tableNote:"When x = 0, y = -4, so the relationship has a nonzero y-intercept."},
        {id:"r6g",type:"graph",title:"Graph",answer:"non-proportional",m:.55,b:2},
        {id:"r6e",type:"equation",title:"Equation",answer:"non-proportional",text:"y = (2/3)x - 1"},
        {id:"r6w",type:"realworld",title:"Real-world situation",answer:"proportional",text:"Workers earn $16 for every hour worked, with no signing bonus or starting payment."},
        {id:"r6v",type:"verbal",title:"Mathematical description",answer:"non-proportional",text:"y is 9 less than twice x."}
      ]
    },
    {
      title:"Round 7: Final classification",
      items:[
        {id:"r7t1",type:"table",title:"Table A",answer:"proportional",rows:[[0,0],[-4,-6],[2,3],[8,12]],tableNote:"The table contains (0, 0), and y/x = 1.5 for every nonzero x-value."},
        {id:"r7t2",type:"table",title:"Table B",answer:"non-proportional",rows:[[0,2],[2,-2],[5,-8],[9,-16]],tableNote:"The point (0, 2) shows a nonzero starting value, so the relationship is non-proportional."},
        {id:"r7g",type:"graph",title:"Graph",answer:"non-proportional",m:-.4,b:-2},
        {id:"r7e",type:"equation",title:"Equation",answer:"non-proportional",text:"y = -7x + 3"},
        {id:"r7w",type:"realworld",title:"Real-world situation",answer:"non-proportional",text:"A theater charges $8 for each ticket plus a one-time $5 online service fee."},
        {id:"r7v",type:"verbal",title:"Mathematical description",answer:"non-proportional",text:"y is 6 more than the product of -3 and x."}
      ]
    }
  ];

  function proportionalGraphMarkup(item) {
    const width=260, height=180, pad=28, min=-5, max=5;
    const px=x => pad + ((x-min)/(max-min))*(width-pad*2);
    const py=y => height-pad - ((y-min)/(max-min))*(height-pad*2);
    const xAxis=py(0), yAxis=px(0);
    const lines=[];
    for (let n=-4;n<=4;n+=2) {
      lines.push("<line x1='"+px(n)+"' y1='"+pad+"' x2='"+px(n)+"' y2='"+(height-pad)+"' class='prop-grid-line'/>");
      lines.push("<line x1='"+pad+"' y1='"+py(n)+"' x2='"+(width-pad)+"' y2='"+py(n)+"' class='prop-grid-line'/>");
    }
    const x1=-5, x2=5, y1=item.m*x1+item.b, y2=item.m*x2+item.b;
    return "<svg class='prop-mini-graph' viewBox='0 0 "+width+" "+height+"' role='img' aria-label='Line graph with y-intercept "+item.b+"'>"+
      lines.join("")+
      "<line x1='"+pad+"' y1='"+xAxis+"' x2='"+(width-pad)+"' y2='"+xAxis+"' class='prop-axis'/>"+
      "<line x1='"+yAxis+"' y1='"+pad+"' x2='"+yAxis+"' y2='"+(height-pad)+"' class='prop-axis'/>"+
      "<line x1='"+px(x1)+"' y1='"+py(y1)+"' x2='"+px(x2)+"' y2='"+py(y2)+"' class='prop-line'/>"+
      "<circle cx='"+px(0)+"' cy='"+py(item.b)+"' r='5.5' class='prop-intercept-dot'/>"+
      "<text x='"+(px(0)+8)+"' y='"+(py(item.b)-7)+"' class='prop-intercept-label'>(0, "+item.b+")</text>"+
      "<text x='"+(width-pad+5)+"' y='"+(xAxis+4)+"' class='prop-axis-label'>x</text>"+
      "<text x='"+(yAxis+6)+"' y='"+(pad-7)+"' class='prop-axis-label'>y</text>"+
      "</svg>";
  }

  function proportionalTableMarkup(item) {
    const rows=item.rows.map(row => "<tr><td>"+row[0]+"</td><td>"+row[1]+"</td></tr>").join("");
    return "<div class='prop-table-wrap"+(item.challenge?" is-challenge":"")+"'>"+
      (item.challenge?"<span class='prop-table-challenge'>x = 0 is not shown</span>":"")+
      "<table class='prop-sort-table'><thead><tr><th>x</th><th>y</th></tr></thead><tbody>"+rows+"</tbody></table></div>";
  }

  function proportionalItemContent(item) {
    if (item.type === "table") return proportionalTableMarkup(item);
    if (item.type === "graph") return proportionalGraphMarkup(item);
    if (item.type === "equation") return "<div class='prop-equation-display'>"+escapeHTML(item.text)+"</div>";
    return "<p class='prop-verbal-display'>"+escapeHTML(item.text)+"</p>";
  }

  function renderLab85F() {
    if (!labRuntime.data) labRuntime.data={index:0,choices:{},checked:false,solved:false};
    const data=labRuntime.data;
    const round=PROPORTIONAL_SORT_ROUNDS[data.index];
    if (!round) return showLabCompletion("8.5F");
    const body=$("#standardsLabBody");
    const completed=data.index+(data.solved?1:0);
    setLabProgress(completed,PROPORTIONAL_SORT_ROUNDS.length,"Question "+(data.index+1)+" of "+PROPORTIONAL_SORT_ROUNDS.length+": categorize all six representations.");

    const cards=round.items.map((item,index) => {
      const choice=data.choices[item.id]||"";
      const isWrong=data.checked && choice && choice!==item.answer;
      const isRight=data.checked && choice===item.answer;
      const tableCoach=isWrong && item.type==="table" ? "<div class='prop-table-coach'><strong>Table check:</strong> "+escapeHTML(item.tableNote)+"</div>" : "";
      return "<article class='prop-sort-card"+(isWrong?" is-wrong":"")+(isRight?" is-right":"")+"'>"+
        "<div class='prop-sort-card-top'><span class='prop-card-number'>"+(index+1)+"</span><div><small>"+escapeHTML(item.title)+"</small><strong>"+(item.type==="realworld"?"Real-world description":item.type==="verbal"?"Mathematical verbal description":item.type.charAt(0).toUpperCase()+item.type.slice(1))+"</strong></div></div>"+
        "<div class='prop-card-content'>"+proportionalItemContent(item)+"</div>"+
        tableCoach+
        "<div class='prop-choice-row' role='group' aria-label='Classify item "+(index+1)+"'>"+
          "<button type='button' data-prop-item='"+item.id+"' data-prop-choice='proportional' class='"+(choice==="proportional"?"is-selected":"")+"'>Proportional</button>"+
          "<button type='button' data-prop-item='"+item.id+"' data-prop-choice='non-proportional' class='"+(choice==="non-proportional"?"is-selected":"")+"'>Non-Proportional</button>"+
        "</div>"+
      "</article>";
    }).join("");

    body.innerHTML=
      "<section class='prop-sort-shell'>"+
        "<header class='prop-sort-header'><div><p class='lab-mini-title'>8.5F classification set</p><h4>"+escapeHTML(round.title)+"</h4><p>Sort each item from its mathematics. The category totals change from round to round.</p></div><span class='prop-round-count'>"+(data.index+1)+" / "+PROPORTIONAL_SORT_ROUNDS.length+"</span></header>"+
        "<div class='prop-sort-key'><span><i class='prop-key-origin'></i><strong>Proportional:</strong> y = kx</span><span><i class='prop-key-start'></i><strong>Non-Proportional:</strong> y = mx + b, b ≠ 0</span></div>"+
        "<div class='prop-sort-grid'>"+cards+"</div>"+
        "<div class='relation-submit-row'><button class='lab-action' id='checkPropSort' type='button'>Check all 6</button>"+
        (data.solved?"<button class='lab-next' id='nextPropSort' type='button'>"+(data.index===PROPORTIONAL_SORT_ROUNDS.length-1?"Finish lab →":"Next set →")+"</button>":"")+
        "</div>"+
      "</section>";

    body.querySelectorAll("[data-prop-choice]").forEach(button => button.addEventListener("click",() => {
      if (data.solved) return;
      data.choices[button.dataset.propItem]=button.dataset.propChoice;
      data.checked=false;
      renderLab85F();
      setLabFeedback(Object.keys(data.choices).length+" of 6 items categorized.");
    }));

    $("#checkPropSort").addEventListener("click",() => {
      if (Object.keys(data.choices).length<6) return setLabFeedback("Categorize all six items before checking.","incorrect");
      data.checked=true;
      const wrong=round.items.filter(item => data.choices[item.id]!==item.answer);
      if (wrong.length) {
        renderLab85F();
        const tableWrong=wrong.filter(item => item.type==="table").length;
        return setLabFeedback(wrong.length+" item"+(wrong.length===1?" needs":"s need")+" another look."+(tableWrong?" Use the table coaching only where a table was missed.":" Recheck the representation itself rather than the number of cards in each category."),"incorrect");
      }
      data.solved=true;
      renderLab85F();
      setLabFeedback("All six are correct. You classified the relationships from their structure instead of trying to balance the two categories.","correct");
    });

    const next=$("#nextPropSort");
    if (next) next.addEventListener("click",() => {
      if (data.index>=PROPORTIONAL_SORT_ROUNDS.length-1) return showLabCompletion("8.5F");
      data.index+=1;
      data.choices={};
      data.checked=false;
      data.solved=false;
      renderLab85F();
      syncWhiteboardQuestion();
      setLabFeedback("New set ready. The proportional/non-proportional split may be completely different this time.");
    });
  }


  const FUNCTION_DESCRIPTION_TASKS = [
    {
      type:"mapping", title:"Several inputs share one output", mapLabels:["INPUT","OUTPUT"],
      left:[-2,0,3,5], right:[4,9], links:[[0,0],[1,1],[2,1],[3,0]], isFunction:true,
      choices:[
        "The relation is a function because each input corresponds to exactly one output. More than one input may share the same output.",
        "The relation is not a function because an output corresponds to more than one input.",
        "The relation is a function because each output corresponds to exactly one input.",
        "The relation is not a function because there are more inputs than outputs."
      ], correct:0
    },
    {
      type:"graph", title:"Look vertically across the plotted points", graphKind:"points",
      points:[[-3,1],[-1,3],[2,1],[2,4],[4,-2]], isFunction:false,
      choices:[
        "The dependent variable is a function of the independent variable because every dependent value is different.",
        "The dependent variable is not a function of the independent variable because one independent value corresponds to more than one dependent value.",
        "The dependent variable is a function of the independent variable because two dependent values may use the same independent value.",
        "The dependent variable is not a function of the independent variable because some dependent values are positive and some are negative."
      ], correct:1
    },
    {
      type:"pairs", title:"Ordered pairs", pairs:[[-3,5],[0,2],[4,5],[7,-1]], isFunction:true,
      choices:[
        "y is not a function of x because the y-value 5 corresponds to more than one x-value.",
        "y is a function of x because each x-value corresponds to exactly one y-value, even though two x-values share y = 5.",
        "y is not a function of x because each y-value must correspond to only one x-value.",
        "y is a function of x because all x-values and y-values must be different."
      ], correct:1
    },
    {
      type:"table", title:"Independent and dependent values", headers:["Independent","Dependent"],
      rows:[[-2,6],[1,4],[2,5],[2,8],[5,1]], isFunction:false,
      choices:[
        "The dependent variable is not a function of the independent variable because the independent value 2 corresponds to two different dependent values.",
        "The dependent variable is a function of the independent variable because every dependent value appears only once.",
        "The dependent variable is a function of the independent variable because more than one dependent value may correspond to the same independent value.",
        "The dependent variable is not a function of the independent variable because there are five ordered pairs."
      ], correct:0
    },
    {
      type:"graph", title:"A horizontal relationship", graphKind:"horizontal", yValue:2, isFunction:true,
      choices:[
        "The relation is not a function because the same output corresponds to many different inputs.",
        "The relation is a function because every input corresponds to exactly one output. The same output may be paired with many inputs.",
        "The relation is not a function because every point has the same output.",
        "The relation is a function only because the graph is a straight line."
      ], correct:1
    }
  ];

  const FUNCTION_BUILD_TASKS = [
    {type:"table",title:"Table",headers:["Input","Output"],rows:[[-3,4],[0,1],[2,4],[5,7]],isFunction:true,vocab:["output","input"]},
    {type:"table",title:"Table",headers:["Independent","Dependent"],rows:[[-2,1],[1,3],[1,5],[4,7]],isFunction:false,vocab:["dependent value","independent value"]},
    {type:"mapping",title:"Mapping",mapLabels:["INPUT","OUTPUT"],left:[1,2,3,4],right:[8,9],links:[[0,0],[1,0],[2,1],[3,0]],isFunction:true,vocab:["output","input"]},
    {type:"mapping",title:"Mapping",mapLabels:["INDEPENDENT","DEPENDENT"],left:[-2,0,5],right:[1,4,7],links:[[0,0],[1,1],[1,2],[2,2]],isFunction:false,vocab:["dependent value","independent value"]},
    {type:"pairs",title:"Ordered pairs",pairs:[[-4,6],[-1,2],[3,6],[8,0]],isFunction:true,vocab:["y-value","x-value"]},
    {type:"pairs",title:"Ordered pairs",pairs:[[-2,5],[0,1],[3,4],[3,-1],[6,8]],isFunction:false,vocab:["y-value","x-value"]},
    {type:"graph",title:"Graph",graphKind:"line",m:.7,b:-1,isFunction:true,vocab:["dependent value","independent value"]},
    {type:"graph",title:"Graph",graphKind:"circle",isFunction:false,vocab:["y-value","x-value"]},
    {type:"graph",title:"Graph",graphKind:"horizontal",yValue:-2,isFunction:true,vocab:["output","input"]},
    {type:"graph",title:"Graph",graphKind:"sideways",isFunction:false,vocab:["output","input"]}
  ];

  function functionTableMarkup(item) {
    const headers=item.headers||["x","y"];
    const rows=item.rows.map(row=>"<tr><td>"+escapeHTML(row[0])+"</td><td>"+escapeHTML(row[1])+"</td></tr>").join("");
    return "<table class='function-table'><thead><tr><th>"+escapeHTML(headers[0])+"</th><th>"+escapeHTML(headers[1])+"</th></tr></thead><tbody>"+rows+"</tbody></table>";
  }

  function functionPairsMarkup(item) {
    return "<div class='function-pairs'>{" + item.pairs.map(pair=>"<span>("+escapeHTML(pair[0])+", "+escapeHTML(pair[1])+")</span>").join("") + "}</div>";
  }

  function functionMappingMarkup(item) {
    const width=390,height=230,leftX=105,rightX=285;
    const left=item.left||[], right=item.right||[];
    const maxCount=Math.max(left.length,right.length,2);
    const yFor=(index,count)=>55+(index*(130/Math.max(1,count-1)));
    const labels=item.mapLabels||["x","y"];
    const lines=(item.links||[]).map(link=>{
      const y1=yFor(link[0],left.length), y2=yFor(link[1],right.length);
      return "<line x1='"+(leftX+24)+"' y1='"+y1+"' x2='"+(rightX-24)+"' y2='"+y2+"' class='function-map-link'/>";
    }).join("");
    const leftText=left.map((value,index)=>"<text x='"+leftX+"' y='"+(yFor(index,left.length)+5)+"' text-anchor='middle' class='function-map-value'>"+escapeHTML(value)+"</text>").join("");
    const rightText=right.map((value,index)=>"<text x='"+rightX+"' y='"+(yFor(index,right.length)+5)+"' text-anchor='middle' class='function-map-value'>"+escapeHTML(value)+"</text>").join("");
    return "<svg class='function-map-svg' viewBox='0 0 "+width+" "+height+"' role='img' aria-label='Mapping diagram'>"+
      "<ellipse cx='"+leftX+"' cy='120' rx='65' ry='98' class='function-map-oval'/><ellipse cx='"+rightX+"' cy='120' rx='65' ry='98' class='function-map-oval'/>"+
      "<text x='"+leftX+"' y='23' text-anchor='middle' class='function-map-label'>"+escapeHTML(labels[0])+"</text><text x='"+rightX+"' y='23' text-anchor='middle' class='function-map-label'>"+escapeHTML(labels[1])+"</text>"+
      lines+leftText+rightText+"</svg>";
  }

  function functionGraphMarkup(item) {
    const width=340,height=250,pad=32,min=-5,max=5;
    const px=x=>pad+((x-min)/(max-min))*(width-pad*2);
    const py=y=>height-pad-((y-min)/(max-min))*(height-pad*2);
    let marks="";
    for(let n=-4;n<=4;n+=2){
      marks+="<line x1='"+px(n)+"' y1='"+pad+"' x2='"+px(n)+"' y2='"+(height-pad)+"' class='function-grid-line'/>";
      marks+="<line x1='"+pad+"' y1='"+py(n)+"' x2='"+(width-pad)+"' y2='"+py(n)+"' class='function-grid-line'/>";
    }
    marks+="<line x1='"+pad+"' y1='"+py(0)+"' x2='"+(width-pad)+"' y2='"+py(0)+"' class='function-axis'/>";
    marks+="<line x1='"+px(0)+"' y1='"+pad+"' x2='"+px(0)+"' y2='"+(height-pad)+"' class='function-axis'/>";
    if(item.graphKind==="points"){
      marks+=(item.points||[]).map(point=>"<circle cx='"+px(point[0])+"' cy='"+py(point[1])+"' r='5.5' class='function-graph-point'/>").join("");
    } else if(item.graphKind==="line"){
      const x1=-5,x2=5,y1=item.m*x1+item.b,y2=item.m*x2+item.b;
      marks+="<line x1='"+px(x1)+"' y1='"+py(y1)+"' x2='"+px(x2)+"' y2='"+py(y2)+"' class='function-graph-path'/>";
    } else if(item.graphKind==="horizontal"){
      marks+="<line x1='"+px(-5)+"' y1='"+py(item.yValue)+"' x2='"+px(5)+"' y2='"+py(item.yValue)+"' class='function-graph-path'/>";
    } else if(item.graphKind==="circle"){
      marks+="<circle cx='"+px(0)+"' cy='"+py(0)+"' r='"+(px(2.8)-px(0))+"' class='function-graph-shape'/>";
    } else if(item.graphKind==="sideways"){
      let points=[];
      for(let y=-3.3;y<=3.3;y+=.3){const x=(y*y)/2-2.2;points.push(px(x)+","+py(y));}
      marks+="<polyline points='"+points.join(" ")+"' class='function-graph-shape'/>";
    }
    marks+="<text x='"+(width-pad+7)+"' y='"+(py(0)+4)+"' class='function-axis-label'>x</text><text x='"+(px(0)+7)+"' y='"+(pad-8)+"' class='function-axis-label'>y</text>";
    return "<svg class='function-graph-svg' viewBox='0 0 "+width+" "+height+"' role='img' aria-label='Coordinate graph'>"+marks+"</svg>";
  }

  function functionRepresentationMarkup(item) {
    if(item.type==="table") return functionTableMarkup(item);
    if(item.type==="mapping") return functionMappingMarkup(item);
    if(item.type==="pairs") return functionPairsMarkup(item);
    return functionGraphMarkup(item);
  }

  function functionVocabulary(item) {
    const target=item.vocab ? item.vocab[0] : "output";
    const source=item.vocab ? item.vocab[1] : "input";
    return {target,source};
  }

  function resetFunctionTask(data) {
    data.selected=null;
    data.checked=false;
    data.solved=false;
    data.statement={status:"",source:"",count:""};
  }

  function renderFunctionDescriptionPart(data) {
    const task=FUNCTION_DESCRIPTION_TASKS[data.index];
    const body=$("#standardsLabBody");
    const choices=task.choices.map((choice,index)=>{
      const selected=data.selected===index;
      const wrong=data.checked && selected && index!==task.correct;
      const right=data.checked && selected && index===task.correct;
      return "<button type='button' data-function-description='"+index+"' class='function-description-choice"+(selected?" is-selected":"")+(wrong?" is-wrong":"")+(right?" is-right":"")+"'><span>"+String.fromCharCode(65+index)+"</span><strong>"+escapeHTML(choice)+"</strong></button>";
    }).join("");
    body.innerHTML="<section class='function-lab-shell'>"+
      "<header class='function-part-header'><div><p class='lab-mini-title'>Part 1 · Explain the relationship</p><h4>"+escapeHTML(task.title)+"</h4><p>Choose the statement that uses the definition of a function correctly.</p></div><span>Question "+(data.index+1)+" / 5</span></header>"+
      "<div class='function-focus-card'>"+functionRepresentationMarkup(task)+"</div>"+
      "<div class='function-language-reminder'><strong>Read the direction:</strong> input → output &nbsp; | &nbsp; independent → dependent &nbsp; | &nbsp; x → y</div>"+
      "<div class='function-description-list'>"+choices+"</div>"+
      "<div class='relation-submit-row'><button class='lab-action' id='checkFunctionDescription' type='button'>Check description</button>"+
      (data.solved?"<button class='lab-next' id='nextFunctionDescription' type='button'>"+(data.index===4?"Go to Part 2 →":"Next description →")+"</button>":"")+"</div></section>";

    body.querySelectorAll("[data-function-description]").forEach(button=>button.addEventListener("click",()=>{
      if(data.solved) return;
      data.selected=Number(button.dataset.functionDescription);
      data.checked=false;
      renderFunctionDescriptionPart(data);
    }));
    $("#checkFunctionDescription").addEventListener("click",()=>{
      if(data.selected===null) return setLabFeedback("Choose the verbal description that best explains the relation.","incorrect");
      data.checked=true;
      if(data.selected!==task.correct){
        renderFunctionDescriptionPart(data);
        return setLabFeedback("Trace from each input, x-value, or independent value to its output. Sharing an output is allowed; one input receiving two outputs is not.","incorrect");
      }
      data.solved=true;
      renderFunctionDescriptionPart(data);
      setLabFeedback(task.isFunction ? "Correct. Every input has exactly one output. Notice that different inputs may still share the same output." : "Correct. At least one input corresponds to more than one output, so the relation is not a function.","correct");
    });
    const next=$("#nextFunctionDescription");
    if(next) next.addEventListener("click",()=>{
      if(data.index===4){data.phase="build";data.index=0;} else data.index+=1;
      resetFunctionTask(data);
      renderLab85G();
      syncWhiteboardQuestion();
      setLabFeedback(data.phase==="build"?"Part 2: now build the explanation yourself.":"New verbal-description question ready.");
    });
  }

  function renderFunctionBuildPart(data) {
    const task=FUNCTION_BUILD_TASKS[data.index];
    const words=functionVocabulary(task);
    const body=$("#standardsLabBody");
    const s=data.statement||{status:"",source:"",count:""};
    const targetPhrase=words.target;
    const sourcePhrase=words.source;
    body.innerHTML="<section class='function-lab-shell'>"+
      "<header class='function-part-header'><div><p class='lab-mini-title'>Part 2 · Build the statement</p><h4>"+escapeHTML(task.title)+"</h4><p>Study the representation, then complete the explanation with the dropdowns.</p></div><span>Question "+(data.index+1)+" / 10</span></header>"+
      "<div class='function-focus-card'>"+functionRepresentationMarkup(task)+"</div>"+
      "<div class='function-statement-builder'>"+
        "<span>The relationship</span>"+
        "<select data-function-statement='status'><option value=''>choose...</option><option value='does'"+(s.status==="does"?" selected":"")+">does</option><option value='does-not'"+(s.status==="does-not"?" selected":"")+">does not</option></select>"+
        "<span>represent the "+escapeHTML(targetPhrase)+" as a function of the "+escapeHTML(sourcePhrase)+" because</span>"+
        "<select data-function-statement='source'><option value=''>choose...</option><option value='each'"+(s.source==="each"?" selected":"")+">each "+escapeHTML(sourcePhrase)+"</option><option value='atleast'"+(s.source==="atleast"?" selected":"")+">at least one "+escapeHTML(sourcePhrase)+"</option></select>"+
        "<span>corresponds to</span>"+
        "<select data-function-statement='count'><option value=''>choose...</option><option value='one'"+(s.count==="one"?" selected":"")+">only one "+escapeHTML(targetPhrase)+"</option><option value='more'"+(s.count==="more"?" selected":"")+">more than one "+escapeHTML(targetPhrase)+"</option></select><span>.</span>"+
      "</div>"+
      "<div class='function-concept-note'>A function controls how many outputs one input may have. It does <strong>not</strong> require every output to belong to only one input.</div>"+
      "<div class='relation-submit-row'><button class='lab-action' id='checkFunctionStatement' type='button'>Check my statement</button>"+
      (data.solved?"<button class='lab-next' id='nextFunctionStatement' type='button'>"+(data.index===9?"Finish lab →":"Next representation →")+"</button>":"")+"</div></section>";

    body.querySelectorAll("[data-function-statement]").forEach(select=>select.addEventListener("change",()=>{
      data.statement[select.dataset.functionStatement]=select.value;
      data.checked=false;
    }));
    $("#checkFunctionStatement").addEventListener("click",()=>{
      body.querySelectorAll("[data-function-statement]").forEach(select=>{data.statement[select.dataset.functionStatement]=select.value;});
      const expected=task.isFunction ? {status:"does",source:"each",count:"one"} : {status:"does-not",source:"atleast",count:"more"};
      if(!data.statement.status || !data.statement.source || !data.statement.count) return setLabFeedback("Complete all three dropdowns before checking your statement.","incorrect");
      if(data.statement.status!==expected.status || data.statement.source!==expected.source || data.statement.count!==expected.count){
        data.checked=true;
        return setLabFeedback("Recheck the direction from the input/independent/x side. Ask whether any single source value points to two different output/dependent/y values.","incorrect");
      }
      data.solved=true;
      renderFunctionBuildPart(data);
      setLabFeedback(task.isFunction ? "Correct. Each source value has only one corresponding target value. Repeated target values are allowed." : "Correct. At least one source value has more than one corresponding target value, so this relation is not a function.","correct");
    });
    const next=$("#nextFunctionStatement");
    if(next) next.addEventListener("click",()=>{
      if(data.index===9) return showLabCompletion("8.5G");
      data.index+=1;
      resetFunctionTask(data);
      renderLab85G();
      syncWhiteboardQuestion();
      setLabFeedback("New representation ready. Build a complete function statement.");
    });
  }

  function renderLab85G() {
    if(!labRuntime.data) labRuntime.data={phase:"description",index:0,selected:null,checked:false,solved:false,statement:{status:"",source:"",count:""}};
    const data=labRuntime.data;
    const done=data.phase==="description" ? data.index+(data.solved?1:0) : 5+data.index+(data.solved?1:0);
    const instruction=data.phase==="description" ? "Part 1: choose the correct verbal explanation." : "Part 2: build the explanation from dropdown statements.";
    setLabProgress(done,15,instruction);
    if(data.phase==="description") renderFunctionDescriptionPart(data); else renderFunctionBuildPart(data);
  }


  const WHICH_DOES_NOT_BELONG_TASKS = [
    {
      title:"All Tables · Find the proportional relationship", target:"proportional",
      cards:[
        {type:"table",label:"A",rows:[[1,5],[2,8],[4,14],[6,20]],kind:"non-proportional",reason:"This table follows y = 3x + 2, so the starting value is 2."},
        {type:"table",label:"B",rows:[[2,7],[4,11],[6,15],[8,19]],kind:"non-proportional",reason:"This table follows y = 2x + 3, so it is non-proportional."},
        {type:"table",label:"C",rows:[[1,4],[3,12],[5,20],[7,28]],kind:"proportional",reason:"The ratio y/x is always 4, so y = 4x."},
        {type:"table",label:"D",rows:[[2,-1],[4,-5],[6,-9],[8,-13]],kind:"non-proportional",reason:"This table follows y = -2x + 3, not y = kx."}
      ],correct:2
    },
    {
      title:"All Tables · Find the non-proportional relationship", target:"non-proportional",
      cards:[
        {type:"table",label:"A",rows:[[2,5],[4,10],[6,15],[10,25]],kind:"proportional",reason:"The ratio y/x is always 2.5."},
        {type:"table",label:"B",rows:[[1,-3],[2,-6],[4,-12],[7,-21]],kind:"proportional",reason:"The ratio y/x is always -3."},
        {type:"table",label:"C",rows:[[3,6],[5,10],[8,16],[11,22]],kind:"proportional",reason:"The ratio y/x is always 2."},
        {type:"table",label:"D",rows:[[2,8],[5,17],[8,26],[11,35]],kind:"non-proportional",reason:"The rate is constant, but the table follows y = 3x + 2, so the ratio y/x is not constant."}
      ],correct:3
    },
    {
      title:"All Graphs · Find the proportional relationship", target:"proportional",
      cards:[
        {type:"graph",label:"A",m:.8,b:2,kind:"non-proportional",reason:"The line crosses the y-axis at 2 instead of the origin."},
        {type:"graph",label:"B",m:-.6,b:0,kind:"proportional",reason:"The line passes through (0, 0)."},
        {type:"graph",label:"C",m:1.1,b:-2,kind:"non-proportional",reason:"The line has a nonzero y-intercept."},
        {type:"graph",label:"D",m:-.45,b:3,kind:"non-proportional",reason:"The line does not pass through the origin."}
      ],correct:1
    },
    {
      title:"All Graphs · Find the non-proportional relationship", target:"non-proportional",
      cards:[
        {type:"graph",label:"A",m:.5,b:0,kind:"proportional",reason:"The line passes through the origin."},
        {type:"graph",label:"B",m:-.8,b:0,kind:"proportional",reason:"A negative slope can still be proportional when the line passes through (0, 0)."},
        {type:"graph",label:"C",m:1.2,b:0,kind:"proportional",reason:"The line passes through the origin."},
        {type:"graph",label:"D",m:.65,b:-3,kind:"non-proportional",reason:"The line crosses the y-axis at -3."}
      ],correct:3
    },
    {
      title:"All Situations · Find the proportional relationship", target:"proportional",
      cards:[
        {type:"situation",label:"A",text:"A gym charges a $25 registration fee plus $18 for each month.",kind:"non-proportional",reason:"The $25 starting fee creates a nonzero initial value."},
        {type:"situation",label:"B",text:"A delivery company charges $4 to begin an order plus $1.50 per mile.",kind:"non-proportional",reason:"The $4 starting charge makes the relationship non-proportional."},
        {type:"situation",label:"C",text:"A faucet fills a tank at 6 gallons per minute when the tank begins empty.",kind:"proportional",reason:"There is no starting amount, so gallons = 6 × minutes."},
        {type:"situation",label:"D",text:"A phone plan costs $15 each month plus $3 for every gigabyte used.",kind:"non-proportional",reason:"The $15 monthly fee is a nonzero starting value."}
      ],correct:2
    },
    {
      title:"All Situations · Find the non-proportional relationship", target:"non-proportional",
      cards:[
        {type:"situation",label:"A",text:"A worker earns $14 for every hour worked with no starting bonus.",kind:"proportional",reason:"Earnings start at $0 and increase by $14 per hour."},
        {type:"situation",label:"B",text:"Each barrel contains 42 gallons of water. The total water depends on the number of barrels.",kind:"proportional",reason:"Total gallons = 42 × barrels."},
        {type:"situation",label:"C",text:"A puppy weighs 8 pounds at the start and gains 2 pounds each week.",kind:"non-proportional",reason:"The puppy already weighs 8 pounds when time is 0."},
        {type:"situation",label:"D",text:"Bananas cost $0.65 per pound with no additional charge.",kind:"proportional",reason:"Cost = 0.65 × pounds."}
      ],correct:2
    },
    {
      title:"All Equations · Find the proportional relationship", target:"proportional",
      cards:[
        {type:"equation",label:"A",text:"y = 4x + 3",kind:"non-proportional",reason:"The equation has b = 3."},
        {type:"equation",label:"B",text:"y = -2x - 5",kind:"non-proportional",reason:"The equation has b = -5."},
        {type:"equation",label:"C",text:"y = (3/4)x",kind:"proportional",reason:"The equation is exactly in the form y = kx."},
        {type:"equation",label:"D",text:"y = 7 - x",kind:"non-proportional",reason:"Rewritten as y = -x + 7, it has a nonzero intercept."}
      ],correct:2
    },
    {
      title:"All Equations · Find the non-proportional relationship", target:"non-proportional",
      cards:[
        {type:"equation",label:"A",text:"y = 5x",kind:"proportional",reason:"This is y = kx."},
        {type:"equation",label:"B",text:"y = -0.4x",kind:"proportional",reason:"This is y = kx."},
        {type:"equation",label:"C",text:"y = x/6",kind:"proportional",reason:"This is y = (1/6)x."},
        {type:"equation",label:"D",text:"y = 2(x + 3)",kind:"non-proportional",reason:"Expanding gives y = 2x + 6, so b ≠ 0."}
      ],correct:3
    },
    {
      title:"Mixed Round 1 · Which does not belong?", target:"non-proportional",
      cards:[
        {type:"table",label:"A",rows:[[1,3],[2,6],[5,15],[7,21]],kind:"proportional",reason:"The ratio y/x is always 3."},
        {type:"graph",label:"B",m:-.7,b:0,kind:"proportional",reason:"The graph passes through the origin."},
        {type:"equation",label:"C",text:"y = 1.5x + 4",kind:"non-proportional",reason:"The equation has a starting value of 4."},
        {type:"situation",label:"D",text:"Movie tickets cost $9 each with no service fee.",kind:"proportional",reason:"Cost = 9 × tickets."}
      ],correct:2
    },
    {
      title:"Mixed Round 2 · Which does not belong?", target:"proportional",
      cards:[
        {type:"table",label:"A",rows:[[1,4],[3,8],[5,12],[7,16]],kind:"non-proportional",reason:"This follows y = 2x + 2."},
        {type:"graph",label:"B",m:.6,b:-2,kind:"non-proportional",reason:"The graph misses the origin."},
        {type:"equation",label:"C",text:"y = -4x",kind:"proportional",reason:"The equation is y = kx."},
        {type:"situation",label:"D",text:"A rental costs $12 plus $5 for each hour used.",kind:"non-proportional",reason:"The $12 initial fee makes it non-proportional."}
      ],correct:2
    },
    {
      title:"Mixed Round 3 · Which does not belong?", target:"non-proportional",
      cards:[
        {type:"table",label:"A",rows:[[2,-6],[4,-12],[7,-21],[10,-30]],kind:"proportional",reason:"The ratio y/x is always -3."},
        {type:"graph",label:"B",m:.9,b:0,kind:"proportional",reason:"The graph passes through the origin."},
        {type:"equation",label:"C",text:"y = x/5",kind:"proportional",reason:"The equation is y = kx."},
        {type:"situation",label:"D",text:"A savings account already has $40 and then increases by $8 each week.",kind:"non-proportional",reason:"The account starts at $40."}
      ],correct:3
    },
    {
      title:"Mixed Round 4 · Which does not belong?", target:"proportional",
      cards:[
        {type:"table",label:"A",rows:[[2,9],[4,15],[6,21],[8,27]],kind:"non-proportional",reason:"This follows y = 3x + 3."},
        {type:"graph",label:"B",m:-.5,b:4,kind:"non-proportional",reason:"The y-intercept is 4."},
        {type:"equation",label:"C",text:"y = 6x - 1",kind:"non-proportional",reason:"The equation has b = -1."},
        {type:"situation",label:"D",text:"A printer produces 28 pages per minute starting from 0 pages.",kind:"proportional",reason:"Pages = 28 × minutes."}
      ],correct:3
    },
    {
      title:"Mixed Round 5 · Which does not belong?", target:"non-proportional",
      cards:[
        {type:"table",label:"A",rows:[[3,1.5],[6,3],[10,5],[14,7]],kind:"proportional",reason:"The ratio y/x is always 0.5."},
        {type:"graph",label:"B",m:-1.1,b:2,kind:"non-proportional",reason:"The graph crosses the y-axis at 2."},
        {type:"equation",label:"C",text:"y = -2.25x",kind:"proportional",reason:"The equation is y = kx."},
        {type:"situation",label:"D",text:"A car travels 55 miles each hour starting at 0 miles.",kind:"proportional",reason:"Distance = 55 × hours."}
      ],correct:1
    },
    {
      title:"Mixed Round 6 · Which does not belong?", target:"proportional",
      cards:[
        {type:"table",label:"A",rows:[[1,6],[3,10],[5,14],[8,20]],kind:"non-proportional",reason:"This follows y = 2x + 4."},
        {type:"graph",label:"B",m:.4,b:3,kind:"non-proportional",reason:"The graph has a y-intercept of 3."},
        {type:"equation",label:"C",text:"y = -(2/3)x",kind:"proportional",reason:"The equation is y = kx."},
        {type:"situation",label:"D",text:"A club charges $30 to join and $7 for each event attended.",kind:"non-proportional",reason:"The $30 joining fee is a starting value."}
      ],correct:2
    },
    {
      title:"Mixed Round 7 · Final challenge", target:"non-proportional",
      cards:[
        {type:"table",label:"A",rows:[[2,7],[4,14],[8,28],[10,35]],kind:"proportional",reason:"The ratio y/x is always 3.5."},
        {type:"graph",label:"B",m:.75,b:0,kind:"proportional",reason:"The graph passes through the origin."},
        {type:"equation",label:"C",text:"y = 9x",kind:"proportional",reason:"The equation is y = kx."},
        {type:"situation",label:"D",text:"A coupon reduces the total purchase price by $5 after the item costs are calculated.",kind:"non-proportional",reason:"Subtracting a fixed $5 creates a nonzero intercept."}
      ],correct:3
    }
  ];

  function wdbTableMarkup(card){
    const rows=card.rows.map(row=>"<tr><td>"+escapeHTML(row[0])+"</td><td>"+escapeHTML(row[1])+"</td></tr>").join("");
    return "<table class='wdb-table'><thead><tr><th>x</th><th>y</th></tr></thead><tbody>"+rows+"</tbody></table>";
  }

  function wdbGraphMarkup(card){
    const width=310,height=220,pad=30,min=-5,max=5;
    const px=x=>pad+((x-min)/(max-min))*(width-pad*2);
    const py=y=>height-pad-((y-min)/(max-min))*(height-pad*2);
    let marks="";
    for(let n=-4;n<=4;n+=2){
      marks+="<line x1='"+px(n)+"' y1='"+pad+"' x2='"+px(n)+"' y2='"+(height-pad)+"' class='wdb-grid'/>";
      marks+="<line x1='"+pad+"' y1='"+py(n)+"' x2='"+(width-pad)+"' y2='"+py(n)+"' class='wdb-grid'/>";
    }
    marks+="<line x1='"+pad+"' y1='"+py(0)+"' x2='"+(width-pad)+"' y2='"+py(0)+"' class='wdb-axis'/>";
    marks+="<line x1='"+px(0)+"' y1='"+pad+"' x2='"+px(0)+"' y2='"+(height-pad)+"' class='wdb-axis'/>";
    const x1=-5,x2=5,y1=card.m*x1+card.b,y2=card.m*x2+card.b;
    marks+="<line x1='"+px(x1)+"' y1='"+py(y1)+"' x2='"+px(x2)+"' y2='"+py(y2)+"' class='wdb-line'/>";
    marks+="<circle cx='"+px(0)+"' cy='"+py(card.b)+"' r='4.8' class='wdb-y-dot'/>";
    marks+="<text x='"+(width-pad+5)+"' y='"+(py(0)+4)+"' class='wdb-axis-label'>x</text><text x='"+(px(0)+6)+"' y='"+(pad-7)+"' class='wdb-axis-label'>y</text>";
    return "<svg class='wdb-graph' viewBox='0 0 "+width+" "+height+"' role='img' aria-label='Linear graph'>"+marks+"</svg>";
  }

  function wdbCardContent(card){
    if(card.type==="table") return wdbTableMarkup(card);
    if(card.type==="graph") return wdbGraphMarkup(card);
    if(card.type==="equation") return "<div class='wdb-equation'>"+escapeHTML(card.text)+"</div>";
    return "<p class='wdb-situation'>"+escapeHTML(card.text)+"</p>";
  }

  function resetWdbTask(data){
    data.selected=null;
    data.checked=false;
    data.solved=false;
  }

  function renderLab85H(){
    if(!labRuntime.data) labRuntime.data={index:0,selected:null,checked:false,solved:false};
    const data=labRuntime.data;
    const task=WHICH_DOES_NOT_BELONG_TASKS[data.index];
    if(!task) return showLabCompletion("8.5H");
    const body=$("#standardsLabBody");
    const completed=data.index+(data.solved?1:0);
    setLabProgress(completed,WHICH_DOES_NOT_BELONG_TASKS.length,"Round "+(data.index+1)+" of "+WHICH_DOES_NOT_BELONG_TASKS.length+": find the one relationship that does not belong.");

    const cards=task.cards.map((card,index)=>{
      const selected=data.selected===index;
      const wrong=data.checked && selected && index!==task.correct;
      const right=data.checked && selected && index===task.correct;
      const reveal=data.solved ? "<div class='wdb-reason'><strong>"+(card.kind==="proportional"?"Proportional":"Non-Proportional")+"</strong><span>"+escapeHTML(card.reason)+"</span></div>" : "";
      return "<button type='button' class='wdb-card"+(selected?" is-selected":"")+(wrong?" is-wrong":"")+(right?" is-right":"")+"' data-wdb-choice='"+index+"'>"+
        "<div class='wdb-card-head'><span>"+escapeHTML(card.label)+"</span><strong>"+(card.type==="situation"?"Real-world situation":card.type.charAt(0).toUpperCase()+card.type.slice(1))+"</strong></div>"+
        "<div class='wdb-card-body'>"+wdbCardContent(card)+"</div>"+reveal+
      "</button>";
    }).join("");

    const threeKind=task.target==="proportional" ? "non-proportional" : "proportional";
    body.innerHTML="<section class='wdb-shell'>"+
      "<header class='wdb-header'><div><p class='lab-mini-title'>Which Does Not Belong?</p><h4>"+escapeHTML(task.title)+"</h4><p>Three relationships are <strong>"+threeKind+"</strong>. Select the one that is <strong>"+task.target+"</strong>.</p></div><span>Round "+(data.index+1)+" / 15</span></header>"+
      "<div class='wdb-reminder'><strong>Compare the mathematics, not the card type.</strong> Proportional: constant ratio · graph through (0, 0) · y = kx · no starting amount.</div>"+
      "<div class='wdb-grid-cards'>"+cards+"</div>"+
      "<div class='relation-submit-row'><button class='lab-action' id='checkWdb' type='button'>Check my choice</button>"+
      (data.solved?"<button class='lab-next' id='nextWdb' type='button'>"+(data.index===WHICH_DOES_NOT_BELONG_TASKS.length-1?"Finish game →":"Next round →")+"</button>":"")+
      "</div></section>";

    body.querySelectorAll("[data-wdb-choice]").forEach(button=>button.addEventListener("click",()=>{
      if(data.solved) return;
      data.selected=Number(button.dataset.wdbChoice);
      data.checked=false;
      renderLab85H();
    }));
    $("#checkWdb").addEventListener("click",()=>{
      if(data.selected===null) return setLabFeedback("Select the relationship that does not belong with the other three.","incorrect");
      data.checked=true;
      if(data.selected!==task.correct){
        renderLab85H();
        return setLabFeedback("Not yet. Determine whether each card has a zero starting value. For tables, compare y/x; for graphs, check the origin; for equations, look for y = kx; for situations, look for a starting fee or amount.","incorrect");
      }
      data.solved=true;
      renderLab85H();
      const odd=task.cards[task.correct];
      setLabFeedback("Correct. Card "+odd.label+" is "+odd.kind+" while the other three are "+threeKind+". "+odd.reason,"correct");
    });
    const next=$("#nextWdb");
    if(next) next.addEventListener("click",()=>{
      if(data.index===WHICH_DOES_NOT_BELONG_TASKS.length-1) return showLabCompletion("8.5H");
      data.index+=1;
      resetWdbTask(data);
      renderLab85H();
      syncWhiteboardQuestion();
      setLabFeedback("New round ready. The odd card may be proportional or non-proportional.");
    });
  }


  const EQUATION_WRITING_TASKS = [
    {
      type:"situation", title:"Music lessons",
      text:"A music teacher charges a one-time registration fee of $24 and then charges $18 for each lesson.",
      xLabel:"number of lessons", yLabel:"total cost ($)", m:18, b:24,
      slopeMeaning:"$18 per lesson", interceptMeaning:"$24 before any lessons are taken"
    },
    {
      type:"situation", title:"Water tank",
      text:"A water tank contains 275 gallons at the beginning. The amount of water decreases by 15 gallons each week.",
      xLabel:"weeks", yLabel:"gallons of water", m:-15, b:275,
      slopeMeaning:"−15 gallons per week", interceptMeaning:"275 gallons at week 0"
    },
    {
      type:"situation", title:"Cookie delivery",
      text:"A bakery charges a $5 delivery fee and $1.25 for each cookie delivered.",
      xLabel:"number of cookies", yLabel:"total delivery charge ($)", m:1.25, b:5,
      slopeMeaning:"$1.25 per cookie", interceptMeaning:"$5 delivery fee"
    },
    {
      type:"pairs", title:"Ordered pairs",
      pairs:[[-2,7],[4,19]], xLabel:"x", yLabel:"y", m:2, b:11,
      slopeMeaning:"y increases by 2 for every increase of 1 in x", interceptMeaning:"11"
    },
    {
      type:"pairs", title:"Ordered pairs with a fractional rate",
      pairs:[[3,1],[9,-8]], xLabel:"x", yLabel:"y", m:-1.5, b:5.5,
      slopeMeaning:"−3/2", interceptMeaning:"11/2"
    },
    {
      type:"pairs", title:"Ordered pairs with a negative intercept",
      pairs:[[2,-1],[6,5]], xLabel:"x", yLabel:"y", m:1.5, b:-4,
      slopeMeaning:"3/2", interceptMeaning:"−4"
    },
    {
      type:"storypoints", title:"Driving pay",
      text:"Rhonda is paid according to the number of miles she drives. In July, she drove 640 miles and was paid $3,502. In August, she drove 820 miles and was paid $3,601.",
      pointLabels:["(640, 3502)","(820, 3601)"], xLabel:"miles driven", yLabel:"total pay ($)", m:.55, b:3150,
      slopeMeaning:"$0.55 per mile", interceptMeaning:"$3,150 base pay"
    },
    {
      type:"storypoints", title:"Bakery delivery totals",
      text:"A bakery charges a linear total for cookie deliveries. Delivering 12 cookies costs $20.00, while delivering 18 cookies costs $27.50.",
      pointLabels:["(12, 20)","(18, 27.5)"], xLabel:"cookies", yLabel:"total charge ($)", m:1.25, b:5,
      slopeMeaning:"$1.25 per cookie", interceptMeaning:"$5 starting delivery charge"
    },
    {
      type:"storypoints", title:"Taxi fare",
      text:"A taxi fare changes linearly with miles traveled. A 5-mile ride costs $13.50, and a 14-mile ride costs $33.30.",
      pointLabels:["(5, 13.5)","(14, 33.3)"], xLabel:"miles", yLabel:"fare ($)", m:2.2, b:2.5,
      slopeMeaning:"$2.20 per mile", interceptMeaning:"$2.50 starting fare"
    },
    {
      type:"graph", title:"Graph",
      m:1.5, b:2, xLabel:"x", yLabel:"y",
      slopeMeaning:"3/2", interceptMeaning:"2"
    },
    {
      type:"graph", title:"Graph",
      m:-.5, b:3, xLabel:"x", yLabel:"y",
      slopeMeaning:"−1/2", interceptMeaning:"3"
    },
    {
      type:"graph", title:"Graph",
      m:2, b:-4, xLabel:"x", yLabel:"y",
      slopeMeaning:"2", interceptMeaning:"−4"
    },
    {
      type:"table", title:"Table",
      rows:[[-4,-1],[4,5],[8,8],[12,11]], xLabel:"x", yLabel:"y", m:.75, b:2,
      slopeMeaning:"3/4", interceptMeaning:"2"
    },
    {
      type:"table", title:"Car rental charge",
      rows:[[5,30.5],[10,31],[15,31.5],[20,32]], xLabel:"miles driven", yLabel:"total charged ($)", m:.1, b:30,
      slopeMeaning:"$0.10 per mile", interceptMeaning:"$30 base charge"
    },
    {
      type:"table", title:"Concert tickets remaining",
      rows:[[1,9000],[2,6000],[3,3000],[4,0]], xLabel:"hours since sales began", yLabel:"tickets remaining", m:-3000, b:12000,
      slopeMeaning:"−3,000 tickets per hour", interceptMeaning:"12,000 tickets at time 0"
    }
  ];

  function equationLabNear(value,expected){
    const parsed=parseRelationNumber(value);
    return Number.isFinite(parsed) && Math.abs(parsed-expected)<.001;
  }

  function equationLabNumber(value){
    const rounded=Math.round((Number(value)+Number.EPSILON)*1000)/1000;
    return Math.abs(rounded)<.0001 ? 0 : rounded;
  }

  function equationLabEquationPreview(m,b){
    if(!Number.isFinite(m)||!Number.isFinite(b)) return "y = mx + b";
    const mText=equationLabNumber(m);
    if(b===0) return "y = "+mText+"x";
    return "y = "+mText+"x "+(b<0?"− ":"+ ")+Math.abs(equationLabNumber(b));
  }

  function equationLabTableMarkup(task){
    const rows=task.rows.map(row=>"<tr><td>"+escapeHTML(row[0])+"</td><td>"+escapeHTML(row[1])+"</td></tr>").join("");
    return "<div class='eqwrite-table-wrap'><table class='eqwrite-table'><thead><tr><th>x<br><small>"+escapeHTML(task.xLabel)+"</small></th><th>y<br><small>"+escapeHTML(task.yLabel)+"</small></th></tr></thead><tbody>"+rows+"</tbody></table></div>";
  }

  function equationLabPairsMarkup(task){
    return "<div class='eqwrite-pairs'>{"+task.pairs.map(pair=>"<span>("+escapeHTML(pair[0])+", "+escapeHTML(pair[1])+")</span>").join("")+"}</div>";
  }

  function equationLabGraphMarkup(task){
    const width=420,height=310,pad=38,min=-6,max=6;
    const px=x=>pad+((x-min)/(max-min))*(width-pad*2);
    const py=y=>height-pad-((y-min)/(max-min))*(height-pad*2);
    let marks="";
    for(let n=-5;n<=5;n++){
      marks+="<line x1='"+px(n)+"' y1='"+pad+"' x2='"+px(n)+"' y2='"+(height-pad)+"' class='eqwrite-grid'/>";
      marks+="<line x1='"+pad+"' y1='"+py(n)+"' x2='"+(width-pad)+"' y2='"+py(n)+"' class='eqwrite-grid'/>";
      if(n!==0){
        marks+="<text x='"+px(n)+"' y='"+(py(0)+16)+"' text-anchor='middle' class='eqwrite-tick'>"+n+"</text>";
        marks+="<text x='"+(px(0)-8)+"' y='"+(py(n)+4)+"' text-anchor='end' class='eqwrite-tick'>"+n+"</text>";
      }
    }
    marks+="<line x1='"+pad+"' y1='"+py(0)+"' x2='"+(width-pad)+"' y2='"+py(0)+"' class='eqwrite-axis'/>";
    marks+="<line x1='"+px(0)+"' y1='"+pad+"' x2='"+px(0)+"' y2='"+(height-pad)+"' class='eqwrite-axis'/>";
    const x1=-6,x2=6,y1=task.m*x1+task.b,y2=task.m*x2+task.b;
    marks+="<line x1='"+px(x1)+"' y1='"+py(y1)+"' x2='"+px(x2)+"' y2='"+py(y2)+"' class='eqwrite-line'/>";
    const qualityXs=[-4,-2,0,2,4].filter(x=>{const y=task.m*x+task.b;return y>=min&&y<=max;}).slice(0,3);
    marks+=qualityXs.map(x=>"<circle cx='"+px(x)+"' cy='"+py(task.m*x+task.b)+"' r='4.5' class='eqwrite-point'/>").join("");
    marks+="<text x='"+(width-pad+8)+"' y='"+(py(0)+4)+"' class='eqwrite-axis-label'>x</text><text x='"+(px(0)+8)+"' y='"+(pad-10)+"' class='eqwrite-axis-label'>y</text>";
    return "<svg class='eqwrite-graph' viewBox='0 0 "+width+" "+height+"' role='img' aria-label='Coordinate graph of a linear relationship'>"+marks+"</svg>";
  }

  function equationLabRepresentation(task){
    if(task.type==="table") return equationLabTableMarkup(task);
    if(task.type==="pairs") return equationLabPairsMarkup(task);
    if(task.type==="graph") return equationLabGraphMarkup(task);
    if(task.type==="storypoints"){
      return "<div class='eqwrite-story'><p>"+escapeHTML(task.text)+"</p><div class='eqwrite-implied-points'><span>Think of the information as coordinate points:</span>"+task.pointLabels.map(point=>"<strong>"+escapeHTML(point)+"</strong>").join("")+"</div></div>";
    }
    return "<div class='eqwrite-story'><p>"+escapeHTML(task.text)+"</p></div>";
  }

  function resetEquationWritingTask(data){
    data.responses={};
    data.checked=false;
    data.solved=false;
  }

  function renderLab85I(){
    if(!labRuntime.data) labRuntime.data={index:0,responses:{},checked:false,solved:false};
    const data=labRuntime.data;
    const task=EQUATION_WRITING_TASKS[data.index];
    if(!task) return showLabCompletion("8.5I");
    const r=data.responses||(data.responses={});
    const body=$("#standardsLabBody");
    const completed=data.index+(data.solved?1:0);
    setLabProgress(completed,EQUATION_WRITING_TASKS.length,"Problem "+(data.index+1)+" of "+EQUATION_WRITING_TASKS.length+": find m, find b, then write y = mx + b.");

    const previewM=parseRelationNumber(r.eqM);
    const previewB=parseRelationNumber(r.eqB);
    const typeLabel=task.type==="storypoints"?"Real-world coordinate information":task.type==="pairs"?"Coordinate pairs":task.type==="situation"?"Verbal situation":task.type.charAt(0).toUpperCase()+task.type.slice(1);

    body.innerHTML="<section class='eqwrite-shell'>"+
      "<header class='eqwrite-header'><div><p class='lab-mini-title'>8.5I · Write the equation</p><h4>"+escapeHTML(task.title)+"</h4><p>"+escapeHTML(typeLabel)+"</p></div><span>Problem "+(data.index+1)+" / "+EQUATION_WRITING_TASKS.length+"</span></header>"+
      "<div class='eqwrite-layout'>"+
        "<section class='eqwrite-representation'><div class='eqwrite-rep-label'>Study the representation</div>"+equationLabRepresentation(task)+"</section>"+
        "<section class='eqwrite-work'>"+
          "<div class='eqwrite-step'><span>1</span><div><h5>Find the slope</h5><p>What is the rate of change?</p><label>m = <input data-eqwrite='m' value='"+escapeHTML(r.m||"")+"' inputmode='decimal' placeholder='slope'></label></div></div>"+
          "<div class='eqwrite-step'><span>2</span><div><h5>Find the y-intercept</h5><p>What is the value of y when x = 0?</p><label>b = <input data-eqwrite='b' value='"+escapeHTML(r.b||"")+"' inputmode='decimal' placeholder='y-intercept'></label></div></div>"+
          "<div class='eqwrite-step is-equation'><span>3</span><div><h5>Write y = mx + b</h5><div class='eqwrite-equation-builder'><strong>y =</strong><input data-eqwrite='eqM' value='"+escapeHTML(r.eqM||"")+"' inputmode='decimal' aria-label='slope in equation'><strong>x +</strong><input data-eqwrite='eqB' value='"+escapeHTML(r.eqB||"")+"' inputmode='decimal' aria-label='y-intercept in equation'></div><div class='eqwrite-preview'>"+escapeHTML(equationLabEquationPreview(previewM,previewB))+"</div></div></div>"+
        "</section>"+
      "</div>"+
      (task.type==="storypoints"?"<div class='eqwrite-hintbar'><strong>These situations do not hand you m or b.</strong> Use the two implied coordinate points to calculate slope first, then substitute one point into y = mx + b to solve for b.</div>":"")+
      "<div class='relation-submit-row'><button class='lab-action' id='checkEqWrite' type='button'>Check my equation</button>"+
      (data.solved?"<button class='lab-next' id='nextEqWrite' type='button'>"+(data.index===EQUATION_WRITING_TASKS.length-1?"Finish lab →":"Next problem →")+"</button>":"")+
      "</div></section>";

    body.querySelectorAll("[data-eqwrite]").forEach(input=>{
      input.addEventListener("input",()=>{
        data.responses[input.dataset.eqwrite]=input.value;
        if(input.dataset.eqwrite==="eqM"||input.dataset.eqwrite==="eqB"){
          const preview=body.querySelector(".eqwrite-preview");
          if(preview) preview.textContent=equationLabEquationPreview(parseRelationNumber(data.responses.eqM),parseRelationNumber(data.responses.eqB));
        }
      });
    });

    $("#checkEqWrite").addEventListener("click",()=>{
      body.querySelectorAll("[data-eqwrite]").forEach(input=>{data.responses[input.dataset.eqwrite]=input.value;});
      const missing=["m","b","eqM","eqB"].filter(key=>String(r[key]??"").trim()==="");
      if(missing.length) return setLabFeedback("Complete the slope, y-intercept, and both equation boxes before checking.","incorrect");
      const slopeOk=equationLabNear(r.m,task.m);
      const interceptOk=equationLabNear(r.b,task.b);
      const equationSlopeOk=equationLabNear(r.eqM,task.m);
      const equationInterceptOk=equationLabNear(r.eqB,task.b);
      if(!slopeOk) return setLabFeedback("Recheck the slope. Use change in y divided by change in x. In a real-world situation, ask how much the dependent quantity changes for one unit of the independent quantity.","incorrect");
      if(!interceptOk) return setLabFeedback("Your slope is correct. Now find b. If x = 0 is not shown, substitute a known point and your slope into y = mx + b, then solve for b.","incorrect");
      if(!equationSlopeOk||!equationInterceptOk) return setLabFeedback("You found m and b correctly. Transfer those exact values into the equation: m multiplies x and b is the constant term.","incorrect");
      data.solved=true;
      renderLab85I();
      setLabFeedback("Correct. "+equationLabEquationPreview(task.m,task.b)+". The slope means "+task.slopeMeaning+", and the y-intercept represents "+task.interceptMeaning+".","correct");
    });

    const next=$("#nextEqWrite");
    if(next) next.addEventListener("click",()=>{
      if(data.index===EQUATION_WRITING_TASKS.length-1) return showLabCompletion("8.5I");
      data.index+=1;
      resetEquationWritingTask(data);
      renderLab85I();
      syncWhiteboardQuestion();
      setLabFeedback("New representation ready. Find m first, then b, then write the equation.");
    });
  }

  const TREND_LAB_TASKS = [
    {
      title:"Study time and quiz scores", context:"A teacher compared students' weekly study time with their quiz scores.",
      xLabel:"Study time (hours)", yLabel:"Quiz score", xMin:0, xMax:8, yMin:40, yMax:100,
      xTicks:[0,2,4,6,8], yTicks:[40,50,60,70,80,90,100], slope:6, intercept:50, offset:13,
      points:[[1,55],[1,59],[2,60],[2,64],[3,65],[3,70],[4,72],[4,76],[5,78],[5,82],[6,84],[6,88],[6.5,90],[4.5,70]],
      lineOrder:["above","best","against","below"], targetX:7, prediction:92, predictionChoices:[84,98,92,72], unit:"points",
      predictionPrompt:"About what quiz score does the trend line predict for a student who studies 7 hours?"
    },
    {
      title:"Temperature and hot-cocoa sales", context:"A café recorded the afternoon temperature and the number of cups of hot cocoa sold.",
      xLabel:"Temperature (°F)", yLabel:"Cups sold", xMin:40, xMax:80, yMin:10, yMax:90,
      xTicks:[40,50,60,70,80], yTicks:[10,30,50,70,90], slope:-1.5, intercept:140, offset:18,
      points:[[42,78],[45,72],[45,76],[50,62],[52,65],[55,55],[55,60],[60,48],[62,45],[65,41],[65,36],[70,32],[72,32],[58,50]],
      lineOrder:["against","below","above","best"], targetX:75, prediction:28, predictionChoices:[45,28,18,72], unit:"cups",
      predictionPrompt:"About how many cups does the trend line predict when the temperature is 75°F?"
    },
    {
      title:"Practice shots and baskets made", context:"Players recorded the number of practice shots they attempted and the number they made.",
      xLabel:"Shots attempted", yLabel:"Baskets made", xMin:0, xMax:60, yMin:0, yMax:50,
      xTicks:[0,10,20,30,40,50,60], yTicks:[0,10,20,30,40,50], slope:.7, intercept:3, offset:10,
      points:[[8,8],[10,12],[10,9],[15,15],[20,16],[20,20],[25,18],[30,26],[32,24],[35,29],[40,30],[40,34],[45,36],[50,36],[55,43]],
      lineOrder:["below","against","best","above"], targetX:50, prediction:38, predictionChoices:[50,31,18,38], unit:"baskets",
      predictionPrompt:"About how many baskets does the trend line predict for 50 attempted shots?"
    },
    {
      title:"Vehicle age and resale value", context:"A dealership compared vehicle age with resale value for similar vehicles.",
      xLabel:"Vehicle age (years)", yLabel:"Resale value ($1,000s)", xMin:0, xMax:12, yMin:5, yMax:35,
      xTicks:[0,2,4,6,8,10,12], yTicks:[5,10,15,20,25,30,35], slope:-2.2, intercept:34, offset:7,
      points:[[1,31],[2,29],[2,31],[3,26],[4,24],[4,26],[5,21],[6,22],[6,19],[7,18],[8,15],[8,17],[9,13],[11,10]],
      lineOrder:["best","above","below","against"], targetX:10, prediction:12, predictionChoices:[26,8,18,12], unit:"thousand dollars",
      predictionPrompt:"About what resale value does the trend line predict for a 10-year-old vehicle?"
    },
    {
      title:"Rainfall and plant growth", context:"A gardening club compared weekly rainfall with the growth of several plants.",
      xLabel:"Rainfall (inches)", yLabel:"Plant growth (cm)", xMin:0, xMax:8, yMin:0, yMax:24,
      xTicks:[0,2,4,6,8], yTicks:[0,4,8,12,16,20,24], slope:2.5, intercept:2, offset:5,
      points:[[1,4],[1,6],[2,8],[2.5,7],[3,10],[3,12],[4,11],[4,14],[5,13],[5,16],[6,18],[6,16],[6.5,19],[7.5,22]],
      lineOrder:["above","against","below","best"], targetX:7, prediction:20, predictionChoices:[12,24,20,16], unit:"centimeters",
      predictionPrompt:"About how much growth does the trend line predict with 7 inches of rainfall?"
    },
    {
      title:"Distance and sound level", context:"Students measured sound level at different distances from the same speaker.",
      xLabel:"Distance (feet)", yLabel:"Sound level (decibels)", xMin:0, xMax:30, yMin:35, yMax:100,
      xTicks:[0,5,10,15,20,25,30], yTicks:[40,50,60,70,80,90,100], slope:-1.7, intercept:95, offset:14,
      points:[[2,92],[4,86],[4,90],[7,81],[9,82],[10,76],[10,79],[13,70],[15,72],[17,64],[18,64],[20,60],[20,57],[23,55],[27,48]],
      lineOrder:["below","best","above","against"], targetX:25, prediction:53, predictionChoices:[38,68,53,82], unit:"decibels",
      predictionPrompt:"About what sound level does the trend line predict 25 feet from the speaker?"
    },
    {
      title:"Advertising time and attendance", context:"Student groups compared hours spent advertising an event with the number of people who attended.",
      xLabel:"Advertising time (hours)", yLabel:"Attendance", xMin:0, xMax:12, yMin:20, yMax:140,
      xTicks:[0,2,4,6,8,10,12], yTicks:[20,40,60,80,100,120,140], slope:9, intercept:25, offset:25,
      points:[[1,32],[2,46],[2,41],[3,50],[4,64],[4,58],[5,76],[6,76],[6,82],[7,91],[8,94],[8,101],[9,108],[11,125]],
      lineOrder:["against","above","best","below"], targetX:10, prediction:115, predictionChoices:[90,140,70,115], unit:"people",
      predictionPrompt:"About how many people does the trend line predict after 10 hours of advertising?"
    },
    {
      title:"Elevation and air temperature", context:"Hikers recorded the air temperature at several elevations on the same day.",
      xLabel:"Elevation (feet)", yLabel:"Temperature (°F)", xMin:0, xMax:8000, yMin:30, yMax:80,
      xTicks:[0,2000,4000,6000,8000], yTicks:[30,40,50,60,70,80], slope:-.0055, intercept:78, offset:11,
      points:[[500,76],[1000,70],[1000,74],[2000,65],[2500,66],[3000,60],[3000,63],[4000,57],[4500,51],[5000,52],[5000,48],[6000,44],[6500,44],[7500,36]],
      lineOrder:["best","below","against","above"], targetX:7000, prediction:40, predictionChoices:[58,32,72,40], unit:"degrees Fahrenheit",
      predictionPrompt:"About what temperature does the trend line predict at an elevation of 7,000 feet?"
    },
    {
      title:"Pages read and reading time", context:"Readers recorded the number of pages completed and the number of minutes they spent reading.",
      xLabel:"Pages read", yLabel:"Reading time (minutes)", xMin:0, xMax:100, yMin:0, yMax:160,
      xTicks:[0,20,40,60,80,100], yTicks:[0,20,40,60,80,100,120,140,160], slope:1.4, intercept:8, offset:28,
      points:[[8,18],[15,34],[15,24],[25,50],[30,42],[40,58],[40,70],[50,86],[55,88],[60,88],[70,100],[70,112],[80,108],[95,144]],
      lineOrder:["above","below","best","against"], targetX:90, prediction:134, predictionChoices:[112,154,90,134], unit:"minutes",
      predictionPrompt:"About how many minutes does the trend line predict for reading 90 pages?"
    },
    {
      title:"High temperature and pool attendance", context:"A community pool compared each day's high temperature with the number of visitors.",
      xLabel:"High temperature (°F)", yLabel:"Pool attendance", xMin:70, xMax:100, yMin:40, yMax:320,
      xTicks:[70,75,80,85,90,95,100], yTicks:[40,80,120,160,200,240,280,320], slope:8, intercept:-500, offset:60,
      points:[[72,68],[74,92],[74,72],[78,106],[80,144],[82,146],[82,166],[85,164],[86,192],[88,192],[90,236],[90,206],[92,226],[96,286],[98,278]],
      lineOrder:["below","against","above","best"], targetX:95, prediction:260, predictionChoices:[200,300,260,140], unit:"visitors",
      predictionPrompt:"About how many visitors does the trend line predict when the high temperature is 95°F?"
    }
  ];

  const TREND_VIEW = { width:720, height:520, left:90, top:38, right:680, bottom:438 };

  function trendNumber(value) {
    return Number(value).toLocaleString("en-US",{maximumFractionDigits:2});
  }

  function trendScreenPoint(task,x,y) {
    return {
      x:TREND_VIEW.left + ((x-task.xMin)/(task.xMax-task.xMin))*(TREND_VIEW.right-TREND_VIEW.left),
      y:TREND_VIEW.bottom - ((y-task.yMin)/(task.yMax-task.yMin))*(TREND_VIEW.bottom-TREND_VIEW.top)
    };
  }

  function trendLineSpec(task,kind) {
    if (kind === "best") return {m:task.slope,b:task.intercept};
    if (kind === "above") return {m:task.slope,b:task.intercept + task.offset};
    if (kind === "below") return {m:task.slope,b:task.intercept - task.offset};
    const middleX = (task.xMin + task.xMax)/2;
    const middleY = task.slope*middleX + task.intercept;
    return {m:-task.slope,b:middleY + task.slope*middleX};
  }

  function trendClippedLine(task,spec) {
    const candidates = [];
    const add = (x,y) => {
      if (x < task.xMin-.0001 || x > task.xMax+.0001 || y < task.yMin-.0001 || y > task.yMax+.0001) return;
      if (!candidates.some(point => Math.abs(point.x-x)<.0001 && Math.abs(point.y-y)<.0001)) candidates.push({x,y});
    };
    add(task.xMin,spec.m*task.xMin+spec.b);
    add(task.xMax,spec.m*task.xMax+spec.b);
    if (Math.abs(spec.m) > .0000001) {
      add((task.yMin-spec.b)/spec.m,task.yMin);
      add((task.yMax-spec.b)/spec.m,task.yMax);
    }
    if (candidates.length < 2) return null;
    let pair = [candidates[0],candidates[1]];
    let distance = -1;
    candidates.forEach((first,index) => candidates.slice(index+1).forEach(second => {
      const nextDistance = Math.hypot(second.x-first.x,second.y-first.y);
      if (nextDistance > distance) { distance = nextDistance; pair = [first,second]; }
    }));
    return pair;
  }

  function trendLineMarkup(task,kind,letter,index,solved) {
    const clipped = trendClippedLine(task,trendLineSpec(task,kind));
    if (!clipped) return "";
    const first = trendScreenPoint(task,clipped[0].x,clipped[0].y);
    const second = trendScreenPoint(task,clipped[1].x,clipped[1].y);
    const ratio = .68;
    const labelX = first.x + (second.x-first.x)*ratio;
    const labelY = first.y + (second.y-first.y)*ratio;
    return `<g class="trend-candidate-line ${solved ? "is-best" : `is-option-${index}`}"><line x1="${first.x}" y1="${first.y}" x2="${second.x}" y2="${second.y}"></line>${solved ? "" : `<circle cx="${labelX}" cy="${labelY}" r="15"></circle><text x="${labelX}" y="${labelY+5}">${letter}</text>`}</g>`;
  }

  function trendGraphMarkup(data,task) {
    const grid = [
      ...task.xTicks.map(value => { const point=trendScreenPoint(task,value,task.yMin); return `<line class="trend-grid-line" x1="${point.x}" y1="${TREND_VIEW.top}" x2="${point.x}" y2="${TREND_VIEW.bottom}"></line><text class="trend-tick" x="${point.x}" y="${TREND_VIEW.bottom+24}" text-anchor="middle">${trendNumber(value)}</text>`; }),
      ...task.yTicks.map(value => { const point=trendScreenPoint(task,task.xMin,value); return `<line class="trend-grid-line" x1="${TREND_VIEW.left}" y1="${point.y}" x2="${TREND_VIEW.right}" y2="${point.y}"></line><text class="trend-tick" x="${TREND_VIEW.left-13}" y="${point.y+5}" text-anchor="end">${trendNumber(value)}</text>`; })
    ].join("");
    const dots = task.points.map(point => { const screen=trendScreenPoint(task,point[0],point[1]); return `<circle class="trend-dot" cx="${screen.x}" cy="${screen.y}" r="6"></circle>`; }).join("");
    const lines = data.lineSolved
      ? trendLineMarkup(task,"best","",0,true)
      : task.lineOrder.map((kind,index) => trendLineMarkup(task,kind,String.fromCharCode(65+index),index,false)).join("");
    let predictionMarkup = "";
    if (data.lineSolved) {
      const guideBottom = trendScreenPoint(task,task.targetX,task.yMin);
      predictionMarkup += `<line class="trend-target-guide" x1="${guideBottom.x}" y1="${TREND_VIEW.top}" x2="${guideBottom.x}" y2="${TREND_VIEW.bottom}"></line>`;
      if (data.predictionChoice !== "") {
        const candidate = trendScreenPoint(task,task.targetX,Number(data.predictionChoice));
        predictionMarkup += `<g class="trend-prediction-point ${data.solved ? "is-correct" : ""}"><circle cx="${candidate.x}" cy="${candidate.y}" r="11"></circle><text x="${candidate.x+14}" y="${candidate.y-12}">(${trendNumber(task.targetX)}, ${trendNumber(data.predictionChoice)})</text></g>`;
      }
    }
    return `<svg class="trend-graph" viewBox="0 0 ${TREND_VIEW.width} ${TREND_VIEW.height}" role="img" aria-label="Scatterplot of ${task.xLabel} and ${task.yLabel}">${grid}<line class="trend-axis" x1="${TREND_VIEW.left}" y1="${TREND_VIEW.bottom}" x2="${TREND_VIEW.right}" y2="${TREND_VIEW.bottom}"></line><line class="trend-axis" x1="${TREND_VIEW.left}" y1="${TREND_VIEW.top}" x2="${TREND_VIEW.left}" y2="${TREND_VIEW.bottom}"></line>${dots}${lines}${predictionMarkup}<text class="trend-axis-label" x="${(TREND_VIEW.left+TREND_VIEW.right)/2}" y="502" text-anchor="middle">${escapeHTML(task.xLabel)}</text><text class="trend-axis-label" x="24" y="${(TREND_VIEW.top+TREND_VIEW.bottom)/2}" text-anchor="middle" transform="rotate(-90 24 ${(TREND_VIEW.top+TREND_VIEW.bottom)/2})">${escapeHTML(task.yLabel)}</text></svg>`;
  }

  function trendMisconception(kind) {
    if (kind === "against") return "This line goes against the direction of the data. Follow the overall association from left to right.";
    if (kind === "above") return "This line sits above nearly all the data. A useful trend line passes through the middle of the cluster.";
    return "This line sits below nearly all the data. A useful trend line should leave a balanced number of points above and below it.";
  }

  function resetTrendTask(data) {
    data.lineChoice = "";
    data.lineSolved = false;
    data.predictionChoice = "";
    data.solved = false;
  }

  function advanceTrendLab(data) {
    if (data.index >= TREND_LAB_TASKS.length-1) return showLabCompletion("8.5D");
    data.index += 1;
    resetTrendTask(data);
    renderLab85D();
    syncWhiteboardQuestion();
    setLabFeedback("New scatterplot ready. Look at the whole cluster before choosing a trend line.");
  }

  function renderLab85D() {
    if (!labRuntime.data) labRuntime.data = {index:0,lineChoice:"",lineSolved:false,predictionChoice:"",solved:false};
    const data = labRuntime.data;
    if (data.index >= TREND_LAB_TASKS.length) return showLabCompletion("8.5D");
    const task = TREND_LAB_TASKS[data.index];
    const completed = data.index + (data.solved ? 1 : 0);
    setLabProgress(completed,TREND_LAB_TASKS.length,`Question ${data.index+1}: choose the best trend line, then make a prediction.`);
    const lineButtons = task.lineOrder.map((kind,index) => {
      const letter = String.fromCharCode(65+index);
      return `<button type="button" class="lab-choice trend-line-choice ${data.lineChoice === kind ? "is-selected" : ""}" data-trend-line="${kind}"><span class="trend-choice-key is-option-${index}">${letter}</span> Line ${letter}</button>`;
    }).join("");
    const predictionButtons = task.predictionChoices.map(value => `<button type="button" class="lab-choice trend-prediction-choice ${String(data.predictionChoice) === String(value) ? "is-selected" : ""}" data-trend-prediction="${value}">${trendNumber(value)} ${task.unit}</button>`).join("");
    $("#standardsLabBody").innerHTML = `
      <section class="trend-lab-shell">
        <header class="trend-task-header"><div><p class="lab-mini-title">Problem ${data.index+1} of ${TREND_LAB_TASKS.length}</p><h4>${task.title}</h4><p>${task.context}</p></div><span>${data.lineSolved ? "2 · Predict" : "1 · Model"}</span></header>
        <div class="trend-split-layout">
          <article class="trend-investigation-card">
            <div class="trend-graph-frame">${trendGraphMarkup(data,task)}</div>
            ${data.lineSolved ? `<div class="trend-prediction-panel"><p class="lab-mini-title">Use the selected trend line</p><h5>${task.predictionPrompt}</h5><p>Select an estimate to plot it at x = ${trendNumber(task.targetX)}. Then compare its point with the trend line before checking.</p><div class="trend-prediction-options">${predictionButtons}</div><button type="button" class="lab-action" id="checkTrendPrediction" ${data.predictionChoice === "" || data.solved ? "disabled" : ""}>Check prediction</button></div>` : `<div class="trend-line-panel"><p class="lab-mini-title">Which line best models the data?</p><p>Choose the line that follows the direction of the cluster and passes through its middle.</p><div class="trend-line-options">${lineButtons}</div></div>`}
          </article>
          <aside class="trend-work-paper" aria-label="Blank work paper for calculations">
            <header><span>Work paper</span><small>Use the drawing tools across the top</small></header>
            <div class="trend-paper-prompts"><span>rise / run</span><span>y = mx + b</span><span>plot an answer choice</span></div>
          </aside>
        </div>
        <div class="trend-next-row"><button type="button" class="lab-next" id="nextTrendTask" ${data.solved ? "" : "hidden"}>${data.index === TREND_LAB_TASKS.length-1 ? "Finish lab" : "Next scatterplot →"}</button></div>
      </section>`;

    document.querySelectorAll("[data-trend-line]").forEach(button => button.addEventListener("click",() => {
      if (data.lineSolved) return;
      const kind = button.dataset.trendLine;
      data.lineChoice = kind;
      if (kind !== "best") {
        renderLab85D();
        return setLabFeedback(trendMisconception(kind),"incorrect");
      }
      data.lineSolved = true;
      renderLab85D();
      setLabFeedback("Correct. The other lines disappeared because this line follows the association and passes through the center of the point cloud.","correct");
    }));

    document.querySelectorAll("[data-trend-prediction]").forEach(button => button.addEventListener("click",() => {
      if (data.solved) return;
      data.predictionChoice = Number(button.dataset.trendPrediction);
      renderLab85D();
      setLabFeedback(`The point (${trendNumber(task.targetX)}, ${trendNumber(data.predictionChoice)}) is now plotted. Compare it with the trend line, then check your prediction.`);
    }));

    const checkPrediction = $("#checkTrendPrediction");
    if (checkPrediction) checkPrediction.addEventListener("click",() => {
      const choice = Number(data.predictionChoice);
      if (choice !== task.prediction) {
        const direction = choice > task.prediction ? "above" : "below";
        return setLabFeedback(`That point is too far ${direction} the trend line at x = ${trendNumber(task.targetX)}. Use your equation or compare the plotted choices and select the closest value.`,"incorrect");
      }
      data.solved = true;
      renderLab85D();
      setLabFeedback(`Correct. The line predicts about ${trendNumber(task.prediction)} ${task.unit}. A trend-line prediction is an estimate, so the closest reasonable value is the best choice.`,"correct");
    });
    const next = $("#nextTrendTask");
    if (next) next.addEventListener("click",() => advanceTrendLab(data));
  }

  const SIMILARITY_SHAPES = {
    triangle: [[28, 168], [105, 28], [188, 168]],
    quadrilateral: [[30, 42], [166, 25], [190, 142], [60, 182]],
    pentagon: [[105, 18], [188, 78], [156, 180], [50, 176], [18, 78]]
  };

  const SIMILARITY_TASKS = [
    { kind: "guided", shape: "triangle", rotation: 90, title: "Letters reveal the structure", note: "No measurements are needed yet. Match the side names and build three ways to express the same proportional relationship.", first: ["A", "B", "C"], second: ["a", "b", "c"] },
    { kind: "guided", shape: "quadrilateral", rotation: 270, title: "Keep the correspondence steady", note: "The figures have different sizes and the second drawing has been turned on the page. The matching order does not change.", first: ["P", "Q", "R"], second: ["p", "q", "r"] },
    { kind: "guided", shape: "pentagon", rotation: 180, title: "Trace the same position", note: "Use the shape, not the page direction, to decide which three highlighted sides correspond.", first: ["L", "M", "N"], second: ["l", "m", "n"] },
    { kind: "guided", shape: "triangle", rotation: 270, title: "Find the third side", note: "The color links will help you keep each measurement paired with its corresponding side.", first: ["9", "12", "x"], second: ["6", "8", "10"], answer: 15 },
    { kind: "guided", shape: "quadrilateral", rotation: 90, title: "Use one consistent scale relationship", note: "Match first, then choose any valid proportion family to determine x.", first: ["14", "x", "18"], second: ["7", "6", "9"], answer: 12 },
    { kind: "guided", shape: "triangle", rotation: 180, title: "Move from the smaller figure to the larger figure", note: "A correct ratio works in either direction as long as that direction stays consistent.", first: ["5", "8", "x"], second: ["12.5", "20", "17.5"], answer: 7 },
    { kind: "guided", shape: "pentagon", rotation: 270, title: "Connect decimals and proportional sides", note: "Use the same color in both figures to identify each corresponding pair before solving.", first: ["4.5", "6", "9"], second: ["7.5", "x", "15"], answer: 10 },
    { kind: "world", scene: "flagpole", title: "Flagpole and yard marker", prompt: "A 1.5-meter yard marker casts a 2-meter shadow. At the same time, a flagpole casts a 14-meter shadow. What is the height h of the flagpole?", choices: ["h/1.5 = 14/2", "h/2 = 14/1.5", "1.5/h = 14/2", "h/14 = 2/1.5"], correct: 0, answer: 10.5, unit: "m", clue: "Match height with height and shadow with shadow. Both ratios must travel from the flagpole triangle to the marker triangle." },
    { kind: "world", scene: "ramp", title: "Stage ramp support", prompt: "A small right-triangle support rises 3 feet over a 4-foot run. A similar larger support has a 10-foot run. What is its rise x?", choices: ["x/3 = 10/4", "x/4 = 10/3", "3/x = 10/4", "x/10 = 4/3"], correct: 0, answer: 7.5, unit: "ft", clue: "Compare rise to rise and run to run, or compare rise to run in both triangles." },
    { kind: "world", scene: "mural", title: "Sketch enlarged into a mural", prompt: "A rectangular sketch is 8 inches wide and 5 inches high. A similar mural is 28 feet wide. What is the mural height x?", choices: ["x/5 = 28/8", "x/8 = 28/5", "5/x = 28/8", "x/28 = 8/5"], correct: 0, answer: 17.5, unit: "ft", clue: "Keep height with height and width with width. The units do not need to match when each ratio compares the same figure-to-figure scale factor." }
  ];

  function similarityPairColor(index) {
    return ["teal", "orange", "purple"][index % 3];
  }

  function similarityFraction(top, bottom, topIndex = 0, bottomIndex = 1) {
    return `<span class="sim-fraction"><span class="sim-ratio-token is-${similarityPairColor(topIndex)}">${escapeHTML(top)}</span><span class="sim-ratio-token is-${similarityPairColor(bottomIndex)}">${escapeHTML(bottom)}</span></span>`;
  }

  function similarityRatioFamilies(task) {
    const A = task.first;
    const a = task.second;
    const direct = `${similarityFraction(A[0], a[0], 0, 0)}<b>=</b>${similarityFraction(A[1], a[1], 1, 1)}<b>=</b>${similarityFraction(A[2], a[2], 2, 2)}`;
    const directWrong = `${similarityFraction(A[0], a[0], 0, 0)}<b>=</b>${similarityFraction(a[1], A[1], 1, 1)}<b>=</b>${similarityFraction(A[2], a[2], 2, 2)}`;
    const reciprocal = `${similarityFraction(a[0], A[0], 0, 0)}<b>=</b>${similarityFraction(a[1], A[1], 1, 1)}<b>=</b>${similarityFraction(a[2], A[2], 2, 2)}`;
    const reciprocalWrong = `${similarityFraction(a[0], A[0], 0, 0)}<b>=</b>${similarityFraction(A[1], a[1], 1, 1)}<b>=</b>${similarityFraction(a[2], A[2], 2, 2)}`;
    const within = `${similarityFraction(A[0], A[1], 0, 1)}<b>=</b>${similarityFraction(a[0], a[1], 0, 1)}<i>and</i>${similarityFraction(A[1], A[2], 1, 2)}<b>=</b>${similarityFraction(a[1], a[2], 1, 2)}<i>and</i>${similarityFraction(A[0], A[2], 0, 2)}<b>=</b>${similarityFraction(a[0], a[2], 0, 2)}`;
    const withinWrong = `${similarityFraction(A[0], A[1], 0, 1)}<b>=</b>${similarityFraction(a[1], a[0], 1, 0)}<i>and</i>${similarityFraction(A[1], A[2], 1, 2)}<b>=</b>${similarityFraction(a[1], a[2], 1, 2)}`;
    return [
      { title: "Figure I ÷ Figure II", clue: "Every numerator comes from Figure I; every denominator comes from Figure II.", wrongReason: "The middle ratio is flipped. Each ratio must keep Figure I on top and Figure II on the bottom.", choices: [direct, directWrong] },
      { title: "Figure II ÷ Figure I", clue: "This is the reciprocal direction. Flip every pair, not just one.", wrongReason: "Only the middle pair was flipped. A reciprocal proportion must place Figure II on top every time.", choices: [reciprocalWrong, reciprocal] },
      { title: "Within each figure", clue: "Compare two sides in Figure I, then compare their matching sides in the same order in Figure II.", wrongReason: "The side order reverses in Figure II. Compare first-to-second in both figures without switching the order.", choices: [within, withinWrong] }
    ];
  }

  function similarityChoiceOrder(length, correctIndex, desiredPosition) {
    const others = Array.from({ length }, (_, index) => index).filter(index => index !== correctIndex);
    for (let index = others.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [others[index], others[swapIndex]] = [others[swapIndex], others[index]];
    }
    const order = [...others];
    order.splice(Math.max(0, Math.min(desiredPosition, length - 1)), 0, correctIndex);
    return order;
  }

  function similarityFigureMarkup(task, figure, rotation, matched, pending) {
    const points = SIMILARITY_SHAPES[task.shape];
    const values = figure === 1 ? task.first : task.second;
    const scale = figure === 1 ? 0.92 : 0.72;
    const displayedRotation = figure === 2 ? rotation : 0;
    const center = { x: 110, y: 110 };
    const sideMarkup = [0, 1, 2].map(index => {
      const p1 = points[index];
      const p2 = points[(index + 1) % points.length];
      const mx = (p1[0] + p2[0]) / 2;
      const my = (p1[1] + p2[1]) / 2;
      const dx = mx - center.x;
      const dy = my - center.y;
      const length = Math.hypot(dx, dy) || 1;
      const lx = mx + dx / length * 16;
      const ly = my + dy / length * 16;
      const isMatched = matched.includes(index);
      const isPending = pending && pending.figure === figure && pending.index === index;
      const colorClass = isMatched ? ` is-${similarityPairColor(index)}` : "";
      return `<g class="sim-side${colorClass}${isPending ? " is-pending" : ""}" role="button" tabindex="0" aria-label="Figure ${figure}, side ${values[index]}" data-sim-side="${index}" data-sim-figure="${figure}"><line class="sim-side-visible" x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}"></line><line class="sim-side-hit" x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}"></line><circle cx="${lx}" cy="${ly}" r="15"></circle><text x="${lx}" y="${ly + 1}">${escapeHTML(values[index])}</text></g>`;
    }).join("");
    return `<article class="sim-figure-card"><header><span>Figure ${figure === 1 ? "I" : "II"}</span><strong>${figure === 2 && rotation % 360 !== 0 ? "Turning around its center" : "Ready to compare"}</strong></header><div class="sim-figure-stage"><svg class="sim-figure-svg" viewBox="0 0 220 220" preserveAspectRatio="xMidYMid meet" aria-label="Similar ${task.shape}, Figure ${figure}"><g class="sim-shape-group" style="--sim-rotation:${displayedRotation}deg;--sim-scale:${scale}"><polygon class="sim-shape-fill" points="${points.map(point => point.join(",")).join(" ")}"></polygon>${sideMarkup}</g>${figure === 2 ? '<circle class="sim-rotation-center" cx="110" cy="110" r="4"></circle>' : ""}</svg></div></article>`;
  }

  function similarityWorldVisual(scene) {
    if (scene === "flagpole") return `<figure class="sim-world-scene is-flagpole"><img src="assets/8-3A-world-flagpole.png" alt="A tall flagpole and a short yard marker casting shadows across a sunny field"><span class="sim-measure is-marker-height">1.5 m</span><span class="sim-measure is-marker-shadow">2 m</span><span class="sim-measure is-pole-height">h</span><span class="sim-measure is-pole-shadow">14 m</span></figure>`;
    if (scene === "ramp") return `<figure class="sim-world-scene is-ramp"><img src="assets/8-3A-world-stage-supports.png" alt="A small orange triangular stage support and a larger teal similar support"><span class="sim-measure is-small-rise">3 ft</span><span class="sim-measure is-small-run">4 ft</span><span class="sim-measure is-large-rise">x</span><span class="sim-measure is-large-run">10 ft</span></figure>`;
    return `<figure class="sim-world-scene is-mural"><img src="assets/8-3A-world-mural.png" alt="A small rectangular art sketch enlarged into a similar wall mural"><span class="sim-measure is-sketch-height">5 in</span><span class="sim-measure is-sketch-width">8 in</span><span class="sim-measure is-mural-height">x</span><span class="sim-measure is-mural-width">28 ft</span></figure>`;
  }

  function resetSimilarityTask(data) {
    const task = SIMILARITY_TASKS[data.index];
    data.phase = task.kind === "guided" ? "align" : "world-ratio";
    data.rotation = task.rotation || 0;
    data.matched = [];
    data.pending = null;
    data.ratioAnswers = [null, null, null];
    data.ratioErrors = [null, null, null];
    const correctRatioChoices = [0, 1, 0];
    data.ratioOrders = correctRatioChoices.map((correctIndex, familyIndex) => similarityChoiceOrder(2, correctIndex, (data.index + familyIndex) % 2));
    data.completed = false;
    data.worldChoice = null;
    data.worldError = null;
    if (task.kind === "world") {
      let correctPosition = Math.floor(Math.random() * task.choices.length);
      if (data.lastWorldCorrectPosition === correctPosition) correctPosition = (correctPosition + 1) % task.choices.length;
      data.lastWorldCorrectPosition = correctPosition;
      data.worldOrder = similarityChoiceOrder(task.choices.length, task.correct, correctPosition);
    }
  }

  function completeSimilarityQuestion(data, message) {
    data.completed = true;
    setLabProgress(data.index + 1, SIMILARITY_TASKS.length, `Question ${data.index + 1} complete. Take a moment to explain why the proportion is valid.`);
    setLabFeedback(message, "correct");
  }

  function renderLab83A() {
    if (!labRuntime.data) {
      labRuntime.data = { index: 0 };
      resetSimilarityTask(labRuntime.data);
    }
    const data = labRuntime.data;
    const task = SIMILARITY_TASKS[data.index];
    setLabProgress(data.index + (data.completed ? 1 : 0), SIMILARITY_TASKS.length, task.kind === "guided" ? `Guided similarity ${data.index + 1} of 7.` : `Real-world connection ${data.index - 6} of 3.`);

    if (task.kind === "world") {
      const proportionButtons = data.worldOrder.map(index => {
        const choice = task.choices[index];
        return `<button type="button" class="sim-proportion-choice${data.worldChoice === index ? " is-selected" : ""}${data.worldError === index ? " is-incorrect" : ""}${data.phase === "world-solve" && task.correct === index ? " is-correct" : ""}" data-world-proportion="${index}" ${data.completed ? "disabled" : ""}>${choice.split(" = ").map((part, pairIndex) => {
        const [top, bottom] = part.split("/");
        return similarityFraction(top, bottom, pairIndex, pairIndex);
      }).join("<b>=</b>")}</button>`;
      }).join("");
      $("#standardsLabBody").innerHTML = `<section class="sim-world-layout"><article class="lab-stage-card"><p class="lab-mini-title">Application ${data.index - 6} of 3</p><h4>${task.title}</h4>${similarityWorldVisual(task.scene)}</article><article class="lab-task-card sim-world-task"><span class="sim-step-chip">Connect → Proportion → Solve</span><h4>${task.prompt}</h4><p>First choose a proportion that keeps corresponding quantities in the same positions.</p><div class="sim-proportion-grid">${proportionButtons}</div>${data.worldError !== null ? `<p class="sim-ratio-explanation"><strong>Why this is not valid:</strong> ${task.clue}</p>` : ""}<button type="button" class="lab-action" id="checkWorldProportion" ${data.worldChoice === null || data.completed ? "disabled" : ""}>Check my proportion</button><div class="sim-solve-panel" id="worldSolvePanel" ${data.phase === "world-solve" || data.completed ? "" : "hidden"}><label for="worldSimilarityAnswer">Solve for the missing measure</label><div class="sim-answer-row"><input id="worldSimilarityAnswer" type="number" step="any" inputmode="decimal" placeholder="x ="><span>${task.unit}</span><button type="button" class="lab-action" id="checkWorldAnswer" ${data.completed ? "disabled" : ""}>Check x</button></div></div><button type="button" class="lab-next" id="nextSimilarityQuestion" ${data.completed ? "" : "hidden"}>${data.index === SIMILARITY_TASKS.length - 1 ? "Finish lab" : "Next situation →"}</button></article></section>`;
      document.querySelectorAll("[data-world-proportion]").forEach(button => button.addEventListener("click", () => {
        data.worldChoice = Number(button.dataset.worldProportion);
        renderLab83A();
        setLabFeedback("Proportion selected. Check whether both ratios compare corresponding quantities in the same order.");
      }));
      const checkProportion = $("#checkWorldProportion");
      if (checkProportion) checkProportion.addEventListener("click", () => {
        if (data.worldChoice !== task.correct) {
          data.worldError = data.worldChoice;
          renderLab83A();
          return setLabFeedback(`That proportion is not valid yet. ${task.clue}`, "incorrect");
        }
        data.phase = "world-solve";
        renderLab83A();
        setLabFeedback("That proportion keeps the correspondence consistent. Now solve for the missing measure.", "correct");
      });
      const checkAnswer = $("#checkWorldAnswer");
      if (checkAnswer) checkAnswer.addEventListener("click", () => {
        const rawAnswer = $("#worldSimilarityAnswer").value.trim();
        const answer = Number(rawAnswer);
        if (!rawAnswer || !Number.isFinite(answer)) return setLabFeedback("Enter a numerical value for the missing measure.", "incorrect");
        if (Math.abs(answer - task.answer) > 0.01) return setLabFeedback(`Use the proportion you selected and cross multiply. Your result should preserve the same scale factor in both dimensions.`, "incorrect");
        completeSimilarityQuestion(data, `Yes—x = ${task.answer} ${task.unit}. The corresponding quantities grow by one consistent scale factor.`);
        renderLab83A();
      });
      const next = $("#nextSimilarityQuestion");
      if (next) next.addEventListener("click", () => {
        if (data.index === SIMILARITY_TASKS.length - 1) {
          showLabCompletion("8.3A");
          return;
        }
        data.index += 1;
        resetSimilarityTask(data);
        renderLab83A();
        setLabFeedback("Use the diagram to connect corresponding quantities before choosing a proportion.");
      });
      return;
    }

    const families = similarityRatioFamilies(task);
    const figures = `${similarityFigureMarkup(task, 1, 0, data.matched, data.pending)}${similarityFigureMarkup(task, 2, data.rotation, data.matched, data.pending)}`;
    const phaseCopy = data.phase === "align" ? "Step 1 · Align" : data.phase === "match" ? "Step 2 · Match sides" : data.phase === "ratios" ? "Step 3 · Build ratios" : "Step 4 · Solve";
    let taskPanel = "";
    if (data.phase === "align") {
      taskPanel = `<h4>Turn Figure II until its orientation matches Figure I.</h4><p>This turn is a viewing tool. A dilation itself preserves orientation; only this drawing has been rotated on the page.</p><div class="sim-rotation-controls"><button type="button" class="lab-choice" data-sim-rotate="-90" aria-label="Rotate Figure II counterclockwise 90 degrees">↶ Turn left 90°</button><div><strong>${((data.rotation % 360) + 360) % 360}°</strong><span>from aligned</span></div><button type="button" class="lab-choice" data-sim-rotate="90" aria-label="Rotate Figure II clockwise 90 degrees">Turn right 90° ↷</button></div>`;
    } else if (data.phase === "match") {
      taskPanel = `<h4>Click one side in each figure to make a corresponding pair.</h4><p>Correct pairs keep their color. Match all three highlighted sides before building proportions.</p><div class="sim-match-key">${[0,1,2].map(index => `<span class="is-${similarityPairColor(index)}"><i></i>${data.matched.includes(index) ? `${task.first[index]} ↔ ${task.second[index]}` : `Pair ${index + 1}`}</span>`).join("")}</div>`;
    } else if (data.phase === "ratios") {
      taskPanel = `<h4>Build three valid proportion structures.</h4><p>Choose the valid statement in each row. Color shows which measurements correspond.</p><div class="sim-family-list">${families.map((family, familyIndex) => `<section class="sim-family-card${data.ratioAnswers[familyIndex] !== null ? " is-complete" : ""}"><header><span>${familyIndex + 1}</span><div><strong>${family.title}</strong><small>${family.clue}</small></div></header><div class="sim-family-options">${data.ratioOrders[familyIndex].map(choiceIndex => `<button type="button" class="${data.ratioErrors[familyIndex] === choiceIndex ? "is-incorrect" : ""}${data.ratioAnswers[familyIndex] === choiceIndex ? " is-correct" : ""}" data-ratio-family="${familyIndex}" data-ratio-choice="${choiceIndex}" ${data.ratioAnswers[familyIndex] !== null ? "disabled" : ""}>${family.choices[choiceIndex]}</button>`).join("")}</div>${data.ratioErrors[familyIndex] !== null ? `<p class="sim-ratio-explanation"><strong>Why this is not valid:</strong> ${family.wrongReason}</p>` : ""}</section>`).join("")}</div>`;
    } else {
      taskPanel = `<h4>${task.answer === undefined ? "Explain the structure" : "Use one valid proportion to solve for x."}</h4>${task.answer === undefined ? `<p>You created a direct comparison, its reciprocal, and matching within-figure ratios. Each works because the correspondence and order stay consistent.</p><div class="sim-structure-note"><strong>Important:</strong> The within-figure comparisons are separate matching equations—not one long chain.</div>` : `<p>Choose the proportion family that feels clearest, then solve. Your answer must make all three corresponding pairs share one scale factor.</p><div class="sim-answer-row"><label class="sr-only" for="similarityAnswer">Value of x</label><input id="similarityAnswer" type="number" step="any" inputmode="decimal" placeholder="x =" ${data.completed ? "disabled" : ""}><button type="button" class="lab-action" id="checkSimilarityAnswer" ${data.completed ? "disabled" : ""}>Check x</button></div>`}<button type="button" class="lab-action" id="completeSymbolicSimilarity" ${task.answer === undefined && !data.completed ? "" : "hidden"}>I can explain why these ratios work</button><button type="button" class="lab-next" id="nextSimilarityQuestion" ${data.completed ? "" : "hidden"}>Next guided example →</button>`;
    }

    $("#standardsLabBody").innerHTML = `<section class="sim-lab-shell"><header class="sim-question-header"><div><p class="lab-mini-title">Guided similarity ${data.index + 1} of 7</p><h4>${task.title}</h4><p>${task.note}</p></div><span class="sim-step-chip">${phaseCopy}</span></header><div class="sim-figure-grid">${figures}</div><article class="lab-task-card sim-guidance-panel">${taskPanel}</article></section>`;

    document.querySelectorAll("[data-sim-rotate]").forEach(button => button.addEventListener("click", () => {
      data.rotation = ((data.rotation + Number(button.dataset.simRotate)) % 360 + 360) % 360;
      if (data.rotation === 0) {
        data.phase = "match";
        renderLab83A();
        setLabFeedback("Aligned. Now follow the vertices around each figure and match corresponding sides.", "correct");
      } else {
        renderLab83A();
        setLabFeedback("Notice how the vertices move together. Continue until the figures face the same direction.");
      }
    }));

    const handleSide = element => {
      if (data.phase !== "match") return;
      const selection = { figure: Number(element.dataset.simFigure), index: Number(element.dataset.simSide) };
      if (!data.pending || data.pending.figure === selection.figure) {
        data.pending = selection;
        renderLab83A();
        setLabFeedback(`Side ${selection.figure === 1 ? task.first[selection.index] : task.second[selection.index]} selected. Now choose its partner in the other figure.`);
        return;
      }
      if (data.pending.index !== selection.index) {
        data.pending = null;
        renderLab83A();
        setLabFeedback("Those sides occupy different positions around the shape. Start at a distinctive corner and trace both figures in the same direction.", "incorrect");
        return;
      }
      if (!data.matched.includes(selection.index)) data.matched.push(selection.index);
      data.pending = null;
      if (data.matched.length === 3) data.phase = "ratios";
      renderLab83A();
      setLabFeedback(data.matched.length === 3 ? "All three pairs correspond. Keep those colors together as you build each proportion family." : "Correct pair—the matching sides now share one color.", "correct");
    };
    document.querySelectorAll("[data-sim-side]").forEach(side => {
      side.addEventListener("click", () => handleSide(side));
      side.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleSide(side); } });
    });
    document.querySelectorAll("[data-ratio-family]").forEach(button => button.addEventListener("click", () => {
      const familyIndex = Number(button.dataset.ratioFamily);
      const choiceIndex = Number(button.dataset.ratioChoice);
      const correctIndex = familyIndex === 1 ? 1 : 0;
      if (choiceIndex !== correctIndex) {
        data.ratioErrors[familyIndex] = choiceIndex;
        renderLab83A();
        return setLabFeedback(`That proportion is not valid yet. ${families[familyIndex].wrongReason}`, "incorrect");
      }
      data.ratioAnswers[familyIndex] = choiceIndex;
      if (data.ratioAnswers.every(answer => answer !== null)) data.phase = "solve";
      renderLab83A();
      setLabFeedback(data.phase === "solve" ? "All three structures are valid. Now use one of them to finish the example." : "That structure is valid because every ratio keeps the same correspondence and direction.", "correct");
    }));
    const symbolic = $("#completeSymbolicSimilarity");
    if (symbolic) symbolic.addEventListener("click", () => {
      completeSimilarityQuestion(data, "Excellent. You can compare the figures in either direction, or compare pairs within each figure, as long as the order remains consistent.");
      renderLab83A();
    });
    const checkAnswer = $("#checkSimilarityAnswer");
    if (checkAnswer) checkAnswer.addEventListener("click", () => {
      const rawAnswer = $("#similarityAnswer").value.trim();
      const answer = Number(rawAnswer);
      if (!rawAnswer || !Number.isFinite(answer)) return setLabFeedback("Enter a numerical value for x.", "incorrect");
      if (Math.abs(answer - task.answer) > 0.01) return setLabFeedback("Try one color pair with two known values to find the scale factor. Then apply that same factor to the side containing x.", "incorrect");
      completeSimilarityQuestion(data, `Correct—x = ${task.answer}. Every matching color pair now has the same scale relationship.`);
      renderLab83A();
    });
    const next = $("#nextSimilarityQuestion");
    if (next) next.addEventListener("click", () => {
      data.index += 1;
      resetSimilarityTask(data);
      renderLab83A();
      setLabFeedback(data.index < 7 ? "Begin by turning Figure II into the same orientation as Figure I." : "Now transfer the same correspondence strategy to an original real-world situation.");
    });
  }

  const DILATION_ATTRIBUTE_BANK = {
    coordinates: { title: "Coordinates of the vertices", answer: "changes", reason: task => `Every x- and y-coordinate is multiplied by k = ${task.factorLabel}.` },
    distance: { title: "Distance from the origin", answer: "changes", reason: task => `Every vertex moves to ${task.factorLabel} times its original distance from the origin.` },
    sides: { title: "Corresponding side lengths", answer: "changes", reason: task => `Every side length is multiplied by k = ${task.factorLabel}.` },
    perimeter: { title: "Perimeter", answer: "changes", reason: task => `Perimeter is made from side lengths, so it is multiplied by k = ${task.factorLabel}.` },
    area: { title: "Area", answer: "changes", reason: task => `Area uses two dimensions, so it is multiplied by k² = ${task.areaFactorLabel}.` },
    angles: { title: "Corresponding angle measures", answer: "same", reason: () => "A dilation preserves every corresponding angle measure." },
    orientation: { title: "Orientation", answer: "same", reason: () => "A positive scale factor keeps the vertices in the same order, so orientation is preserved." },
    shape: { title: "Shape and similarity", answer: "same", reason: () => "A dilation keeps the same shape; the two figures remain similar." },
    parallel: { title: "Parallel relationships", answer: "same", reason: () => "Corresponding sides keep the same direction and slope, so parallel relationships are preserved." }
  };

  const DILATION_ATTRIBUTE_TASKS = [
    { mode: "reduction", k: .5, factorLabel: "1/2", areaFactorLabel: "1/4", points: [{x:4,y:4},{x:8,y:4},{x:8,y:8}], attributes: ["sides","angles","coordinates","orientation"] },
    { mode: "reduction", k: .25, factorLabel: "1/4", areaFactorLabel: "1/16", points: [{x:-8,y:4},{x:-4,y:4},{x:-4,y:8},{x:-8,y:8}], attributes: ["perimeter","shape","area","parallel"] },
    { mode: "reduction", k: .75, factorLabel: "3/4", areaFactorLabel: "9/16", points: [{x:-8,y:-4},{x:-4,y:-4},{x:-4,y:-8}], attributes: ["distance","angles","sides","shape"] },
    { mode: "reduction", k: .5, factorLabel: "1/2", areaFactorLabel: "1/4", points: [{x:4,y:-8},{x:8,y:-8},{x:8,y:-4},{x:6,y:-2}], attributes: ["orientation","perimeter","coordinates","area"] },
    { mode: "reduction", k: 2/3, factorLabel: "2/3", areaFactorLabel: "4/9", points: [{x:3,y:6},{x:6,y:6},{x:6,y:9},{x:3,y:9}], attributes: ["parallel","distance","angles","perimeter"] },
    { mode: "enlargement", k: 2, factorLabel: "2", areaFactorLabel: "4", points: [{x:1,y:1},{x:3,y:1},{x:3,y:3}], attributes: ["area","shape","sides","orientation"] },
    { mode: "enlargement", k: 1.5, factorLabel: "3/2", areaFactorLabel: "9/4", points: [{x:-4,y:2},{x:-2,y:2},{x:-2,y:4},{x:-4,y:4}], attributes: ["coordinates","angles","perimeter","parallel"] },
    { mode: "enlargement", k: 2, factorLabel: "2", areaFactorLabel: "4", points: [{x:-3,y:-1},{x:-1,y:-1},{x:-1,y:-3},{x:-3,y:-3}], attributes: ["distance","shape","area","orientation"] },
    { mode: "enlargement", k: 3, factorLabel: "3", areaFactorLabel: "9", points: [{x:1,y:-1},{x:3,y:-1},{x:3,y:-2},{x:2,y:-3},{x:1,y:-2}], attributes: ["sides","parallel","coordinates","angles"] },
    { mode: "enlargement", k: 1.5, factorLabel: "3/2", areaFactorLabel: "9/4", points: [{x:2,y:2},{x:6,y:2},{x:6,y:4},{x:4,y:6},{x:2,y:4}], attributes: ["perimeter","orientation","area","shape"] }
  ];

  function resetDilationAttributeTask(data) {
    data.phase = "center";
    data.currentScale = 1;
    data.placed = {};
    data.selected = null;
    data.lastWrong = null;
    data.completed = false;
    data.dragging = false;
  }

  function dilationAttributeScreenPoint(point) {
    const origin = 280;
    const unit = 24;
    return { x: origin + point.x * unit, y: origin - point.y * unit };
  }

  function dilationAttributeScaledScreenPoint(point, scale) {
    const origin = 280;
    const unit = 24;
    return { x: origin + point.x * unit * scale, y: origin - point.y * unit * scale };
  }

  function dilationAttributeLabelPoint(point, kind) {
    const origin = 280;
    const dx = point.x - origin;
    const dy = point.y - origin;
    const length = Math.hypot(dx, dy) || 1;
    const outward = { x: dx / length, y: dy / length };
    const perpendicular = { x: -dy / length, y: dx / length };
    const side = kind === "original" ? 16 : -20;
    const away = kind === "original" ? -2 : 9;
    return {
      x: Math.max(54, Math.min(506, point.x + perpendicular.x * side + outward.x * away)),
      y: Math.max(54, Math.min(506, point.y + perpendicular.y * side + outward.y * away))
    };
  }

  function dilationAttributeImageGeometry(task, scale) {
    const points = task.points.map(point => dilationAttributeScaledScreenPoint(point, scale));
    return {
      points,
      pointString: points.map(point => `${point.x},${point.y}`).join(" "),
      labels: points.map(point => dilationAttributeLabelPoint(point, "image"))
    };
  }

  function updateDilationImageGeometry(svg, task, scale) {
    const geometry = dilationAttributeImageGeometry(task, scale);
    const polygon = svg.querySelector("#dilationImageShape");
    if (polygon) polygon.setAttribute("points", geometry.pointString);
    geometry.points.forEach((point, index) => {
      const marker = svg.querySelector(`[data-dilation-image-point="${index}"]`);
      if (marker) { marker.setAttribute("cx", point.x); marker.setAttribute("cy", point.y); }
      const label = svg.querySelector(`[data-dilation-image-label="${index}"]`);
      if (label) { label.setAttribute("x", geometry.labels[index].x); label.setAttribute("y", geometry.labels[index].y); }
      const ray = svg.querySelector(`[data-dilation-ray="${index}"]`);
      if (ray) { ray.setAttribute("x2", point.x); ray.setAttribute("y2", point.y); }
    });
    const handle = svg.querySelector("[data-dilation-handle]");
    if (handle) { handle.setAttribute("cx", geometry.points[0].x); handle.setAttribute("cy", geometry.points[0].y); }
  }

  function dilationAttributeGraph(task, data) {
    const origin = 280;
    const controlIndex = 0;
    const grid = Array.from({length:21}, (_, index) => index - 10).map(value => {
      const position = origin + value * 24;
      const weight = value === 0 ? " dilation-axis" : value % 2 === 0 ? " dilation-grid-major" : "";
      return `<line class="dilation-grid-line${weight}" x1="${position}" y1="40" x2="${position}" y2="520"></line><line class="dilation-grid-line${weight}" x1="40" y1="${position}" x2="520" y2="${position}"></line>`;
    }).join("");
    const tickLabels = [-10,-8,-6,-4,-2,2,4,6,8,10].map(value => {
      const x = origin + value * 24;
      const y = origin - value * 24;
      return `<text class="dilation-tick-label" x="${x}" y="${origin + 18}" text-anchor="middle">${value}</text><text class="dilation-tick-label" x="${origin - 12}" y="${y + 5}" text-anchor="end">${value}</text>`;
    }).join("");
    const originalPoints = task.points.map(dilationAttributeScreenPoint);
    const pointString = originalPoints.map(point => `${point.x},${point.y}`).join(" ");
    const labels = ["A","B","C","D","E"];
    const originalLabelPoints = originalPoints.map(point => dilationAttributeLabelPoint(point, "original"));
    const originalLabels = originalPoints.map((point,index) => `<text class="dilation-vertex-label original" x="${originalLabelPoints[index].x}" y="${originalLabelPoints[index].y}" text-anchor="middle">${labels[index]}</text>`).join("");
    const imageGeometry = dilationAttributeImageGeometry(task, data.currentScale);
    const imageLabels = imageGeometry.points.map((point,index) => `<text class="dilation-vertex-label image" data-dilation-image-label="${index}" x="${imageGeometry.labels[index].x}" y="${imageGeometry.labels[index].y}" text-anchor="middle">${labels[index]}′</text>`).join("");
    const showImage = data.phase !== "center";
    const locked = data.phase === "sort" || data.completed;
    return `<div class="dilation-coordinate-wrap">
      <svg class="dilation-attribute-svg" id="dilationAttributeGraph" viewBox="0 0 560 560" role="img" aria-label="Coordinate plane with a figure ready to dilate from the origin">
        <rect class="dilation-grid-bg" x="40" y="40" width="480" height="480" rx="12"></rect>
        <g aria-hidden="true">${grid}${tickLabels}<text class="dilation-axis-label" x="528" y="273">x</text><text class="dilation-axis-label" x="290" y="34">y</text></g>
        ${showImage ? `<g class="dilation-rays" aria-hidden="true">${imageGeometry.points.map((point,index) => `<line class="dilation-ray" data-dilation-ray="${index}" x1="${origin}" y1="${origin}" x2="${point.x}" y2="${point.y}"></line>`).join("")}</g><polygon id="dilationImageShape" class="dilation-image-shape${locked ? " is-locked" : ""}" points="${imageGeometry.pointString}"></polygon>` : ""}
        <polygon class="dilation-original-shape" points="${pointString}"></polygon>
        <g class="dilation-original-points">${originalPoints.map(point => `<circle cx="${point.x}" cy="${point.y}" r="5"></circle>`).join("")}${originalLabels}</g>
        ${showImage ? `<g class="dilation-image-points">${imageGeometry.points.map((point,index) => `<circle class="dilation-image-point" data-dilation-image-point="${index}" cx="${point.x}" cy="${point.y}" r="5"></circle>`).join("")}${imageLabels}<circle class="dilation-drag-handle" data-dilation-handle cx="${imageGeometry.points[controlIndex].x}" cy="${imageGeometry.points[controlIndex].y}" r="9" tabindex="0" aria-label="Drag vertex A prime to dilate the entire figure"></circle></g>` : ""}
        <g class="dilation-origin-button${data.phase === "center" ? " is-ready" : " is-selected"}" data-dilation-origin role="button" tabindex="0" aria-label="Choose the origin as the center of dilation"><circle cx="${origin}" cy="${origin}" r="17"></circle><circle cx="${origin}" cy="${origin}" r="6"></circle><text x="${origin - 18}" y="${origin + 30}" text-anchor="end">origin</text></g>
      </svg>
      <div class="dilation-scale-readout"><span>Current scale</span><strong data-scale-readout>${data.currentScale.toFixed(2)}</strong><i>Goal: k = ${task.factorLabel}</i></div>
    </div>`;
  }

  function attachDilationDrag(task, data) {
    const svg = $("#dilationAttributeGraph");
    const handle = svg && svg.querySelector("[data-dilation-handle]");
    if (!svg || !handle || data.phase !== "dilate") return;
    const origin = 280;
    const control = dilationAttributeScreenPoint(task.points[0]);
    const vector = { x: control.x - origin, y: control.y - origin };
    const denominator = vector.x * vector.x + vector.y * vector.y;
    let pointerId = null;

    const updateScale = event => {
      if (!data.dragging) return;
      const rect = svg.getBoundingClientRect();
      const pointer = { x: (event.clientX - rect.left) * 560 / rect.width, y: (event.clientY - rect.top) * 560 / rect.height };
      const offset = { x: pointer.x - origin, y: pointer.y - origin };
      let nextScale = (offset.x * vector.x + offset.y * vector.y) / denominator;
      nextScale = Math.max(.15, Math.min(3.25, nextScale));
      if (Math.abs(nextScale - task.k) < .12) nextScale = task.k;
      else nextScale = Math.round(nextScale * 20) / 20;
      data.currentScale = nextScale;
      updateDilationImageGeometry(svg, task, nextScale);
      const readout = document.querySelector("[data-scale-readout]");
      if (readout) readout.textContent = nextScale.toFixed(2);
    };
    const finish = event => {
      if (!data.dragging) return;
      data.dragging = false;
      if (pointerId !== null && svg.hasPointerCapture(pointerId)) svg.releasePointerCapture(pointerId);
      pointerId = null;
      if (Math.abs(data.currentScale - task.k) < .001) {
        data.phase = "sort";
        renderLab83B();
        setLabFeedback(`You created the ${task.mode}: every point is now ${task.factorLabel} times as far from the origin. Now compare the attributes.`, "correct");
      } else {
        renderLab83B();
        const direction = task.mode === "reduction" ? "closer to the origin" : "farther from the origin";
        setLabFeedback(`You reached k ≈ ${data.currentScale.toFixed(2)}. Drag A′ ${direction} until the scale reads ${task.factorLabel}.`, "incorrect");
      }
    };
    handle.addEventListener("pointerdown", event => {
      event.preventDefault();
      data.dragging = true;
      pointerId = event.pointerId;
      svg.setPointerCapture(pointerId);
      updateScale(event);
    });
    handle.addEventListener("keydown", event => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
      if (direction) {
        event.preventDefault();
        let nextScale = Math.max(.15, Math.min(3.25, data.currentScale + direction * .05));
        if (Math.abs(nextScale - task.k) < .08) nextScale = task.k;
        data.currentScale = nextScale === task.k ? task.k : Math.round(nextScale * 100) / 100;
        updateDilationImageGeometry(svg, task, data.currentScale);
        const readout = document.querySelector("[data-scale-readout]");
        if (readout) readout.textContent = data.currentScale.toFixed(2);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (Math.abs(data.currentScale - task.k) < .001) {
          data.phase = "sort";
          renderLab83B();
          setLabFeedback(`You created the ${task.mode}: every point is now ${task.factorLabel} times as far from the origin. Now compare the attributes.`, "correct");
        } else {
          setLabFeedback(`The scale is ${data.currentScale.toFixed(2)}. Continue adjusting A′ until it reaches ${task.factorLabel}.`, "incorrect");
        }
      }
    });
    svg.addEventListener("pointermove", updateScale);
    svg.addEventListener("pointerup", finish);
    svg.addEventListener("pointercancel", finish);
  }

  function renderLab83B() {
    if (!labRuntime.data) {
      labRuntime.data = { index: 0 };
      resetDilationAttributeTask(labRuntime.data);
    }
    const data = labRuntime.data;
    const task = DILATION_ATTRIBUTE_TASKS[data.index];
    const completedCount = data.index + (data.completed ? 1 : 0);
    const phaseInstruction = data.phase === "center" ? "Select the center of dilation." : data.phase === "dilate" ? `Create a ${task.mode} with k = ${task.factorLabel}.` : "Classify the attributes using evidence from your dilation.";
    setLabProgress(completedCount, DILATION_ATTRIBUTE_TASKS.length, `${task.mode === "reduction" ? "Reduction" : "Enlargement"} ${data.index % 5 + 1} of 5 · ${phaseInstruction}`);

    const remaining = task.attributes.filter(key => !data.placed[key]);
    const changing = task.attributes.filter(key => data.placed[key] === "changes");
    const same = task.attributes.filter(key => data.placed[key] === "same");
    const bank = remaining.map(key => {
      const attribute = DILATION_ATTRIBUTE_BANK[key];
      return `<button type="button" class="dilation-attribute-card${data.selected === key ? " is-selected" : ""}${data.lastWrong === key ? " is-incorrect" : ""}" data-attribute-card="${key}" draggable="true"><strong>${attribute.title}</strong><span>Drag or tap</span></button>`;
    }).join("") || `<div class="dilation-bank-complete">✓ Every attribute classified</div>`;
    const placedCard = key => `<span class="dilation-placed-attribute"><strong>${DILATION_ATTRIBUTE_BANK[key].title}</strong><small>${DILATION_ATTRIBUTE_BANK[key].reason(task)}</small></span>`;

    let coaching;
    if (data.phase === "center") coaching = `<span class="sim-step-chip">Step 1 · Center</span><h4>Choose the center of dilation.</h4><p>Click the glowing origin on the coordinate plane. Every vertex will move along a ray that begins at this point.</p>`;
    else if (data.phase === "dilate") coaching = `<span class="sim-step-chip">Step 2 · Dilate</span><h4>Drag A′ to create the whole ${task.mode}.</h4><p>The figure moves as one unit because every vertex uses the same scale factor. Watch the scale readout and stop at k = ${task.factorLabel}.</p>`;
    else coaching = `<span class="sim-step-chip">Step 3 · Compare</span><h4>What changed—and what did not?</h4><p>Drag each attribute into a category. On a touch screen, tap a card and then tap its category.</p><div class="dilation-attribute-sort"><div class="dilation-attribute-bank"><p class="lab-mini-title">Attributes to classify</p>${bank}</div><div class="dilation-attribute-zones"><section class="dilation-attribute-zone changes" data-attribute-zone="changes" role="button" tabindex="0"><header><strong>Changes</strong><span>multiplied by k or k²</span></header>${changing.map(placedCard).join("")}</section><section class="dilation-attribute-zone same" data-attribute-zone="same" role="button" tabindex="0"><header><strong>Does not change</strong><span>preserved by dilation</span></header>${same.map(placedCard).join("")}</section></div></div><button type="button" class="lab-next" id="nextDilationAttribute" ${data.completed ? "" : "hidden"}>${data.index === DILATION_ATTRIBUTE_TASKS.length - 1 ? "Finish lab" : "Next dilation →"}</button>`;

    $("#standardsLabBody").innerHTML = `<section class="dilation-attribute-shell"><header class="dilation-attribute-header"><div><p class="lab-mini-title">${task.mode === "reduction" ? "Reduce" : "Enlarge"} · Question ${data.index + 1} of 10</p><h4>Dilate the figure by a scale factor of ${task.factorLabel}.</h4><p>One side is horizontal or vertical so you can track corresponding points clearly.</p></div><span class="dilation-mode-chip is-${task.mode}">${task.mode}</span></header><div class="dilation-attribute-layout"><article class="lab-stage-card">${dilationAttributeGraph(task, data)}</article><article class="lab-task-card dilation-coaching-card">${coaching}</article></div></section>`;

    const originButton = document.querySelector("[data-dilation-origin]");
    if (originButton && data.phase === "center") {
      const chooseOrigin = () => {
        data.phase = "dilate";
        data.currentScale = task.mode === "reduction" ? .9 : 1.1;
        renderLab83B();
        setLabFeedback(`Origin selected. Drag A′ along the ray until the scale reads ${task.factorLabel}.`, "correct");
      };
      originButton.addEventListener("click", chooseOrigin);
      originButton.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseOrigin(); } });
    }
    attachDilationDrag(task, data);

    function placeAttribute(key, zone) {
      const attribute = DILATION_ATTRIBUTE_BANK[key];
      if (!attribute || data.placed[key]) return;
      if (attribute.answer !== zone) {
        data.lastWrong = key;
        renderLab83B();
        return setLabFeedback(`Look again: ${attribute.reason(task)}`, "incorrect");
      }
      data.placed[key] = zone;
      data.selected = null;
      data.lastWrong = null;
      if (Object.keys(data.placed).length === task.attributes.length) {
        data.completed = true;
        renderLab83B();
        setLabFeedback(`Exactly. This ${task.mode} changed measurements connected to scale, but preserved angles, orientation, shape, and direction.`, "correct");
      } else {
        renderLab83B();
        setLabFeedback(`Correct. ${attribute.reason(task)}`, "correct");
      }
    }

    document.querySelectorAll("[data-attribute-card]").forEach(card => {
      card.addEventListener("click", () => {
        data.selected = card.dataset.attributeCard;
        data.lastWrong = null;
        renderLab83B();
        setLabFeedback(`${DILATION_ATTRIBUTE_BANK[data.selected].title} selected. Choose whether it changes or does not change.`);
      });
      card.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text/plain", card.dataset.attributeCard);
        event.dataTransfer.effectAllowed = "move";
      });
    });
    document.querySelectorAll("[data-attribute-zone]").forEach(zone => {
      const useSelected = () => { if (data.selected) placeAttribute(data.selected, zone.dataset.attributeZone); };
      zone.addEventListener("click", useSelected);
      zone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); useSelected(); } });
      zone.addEventListener("dragover", event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; });
      zone.addEventListener("dragenter", event => { event.preventDefault(); zone.classList.add("is-ready"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("is-ready"));
      zone.addEventListener("drop", event => {
        event.preventDefault();
        zone.classList.remove("is-ready");
        placeAttribute(event.dataTransfer.getData("text/plain"), zone.dataset.attributeZone);
      });
    });
    const next = $("#nextDilationAttribute");
    if (next) next.addEventListener("click", () => {
      if (data.index === DILATION_ATTRIBUTE_TASKS.length - 1) {
        setLabProgress(10, 10, "All reductions, enlargements, and attribute comparisons complete.");
        showLabCompletion("8.3B");
        return;
      }
      data.index += 1;
      resetDilationAttributeTask(data);
      renderLab83B();
      setLabFeedback("New figure ready. Begin by selecting the origin as the center of dilation.");
    });
  }

  const DILATION_RULE_QUESTIONS = [
    {
      type: "Words → Rule",
      prompt: "Which algebraic rule matches this description?",
      visual: { kind: "words", lead: "Each image point is", factor: "3/2", tail: "times as far from the origin as its corresponding point." },
      choices: [
        { display: { kind: "rule", factor: "3/2" } },
        { display: { kind: "rule", factor: "2/3" }, reason: "This reciprocal would create a reduction, but the description says every distance is multiplied by 3/2." },
        { display: { kind: "translation", dx: 1.5, dy: 1.5 }, reason: "Adding a constant moves every point the same distance; it does not scale distances from the origin." },
        { display: { kind: "mixed", xFactor: "3/2", yFactor: "2/3" }, reason: "A dilation must multiply x and y by the same scale factor." }
      ],
      explanation: "The common multiplier is k = 3/2. Because 3/2 is greater than 1, the rule creates an enlargement centered at the origin."
    },
    {
      type: "Words → Rule",
      prompt: "A figure is reduced so every image point is 2/5 as far from the origin. Which rule represents the dilation?",
      visual: { kind: "distance", factor: "2/5", mode: "reduction" },
      choices: [
        { display: { kind: "rule", factor: "2/5" } },
        { display: { kind: "rule", factor: "5/2" }, reason: "A scale factor of 5/2 is greater than 1, so it would enlarge the figure." },
        { display: { kind: "translation", dx: -.4, dy: -.4 }, reason: "Subtracting 0.4 is a translation rule, not multiplication by a scale factor." },
        { display: { kind: "mixed", xFactor: "2/5", yFactor: "5/2" }, reason: "The two coordinates use different multipliers, so the figure would be distorted rather than dilated." }
      ],
      explanation: "A dilation centered at the origin multiplies both coordinates by k. Here k = 2/5, and 0 < 2/5 < 1, so the image is a reduction."
    },
    {
      type: "Transformation Check",
      prompt: "A rule adds 4 to every x-coordinate and subtracts 2 from every y-coordinate. What transformation does it describe?",
      visual: { kind: "rule", display: { kind: "translation", dx: 4, dy: -2 } },
      choices: [
        { display: { kind: "text", text: "Translation 4 units right and 2 units down" } },
        { display: { kind: "text", text: "Dilation with k = 4" }, reason: "A dilation multiplies coordinates. This rule adds and subtracts constants." },
        { display: { kind: "text", text: "Dilation with k = 2" }, reason: "The −2 is a vertical shift, not a scale factor." },
        { display: { kind: "text", text: "Reflection across the x-axis" }, reason: "A reflection across the x-axis changes y to −y; it does not subtract 2." }
      ],
      explanation: "Translations add or subtract constants from coordinates. Dilations multiply both coordinates by the same positive scale factor."
    },
    {
      type: "Points → Rule",
      prompt: "Which rule maps every point to its image?",
      visual: { kind: "points", rows: [["A", "(2, −3)", "(5, −7.5)"], ["B", "(−4, 2)", "(−10, 5)"]] },
      choices: [
        { display: { kind: "rule", factor: "5/2" } },
        { display: { kind: "rule", factor: "2/5" }, reason: "The image coordinates are larger in magnitude. Dividing image by original gives 5/2, not 2/5." },
        { display: { kind: "translation", dx: 3, dy: -4.5 }, reason: "That change fits point A only. A translation must add the same amounts to every point." },
        { display: { kind: "mixed", xFactor: "5/2", yFactor: "2" }, reason: "For A, −3 becomes −7.5, so y is also multiplied by 5/2." }
      ],
      explanation: "5 ÷ 2 = 5/2 and −7.5 ÷ −3 = 5/2. The same quotient appears for both coordinates and both points."
    },
    {
      type: "Points → Rule",
      prompt: "Find the scale factor and choose the matching rule.",
      visual: { kind: "points", rows: [["M", "(−6, 4)", "(−3, 2)"], ["N", "(2, 8)", "(1, 4)"]] },
      choices: [
        { display: { kind: "rule", factor: "1/2" } },
        { display: { kind: "rule", factor: "2" }, reason: "The image coordinates are half the originals, not twice the originals." },
        { display: { kind: "translation", dx: 3, dy: -2 }, reason: "Those changes do not work for point N. The relationship is multiplication, not a constant shift." },
        { display: { kind: "mixed", xFactor: "1/2", yFactor: "1/4" }, reason: "The y-coordinates are also multiplied by 1/2: 4 becomes 2 and 8 becomes 4." }
      ],
      explanation: "Each image coordinate is one-half of its original coordinate. The scale factor k = 1/2 creates a reduction."
    },
    {
      type: "Points → Rule",
      prompt: "Which algebraic rule explains both mappings?",
      visual: { kind: "points", rows: [["P", "(3, 6)", "(6, 12)"], ["Q", "(−2, 5)", "(−4, 10)"]] },
      choices: [
        { display: { kind: "rule", factor: "2" } },
        { display: { kind: "translation", dx: 3, dy: 6 }, reason: "That shift matches point P only. Point Q uses a different change, so this is not a translation." },
        { display: { kind: "rule", factor: "1/2" }, reason: "The coordinates double from original to image; 1/2 would reverse the mapping." },
        { display: { kind: "mixed", xFactor: "2", yFactor: "3" }, reason: "The y-coordinates double too: 6 becomes 12 and 5 becomes 10." }
      ],
      explanation: "Every coordinate is multiplied by 2. The common multiplier is the scale factor, so the figure is enlarged by k = 2."
    },
    {
      type: "Graph → Rule",
      prompt: "Use the labeled vertices to identify the dilation rule.",
      visual: { kind: "graph", points: [[2,2],[3,2],[2,3]], labels: ["A","B","C"], factor: 2 },
      choices: [
        { display: { kind: "rule", factor: "2" } },
        { display: { kind: "translation", dx: 1, dy: 1 }, reason: "The movement is not a constant shift. For example, B(3,2) maps to B′(6,4)." },
        { display: { kind: "rule", factor: "1/2" }, reason: "The purple image is farther from the origin, so the scale factor must be greater than 1." },
        { display: { kind: "mixed", xFactor: "2", yFactor: "1" }, reason: "Both coordinates double, including the y-coordinates." }
      ],
      explanation: "A(2,2) maps to A′(4,4), and every other coordinate also doubles. This is an enlargement with k = 2."
    },
    {
      type: "Graph → Rule",
      prompt: "Which rule maps the teal figure to the purple figure?",
      visual: { kind: "graph", points: [[6,-8],[8,-8],[8,-6]], labels: ["D","E","F"], factor: .5 },
      choices: [
        { display: { kind: "rule", factor: "1/2" } },
        { display: { kind: "translation", dx: -2, dy: 4 }, reason: "The coordinate changes are not constant for every vertex. Each coordinate is halved." },
        { display: { kind: "rule", factor: "2" }, reason: "The purple image is closer to the origin, so this is a reduction rather than an enlargement." },
        { display: { kind: "mixed", xFactor: "1/2", yFactor: "2" }, reason: "The y-coordinate −8 becomes −4, which is multiplication by 1/2, not 2." }
      ],
      explanation: "D(6,−8) maps to D′(3,−4). Both coordinates of every point are multiplied by 1/2."
    },
    {
      type: "Graph → Rule",
      prompt: "The origin is the center of dilation. Select the rule that produces the image.",
      visual: { kind: "graph", points: [[-4,4],[-3,4],[-3,5],[-4,5]], labels: ["G","H","J","K"], factor: 1.5 },
      choices: [
        { display: { kind: "rule", factor: "3/2" } },
        { display: { kind: "rule", factor: "2/3" }, reason: "The purple image is farther from the origin. A factor of 2/3 would move points closer." },
        { display: { kind: "translation", dx: -2, dy: 1 }, reason: "The vertices do not all move by the same horizontal and vertical amounts." },
        { display: { kind: "mixed", xFactor: "3/2", yFactor: "2" }, reason: "For example, G(−4,4) maps to G′(−6,6), so y is multiplied by 3/2 too." }
      ],
      explanation: "G(−4,4) maps to G′(−6,6). The common coordinate multiplier is 3/2, so the figure is enlarged."
    },
    {
      type: "Graph → Rule",
      prompt: "Determine the algebraic rule from the two figures.",
      visual: { kind: "graph", points: [[-9,-6],[-6,-6],[-6,-9]], labels: ["L","M","N"], factor: 1/3 },
      choices: [
        { display: { kind: "rule", factor: "1/3" } },
        { display: { kind: "rule", factor: "3" }, reason: "The image is closer to the origin, so the factor must be between 0 and 1." },
        { display: { kind: "translation", dx: 6, dy: 4 }, reason: "That change fits L only. A dilation uses multiplication and works for every vertex." },
        { display: { kind: "mixed", xFactor: "1/3", yFactor: "1/2" }, reason: "L(−9,−6) maps to L′(−3,−2), so both coordinates use 1/3." }
      ],
      explanation: "Dividing each image coordinate by its corresponding original coordinate gives 1/3. The image is a reduction."
    },
    {
      type: "Misconception Check",
      prompt: "A student says this mapping is a dilation centered at the origin. Which statement is correct?",
      visual: { kind: "points", warning: true, rows: [["R", "(2, 4)", "(4, 12)"], ["S", "(−3, 2)", "(−6, 6)"]] },
      choices: [
        { display: { kind: "text", text: "It is not a dilation because x is multiplied by 2 while y is multiplied by 3." } },
        { display: { kind: "text", text: "It is a dilation with k = 2." }, reason: "The x-coordinates use 2, but the y-coordinates use 3. A dilation needs one common multiplier." },
        { display: { kind: "text", text: "It is a dilation with k = 3." }, reason: "The y-coordinates use 3, but the x-coordinates use 2." },
        { display: { kind: "text", text: "It is a translation 2 units right and 8 units up." }, reason: "The changes are not constant from point R to point S, so it is not that translation." }
      ],
      explanation: "A true dilation uses one positive rational scale factor for every coordinate. Two different factors change the figure’s proportions."
    },
    {
      type: "Misconception Check",
      prompt: "Does one scale factor explain this mapping?",
      visual: { kind: "points", warning: true, rows: [["T", "(−6, 3)", "(−3, 1)"], ["U", "(9, −6)", "(4.5, −2)"]] },
      choices: [
        { display: { kind: "text", text: "No. The x-values use 1/2, but the y-values use 1/3." } },
        { display: { kind: "text", text: "Yes. The scale factor is 1/2." }, reason: "The x-values are halved, but 3 becomes 1 and −6 becomes −2, so y uses 1/3." },
        { display: { kind: "text", text: "Yes. The scale factor is 1/3." }, reason: "The y-values use 1/3, but the x-values use 1/2." },
        { display: { kind: "text", text: "Yes. The scale factor is 2." }, reason: "The image coordinates are smaller in magnitude, and the coordinate ratios are not both 2." }
      ],
      explanation: "Because the x- and y-coordinates do not share the same multiplier, the image is distorted. It is not a dilation centered at the origin."
    },
    {
      type: "Scale Factor Meaning",
      prompt: "What does this rule tell you about the scale factor and the image?",
      visual: { kind: "rule", display: { kind: "rule", factor: "3/4" } },
      choices: [
        { display: { kind: "text", text: "k = 3/4; the image is a reduction." } },
        { display: { kind: "text", text: "k = 4/3; the image is an enlargement." }, reason: "The scale factor is the number actually multiplying x and y: 3/4, not its reciprocal." },
        { display: { kind: "text", text: "k = 3; the image is an enlargement." }, reason: "The entire fraction 3/4 is the multiplier." },
        { display: { kind: "text", text: "The rule describes a translation." }, reason: "Both coordinates are multiplied by the same number, which is the structure of a dilation." }
      ],
      explanation: "The scale factor is k = 3/4. Since it lies between 0 and 1, every image point is closer to the origin."
    },
    {
      type: "Transformation Check",
      prompt: "Which rule represents a dilation centered at the origin?",
      visual: { kind: "compare", note: "Look for multiplication by one common factor." },
      choices: [
        { display: { kind: "rule", factor: "0.6" } },
        { display: { kind: "translation", dx: 2, dy: 2 }, reason: "Adding 2 to both coordinates translates the figure." },
        { display: { kind: "text", text: "(x, y) → (x, −y)" }, reason: "Changing y to −y reflects the figure across the x-axis." },
        { display: { kind: "mixed", xFactor: "0.6", yFactor: "1.6" }, reason: "Different coordinate multipliers distort the figure; they do not create a dilation." }
      ],
      explanation: "The rule (x, y) → (0.6x, 0.6y) multiplies both coordinates by the same positive factor. It is a reduction because 0.6 is less than 1."
    },
    {
      type: "Synthesis",
      prompt: "A figure is dilated by k = 5/2 from the origin. Which statement and point mapping are both correct?",
      visual: { kind: "distance", factor: "5/2", mode: "enlargement" },
      choices: [
        { display: { kind: "mappingEffect", text: "Enlargement", from: "(−2, 4)", to: "(−5, 10)" } },
        { display: { kind: "mappingEffect", text: "Reduction", from: "(−2, 4)", to: "(−5, 10)" }, reason: "The mapping is correct, but 5/2 is greater than 1, so it creates an enlargement." },
        { display: { kind: "mappingEffect", text: "Enlargement", from: "(−2, 4)", to: "(−0.8, 1.6)" }, reason: "Those coordinates result from multiplying by 2/5, the reciprocal scale factor." },
        { display: { kind: "mappingEffect", text: "Translation", from: "(−2, 4)", to: "(0.5, 6.5)" }, reason: "Adding 2.5 is not the same as multiplying each coordinate by 5/2." }
      ],
      explanation: "Multiplying −2 and 4 by 5/2 gives −5 and 10. Since 5/2 > 1, the image is an enlargement."
    }
  ];

  function dilationFactorMarkup(value) {
    const textValue = String(value);
    if (!textValue.includes("/")) return escapeHTML(textValue);
    const [top, bottom] = textValue.split("/");
    return `<span class="dilation-rule-fraction"><span>${escapeHTML(top)}</span><span>${escapeHTML(bottom)}</span></span>`;
  }

  function signedCoordinate(variable, amount) {
    if (amount === 0) return variable;
    return `${variable} ${amount > 0 ? "+" : "−"} ${Math.abs(amount)}`;
  }

  function dilationRuleChoiceMarkup(display) {
    if (display.kind === "rule") {
      const factor = dilationFactorMarkup(display.factor);
      return `<span class="dilation-rule-expression">(x, y) → (${factor}x, ${factor}y)</span>`;
    }
    if (display.kind === "translation") {
      return `<span class="dilation-rule-expression">(x, y) → (${signedCoordinate("x", display.dx)}, ${signedCoordinate("y", display.dy)})</span>`;
    }
    if (display.kind === "mixed") {
      return `<span class="dilation-rule-expression">(x, y) → (${dilationFactorMarkup(display.xFactor)}x, ${dilationFactorMarkup(display.yFactor)}y)</span>`;
    }
    if (display.kind === "mappingEffect") {
      return `<span class="dilation-mapping-effect"><strong>${escapeHTML(display.text)}</strong><span>${escapeHTML(display.from)} → ${escapeHTML(display.to)}</span></span>`;
    }
    return `<span>${escapeHTML(display.text)}</span>`;
  }

  function dilationPointsTable(rows, warning = false) {
    return `<div class="dilation-point-stimulus${warning ? " is-warning" : ""}"><div class="dilation-point-key"><span class="is-original">teal · original</span><span class="is-image">purple · image</span></div><table><thead><tr><th>Point</th><th>Original</th><th>Image</th></tr></thead><tbody>${rows.map(([label, original, image]) => `<tr><th>${escapeHTML(label)} → ${escapeHTML(label)}′</th><td>${escapeHTML(original)}</td><td>${escapeHTML(image)}</td></tr>`).join("")}</tbody></table>${warning ? `<p><strong>Check:</strong> Is the same multiplier used for x and y?</p>` : ""}</div>`;
  }

  function dilationRuleGraph(visual) {
    const origin = 210;
    const unit = 17;
    const toScreen = ([x, y]) => [origin + x * unit, origin - y * unit];
    const imagePoints = visual.points.map(([x, y]) => [x * visual.factor, y * visual.factor]);
    const originalScreen = visual.points.map(toScreen);
    const imageScreen = imagePoints.map(toScreen);
    const grid = Array.from({ length: 21 }, (_, index) => index - 10).map(value => {
      const position = origin + value * unit;
      const className = value === 0 ? " is-axis" : value % 5 === 0 ? " is-major" : "";
      return `<line class="dilation-rule-grid${className}" x1="40" y1="${position}" x2="380" y2="${position}"></line><line class="dilation-rule-grid${className}" x1="${position}" y1="40" x2="${position}" y2="380"></line>`;
    }).join("");
    const labels = [-10,-5,5,10].map(value => {
      const horizontal = origin + value * unit;
      const vertical = origin - value * unit;
      return `<text class="dilation-rule-tick" x="${horizontal}" y="${origin + 17}" text-anchor="middle">${value}</text><text class="dilation-rule-tick" x="${origin - 10}" y="${vertical + 4}" text-anchor="end">${value}</text>`;
    }).join("");
    const polygon = points => points.map(([x,y]) => `${x},${y}`).join(" ");
    const pointMarkup = (points, coordinatePoints, prime) => {
      const center = points.reduce((sum, [x,y]) => ({ x: sum.x + x / points.length, y: sum.y + y / points.length }), { x: 0, y: 0 });
      return points.map(([x,y], index) => {
        const dx = x - center.x;
        const dy = y - center.y;
        const distance = Math.hypot(dx, dy) || 1;
        const labelX = Math.max(50, Math.min(370, x + dx / distance * 17));
        const labelY = Math.max(50, Math.min(370, y + dy / distance * 17));
        return `<circle cx="${x}" cy="${y}" r="5"></circle><text x="${labelX}" y="${labelY}" text-anchor="middle">${escapeHTML(visual.labels[index])}${prime ? "′" : ""}</text>`;
      }).join("");
    };
    const coordinateLine = (points, prime) => points.map((point, index) => `${visual.labels[index]}${prime ? "′" : ""}(${point[0]}, ${point[1]})`).join(" · ");
    return `<div class="dilation-rule-graph-wrap"><svg class="dilation-rule-graph" viewBox="0 0 420 420" role="img" aria-label="Coordinate plane showing an original figure and its dilation from the origin"><rect x="40" y="40" width="340" height="340" rx="14"></rect>${grid}${labels}<text class="dilation-rule-axis-label" x="389" y="204">x</text><text class="dilation-rule-axis-label" x="219" y="31">y</text><polygon class="dilation-rule-image" points="${polygon(imageScreen)}"></polygon><polygon class="dilation-rule-original" points="${polygon(originalScreen)}"></polygon><g class="dilation-rule-image-points">${pointMarkup(imageScreen, imagePoints, true)}</g><g class="dilation-rule-original-points">${pointMarkup(originalScreen, visual.points, false)}</g><circle class="dilation-rule-origin" cx="${origin}" cy="${origin}" r="5"></circle></svg><div class="dilation-coordinate-list"><p><span class="is-original">Original</span>${escapeHTML(coordinateLine(visual.points, false))}</p><p><span class="is-image">Image</span>${escapeHTML(coordinateLine(imagePoints, true))}</p></div></div>`;
  }

  function dilationRuleStimulusMarkup(visual) {
    if (visual.kind === "graph") return dilationRuleGraph(visual);
    if (visual.kind === "points") return dilationPointsTable(visual.rows, visual.warning);
    if (visual.kind === "rule") return `<div class="dilation-large-rule">${dilationRuleChoiceMarkup(visual.display)}</div>`;
    if (visual.kind === "words") return `<div class="dilation-word-visual"><span>${escapeHTML(visual.lead)}</span><strong>${dilationFactorMarkup(visual.factor)}</strong><span>${escapeHTML(visual.tail)}</span><i>same factor · both coordinates</i></div>`;
    if (visual.kind === "distance") return `<div class="dilation-distance-visual is-${visual.mode}"><span class="dilation-origin-dot">origin</span><span class="dilation-distance-ray"></span><span class="dilation-distance-point is-original">P</span><span class="dilation-distance-point is-image">P′</span><strong>k = ${dilationFactorMarkup(visual.factor)}</strong><small>${visual.mode === "reduction" ? "Image points move closer to the origin" : "Image points move farther from the origin"}</small></div>`;
    return `<div class="dilation-compare-visual"><span>+ or − constants</span><b>translation</b><i>versus</i><span>× one common factor</span><b>dilation</b><p>${escapeHTML(visual.note)}</p></div>`;
  }

  function renderLab83C() {
    if (!labRuntime.data) {
      const desiredPositions = [1,3,0,2,1,0,3,2,0,1,2,3,1,0,2];
      labRuntime.data = {
        index: 0,
        selected: null,
        wrong: null,
        answered: false,
        orders: DILATION_RULE_QUESTIONS.map((question, index) => similarityChoiceOrder(question.choices.length, 0, desiredPositions[index]))
      };
    }
    const data = labRuntime.data;
    const question = DILATION_RULE_QUESTIONS[data.index];
    const completed = data.index + (data.answered ? 1 : 0);
    setLabProgress(completed, DILATION_RULE_QUESTIONS.length, `${question.type} · Question ${data.index + 1} of 15`);

    const choices = data.orders[data.index].map((choiceIndex, displayedIndex) => {
      const choice = question.choices[choiceIndex];
      const classes = ["dilation-rule-choice"];
      if (data.selected === choiceIndex) classes.push("is-selected");
      if (data.wrong === choiceIndex) classes.push("is-incorrect");
      if (data.answered && choiceIndex === 0) classes.push("is-correct");
      return `<button type="button" class="${classes.join(" ")}" data-dilation-rule-choice="${choiceIndex}" ${data.answered ? "disabled" : ""}><span class="dilation-choice-letter">${String.fromCharCode(65 + displayedIndex)}</span><span class="dilation-choice-content">${dilationRuleChoiceMarkup(choice.display)}</span></button>`;
    }).join("");

    const connection = data.answered ? `<div class="dilation-rule-connection"><strong>Connection</strong><p>${escapeHTML(question.explanation)}</p></div>` : "";
    $("#standardsLabBody").innerHTML = `<section class="dilation-rule-shell"><header class="dilation-rule-header"><div><p class="lab-mini-title">${escapeHTML(question.type)} · Question ${data.index + 1} of 15</p><h4>${escapeHTML(question.prompt)}</h4></div><span class="dilation-rule-chip">k connects both coordinates</span></header><div class="dilation-rule-layout"><article class="dilation-rule-stimulus">${dilationRuleStimulusMarkup(question.visual)}</article><article class="dilation-rule-response"><p class="dilation-response-prompt">Choose the best answer.</p><div class="dilation-rule-choice-grid">${choices}</div>${connection}<div class="dilation-rule-actions"><button type="button" class="lab-action" id="checkDilationRule" ${data.selected === null || data.answered ? "hidden" : ""}>Check answer</button><button type="button" class="lab-next" id="nextDilationRule" ${data.answered ? "" : "hidden"}>${data.index === DILATION_RULE_QUESTIONS.length - 1 ? "Finish lab" : "Next connection →"}</button></div></article></div></section>`;

    document.querySelectorAll("[data-dilation-rule-choice]").forEach(button => button.addEventListener("click", () => {
      data.selected = Number(button.dataset.dilationRuleChoice);
      data.wrong = null;
      renderLab83C();
      setLabFeedback("Answer selected. Check it when you are ready.");
    }));

    const check = $("#checkDilationRule");
    if (check) check.addEventListener("click", () => {
      if (data.selected === 0) {
        data.answered = true;
        data.wrong = null;
        renderLab83C();
        setLabFeedback(question.explanation, "correct");
      } else {
        data.wrong = data.selected;
        const reason = question.choices[data.selected].reason || "Use one common multiplier for both coordinates and compare the rule with every point.";
        renderLab83C();
        setLabFeedback(reason, "incorrect");
      }
    });

    const next = $("#nextDilationRule");
    if (next) next.addEventListener("click", () => {
      if (data.index === DILATION_RULE_QUESTIONS.length - 1) {
        setLabProgress(15, 15, "All algebraic dilation connections complete.");
        showLabCompletion("8.3C");
        return;
      }
      data.index += 1;
      data.selected = null;
      data.wrong = null;
      data.answered = false;
      renderLab83C();
      setLabFeedback("New representation ready. Look for one common multiplier on both coordinates.");
    });
  }

  function renderLab82A() {
    const cards = [
      { id: "root25", display: "√25", plain: "the square root of 25", answer: "natural", explain: "√25 = 5, so its most specific home is Natural.", hint: "Simplify the square root first. Is the result a counting number?" },
      { id: "eighteenThirds", display: "18⁄3", plain: "18 divided by 3", answer: "natural", explain: "18⁄3 = 6, so its most specific home is Natural.", hint: "Simplify the fraction before you classify it." },
      { id: "zero", display: "0", plain: "zero", answer: "whole", explain: "Zero is a whole number, but it is not a natural number in this course.", hint: "Zero is the first value added when natural numbers expand to whole numbers." },
      { id: "negativeDecimal", display: "−6.0000", plain: "negative 6 point 0000", answer: "integer", explain: "−6.0000 equals −6, so its most specific home is Integer.", hint: "Ending zeros do not change the value. Rewrite the number without them." },
      { id: "negativeFraction", display: "−20⁄5", plain: "negative 20 divided by 5", answer: "integer", explain: "−20⁄5 = −4, so its most specific home is Integer.", hint: "Simplify the negative fraction before you classify it." },
      { id: "sevenTwelfths", display: "7⁄12", plain: "7 twelfths", answer: "rational", explain: "7⁄12 is a ratio of two integers and is not an integer, so it belongs in Rational.", hint: "A fraction made from two integers is rational when its denominator is not zero." },
      { id: "terminating", display: "2.375", plain: "2 point 375", answer: "rational", explain: "2.375 terminates, so it is rational but not an integer.", hint: "A terminating decimal can be written as a fraction." },
      { id: "repeating", display: "0.<span class=\"repeat-digits\">36</span>", plain: "zero point 36 repeating", answer: "rational", explain: "A repeating decimal can be written as a fraction, so it is Rational.", hint: "A nonterminating decimal is rational when a digit or group of digits repeats." },
      { id: "root7", display: "√7", plain: "the square root of 7", answer: "irrational", explain: "Seven is not a perfect square, so √7 is Irrational.", hint: "Ask whether the number under the radical is a perfect square." },
      { id: "pi", display: "π", plain: "pi", answer: "irrational", explain: "π is nonterminating and nonrepeating, so it is Irrational.", hint: "This constant cannot be written as a ratio of two integers." }
    ];
    const zones = [
      { id: "rational", symbol: "Q", title: "Rational", note: "Not an integer" },
      { id: "integer", symbol: "Z", title: "Integer", note: "Not whole" },
      { id: "whole", symbol: "W", title: "Whole", note: "Not natural" },
      { id: "natural", symbol: "N", title: "Natural", note: "Counting numbers" },
      { id: "irrational", symbol: "I", title: "Irrational", note: "Nonterminating, nonrepeating" }
    ];
    if (!labRuntime.data) {
      labRuntime.data = { phase: "sort", placed: {}, selected: null, visualIndex: 0, visualSelected: null, visualAnswered: false };
    }
    const data = labRuntime.data;

    const pairInside = (inner, outer) => `<span class="mini-set pair-inside"><span class="mini-set-label">${outer}</span><span class="mini-set inner"><span class="mini-set-label">${inner}</span></span></span>`;
    const pairSeparate = (first, second, universe = "") => `<span class="mini-set pair-universe"><span class="mini-set-label">${universe}</span><span class="mini-bubble first">${first}</span><span class="mini-bubble second">${second}</span></span>`;
    const pairOverlap = (first, second, universe = "") => `<span class="mini-set pair-universe overlap"><span class="mini-set-label">${universe}</span><span class="mini-bubble first">${first}</span><span class="mini-bubble second">${second}</span></span>`;
    const oneOutside = (inside, outside) => `<span class="outside-diagram"><span class="mini-set"><span class="mini-set-label">R</span><span class="mini-bubble first">${inside}</span></span><span class="mini-bubble outside">${outside}</span></span>`;
    const fullSystem = mode => {
      if (mode === "correct") return `<span class="full-set real"><b>R</b><span class="full-set rational"><b>Q</b><span class="full-set integer"><b>Z</b><span class="full-set whole"><b>W</b><span class="full-set natural"><b>N</b></span></span></span></span><span class="full-irrational">I</span></span>`;
      if (mode === "reverse") return `<span class="full-set real"><b>R</b><span class="full-set natural reverse"><b>N</b><span class="full-set whole"><b>W</b><span class="full-set integer"><b>Z</b><span class="full-set rational"><b>Q</b></span></span></span></span><span class="full-irrational">I</span></span>`;
      if (mode === "irrational-in-q") return `<span class="full-set real"><b>R</b><span class="full-set rational wide"><b>Q</b><span class="full-set integer"><b>Z</b><span class="full-set whole"><b>W</b><span class="full-set natural"><b>N</b></span></span></span><span class="full-irrational inside">I</span></span></span>`;
      return `<span class="full-set real"><b>R</b><span class="split-bubbles"><i>N</i><i>W</i><i>Z</i><i>Q</i></span><span class="full-irrational">I</span></span>`;
    };
    const visualQuestions = [
      {
        prompt: "Which visual correctly shows the relationship between natural numbers N and whole numbers W?",
        explanation: "Every natural number is a whole number, so N must be completely inside W.",
        correct: 1,
        options: [pairSeparate("N", "W"), pairInside("N", "W"), pairInside("W", "N"), pairOverlap("N", "W")]
      },
      {
        prompt: "Which visual correctly shows the relationship between whole numbers W and integers Z?",
        explanation: "Every whole number is an integer, so W must be completely inside Z.",
        correct: 3,
        options: [pairOverlap("W", "Z"), pairInside("Z", "W"), pairSeparate("W", "Z"), pairInside("W", "Z")]
      },
      {
        prompt: "Which visual correctly shows the relationship between integers Z and rational numbers Q?",
        explanation: "Every integer can be written as a fraction, so Z must be completely inside Q.",
        correct: 0,
        options: [pairInside("Z", "Q"), pairInside("Q", "Z"), pairSeparate("Z", "Q"), pairOverlap("Z", "Q")]
      },
      {
        prompt: "Which visual correctly places rational numbers Q and irrational numbers I inside the real numbers R?",
        explanation: "Rational and irrational numbers are separate sets, but both belong inside the real numbers.",
        correct: 2,
        options: [pairInside("Q", "I"), pairOverlap("Q", "I", "R"), pairSeparate("Q", "I", "R"), oneOutside("Q", "I")]
      },
      {
        prompt: "Which visual correctly represents the complete real-number system?",
        explanation: "N is inside W, W is inside Z, Z is inside Q, and both Q and I are inside R without overlapping.",
        correct: 1,
        options: [fullSystem("reverse"), fullSystem("correct"), fullSystem("split"), fullSystem("irrational-in-q")]
      }
    ];

    function placedChip(card) {
      return `<span class="placed-number" aria-label="${card.plain}">${formatNumberDisplay(card.display)}</span>`;
    }

    function numberCard(card) {
      const selected = data.selected === card.id;
      return `<button type="button" class="number-card${selected ? " is-selected" : ""}" data-82-card="${card.id}" draggable="true" aria-label="Select ${card.plain}"><strong>${formatNumberDisplay(card.display)}</strong><span>Drag or tap</span></button>`;
    }

    function placeCard(cardId, zoneId) {
      const card = cards.find(item => item.id === cardId);
      if (!card || data.placed[cardId]) return;
      if (card.answer !== zoneId) {
        data.selected = cardId;
        renderLab82A();
        setLabFeedback(`Not there yet. ${card.hint}`, "incorrect");
        return;
      }
      data.placed[cardId] = zoneId;
      data.selected = null;
      const completed = Object.keys(data.placed).length;
      renderLab82A();
      setLabFeedback(completed === cards.length ? "Excellent classification. All 10 numbers are in their most specific homes. Continue to the visual relationships." : `Correct! ${card.explain}`, "correct");
    }

    if (data.phase === "sort") {
      const placedCount = Object.keys(data.placed).length;
      const remaining = cards.filter(card => !data.placed[card.id]);
      setLabProgress(placedCount, 15, "Place each number in its most specific category.");
      $("#standardsLabBody").innerHTML = `
        <div class="number-sort-layout">
          <section class="real-number-map" aria-label="Real number system sorting map">
            <header><strong>Real Numbers <span>R</span></strong><small>Every card in this lab belongs somewhere inside R.</small></header>
            <div class="number-map-grid">
              <div class="rational-family">
                <div class="family-heading"><strong>Rational Numbers <span>Q</span></strong><small>Q ⊃ Z ⊃ W ⊃ N</small></div>
                <div class="rational-zone-grid">
                  ${zones.slice(0, 4).map(zone => `<section class="number-drop-zone" data-82-zone="${zone.id}" data-kind="${zone.id}" role="button" tabindex="0" aria-label="Place selected number in ${zone.title}"><header><b>${zone.symbol}</b><span><strong>${zone.title}</strong><small>${zone.note}</small></span></header><div class="placed-number-list">${cards.filter(card => data.placed[card.id] === zone.id).map(placedChip).join("")}</div></section>`).join("")}
                </div>
              </div>
              ${zones.slice(4).map(zone => `<section class="number-drop-zone irrational-zone" data-82-zone="${zone.id}" data-kind="${zone.id}" role="button" tabindex="0" aria-label="Place selected number in ${zone.title}"><header><b>${zone.symbol}</b><span><strong>${zone.title}</strong><small>${zone.note}</small></span></header><div class="placed-number-list">${cards.filter(card => data.placed[card.id] === zone.id).map(placedChip).join("")}</div></section>`).join("")}
            </div>
          </section>
          <aside class="number-bank-card">
            <p class="lab-mini-title">Number cards</p>
            <h4>${remaining.length ? `${remaining.length} left to classify` : "All cards classified"}</h4>
            <p>Drag a card to the map. On a touch screen, tap a card and then tap its category.</p>
            <div class="number-card-bank">${remaining.map(numberCard).join("") || `<div class="bank-complete">✓ Part 1 complete</div>`}</div>
            <button type="button" class="lab-next continue-visuals" id="continue82Visuals" ${placedCount === cards.length ? "" : "hidden"}>Continue to visual relationships →</button>
          </aside>
        </div>`;

      document.querySelectorAll("[data-82-card]").forEach(button => {
        button.addEventListener("click", () => {
          data.selected = button.getAttribute("data-82-card");
          renderLab82A();
          const card = cards.find(item => item.id === data.selected);
          setLabFeedback(`${card.display.replace(/<[^>]+>/g, "")} selected. Now choose its most specific category.`);
        });
        button.addEventListener("dragstart", event => {
          event.dataTransfer.setData("text/plain", button.getAttribute("data-82-card"));
          event.dataTransfer.effectAllowed = "move";
        });
      });
      document.querySelectorAll("[data-82-zone]").forEach(zone => {
        const assignSelected = () => { if (data.selected) placeCard(data.selected, zone.getAttribute("data-82-zone")); };
        zone.addEventListener("click", assignSelected);
        zone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); assignSelected(); } });
        zone.addEventListener("dragover", event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; });
        zone.addEventListener("dragenter", event => { event.preventDefault(); zone.classList.add("is-ready"); });
        zone.addEventListener("dragleave", () => zone.classList.remove("is-ready"));
        zone.addEventListener("drop", event => {
          event.preventDefault();
          zone.classList.remove("is-ready");
          placeCard(event.dataTransfer.getData("text/plain"), zone.getAttribute("data-82-zone"));
        });
      });
      const continueButton = $("#continue82Visuals");
      if (continueButton) continueButton.addEventListener("click", () => {
        data.phase = "visual";
        data.visualIndex = 0;
        data.visualSelected = null;
        data.visualAnswered = false;
        renderLab82A();
        setLabFeedback("Part 2: choose the diagram that shows the correct relationship between the number sets.");
      });
      return;
    }

    const question = visualQuestions[data.visualIndex];
    const completedVisuals = data.visualIndex + (data.visualAnswered ? 1 : 0);
    setLabProgress(10 + completedVisuals, 15, `Visual relationship ${data.visualIndex + 1} of 5.`);
    $("#standardsLabBody").innerHTML = `
      <section class="visual-question-card">
        <div class="set-key" aria-label="Number set key"><span><b>N</b> Natural</span><span><b>W</b> Whole</span><span><b>Z</b> Integer</span><span><b>Q</b> Rational</span><span><b>I</b> Irrational</span><span><b>R</b> Real</span></div>
        <p class="lab-mini-title">Visual relationship ${data.visualIndex + 1} of 5</p>
        <h4>${question.prompt}</h4>
        <div class="visual-answer-grid">
          ${question.options.map((option, index) => `<button type="button" class="visual-choice${data.visualSelected === index ? " is-selected" : ""}${data.visualAnswered && index === question.correct ? " is-correct" : ""}" data-82-visual="${index}" aria-label="Diagram option ${index + 1}" ${data.visualAnswered ? "disabled" : ""}><span class="option-number">${index + 1}</span><span class="diagram-stage">${option}</span></button>`).join("")}
        </div>
        <div class="visual-actions"><button type="button" class="lab-action" id="check82Visual" ${data.visualAnswered ? "disabled" : ""}>Check visual</button><button type="button" class="lab-next" id="next82Visual" ${data.visualAnswered ? "" : "hidden"}>${data.visualIndex === visualQuestions.length - 1 ? "Finish lab" : "Next relationship →"}</button></div>
      </section>`;
    document.querySelectorAll("[data-82-visual]").forEach(button => button.addEventListener("click", () => {
      data.visualSelected = Number(button.getAttribute("data-82-visual"));
      renderLab82A();
      setLabFeedback("Diagram selected. Check the visual when you are ready.");
    }));
    $("#check82Visual").addEventListener("click", () => {
      if (data.visualSelected === null) return setLabFeedback("Choose one of the four diagrams first.", "incorrect");
      if (data.visualSelected !== question.correct) return setLabFeedback("Look again: which set contains every member of the smaller set?", "incorrect");
      data.visualAnswered = true;
      renderLab82A();
      setLabFeedback(`Correct! ${question.explanation}`, "correct");
    });
    const nextVisual = $("#next82Visual");
    if (nextVisual) nextVisual.addEventListener("click", () => {
      if (data.visualIndex === visualQuestions.length - 1) {
        setLabProgress(15, 15, "All classifications and visual relationships complete.");
        showLabCompletion("8.2A");
        return;
      }
      data.visualIndex += 1;
      data.visualSelected = null;
      data.visualAnswered = false;
      renderLab82A();
      setLabFeedback("Study the containment carefully, then choose the next visual.");
    });
  }

  function renderLab82B() {
    const lineQuestions = [
      {
        min: 2, max: 6,
        roots: [
          { id: "r8", radicand: 8, answer: "high-2" },
          { id: "r9", radicand: 9, answer: "exact-3" },
          { id: "r13", radicand: 13, answer: "high-3" },
          { id: "r26", radicand: 26, answer: "low-5" }
        ]
      },
      {
        min: 4, max: 8,
        roots: [
          { id: "r25", radicand: 25, answer: "exact-5" },
          { id: "r30", radicand: 30, answer: "low-5" },
          { id: "r31", radicand: 31, answer: "high-5" },
          { id: "r50", radicand: 50, answer: "low-7" }
        ]
      },
      {
        min: 6, max: 10,
        roots: [
          { id: "r41", radicand: 41, answer: "low-6" },
          { id: "r49", radicand: 49, answer: "exact-7" },
          { id: "r57", radicand: 57, answer: "high-7" },
          { id: "r82", radicand: 82, answer: "low-9" }
        ]
      },
      {
        min: 8, max: 12,
        roots: [
          { id: "r81", radicand: 81, answer: "exact-9" },
          { id: "r90", radicand: 90, answer: "low-9" },
          { id: "r91", radicand: 91, answer: "high-9" },
          { id: "r118", radicand: 118, answer: "high-10" }
        ]
      },
      {
        min: 10, max: 14,
        roots: [
          { id: "r121", radicand: 121, answer: "exact-11" },
          { id: "r133", radicand: 133, answer: "high-11" },
          { id: "r152", radicand: 152, answer: "low-12" },
          { id: "r168", radicand: 168, answer: "high-12" }
        ]
      }
    ];
    const applicationQuestions = [
      {
        prompt: "A square community garden has an area of 72 square meters. Which measurement is closest to the length of one side?",
        choices: ["8.5 m", "18 m", "36 m", "7.2 m"], correct: 0,
        explanation: "The side length is √72. Since 64 < 72 < 81, the answer is between 8 and 9 meters; √72 ≈ 8.49, so 8.5 m is closest."
      },
      {
        prompt: "A square mosaic floor insert covers 210 square feet. Which measurement is closest to one side length?",
        choices: ["52.5 ft", "14.5 ft", "105 ft", "15.8 ft"], correct: 1,
        explanation: "The side length is √210. Since 196 < 210 < 225, the answer is between 14 and 15 feet; √210 ≈ 14.49, so 14.5 ft is closest."
      },
      {
        prompt: "A square solar-panel array covers 95 square meters. Which measurement is closest to one side length?",
        choices: ["47.5 m", "23.8 m", "10.5 m", "9.7 m"], correct: 3,
        explanation: "The side length is √95. Since 81 < 95 < 100, the answer is between 9 and 10 meters; √95 ≈ 9.747, which is about 9.7 m to the nearest tenth."
      },
      {
        prompt: "A square stage platform has an area of 320 square feet. Which measurement is closest to the length of one side?",
        choices: ["17.9 ft", "80 ft", "160 ft", "18.6 ft"], correct: 0,
        explanation: "The side length is √320. Since 289 < 320 < 324, the answer is between 17 and 18 feet and very close to 18; √320 ≈ 17.89, so 17.9 ft is closest."
      },
      {
        prompt: "A square wildlife observation deck has an area of 156.25 square meters. What is the length of one side?",
        choices: ["25 m", "39.06 m", "12.5 m", "78.125 m"], correct: 2,
        explanation: "The side length is √156.25 = 12.5 meters because 12.5 × 12.5 = 156.25."
      }
    ];

    if (!labRuntime.data) {
      labRuntime.data = { phase: "numberLine", lineIndex: 0, placed: {}, selected: null, applicationIndex: 0, applicationSelected: null, applicationAnswered: false };
    }
    const data = labRuntime.data;

    const radicalPlainLabel = root => `√${root.radicand}`;
    const radicalSpokenLabel = root => `square root of ${root.radicand}`;
    const radicalLabel = root => formatMathText(radicalPlainLabel(root));
    const rootApproximation = root => Math.sqrt(root.radicand).toFixed(2);
    const percentPosition = (root, question) => ((Math.sqrt(root.radicand) - question.min) / (question.max - question.min)) * 100;
    const rootHint = root => {
      const value = Math.sqrt(root.radicand);
      if (Number.isInteger(value)) return `${root.radicand} is a perfect square. Which integer multiplied by itself equals ${root.radicand}?`;
      const lower = Math.floor(value);
      const upper = Math.ceil(value);
      return `${lower * lower} < ${root.radicand} < ${upper * upper}, so ${radicalPlainLabel(root)} is between ${lower} and ${upper}. Now compare it with the midpoint.`;
    };

    function placeRoot(rootId, targetId) {
      const question = lineQuestions[data.lineIndex];
      const root = question.roots.find(item => item.id === rootId);
      if (!root || data.placed[rootId]) return;
      if (root.answer !== targetId) {
        data.selected = rootId;
        renderLab82B();
        setLabFeedback(`Not there yet. ${rootHint(root)}`, "incorrect");
        return;
      }
      data.placed[rootId] = targetId;
      data.selected = null;
      const placedCount = Object.keys(data.placed).length;
      renderLab82B();
      setLabFeedback(placedCount === question.roots.length ? "All four roots are correctly placed. Notice how the midpoint separates estimates below and above the halfway value." : `Correct! ${radicalPlainLabel(root)} ≈ ${rootApproximation(root)}.`, "correct");
    }

    if (data.phase === "numberLine") {
      const question = lineQuestions[data.lineIndex];
      const remaining = question.roots.filter(root => !data.placed[root.id]);
      const placedCount = question.roots.length - remaining.length;
      const completedQuestions = data.lineIndex + (placedCount === question.roots.length ? 1 : 0);
      setLabProgress(completedQuestions, 10, `Number line ${data.lineIndex + 1} of 5 • ${placedCount} of 4 square roots placed.`);
      const integerTicks = Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index);
      const midpointTicks = Array.from({ length: question.max - question.min }, (_, index) => question.min + index + .5);
      const intervalTargets = Array.from({ length: question.max - question.min }, (_, index) => question.min + index).flatMap(integer => [
        { id: `low-${integer}`, left: ((integer - question.min) / (question.max - question.min)) * 100, width: (0.5 / (question.max - question.min)) * 100, label: `between ${integer} and the midpoint` },
        { id: `high-${integer}`, left: ((integer + .5 - question.min) / (question.max - question.min)) * 100, width: (0.5 / (question.max - question.min)) * 100, label: `between the midpoint and ${integer + 1}` }
      ]);
      const placedRoots = question.roots.filter(root => data.placed[root.id]);
      setLabFeedback(data.selected ? `${radicalPlainLabel(question.roots.find(root => root.id === data.selected))} selected. Tap the part of the number line where it belongs.` : "Drag a radical to the number line. On a touch screen, tap the radical and then tap its location.");
      $("#standardsLabBody").innerHTML = `
        <div class="root-line-layout">
          <section class="root-line-card">
            <header><div><p class="lab-mini-title">Number line ${data.lineIndex + 1} of 5</p><h4>Place each square root in the correct half-interval.</h4></div><span class="midpoint-key"><i></i> midpoint tick</span></header>
            <p class="root-line-direction">Integer ticks are labeled. Midpoint ticks are intentionally unlabeled.</p>
            <div class="root-line-scroll">
              <div class="root-line-stage" aria-label="Number line from ${question.min} to ${question.max}">
                <div class="root-placed-layer">
                  ${placedRoots.map((root, index) => `<span class="root-placed-chip" style="--root-left:${percentPosition(root, question)}%;--root-top:${15 + index * 45}px;--root-stem:${168 - index * 45}px" aria-label="${radicalSpokenLabel(root)} is approximately ${rootApproximation(root)}"><strong>${radicalLabel(root)}</strong><small>≈ ${rootApproximation(root)}</small></span>`).join("")}
                </div>
                <div class="root-axis" aria-hidden="true"></div>
                ${intervalTargets.map(target => `<button type="button" class="root-interval-target" data-root-target="${target.id}" style="left:${target.left}%;width:${target.width}%" aria-label="Place selected value ${target.label}"></button>`).join("")}
                ${integerTicks.map(integer => {
                  const left = ((integer - question.min) / (question.max - question.min)) * 100;
                  return `<button type="button" class="root-tick root-integer-tick" data-root-target="exact-${integer}" style="left:${left}%" aria-label="Place selected value exactly at ${integer}"><i></i><b>${integer}</b></button>`;
                }).join("")}
                ${midpointTicks.map(midpoint => {
                  const left = ((midpoint - question.min) / (question.max - question.min)) * 100;
                  return `<span class="root-tick root-midpoint-tick" style="left:${left}%" aria-hidden="true"><i></i></span>`;
                }).join("")}
              </div>
            </div>
          </section>
          <aside class="root-bank-card">
            <p class="lab-mini-title">Square-root cards</p>
            <h4>${remaining.length ? `${remaining.length} left to place` : "Number line complete"}</h4>
            <p>Use the perfect squares on either side of the radicand. Then decide whether the root belongs before or after the midpoint.</p>
            <div class="root-card-bank">${remaining.map(root => `<button type="button" class="number-card root-card${data.selected === root.id ? " is-selected" : ""}" data-root-card="${root.id}" draggable="true" aria-label="Select ${radicalSpokenLabel(root)}"><strong>${radicalLabel(root)}</strong><span>Drag or tap</span></button>`).join("") || `<div class="bank-complete">✓ All four placed</div>`}</div>
            <button type="button" class="lab-next root-next" id="nextRootLine" ${placedCount === question.roots.length ? "" : "hidden"}>${data.lineIndex === lineQuestions.length - 1 ? "Continue to real-world problems →" : "Next number line →"}</button>
          </aside>
        </div>`;

      document.querySelectorAll("[data-root-card]").forEach(button => {
        button.addEventListener("click", () => {
          data.selected = button.getAttribute("data-root-card");
          renderLab82B();
        });
        button.addEventListener("dragstart", event => {
          event.dataTransfer.setData("text/plain", button.getAttribute("data-root-card"));
          event.dataTransfer.effectAllowed = "move";
        });
      });
      document.querySelectorAll("[data-root-target]").forEach(target => {
        const assign = rootId => { if (rootId) placeRoot(rootId, target.getAttribute("data-root-target")); };
        target.addEventListener("click", () => assign(data.selected));
        target.addEventListener("dragover", event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; });
        target.addEventListener("dragenter", event => { event.preventDefault(); target.classList.add("is-ready"); });
        target.addEventListener("dragleave", () => target.classList.remove("is-ready"));
        target.addEventListener("drop", event => {
          event.preventDefault();
          target.classList.remove("is-ready");
          assign(event.dataTransfer.getData("text/plain"));
        });
      });
      const nextLine = $("#nextRootLine");
      if (nextLine) nextLine.addEventListener("click", () => {
        if (data.lineIndex === lineQuestions.length - 1) {
          data.phase = "application";
          data.applicationIndex = 0;
          data.applicationSelected = null;
          data.applicationAnswered = false;
          data.placed = {};
          renderLab82B();
          setLabFeedback("Now connect area to side length. Remember: if A = s², then s = √A.");
          return;
        }
        data.lineIndex += 1;
        data.placed = {};
        data.selected = null;
        renderLab82B();
        setLabFeedback("New number line ready. Use the labeled integers and the unlabeled midpoint ticks.");
      });
      return;
    }

    const question = applicationQuestions[data.applicationIndex];
    const completed = 5 + data.applicationIndex + (data.applicationAnswered ? 1 : 0);
    setLabProgress(completed, 10, `Real-world problem ${data.applicationIndex + 1} of 5 • Find a square side length from its area.`);
    $("#standardsLabBody").innerHTML = `
      <section class="square-application-card">
        <div class="square-situation-visual" aria-hidden="true">
          <span class="square-area-symbol"><i>A</i><b>= s²</b></span>
          <span class="square-root-bridge">Find one side</span>
          <span class="square-side-symbol"><i>s</i><b>= ${formatMathText("√A")}</b></span>
        </div>
        <div class="square-question-panel">
          <p class="lab-mini-title">Application ${data.applicationIndex + 1} of 5</p>
          <h4>${question.prompt}</h4>
          <div class="square-choice-grid">
            ${question.choices.map((choice, index) => `<button type="button" class="lab-choice${data.applicationSelected === index ? " is-selected" : ""}${data.applicationAnswered && index === question.correct ? " is-correct" : ""}" data-square-choice="${index}" ${data.applicationAnswered ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span><strong>${choice}</strong></button>`).join("")}
          </div>
          ${data.applicationAnswered ? `<div class="square-explanation"><strong>Why it works</strong><p>${formatMathText(question.explanation)}</p></div>` : ""}
          <div class="visual-actions"><button type="button" class="lab-action" id="checkSquareApplication" ${data.applicationAnswered ? "disabled" : ""}>Check answer</button><button type="button" class="lab-next" id="nextSquareApplication" ${data.applicationAnswered ? "" : "hidden"}>${data.applicationIndex === applicationQuestions.length - 1 ? "Finish lab" : "Next problem →"}</button></div>
        </div>
      </section>`;
    document.querySelectorAll("[data-square-choice]").forEach(button => button.addEventListener("click", () => {
      data.applicationSelected = Number(button.getAttribute("data-square-choice"));
      renderLab82B();
      setLabFeedback("Answer selected. Check it when you are ready.");
    }));
    $("#checkSquareApplication").addEventListener("click", () => {
      if (data.applicationSelected === null) return setLabFeedback("Choose one of the four side lengths first.", "incorrect");
      if (data.applicationSelected !== question.correct) return setLabFeedback("Try again. A square's area is s², so use s = √A and estimate between nearby perfect squares.", "incorrect");
      data.applicationAnswered = true;
      renderLab82B();
      setLabFeedback(`Correct! ${question.explanation}`, "correct");
    });
    const nextApplication = $("#nextSquareApplication");
    if (nextApplication) nextApplication.addEventListener("click", () => {
      if (data.applicationIndex === applicationQuestions.length - 1) {
        setLabProgress(10, 10, "All number-line and square-area challenges complete.");
        showLabCompletion("8.2B");
        return;
      }
      data.applicationIndex += 1;
      data.applicationSelected = null;
      data.applicationAnswered = false;
      renderLab82B();
      setLabFeedback("Use the square root of the area to find the next side length.");
    });
  }

  function renderLab82C() {
    const questions = [
      {
        section: "Small → Scientific", mode: "toScientific", display: "0.0000003004", coefficient: "3.004", exponent: "-7",
        prompt: "Write this number in scientific notation.",
        hint: "Start at the first nonzero digit. Keep both zeros between 3 and 4 in the coefficient, then count the decimal moves.",
        explanation: "The decimal moves 7 places right to make 3.004. Because the original value is between 0 and 1, the exponent is −7."
      },
      {
        section: "Small → Scientific", mode: "toScientific", display: "0.004072", coefficient: "4.072", exponent: "-3",
        prompt: "Write this number in scientific notation.",
        hint: "The coefficient begins with 4. Preserve the zero between 4 and 7, and use a negative exponent.",
        explanation: "The decimal moves 3 places right to make 4.072, so the number is 4.072 × 10⁻³."
      },
      {
        section: "Small → Scientific", mode: "toScientific", display: "0.0000895", coefficient: "8.95", exponent: "-5",
        prompt: "Write this number in scientific notation.",
        hint: "Move the decimal until exactly one nonzero digit is on its left. A number between 0 and 1 needs a negative exponent.",
        explanation: "The decimal moves 5 places right to make 8.95, so the number is 8.95 × 10⁻⁵."
      },
      {
        section: "Scientific → Small", mode: "toStandard", display: "6.02 × 10<sup>−5</sup>", spoken: "6 point 02 times 10 to the negative fifth power", answer: "0.0000602",
        prompt: "Write this value in standard notation.",
        hint: "A negative exponent moves the decimal left. Move it 5 places and keep the zero between 6 and 2.",
        explanation: "Moving the decimal 5 places left gives 0.0000602. The zero in 6.02 remains between the 6 and 2."
      },
      {
        section: "Scientific → Small", mode: "toStandard", display: "9.007 × 10<sup>−4</sup>", spoken: "9 point 007 times 10 to the negative fourth power", answer: "0.0009007",
        prompt: "Write this value in standard notation.",
        hint: "Move the decimal 4 places left. The two zeros already inside 9.007 must stay in the same order.",
        explanation: "Moving the decimal 4 places left gives 0.0009007. Internal zeros remain part of the number."
      },
      {
        section: "Scientific → Small", mode: "toStandard", display: "2.5 × 10<sup>−7</sup>", spoken: "2 point 5 times 10 to the negative seventh power", answer: "0.00000025",
        prompt: "Write this value in standard notation.",
        hint: "The exponent is negative 7, so move the decimal 7 places to the left and fill empty places with zeros.",
        explanation: "Moving the decimal 7 places left gives 0.00000025."
      },
      {
        section: "Large → Scientific", mode: "toScientific", display: "4,000,560,000,000", coefficient: "4.00056", exponent: "12",
        prompt: "Write this number in scientific notation.",
        hint: "Place the decimal after the 4. Keep all three zeros between 4 and 5 in the coefficient, then count the moves.",
        explanation: "The decimal moves 12 places left to make 4.00056. The zeros between 4 and 5 are significant placeholders, so the answer is 4.00056 × 10¹²."
      },
      {
        section: "Large → Scientific", mode: "toScientific", display: "78,340,000", coefficient: "7.834", exponent: "7",
        prompt: "Write this number in scientific notation.",
        hint: "The coefficient must be at least 1 but less than 10. Count from the original decimal position to the new one.",
        explanation: "The decimal moves 7 places left to make 7.834, so the number is 7.834 × 10⁷."
      },
      {
        section: "Large → Scientific", mode: "toScientific", display: "6,050,200", coefficient: "6.0502", exponent: "6",
        prompt: "Write this number in scientific notation.",
        hint: "Keep the zero between 6 and 5 and the zero between 5 and 2. Remove only ending zeros after the last nonzero digit.",
        explanation: "The decimal moves 6 places left to make 6.0502, so the number is 6.0502 × 10⁶."
      },
      {
        section: "Scientific → Large", mode: "toStandard", display: "4.00056 × 10<sup>12</sup>", spoken: "4 point 00056 times 10 to the twelfth power", answer: "4000560000000",
        prompt: "Write this value in standard notation.",
        hint: "A positive exponent moves the decimal right. Move it 12 places without deleting the zeros between 4 and 5.",
        explanation: "Moving the decimal 12 places right gives 4,000,560,000,000. The three internal zeros remain between 4 and 5."
      },
      {
        section: "Scientific → Large", mode: "toStandard", display: "7.205 × 10<sup>9</sup>", spoken: "7 point 205 times 10 to the ninth power", answer: "7205000000",
        prompt: "Write this value in standard notation.",
        hint: "Move the decimal 9 places right. Keep the zero between 2 and 5 before adding any ending zeros.",
        explanation: "Moving the decimal 9 places right gives 7,205,000,000."
      },
      {
        section: "Scientific → Large", mode: "toStandard", display: "3.09 × 10<sup>6</sup>", spoken: "3 point 09 times 10 to the sixth power", answer: "3090000",
        prompt: "Write this value in standard notation.",
        hint: "Move the decimal 6 places right. The zero between 3 and 9 must remain.",
        explanation: "Moving the decimal 6 places right gives 3,090,000."
      },
      {
        section: "Identify the Parts", mode: "identify", display: "0.0000000641", spoken: "zero point 0000000641", coefficient: "6.41", exponent: "-8",
        prompt: "If this number is written in scientific notation, what are its coefficient and exponent?",
        hint: "Move the decimal to make a coefficient between 1 and 10. Because the original number is less than 1, the exponent will be negative.",
        explanation: "The decimal moves 8 places right to make 6.41, so the coefficient is 6.41 and the exponent is −8."
      },
      {
        section: "Identify the Parts", mode: "identify", display: "900,300,000,000", spoken: "900 billion 300 million", coefficient: "9.003", exponent: "11",
        prompt: "If this number is written in scientific notation, what are its coefficient and exponent?",
        hint: "Place the decimal after 9 and preserve the two zeros between 9 and 3. Count how many places the decimal moves left.",
        explanation: "The decimal moves 11 places left to make 9.003, so the coefficient is 9.003 and the exponent is 11."
      },
      {
        section: "Identify the Parts", mode: "identify", display: "1.2", spoken: "1 point 2", coefficient: "1.2", exponent: "0",
        prompt: "If this number is written in scientific notation, what are its coefficient and exponent?",
        hint: "This number is already between 1 and 10, so the decimal does not move. An exponent can be zero.",
        explanation: "The coefficient is already 1.2 and the decimal moves 0 places, so the exponent is 0: 1.2 × 10⁰."
      },
      {
        section: "Identify the Parts", mode: "identify", display: "0.0040705", spoken: "zero point 0040705", coefficient: "4.0705", exponent: "-3",
        prompt: "If this number is written in scientific notation, what are its coefficient and exponent?",
        hint: "Move the decimal to the right until it follows the 4. Keep the zero inside the coefficient and use a negative exponent.",
        explanation: "The decimal moves 3 places right to make 4.0705, so the coefficient is 4.0705 and the exponent is −3."
      }
    ];
    const sectionCounts = [
      ["Small → Scientific", 3],
      ["Scientific → Small", 3],
      ["Large → Scientific", 3],
      ["Scientific → Large", 3],
      ["Identify the Parts", 4]
    ];
    if (!labRuntime.data) labRuntime.data = { index: 0, answered: false };
    const data = labRuntime.data;
    const question = questions[data.index];
    const completed = data.index + (data.answered ? 1 : 0);
    const normalizeCoefficient = value => String(value).trim().replace(/,/g, "").replace(/−/g, "-");
    const normalizeStandard = value => String(value).trim().replace(/[,$\s]/g, "").replace(/^\+/, "");
    const currentSectionIndex = sectionCounts.findIndex(([name]) => name === question.section);
    setLabProgress(completed, questions.length, `${question.section} • Challenge ${data.index + 1} of ${questions.length}`);
    setLabFeedback(data.answered ? `Correct! ${question.explanation}` : "Enter your response, then check your work.", data.answered ? "correct" : "");

    const sectionRail = sectionCounts.map(([name, count], index) => {
      const start = sectionCounts.slice(0, index).reduce((sum, item) => sum + item[1], 0);
      const end = start + count;
      const status = data.index >= end ? " is-complete" : index === currentSectionIndex ? " is-current" : "";
      return `<li class="${status}"><span>${data.index >= end ? "✓" : index + 1}</span><div><strong>${name}</strong><small>${count} ${count === 1 ? "challenge" : "challenges"}</small></div></li>`;
    }).join("");

    let responseMarkup = "";
    if (question.mode === "toStandard") {
      responseMarkup = `<label class="standard-entry"><span>Standard notation</span><input id="scientificStandardAnswer" type="text" inputmode="decimal" autocomplete="off" placeholder="Type the complete number" ${data.answered ? "disabled" : ""}></label>`;
    } else {
      const labels = question.mode === "identify" ? ["Coefficient", "Exponent"] : ["Coefficient", "Exponent on 10"];
      responseMarkup = `<div class="scientific-entry-row"><label><span>${labels[0]}</span><input id="scientificCoefficient" type="text" inputmode="decimal" autocomplete="off" placeholder="Example: 3.5" ${data.answered ? "disabled" : ""}></label><span class="times-ten" aria-hidden="true">× 10</span><label class="exponent-entry"><span>${labels[1]}</span><input id="scientificExponent" type="text" inputmode="numeric" autocomplete="off" placeholder="± n" ${data.answered ? "disabled" : ""}></label></div>`;
    }

    $("#standardsLabBody").innerHTML = `
      <div class="scientific-lab-layout">
        <aside class="scientific-section-rail"><p class="lab-mini-title">Lab pathway</p><ol>${sectionRail}</ol></aside>
        <section class="scientific-challenge-card">
          <header><span>${question.section}</span><b>${data.index + 1} / ${questions.length}</b></header>
          <div class="scientific-problem-body">
            <p class="scientific-prompt">${question.prompt}</p>
            <div class="scientific-number-display" role="img" aria-label="${question.spoken || question.display}"><span class="scientific-expression">${question.display}</span></div>
            <div class="scientific-response-card">
              ${question.mode === "toScientific" ? `<span class="response-label">Build (a × 10ⁿ)</span>` : question.mode === "identify" ? `<span class="response-label">Write its scientific-notation parts</span>` : `<span class="response-label">Move the decimal</span>`}
              ${data.answered ? `<div class="scientific-correct-answer">${question.mode === "toStandard" ? Number(question.answer).toLocaleString("en-US", { useGrouping: true, maximumFractionDigits: 12 }) : `<span>${question.coefficient}</span><b>× 10<sup>${question.exponent.replace("-", "−")}</sup></b>`}</div>` : responseMarkup}
            </div>
            ${data.answered ? `<div class="scientific-explanation"><strong>Place-value connection</strong><p>${question.explanation}</p></div>` : ""}
            <div class="scientific-actions"><button type="button" class="lab-action" id="checkScientificAnswer" ${data.answered ? "hidden" : ""}>Check answer</button><button type="button" class="lab-next" id="nextScientificQuestion" ${data.answered ? "" : "hidden"}>${data.index === questions.length - 1 ? "Finish lab" : "Next challenge →"}</button></div>
          </div>
        </section>
      </div>`;

    const checkButton = $("#checkScientificAnswer");
    if (checkButton) checkButton.addEventListener("click", () => {
      let correct = false;
      if (question.mode === "toStandard") {
        const answer = normalizeStandard($("#scientificStandardAnswer").value);
        if (!answer) return setLabFeedback("Enter the complete standard-form number first.", "incorrect");
        correct = Number(answer) === Number(question.answer);
      } else {
        const coefficient = normalizeCoefficient($("#scientificCoefficient").value);
        const exponent = normalizeCoefficient($("#scientificExponent").value);
        if (!coefficient || exponent === "") return setLabFeedback("Enter both the coefficient and the exponent first.", "incorrect");
        correct = Number(coefficient) === Number(question.coefficient) && Number(exponent) === Number(question.exponent);
      }
      if (!correct) return setLabFeedback(`Check the place values again. ${question.hint}`, "incorrect");
      data.answered = true;
      renderLab82C();
    });
    document.querySelectorAll(".scientific-response-card input").forEach(input => input.addEventListener("keydown", event => {
      if (event.key === "Enter") checkButton?.click();
    }));

    const nextButton = $("#nextScientificQuestion");
    if (nextButton) nextButton.addEventListener("click", () => {
      if (data.index === questions.length - 1) {
        setLabProgress(questions.length, questions.length, "All scientific-notation challenges complete.");
        showLabCompletion("8.2C");
        return;
      }
      data.index += 1;
      data.answered = false;
      renderLab82C();
    });
  }

  function renderLab82D() {
    const orderingQuestions = [
      {
        mode: "line", min: -4, max: 4, direction: "ascending",
        prompt: "Place all five real numbers on the number line.",
        hint: "Estimate each square root, simplify the fraction, and remember that the number line increases from left to right.",
        values: [
          { id: "q1-root10", display: "−√10", spoken: "negative square root of 10", value: -Math.sqrt(10), reveal: "≈ −3.162 · irrational" },
          { id: "q1-frac", display: "−5⁄2", spoken: "negative five halves", value: -2.5, reveal: "= −2.5 · rational" },
          { id: "q1-zero", display: "0", spoken: "zero", value: 0, reveal: "whole number" },
          { id: "q1-root5", display: "√5", spoken: "square root of 5", value: Math.sqrt(5), reveal: "≈ 2.236 · irrational" },
          { id: "q1-decimal", display: "3.25", spoken: "3 point 25", value: 3.25, reveal: "rational" }
        ]
      },
      {
        mode: "line", min: 0, max: 6, direction: "ascending",
        prompt: "Place all five real numbers on the number line.",
        hint: "Rewrite the fractions as decimals and estimate each non-perfect square root before placing the values.",
        values: [
          { id: "q2-frac", display: "3⁄4", spoken: "three fourths", value: .75, reveal: "= 0.75 · rational" },
          { id: "q2-root2", display: "√2", spoken: "square root of 2", value: Math.sqrt(2), reveal: "≈ 1.414 · irrational" },
          { id: "q2-two", display: "2", spoken: "two", value: 2, reveal: "natural number" },
          { id: "q2-root11", display: "√11", spoken: "square root of 11", value: Math.sqrt(11), reveal: "≈ 3.317 · irrational" },
          { id: "q2-eleven-halves", display: "11⁄2", spoken: "eleven halves", value: 5.5, reveal: "= 5.5 · rational" }
        ]
      },
      {
        mode: "line", min: -6, max: 2, direction: "ascending",
        prompt: "Place all five real numbers on the number line.",
        hint: "Watch the negative signs. Among negative numbers, the value with the greater absolute value lies farther left.",
        values: [
          { id: "q3-five", display: "−5", spoken: "negative five", value: -5, reveal: "integer" },
          { id: "q3-root20", display: "−√20", spoken: "negative square root of 20", value: -Math.sqrt(20), reveal: "≈ −4.472 · irrational" },
          { id: "q3-decimal", display: "−3.75", spoken: "negative 3 point 75", value: -3.75, reveal: "rational" },
          { id: "q3-root7", display: "−√7", spoken: "negative square root of 7", value: -Math.sqrt(7), reveal: "≈ −2.646 · irrational" },
          { id: "q3-positive", display: "1.25", spoken: "1 point 25", value: 1.25, reveal: "rational" }
        ]
      },
      {
        mode: "sequence", direction: "ascending",
        prompt: "Arrange the values from least to greatest. Compare to the thousandths place.",
        hint: "√10 ≈ 3.1623. With negative values, a slightly greater absolute value makes the number smaller.",
        values: [
          { id: "q4-root10", display: "−√10", spoken: "negative square root of 10", value: -Math.sqrt(10), reveal: "≈ −3.1623 · irrational" },
          { id: "q4-a", display: "−3.16", spoken: "negative 3 point 16", value: -3.16, reveal: "= −3.160 · rational" },
          { id: "q4-b", display: "−3.159", spoken: "negative 3 point 159", value: -3.159, reveal: "rational" },
          { id: "q4-c", display: "−3", spoken: "negative three", value: -3, reveal: "integer" },
          { id: "q4-d", display: "0", spoken: "zero", value: 0, reveal: "whole number" }
        ]
      },
      {
        mode: "sequence", direction: "descending",
        prompt: "Arrange the values from greatest to least. Compare to the thousandths place.",
        hint: "√50 ≈ 7.071067. Compare it carefully with 7.071 before deciding which is greater.",
        values: [
          { id: "q5-a", display: "7.08", spoken: "7 point 08", value: 7.08, reveal: "= 7.080 · rational" },
          { id: "q5-root50", display: "√50", spoken: "square root of 50", value: Math.sqrt(50), reveal: "≈ 7.071067 · irrational" },
          { id: "q5-b", display: "7.071", spoken: "7 point 071", value: 7.071, reveal: "rational" },
          { id: "q5-c", display: "7.005", spoken: "7 point 005", value: 7.005, reveal: "rational" },
          { id: "q5-d", display: "7", spoken: "seven", value: 7, reveal: "natural number" }
        ]
      },
      {
        mode: "sequence", direction: "ascending",
        prompt: "Arrange the values from least to greatest.",
        hint: "Convert the fraction and square roots to decimals. Be especially careful when comparing negative values.",
        values: [
          { id: "q6-frac", display: "−1⁄2", spoken: "negative one half", value: -.5, reveal: "= −0.5 · rational" },
          { id: "q6-root", display: "−√0.20", spoken: "negative square root of 0 point 20", value: -Math.sqrt(.2), reveal: "≈ −0.447 · irrational" },
          { id: "q6-decimal", display: "−0.44", spoken: "negative 0 point 44", value: -.44, reveal: "rational" },
          { id: "q6-zero", display: "0", spoken: "zero", value: 0, reveal: "whole number" },
          { id: "q6-positive", display: "√0.25", spoken: "square root of 0 point 25", value: .5, reveal: "= 0.5 · rational" }
        ]
      },
      {
        mode: "sequence", direction: "descending",
        prompt: "Arrange the values from greatest to least. Compare to the thousandths place.",
        hint: "√18 ≈ 4.24264. Compare the digits through the thousandths place before ordering.",
        values: [
          { id: "q7-frac", display: "17⁄4", spoken: "seventeen fourths", value: 4.25, reveal: "= 4.25 · rational" },
          { id: "q7-a", display: "4.243", spoken: "4 point 243", value: 4.243, reveal: "rational" },
          { id: "q7-root18", display: "√18", spoken: "square root of 18", value: Math.sqrt(18), reveal: "≈ 4.24264 · irrational" },
          { id: "q7-b", display: "4.24", spoken: "4 point 24", value: 4.24, reveal: "= 4.240 · rational" },
          { id: "q7-c", display: "4.2", spoken: "4 point 2", value: 4.2, reveal: "= 4.200 · rational" }
        ]
      }
    ];
    const betweenQuestions = [
      {
        left: "√7", right: "2.7", spoken: "square root of 7 is less than x, and x is less than 2 point 7", prompt: "Which value could be x?", correct: 1,
        choices: [{ display: "2.64", value: 2.64 }, { display: "2.65", value: 2.65 }, { display: "2.71", value: 2.71 }, { display: "√8", value: Math.sqrt(8) }],
        explanation: "√7 ≈ 2.646. The value 2.65 is greater than 2.646 and less than 2.7, so it lies between the endpoints."
      },
      {
        left: "−3.142", right: "−π", spoken: "negative 3 point 142 is less than x, and x is less than negative pi", prompt: "Which value could be x?", correct: 2,
        choices: [{ display: "−3.143", value: -3.143 }, { display: "−3.1415", value: -3.1415 }, { display: "−3.1417", value: -3.1417 }, { display: "3.1417", value: 3.1417 }],
        explanation: "−π ≈ −3.14159. The value −3.1417 is greater than −3.142 but less than −3.14159, so it lies between the endpoints."
      },
      {
        left: "5⁄8", right: "√0.4", spoken: "five eighths is less than x, and x is less than the square root of 0 point 4", prompt: "Which value could be x?", correct: 1,
        choices: [{ display: "0.62", value: .62 }, { display: "0.63", value: .63 }, { display: "0.635", value: .635 }, { display: "0.64", value: .64 }],
        explanation: "5⁄8 = 0.625 and √0.4 ≈ 0.632. The value 0.63 is greater than 0.625 and less than about 0.632."
      }
    ];
    const totalQuestions = orderingQuestions.length + betweenQuestions.length;
    if (!labRuntime.data) labRuntime.data = { index: 0, placed: {}, selected: null, choice: null, answered: false };
    const data = labRuntime.data;
    const supportMarkup = `<section class="calculator-practice-strip"><div><span>Calculator support</span><strong>Open a tip without leaving your practice.</strong></div><div>${LABS["8.2D"].videos.map((video, index) => `<button type="button" data-82d-video="${index}">▶ ${video[1]}</button>`).join("")}</div></section>`;
    const attachSupportVideos = () => document.querySelectorAll("[data-82d-video]").forEach(button => button.addEventListener("click", () => {
      const [url, title] = LABS["8.2D"].videos[Number(button.getAttribute("data-82d-video"))];
      openVideo({ url, title });
    }));
    const nextQuestion = () => {
      if (data.index === totalQuestions - 1) {
        setLabProgress(totalQuestions, totalQuestions, "All ordering and between-number challenges complete.");
        showLabCompletion("8.2D");
        return;
      }
      data.index += 1;
      data.placed = {};
      data.selected = null;
      data.choice = null;
      data.answered = false;
      renderLab82D();
    };

    if (data.index < orderingQuestions.length) {
      const question = orderingQuestions[data.index];
      const sorted = [...question.values].sort((a, b) => question.direction === "descending" ? b.value - a.value : a.value - b.value);
      const placedCount = Object.keys(data.placed).length;
      const questionComplete = placedCount === question.values.length;
      setLabProgress(data.index + (questionComplete ? 1 : 0), totalQuestions, `Ordering challenge ${data.index + 1} of 7 • ${placedCount} of 5 values placed.`);
      const placeValue = (itemId, targetIndex) => {
        const item = question.values.find(value => value.id === itemId);
        if (!item || data.placed[itemId] !== undefined) return;
        const correctIndex = sorted.findIndex(value => value.id === itemId);
        if (correctIndex !== Number(targetIndex)) {
          data.selected = itemId;
          setLabFeedback(`Not in that position yet. ${question.hint}`, "incorrect");
          return;
        }
        data.placed[itemId] = correctIndex;
        data.selected = null;
        renderLab82D();
        setLabFeedback(Object.keys(data.placed).length === question.values.length ? "All five values are correctly ordered." : `Correct placement. ${item.display} ${item.reveal}.`, "correct");
      };
      const remaining = question.values.filter(value => data.placed[value.id] === undefined);
      const cardBank = `<aside class="ordering-card-bank"><p class="lab-mini-title">Real-number cards</p><h4>${remaining.length ? `${remaining.length} left to place` : "Ordering complete"}</h4><p>Drag a card to its position. On a touch screen, tap a card and then tap a location.</p><div class="ordering-cards">${remaining.map(item => `<button type="button" class="number-card ordering-card${data.selected === item.id ? " is-selected" : ""}" data-ordering-card="${item.id}" draggable="true" aria-label="Select ${item.spoken}"><strong>${formatMathText(item.display)}</strong><span>Drag or tap</span></button>`).join("") || `<div class="bank-complete">✓ All five placed</div>`}</div><button type="button" class="lab-next ordering-next" id="nextOrderingQuestion" ${questionComplete ? "" : "hidden"}>${data.index === orderingQuestions.length - 1 ? "Continue to values between →" : "Next ordering challenge →"}</button></aside>`;
      let activityMarkup = "";
      if (question.mode === "line") {
        const ticks = Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index);
        activityMarkup = `<div class="ordering-line-layout"><section class="ordering-line-card"><header><div><p class="lab-mini-title">Number line ${data.index + 1} of 3</p><h4>${question.prompt}</h4></div><span>least → greatest</span></header><div class="ordering-line-scroll"><div class="ordering-line-stage" aria-label="Number line from ${question.min} to ${question.max}"><div class="ordering-axis" aria-hidden="true"></div>${ticks.map(tick => `<span class="ordering-tick" style="left:${((tick - question.min) / (question.max - question.min)) * 100}%"><i></i><b>${tick}</b></span>`).join("")}${sorted.map((item, index) => {
          const left = ((item.value - question.min) / (question.max - question.min)) * 100;
          const placed = data.placed[item.id] !== undefined;
          const laneTop = 40 + (index % 2) * 58;
          const stemHeight = 117 - (index % 2) * 58;
          return `<button type="button" class="ordering-line-target${placed ? " is-filled" : ""}" data-ordering-target="${index}" style="left:${left}%;--order-top:${laneTop}px;--order-stem:${stemHeight}px" aria-label="Place selected value at position ${index + 1}">${placed ? `<span><strong>${formatMathText(item.display)}</strong><small>${item.reveal}</small></span>` : `<i></i>`}</button>`;
        }).join("")}</div></div></section>${cardBank}</div>`;
      } else {
        const directionLabel = question.direction === "ascending" ? "Least → Greatest" : "Greatest → Least";
        activityMarkup = `<div class="ordering-sequence-layout"><section class="ordering-sequence-card"><header><p class="lab-mini-title">Sequence ${data.index - 2} of 4</p><h4>${question.prompt}</h4><span>${directionLabel}</span></header><div class="sequence-scroll"><div class="ordering-sequence-slots" data-direction="${question.direction}">${sorted.map((item, index) => {
          const placed = data.placed[item.id] !== undefined;
          return `<button type="button" class="ordering-sequence-slot${placed ? " is-filled" : ""}" data-ordering-target="${index}" aria-label="Position ${index + 1}"><b>${index + 1}</b>${placed ? `<strong>${formatMathText(item.display)}</strong><small>${item.reveal}</small>` : `<span>Drop here</span>`}</button>`;
        }).join("")}</div></div></section>${cardBank}</div>`;
      }
      $("#standardsLabBody").innerHTML = `${supportMarkup}${activityMarkup}`;
      setLabFeedback(data.selected ? `${question.values.find(value => value.id === data.selected).display} selected. Choose its correct position.` : question.hint);
      attachSupportVideos();
      document.querySelectorAll("[data-ordering-card]").forEach(button => {
        button.addEventListener("click", () => { data.selected = button.getAttribute("data-ordering-card"); renderLab82D(); });
        button.addEventListener("dragstart", event => { event.dataTransfer.setData("text/plain", button.getAttribute("data-ordering-card")); event.dataTransfer.effectAllowed = "move"; });
      });
      document.querySelectorAll("[data-ordering-target]").forEach(target => {
        const assign = itemId => { if (itemId) placeValue(itemId, target.getAttribute("data-ordering-target")); };
        target.addEventListener("click", () => assign(data.selected));
        target.addEventListener("dragover", event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; });
        target.addEventListener("dragenter", event => { event.preventDefault(); target.classList.add("is-ready"); });
        target.addEventListener("dragleave", () => target.classList.remove("is-ready"));
        target.addEventListener("drop", event => { event.preventDefault(); target.classList.remove("is-ready"); assign(event.dataTransfer.getData("text/plain")); });
      });
      const next = $("#nextOrderingQuestion");
      if (next) next.addEventListener("click", nextQuestion);
      return;
    }

    const betweenIndex = data.index - orderingQuestions.length;
    const question = betweenQuestions[betweenIndex];
    setLabProgress(data.index + (data.answered ? 1 : 0), totalQuestions, `Between-number challenge ${betweenIndex + 1} of 3 • Find a value that makes the inequality true.`);
    $("#standardsLabBody").innerHTML = `${supportMarkup}<section class="between-number-card"><header><p class="lab-mini-title">Value between ${betweenIndex + 1} of 3</p><h4>${question.prompt}</h4></header><div class="between-inequality" role="img" aria-label="${question.spoken}"><span>${formatMathText(question.left)}</span><b>&lt; x &lt;</b><span>${formatMathText(question.right)}</span></div><div class="between-choice-grid">${question.choices.map((choice, index) => `<button type="button" class="lab-choice${data.choice === index ? " is-selected" : ""}${data.answered && index === question.correct ? " is-correct" : ""}" data-between-choice="${index}" ${data.answered ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span><div class="between-choice-value">${formatMathText(choice.display)}</div></button>`).join("")}</div>${data.answered ? `<div class="between-explanation"><strong>Why it works</strong><p>${formatMathText(question.explanation)}</p></div>` : ""}<div class="scientific-actions"><button type="button" class="lab-action" id="checkBetweenAnswer" ${data.answered ? "hidden" : ""}>Check answer</button><button type="button" class="lab-next" id="nextBetweenQuestion" ${data.answered ? "" : "hidden"}>${data.index === totalQuestions - 1 ? "Finish lab" : "Next challenge →"}</button></div></section>`;
    setLabFeedback(data.answered ? `Correct! ${question.explanation}` : "Choose the value that is greater than the left endpoint and less than the right endpoint.", data.answered ? "correct" : "");
    attachSupportVideos();
    document.querySelectorAll("[data-between-choice]").forEach(button => button.addEventListener("click", () => {
      data.choice = Number(button.getAttribute("data-between-choice"));
      renderLab82D();
    }));
    $("#checkBetweenAnswer").addEventListener("click", () => {
      if (data.choice === null) return setLabFeedback("Choose one of the four possible values first.", "incorrect");
      if (data.choice !== question.correct) return setLabFeedback("That value is not strictly between both endpoints. Convert each endpoint to a decimal and compare again.", "incorrect");
      data.answered = true;
      renderLab82D();
    });
    const next = $("#nextBetweenQuestion");
    if (next) next.addEventListener("click", nextQuestion);
  }

  function applyTransformation(points, spec) {
    return points.map(point => {
      if (spec.kind === "translation") return { x: point.x + spec.dx, y: point.y + spec.dy };
      if (spec.kind === "dilation") return { x: point.x * spec.k, y: point.y * spec.k };
      if (spec.kind === "reflection") return spec.axis === "y" ? { x: -point.x, y: point.y } : { x: point.x, y: -point.y };
      if (spec.kind === "rotation") {
        const radians = (spec.direction === "cw" ? -spec.degrees : spec.degrees) * Math.PI / 180;
        return {
          x: Math.round((point.x * Math.cos(radians) - point.y * Math.sin(radians)) * 1000) / 1000,
          y: Math.round((point.x * Math.sin(radians) + point.y * Math.cos(radians)) * 1000) / 1000
        };
      }
      return { ...point };
    });
  }

  function screenPoint(point) {
    return { x: LAB_ORIGIN + point.x * LAB_SCALE, y: LAB_ORIGIN - point.y * LAB_SCALE };
  }

  function svgPointString(points) {
    return points.map(point => {
      const screen = screenPoint(point);
      return `${screen.x},${screen.y}`;
    }).join(" ");
  }

  function coordinateGraphMarkup(points, transformedPoints, transformedId = "") {
    const grid = Array.from({ length: 17 }, (_, index) => {
      const position = LAB_ORIGIN - 8 * LAB_SCALE + index * LAB_SCALE;
      return `<line x1="${position}" y1="12" x2="${position}" y2="588"></line><line x1="12" y1="${position}" x2="588" y2="${position}"></line>`;
    }).join("");
    const labels = ["A", "B", "C", "D", "E", "F"];
    const pointLabels = (vertices, prime, className) => vertices.map((point, index) => {
      const screen = screenPoint(point);
      return `<text class="${className}" data-vertex-index="${index}" x="${screen.x + (prime ? 10 : -22)}" y="${screen.y + (prime ? 20 : -10)}">${labels[index]}${prime ? "′" : ""}</text>`;
    }).join("");
    return `<svg class="coordinate-lab-svg" viewBox="0 0 600 600" role="img" aria-label="Coordinate plane showing an original figure and its transformation">
      <g class="coordinate-grid">${grid}</g>
      <g class="coordinate-axes"><line x1="12" y1="300" x2="588" y2="300"></line><line x1="300" y1="12" x2="300" y2="588"></line><text x="567" y="286">x</text><text x="311" y="28">y</text><circle cx="300" cy="300" r="5"></circle><text x="310" y="321">origin</text></g>
      <polygon class="coordinate-source-shape" points="${svgPointString(points)}"></polygon>
      <g class="coordinate-original-labels">${pointLabels(points, false, "coordinate-original-label")}</g>
      <polygon class="coordinate-result-shape" ${transformedId ? `id="${transformedId}"` : ""} points="${svgPointString(transformedPoints)}"></polygon>
      <g class="coordinate-transformed-labels">${pointLabels(transformedPoints, true, "coordinate-transformed-label")}</g>
    </svg>`;
  }

  function renderLabA() {
    const transforms = [
      { name: "Translation", spec: { kind: "translation", dx: 3, dy: -1 }, orientation: "same", congruent: "yes", exact: "right3down1", exactLabel: "3 right and 1 down", options: [["right3down1", "3 right and 1 down"], ["right1down3", "1 right and 3 down"]], rule: "(x, y) → (x + 3, y − 1)", note: "The figure slides without turning or changing size." },
      { name: "Rotation", spec: { kind: "rotation", degrees: 90, direction: "cw" }, orientation: "changes", congruent: "yes", exact: "90cw", exactLabel: "90° clockwise about the origin", options: [["90cw", "90° clockwise"], ["90ccw", "90° counterclockwise"]], rule: "(x, y) → (y, −x)", note: "The figure makes a quarter-turn about the origin while every side length and angle measure stays the same." },
      { name: "Reflection", spec: { kind: "reflection", axis: "y" }, orientation: "changes", congruent: "yes", exact: "yaxis", exactLabel: "reflection over the y-axis", options: [["yaxis", "Over the y-axis"], ["xaxis", "Over the x-axis"]], rule: "(x, y) → (−x, y)", note: "The figure flips across the y-axis and keeps the same size and shape." },
      { name: "Dilation", spec: { kind: "dilation", k: 1.4 }, orientation: "same", congruent: "no", exact: "k1.4", exactLabel: "dilation with k = 1.4", options: [["k1.4", "k = 1.4"], ["k0.7", "k = 0.7"]], rule: "(x, y) → (1.4x, 1.4y)", note: "The figure moves farther from the origin and grows, so the figures are similar but not congruent." }
    ];
    if (!labRuntime.data) labRuntime.data = { index: 0, completed: new Set(), orientation: null, congruent: null, exact: null };
    const data = labRuntime.data;
    const item = transforms[data.index];
    const transformedPoints = applyTransformation(BASE_TRIANGLE, item.spec);
    setLabProgress(data.completed.size, transforms.length, "Name the exact transformation, then test orientation and congruence.");
    $("#standardsLabBody").innerHTML = `
      <div class="transform-selector">${transforms.map((entry, index) => `<button type="button" data-a-index="${index}" class="${index === data.index ? "is-active" : ""}">${data.completed.has(index) ? "✓ " : ""}${entry.name}</button>`).join("")}</div>
      <div class="lab-grid">
        <div class="lab-stage-card"><p class="lab-mini-title">Coordinate plane</p>${coordinateGraphMarkup(BASE_TRIANGLE, transformedPoints)}</div>
        <div class="lab-task-card">
          <p class="lab-mini-title">${item.name}</p><h4>What happened to the figure?</h4><p>${item.note}</p>
          <div class="property-question"><strong>Exact transformation</strong><div class="lab-choice-row">${item.options.map(([value, label]) => `<button type="button" class="lab-choice ${data.exact === value ? "is-selected" : ""}" data-a-exact="${value}">${label}</button>`).join("")}</div></div>
          <div class="property-question"><strong>Orientation</strong><div class="lab-choice-row"><button type="button" class="lab-choice ${data.orientation === "same" ? "is-selected" : ""}" data-a-orientation="same">Stays the same</button><button type="button" class="lab-choice ${data.orientation === "changes" ? "is-selected" : ""}" data-a-orientation="changes">Changes</button></div></div>
          <div class="property-question"><strong>Congruence</strong><div class="lab-choice-row"><button type="button" class="lab-choice ${data.congruent === "yes" ? "is-selected" : ""}" data-a-congruent="yes">Preserved</button><button type="button" class="lab-choice ${data.congruent === "no" ? "is-selected" : ""}" data-a-congruent="no">Not preserved</button></div></div>
          <div class="rule-reveal"><span>Algebraic rule</span><strong>${item.rule}</strong></div>
          <button type="button" class="lab-action" id="checkLabA">Check all three ideas</button><button type="button" class="lab-next" id="nextLabA" ${data.completed.has(data.index) ? "" : "hidden"}>Next transformation →</button>
        </div>
      </div>`;
    document.querySelectorAll("[data-a-index]").forEach(button => button.addEventListener("click", () => { data.index = Number(button.dataset.aIndex); data.orientation = null; data.congruent = null; data.exact = null; renderLabA(); setLabFeedback("Use the origin and corresponding vertices as evidence."); }));
    document.querySelectorAll("[data-a-exact]").forEach(button => button.addEventListener("click", () => { data.exact = button.dataset.aExact; renderLabA(); }));
    document.querySelectorAll("[data-a-orientation]").forEach(button => button.addEventListener("click", () => { data.orientation = button.dataset.aOrientation; renderLabA(); }));
    document.querySelectorAll("[data-a-congruent]").forEach(button => button.addEventListener("click", () => { data.congruent = button.dataset.aCongruent; renderLabA(); }));
    $("#checkLabA").addEventListener("click", () => {
      if (!data.exact || !data.orientation || !data.congruent) return setLabFeedback("Choose the exact transformation, orientation result, and congruence result.", "incorrect");
      if (data.exact !== item.exact || data.orientation !== item.orientation || data.congruent !== item.congruent) return setLabFeedback("Use corresponding points: check the axis or center first, then compare size and facing direction.", "incorrect");
      data.completed.add(data.index); renderLabA(); setLabFeedback(`Correct: ${item.exactLabel}. ${item.note}`, "correct");
      if (data.completed.size === transforms.length) showLabCompletion("8.10A");
    });
    const next = $("#nextLabA");
    if (next) next.addEventListener("click", () => { const nextIndex = transforms.findIndex((_, index) => !data.completed.has(index)); if (nextIndex === -1) return showLabCompletion("8.10A"); data.index = nextIndex; data.orientation = null; data.congruent = null; data.exact = null; renderLabA(); setLabFeedback("New transformation ready."); });
  }

  function renderLabB() {
    const cards = [
      { id: "translation", name: "Translation", icon: "→", detail: "(x, y) → (x + 4, y − 2)", answer: "preserves" },
      { id: "rotation", name: "Rotation", icon: "↻", detail: "(x, y) → (y, −x)", answer: "preserves" },
      { id: "reflection", name: "Reflection", icon: "⇄", detail: "(x, y) → (−x, y)", answer: "preserves" },
      { id: "dilation", name: "Dilation", icon: "⤢", detail: "(x, y) → (2x, 2y)", answer: "not" }
    ];
    if (!labRuntime.data) labRuntime.data = { placed: {}, selected: null };
    const data = labRuntime.data;
    const placedCount = Object.keys(data.placed).length;
    const correctCount = cards.filter(card => data.placed[card.id] === card.answer).length;
    setLabProgress(correctCount, cards.length, "Move every card into the category supported by its evidence.");
    const cardMarkup = card => `<button type="button" draggable="true" data-b-card="${card.id}" class="sort-card ${data.selected === card.id ? "is-selected" : ""} ${data.placed[card.id] ? (data.placed[card.id] === card.answer ? "is-correct" : "is-incorrect") : ""}"><i>${card.icon}</i><span><strong>${card.name}</strong><small>${card.detail}</small></span></button>`;
    $("#standardsLabBody").innerHTML = `
      <div class="sort-board">
        <section class="sort-zone" data-b-zone="preserves"><h4>Preserves congruence</h4><p>Same size and same shape</p><div class="sort-stack">${cards.filter(card => data.placed[card.id] === "preserves").map(cardMarkup).join("")}</div></section>
        <section class="sort-zone" data-b-zone="not"><h4>Does not preserve congruence</h4><p>Size or shape changes</p><div class="sort-stack">${cards.filter(card => data.placed[card.id] === "not").map(cardMarkup).join("")}</div></section>
      </div>
      <div class="sort-pool"><strong>Choose or drag a transformation</strong><div class="sort-stack">${cards.filter(card => !data.placed[card.id]).map(cardMarkup).join("")}</div></div>`;
    function place(id, zone) {
      const card = cards.find(entry => entry.id === id); if (!card) return;
      data.placed[id] = zone; data.selected = null; renderLabB();
      if (zone === card.answer) setLabFeedback(`Correct. ${card.name} ${zone === "preserves" ? "keeps the same size and shape." : "changes size when the scale factor is not 1."}`, "correct");
      else setLabFeedback(`Not yet. Recheck what ${card.name.toLowerCase()} does to side lengths and angle measures, then move it.`, "incorrect");
      if (Object.keys(data.placed).length === cards.length && cards.every(entry => data.placed[entry.id] === entry.answer)) showLabCompletion("8.10B");
    }
    document.querySelectorAll("[data-b-card]").forEach(button => {
      button.addEventListener("click", event => { event.stopPropagation(); data.selected = button.dataset.bCard; renderLabB(); setLabFeedback("Now choose one of the two congruence categories."); });
      button.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", button.dataset.bCard));
    });
    document.querySelectorAll("[data-b-zone]").forEach(zone => {
      zone.addEventListener("click", () => { if (data.selected) place(data.selected, zone.dataset.bZone); });
      zone.addEventListener("dragover", event => event.preventDefault());
      zone.addEventListener("drop", event => { event.preventDefault(); place(event.dataTransfer.getData("text/plain"), zone.dataset.bZone); });
    });
    if (placedCount === 0) setLabFeedback("Drag a card into a category, or tap a card and then tap a category.");
  }

  const TRANSFORMATION_CHALLENGES = [
    { exact: "Translate 4 right and 2 down", rule: "(x, y) → (x + 4, y − 2)", spec: { kind: "translation", dx: 4, dy: -2 }, clue: "Every vertex moves 4 units right and 2 units down." },
    { exact: "Translate 5 right and 1 up", rule: "(x, y) → (x + 5, y + 1)", spec: { kind: "translation", dx: 5, dy: 1 }, clue: "Every vertex moves 5 units right and 1 unit up." },
    { exact: "Translate 2 left and 3 down", rule: "(x, y) → (x − 2, y − 3)", spec: { kind: "translation", dx: -2, dy: -3 }, clue: "Every vertex moves 2 units left and 3 units down." },
    { exact: "Translate 3 right and 3 up", rule: "(x, y) → (x + 3, y + 3)", spec: { kind: "translation", dx: 3, dy: 3 }, clue: "The same pair of changes is added to every ordered pair." },
    { exact: "Rotate 90° clockwise", rule: "(x, y) → (y, −x)", spec: { kind: "rotation", degrees: 90, direction: "cw" }, clue: "The figure makes a quarter-turn clockwise about the origin." },
    { exact: "Rotate 180°", rule: "(x, y) → (−x, −y)", spec: { kind: "rotation", degrees: 180, direction: "cw" }, clue: "The figure makes a half-turn about the origin." },
    { exact: "Rotate 270° clockwise", rule: "(x, y) → (−y, x)", spec: { kind: "rotation", degrees: 270, direction: "cw" }, clue: "This is also a 90° counterclockwise rotation." },
    { exact: "Rotate 90° counterclockwise", rule: "(x, y) → (−y, x)", spec: { kind: "rotation", degrees: 90, direction: "ccw" }, clue: "The figure makes a quarter-turn counterclockwise about the origin." },
    { exact: "Reflect over the y-axis", rule: "(x, y) → (−x, y)", spec: { kind: "reflection", axis: "y" }, clue: "Only the x-coordinate changes sign." },
    { exact: "Reflect over the x-axis", rule: "(x, y) → (x, −y)", spec: { kind: "reflection", axis: "x" }, clue: "Only the y-coordinate changes sign." },
    { exact: "Reflect over the y-axis", rule: "(x, y) → (−x, y)", spec: { kind: "reflection", axis: "y" }, clue: "Corresponding points are equally far from the vertical axis." },
    { exact: "Reflect over the x-axis", rule: "(x, y) → (x, −y)", spec: { kind: "reflection", axis: "x" }, clue: "Corresponding points are equally far from the horizontal axis." },
    { exact: "Dilate by k = 2", rule: "(x, y) → (2x, 2y)", spec: { kind: "dilation", k: 2 }, points: [{ x: -3, y: 1 }, { x: -1, y: 1 }, { x: -2, y: 3 }], clue: "Each distance from the origin doubles." },
    { exact: "Dilate by k = 1/2", rule: "(x, y) → (½x, ½y)", spec: { kind: "dilation", k: .5 }, clue: "Each distance from the origin is cut in half." },
    { exact: "Dilate by k = 3/2", rule: "(x, y) → (1.5x, 1.5y)", spec: { kind: "dilation", k: 1.5 }, points: [{ x: -4, y: 1 }, { x: -2, y: 1 }, { x: -3, y: 3 }], clue: "Every coordinate is multiplied by 1.5." },
    { exact: "Dilate by k = 3", rule: "(x, y) → (3x, 3y)", spec: { kind: "dilation", k: 3 }, points: [{ x: -2, y: 1 }, { x: -1, y: 1 }, { x: -1.5, y: 2 }], clue: "Each distance from the origin triples." },
    { mode: "rule", exact: "Translate 3 left and 2 up", rule: "(x, y) → (x − 3, y + 2)", spec: { kind: "translation", dx: -3, dy: 2 }, clue: "Read what is added to x and y." },
    { mode: "rule", exact: "Rotate 90° counterclockwise", rule: "(x, y) → (−y, x)", spec: { kind: "rotation", degrees: 90, direction: "ccw" }, clue: "The coordinates swap, and the new x is the opposite of y." },
    { mode: "rule", exact: "Reflect over the x-axis", rule: "(x, y) → (x, −y)", spec: { kind: "reflection", axis: "x" }, clue: "The x-coordinate stays the same." },
    { mode: "rule", exact: "Dilate by k = 1/2", rule: "(x, y) → (½x, ½y)", spec: { kind: "dilation", k: .5 }, clue: "Both coordinates are multiplied by the same factor." }
  ];

  const EXACT_OPTIONS = ["Translate 4 right and 2 down", "Translate 5 right and 1 up", "Translate 2 left and 3 down", "Translate 3 right and 3 up", "Translate 3 left and 2 up", "Rotate 90° clockwise", "Rotate 180°", "Rotate 270° clockwise", "Rotate 90° counterclockwise", "Reflect over the y-axis", "Reflect over the x-axis", "Dilate by k = 2", "Dilate by k = 1/2", "Dilate by k = 3/2", "Dilate by k = 3"];
  const RULE_OPTIONS = ["(x, y) → (x + 4, y − 2)", "(x, y) → (x + 5, y + 1)", "(x, y) → (x − 2, y − 3)", "(x, y) → (x + 3, y + 3)", "(x, y) → (y, −x)", "(x, y) → (−x, −y)", "(x, y) → (−y, x)", "(x, y) → (−x, y)", "(x, y) → (x, −y)", "(x, y) → (2x, 2y)", "(x, y) → (½x, ½y)", "(x, y) → (1.5x, 1.5y)", "(x, y) → (3x, 3y)"];

  function optionSet(correct, bank, index) {
    const alternatives = bank.filter(value => value !== correct);
    const offset = (index * 3) % alternatives.length;
    return [correct, alternatives[offset], alternatives[(offset + 2) % alternatives.length], alternatives[(offset + 5) % alternatives.length]].sort((a, b) => ((a.length + index) % 7) - ((b.length + index) % 7));
  }

  function renderLabC() {
    if (!labRuntime.data) labRuntime.data = { index: 0, played: false, correct: false, exact: null, rule: null };
    const data = labRuntime.data;
    if (data.index >= TRANSFORMATION_CHALLENGES.length) {
      setLabProgress(TRANSFORMATION_CHALLENGES.length, TRANSFORMATION_CHALLENGES.length, "All sixteen observations and four rule exemplars complete.");
      return showLabCompletion("8.10C");
    }
    const item = TRANSFORMATION_CHALLENGES[data.index];
    const points = item.points || BASE_TRIANGLE;
    const finalPoints = applyTransformation(points, item.spec);
    const ruleMode = item.mode === "rule";
    const exactOptions = optionSet(item.exact, EXACT_OPTIONS, data.index);
    const ruleOptions = optionSet(item.rule, RULE_OPTIONS, data.index);
    setLabProgress(data.index, TRANSFORMATION_CHALLENGES.length, ruleMode ? `Rule exemplar ${data.index - 15}: use the rule to predict the transformation.` : `Observation ${data.index + 1}: watch, name the exact transformation, and match its rule.`);
    $("#standardsLabBody").innerHTML = `
      <div class="lab-grid">
        <div class="lab-stage-card">
          <div class="round-dots">${TRANSFORMATION_CHALLENGES.map((_, index) => `<span class="${index < data.index ? "is-done" : index === data.index ? "is-current" : ""}"></span>`).join("")}</div>
          <p class="lab-mini-title">Coordinate plane</p>
          ${coordinateGraphMarkup(points, points, "challengeResult")}
          <div class="challenge-toolbar">
            <button type="button" class="lab-action" id="playChallenge">▶ Play</button>
            <button type="button" class="lab-action secondary" id="replayChallenge" ${data.played ? "" : "disabled"}>↺ Replay</button>
          </div>
        </div>
        <div class="lab-task-card">
          <p class="lab-mini-title">${ruleMode ? "Rule-to-graph exemplar" : "Identify the movement and rule"}</p>
          <h4>${ruleMode ? "Which exact transformation matches this rule?" : "What exactly happened?"}</h4>
          ${ruleMode ? `<div class="given-rule"><span>Given rule</span><strong>${item.rule}</strong></div>` : ""}
          <p id="challengeClue">${ruleMode ? item.clue : (data.played ? item.clue : "Press Play to reveal the movement. The choices unlock when the animation begins.")}</p>
          <div class="property-question"><strong>Exact transformation</strong><div class="challenge-options">${exactOptions.map(value => `<button type="button" class="lab-choice ${data.exact === value ? "is-selected" : ""}" data-c-exact="${value}" ${data.played || ruleMode ? "" : "disabled"}>${value}</button>`).join("")}</div></div>
          ${ruleMode ? "" : `<div class="property-question"><strong>Algebraic rule</strong><div class="challenge-options rule-options">${ruleOptions.map(value => `<button type="button" class="lab-choice ${data.rule === value ? "is-selected" : ""}" data-c-rule="${value}" ${data.played ? "" : "disabled"}>${value}</button>`).join("")}</div></div>`}
          <button type="button" class="lab-action" id="checkChallenge" ${data.played || ruleMode ? "" : "disabled"}>Check answer</button>
          <button type="button" class="lab-next" id="nextChallenge" ${data.correct ? "" : "hidden"}>Next example →</button>
        </div>
      </div>`;
    function animate() {
      data.played = true;
      const shape = $("#challengeResult");
      const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 900;
      const started = performance.now();
      cancelAnimationFrame(labRuntime.animationFrame || 0);
      function frame(now) {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = item.spec.kind === "rotation"
          ? applyTransformation(points, { ...item.spec, degrees: item.spec.degrees * eased })
          : points.map((point, index) => ({ x: point.x + (finalPoints[index].x - point.x) * eased, y: point.y + (finalPoints[index].y - point.y) * eased }));
        shape.setAttribute("points", svgPointString(current));
        document.querySelectorAll(".coordinate-transformed-label").forEach((label, index) => {
          const screen = screenPoint(current[index]);
          label.setAttribute("x", screen.x + 10);
          label.setAttribute("y", screen.y + 20);
        });
        if (progress < 1) labRuntime.animationFrame = requestAnimationFrame(frame);
      }
      labRuntime.animationFrame = requestAnimationFrame(frame);
      document.querySelectorAll("[data-c-exact], [data-c-rule]").forEach(button => button.disabled = false);
      $("#checkChallenge").disabled = false;
      $("#challengeClue").textContent = item.clue;
      $("#replayChallenge").disabled = false;
      setLabFeedback("Watch the position, size, and orientation. Then choose the transformation.");
    }
    $("#playChallenge").addEventListener("click", animate);
    $("#replayChallenge").addEventListener("click", animate);
    document.querySelectorAll("[data-c-exact]").forEach(button => button.addEventListener("click", () => { data.exact = button.dataset.cExact; document.querySelectorAll("[data-c-exact]").forEach(option => option.classList.toggle("is-selected", option === button)); }));
    document.querySelectorAll("[data-c-rule]").forEach(button => button.addEventListener("click", () => { data.rule = button.dataset.cRule; document.querySelectorAll("[data-c-rule]").forEach(option => option.classList.toggle("is-selected", option === button)); }));
    $("#checkChallenge").addEventListener("click", () => {
      if (!data.exact || (!ruleMode && !data.rule)) return setLabFeedback(ruleMode ? "Choose the exact transformation that matches the rule." : "Choose both the exact transformation and its algebraic rule.", "incorrect");
      if (data.exact !== item.exact || (!ruleMode && data.rule !== item.rule)) return setLabFeedback(`Not quite. ${item.clue} Replay the movement and compare one vertex at a time.`, "incorrect");
      data.correct = true; $("#nextChallenge").hidden = false; setLabFeedback(`Correct: ${item.exact}. The rule is ${item.rule}.`, "correct");
    });
    $("#nextChallenge").addEventListener("click", () => { data.index += 1; data.played = false; data.correct = false; data.exact = null; data.rule = null; renderLabC(); setLabFeedback(data.index >= 16 ? "Use the given algebraic rule to predict the exact transformation." : "New figure ready. Press Play when you are ready to observe."); });
  }

  const DILATION_PROBLEMS = [
    { k: "2", kValue: 2, area: "4", before: "3 × 5", after: "6 × 10", points: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2.5 }, { x: 1, y: 2.5 }], chips: ["2","4","6","8"] },
    { k: "3", kValue: 3, area: "9", before: "2 × 4", after: "6 × 12", points: [{ x: .8, y: .8 }, { x: 2, y: .8 }, { x: 2, y: 1.8 }, { x: .8, y: 1.8 }], chips: ["3","6","9","12"] },
    { k: "1/2", kValue: .5, area: "1/4", before: "8 × 6", after: "4 × 3", points: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 6, y: 5 }, { x: 2, y: 5 }], chips: ["1/2","1/4","2","4"] },
    { k: "1.5", kValue: 1.5, area: "2.25", before: "4 × 6", after: "6 × 9", points: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 3 }, { x: 1, y: 3 }], chips: ["1.5","2.25","3","4.5"] }
  ];

  function renderLabD() {
    if (!labRuntime.data) labRuntime.data = { index: 0, selected: null, answers: {}, solved: false };
    const data = labRuntime.data;
    if (data.index >= DILATION_PROBLEMS.length) {
      setLabProgress(DILATION_PROBLEMS.length, DILATION_PROBLEMS.length, "All four dilation comparisons solved.");
      return showLabCompletion("8.10D");
    }
    const item = DILATION_PROBLEMS[data.index];
    setLabProgress(data.index, DILATION_PROBLEMS.length, `Problem ${data.index + 1}: place one factor for perimeter and one for area.`);
    const zoneClass = kind => data.answers[kind] ? `is-filled ${data.answers[kind] === (kind === "perimeter" ? item.k : item.area) ? "is-correct" : "is-incorrect"}` : "";
    $("#standardsLabBody").innerHTML = `
      <div class="dilation-problem">
        <div class="dilation-visual"><div><p class="lab-mini-title">Coordinate plane</p>${coordinateGraphMarkup(item.points, applyTransformation(item.points, { kind: "dilation", k: item.kValue }))}<div class="measure-pair"><span>Figure ABCD: ${item.before}</span><span>Figure A′B′C′D′: ${item.after}</span></div></div></div>
        <div class="lab-task-card">
          <p class="lab-mini-title">Scale factor k = ${item.k}</p>
          <h4>How did each measurement change?</h4>
          <p>Drag a factor into each target. On a touch screen, tap a factor and then tap the target.</p>
          <div class="factor-bank"><strong>Factor bank</strong><div class="factor-chips">${item.chips.map(value => `<button type="button" draggable="true" class="factor-chip ${data.selected === value ? "is-selected" : ""}" data-d-factor="${value}">×${value}</button>`).join("")}</div></div>
          <div class="drop-grid">
            <button type="button" class="drop-zone ${zoneClass("perimeter")}" data-d-zone="perimeter"><strong>${data.answers.perimeter ? `×${data.answers.perimeter}` : "Drop factor"}</strong><span>Perimeter change</span></button>
            <button type="button" class="drop-zone ${zoneClass("area")}" data-d-zone="area"><strong>${data.answers.area ? `×${data.answers.area}` : "Drop factor"}</strong><span>Area change</span></button>
          </div>
          <button type="button" class="lab-action" id="checkLabD">Check both factors</button>
          <button type="button" class="lab-next" id="nextLabD" ${data.solved ? "" : "hidden"}>Next problem →</button>
        </div>
      </div>`;
    function assign(kind, value) { if (!value) return; data.answers[kind] = value; data.selected = null; renderLabD(); setLabFeedback(`Placed ×${value} for ${kind}. Add the other factor, then check both.`); }
    document.querySelectorAll("[data-d-factor]").forEach(button => {
      button.addEventListener("click", () => { data.selected = button.dataset.dFactor; renderLabD(); setLabFeedback(`Factor ×${data.selected} selected. Now choose perimeter or area.`); });
      button.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", button.dataset.dFactor));
    });
    document.querySelectorAll("[data-d-zone]").forEach(zone => {
      zone.addEventListener("click", () => assign(zone.dataset.dZone, data.selected));
      zone.addEventListener("dragover", event => event.preventDefault());
      zone.addEventListener("drop", event => { event.preventDefault(); assign(zone.dataset.dZone, event.dataTransfer.getData("text/plain")); });
    });
    $("#checkLabD").addEventListener("click", () => {
      if (!data.answers.perimeter || !data.answers.area) return setLabFeedback("Place a factor in both targets before checking.", "incorrect");
      if (data.answers.perimeter !== item.k || data.answers.area !== item.area) return setLabFeedback(`Not yet. Perimeter changes by k, while area changes by k². Here k = ${item.k}.`, "incorrect");
      data.solved = true; $("#nextLabD").hidden = false; setLabFeedback(`Correct. Perimeter changed by ×${item.k}, and area changed by ×${item.area}.`, "correct");
    });
    $("#nextLabD").addEventListener("click", () => { data.index += 1; data.selected = null; data.answers = {}; data.solved = false; renderLabD(); setLabFeedback("New dilation ready. Compare the figures and place both factors."); });
  }

  function skipCurrentLabProblem() {
    const standard = state.labStandard;
    const data = labRuntime.data;
    if (!standard || !data || $("#skipLabProblem").disabled) return;
    labRuntime.skipped += 1;

    if (standard === "8.4A") {
      if (data.index >= SLOPE_LAB_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetSlopeTask(data);
      renderLab84A();
    } else if (standard === "8.4B") {
      if (data.index >= PROPORTION_LAB_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetProportionTask(data);
      renderLab84B();
    } else if (standard === "8.5A" || standard === "8.5B") {
      const tasks = standard === "8.5B" ? NONPROPORTIONAL_RELATION_LAB_TASKS : RELATION_LAB_TASKS;
      if (data.index >= tasks.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetRelationTask(data);
      renderRelationLab(standard);
    } else if (standard === "8.5C") {
      if (data.index >= SCATTER_TOTAL_TASKS - 1) return showLabCompletion(standard);
      data.index += 1;
      resetScatterTask(data);
      renderLab85C();
    } else if (standard === "8.5D") {
      if (data.index >= TREND_LAB_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetTrendTask(data);
      renderLab85D();
    } else if (standard === "8.5G") {
      if (data.phase === "description") {
        if (data.index >= FUNCTION_DESCRIPTION_TASKS.length - 1) {
          data.phase = "build";
          data.index = 0;
        } else {
          data.index += 1;
        }
      } else if (data.index >= FUNCTION_BUILD_TASKS.length - 1) {
        return showLabCompletion(standard);
      } else {
        data.index += 1;
      }
      resetFunctionTask(data);
      renderLab85G();
    } else if (standard === "8.5H") {
      if (data.index >= WHICH_DOES_NOT_BELONG_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetWdbTask(data);
      renderLab85H();
    } else if (standard === "8.5I") {
      if (data.index >= EQUATION_WRITING_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetEquationWritingTask(data);
      renderLab85I();
    } else if (standard === "8.3A") {
      if (data.index >= SIMILARITY_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetSimilarityTask(data);
      renderLab83A();
    } else if (standard === "8.3B") {
      if (data.index >= DILATION_ATTRIBUTE_TASKS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      resetDilationAttributeTask(data);
      renderLab83B();
    } else if (standard === "8.3C") {
      if (data.index >= DILATION_RULE_QUESTIONS.length - 1) return showLabCompletion(standard);
      data.index += 1;
      data.selected = null;
      data.wrong = null;
      data.answered = false;
      renderLab83C();
    } else if (standard === "8.2A") {
      if (data.phase === "sort") {
        data.phase = "visual";
        data.visualIndex = 0;
      } else if (data.visualIndex >= 4) {
        return showLabCompletion(standard);
      } else {
        data.visualIndex += 1;
      }
      data.visualSelected = null;
      data.visualAnswered = false;
      renderLab82A();
    } else if (standard === "8.2B") {
      if (data.phase === "numberLine") {
        if (data.lineIndex >= 4) {
          data.phase = "application";
          data.applicationIndex = 0;
        } else {
          data.lineIndex += 1;
        }
        data.placed = {};
        data.selected = null;
      } else if (data.applicationIndex >= 4) {
        return showLabCompletion(standard);
      } else {
        data.applicationIndex += 1;
        data.applicationSelected = null;
        data.applicationAnswered = false;
      }
      renderLab82B();
    } else if (standard === "8.2C") {
      if (data.index >= 15) return showLabCompletion(standard);
      data.index += 1;
      data.answered = false;
      renderLab82C();
    } else if (standard === "8.2D") {
      if (data.index >= 9) return showLabCompletion(standard);
      data.index += 1;
      data.placed = {};
      data.selected = null;
      data.choice = null;
      data.answered = false;
      renderLab82D();
    } else if (standard === "8.10A") {
      data.completed.add(data.index);
      const nextIndex = Array.from({ length: 4 }, (_, index) => index).find(index => !data.completed.has(index));
      if (nextIndex === undefined) return showLabCompletion(standard);
      data.index = nextIndex;
      data.orientation = null;
      data.congruent = null;
      data.exact = null;
      renderLabA();
    } else if (standard === "8.10B") {
      return showLabCompletion(standard);
    } else if (standard === "8.10C") {
      data.index += 1;
      data.played = false;
      data.correct = false;
      data.exact = null;
      data.rule = null;
      renderLabC();
    } else if (standard === "8.10D") {
      data.index += 1;
      data.selected = null;
      data.answers = {};
      data.solved = false;
      renderLabD();
    }

    if (!$("#standardsLabCompletion").hidden) return;
    syncWhiteboardQuestion();
    setLabFeedback("Problem skipped. You can keep moving and return by restarting the lab at any time.");
  }

  function initializeTransformationLab() {
    const svgNS = "http://www.w3.org/2000/svg";
    const origin = 300;
    const scale = 25;
    const basePoints = [
      { name: "A", x: -4, y: 1 },
      { name: "B", x: -1, y: 1 },
      { name: "C", x: -2, y: 4 }
    ];
    let currentPoints = basePoints.map(point => ({ ...point }));
    let animationFrame = 0;

    const toScreen = point => ({ x: origin + point.x * scale, y: origin - point.y * scale });
    const pointString = points => points.map(point => {
      const screen = toScreen(point);
      return `${screen.x},${screen.y}`;
    }).join(" ");

    function svgElement(name, attrs = {}) {
      const element = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
      return element;
    }

    function buildGrid() {
      const grid = $("#gridLayer");
      const axes = $("#axisLayer");
      for (let value = -10; value <= 10; value++) {
        const position = origin + value * scale;
        grid.append(svgElement("line", { x1: position, y1: 50, x2: position, y2: 550, class: `grid-line${value % 5 === 0 ? " major" : ""}` }));
        grid.append(svgElement("line", { x1: 50, y1: position, x2: 550, y2: position, class: `grid-line${value % 5 === 0 ? " major" : ""}` }));
        if (value !== 0 && value % 2 === 0) {
          const xNumber = svgElement("text", { x: position, y: 322, class: "axis-number" });
          xNumber.textContent = value;
          axes.append(xNumber);
          const yNumber = svgElement("text", { x: 278, y: origin - value * scale + 5, class: "axis-number" });
          yNumber.textContent = value;
          axes.append(yNumber);
        }
      }
      axes.append(svgElement("line", { x1: 50, y1: origin, x2: 550, y2: origin, class: "axis-line" }));
      axes.append(svgElement("line", { x1: origin, y1: 50, x2: origin, y2: 550, class: "axis-line" }));
      const xName = svgElement("text", { x: 559, y: 292, class: "axis-name" }); xName.textContent = "x"; axes.append(xName);
      const yName = svgElement("text", { x: 310, y: 43, class: "axis-name" }); yName.textContent = "y"; axes.append(yName);
    }

    function drawLabels(layerSelector, points, prime) {
      const layer = $(layerSelector);
      layer.innerHTML = "";
      points.forEach(point => {
        const screen = toScreen(point);
        const text = svgElement("text", { x: screen.x + 10, y: screen.y - 12 });
        text.textContent = `${point.name}${prime ? "′" : ""}`;
        layer.append(text);
      });
    }

    function drawCoordinates(points) {
      $("#coordinateRows").innerHTML = basePoints.map((point, index) => {
        const image = points[index];
        return `<div class="coordinate-row"><strong>${point.name} → ${point.name}′</strong><span>(${point.x}, ${point.y}) → (${image.x}, ${image.y})</span></div>`;
      }).join("");
    }

    function draw(points) {
      $("#originalShape").setAttribute("points", pointString(basePoints));
      $("#imageShape").setAttribute("points", pointString(points));
      drawLabels("#originalLabels", basePoints, false);
      drawLabels("#imageLabels", points, true);
    }

    function animateTo(target, rule, explanation) {
      cancelAnimationFrame(animationFrame);
      clearRotationFocus();
      const startPoints = basePoints.map(point => ({ ...point }));
      currentPoints = startPoints;
      draw(currentPoints);
      drawCoordinates(target);
      $("#ruleText").textContent = rule;
      $("#ruleExplanation").textContent = explanation;
      const started = performance.now();
      const duration = 850;
      function frame(now) {
        const raw = Math.min(1, (now - started) / duration);
        const ease = 1 - Math.pow(1 - raw, 3);
        currentPoints = startPoints.map((point, index) => ({
          name: point.name,
          x: point.x + (target[index].x - point.x) * ease,
          y: point.y + (target[index].y - point.y) * ease
        }));
        draw(currentPoints);
        if (raw < 1) animationFrame = requestAnimationFrame(frame);
        else { currentPoints = target; draw(currentPoints); }
      }
      animationFrame = requestAnimationFrame(frame);
    }

    function resetLab() {
      cancelAnimationFrame(animationFrame);
      clearRotationFocus();
      currentPoints = basePoints.map(point => ({ ...point }));
      draw(currentPoints);
      drawCoordinates(currentPoints);
      $("#ruleText").textContent = "(x, y) → (x, y)";
      $("#ruleExplanation").textContent = "The image is resting directly on the pre-image. Choose a transformation to move it.";
    }

    function signedTerm(value, variable) {
      if (value === 0) return variable;
      return `${variable} ${value > 0 ? "+" : "−"} ${Math.abs(value)}`;
    }

    const rotationLessons = {
      90: {
        counterclockwise: 270,
        rule: "(x, y) → (y, −x)",
        explanation: "A 90° clockwise turn is the same final rotation as 270° counterclockwise. Switch the coordinates and change the sign of the new y-value."
      },
      180: {
        counterclockwise: 180,
        rule: "(x, y) → (−x, −y)",
        explanation: "A half turn reaches the same place in either direction. Both coordinates change signs."
      },
      270: {
        counterclockwise: 90,
        rule: "(x, y) → (−y, x)",
        explanation: "A 270° clockwise turn is the same final rotation as 90° counterclockwise. Switch the coordinates and change the sign of the new x-value."
      },
      360: {
        counterclockwise: 360,
        rule: "(x, y) → (x, y)",
        explanation: "A 360° turn makes one complete circle and returns every point to its starting location. It is equivalent to 360° counterclockwise—and to a 0° turn."
      }
    };

    function rotatePoints(degrees, round = false) {
      const radians = -degrees * Math.PI / 180;
      const cosine = Math.cos(radians);
      const sine = Math.sin(radians);
      return basePoints.map(point => {
        const x = point.x * cosine - point.y * sine;
        const y = point.x * sine + point.y * cosine;
        return { ...point, x: round ? Math.round(x) : x, y: round ? Math.round(y) : y };
      });
    }

    function clearRotationFocus() {
      $("#turnMeter").hidden = true;
      document.querySelectorAll("[data-rotate-degrees], [data-equivalence-degrees]").forEach(button => button.classList.remove("is-active"));
    }

    function updateRotationFocus(degrees) {
      const lesson = rotationLessons[degrees];
      document.querySelectorAll("[data-rotate-degrees]").forEach(button => button.classList.toggle("is-active", Number(button.dataset.rotateDegrees) === degrees));
      document.querySelectorAll("[data-equivalence-degrees]").forEach(button => button.classList.toggle("is-active", Number(button.dataset.equivalenceDegrees) === degrees));
      $("#clockwiseMatch").textContent = `${degrees}° clockwise`;
      $("#counterclockwiseMatch").textContent = degrees === 360 ? "360° counterclockwise (or 0°)" : `${lesson.counterclockwise}° counterclockwise`;
      $("#equivalenceExplanation").textContent = degrees === 360
        ? "One full turn in either direction returns every point to its starting location. A 0° turn also has the same final position."
        : `Turning ${degrees}° clockwise or ${lesson.counterclockwise}° counterclockwise takes every point to the same final position.`;
    }

    function animateRotation(degrees) {
      cancelAnimationFrame(animationFrame);
      const lesson = rotationLessons[degrees];
      const target = rotatePoints(degrees, true);
      const meter = $("#turnMeter");
      meter.hidden = false;
      updateRotationFocus(degrees);
      currentPoints = basePoints.map(point => ({ ...point }));
      draw(currentPoints);
      drawCoordinates(target);
      $("#ruleText").textContent = lesson.rule;
      $("#ruleExplanation").textContent = lesson.explanation;
      const started = performance.now();
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const duration = reduceMotion ? 1 : Math.max(900, degrees * 3.5);
      function frame(now) {
        const raw = Math.min(1, (now - started) / duration);
        const ease = 1 - Math.pow(1 - raw, 3);
        const traveled = degrees * ease;
        currentPoints = rotatePoints(traveled);
        draw(currentPoints);
        $("#turnDegrees").textContent = `${Math.round(traveled)}°`;
        if (raw < 1) animationFrame = requestAnimationFrame(frame);
        else {
          currentPoints = target;
          draw(currentPoints);
          $("#turnDegrees").textContent = `${degrees}°`;
        }
      }
      animationFrame = requestAnimationFrame(frame);
    }

    buildGrid();
    resetLab();

    document.querySelectorAll("[data-transform-tab]").forEach(button => {
      button.addEventListener("click", () => {
        const type = button.dataset.transformTab;
        document.querySelectorAll("[data-transform-tab]").forEach(tab => {
          const active = tab === button;
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        document.querySelectorAll("[data-transform-panel]").forEach(panel => panel.classList.toggle("is-active", panel.dataset.transformPanel === type));
      });
    });

    $("#playTranslation").addEventListener("click", () => {
      const dx = Math.max(-5, Math.min(5, Number($("#translateX").value) || 0));
      const dy = Math.max(-5, Math.min(5, Number($("#translateY").value) || 0));
      $("#translateX").value = dx;
      $("#translateY").value = dy;
      animateTo(
        basePoints.map(point => ({ ...point, x: point.x + dx, y: point.y + dy })),
        `(x, y) → (${signedTerm(dx, "x")}, ${signedTerm(dy, "y")})`,
        `Every x-value ${dx === 0 ? "stays the same" : `${dx > 0 ? "increases" : "decreases"} by ${Math.abs(dx)}`}. Every y-value ${dy === 0 ? "stays the same" : `${dy > 0 ? "increases" : "decreases"} by ${Math.abs(dy)}`}.`
      );
    });

    document.querySelectorAll("[data-reflect]").forEach(button => {
      button.addEventListener("click", () => {
        const axis = button.dataset.reflect;
        if (axis === "x") {
          animateTo(basePoints.map(point => ({ ...point, y: -point.y })), "(x, y) → (x, −y)", "The x-value stays the same. The y-value changes sign.");
        } else {
          animateTo(basePoints.map(point => ({ ...point, x: -point.x })), "(x, y) → (−x, y)", "The y-value stays the same. The x-value changes sign.");
        }
      });
    });

    document.querySelectorAll("[data-rotate-degrees]").forEach(button => {
      button.addEventListener("click", () => animateRotation(Number(button.dataset.rotateDegrees)));
    });

    document.querySelectorAll("[data-equivalence-degrees]").forEach(button => {
      button.addEventListener("click", () => animateRotation(Number(button.dataset.equivalenceDegrees)));
    });

    $("#labReset").addEventListener("click", resetLab);

    const labVideos = Object.entries(VIDEO_TITLES).map(([url, title]) => ({ url, title }));
    const videoList = $("#labVideoList");
    labVideos.forEach(video => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `▶ ${video.title}`;
      button.addEventListener("click", () => openVideo(video));
      videoList.append(button);
    });
  }

  function initializeWhiteboard() {
    document.querySelectorAll("[data-whiteboard-tool]").forEach(button => button.addEventListener("click", () => updateWhiteboardTool(button.dataset.whiteboardTool)));
    document.querySelectorAll("[data-whiteboard-color]").forEach(button => button.addEventListener("click", () => {
      whiteboardState.color = button.dataset.whiteboardColor;
      $("#whiteboardCustomColor").value = whiteboardState.color;
      document.querySelectorAll("[data-whiteboard-color]").forEach(option => option.classList.toggle("is-active", option === button));
    }));
    $("#whiteboardCustomColor").addEventListener("input", event => {
      whiteboardState.color = event.target.value;
      document.querySelectorAll("[data-whiteboard-color]").forEach(option => option.classList.remove("is-active"));
    });
    $("#whiteboardWidth").addEventListener("input", event => { whiteboardState.width = Number(event.target.value); });
    $("#whiteboardTextSize").addEventListener("change", event => { whiteboardState.textSize = Number(event.target.value); });

    whiteboardCanvas.addEventListener("pointerdown", event => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      if (whiteboardState.tool === "pointer") return;
      event.preventDefault();
      if (whiteboardState.tool === "text") return showWhiteboardTextEntry(event);
      whiteboardState.drawing = true;
      whiteboardCanvas.setPointerCapture(event.pointerId);
      const point = whiteboardPoint(event);
      if (whiteboardState.tool === "line") {
        whiteboardState.draft = { tool: "line", color: whiteboardState.color, width: whiteboardState.width, start: point, end: point };
      } else {
        whiteboardState.draft = {
          tool: whiteboardState.tool,
          color: whiteboardState.color,
          width: whiteboardState.tool === "highlighter" ? whiteboardState.width * 3 : whiteboardState.width,
          points: [point]
        };
      }
      renderWhiteboard();
    });

    whiteboardCanvas.addEventListener("pointermove", event => {
      if (!whiteboardState.drawing || !whiteboardState.draft) return;
      event.preventDefault();
      const point = whiteboardPoint(event);
      if (whiteboardState.draft.tool === "line") {
        whiteboardState.draft.end = point;
      } else {
        const last = whiteboardState.draft.points[whiteboardState.draft.points.length - 1];
        const rect = whiteboardCanvas.getBoundingClientRect();
        const distance = Math.hypot((point.x - last.x) * rect.width, (point.y - last.y) * rect.height);
        if (distance > 1.6) whiteboardState.draft.points.push(point);
      }
      renderWhiteboard();
    });

    const finishStroke = event => {
      if (!whiteboardState.drawing) return;
      event.preventDefault();
      whiteboardState.drawing = false;
      if (whiteboardCanvas.hasPointerCapture(event.pointerId)) whiteboardCanvas.releasePointerCapture(event.pointerId);
      const operation = whiteboardState.draft;
      whiteboardState.draft = null;
      commitWhiteboardOperation(operation);
    };
    whiteboardCanvas.addEventListener("pointerup", finishStroke);
    whiteboardCanvas.addEventListener("pointercancel", finishStroke);

    whiteboardTextEntry.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); commitWhiteboardText(); }
      if (event.key === "Escape") { event.preventDefault(); whiteboardTextEntry.hidden = true; whiteboardState.textPoint = null; whiteboardCanvas.focus(); }
    });
    whiteboardTextEntry.addEventListener("blur", commitWhiteboardText);

    $("#whiteboardUndo").addEventListener("click", () => {
      const operation = whiteboardState.operations.pop();
      if (!operation) return;
      whiteboardState.redo.push(operation);
      saveWhiteboard();
      renderWhiteboard();
    });
    $("#whiteboardRedo").addEventListener("click", () => {
      const operation = whiteboardState.redo.pop();
      if (!operation) return;
      whiteboardState.operations.push(operation);
      saveWhiteboard();
      renderWhiteboard();
    });
    $("#whiteboardClear").addEventListener("click", () => {
      if (!whiteboardState.operations.length || window.confirm("Clear every mark from this question?")) {
        whiteboardState.operations = [];
        whiteboardState.redo = [];
        saveWhiteboard();
        renderWhiteboard();
      }
    });
    openWhiteboardButton.addEventListener("click", () => whiteboardState.open ? closeWhiteboard() : openWhiteboard());
    $("#closeWhiteboard").addEventListener("click", closeWhiteboard);
    $("#skipLabProblem").addEventListener("click", skipCurrentLabProblem);
    $("#whiteboardSkipProblem").addEventListener("click", () => { updateWhiteboardTool("pointer"); skipCurrentLabProblem(); });
    let whiteboardSyncFrame = 0;
    new MutationObserver(() => {
      if (!whiteboardState.open) return;
      cancelAnimationFrame(whiteboardSyncFrame);
      whiteboardSyncFrame = requestAnimationFrame(syncWhiteboardQuestion);
    }).observe($("#standardsLabBody"), { childList: true, subtree: true });
    if (window.ResizeObserver) new ResizeObserver(() => { if (whiteboardState.open) renderWhiteboard(); }).observe(whiteboardStage);
    else window.addEventListener("resize", () => { if (whiteboardState.open) renderWhiteboard(); });
  }

  search.addEventListener("input", event => renderDashboard(event.target.value));
  $("#previousPage").addEventListener("click", () => setPage(state.pageIndex - 1));
  $("#nextPage").addEventListener("click", () => setPage(state.pageIndex + 1));
  $("#showOverview").addEventListener("click", () => {
    state.activeStandard = null;
    setPage(Number.isInteger(state.group.entryPageIndex) ? state.group.entryPageIndex : Math.min(1, state.group.pages.length - 1));
  });
  $("#backToMap").addEventListener("click", goHome);
  $("#homeButton").addEventListener("click", goHome);
  $("#standardsLabReset").addEventListener("click", () => {
    if (!state.labStandard) return;
    labRuntime.data = null;
    renderStandardsLab(state.labStandard, true);
    setLabFeedback("Lab reset. Begin again when you are ready.");
  });
  $("#closeVideo").addEventListener("click", closeVideo);
  $("#expandVideo").addEventListener("click", () => {
    const expanded = videoDialogShell.classList.toggle("is-expanded");
    $("#expandVideo span").textContent = expanded ? "Reduce" : "Expand";
  });
  videoDialog.addEventListener("cancel", event => { event.preventDefault(); closeVideo(); });
  videoDialog.addEventListener("click", event => { if (event.target === videoDialog) closeVideo(); });
  $("#helpButton").addEventListener("click", () => $("#helpDialog").showModal());
  $("#closeHelp").addEventListener("click", () => $("#helpDialog").close());
  $("#helpDialog").addEventListener("click", event => { if (event.target === $("#helpDialog")) $("#helpDialog").close(); });
  document.addEventListener("keydown", event => {
    if (whiteboardState.open) {
      if (event.key === "Escape" && whiteboardTextEntry.hidden) closeWhiteboard();
      return;
    }
    if (!workspaceView.classList.contains("is-active") || videoDialog.open) return;
    if (event.key === "ArrowLeft") setPage(state.pageIndex - 1);
    if (event.key === "ArrowRight") setPage(state.pageIndex + 1);
  });

  renderDashboard();
  renderHotspots();
  updateContinueCard();
  initializeTransformationLab();
  initializeWhiteboard();
})();
