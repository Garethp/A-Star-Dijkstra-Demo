import "bootstrap/dist/css/bootstrap.min.css";
require("../less/index.less");

import aStarAlgorithm from "./aStar";
import gridClass from "./grid";

let currentAction = false;
const grid = new gridClass(10);
let demonstrationSpeed = 100;
const wH = 100;
let debug = false;

const updateGrid = function () {
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

const aStar = new aStarAlgorithm(grid, demonstrationSpeed, updateGrid);

$(document).ready(function () {
  $("#speedInput").val(demonstrationSpeed);

  const $gridContainer = $("#grid");

  //On clicking cells, perform our actions
  $gridContainer.on("click", ".cell", function () {
    const $cell = $(this);

    const cellId = $cell.data("cell-id");
    const rowId = $cell.data("row-id");
    const cell = grid.grid[rowId][cellId];

    switch (currentAction) {
      case "setStart":
        const currentStartCell = grid.getCellByType("start");
        if (currentStartCell) {
          currentStartCell.type = "none";
        }

        cell.type = "start";
        updateCurrentAction(false);
        break;

      case "setEnd":
        const currentEnd = grid.getCellByType("end");
        if (currentEnd) {
          currentEnd.type = "none";
        }

        cell.type = "end";
        updateCurrentAction(false);
        break;

      case "setWalls":
        if (cell.type === "wall") {
          cell.type = "none";
        } else {
          cell.type = "wall";
        }
        break;

      case "tripleTravelTime":
        if (cell.type === "triple-travel") {
          cell.type = "none";
          cell.time = 1;
        } else {
          cell.type = "triple-travel";
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
  $container.html("");

  for (let rowId in grid) {
    const row = grid[rowId];
    const $row = $("<div class='row'></div>");

    //Create our cell
    for (let cellId in row) {
      const cell = row[cellId];
      const $cell =
        $(`<div class='cell' data-cell-id='${cellId}' data-row-id='${rowId}'>
                <div class='distanceTraveled'></div>
                <div class='distanceLeft'></div>
                <div class='total'></div>
            </div>`);

      //If we have the value set, let's show it
      if (cell.distanceTraveled && debug) {
        $cell
          .find(".distanceTraveled")
          .text(`Traveled: ${cell.distanceTraveled}`);
        $cell.find(".distanceLeft").text(`Left: ${cell.distanceLeft}`);
        $cell.find(".total").text(`Total: ${cell.estimatedTotalDistance}`);
      }

      //Add our class
      $cell.addClass(cell.type);

      //Add our extra classes
      for (let cellClass of cell.classes) {
        $cell.addClass(cellClass);
      }

      //If we're not in debug mode, hide a certain class
      if (!debug) {
        $cell.removeClass("neighbor");
      }

      //Add the cell to the row
      $row.append($cell);
    }

    //Add the row to the grid
    $container.append($row);
  }

  //Set the grid width
  $container.width(grid.length * wH + 20);
}

//Update our current action as well as set which action button is active. Useful
function updateCurrentAction(action) {
  if (currentAction === action) {
    currentAction = false;
  } else {
    currentAction = action;
  }

  $("#controls .btn-default").removeClass("active");
  $(`#controls .btn-default[data-action=${action}]`).addClass("active");
}

//Add some logic to our controls
function bindControls() {
  $("#controls").on("click", ".btn-default", function () {
    const action = $(this).data("action");
    updateCurrentAction(action);
  });

  $("#run").on("click", function () {
    run();
  });

  $("#stop").on("click", function () {
    aStar.stop();
  });

  $("#showSetSpeed").on("click", function () {
    $("#speed-form").toggle();
  });

  $("#toggleDebug").on("click", function () {
    toggleDebug();
  });

  $("#setSpeed").on("click", function () {
    demonstrationSpeed = $("#speedInput").val();
    aStar.setSpeed(demonstrationSpeed);
  });

  $("#step").on("click", function () {
    aStar.runStep(true);
  });
}

function run() {
  aStar.start();
}
