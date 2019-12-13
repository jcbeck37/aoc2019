function fuelCounterUpper() {
  function fuelForMass(val) {
    const fuel = Math.floor(val / 3) - 2;
    if (fuel <= 0) {
      return 0;
    }
    return fuel + fuelForMass(fuel);
  }

  function fuelCounter(acc, val) {
    if (val === '') {
      return acc;
    }
    return acc + fuelForMass(val);
  }

  function processInput(input) {
    const data = input.split('\n');

    const fuelNeeded = data.reduce(fuelCounter, 0);
    return `Answer: ${fuelNeeded}`;
  }

  return {
    processInput,
  };
}

module.exports = fuelCounterUpper;
