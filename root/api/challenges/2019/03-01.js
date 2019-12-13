function crossedWires() {
  function processInput(input) {
    const wirePaths = input.split('\n');
    // let s1 = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83";
    // let s2 = "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7";
    // const wirePaths = s1.split('\n');

    const result1 = populateWire(wirePaths[0]);
    const result2 = populateWire(wirePaths[1], result1.wireCoords);

    return result2.shortest;
  }

  function populateWire(wirePath, oldWire) {
    let shortest = 0;
    const directions = wirePath.split(',');

    let x = 0;
    let y = 0;

    const wireCoords = [];

    directions.map((d) => {
      const dir = d.substr(0, 1);
      const dist = Number(d.substr(1));

      const nextX = findCoord(x, 'X', dir, dist);
      const nextY = findCoord(y, 'Y', dir, dist);

      const newPath = [x, y, nextX, nextY];
      wireCoords.push(newPath);

      if (oldWire !== undefined) {
        // check for intersections
        const cross = checkIntersections(oldWire, newPath);
        if (cross > 0 && (cross < shortest || shortest === 0)) {
          shortest = cross;
          console.log(`Even shorter: ${shortest}`);
        }
      }

      console.log(`NEW: (${x},${y},${nextX},${nextY})`);
      x = nextX;
      y = nextY;

      return null;
    });

    return {
      wireCoords,
      shortest,
    };
  }

  function checkIntersections(wire1, path) {
    let cross = 0;

    wire1.map((wire) => {
      const check = comparePaths(wire, path);
      if (check > 0 && (check < cross || cross === 0)) {
        cross = check;
        console.log(`Intersection: ${check}`);
      }
      return null;
    });

    return cross;
  }

  function comparePaths(path1, path2) {
    const wire1x1 = path1[0];
    const wire1y1 = path1[1];
    const wire1x2 = path1[2];
    const wire1y2 = path1[3];

    const wire2x1 = path2[0];
    const wire2y1 = path2[1];
    const wire2x2 = path2[2];
    const wire2y2 = path2[3];

    if (wire1x1 === wire1x2 && wire2y1 === wire2y2) {
      // horizontal wire crossing vertical wire

      // intersection would have to happen at (wire1x1, wire2y1)
      // wire1y1 and wire1y2 would have to be on either side of this point
      const check1 = isIntersection(wire1y1, wire1y2, wire2y1);
      // wire2x1 and wire2x2 would have to be on either side of this point
      const check2 = isIntersection(wire2x1, wire2x2, wire1x1);

      if (check1 && check2) {
        return Math.abs(wire1x1) + Math.abs(wire2y1);
      }
    } else if (wire1y1 === wire1y2 && wire2x1 === wire2x2) {
      // vertical wire crossing horizontal wire
      const check1 = isIntersection(wire1x1, wire1x2, wire2x1);
      const check2 = isIntersection(wire2y1, wire2y2, wire1y1);

      if (check1 && check2) {
        return Math.abs(wire1y1) + Math.abs(wire2x1);
      }
    }

    // no intersection
    return 0;
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
    if (axis === 'X') {
      if (['U', 'D'].indexOf(dir) >= 0) {
        return dir === 'D' ? coord - dist : coord + dist;
      }
      return coord;
    }


    if (['L', 'R'].indexOf(dir) >= 0) {
      return dir === 'L' ? coord - dist : coord + dist;
    }
    return coord;
  }

  return {
    processInput,
  };
}

module.exports = crossedWires;
