(function volume87ALabModule() {
  const PI = Math.PI;

  const FORMULAS = [
    { id: "cylinder", label: "V = Bh" },
    { id: "cone", label: "V = ⅓Bh" },
    { id: "sphere", label: "V = ⁴⁄₃πr³" }
  ];

  const BASE_CHOICES = [
    { id: "circle", label: "B = πr²" },
    { id: "circumference", label: "B = 2πr" },
    { id: "diameter-square", label: "B = πd²" }
  ];

  const DIRECT_TASKS = [
    { kind: "direct", shape: "cylinder", unit: "cm", radius: 4, height: 9, given: "radius", shown: 4, title: "Cylinder with a radius shown" },
    { kind: "direct", shape: "cone", unit: "m", radius: 5, height: 12, given: "diameter", shown: 10, title: "Cone with a full-width measure" },
    { kind: "direct", shape: "sphere", unit: "in", radius: 6, given: "radius", shown: 6, title: "Sphere with a radius shown" },
    { kind: "direct", shape: "cylinder", unit: "ft", radius: 7, height: 5, given: "diameter", shown: 14, title: "Cylinder with a full-width measure" },
    { kind: "direct", shape: "cone", unit: "yd", radius: 3, height: 11, given: "radius", shown: 3, title: "Cone with a radius shown" },
    { kind: "direct", shape: "sphere", unit: "cm", radius: 8, given: "diameter", shown: 16, title: "Sphere with a full-width measure" },
    { kind: "direct", shape: "cylinder", unit: "m", radius: 2.5, height: 7, given: "radius", shown: 2.5, title: "Cylinder with a decimal radius" }
  ];

  const WORD_TASKS = [
    {
      kind: "word", shape: "cylinder", unit: "in", radius: 3, height: 8,
      title: "Candle holder",
      prompt: "A cylindrical glass candle holder has a radius of 3 inches and a height of 8 inches. What is its volume?"
    },
    {
      kind: "word", shape: "cone", unit: "cm", radius: 6, height: 15,
      title: "Party hat",
      prompt: "A cone-shaped party hat has a diameter of 12 centimeters and a vertical height of 15 centimeters. What is the volume of the cone?"
    },
    {
      kind: "word", shape: "sphere", unit: "cm", radius: 4.5,
      title: "Glass ornament",
      prompt: "A spherical glass ornament has a diameter of 9 centimeters. What is its volume?"
    },
    {
      kind: "word", shape: "cylinder", unit: "ft", radius: 3, height: 10,
      title: "Water tank",
      prompt: "A cylindrical water tank is 6 feet across and 10 feet tall. What is the volume of the tank?"
    },
    {
      kind: "word", shape: "cone", unit: "m", radius: 5, height: 4,
      title: "Sand pile",
      prompt: "A pile of sand is modeled by a cone with a radius of 5 meters and a height of 4 meters. What is its volume?"
    },
    {
      kind: "word", shape: "sphere", unit: "in", radius: 15,
      title: "Exercise ball",
      prompt: "A spherical exercise ball measures 30 inches from one side straight through its center to the other side. What is its volume?"
    },
    {
      kind: "word", shape: "cylinder", unit: "cm", radius: 4, height: 13,
      title: "Soup can",
      prompt: "A cylindrical soup can has a radius of 4 centimeters and a height of 13 centimeters. What is the volume of the can?"
    }
  ];

  const COMPOSITE_TASKS = [
    {
      kind: "composite", diagram: "capsule", unit: "cm", title: "Rounded capsule",
      radius: 3, height: 8,
      answer: () => cylinderVolume(3, 8) + sphereVolume(3),
      seminar: [
        {
          q: "The two rounded ends are hemispheres. Together, what solid do they make?",
          choices: ["one sphere", "one cone", "one cylinder"], correct: 0
        },
        {
          q: "The capsule is made from a cylinder plus those two hemispheres. What should you do with the volumes?",
          choices: ["add them", "subtract the sphere from the cylinder", "multiply them"], correct: 0
        },
        {
          q: "Which expression matches the composite figure?",
          choices: ["V = Vcylinder + Vsphere", "V = Vcylinder − Vsphere", "V = 2Vcylinder + Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "cone-cylinder", unit: "m", title: "Cone on a cylinder",
      radius: 4, height: 6, topHeight: 5,
      answer: () => cylinderVolume(4, 6) + coneVolume(4, 5),
      seminar: [
        {
          q: "Which two solids make this entire figure?",
          choices: ["a cylinder and a cone", "a sphere and a cone", "two cylinders"], correct: 0
        },
        {
          q: "Nothing is cut out. How should the two volumes be combined?",
          choices: ["add", "subtract", "divide"], correct: 0
        },
        {
          q: "Which expression should you evaluate?",
          choices: ["V = Vcylinder + Vcone", "V = Vcylinder − Vcone", "V = Vcone − Vcylinder"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "cone-hole", unit: "ft", title: "Cylinder with a conical opening",
      radius: 5, height: 12,
      answer: () => cylinderVolume(5, 12) - coneVolume(5, 12),
      seminar: [
        {
          q: "The outer solid is a cylinder, and the cone-shaped region is removed. Which two volumes do you need?",
          choices: ["cylinder and cone", "sphere and cone", "two cones"], correct: 0
        },
        {
          q: "Because the cone is an empty cutout, what operation models the remaining solid?",
          choices: ["subtract", "add", "multiply"], correct: 0
        },
        {
          q: "Which expression represents the volume that remains?",
          choices: ["V = Vcylinder − Vcone", "V = Vcylinder + Vcone", "V = Vcone − Vcylinder"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "silo", unit: "yd", title: "Silo with a rounded roof",
      radius: 4, height: 10,
      answer: () => cylinderVolume(4, 10) + 0.5 * sphereVolume(4),
      seminar: [
        {
          q: "The roof is half of which solid?",
          choices: ["a sphere", "a cone", "a cylinder"], correct: 0
        },
        {
          q: "The roof sits on top of the cylinder. How should their volumes be combined?",
          choices: ["add", "subtract", "divide"], correct: 0
        },
        {
          q: "Which expression matches the entire silo?",
          choices: ["V = Vcylinder + ½Vsphere", "V = Vcylinder − ½Vsphere", "V = ½Vcylinder + Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "tennis-can", unit: "cm", title: "Three tennis balls in a can",
      radius: 3.3, height: 19.8,
      answer: () => cylinderVolume(3.3, 19.8) - 3 * sphereVolume(3.3),
      seminar: [
        {
          q: "To find the empty space, which volumes must you calculate first?",
          choices: ["the cylinder and one tennis ball", "only the cylinder", "only one tennis ball"], correct: 0
        },
        {
          q: "There are three identical balls. What is the total volume occupied by the balls?",
          choices: ["3 × Vsphere", "Vsphere ÷ 3", "Vcylinder + Vsphere"], correct: 0
        },
        {
          q: "Which expression gives the space inside the can that is NOT occupied by tennis balls?",
          choices: ["V = Vcylinder − 3Vsphere", "V = Vcylinder + 3Vsphere", "V = 3Vcylinder − Vsphere"], correct: 0
        }
      ]
    },
    {
      kind: "composite", diagram: "icecream", unit: "in", title: "Cone with a hemispherical scoop",
      radius: 4, height: 9,
      answer: () => coneVolume(4, 9) + 0.5 * sphereVolume(4),
      seminar: [
        {
          q: "The rounded scoop shown is exactly half of which solid?",
