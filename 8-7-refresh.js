(() => {
  const group = (window.WORD_WALL_DATA || []).find(item => item.code === "8.7");
  if (!group) return;

  // 8.7A anchor-chart videos mapped to the exact visible play buttons.
  const coneVideo = "https://go.screenpal.com/watch/cOew1cnTx88";
  const coneHeightVideo = "https://go.screenpal.com/watch/cOewhtnTxM2";
  const coneRadiusVideo = "https://go.screenpal.com/watch/cOewhonTxsX";
  const sphereVideo = "https://go.screenpal.com/watch/cOew12nTx9k";
  const cylinderVideo = "https://go.screenpal.com/watch/cOew1UnTxSk";

  const lateralSurfaceArea = "https://go.screenpal.com/watch/cOewrnnTaAP";
  const totalSurfaceArea = "https://go.screenpal.com/watch/cOewrQnTaBR";
  const perimeterBase = "https://go.screenpal.com/watch/cOewr3nTakp";
  const surfaceHeight = "https://go.screenpal.com/watch/cOewrgnTaCG";
  const areaBase = "https://go.screenpal.com/watch/cOewhonTxsX";
  const cylinderLsa = "https://go.screenpal.com/watch/cOfVnZnTzQX";
  const cylinderTsa = "https://go.screenpal.com/watch/cOfVnMnTzI1";
  const rectangularPrismLsa = "https://go.screenpal.com/watch/cOfVeFnTzDX";
  const rectangularPrismTsa = "https://go.screenpal.com/watch/cOew36nTaGS";
  const triangularPrismLsa = "https://go.screenpal.com/watch/cOfVeMnTzqP";
  const triangularPrismTsa = "https://go.screenpal.com/watch/cOewr9nTaE7";
  const surfaceAreaOverview = "https://go.screenpal.com/watch/cOew14nTxWx";

  const converse = "https://go.screenpal.com/watch/cOfebZnT5SF";
  const legs = "https://go.screenpal.com/watch/cOfeDgnT5NR";
  const hypotenuse = "https://go.screenpal.com/watch/cOfeDPnT59i";

  const distance = "https://go.screenpal.com/watch/cOfebynT5WY";

  group.entryPageIndex = 0;
  group.pages = [
    {
      page: 1,
      image: "assets/8-7-01.png?v=20260916-87-revamp",
      videos: [],
      resource: "Standards",
      substandardHotspots: [
        { standard: "8.7A", label: "Open 8.7A anchor chart", left: 2.7, top: 25.5, width: 44.0, height: 31.8 },
        { standard: "8.7B", label: "Open 8.7B anchor chart", left: 53.0, top: 25.5, width: 44.0, height: 31.8 },
        { standard: "8.7C", label: "Open 8.7C anchor chart", left: 2.7, top: 60.2, width: 44.0, height: 31.8 },
        { standard: "8.7D", label: "Open 8.7D anchor chart", left: 53.0, top: 60.2, width: 44.0, height: 31.8 }
      ]
    },
    {
      page: 2,
      image: "assets/8-7-02.jpeg?v=20260916-87-revamp",
      standard: "8.7A",
      resource: "Anchor chart",
      videos: [
        { title: "Cone", url: coneVideo },
        { title: "Height", url: coneHeightVideo },
        { title: "Radius", url: coneRadiusVideo },
        { title: "Sphere", url: sphereVideo },
        { title: "Cylinder", url: cylinderVideo }
      ],
      videoHotspots: [
        { title: "Cone", url: coneVideo, left: 24.5, top: 21.0, width: 5.0, height: 8.5 },

        { title: "Height", url: coneHeightVideo, left: 24.5, top: 41.0, width: 5.0, height: 8.5 },
        { title: "Height", url: coneHeightVideo, left: 85.5, top: 41.0, width: 5.0, height: 8.5 },

        { title: "Radius", url: coneRadiusVideo, left: 24.5, top: 51.5, width: 5.0, height: 8.5 },
        { title: "Radius", url: coneRadiusVideo, left: 56.5, top: 28.5, width: 5.0, height: 8.5 },
        { title: "Radius", url: coneRadiusVideo, left: 89.5, top: 51.5, width: 5.0, height: 8.5 },

        { title: "Sphere", url: sphereVideo, left: 56.5, top: 21.0, width: 5.0, height: 8.5 },
        { title: "Cylinder", url: cylinderVideo, left: 88.5, top: 21.0, width: 5.0, height: 8.5 }
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
        { title: "Lateral Surface Area", url: lateralSurfaceArea },
        { title: "Total Surface Area", url: totalSurfaceArea },
        { title: "Perimeter of the Base", url: perimeterBase },
        { title: "Height in Surface Area Formulas", url: surfaceHeight },
        { title: "Area of the Base", url: areaBase },
        { title: "Cylinder: Lateral Surface Area", url: cylinderLsa },
        { title: "Cylinder: Total Surface Area", url: cylinderTsa },
        { title: "Rectangular Prism: Lateral Surface Area", url: rectangularPrismLsa },
        { title: "Rectangular Prism: Total Surface Area", url: rectangularPrismTsa },
        { title: "Triangular Prism: Lateral Surface Area", url: triangularPrismLsa },
        { title: "Triangular Prism: Total Surface Area", url: triangularPrismTsa },
        { title: "Surface Area Overview", url: surfaceAreaOverview }
      ],
      videoHotspots: [
        { title: "Lateral Surface Area", url: lateralSurfaceArea, left: 23.0, top: 13.7, width: 5.0, height: 8.0 },
        { title: "Total Surface Area", url: totalSurfaceArea, left: 51.5, top: 13.7, width: 5.0, height: 8.0 },
        { title: "Perimeter of the Base", url: perimeterBase, left: 43.0, top: 21.3, width: 5.0, height: 8.0 },
        { title: "Height in Surface Area Formulas", url: surfaceHeight, left: 67.0, top: 21.3, width: 5.0, height: 8.0 },
        { title: "Area of the Base", url: areaBase, left: 64.0, top: 26.8, width: 5.0, height: 8.0 },
        { title: "Cylinder: Lateral Surface Area", url: cylinderLsa, left: 21.5, top: 68.0, width: 5.0, height: 8.0 },
        { title: "Cylinder: Total Surface Area", url: cylinderTsa, left: 21.5, top: 76.5, width: 5.0, height: 8.0 },
        { title: "Rectangular Prism: Lateral Surface Area", url: rectangularPrismLsa, left: 60.8, top: 64.2, width: 5.0, height: 8.0 },
        { title: "Rectangular Prism: Total Surface Area", url: rectangularPrismTsa, left: 60.8, top: 72.5, width: 5.0, height: 8.0 },
        { title: "Triangular Prism: Lateral Surface Area", url: triangularPrismLsa, left: 93.3, top: 62.8, width: 5.0, height: 8.0 },
        { title: "Triangular Prism: Total Surface Area", url: triangularPrismTsa, left: 93.3, top: 71.5, width: 5.0, height: 8.0 }
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
        { title: "The Legs of a Right Triangle", url: legs },
        { title: "The Hypotenuse of a Right Triangle", url: hypotenuse },
        { title: "Converse of the Pythagorean Theorem", url: converse }
      ],
      videoHotspots: [
        { title: "The Legs of a Right Triangle", url: legs, left: 32.5, top: 27.5, width: 5.0, height: 8.0 },
        { title: "The Legs of a Right Triangle", url: legs, left: 47.5, top: 40.5, width: 5.0, height: 8.0 },
        { title: "The Hypotenuse of a Right Triangle", url: hypotenuse, left: 48.0, top: 21.0, width: 5.0, height: 8.0 },
        { title: "Converse of the Pythagorean Theorem", url: converse, left: 51.0, top: 51.5, width: 5.0, height: 8.0 }
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
        { title: "Distance on the Coordinate Plane", url: distance }
      ],
      videoHotspots: [
        { title: "Distance on the Coordinate Plane", url: distance, left: 25.0, top: 44.0, width: 13.0, height: 10.0 }
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
