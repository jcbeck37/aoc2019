function orbitMapper() {
  const center = "COM";
  const me = "YOU";
  const santa = "SAN";

  function processInput(input) {
    let splitter = endOfLine = require('os').EOL;
    //const s0 = "COM)B|B)C|C)D|D)E|E)F|B)G|G)H|D)I|E)J|J)K|K)L|K)YOU|I)SAN";
    //let skyMap = s0.split('|');
    let skyMap = input.split(splitter);

    if (skyMap[skyMap.length] === "") {
      let spaceTrash = skyMap.pop();
      console.log(spaceTrash);
    }

    let data = {};
    skyMap.map(orbit => {
      let center = orbit.split(')')[0];
      let satellite = orbit.split(')')[1];
      if (data[satellite] === undefined) {
        data[satellite] = {
          direct: 1,
          orbits: [center]
        };
      } else {
        data[satellite] = {
          direct: data[satellite].direct + 1,
          orbits: data[satellite].orbits.push(center)
        };
      }
    });

    return findPath(data, me, [me]);
  }

  function findPath(data, orbit, exclude) {
    // console.log(`Seeking ${santa} through jump to ${orbit} through path ${exclude}`);

    let point = data[orbit];
    let set1 = point.orbits.map(nextOrbit => {
      if (exclude.indexOf(nextOrbit) > -1) {
        return null;
      }
      if (nextOrbit === center) {
        // dead end
        return null;
      }
      let newExclude = exclude.slice();
      newExclude.push(nextOrbit);
      return findPath(data, nextOrbit, newExclude);
    });

    let set2 = [];
    Object.entries(data).forEach(([key, value]) => {
      // if this item orbits our current center
      if (value.orbits.indexOf(orbit) > -1) {
        if (key === santa) {
          console.log(`Found in orbit of ${orbit} through path ${exclude}`);
          const hops = exclude.length - 2; // you and Santa do not count
          set2.push(hops);
        } else if (exclude.indexOf(key) > -1) {
          // do nothing
        } else {
          let newExclude = exclude.slice();
          newExclude.push(key);
          set2.push(findPath(data, key, newExclude));
        }
      };
    });

    let best = null;
    set1.map(path => {
      if (path !== null && (best === null || path < best)) {
        best = path;
      }
      return null;
    });
    set2.map(path => {
      if (path !== null && (best === null || path < best)) {
        best = path;
      }
      return null;
    });

    return best;
  }

  return {
    processInput
  };
}

module.exports = orbitMapper;