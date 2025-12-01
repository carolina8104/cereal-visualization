const cerealShapes = [
  // Classic donuts
  { size: 60, path: "M50,0 C90,0 100,50 50,100 C10,50 20,0 50,0 Z M50,35 C35,50 65,50 50,35 Z" }, // donut with center hole

  {size: 60, path:"M109.002 136.961C35.7182 215.467 93.7943 390.532 49.5027 341.328C5.21111 292.124 -31.59 140.694 41.6941 62.1875C114.978 -16.3189 233.206 -14.6186 277.497 34.5853C321.789 83.7892 182.286 58.4543 109.002 136.961Z"},

  // Almond / elongated
  { size: 50, path: "M50,0 C80,10 90,50 50,100 C10,50 20,10 50,0 Z" },
  { size: 56, path: "M50,0 C85,15 95,50 50,100 C5,50 15,15 50,0 Z" },

  // Little squares
  { size: 40, path: "M0,0 L100,0 L100,100 L0,100 Z" },
  { size: 36, path: "M10,10 L90,10 L90,90 L10,90 Z" },

  // Little rectangles
  { size: 44, path: "M0,0 L100,0 L100,50 L0,50 Z" },
  { size: 44, path: "M0,0 L50,0 L50,100 L0,100 Z" },

  // Circles
  { size: 50, path: "M50,0 C77,0 100,23 100,50 C100,77 77,100 50,100 C23,100 0,77 0,50 C0,23 23,0 50,0 Z" },

  // Small stars
  { size: 52, path: "M50,0 L60,35 L100,35 L70,57 L80,100 L50,75 L20,100 L30,57 L0,35 L40,35 Z" },

  // Stars with cutout in spikes
  { size: 56, path: "M50,0 L58,28 L100,28 L68,50 L76,100 L50,70 L24,100 L32,50 L0,28 L42,28 Z M50,35 L50,65 L35,50 Z" },

  // Fun curves
  { size: 60, path: "M50,0 C80,10 100,50 50,100 C0,50 20,10 50,0 Z" },
  { size: 48, path: "M50,0 C70,10 90,40 50,100 C10,60 30,10 50,0 Z" },

  // Hex-ish
  { size: 44, path: "M50,0 L90,25 L90,75 L50,100 L10,75 L10,25 Z" },

  // Ovals
  { size: 52, path: "M50,0 C80,0 100,50 50,100 C20,50 0,0 50,0 Z" },

  // Donut smaller
  { size: 36, path: "M50,0 C77,0 100,23 100,50 C100,77 77,100 50,100 C23,100 0,77 0,50 C0,23 23,0 50,0 Z M50,40 C40,50 60,50 50,40 Z" },

  // Little squares again
  { size: 40, path: "M10,10 L90,10 L90,90 L10,90 Z" },

  // Tiny rectangles
  { size: 36, path: "M0,0 L50,0 L50,25 L0,25 Z" },

  // Flower-like
  { size: 50, path: "M50,0 C65,0 80,20 80,35 C95,35 100,50 80,50 C80,65 65,80 50,80 C35,80 20,65 20,50 C0,50 5,35 20,35 C20,20 35,0 50,0 Z" },

  // Loops
  { size: 48, path: "M50,0 C75,0 100,25 100,50 C100,75 75,100 50,100 C25,100 0,75 0,50 C0,25 25,0 50,0 Z" },

  // Rounded triangle
  { size: 44, path: "M50,0 C65,10 85,50 50,100 C15,50 35,10 50,0 Z" },

  // Kite with center cutout
  { size: 52, path: "M50,0 L90,40 L50,100 L10,40 Z M50,40 L60,50 L50,60 L40,50 Z" }
];

export default cerealShapes;
