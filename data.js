// 这里存放所有的天文题库和星球坐标
const galaxyData = [
  {
    id: 1,
    name: "WilliamLEE planet",
    position: { x: 10, y: 80 }, // 星球在地图上的位置 (百分比)
    isCompleted: false,
    image: "assets/planet1.png",
    questions: [
      { question: "There are 6 planets in our system, how many planets are there in your system? ", options: ["5", "8", "12"], answer: 1 },
      { question: "What is the coolest university major on your planet?", options: ["Software Engineering", "Business", "Art"], answer: 0 },
      { question: "What is the fastest matter in the universe? ", options: ["Light", "Sound", "Vehicle"], answer: 0 },
      { question: "What is the most abundant element in your system？", options: ["Hydrogen", "Helium", "Oxygen"], answer: 0 },
      { question: "Who is the evilest person in your system?", options: ["William Lee", "William Lee", "William Lee"], answer: [0, 1, 2] }
    ]
  },
  {
    id: 2,
    name: "Gerald planet",
    position: { x: 70, y: 20 }, 
    isCompleted: false,
    image: "assets/planet2.png",
    questions: [
      { question: "What is a light-year?", options: ["A unit of time", "A unit of speed", "A unit of distance"], answer: 2 },
      { question: "Which planet in our solar system is the hottest?", options: ["Venus", "Mercury", "Mars"], answer: 0 },
      { question: "From our previous observations record we found out that earth is a blue planet? Why is that?", options: ["Blue is our favorite colour", "We have oceans", "Our sky is blue "], answer: 1 },
      { question: "What is the largest volcano on Earth?", options: ["Mauna Kea", "Mount Etna", "Osorno"], answer: 0 },
      { question: "Which planet in our solar system is the hottest?", options: ["Venus", "Mercury", "Mars"], answer: 0 }
    ]
  },
  {
    id: 3,  
    name: "Peter planet",
    position: { x: 90, y: 50 },
    isCompleted: false,
    image: "assets/planet3.png",
    questions: [
      { question: "What is the largest storm on Earth?", options: ["Typhoon", "Tornado", "Hurricane"], answer: 0 },
      { question: "Which planet in our solar system has the most frequent storms?", options: ["Jupiter", "Saturn", "Neptune"], answer: 0 },
      { question: "Our people breathes Helium gases, what is the major has that you guys breath on your planet? ", options: ["Oxygen", "CO2", "Helium"], answer: 0 },
      { question: "Which planet in our solar system has the most frequent storms?", options: ["Jupiter", "Saturn", "Neptune"], answer: 0 },
      { question: "What is the largest storm on Earth?", options: ["Typhoon", "Tornado", "Hurricane"], answer: 0 }
    ]
  },
  {
    id: 4,
    name: "Andrea planet",
    position: { x: 30, y: 30 }, 
    isCompleted: false,
    image: "assets/planet4.png",
    questions: [
      { question: "One of our ships has discovered an astronomical object  in space, and its dragging light into it, do you have any idea about what it is? ", options: ["Pacman", "Alien", "Blackhole"], answer: 2 },
      { question: "Do you know how does your star produce light？ ", options: ["Electricity", "Nuclear fusion", "Chemical reactions"], answer: 1 },
      { question: "What is the force that make planet to move in an orbit? ", options: ["Buoyancy", "Drag force", "Gravity"], answer: 2 },
      { question: "What causes a nova?", options: ["Star collision", "Supernova explosion", "Black hole swallowing"], answer: 1 },
      { question: "What is the brightest celestial object in the universe?", options: ["Supernova", "Quasar", "Nova"], answer: 2 }
    ]
  },
  {
    id: 5,
    name: "Kevin planet",
    position: { x: 80, y: 70 },
    isCompleted: false,
    image: "assets/planet5.png",
    questions: [
      { question: "What percentage of the universe is made up of dark matter?", options: ["5%", "27%", "68%"], answer: 1 },
      { question: "How is the existence of dark matter inferred?", options: ["Gravitational lensing", "Cosmic microwave background", "Galaxy rotation curves"], answer: 2 },
      { question: "What do plants take in during photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen"], answer: 0 },
      { question: "What causes a tidal force?", options: ["Gravitational lensing", "Cosmic microwave background", "Galaxy rotation curves"], answer: 2 },
      { question: "What is 1 + 1?", options: ["2", "3", "4"], answer: 0 }
    ]
  }
];