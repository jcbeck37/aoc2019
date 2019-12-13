function controllers(dependencies) {
  return {
    challenges: require('./challenges')(dependencies),
  };
}

module.exports = controllers;
