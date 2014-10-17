/*!
 * Torpedo is a pub/sub implementation built on top of Firebase
 *
 * Torpedo v 0.0.0
 * https://github.com/mcdonamp/torpedo-js
 * License: MIT
 */

// Include any node modules that need to be included
if (typeof module !== "undefined" && typeof process !== "undefined") {
  var RSVP = require("rsvp");
}

var Torpedo = (function() {
  "use strict";
/**
 * Creates a Torpedo instance.
 *
 * @constructor
 * @this {Torpedo}
 * @param {Firebase} firebaseRef A Firebase reference where the Torpedo data will be stored.
 */
var Torpedo = function(firebaseRef) {
  /********************/
  /*  PUBLIC METHODS  */
  /********************/
  /**
   * Returns the Firebase instance used to create this Torpedo instance.
   *
   * @return {Firebase} The Firebase instance used to create this Torpedo instance.
   */
  this.ref = function() {
    return _firebaseRef;
  };

  /*********************/
  /*  PRIVATE METHODS  */
  /*********************/

  /*****************/
  /*  CONSTRUCTOR  */
  /*****************/
  
  if (Object.prototype.toString.call(firebaseRef) !== "[object Object]") {
    throw new Error("firebaseRef must be an instance of Firebase");
  }

  /************************/
  /*  INSTANCE VARIABLES  */
  /************************/

  var _firebaseRef = firebaseRef;
  console.log('Creating new Torpedo ref');
};

  return Torpedo;
})();

// Export Torpedo if this is being run in node
if (typeof module !== "undefined" && typeof process !== "undefined") {
  module.exports = Torpedo;
}