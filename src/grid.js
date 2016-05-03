export default class {
    constructor(size) {
        this.grid = [];
        this.size = size;
        this.init(size);
    }

    init(size) {
        let grid = this.grid;

        for (var i = 0; i < size; i++) {
            grid[i] = [];

            for (var i2 = 0; i2 < size; i2++) {
                grid[i][i2] = {
                    type: 'none',
                    pos: {
                        x: i2,
                        y: i
                    },
                    f: 0,
                    parent: null,
                    distanceTraveled: false,
                    distanceLeft: false,
                    estimatedTotalDistance: false,
                    classes: [],
                    time: 1
                };
            }
        }
    }

    getCellByType(type) {
        let grid = this.grid;
        for (var row of grid) {
            for (var cell of row) {
                if (cell.type == type) {
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