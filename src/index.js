require("../less/index.less");

import aStarAlgorithm from './aStar';
import gridClass from './grid';

var currentAction = false;
var grid = new gridClass(10);
var demonstrationSpeed = 100;
var stop = false;
var wH = 100;
var debug = false;

var updateGrid = function () {
    updateGridOnScreen(grid.getRows(), $("#grid"));
};

function toggleDebug() {
    if (debug) {
        debug = false;
        aStar.setDelay(false);
    } else {
        debug = true;
        aStar.setDelay(true);
    }

    updateGrid();
}

var aStar = new aStarAlgorithm(grid, demonstrationSpeed, updateGrid);

$(document).ready(function () {
    $("#speedInput").val(demonstrationSpeed);

    var $gridContainer = $("#grid");

    //On clicking cells, perform our actions
    $gridContainer.on("click", ".cell", function () {
        var $cell = $(this);

        var cellId = $cell.data('cell-id');
        var rowId = $cell.data('row-id');
        var cell = grid.grid[rowId][cellId];

        switch (currentAction) {
            case "setStart" :
                var currentStartCell = grid.getCellByType('start');
                if (currentStartCell) {
                    currentStartCell.type = 'none';
                }

                cell.type = 'start';
                updateCurrentAction(false);
                break;

            case "setEnd":
                var currentEnd = grid.getCellByType('end');
                if (currentEnd) {
                    currentEnd.type = 'none';
                }

                cell.type = 'end';
                updateCurrentAction(false);
                break;

            case "setWalls":
                if (cell.type == 'wall') {
                    cell.type = 'none';
                } else {
                    cell.type = 'wall';
                }
                break;

            case "tripleTravelTime":
                if (cell.type == 'triple-travel') {
                    cell.type = 'none';
                    cell.time = 1;
                } else {
                    cell.type = 'triple-travel';
                    cell.time = 3;
                }
                break;
        }

        updateGrid();
    });

    updateGrid();
    bindControls();
});

//Update the HTML for our Grid. This makes a compelling use-case of why we should have just gone with react
function updateGridOnScreen(grid, $container) {
    //Clear the grid
    $container.html('');

    for (var rowId in grid) {
        var row = grid[rowId];
        var $row = $("<div class='row'></div>");

        //Create our cell
        for (var cellId in row) {
            var cell = row[cellId];
            var $cell = $(`<div class='cell' data-cell-id='${cellId}' data-row-id='${rowId}'>
                <div class='distanceTraveled'></div>
                <div class='distanceLeft'></div>
                <div class='total'></div>
            </div>`);

            //If we have the value set, let's show it
            if (cell.distanceTraveled && debug) {
                $cell.find('.distanceTraveled').text(`Traveled: ${cell.distanceTraveled}`);
                $cell.find('.distanceLeft').text(`Left: ${cell.distanceLeft}`);
                $cell.find('.total').text(`Total: ${cell.estimatedTotalDistance}`);
            }

            //Add our class
            $cell.addClass(cell.type);

            //Add our extra classes
            for (var cellClass of cell.classes) {
                $cell.addClass(cellClass);
            }

            //If we're not in debug mode, hide a certain class
            if (!debug) {
                $cell.removeClass('neighbor');
            }

            //Add the cell to the row
            $row.append($cell);
        }

        //Add the row to the grid
        $container.append($row);
    }

    //Set the grid width
    $container.width((grid.length * wH) + 20);
}

//Update our current action as well as set which action button is active. Useful
function updateCurrentAction(action) {
    if (currentAction == action) {
        currentAction = false;
    } else {
        currentAction = action;
    }

    $("#controls .btn-default").removeClass('active');
    $(`#controls .btn-default[data-action=${action}]`).addClass('active');
}

//Add some logic to our controls
function bindControls() {
    $("#controls").on('click', '.btn-default', function () {
       var action = $(this).data('action');
        updateCurrentAction(action);
    });

    $("#run").on('click', function () {
       run();
    });

    $("#stop").on('click', function () {
        aStar.stop();
    });
    
    $("#showSetSpeed").on('click', function () {
        $("#speed-form").toggle();
    });

    $("#toggleDebug").on('click', function () {
       toggleDebug();
    });

    $("#setSpeed").on('click', function () {
        demonstrationSpeed = $("#speedInput").val();
        aStar.setSpeed(demonstrationSpeed);
    });

    $("#step").on('click', function () {
        aStar.runStep(true);
    });
}

function run() {
    aStar.start();
}