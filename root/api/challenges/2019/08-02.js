function imageDecoder() {
  // 123456789012 (3, 2) => [123, 456], [789, 012]
  function processInput(input) {
    const image = input.replace('\n','');

    // printImage('123456789012', { width: 3, height: 2});
    // printImage(image, { width: 25, height: 6})

    const targetLayer = findFewestZeros(image, { width: 25, height: 6 });
    const ones = targetLayer.match(/[1]/g).length;
    const twos = targetLayer.match(/[2]/g).length;
    const answer = ones * twos;

    return answer;
  }

  function findFewestZeros(data, { width, height}) {
    let fewest = -1;
    let targetLayer = '';
    const dim = width * height;
    for (let layer = 0; layer < data.length; layer = layer + dim)
    {
      let layerData = data.substr(layer, dim);
      let zeros = layerData.match(/[0]/g);
      // console.log(`Zeros found: ${zeros.length} in ${layerData}`);
      //console.log(zeros);
        if (zeros.length < fewest || fewest === -1) {
          fewest = zeros.length;
          targetLayer = layerData;
          console.log(`fewest so far: ${fewest} in ${targetLayer}`);
        };
    }
    return targetLayer;
  }

  function printImage(data, { width, height }) {
    // each layer is pixels W wide, H height
    const dim = width * height;
    console.log(`Each layer is ${dim} of the digits`);
    for (let layer = 0; layer < data.length; layer = layer + dim)
    {
      let layerData = data.substr(layer, dim);
      let line = '';
      for (let pixel = 0; pixel < dim; pixel = pixel + width) {
        line = line + layerData.substr(pixel, width) + ' ';
      }
      console.log(line);
    }
  }
  
  return {
    processInput
  };
}

module.exports = imageDecoder;