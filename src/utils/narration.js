// utils/narration.js — Phase narration segment helpers matching audio pipeline

export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'celebration' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function celebrate(text) { return { text, style: 'celebration' }; }
export function instruct(text) { return { text, style: 'instruction' }; }
export function encourage(text) { return { text, style: 'encouragement' }; }

export function wonderNarration() {
  return [
    encourage("Sarah sees a sailboat with a triangular sail in Sydney. How does she know how much cloth was used to make that sail? Let us find out what area really means!"),
  ];
}

export function getStoryNarration(panelIdx) {
  const story = [
    [ say("John, Mike, Sarah, Priya, Carlos, Yuki, Amara, Elena, Liam, and Mei are Triangle Trekkers — young explorers who measure shapes wherever they travel!") ],
    [ say("In Egypt, John looks at a giant pyramid face. \"That's a huge triangle!\" A rectangle appears around it, split right down the middle by a diagonal line.") ],
    [ say("In Switzerland, Mike sees a triangular flag on a mountain hut. He counts unit squares on a grid — whole squares AND half squares — to find its area.") ],
    [ emphasize("In Japan, Yuki folds an origami banner. \"Base times height, then split it in half!\" she says. Area = (base × height) ÷ 2. That's the formula!") ],
    [ encourage("Now it's YOUR turn to become a Triangle Trekker! You'll split rectangles, count grid squares, and use the formula to measure triangles all around the world!") ]
  ];
  return story[panelIdx] || [];
}

export function simulateStationANarration() {
  return [
    instruct("Drag the line to split the rectangle into two triangles."),
    ask("See how one triangle is exactly half the space? That's the secret!"),
  ];
}

export function simulateStationBNarration() {
  return [
    instruct("Count the whole squares and the half squares inside the triangle."),
  ];
}

export function simulateStationCNarration() {
  return [
    ask("Now fill in the missing number. Six times four, divided by two, equals what?"),
  ];
}

export function correctFeedbackNarration() {
  return [
    cheer("Yes! You measured that triangle perfectly! You're a true Triangle Trekker!"),
  ];
}

export function incorrectFeedbackNarration() {
  return [
    encourage("Not quite! Let's look at the shape again."),
  ];
}

export function reflectNarration() {
  return [
    think("What an adventure! Can you tell me one thing you learned about triangles today?"),
  ];
}

export function completionNarration() {
  return [
    cheer("Lesson complete! You are an official Triangle Trekker Champion!"),
  ];
}
