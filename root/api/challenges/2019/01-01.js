function fuelCounterUpper({}) {
  function processInput(input) {
    const data = input.split('\n');

    const fuelNeeded = data.reduce(fuelCounter, 0);
    return `Answer: ${fuelNeeded}`;
  }

  function fuelCounter(acc, val) {
    if (val === "") {
      return acc;
    }
    return acc + Math.floor(val/3) - 2;
  }

  return {
    processInput
  };
}

module.exports = fuelCounterUpper;