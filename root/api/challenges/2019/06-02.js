function orbitMapper() {
  const center = 'COM';
  const me = 'YOU';
  const santa = 'SAN';

  function processInput(input) {
    const splitter = require('os').EOL;
    // const s0 = "COM)B|B)C|C)D|D)E|E)F|B)G|G)H|D)I|E)J|J)K|K)L|K)YOU|I)SAN";
    // let skyMap = s0.split('|');
    const skyMap = input.split(splitter);

    if (skyMap[skyMap.length] === '') {
      const spaceTrash = skyMap.pop();
      console.log(spaceTrash);
    }

    const data = {};
    skyMap.map((orbit) => {
      const inner = orbit.split(')')[0];
      const satellite = orbit.split(')')[1];
      if (data[satellite] === undefined) {
        data[satellite] = {
          direct: 1,
          orbits: [inner],
        };
      } else {
        data[satellite] = {
          direct: data[satellite].direct + 1,
          orbits: data[satellite].orbits.push(inner),
        };
      }
      return null;
    });

    return findPath(data, me, [me]);
  }

  function findPath(data, orbit, exclude) {
    // console.log(`Seeking ${santa} through jump to ${orbit} through path ${exclude}`);

    const point = data[orbit];
    const set1 = point.orbits.map((nextOrbit) => {
      if (exclude.indexOf(nextOrbit) > -1) {
        return null;
      }
      if (nextOrbit === center) {
        // dead end
        return null;
      }
      const newExclude = exclude.slice();
      newExclude.push(nextOrbit);
      return findPath(data, nextOrbit, newExclude);
    });

    const set2 = [];
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
          const newExclude = exclude.slice();
          newExclude.push(key);
          set2.push(findPath(data, key, newExclude));
        }
      }
    });

    let best = null;
    set1.map((path) => {
      if (path !== null && (best === null || path < best)) {
        best = path;
      }
      return null;
    });
    set2.map((path) => {
      if (path !== null && (best === null || path < best)) {
        best = path;
      }
      return null;
    });

    return best;
  }

  return {
    processInput,
  };
}

module.exports = orbitMapper;
