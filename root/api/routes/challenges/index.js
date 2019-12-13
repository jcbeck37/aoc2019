function challengeRoutes(dependencies) {
  const { router, controllers } = dependencies;
  const myRouter = router.Router();

  myRouter.get('/:year/:part', (req, res) => {
    const { year, part } = req.params;
    return controllers.challenges.getView(year, part)
      .then((resp) => {
        res.status(resp.status).json(resp.payload);
      });
    //   .catch(error => {
    //     res.status(error.status).json(error.payload);
    //   });
  });

  myRouter.post('/:year/:part', (req, res) => {
    const { year, part } = req.params;
    let input;
    if (req.files !== undefined) {
      const inputFile = req.files.input;
      input = inputFile.data.toString('ascii');
    } else {
      input = req.body.input;
    }
    return controllers.challenges.processInput(year, part, input)
      .then((resp) => {
        res.status(resp.status).json(resp.payload);
      });
  });

  return myRouter;
}

module.exports = challengeRoutes;
