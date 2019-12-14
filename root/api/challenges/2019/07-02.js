function shipComputer() {
  const operations = [];
  operations[1] = function (a, b) { return a + b; };
  operations[2] = function (a, b) { return a * b; };

  let phaseSettings = [];
  let ampPhase = 0;
  let outputBuffer = 0;

  function processInput(input) {
    let mem;

    const s0 = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0';
    const s1 = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0';
    const s2 = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0';
    // const srcCode = s2;
    const srcCode = input;
    
    let strongestOutput = 0;

    const combs = createCombinations([0, 1, 2, 3, 4]);
    // const combs = [[4,3,2,1,0]];
    // const combs = [[0,1,2,3,4]];
    // const combs = [[1,0,4,3,2]];
    combs.map(cmb => {
      // resets
      outputBuffer = 0;
      ampPhase = 0;
      mem = initializeMemory(srcCode, ',');
      phaseSettings = cmb.split(',');

      // execute each amplifier procedss
      processOpCode(0, mem);
      processOpCode(0, mem);
      processOpCode(0, mem);
      processOpCode(0, mem);
      processOpCode(0, mem);

      // check results
      if (!isNaN(outputBuffer) && outputBuffer > strongestOutput) {
        console.log(`${outputBuffer} > ${strongestOutput}`);
        strongestOutput = outputBuffer;
      }
    });
    // const programAlarm = processOpCode(0, mem);

    console.log(`Existing with output ${strongestOutput}`);
    return strongestOutput;
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

  function processOpCode(pointer, mem) {
    let newMem = mem;
    const read = mem[pointer];
    if (read === undefined) {
      console.log('CRITCAL FAILURE; MEMORY DUMP');
      console.log(mem);
    }
    const instruction = read.toString();
    const len = instruction.length;
    // let tmp = ("x" + pointer);
    // console.log(`${tmp.substr(tmp.len-2,2)}: ${instruction}`);
    let opCode;
    let modes;
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
        // console.log('Exit program');
        return;
      case 1:
      case 2:
        prm = getParameterValues(mem, pointer, modes, 3, [2]);
        newMem = setRegister(mem, prm[2], operations[opCode](prm[0], prm[1]));
        break;
      case 3:
        prm = getParameterValues(mem, pointer, modes, 1, [0]);
        let inputMode = (ampPhase % 2) === 0;
        // console.log(`inputMode ${inputMode} outputBuffer ${outputBuffer}`);
        let singleInput = inputMode ? Number(phaseSettings[(ampPhase / 2)]) : outputBuffer;
        ampPhase = ampPhase + 1;
        newMem = setRegister(mem, prm[0], singleInput);
        break;
      case 4:
        prm = getParameterValues(mem, pointer, modes, 1, []);
        // console.log(`OUTPUT: ${prm[0]}`);
        outputBuffer = prm[0];
        if (isNaN(outputBuffer)) {
          console.log(`ERROR NaN`);
          return;
        }
        // for now exit whenever we output
        return;
        break;
      case 5:
        prm = getParameterValues(mem, pointer, modes, 2, []);
        if (prm[0] != 0) {
          return processOpCode(prm[1], mem);
        }
        break;
      case 6:
        prm = getParameterValues(mem, pointer, modes, 2, []);
        if (prm[0] == 0) {
          return processOpCode(prm[1], mem);
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
    return processOpCode(nextInstruction, newMem);
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
