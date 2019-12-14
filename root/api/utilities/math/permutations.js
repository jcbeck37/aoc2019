function permutations() {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function createCombinations(poss) {
    const combs = [];
    if (poss.length === 1) {
      combs.push(poss[0]);
      return combs;
    }
    const arr = poss.slice();
    const used = [];
    let incs = 0;
    const possibilities = factorial(arr.length);
    while (incs < possibilities) {
      const next = getRandomInt(arr.length);
      if (used.indexOf(arr[next]) < 0) {
        const c2 = arr[next];
        used.push(c2);

        const remainder = arr.slice();
        remainder.splice(next, 1);
        const theRest = createCombinations(remainder);
        incs += theRest.length;
        theRest.map((cmb) => combs.push(`${c2},${cmb}`));
      }
    }
    return combs;
  }

  function factorial(n) {
    if (n < 2) {
      return 1;
    }
    return n * factorial(n - 1);
  }

  return {
    factorial,
    createCombinations
  };
}

module.exports = permutations;
  