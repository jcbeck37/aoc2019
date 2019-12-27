function challenges(dependencies) {
  const collection2019 = {};
  collection2019['01-01'] = require('./2019/01-01.js')(dependencies);
  collection2019['01-02'] = require('./2019/01-02.js')(dependencies);
  collection2019['02-01'] = require('./2019/02-01.js')(dependencies);
  collection2019['02-02'] = require('./2019/02-02.js')(dependencies);
  collection2019['03-01'] = require('./2019/03-01.js')(dependencies);
  collection2019['03-02'] = require('./2019/03-02.js')(dependencies);
  collection2019['04-01'] = require('./2019/04-01.js')(dependencies);
  collection2019['04-02'] = require('./2019/04-02.js')(dependencies);
  collection2019['05-01'] = require('./2019/05-01.js')(dependencies);
  collection2019['05-02'] = require('./2019/05-02.js')(dependencies);
  collection2019['05-alt'] = require('./2019/05-alt.js')(dependencies);
  collection2019['06-01'] = require('./2019/06-01.js')(dependencies);
  collection2019['06-02'] = require('./2019/06-02.js')(dependencies);
  collection2019['07-01'] = require('./2019/07-01.js')(dependencies);
  collection2019['07-02'] = require('./2019/07-02.js')(dependencies);
  collection2019['08-01'] = require('./2019/08-01.js')(dependencies);
  collection2019['08-02'] = require('./2019/08-02.js')(dependencies);
  collection2019['09-01'] = require('./2019/09-01.js')(dependencies);
  collection2019['10-01'] = require('./2019/10-01.js')(dependencies);
  collection2019['11-01'] = require('./2019/11-01.js')(dependencies);
  collection2019['12-01'] = require('./2019/12-01.js')(dependencies);
  collection2019['13-01'] = require('./2019/13-01.js')(dependencies);

  const years = {};
  years['2019'] = collection2019;

  return years;
}

module.exports = challenges;
