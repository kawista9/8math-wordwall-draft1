(() => {
  const group = (window.WORD_WALL_DATA || []).find(item => item.code === "8.6");
  if (!group) return;

  group.entryPageIndex = 0;
  group.pages = [
    {
      page: 1,
      image: "assets/8.6_revamp_01.png?v=20260915-8.6revamp-final",
      videos: [],
      resource: "Standards",
      substandardHotspots: [
        { standard: "8.6A", label: "Volume of a cylinder", left: 5.0, top: 21.0, width: 90.0, height: 20.0 },
        { standard: "8.6B", label: "Cone and cylinder volume", left: 5.0, top: 43.0, width: 90.0, height: 20.0 },
        { standard: "8.6C", label: "Pythagorean theorem", left: 5.0, top: 65.0, width: 90.0, height: 20.0 }
      ]
    },
    {
      page: 2,
      image: "assets/8.6_revamp_02.png?v=20260915-8.6revamp-final",
      standard: "8.6A",
      resource: "Anchor chart",
      videos: [
        { title: "Volume of a Cylinder", url: "https://somup.com/cOeIe2Vcjui" },
        { title: "Area of the Base", url: "https://somup.com/cOeIe0Vcjug" },
        { title: "Height of the Cylinder", url: "https://somup.com/cOeIezVcjUu" },
        { title: "V = B × h", url: "https://somup.com/cOeIemVcjU9" },
        { title: "V = πr²h", url: "https://somup.com/cOeIf4Vcjx4" }
      ]
    },
    {
      page: 3,
      image: "assets/8.6_revamp_03.png?v=20260915-8.6revamp-final",
      standard: "8.6A",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 4,
      image: "assets/8.6_revamp_04.png?v=20260915-8.6revamp-final",
      standard: "8.6B",
      resource: "Anchor chart",
      videos: [
        { title: "Cone and Cylinder Volume Relationship", url: "https://somup.com/cOefq8WNpX" },
        { title: "Build the Cone Volume Formula", url: "https://somup.com/cOeIeMVcjvq" }
      ]
    },
    {
      page: 5,
      image: "assets/8.6_revamp_05.png?v=20260915-8.6revamp-final",
      standard: "8.6B",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 6,
      image: "assets/8.6_revamp_06.png?v=20260915-8.6revamp-final",
      standard: "8.6C",
      resource: "Anchor chart",
      videos: [
        { title: "Pythagorean Theorem", url: "https://somup.com/cOeIfeVcjvN" },
        { title: "Why the Pythagorean Theorem Works", url: "https://somup.com/cOeIeRVcjva" },
        { title: "Square Model for a² + b² = c²", url: "https://somup.com/cOeIfTVcjwW" }
      ]
    },
    {
      page: 7,
      image: "assets/8.6_revamp_07.png?v=20260915-8.6revamp-final",
      standard: "8.6C",
      resource: "Calculator tips",
      videos: []
    }
  ];
})();
