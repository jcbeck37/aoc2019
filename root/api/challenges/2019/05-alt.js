// part 1: input 1 ==> 13547311
// part 2: input 5 ==> 236453

function testKit() {
  const computer = require('./computer/process');

  const testInputs = [1, 5];
  function processInput(input) {
    let srcCode = input.replace('\n', '');    
    const program = srcCode.split(',');
    // console.log(program);
    
    let outputs = [];
    //outputs.push(test('1002,4,3,4,33'.split(','), -1));
    outputs.push(test(program, 0));
    outputs.push(test(program, 1));

    return outputs;
  }

  function test(program, idx) {
    let result;
    const pc = new computer(`test${idx}`, program.slice());
    let amplifier = pc.execute();
    const init = amplifier.next(); // get _READY_ for input
    console.log(init);
    if (idx >= 0) {
      console.log(`${pc.name}(${testInputs[idx]})`);
      let check;
      check = amplifier.next(testInputs[idx]); // single input
      while (!check.done) {
        console.log(check);
        check = amplifier.next(); // outputs
      }
      result = check.value.val;
      console.log(check);
    }
    return result;
  }

  return {
    processInput
  };
}

module.exports = testKit;