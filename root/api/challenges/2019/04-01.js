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
        count += 1;
      }
    }
    report += ` Valid: ${count}`;

    return report;
  }

  function hasDoubleAndNeverDecrease(val) {
    let has = false;
    let valid = true;
    const ary = val.toString().split('');
    // console.log(ary);
    ary.map((chr, idx) => {
      if (valid && idx > 0) {
        const cmp = ary[idx - 1];
        // console.log(chr, cmp);

        if (chr === cmp) {
          has = true;
        } else if (Number(chr) < Number(cmp)) {
          valid = false;
        }
      }
      return null;
    });
    return has && valid;
  }

  return {
    processInput,
  };
}

module.exports = passwordGenerator;
