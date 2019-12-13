function shipComputer() {
  const operations = [];
  operations[1] = function (a, b) { return a + b; };
  operations[2] = function (a, b) { return a * b; };

  const inputs = [];
  inputs.push(1);

  function processInput(input) {
    let mem = input.split(',');

    // sample override
    // mem = '1002,4,3,4,33'.split(',');

    const programAlarm = processOpcode(0, mem);

    // console.log(finalComputer.toString());
    return programAlarm[0];
  }

  function processOpcode(pointer, mem) {
    let newMem = mem;
    const operation = mem[pointer];
    const instruction = operation.toString();
    const len = instruction.length;
    let opCode;
    try {
      opCode = Number(instruction.substr(len - 2));
    } catch (err) {
      console.log(pointer, len);
      console.log(err);
    }

    let prm = [];
    switch (opCode) {
    case 99:
      // console.log(`Exit program: ${mem.toString()}`);
      console.log('Exit program');
      return mem;
    case 1:
    case 2:
      prm = getParameterValues(mem, pointer, instruction.substr(0, len - 2), 3, [2]);
      newMem = setRegister(mem, prm[2], operations[opCode](prm[0], prm[1]));
      break;
    case 3:
      prm = getParameterValues(mem, pointer, instruction.substr(0, len - 2), 1, [0]);
      console.log(`INPUT: ${inputs[inputs.length - 1]}`);
      newMem = setRegister(mem, prm[0], inputs[inputs.length - 1]);
      break;
    case 4:
      prm = getParameterValues(mem, pointer, instruction.substr(0, len - 2), 1, []);
      console.log(`OUTPUT: ${prm[0]}`);
      inputs.push(prm[0]);
      break;
    default:
      break;
    }

    const nextInstruction = Number(pointer) + prm.length + 1;
    return processOpcode(nextInstruction, newMem);
  }

  function getParameterValues(register, pointer, instr, min, force) {
    let parameters = [];
    let modeConfig = instr;
    while (modeConfig.length < min) {
      modeConfig = `0${modeConfig}`;
    }
    const modes = modeConfig.split('').reverse();
    modes.map((mode, idx) => {
      let ptr = pointer + idx + 1;
      if (force.indexOf(idx) > -1) {
        parameters.push(getValue(register, Number(ptr)));
      } else {
        const addr = mode === "0" ? register[ptr] : ptr;
        parameters.push(getValue(register, Number(addr)));
      }
      return null;
    });

    return parameters;
  }

  function getValue(register, addr) {
    return Number(register[addr]);
  }

  function setRegister(mem, pointer, value) {
    const register = mem;
    register[pointer] = value;
    return register;
  }

  return {
    processInput,
  };
}

module.exports = shipComputer;
