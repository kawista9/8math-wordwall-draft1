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
      ],
      videoHotspots: [
        { title: "Volume of a Cylinder", url: "https://somup.com/cOeIe2Vcjui", left: 10.5, top: 15.0, width: 18.5, height: 13.5 },
        { title: "Area of the Base", url: "https://somup.com/cOeIe0Vcjug", left: 34.5, top: 15.0, width: 19.5, height: 13.5 },
        { title: "Height of the Cylinder", url: "https://somup.com/cOeIezVcjUu", left: 60.5, top: 15.0, width: 19.0, height: 13.5 },
        { title: "V = B × h", url: "https://somup.com/cOeIemVcjU9", left: 6.5, top: 31.0, width: 72.0, height: 15.0 },
        { title: "V = πr²h", url: "https://somup.com/cOeIf4Vcjx4", left: 24.5, top: 77.0, width: 50.5, height: 14.0 }
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
        { title: "Build the Cone Volume Formula", url: "https://somup.com/cOeIeMVcjvq" }
      ],
      videoHotspots: [
        { title: "Build the Cone Volume Formula", url: "https://somup.com/cOeIeMVcjvq", left: 6.0, top: 53.5, width: 87.5, height: 38.0 }
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
        { title: "Legs in the Pythagorean Theorem", url: "https://somup.com/cOeIeRVcjva" },
        { title: "Hypotenuse in the Pythagorean Theorem", url: "https://somup.com/cOeIfeVcjvN" },
        { title: "Area Model for the Pythagorean Theorem", url: "https://somup.com/cOeIfTVcjwW" },
        { title: "Why Use the Pythagorean Theorem?", url: "https://somup.com/cOeIfXVcjwq" }
      ],
      videoHotspots: [
        { title: "Legs in the Pythagorean Theorem", url: "https://somup.com/cOeIeRVcjva", left: 2.30, top: 9.98, width: 5.63, height: 12.61 },
        { title: "Hypotenuse in the Pythagorean Theorem", url: "https://somup.com/cOeIfeVcjvN", left: 34.56, top: 10.16, width: 5.47, height: 12.26 },
        { title: "Area Model for the Pythagorean Theorem", url: "https://somup.com/cOeIfTVcjwW", left: 60.61, top: 7.99, width: 6.10, height: 13.66 },
        { title: "Why Use the Pythagorean Theorem?", url: "https://somup.com/cOeIfXVcjwq", left: 2.99, top: 75.20, width: 5.94, height: 13.31 }
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

document.write('<script src="8-7-refresh.js?v=20260916-87-revamp"><\/script>');
