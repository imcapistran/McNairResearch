//game logic for game.html

const challenges = {
    dough: [
        { question: "Solve for x: 2x + 3 = 11", answer: 4 },
        { question: "If 5x = 20, what is x?", answer: 4 },
        { question: "Simplify: (3x + 2x)", answer: "5x" }
    ],
    sauce: [
        { question: "Factor: x² - 9", answer: "(x - 3)(x + 3)" },
        { question: "Simplify: 3(x - 2)", answer: "3x - 6" },
        { question: "Solve for x: x² = 49", answer: [7, -7] }
    ],
    toppings: [
        { question: "Is x = 3 a solution to 2x > 5?", answer: "yes" },
        { question: "Solve for x: 3x + 4 < 10", answer: "x < 2" },
        { question: "What is f(2) if f(x) = x² - 1?", answer: 3 }
  ],
  oven: [
        { question: "A pizza is cut into 8 slices. You eat 3. What fraction is left?", answer: "5/8" },
        { question: "You double a pizza recipe calling for 1.5 cups of sauce. How much now?", answer: 3 },
        { question: "A pizza bakes for 25 mins starting at 3:15 PM. Done at?", answer: "3:40 PM" }
  ]
}

function getRandomChallenge(station) {
    const options = challenges[station];
    return options[Math.floor(Math.random() * options.length)];
}