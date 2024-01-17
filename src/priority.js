function generateRandomPriority(seed, randomNum, A, C, m) {
  const randomPriorities = [];
  let xi = seed;

  for (let i = 0; i < randomNum; i++) {
    xi = (A * xi + C) % m;
    randomPriorities.push(xi / m); // Normalize to [0, 1)
  }
  return randomPriorities;
}

function mapTo123(randomPriorities, a, b) {
  return randomPriorities.map((x) => Math.floor((b - a) * x + a));
}

export { generateRandomPriority, mapTo123 };
