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

  /**
   * Publishes a message to a given channel.
   * @param {object} options An object containing the channel(s) to write to and the message to write to that channel.
   * @return {Promise} promise A promise containing the data written if successful or an error message if unsuccessful.
   */
  this.publish = function(options) {
    var channel = options.channel;
    var message = options.message;

    if (Object.prototype.toString.call(channel) === "[object Array]") {
      var promises = channel.map(function(channel){
        return this.publish({channel:channel,message:message});
      }, this);
      return RSVP.all(promises);
    }

    return new RSVP.Promise(function(resolve, reject) {
      function onComplete(error) {
        if (error) {
          reject(error);
        }
        else {
          resolve({channel:channel, message:message});
        }
      }
      if (!channel) {
        reject(new Error("Must include a channel"));
      }

      if (!_validateChannel(channel)) {
        reject(new Error("Channel " + channel + " must be a valid key"));
      }

      if (!message) {
        reject(new Error("Must include a message"));
      }

      _firebaseRef.child(channel).push().setWithPriority(message, Firebase.ServerValue.TIMESTAMP, onComplete);
    });
  };

  /*********************/
  /*  PRIVATE METHODS  */
  /*********************/

  function _validateChannel(channel){
    var invalidKey = /[\[\].#$\/\u0000-\u001F\u007F]/;
    return (typeof channel === "string") && (channel.length !== 0) && !invalidKey.test(channel);
  }

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
