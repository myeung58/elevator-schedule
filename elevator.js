// main elevator model
function Elevator(minFloor, maxFloor) {
  /*
    these methods and variables are intentionally kept private to the model - based on the logic that an elevator user should not have direct access to the elevator's internal functions, unless they are made available through a [public] user interface
  */
  var minFloor, maxFloor, currentFloor, currentDirection, directionChanges, floorsTravelled, floorRequests, changeDirection, operate, traverse;

    minFloor = minFloor || 1;
    maxFloor = maxFloor || 99;
    currentFloor = 1;
    currentDirection = {
      up: true,
      down: false
    };
    directionChanges = 0;
    floorsTravelled = 0;
    floorRequests = {
      up: [],
      down: []
    };

  changeDirection = function() {
    currentDirection.up = !currentDirection.up;
    currentDirection.down = !currentDirection.down;
    directionChanges += 1;
  };

  isValidFloor = function(floor) {
    return floor >= minFloor && floor <= maxFloor;
  };

  addToQueue = function(floor, direction) {
    floorRequests[direction].push(floor);
  };

  operate = function() {
    if (currentDirection.up) {
      if (!!floorRequests.up.length) {
        traverse('up');
        floorRequests.up = [];
      }
      if (!!floorRequests.down.length) {
        changeDirection();
        traverse('down');
        floorRequests.down = [];
      }
    } else if (currentDirection.down) {
      if (!!floorRequests.down.length) {
        traverse('down');
        floorRequests.down = [];
      }
      if (!!floorRequests.up.length) {
        changeDirection();
        traverse('up');
        floorRequests.up = [];
      }
    }

  };

  traverse = function(direction) {
    if (direction === 'up') {
      floorRequests.up.forEach(function(floor) {
        currentFloor = floor;
        floorsTravelled += 1;
      });
    } else if (direction === 'down') {
      floorRequests.down.sort(function(a, b) { return b-a; }).forEach(function(floor) {
        currentFloor = floor;
        floorsTravelled += 1;
      });
    }
  };

  // public interface
  return {
    // accepts an array of floor requests and operate the elevator
    inputRequests: function(requests) {
      if (requests.constructor !== Array || !requests.length) { return; }

      requests.forEach(function(request) {
        var floor = parseInt(request);

        if (!isValidFloor(floor)) { return; }

        if (floor > currentFloor) {
          addToQueue(floor, 'up');
        } else if (floor < currentFloor) {
          addToQueue(floor, 'down');
        }
      });

      operate();
    },
    // returns an object of information about the elevator's current state
    getElevatorInfo: function() {
      return {
        lowestFloor: minFloor,
        highestFloor: maxFloor,
        floorsTravelled: floorsTravelled,
        directionChanges: directionChanges,
        currentFloor: currentFloor,
        currentDirection: currentDirection.up ? 'up' : 'down'
      };
    }
  };
}



// sample use case
var elevator = new Elevator();

elevator.inputRequests([5, 10]);
elevator.inputRequests([1, 2, 3, 11]);
elevator.inputRequests([]);
elevator.inputRequests([1, 5, 8]);
elevator.inputRequests([2]);



// Use Case Tests to cover basic functionalities
var testElevator = new Elevator(-3, 200);
console.log('lowest floor is set - ', testElevator.getElevatorInfo().lowestFloor === -3);
console.log('highest floor is set - ', testElevator.getElevatorInfo().highestFloor === 200);
testElevator.inputRequests('asdf');
console.log('nothing happens if input request is invalid - ', testElevator.getElevatorInfo().floorsTravelled === 0 && testElevator.getElevatorInfo().currentFloor === 1);
testElevator.inputRequests([]);
console.log('nothing happens if input request is empty - ', testElevator.getElevatorInfo().floorsTravelled === 0 && testElevator.getElevatorInfo().currentFloor === 1);
testElevator.inputRequests([]);
console.log('nothing happens if same floor is requested - ', testElevator.getElevatorInfo().floorsTravelled === 0 && testElevator.getElevatorInfo().currentFloor === 1);
testElevator.inputRequests([-5, 300]);
console.log('does not go to invalid floors - ', testElevator.getElevatorInfo().floorsTravelled === 0 && testElevator.getElevatorInfo().currentFloor === 1);

var testElevator = new Elevator;
testElevator.inputRequests([5]);
console.log('goes up to the correct floor - ', testElevator.getElevatorInfo().currentFloor === 5);
console.log('shows correct direction (without direction change) - ', testElevator.getElevatorInfo().currentDirection === 'up');
testElevator.inputRequests([1, 2, 3, 11]);
console.log('goes down to the correct floor - ', testElevator.getElevatorInfo().currentFloor === 1);
console.log('stores correct direction (with direction change) - ', testElevator.getElevatorInfo().currentDirection === 'down');
console.log('stores correct number of direction changes - ', testElevator.getElevatorInfo().directionChanges === 1);
console.log('stores correct number of floors travelled - ', testElevator.getElevatorInfo().floorsTravelled === 5);
