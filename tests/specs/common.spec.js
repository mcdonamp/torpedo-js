/*************/
/*  GLOBALS  */
/*************/
// Override the default timeout interval for Jasmine
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

// Get a reference to a random demo Firebase
var demoFirebaseUrl = "https://torpedo-test.firebaseio.com/";

// Define examples of valid and invalid parameters
var invalidFirebaseRefs = [null, undefined, NaN, true, false, [], 0, 5, "", "a", ["hi", 1]];
var validChannels = [12345, "12345"];
var invalidChannels = [null, undefined, NaN, true, false, [], ".", "", "", "", ""];

// Create global variables to hold the Firebase and LIBRARY_NAME variables
var firebaseRef, torpedo;

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/

// STEP 4: Update beforeEachHelper to set up each test
/* Helper function which runs before each Jasmine test has started */
function beforeEachHelper(done) {
  // Create a new firebase ref with a new context
  firebaseRef = new Firebase(demoFirebaseUrl);

  // Reset the Firebase
  firebaseRef.remove(function() {
    // Create a new firebase ref at a random node
    firebaseRef = firebaseRef.child(generateRandomString());
    // Create a new instance of Torpedo
    torpedo = new Torpedo(firebaseRef);

    done();
  });
}

// STEP 5: Update afterEachHelper to clean up after each test
/* Helper function which runs after each Jasmine test has completed */
function afterEachHelper(done) {
  done();
}

/* Returns a random alphabetic string of variable length */
function generateRandomString() {
  var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var numPossibleCharacters = possibleCharacters.length;

  var text = "";
  for (var i = 0; i < 10; i++) {
    text += possibleCharacters.charAt(Math.floor(Math.random() * numPossibleCharacters));
  }

  return text;
}

/* Keeps track of all the current asynchronous tasks being run */
function Checklist(items, expect, done) {
  var eventsToComplete = items;

  /* Removes a task from the events list */
  this.x = function(item) {
    var index = eventsToComplete.indexOf(item);
    if (index === -1) {
      expect("Attempting to delete unexpected item '" + item + "' from Checklist").toBeFalsy();
    }
    else {
      eventsToComplete.splice(index, 1);
      if (this.isEmpty()) {
        done();
      }
    }
  };

  /* Returns the length of the events list */
  this.length = function() {
    return eventsToComplete.length;
  };

  /* Returns true if the events list is empty */
  this.isEmpty = function() {
    return (this.length() === 0);
  };
}

/* Common error handler for use in .catch() statements of promises. This will
 * cause the test to fail, outputting the details of the exception. Otherwise, tests
 * tend to fail due to the Jasmine ASYNC timeout and provide no details of what actually
 * went wrong.
 **/
function failTestOnCaughtError(error) {
  expect(error).toBeNull();
}
