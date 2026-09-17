(() => {
  const group = (window.WORD_WALL_DATA || []).find(item => item.code === "8.7");
  if (!group) return;

  group.entryPageIndex = 0;
  group.pages = [
    {
      page: 1,
      image: "assets/8-7-01.png?v=20260916-87-revamp",
      videos: [],
      resource: "Standards",
      substandardHotspots: [
        { standard: "8.7A", label: "Open 8.7A", left: 5, top: 14, width: 90, height: 17 },
        { standard: "8.7B", label: "Open 8.7B", left: 5, top: 33, width: 90, height: 17 },
        { standard: "8.7C", label: "Open 8.7C", left: 5, top: 52, width: 90, height: 17 },
        { standard: "8.7D", label: "Open 8.7D", left: 5, top: 71, width: 90, height: 17 }
      ]
    },
    {
      page: 2,
      image: "assets/8-7-02.jpeg?v=20260916-87-revamp",
      standard: "8.7A",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://go.screenpal.com/watch/cOewhonTxsX" },
        { title: "Watch lesson 2", url: "https://go.screenpal.com/watch/cOewhtnTxM2" },
        { title: "Watch lesson 3", url: "https://go.screenpal.com/watch/cOew1cnTx88" },
        { title: "Watch lesson 4", url: "https://go.screenpal.com/watch/cOew12nTx9k" },
        { title: "Watch lesson 5", url: "https://go.screenpal.com/watch/cOew1UnTxSk" }
      ]
    },
    {
      page: 3,
      image: "assets/8-7-03.jpeg?v=20260916-87-revamp",
      standard: "8.7A",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 4,
      image: "assets/8-7-04.jpeg?v=20260916-87-revamp",
      standard: "8.7B",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://go.screenpal.com/watch/cOewrnnTaAP" },
        { title: "Watch lesson 2", url: "https://go.screenpal.com/watch/cOewrQnTaBR" },
        { title: "Watch lesson 3", url: "https://go.screenpal.com/watch/cOewr3nTakp" },
        { title: "Watch lesson 4", url: "https://go.screenpal.com/watch/cOewrgnTaCG" },
        { title: "Watch lesson 5", url: "https://go.screenpal.com/watch/cOewhonTxsX" },
        { title: "Watch lesson 6", url: "https://go.screenpal.com/watch/cOfVnZnTzQX" },
        { title: "Watch lesson 7", url: "https://go.screenpal.com/watch/cOfVnMnTzI1" },
        { title: "Watch lesson 8", url: "https://go.screenpal.com/watch/cOfVeFnTzDX" },
        { title: "Watch lesson 9", url: "https://go.screenpal.com/watch/cOew36nTaGS" },
        { title: "Watch lesson 10", url: "https://go.screenpal.com/watch/cOfVeMnTzqP" },
        { title: "Watch lesson 11", url: "https://go.screenpal.com/watch/cOewr9nTaE7" },
        { title: "Surface area", url: "https://go.screenpal.com/watch/cOew14nTxWx" }
      ]
    },
    {
      page: 5,
      image: "assets/8-7-05.jpeg?v=20260916-87-revamp",
      standard: "8.7B",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 6,
      image: "assets/8-7-06.jpeg?v=20260916-87-revamp",
      standard: "8.7C",
      resource: "Anchor chart",
      videos: [
        { title: "Converse of the Pythagorean Theorem", url: "https://go.screenpal.com/watch/cOfebZnT5SF" },
        { title: "Watch lesson 2", url: "https://go.screenpal.com/watch/cOfeDgnT5NR" },
        { title: "Watch lesson 3", url: "https://go.screenpal.com/watch/cOfeDPnT59i" }
      ]
    },
    {
      page: 7,
      image: "assets/8-7-07.jpeg?v=20260916-87-revamp",
      standard: "8.7C",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 8,
      image: "assets/8-7-08.jpeg?v=20260916-87-revamp",
      standard: "8.7D",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://go.screenpal.com/watch/cOfebynT5WY" }
      ]
    },
    {
      page: 9,
      image: "assets/8-7-09.jpeg?v=20260916-87-revamp",
      standard: "8.7D",
      resource: "Calculator tips",
      videos: []
    }
  ];

  try {
    const key = "mww-progress-v1";
    const progress = JSON.parse(localStorage.getItem(key)) || { visited: {} };
    progress.migrations ||= {};
    if (!progress.migrations.redesign87) {
      const remap = index => {
        if (!Number.isInteger(index) || index <= 1) return 0;
        if (index <= 3) return 1;
        if (index === 4) return 2;
        if (index <= 6) return 3;
        if (index === 7) return 4;
        if (index <= 9) return 5;
        if (index === 10) return 6;
        if (index <= 12) return 7;
        return 8;
      };
      if (progress.last?.groupId === "8-7") progress.last.pageIndex = remap(progress.last.pageIndex);
      if (Array.isArray(progress.visited?.["8-7"])) {
        progress.visited["8-7"] = [...new Set(progress.visited["8-7"].map(remap))];
      }
      progress.migrations.redesign87 = true;
      localStorage.setItem(key, JSON.stringify(progress));
    }
  } catch {}
})();
