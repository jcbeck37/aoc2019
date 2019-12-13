function challengesController(dependencies) {
  const { challenges } = dependencies;

  function getView(year, part) {
    return Promise.resolve({
      status: 200,
      payload: `Year: ${year}, Part: ${part}`,
    });
  }

  function processInput(year, part, input) {
    const res = challenges[year][part].processInput(input);

    return Promise.resolve({
      status: 200,
      payload: res,
    });
  }

  return {
    getView,
    processInput,
  };
}

module.exports = challengesController;
