function shipComputer() {
  const operations = [];
  operations[1] = function (a, b) { return a + b; };
  operations[2] = function (a, b) { return a * b; };

  const inputs = [];
  inputs.push(5);

  function processInput(input) {
    let mem = input.split(',');

    // sample override
    // mem = '1002,4,3,4,33'.split(',');
    s0 = "3,9,8,9,10,9,4,9,99,-1,8".split(',');

    let s1 = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,";
    s1 = s1 + "1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,";
    s1 = s1 + "999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99";
    // mem = s1.split(',');

    const programAlarm = processOpcode(0, mem);

    // console.log(finalComputer.toString());
    return programAlarm[0];
  }

  function processOpcode(pointer, mem) {
    let newMem = mem;
    const read = mem[pointer];
    const instruction = read.toString();
    const len = instruction.length;
    let opCode, modes;
    try {
      opCode = Number(instruction.substr(len - 2));
      if (len > 0) {
        modes = instruction.substr(0, len - 2);
      }
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
        prm = getParameterValues(mem, pointer, modes, 3, [2]);
        newMem = setRegister(mem, prm[2], operations[opCode](prm[0], prm[1]));
        break;
      case 3:
        prm = getParameterValues(mem, pointer, modes, 1, [0]);
        console.log(`INPUT: ${inputs[inputs.length - 1]}`);
        newMem = setRegister(mem, prm[0], inputs[inputs.length - 1]);
        break;
      case 4:
        prm = getParameterValues(mem, pointer, modes, 1, []);
        console.log(`OUTPUT: ${prm[0]}`);
        inputs.push(prm[0]);
        break;
      case 5:
        prm = getParameterValues(mem, pointer, modes, 2, []);
        if (prm[0] != 0) {
          return processOpcode(prm[1], mem);
        }
        break;
      case 6:
        prm = getParameterValues(mem, pointer, modes, 2, []);
        if (prm[0] == 0) {
          return processOpcode(prm[1], mem);
        }
        break;
      case 7:
        prm = getParameterValues(mem, pointer, modes, 3, [2]);
        setRegister(mem, prm[2], Number((prm[0] < prm[1])));
        break;
      case 8:
        prm = getParameterValues(mem, pointer, modes, 3, [2]);
        setRegister(mem, prm[2], Number((prm[0] === prm[1])));
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
