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
    return acc + fuelForMass(val);
  }

  function fuelForMass(val) 
  {
    let fuel = Math.floor(val/3) - 2;
    if (fuel <= 0) {
      return 0;
    }
    return fuel + fuelForMass(fuel);
  }

  return {
    processInput
  };
}

module.exports = fuelCounterUpper;