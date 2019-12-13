function router(dependencies) {
  const challengeRouter = require('./challenges')(dependencies);
  return {
    challenges: challengeRouter,
  };
}

module.exports = router;
