const rootPath = './challenges/2019/';

function reactor() {
  const fs = require('fs');
  const eol = require('os').EOL;

  function processInput(input) {
    runTests();

    return {
      part1: 'tbd',
      part2: 'tbd'
    };
  }

  function runTests() {
    test(0);
    // test(1);
  }

  function test(num) {
    console.log(`==== Run Test ${num} ====`);
    const test1txt = readFile(`tests/2019.14.0${num}`);
    // console.log(test1txt);

    const factory = buildFactory(test1txt);
    const formula = factory.find(f => f.result.ingredient === 'FUEL');
    formula.source.map(src => {
      const brk = getQuantity(src);

      convert(brk, factory);
    });
  }

  function convert(to, factory) {
    console.log(`Working to get ${to.quantity} of ${to.ingredient}`);
    let options = factory.filter(f => f.result.ingredient === to.ingredient);
    options.source.map(opt => {
      const brk = getQuantity(opt);
      if (brk.ingredient === 'ORE') {
        console.log(`Used ${brk.quantity} of ORE`);
        return brk.quantity;
      }

      convert(brk, factory);
      // console.log(opt);
    });
  }

  function buildFactory(conversions) {
    let fcts = conversions.split(eol);
    const factory = fcts.map(fct => {
      let left = fct.split(' => ')[0];
      let right = fct.split(' => ')[1];

      let ingredients = left.split(', ');
      return {
        source: ingredients,
        result: getQuantity(right)
      };
    });
    return factory;
  }

  function getQuantity(construct) {
    const breakdown = construct.split(' ');
    return {
      quantity: breakdown[0],
      ingredient: breakdown[1]
    };
  }

  function readFile(pth) {
    let fullPath = `${rootPath}${pth}`;
    console.log(`readFile: ${fullPath}`);
    let raw = fs.readFileSync(fullPath, 'utf8');

    return raw;
  }

  return {
    processInput
  };
}

module.exports = reactor;