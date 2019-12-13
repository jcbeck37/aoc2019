function shipComputer({ }) {
  const operations = [];
  operations[1] = function (a, b) { return a + b; };
  operations[2] = function (a, b) { return a * b; };

  function processInput(input) {
    let mem;

    // restore "1202 program alarm"
    // mem[1] = 12;
    // mem[2] = 2;

    // const programAlarm = processOpcode(0, mem);

    // console.log(finalComputer.toString());
    // return programAlarm[0];

    // brute force
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        mem = input.split(','); // initialize
        mem[1] = i;
        mem[2] = j;

        const newResult = processOpcode(0, mem);
        // console.log(`${i},${j} => ${newResult[0]}`);
        if (newResult[0] === 19690720) {
          // console.log(`SUCCESS i: ${i} j: ${j}`);
          return `(${i},${j})`;
        }
      }
      console.log(`${i + 1}% complete.`);
    }
  }


  function processOpcode(pointer, mem) {
    const opCode = Number(mem[pointer]);
    if (opCode === 99) {
      // console.log(`Exit program: ${mem.toString()}`);
      return mem;
    }
    const val1 = Number(mem[mem[pointer + 1]]);
    const val2 = Number(mem[mem[pointer + 2]]);
    const result = operations[opCode](val1, val2);
    mem[mem[pointer + 3]] = result;
    // console.log(`${val1} ${opCode == 1 ? "+" : "*"} ${val2} = ${result} set to position ${mem[pointer + 3]}`);
    // console.log(`Register: ${mem.toString()}`);

    return processOpcode(pointer + 4, mem);
  }

  return {
    processInput,
  };
}

module.exports = shipComputer;
