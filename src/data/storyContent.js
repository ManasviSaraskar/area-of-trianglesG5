// data/storyContent.js — Story phase panel data with generated illustrations

const storyContent = [
  {
    id: 0,
    emoji: '🌍',
    title: 'Meet the Triangle Trekkers!',
    text: 'John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei are Triangle Trekkers — young explorers who measure shapes wherever they travel!',
    highlight: '"How do we measure a triangle\'s area?"',
    bg: 'linear-gradient(135deg, #1e3a5f 0%, #0f2440 100%)',
    location: 'Around the World',
    image: '/assets/images/story_1.png',
  },
  {
    id: 1,
    emoji: '🔺',
    title: 'John in Egypt',
    text: 'In Egypt, John looks at a giant pyramid face. "That\'s a huge triangle!" A rectangle appears around it, split right down the middle by a diagonal line.',
    highlight: '"A rectangle split in half makes 2 equal triangles!"',
    bg: 'linear-gradient(135deg, #7c3900 0%, #a05000 100%)',
    location: 'Giza, Egypt',
    image: '/assets/images/story_2.png',
  },

  {
    id: 3,
    emoji: '🏔️',
    title: 'Mike in Switzerland',
    text: 'In Switzerland, Mike sees a triangular flag on a mountain hut. He counts unit squares on a grid — whole squares AND half squares — to find its area.',
    highlight: 'Whole Squares + Half Squares = Area',
    bg: 'linear-gradient(135deg, #0f4c2a 0%, #166534 100%)',
    location: 'Swiss Alps, Switzerland',
    image: '/assets/images/story_3.png',
    showGrid: true,
    gridBase: 4,
    gridHeight: 3,
  },
  {
    id: 4,
    emoji: '🎏',
    title: 'Yuki in Japan',
    text: 'In Japan, Yuki folds an origami banner. "Base times height, then split it in half!" she says. Area = (base × height) ÷ 2. That\'s the formula!',
    highlight: 'Area = (base × height) ÷ 2',
    bg: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)',
    location: 'Tokyo, Japan',
    image: '/assets/images/story_4.png',
    showFormula: true,
    base: 8,
    height: 5,
    area: 20,
  },
  {
    id: 5,
    emoji: '🚀',
    title: 'Your Turn!',
    text: "Now it's YOUR turn to become a Triangle Trekker! You'll split rectangles, count grid squares, and use the formula to measure triangles all around the world!",
    highlight: 'Ready to Explore?',
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 100%)',
    location: 'Ready to Explore?',
    image: '/assets/images/story_5.png',
  },
];

export default storyContent;
