export default class {
    constructor(grid, speed, updateHook) {
        this.grid = grid;
        this.speed = speed;
        this.delay = false;

        this.clearData();
        this.updateHook = updateHook;
    }

    clearData() {
        this.stopped = false;
        this.openList = [];
        this.closedList = [];
        this.path = false;

        //Let's clear the data we set
        for (var row of this.grid.getRows()) {
            for (var cell of row) {
                cell.classes = [];
                cell.distanceTraveled = false;
                cell.distanceLeft = false;
                cell.estimatedTotalDistance = false;
            }
        }
    }

    setDelay(delay) {
        this.delay = delay;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    stop() {
        this.stopped = true;
    }

    heuristic(currentCell, endCell) {
        var xDistance = Math.abs(endCell.pos.x - currentCell.pos.x);
        var yDistance = Math.abs(endCell.pos.y - currentCell.pos.y);

        return xDistance + yDistance;
    }

    getNeighbors(grid, cell) {
        var neighbors = [];

        var x = cell.pos.x;
        var y = cell.pos.y;

        //Neighbor below
        if (grid[y-1] && grid[y-1][x]) {
            neighbors.push(grid[y-1][x]);
        }

        //Neighbor above
        if (grid[y+1] && grid[y+1][x]) {
            neighbors.push(grid[y+1][x]);
        }

        //Neighbor on the right
        if (grid[y][x+1]) {
            neighbors.push(grid[y][x+1]);
        }

        //Neighbor on the left
        if (grid[y][x-1]) {
            neighbors.push(grid[y][x - 1]);
        }

        return neighbors;
    }

    listContainsNode(list, node) {
        return list.find(function (value) {
            return value.pos == node.pos;
        })
    }

    start() {
        this.clearData();

        let startCell = this.grid.getCellByType('start');
        let endCell = this.grid.getCellByType('end');

        this.startCell = startCell;
        this.endCell = endCell;
        this.openList = [startCell];
        this.closedList = [];

        startCell.distanceTraveled = 0;

        this.runStep();
    };

    runStep = (runOnceOnly) => {
        //We want to be able to run only a single step if we're stopped
        if (this.stopped && !runOnceOnly) {
            return;
        }

        //If there's no more open nodes to look at, we're done
        if (this.openList.length == 0) {
            this.finished();
            return;
        }

        //Do our searchStep
        var check = this.step();

        //If we found the exit, we're done
        if (check !== false) {
            this.path = check;
            this.finished();
        } else if (!runOnceOnly) {

            if (this.delay) {
                //There's more nodes to check and we haven't found the exit
                window.setTimeout(this.runStep, this.speed);
            } else {
                this.runStep();
            }
        }

        this.updateHook();
    };

    step() {
        let {closedList, endCell, openList} = this;

        var lowestIndex = null;

        //Get the index of the cell in the open list that is estimated to be the closest to the end
        openList.forEach(function (value, index) {
            if (lowestIndex == null) {
                lowestIndex = index;
                return;
            }

            if (value.estimatedTotalDistance < openList[lowestIndex].estimatedTotalDistance) {
                lowestIndex = index;
            }
        });

        var currentNode = openList[lowestIndex];

        //If we've reached the end, make a path of how we got here and return it
        if (currentNode.pos == endCell.pos) {
            var current = currentNode;
            var path = [];
            while (current.parent) {
                path.push(current);
                current = current.parent;
            }

            return path.reverse();
        }

        currentNode.classes.push('neighbor');

        //Let's move the current node from the open list to the closed list
        openList.splice(lowestIndex, 1);
        closedList.push(currentNode);

        var neighbors = this.getNeighbors(this.grid.getRows(), currentNode);
        for (var neighbor of neighbors) {
            //We've already looked at this node, carry on
            if (this.listContainsNode(closedList, neighbor)) {
                continue;
            }

            var distanceTraveledIsShorted = false;
            var distanceTraveled = currentNode.distanceTraveled + neighbor.time;

            //We don't count walls;
            if (neighbor.type == 'wall') {
                continue;
            }

            //This is the first time we've come here, let's set it's distanceLeft
            if (!this.listContainsNode(openList, neighbor)) {
                distanceTraveledIsShorted = true;
                neighbor.distanceLeft = this.heuristic(neighbor, endCell);
                openList.push(neighbor);
            }
            //If we've visited the cell before, we want to check if we've just discovered a quicker way of getting there
            else if (distanceTraveled < neighbor.distanceTraveled) {
                distanceTraveledIsShorted = true;
            }

            //If this is the quickest found way so far, set the estimated distance to the end and set the parent
            if (distanceTraveledIsShorted) {
                neighbor.parent = currentNode;
                neighbor.distanceTraveled = distanceTraveled;
                neighbor.estimatedTotalDistance = neighbor.distanceLeft + neighbor.distanceTraveled;
            }
        }

        //If we haven't found the exit, return false
        return false;
    };

    finished() {
        const {path, updateHook} = this;
        if (path) {
            for (var cell of path) {
                cell.classes.push('path');
            }

            updateHook();
        }
    }
}