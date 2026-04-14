export const QUESTIONS = [
  {
    id: 1,
    text: "Do you have a security policy?",
    options: [
      { text: "Fully Implemented", score: 5 },
      { text: "Partially Implemented", score: 3 },
      { text: "Planned", score: 2 },
      { text: "Not Started", score: 1 },
      { text: "No Policy", score: 0 },
      { text: "N/A", isNA: true },
    ],
    children: [
      {
        id: 11,
        text: "Is the policy documented?",
        options: [
          { text: "Yes", score: 5 },
          { text: "Partially", score: 3 },
          { text: "No", score: 0 },
          { text: "N/A", isNA: true },
        ],
        children: [
          {
            id: 111,
            text: "Is it reviewed regularly?",
            options: [
              { text: "Yes", score: 5 },
              { text: "No", score: 0 },
              { text: "N/A", isNA: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    text: "Is data encrypted?",
    options: [
      { text: "Fully", score: 5 },
      { text: "Partially", score: 3 },
      { text: "None", score: 0 },
      { text: "N/A", isNA: true },
    ],
  },
];
