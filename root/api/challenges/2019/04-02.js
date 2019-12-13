function passwordGenerator() {
  function processInput(input) {
    const range = input.split('-');
    console.log(range);
    const [lo, hi] = range;
    console.log(lo, hi);

    let count = 0;
    let report = '';
    report += `Input: ${input}`;
    for (let i = Number(lo); i <= Number(hi); i += 1) {
      // report = report + `${i} has double? ${hasDouble(i)}\n`;
      if (hasDoubleAndNeverDecrease(i)) {
        console.log(i);
        count += 1;
      }
    }
    report += ` Valid: ${count}`;

    return report;
  }

  function hasDoubleAndNeverDecrease(val) {
    let valid = true;
    const ary = val.toString().split('');
    ary.map((chr, idx) => {
      if (valid && idx > 0) {
        const cmp = ary[idx - 1];
        // console.log(chr, cmp);
        if (Number(chr) < Number(cmp)) {
          valid = false;
        }
      }
      return null;
    });

    let hasDouble = false;
    if (valid) {
      const counts = val.toString().match(/([0-9])\1*/g);
      counts.map((itm) => {
        if (itm.length === 2) {
          hasDouble = true;
        }
        return null;
      });
    }
    return hasDouble && valid;
  }

  return {
    processInput,
  };
}

module.exports = passwordGenerator;
