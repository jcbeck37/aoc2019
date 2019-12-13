function orbitMapper() {


  function processInput(input) {
    const s0 = "COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN";
    let skyMap = s0.split('\n');
    //let skyMap = input.split('\n');

    let spaceTrash = skyMap.pop();
    console.log(spaceTrash);

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
    //console.log(map);
    //console.log(data);
    let orbitCount = 0;
    // Object.entries(data).forEach(([key, value]) => {
    //   orbitCount = orbitCount + value.direct + countOrbits(value);
    //   return null;
    // });
    


    return orbitCount;
  }

  function countOrbits(obj) {
    let objIndirects = 0;
    obj.orbits.map(orbit => {
      objIndirects = objIndirects + countIndirect(data, orbit);
      return null;
    });
    console.log(`Obj ${obj} orbits ${objIndirects}`);
    return obj.direct + objIndirects;
  }

  function countIndirect(data, obj) {
    if (obj === "COM") {
      return 0;
    }
    let indirect = 0;
    if (data[obj].orbits !== undefined) {
      data[obj].orbits.map(obj2 => {
        indirect = indirect + 1 + countIndirect(data, obj2);
      });
    }
    return indirect;
  }

  return {
    processInput
  };
}

module.exports = orbitMapper;