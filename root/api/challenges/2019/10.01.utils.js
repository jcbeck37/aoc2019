function spaceUtils() {
  function buildSpaceMap(raw) {
    let spaceMap = [];
    let lines = raw.split('\n');
    lines.map((line, idx) => {
      if (line !== '') {
        spaceMap[idx] = line.split('');
      }
    });
    return spaceMap;
  }

  function plotAsteroids(spaceMap) {
    let asteroids = [];
    spaceMap.map((line, y) => {
      line.map((point, x) => {
        if (point === "#") {
          asteroids.push({ x, y });
        }
      });
    });
    return asteroids;
  }

  function isBetween(a, b, c) {
    return (a < b && b < c) || (a > b && b > c);
  }

  function countVisible(p) { // p = prospect
    let matches = this.asteroids.filter(a => a !== p).map(a => {
      let x = a.x - p.x;
      let y = a.y - p.y;

      const angle = Math.atan2(y, x);
      let blockers = this.asteroids.filter(f => {
        if (f === p || f === a) {
          return false;
        }
        let fx = f.x - p.x;
        let fy = f.y - p.y;
        const fAngle = Math.atan2(fy, fx);
        if (fAngle != angle) {
          return false;
        }

        if (isBetween(p.x, f.x, a.x) || isBetween(p.y, f.y, a.y)) {
          return true;
        }

        return false;
      });

      return Number(blockers.length === 0);
    });

    let ret = { ...p };
    ret.los = matches.filter(m => m > 0).length;
    return ret;
  }

  function createPatrol(station, asteroids) {
    let angles = asteroids.map(a => {
      let x = a.x - station.x;
      let y = a.y - station.y;

      let angle = Math.atan2(y, x) * 180 / Math.PI;
      let degrees = 360 - ((angle + 360) % 360);
      let distance = Math.sqrt((x * x) + (y * y));
      return { degrees, distance, asteroid: a, zapped: 0 };
    });

    return sortAngles(angles);
  }

  function sortAngles(angles) {
    let sorted = angles.slice();
    let chngs = 0;
    for (let idx = 0; idx < angles.length - 1; idx++) {
      let a = { ...sorted[idx] };
      let b = { ...sorted[idx + 1] };
      if (a.degrees < b.degrees || (a.degrees === b.degrees && a.distance > b.distance)) {
        chngs++;
        let tmp = { ...sorted[idx] };
        sorted[idx] = { ...sorted[idx + 1] };
        sorted[idx + 1] = tmp;
      }
    }

    if (chngs > 0) {
      return sortAngles(sorted);
    }
    return sorted;
  }

  function zap(start, stop, result, test = false) {
    let quadrant = this.patrol.filter(f => f.zapped === 0 && f.degrees <= start && f.degrees > stop);
    let dg;
    quadrant.map(a => {
      if (a.degrees !== dg) {
        a.zapped = result.zapped + 1;
        result.zapped++;
        if (result.zapped === 200) {
          result.zap200 = a;
        }

        if (test) {
          let testPoints = [1, 2, 3, 4, 5, 10, 20, 50, 100, 199, 200, 201, 299];
          let tpValid = [[11, 12], [12, 1], [12, 2], [0, 0], [0, 0], [12, 8], [16, 0], [16, 9], [10, 16], [9, 6], [8, 2], [10, 9], [11, 1]];
          if (testPoints.find(a => a === result.zapped) !== undefined) {
            let idx = testPoints.findIndex(i => i === result.zapped);
            let correct = tpValid[idx];
            if (a.asteroid.x !== correct[0] || a.asteroid.y !== correct[1]) {
              let target = this.patrol.find(t => t.asteroid.x === correct[0] && t.asteroid.y === correct[1]);
              if (target !== undefined) {
                console.log(`Should be:`, target);
                console.log('zapped', a);
              }
            }
          }
        }
        dg = a.degrees;
      }
      // console.log('did not zap', a);
    });

    return result;
  }
  return {
    buildSpaceMap,
    plotAsteroids,
    countVisible,
    createPatrol,
    zap
  };
}

module.exports = spaceUtils;