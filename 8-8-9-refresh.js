(() => {
  const group = (window.WORD_WALL_DATA || []).find(item => item.id === "8-8-9" || item.code === "8.8–8.9");
  if (!group) return;

  group.entryPageIndex = 0;

  const v = {
    aWatchFirst: { title: "Watch Me First", url: "https://go.screenpal.com/watch/cOfIcVnOer1" },
    aVariable: { title: "Variable Term", url: "https://go.screenpal.com/watch/cOflb6nOn5D" },
    aConstant: { title: "Constant", url: "https://go.screenpal.com/watch/cOflb0nOnEE" },
    aAtMost: { title: "At Most / Less Than or Equal To", url: "https://go.screenpal.com/watch/cOflb8nOnH7" },
    aLess: { title: "Less Than", url: "https://go.screenpal.com/watch/cOflb7nOnH0" },
    aEqual: { title: "Equal To", url: "https://go.screenpal.com/watch/cOflbvnOnGv" },
    aGreater: { title: "Greater Than", url: "https://go.screenpal.com/watch/cOflFinOnJB" },
    aAtLeast: { title: "At Least / Greater Than or Equal To", url: "https://go.screenpal.com/watch/cOflF2nOnd2" },
    aSetup: { title: "Basic Equation/Inequality Set-Up", url: "https://go.screenpal.com/watch/cOflF0nOnK6" },

    bGym: { title: "Writing Inequalities for Gym Membership Costs", url: "https://go.screenpal.com/watch/cOflFwnOnK5" },
    bFundraiser: { title: "Writing Equations from Real-World Situations", url: "https://go.screenpal.com/watch/cOflF5nOn7H" },
    bVerbal: { title: "Writing Equations from Real World Situations", url: "https://go.screenpal.com/watch/cOflFBnOn7D" },
    bBabysitter: { title: "Writing Inequalities for Babysitter Earnings", url: "https://go.screenpal.com/watch/cOflF4nOnK9" },
    bRectangle: { title: "Writing Equations from Real World Situations", url: "https://go.screenpal.com/watch/cOflFsnOnsJ" },

    cTiles: { title: "Modeling Equations", url: "https://go.screenpal.com/watch/cOflF8nOnMX" },
    cVariables: { title: "Understanding Inverse Operations", url: "https://go.screenpal.com/watch/cOflF9nOnMF" },
    cSolve: { title: "Solving Equations: Using Inverse Operations", url: "https://go.screenpal.com/watch/cOflqonOnLP" },
    cCalculator: { title: "How to Use Your Calculator to Solve Systems of Equations", url: "https://go.screenpal.com/watch/cOfIcQnOerJ" },

    dInteriorExterior: { title: "Exterior Angle Relationships from Triangles", url: "https://go.screenpal.com/watch/cOfl0GnOeqY" },
    dOverview: { title: "Understanding Parallel Lines and Transversals", url: "https://go.screenpal.com/watch/cOflqqnOnNt" },
    dCorresponding: { title: "Corresponding Angles in Parallel Lines and Transversals", url: "https://go.screenpal.com/watch/cOflq3nOnNa" },
    dPairs: { title: "Angle Pairs and Parallel Lines", url: "https://go.screenpal.com/watch/cOflqwnOn8F" },
    dCalculatorFirst: { title: "Using a Calculator to Find Angle Measures", url: "https://go.screenpal.com/watch/cOfbbZnOq23" },
    dCalculatorSecond: { title: "Solving for X and Angle Measures in Parallel Lines", url: "https://go.screenpal.com/watch/cOfbbMnOqFk" },

    system: { title: "Graphing Equations and Finding Solutions", url: "https://go.screenpal.com/watch/cOfl0LnOeYr" }
  };

  const videos = (...items) => items;
  const spot = (video, left, top, width, height) => ({ ...video, left, top, width, height });

  group.pages = [
    {
      page: 1,
      image: "assets/8-8-9-hub.png?v=20260922-889-final",
      videos: [],
      resource: "Standards",
      substandardHotspots: [
        { standard: "8.8A", label: "Write equations and inequalities", left: 2.8, top: 23.0, width: 94.4, height: 12.4 },
        { standard: "8.8B", label: "Write real-world problems from equations and inequalities", left: 2.8, top: 37.3, width: 94.4, height: 12.4 },
        { standard: "8.8C", label: "Model and solve equations with variables on both sides", left: 2.8, top: 51.5, width: 94.4, height: 12.4 },
        { standard: "8.8D", label: "Angle relationships and triangle similarity", left: 2.8, top: 65.7, width: 94.4, height: 12.4 },
        { standard: "8.9A", label: "Solutions to systems from graphed intersections", left: 2.8, top: 79.8, width: 94.4, height: 12.0 }
      ]
    },
    {
      page: 2,
      image: "assets/8-8A-anchor.png?v=20260923-88A-symbol-fix",
      standard: "8.8A",
      resource: "Anchor chart",
      videos: videos(v.aWatchFirst, v.aVariable, v.aConstant, v.aAtMost, v.aLess, v.aEqual, v.aGreater, v.aAtLeast, v.aSetup),
      videoHotspots: [
        // Watch Me First.
        spot(v.aWatchFirst, 78.6, 6.6, 6.2, 8.4),
        // Left-side vocabulary buttons.
        spot(v.aVariable, 4.0, 20.2, 5.2, 7.0),
        spot(v.aConstant, 3.9, 49.1, 5.2, 7.0),
        // Symbol buttons, left to right: ≤, <, =, >, ≥.
        spot(v.aAtMost, 47.9, 26.2, 5.0, 7.0),
        spot(v.aLess, 57.6, 26.2, 5.0, 7.0),
        spot(v.aEqual, 67.7, 26.2, 5.0, 7.0),
        spot(v.aGreater, 78.4, 26.2, 5.0, 7.0),
        spot(v.aAtLeast, 88.2, 26.2, 5.0, 7.0),
        // Basic equation / inequality set-up button.
        spot(v.aSetup, 19.2, 72.8, 5.2, 7.0)
      ]
    },
    {
      page: 3,
      image: "assets/8-8A-calculator.png?v=20260922-889-final",
      standard: "8.8A",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 4,
      image: "assets/8-8B-anchor.png?v=20260922-889-final",
      standard: "8.8B",
      resource: "Anchor chart",
      videos: videos(v.bGym, v.bFundraiser, v.bVerbal, v.bBabysitter, v.bRectangle),
      videoHotspots: [
        // Watch Me First opens the gym membership introduction.
        spot(v.bGym, 80.3, 7.3, 7.0, 13.0),
        // Worked examples in reading order.
        spot(v.bGym, 43.0, 28.8, 6.2, 11.0),
        spot(v.bFundraiser, 91.4, 28.6, 6.2, 11.0),
        spot(v.bVerbal, 43.0, 55.0, 6.2, 11.0),
        spot(v.bBabysitter, 91.4, 55.2, 6.2, 11.0),
        spot(v.bRectangle, 69.2, 77.7, 6.2, 11.0)
      ]
    },
    {
      page: 5,
      image: "assets/8-8B-calculator.png?v=20260922-889-final",
      standard: "8.8B",
      resource: "Calculator tips",
      videos: []
    },
    {
      page: 6,
      image: "assets/8-8C-anchor.png?v=20260922-889-final",
      standard: "8.8C",
      resource: "Anchor chart",
      videos: videos(v.cTiles, v.cVariables, v.cSolve),
      videoHotspots: [
        spot(v.cTiles, 6.7, 26.4, 5.2, 9.0),
        spot(v.cVariables, 6.7, 41.3, 5.2, 9.0),
        spot(v.cSolve, 73.3, 69.4, 6.0, 10.5)
      ]
    },
    {
      page: 7,
      image: "assets/8-8C-calculator.png?v=20260922-889-final",
      standard: "8.8C",
      resource: "Calculator tips",
      videos: videos(v.cCalculator),
      videoHotspots: [
        { ...spot(v.cCalculator, 59.3, 30.0, 6.8, 12.0), showPlayButton: true }
      ]
    },
    {
      page: 8,
      image: "assets/8-8D-triangle-anchor.png?v=20260922-889-final",
      standard: "8.8D",
      resource: "Triangle relationships",
      videos: videos(v.dInteriorExterior),
      videoHotspots: [
        // Only one existing ScreenPal URL is present in the legacy site data for this slide.
        // Keep it exactly on the Interior vs. Exterior play button.
        spot(v.dInteriorExterior, 2.0, 23.3, 6.5, 11.4)
        // The visible AA Similarity play button is intentionally not mapped here:
        // the legacy 8.8D data contains no AA Similarity ScreenPal URL, so do not attach a wrong video.
      ]
    },
    {
      page: 9,
      image: "assets/8-8D-transversal-anchor.png?v=20260922-889-final",
      standard: "8.8D",
      resource: "Parallel lines & transversals",
      videos: videos(v.dOverview, v.dCorresponding, v.dPairs),
      videoHotspots: [
        spot(v.dOverview, 3.9, 36.9, 5.6, 10.0),
        spot(v.dCorresponding, 34.9, 36.9, 5.6, 10.0),
        spot(v.dPairs, 66.4, 36.9, 5.6, 10.0)
      ]
    },
    {
      page: 10,
      image: "assets/8-8D-calculator.png?v=20260922-889-final",
      standard: "8.8D",
      resource: "Calculator tips",
      videos: videos(v.dCalculatorFirst, v.dCalculatorSecond),
      videoHotspots: [
        { ...spot(v.dCalculatorFirst, 36.5, 27.5, 6.8, 12.0), showPlayButton: true },
        { ...spot(v.dCalculatorSecond, 60.5, 27.5, 6.8, 12.0), showPlayButton: true }
      ]
    },
    {
      page: 11,
      image: "assets/8-9A-anchor.png?v=20260922-889-final",
      standard: "8.9A",
      resource: "Anchor chart",
      videos: videos(v.system),
      videoHotspots: [
        spot(v.system, 37.9, 70.4, 6.3, 11.2)
      ]
    },
    {
      page: 12,
      image: "assets/8-9A-calculator.png?v=20260922-889-final",
      standard: "8.9A",
      resource: "Calculator tips",
      videos: []
    }
  ];
})();
