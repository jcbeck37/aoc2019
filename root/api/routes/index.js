function router(dependencies) {
  return {
    challenges: require('./challenges')(dependencies),
  };
}

module.exports = router;
