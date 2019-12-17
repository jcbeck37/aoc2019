function mapAnalyzer() {
  this.asteroids = [];
  function processInput(input) {
    // return runTests();

    // failures 254 (too low)
    return runPart1(input);
  };

  function runPart1(input) {
    let spaceMap = buildSpaceMap(input);
    plotAsteroids(spaceMap);

    let results = this.asteroids.map(prospect => countVisible(prospect));
    let bestAsteroid = { los: 0 };
    results.map(res => {
      if (res.los > bestAsteroid.los) {
        bestAsteroid = res;
      }
    });
    console.log(bestAsteroid);
    return bestAsteroid.los;
  }

  function runTests() {
    let tests = getTests();
    tests.map(test => {
      let graph = test.replace(/\./g, '_');
      console.log('_012345678901234567890123456789'.substr(0, graph.split('\n').length));
      graph.split('\n').map((ln, idx) => {
        console.log(`${idx}${ln}`);
      });

      let spaceMap = buildSpaceMap(test);
      this.asteroids = plotAsteroids(spaceMap);
      console.log(`==============`);
      let results = this.asteroids.map(prospect => countVisible(prospect));
      let bestAsteroid = { los: 0 };
      results.map(res => {
        if (res.los > bestAsteroid.los) {
          bestAsteroid = res;
        }
      });
      console.log(bestAsteroid);
      console.log(`==============`);
      return bestAsteroid;
    });
  }

  function getTests() {
    let tests = [];

    // 3,4 with 8
    let test1 = '.#..#\n';
    test1 += '.....\n';
    test1 += '#####\n';
    test1 += '....#\n';
    test1 += '...##\n';
    tests.push(test1);

    // 5,8 with 33
    test1 = '......#.#.\n';
    test1 += '#..#.#....\n';
    test1 += '..#######.\n';
    test1 += '.#.#.###..\n';
    test1 += '.#..#.....\n';
    test1 += '..#....#.#\n';
    test1 += '#..#....#.\n';
    test1 += '.##.#..###\n';
    test1 += '##...#..#.\n';
    test1 += '.#....####';
    tests.push(test1);

    // 11,13 with 210 
    test1 = '.#..##.###...#######\n';
    test1 += '##.############..##.\n';
    test1 += '.#.######.########.#\n';
    test1 += '.###.#######.####.#.\n';
    test1 += '#####.##.#.##.###.##\n';
    test1 += '..#####..#.#########\n';
    test1 += '####################\n';
    test1 += '#.####....###.#.#.##\n';
    test1 += '##.#################\n';
    test1 += '#####.##.###..####..\n';
    test1 += '..######..##.#######\n';
    test1 += '####.##.####...##..#\n';
    test1 += '.#####..#.######.###\n';
    test1 += '##...#.##########...\n';
    test1 += '#.##########.#######\n';
    test1 += '.####.#.###.###.#.##\n';
    test1 += '....##.##.###..#####\n';
    test1 += '.#.#.###########.###\n';
    test1 += '#.#.#.#####.####.###\n';
    test1 += '###.##.####.##.#..##\n';
    tests.push(test1);

    return tests;
  }

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
    spaceMap.map((line, row) => {
      line.map((point, col) => {
        // console.log(point);
        if (point === "#") {
          // console.log(`Asteroid at (${row},${col})`);
          this.asteroids.push({ row, col });
        }
      });
    });
  }

  function isBetween(a, b, c) {
    return (a < b && b < c) || (a > b && b > c);
  }

  function countVisible(p) { // p = prospect
    let matches = this.asteroids.filter(a => a !== p).map(a => {
      let x = a.row - p.row;
      let y = a.col - p.col;

      const angle = Math.atan2(y, x);
      let blockers = this.asteroids.filter(f => {
        if (f === p || f === a) {
          return false;
        }
        let fx = f.row - p.row;
        let fy = f.col - p.col;
        const fAngle = Math.atan2(fy, fx);
        if (fAngle != angle) {
          return false;
        }

        if (isBetween(p.row, f.row, a.row) || isBetween(p.col, f.col, a.col)) {
          // console.log(p, a, x, y, angle);
          // console.log(p, f, fx, fy, fAngle);
          // console.log('--------------');
          return true;
        }

        return false;
      });

      return Number(blockers.length === 0);
    });

    return {
      p,
      los: matches.filter(m => m > 0).length
    };
  }

  return {
    processInput,
  };
}

module.exports = mapAnalyzer;