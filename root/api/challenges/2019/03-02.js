function crossedWires() {
  function processInput(input) {
    const wirePaths = input.split('\n');
    const sample0 = "R8,U5,L5,D3\nU7,R6,D4,L4";
    const sample1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83";
    const sample2 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7";
    // const wirePaths = sample2.split('\n');

    let result1 = populateWire(wirePaths[0]);
    let result2 = populateWire(wirePaths[1], result1.wireCoords);
    return result2.fewestSteps;
  }

  function populateWire(wirePath, oldWire) {
    let shortest = 0;
    let fewestSteps = 0;
    const directions = wirePath.split(',');

    let x = 0;
    let y = 0;

    const wireCoords = [];

    directions.map((d, idx) => {
      const dir = d.substr(0, 1);
      const dist = Number(d.substr(1));

      const nextX = findCoord(x, "X", dir, dist);
      const nextY = findCoord(y, "Y", dir, dist);

      const newPath = [x, y, nextX, nextY];
      wireCoords.push(newPath);

      if (oldWire !== undefined) {
        // check for intersections
        let results = checkIntersections(oldWire, newPath);
        if (results.length > 0) {
          results.map(result => {
            const wire1Idx = result.idx;

            const path1 = oldWire[wire1Idx];
            const x1 = path1[0];
            const y1 = path1[1];

            const intX = result.intersectsAt[0];
            const intY = result.intersectsAt[1];

            let wire1steps = calculateSteps(oldWire, wire1Idx - 1);
            let wire2steps = calculateSteps(wireCoords, idx - 1);
            let final1steps = countSteps(x1, y1, intX, intY);
            let final2steps = countSteps(x, y, intX, intY);
            let totalSteps = wire1steps + wire2steps + final1steps + final2steps;
            if (totalSteps < fewestSteps || fewestSteps === 0) {
              fewestSteps = totalSteps;
              console.log(`Fewer steps: ${fewestSteps}`);
            }
          });
        }
      }

      // console.log(`NEW: (${x},${y},${nextX},${nextY})`);
      x = nextX;
      y = nextY;

    });

    return {
      wireCoords,
      fewestSteps
    };
  }

  function calculateSteps(wire, idx) {
    let steps = 0;
    wire.map((path, index) => {
      if (index <= idx) {
        let [x1, y1, x2, y2] = path;
        steps += countSteps(x1, y1, x2, y2);
      }
    });

    return steps;
  }

  function countSteps(x1, y1, x2, y2) {
    if (x1 !== x2 && y1 !== y2) {
      console.log("ALERT ALERT ALERT ALERT ALERT");
    }
    return (x1 === x2) ? Math.abs(y1 - y2) : Math.abs(x1 - x2);
  }

  function checkIntersections(wire1, path) {
    let results = [];

    wire1.map((wire, idx) => {
      let intersectsAt = comparePaths(wire, path);
      if (intersectsAt[0] != 0 || intersectsAt[1] != 0) {
        console.log(`Intersection after ${idx} at (${intersectsAt[0]},${intersectsAt[1]})`);
        let result = {
          idx,
          intersectsAt
        };
        results.push(result);
      }
    });

    return results;
  }

  function comparePaths(path1, path2) {
    let wire1x1 = path1[0];
    let wire1y1 = path1[1];
    let wire1x2 = path1[2];
    let wire1y2 = path1[3];

    let wire2x1 = path2[0];
    let wire2y1 = path2[1];
    let wire2x2 = path2[2];
    let wire2y2 = path2[3];

    if (wire1x1 === wire1x2 && wire2y1 === wire2y2) {
      // horizontal wire crossing vertical wire

      // intersection would have to happen at (wire1x1, wire2y1)
      // wire1y1 and wire1y2 would have to be on either side of this point
      let check1 = isIntersection(wire1y1, wire1y2, wire2y1);
      // wire2x1 and wire2x2 would have to be on either side of this point
      let check2 = isIntersection(wire2x1, wire2x2, wire1x1);

      if (check1 && check2) {
        return [wire1x1, wire2y1];
        //return Math.abs(wire1x1) + Math.abs(wire2y1);
      }
    } else if (wire1y1 === wire1y2 && wire2x1 === wire2x2) {
      // vertical wire crossing horizontal wire
      let check1 = isIntersection(wire1x1, wire1x2, wire2x1);
      let check2 = isIntersection(wire2y1, wire2y2, wire1y1);

      if (check1 && check2) {
        return [wire2x1, wire1y1];
        //return Math.abs(wire1y1) + Math.abs(wire2x1);
      }
    }

    // no intersection
    return [0, 0];
  }

  function isIntersection(coord0, coord1, axis) {
    if (coord0 < axis && coord1 > axis) {
      return true;
    }
    if (coord0 > axis && coord1 < axis) {
      return true;
    }
    return false;
  }

  function findCoord(coord, axis, dir, dist) {
    if (axis === "X") {
      if (["U", "D"].indexOf(dir) >= 0) {
        return dir === "D" ? coord - dist : coord + dist;
      }
      return coord;
    }


    if (["L", "R"].indexOf(dir) >= 0) {
      return dir === "L" ? coord - dist : coord + dist;
    }
    return coord;
  }

  return {
    processInput
  };
}

module.exports = crossedWires;