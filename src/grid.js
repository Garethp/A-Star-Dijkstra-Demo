export default class {
  constructor(size) {
    this.grid = [];
    this.size = size;
    this.init(size);
  }

  init(size) {
    let grid = this.grid;

    for (let y = 0; y < size; y++) {
      grid[y] = [];

      for (let x = 0; x < size; x++) {
        grid[y][x] = {
          type: "none",
          pos: {
            x,
            y,
          },
          f: 0,
          parent: null,
          distanceTraveled: false,
          distanceLeft: false,
          estimatedTotalDistance: false,
          classes: [],
          time: 1,
        };
      }
    }
  }

  getCellByType(type) {
    let grid = this.grid;
    for (let row of grid) {
      for (let cell of row) {
        if (cell.type === type) {
          return cell;
        }
      }
    }

    return false;
  }

  getRows() {
    return this.grid;
  }
}
