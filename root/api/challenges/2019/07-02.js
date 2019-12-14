function shipComputer({ utilities }) {
  const { math } = utilities;
  const { permutations } = math;
  const computer = require('./computer/process');

  function processInput(input) {
    // const s3 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
    // let s4 = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,';
    // s4 += '-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,';
    // s4 += '53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10';
    // const srcCode = s4;
    const srcCode = input.replace('\n', '');

    let combs = [];
    const rawCombs = permutations.createCombinations([5, 6, 7, 8, 9]);
    combs = rawCombs.map(str => {
      return str.split(',');
    });
    // combs = [[9, 8, 7, 6, 5]];

    let strongestOutput = 0;
    let results = combs.map(cmb => {
      let thrust = tryCombo(srcCode, cmb);
      if (thrust > strongestOutput) {
        strongestOutput = thrust;
      }
      return strongestOutput;
    });

    strongestOutput = results[results.length - 1];
    console.log(`Exiting with output ${strongestOutput}`);
    return strongestOutput;
  }

  function tryCombo(srcCode, cmb) {
    const program = srcCode.split(',');
    let nm = 0;
    const amps = cmb.map(phase => {
      const pc = new computer(`amp${nm}`, program.slice());
      let amplifier = pc.execute();
      amplifier.next(); // get _READY_ for input
      // console.log(`${pc.name} gets phase ${phase}`);
      const state = amplifier.next(phase);
      nm = nm + 1;

      return { pc, amplifier, state };
    });

    let power = 0;
    while (amps[amps.length - 1].state.done === false) {
      for (const amp of amps) {
        const { pc, amplifier } = amp;

        //console.log(`${pc.name} gets ${power} power`);

        const transfer = amplifier.next(power);
        const exhaust = amplifier.next(); // get ready for INPUT

        if (exhaust.done && isNaN(exhaust.value.val)) {
          console.log(exhaust);
        }
        power = exhaust.done ? exhaust.value.val : transfer.value.val;

        // console.log(transfer);
        // console.log(`power now ${power}`);

        if (exhaust.done) {
          amp.state = exhaust;
        }
      }
    }

    return power;
  }

  return {
    processInput,
  };
}

module.exports = shipComputer;

// https://dev.to/jbristow/advent-of-code-2019-solution-megathread-day-7-amplification-circuit-1fpl