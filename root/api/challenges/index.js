function challenges(dependencies) {
  const collection2019 = {};
  collection2019["01-01"] = require("./2019/01-01.js")(dependencies);
  collection2019["01-02"] = require("./2019/01-02.js")(dependencies);
  collection2019["02-01"] = require("./2019/02-01.js")(dependencies);
  collection2019["02-02"] = require("./2019/02-02.js")(dependencies);
  collection2019["03-01"] = require("./2019/03-01.js")(dependencies);
  collection2019["03-02"] = require("./2019/03-02.js")(dependencies);

  const years = {};
  years["2019"] = collection2019;

  return years;
}

module.exports = challenges;