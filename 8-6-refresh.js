(() => {
  const group = (window.WORD_WALL_DATA || []).find(item => item.code === "8.6");
  if (!group) return;

  const svgData = svg => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  const defs = `
    <defs>
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff5a0"/><stop offset=".35" stop-color="#ffd600"/><stop offset="1" stop-color="#ff9d00"/></linearGradient>
    </defs>`;
  const network = `
    <g opacity=".50" stroke="#ffd400" stroke-width="2">
      <path d="M0 160 L125 105 L245 190 L360 75 L510 160 L665 90 L820 175 L980 95 L1150 180 L1300 90 L1600 165"/>
      <path d="M0 690 L155 610 L305 720 L455 635 L610 750 L785 645 L940 730 L1110 625 L1275 735 L1430 640 L1600 705"/>
      <path d="M70 0 L140 120 L95 265 L215 365 L150 510 L265 645 L220 900"/>
      <path d="M1510 0 L1430 130 L1490 280 L1370 390 L1450 535 L1325 675 L1390 900"/>
      <path d="M310 0 L390 115 L350 250 M560 0 L635 115 L600 250 M1020 0 L1090 120 L1060 255 M1260 0 L1330 120 L1295 250"/>
    </g>
    <g fill="url(#gold)" filter="url(#glow)">
      <circle cx="135" cy="115" r="10"/><circle cx="242" cy="190" r="8"/><circle cx="360" cy="75" r="12"/><circle cx="510" cy="160" r="8"/><circle cx="665" cy="90" r="10"/><circle cx="820" cy="175" r="7"/><circle cx="980" cy="95" r="10"/><circle cx="1150" cy="180" r="8"/><circle cx="1300" cy="90" r="11"/><circle cx="1460" cy="175" r="10"/>
      <circle cx="155" cy="610" r="13"/><circle cx="305" cy="720" r="8"/><circle cx="455" cy="635" r="11"/><circle cx="610" cy="750" r="8"/><circle cx="785" cy="645" r="10"/><circle cx="940" cy="730" r="8"/><circle cx="1110" cy="625" r="12"/><circle cx="1275" cy="735" r="8"/><circle cx="1430" cy="640" r="13"/>
      <circle cx="95" cy="265" r="9"/><circle cx="215" cy="365" r="11"/><circle cx="150" cy="510" r="8"/><circle cx="1490" cy="280" r="10"/><circle cx="1370" cy="390" r="11"/><circle cx="1450" cy="535" r="9"/>
    </g>`;
  const shell = inner => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${defs}<rect width="1600" height="900" fill="#020202"/>${network}<rect x="7" y="7" width="1586" height="886" rx="36" fill="none" stroke="#ffd400" stroke-width="8"/>${inner}</svg>`;
  const title = (code, text, sub="") => `<rect x="210" y="28" width="1180" height="106" rx="38" fill="#050505" stroke="#ffd400" stroke-width="5"/><text x="800" y="86" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="47" font-weight="800">${code} | ${text}</text>${sub ? `<text x="800" y="114" text-anchor="middle" fill="#fff2ad" font-family="Arial,sans-serif" font-size="19" font-weight="700">${sub}</text>` : ""}`;
  const box = (x,y,w,h,body,sw=4,rx=28) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#050505" stroke="#ffd400" stroke-width="${sw}"/>${body}`;
  const text = (x,y,value,size=34,fill="#fff",weight=700,anchor="start") => `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${value}</text>`;

  const slides = {};

  slides.hub = shell(`${title("8.6","Equations &amp; Formulas","Choose a substandard")}
    ${box(160,192,1280,146,`${text(238,282,"8.6A",48,"#ffd400",900)}<line x1="420" y1="216" x2="420" y2="312" stroke="#ffd400" stroke-width="4"/>${text(462,259,"Describe the volume formula V = Bh for a cylinder in",31)}${text(462,294,"terms of its base area and height",31)}`)}
    ${box(160,382,1280,146,`${text(238,472,"8.6B",48,"#ffd400",900)}<line x1="420" y1="406" x2="420" y2="502" stroke="#ffd400" stroke-width="4"/>${text(462,449,"Model the relationship between the volume of a cylinder",31)}${text(462,484,"and a cone with congruent bases and heights",31)}`)}
    ${box(160,572,1280,146,`${text(238,662,"8.6C",48,"#ffd400",900)}<line x1="420" y1="596" x2="420" y2="692" stroke="#ffd400" stroke-width="4"/>${text(462,639,"Use models and diagrams to explain the Pythagorean",31)}${text(462,674,"theorem",31)}`)}
  `);

  slides.aAnchor = shell(`${title("8.6A","Volume of a Cylinder")}
    ${text(185,198,"volume of a",34,"#ffd400",900)}${text(185,236,"cylinder",34,"#ffd400",900)}${text(468,214,"=",52,"#fff",800)}${text(550,214,"area of the base",35,"#fff2ad",800)}${text(896,214,"×",50,"#fff",800)}${text(1015,198,"height of the",34,"#ffd400",900)}${text(1015,236,"cylinder",34,"#ffd400",900)}
    ${box(105,286,1150,118,`${text(680,366,"V = B × h",66,"#fff",800,"middle")}`,4,24)}
    ${text(190,436,"V = volume",24,"#ddd",700)}${text(588,436,"B = base area",24,"#ddd",700)}${text(1020,436,"h = height",24,"#ddd",700)}
    ${box(105,505,1370,138,`${text(790,593,"V = (B = πr²) × h",58,"#fff",800,"middle")}`,4,24)}
    ${box(400,706,800,110,`${text(800,783,"V = πr²h",58,"#fff",800,"middle")}`,4,24)}
    <g fill="none" stroke="#ffd400" stroke-width="5"><ellipse cx="1420" cy="190" rx="70" ry="31"/><line x1="1350" y1="190" x2="1350" y2="408"/><line x1="1490" y1="190" x2="1490" y2="408"/><ellipse cx="1420" cy="408" rx="70" ry="31"/><line x1="1420" y1="190" x2="1420" y2="408" stroke="#fff"/><line x1="1420" y1="190" x2="1480" y2="190"/></g>${text(1460,182,"r",25,"#ffd400",700)}${text(1403,305,"h",25,"#fff",700)}${text(1360,475,"cylinder",28,"#fff",800)}
  `);

  const calculator = (code, subtitle, formula) => shell(`${title(code,"Calculator Tips",subtitle)}
    <rect x="550" y="130" width="500" height="650" rx="36" fill="#0b0b0b" stroke="#ffd400" stroke-width="5"/>
    <rect x="590" y="170" width="420" height="105" rx="14" fill="#fff2ad" stroke="#ffd400" stroke-width="3"/>${text(800,235,formula,37,"#272727",900,"middle")}
    ${[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>`<rect x="${600+c*78}" y="${315+r*82}" width="58" height="52" rx="8" fill="${c===4?'#4b4400':'#242424'}" stroke="${c===4?'#ffd400':'#555'}" stroke-width="2"/>`).join('')).join('')}
    ${[0,1,2,3,4].map(c=>`<rect x="${600+c*78}" y="650" width="58" height="52" rx="8" fill="#4b4400" stroke="#ffd400" stroke-width="2"/>`).join('')}
  `);
  slides.aCalc = calculator("8.6A","Volume of a cylinder","V = πr²h");

  slides.bAnchor = shell(`${title("8.6B","Cone and Cylinder Volume")}
    <g fill="none" stroke="#ffd400" stroke-width="5"><ellipse cx="250" cy="310" rx="65" ry="26"/><line x1="185" y1="310" x2="250" y2="165"/><line x1="315" y1="310" x2="250" y2="165"/><ellipse cx="480" cy="310" rx="65" ry="26"/><line x1="415" y1="310" x2="480" y2="165"/><line x1="545" y1="310" x2="480" y2="165"/><ellipse cx="750" cy="270" rx="65" ry="26" transform="rotate(90 750 270)"/><line x1="750" y1="205" x2="610" y2="270"/><line x1="750" y1="335" x2="610" y2="270"/><ellipse cx="1050" cy="185" rx="68" ry="28"/><line x1="982" y1="185" x2="982" y2="320"/><line x1="1118" y1="185" x2="1118" y2="320"/><ellipse cx="1050" cy="320" rx="68" ry="28"/></g>
    ${text(875,260,"=",54,"#fff",900,"middle")}
    ${box(1160,170,300,160,`${text(1310,205,"The height and",21,"#fff",700,"middle")}${text(1310,232,"radius of each",21,"#fff",700,"middle")}${text(1310,259,"cone must be",21,"#fff",700,"middle")}${text(1310,286,"the same as the",21,"#fff",700,"middle")}${text(1310,313,"height and radius of the cylinder.",18,"#fff",700,"middle")}`,3,18)}
    ${box(125,390,1350,92,`${text(800,448,"volume of a cone × 3 = volume of cylinder",34,"#fff",800,"middle")}`,4,20)}
    ${box(150,510,1300,95,`${text(800,572,"(V = ⅓Bh) × 3 = V = Bh",38,"#fff",800,"middle")}`,4,20)}
    ${box(300,640,1000,95,`${text(800,702,"(V = Bh) ÷ 3  →  V = ⅓Bh",36,"#fff",800,"middle")}`,4,20)}
  `);
  slides.bCalc = calculator("8.6B","Volume of a cone","V = (πr²h) ÷ 3");

  slides.cAnchor = shell(`${title("8.6C","Pythagorean Theorem")}
    ${text(95,190,"(leg × leg) + (leg × leg) = (hypotenuse × hypotenuse)",24,"#fff2ad",800)}
    ${text(80,260,"leg² + leg² = hypotenuse²",39,"#ffd400",900)}
    ${box(48,322,570,112,`${text(333,394,"a² + b² = c²",55,"#fff",900,"middle")}`,4,22)}
    ${text(55,488,"Why use the Pythagorean Theorem?",31,"#fff",900)}${text(80,548,"To find a missing side length in a right",26,"#fff",700)}${text(80,582,"triangle",26,"#fff",700)}
    <g transform="translate(930,190)"><polygon points="0,260 210,260 210,70" fill="none" stroke="#fff" stroke-width="5"/><rect x="-150" y="260" width="150" height="150" fill="#171717" stroke="#ffd400" stroke-width="4"/><rect x="210" y="110" width="150" height="150" fill="#171717" stroke="#ffd400" stroke-width="4"/><polygon points="0,0 210,70 360,-120 150,-190" fill="#171717" stroke="#ffd400" stroke-width="4" transform="translate(0,260)"/><text x="-75" y="350" fill="#ddd" font-size="22" text-anchor="middle">area = a²</text><text x="285" y="205" fill="#ddd" font-size="22" text-anchor="middle">area = b²</text><text x="180" y="135" fill="#ffd400" font-size="22" text-anchor="middle">area = c²</text></g>
    ${text(1260,690,"right triangle",25,"#fff",700)}
  `);
  slides.cCalc = calculator("8.6C","Pythagorean theorem","a² + b² = c²");

  group.entryPageIndex = 0;
  group.pages = [
    {
      page: 1,
      image: svgData(slides.hub),
      videos: [],
      resource: "Standards",
      substandardHotspots: [
        { standard: "8.6A", label: "Volume of a cylinder", left: 10.0, top: 21.3, width: 80.0, height: 16.4 },
        { standard: "8.6B", label: "Cone and cylinder volume", left: 10.0, top: 42.4, width: 80.0, height: 16.4 },
        { standard: "8.6C", label: "Pythagorean theorem", left: 10.0, top: 63.6, width: 80.0, height: 16.4 }
      ]
    },
    {
      page: 2,
      image: svgData(slides.aAnchor),
      standard: "8.6A",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://somup.com/cOeIe2Vcjui" },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIe0Vcjug" },
        { title: "Watch lesson 3", url: "https://somup.com/cOeIezVcjUu" },
        { title: "Watch lesson 4", url: "https://somup.com/cOeIemVcjU9" },
        { title: "Watch lesson 5", url: "https://somup.com/cOeIf4Vcjx4" }
      ],
      videoHotspots: [
        { title: "Watch lesson 1", url: "https://somup.com/cOeIe2Vcjui", left: 10.5, top: 15.7, width: 17.5, height: 13.5 },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIe0Vcjug", left: 32.5, top: 15.7, width: 22.0, height: 13.5 },
        { title: "Watch lesson 3", url: "https://somup.com/cOeIezVcjUu", left: 62.0, top: 15.7, width: 18.0, height: 13.5 },
        { title: "Watch lesson 4", url: "https://somup.com/cOeIemVcjU9", left: 7.0, top: 31.8, width: 71.0, height: 13.5 },
        { title: "Watch lesson 5", url: "https://somup.com/cOeIf4Vcjx4", left: 25.0, top: 77.5, width: 50.0, height: 13.0 }
      ]
    },
    {
      page: 3,
      image: svgData(slides.aCalc),
      standard: "8.6A",
      resource: "Calculator tips",
      videos: [{ title: "Calculator support", url: "https://somup.com/cOefqlWNAR" }],
      videoHotspots: [{ title: "Calculator support", url: "https://somup.com/cOefqlWNAR", left: 34.3, top: 14.5, width: 31.5, height: 72.0 }]
    },
    {
      page: 4,
      image: svgData(slides.bAnchor),
      standard: "8.6B",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://somup.com/cOefq8WNpX" },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIeMVcjvq" }
      ],
      videoHotspots: [
        { title: "Watch lesson 1", url: "https://somup.com/cOefq8WNpX", left: 8.0, top: 15.0, width: 64.0, height: 24.0 },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIeMVcjvq", left: 8.0, top: 42.0, width: 84.0, height: 40.0 }
      ]
    },
    {
      page: 5,
      image: svgData(slides.bCalc),
      standard: "8.6B",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 6,
      image: svgData(slides.cAnchor),
      standard: "8.6C",
      resource: "Anchor chart",
      videos: [
        { title: "Watch lesson 1", url: "https://somup.com/cOeIfeVcjvN" },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIeRVcjva" },
        { title: "Watch lesson 3", url: "https://somup.com/cOeIfTVcjwW" }
      ],
      videoHotspots: [
        { title: "Watch lesson 1", url: "https://somup.com/cOeIfeVcjvN", left: 4.0, top: 16.0, width: 48.0, height: 16.0 },
        { title: "Watch lesson 2", url: "https://somup.com/cOeIeRVcjva", left: 3.0, top: 34.0, width: 36.0, height: 15.0 },
        { title: "Watch lesson 3", url: "https://somup.com/cOeIfTVcjwW", left: 55.0, top: 16.0, width: 38.0, height: 55.0 }
      ]
    },
    {
      page: 7,
      image: svgData(slides.cCalc),
      standard: "8.6C",
      resource: "Calculator tips",
      videos: []
    }
  ];
})();
