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
};
