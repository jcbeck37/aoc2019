function shipComputer() {
  function processInput(input) {
    const dataPoints = input.split(',');

    // restore "1202 program alarm"
    dataPoints[1] = 12;
    dataPoints[2] = 2;

    const finalComputer = processOpcode(0, dataPoints);

    console.log(finalComputer.toString());
    return finalComputer[0];
  }

  function processOpcode(pointer, dataPoints) {
    const newRegister = dataPoints;
    const opCode = Number(dataPoints[pointer]);
    if (opCode === 99) {
      console.log(`Exit program: ${dataPoints.toString()}`);
      return dataPoints;
    }
    const operator = opCode === 1 ? '+' : '*';
    const val1Pos = dataPoints[pointer + 1];
    const val2Pos = dataPoints[pointer + 2];
    const resultPosition = dataPoints[pointer + 3];

    const val1 = Number(dataPoints[val1Pos]);
    const val2 = Number(dataPoints[val2Pos]);
    const result = opCode === 1 ? val1 + val2 : val1 * val2;

    // console.log(`pointer: ${pointer} : opcode ${opCode}`);
    console.log(`${val1} ${operator} ${val2} = ${result} set to position ${resultPosition}`);
    newRegister[resultPosition] = result;
    // console.log(`New dataset: ${dataPoints.toString()}`);

    return processOpcode(pointer + 4, newRegister);
  }

  return {
    processInput,
  };
}

module.exports = shipComputer;
