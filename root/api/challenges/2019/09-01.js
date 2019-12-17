function shipComputer() {
  const computer = require('./computer/process');

  function processInput(input) {
    runTests();

    const boostProgram = new computer('BOOST', input.replace('\n','').split(','));
    const executor = boostProgram.execute();
    let result = executor.next(); // init
    result = executor.next(1); // input
    console.log(result);
    while (!result.done) {
      result = executor.next();
      console.log(result);
    }
    return result.value.val;
  }

  function runTests() {
    let src = [
      '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99',
      '1102,34915192,34915192,7,4,7,99,0',
      '104,1125899906842624,99'
    ];

    src.map(code => {
      const test = new computer('test', code.split(','));
      const harness = test.execute();
      let result = { done: false };
      while (!result.done) {
        result = harness.next();
        console.log(result);
      }
    });
  }

  return {
    processInput,
  };
}

module.exports = shipComputer;