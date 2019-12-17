function imageDecoder() {
  // 0: black, 1: white, 2: transparent
  function processInput(input) {
    const image = input.replace('\n', '');

    // printRawImage('0222112222120000', { width: 2, height: 2 });
    // let sample = buildDecodedImage('0222112222120000', { width: 2, height: 2 });
    // printDecodedImage(sample, { width: 2 });

    let decodedImage = buildDecodedImage(image, { width: 25, height: 6 });
    let result = printDecodedImage(decodedImage, { width: 25 });
    return result;
  }

  function printDecodedImage(data, { width }) {
    // console.log(data);
    let image = '';
    const lines = data.length / width;
    for (let line = 0; line < lines; line++) {
      let start = line * width;
      let view = data.slice(start, start + width);
      let out = view.join('');
      console.log(out);
      image = image + out + '\n';
    }
    return image;
  }

  function buildDecodedImage(data, { width, height }) {
    const dim = width * height;
    const layers = data.length / dim;
    const pixels = data.length / layers;
    // console.log(`Expecting ${layers} layers, ${pixels} pixels from ${data}`);
    const decoded = [];
    for (let pixel = 0; pixel < pixels; pixel++) {
      let visible = 2;
      let lyr = 0;
      while (visible === 2 && lyr < layers) {
        let start = (lyr * dim) + pixel;
        let point = Number(data.substr(start, 1));
        // console.log(`Pixel ${pixel} Layer ${lyr} Start ${start} point ${point}`);
        if (visible === 2 && point < 2) {
          visible = point;
        }
        lyr++;
      }
      //decoded.push(visible);
      let transcode = visible.toString().replace('0', ' ');
      transcode = transcode.replace('1', 'X');
      decoded.push(transcode);
    }
    return decoded;
  }

  function printRawImage(data, { width, height }) {
    // each layer is pixels W wide, H height
    const dim = width * height;
    console.log(`Each layer is ${dim} of the digits`);
    for (let layer = 0; layer < data.length; layer = layer + dim) {
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