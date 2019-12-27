function orbitMapper() {
  function processInput(input) {
    let splitter = endOfLine = require('os').EOL;
    //const s0 = "COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L";
    //let skyMap = s0.split('\n');
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
      if (center === "") {
        console.log(orbit);
      }
    });
    //console.log(map);
    //console.log(data);
    let orbitCount = 0;
    Object.entries(data).forEach(([key, value]) => {
      // console.log(key);
      let objIndirects = 0;
      value.orbits.map(orbit => {
        objIndirects = objIndirects + countIndirect(data, orbit);
        return null;
      });
      //console.log(`Obj ${value} orbits ${objIndirects}`);
      orbitCount = orbitCount + value.direct + objIndirects;
      return null;
    });

    return orbitCount;
  }

  function countIndirect(data, obj) {
    if (obj === "COM") {
      return 0;
    }
    let indirect = 0;
    try {
      if (data[obj].orbits !== undefined) {
        data[obj].orbits.map(obj2 => {
          indirect = indirect + 1 + countIndirect(data, obj2);
        });
      }
    } catch (err) {
      console.log(`data[${obj}] is undefined`);
    }
    return indirect;
  }

  return {
    processInput
  };
}

module.exports = orbitMapper;