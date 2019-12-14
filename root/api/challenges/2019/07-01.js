function shipComputer() {
  const operations = [];
  operations[1] = function (a, b) { return a + b; };
  operations[2] = function (a, b) { return a * b; };

  const inputs = [];

  function processInput(input) {
    let mem;

    const s0 = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';

    mem = initializeMemory(s0, ',');

    const combs = createCombinations([0, 1, 2, 3, 4]);
    // const programAlarm = processOpcode(0, mem);

    return combs;
  }

  function initializeMemory(src, dlm) {
    return src.split(dlm);
  }

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
        theRest.map((cmb) => {
          const variation = `${c2},${cmb}`;
          combs.push(`${c2},${cmb}`);
        });
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

  function processOpcode(pointer, mem) {
    let newMem = mem;
    const read = mem[pointer];
    const instruction = read.toString();
    const len = instruction.length;
    let opCode; let
      modes;
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
    const parameters = [];
    let modeConfig = instr;
    while (modeConfig.length < min) {
      modeConfig = `0${modeConfig}`;
    }
    const modes = modeConfig.split('').reverse();
    modes.map((mode, idx) => {
      const ptr = pointer + idx + 1;
      if (force.indexOf(idx) > -1) {
        parameters.push(getValue(register, Number(ptr)));
      } else {
        const addr = mode === '0' ? register[ptr] : ptr;
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
