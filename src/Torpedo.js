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
   * Returns the uid of the user currently authenticated into Torpedo.
   *
   * @return {string} The uid of the user currently authenticated into Torpedo.
   */
  this.uuid = function() {
    return _uuid;
  };

  /**
   * Auths a user to their Torpedo and Firebase instance.
   * @param {string} token Token used to validate Torpedo and Firebase instance.
   * @return {(Object|Error)} Returns the user object if authentication was valid or an error if authentication was invalid
   */
  this.auth = function(token) {
    _firebaseRef.unauth();
    return new RSVP.Promise(function(resolve, reject){
      _firebaseRef.authWithCustomToken(token, function(error, authData) {
        if (error) {
          reject(error);
        } else {
          _uuid = authData.uid;
          resolve(authData);
        }
      });
    });
  };

  /**
   * Publishes a message to a given channel.
   * @param {!Object} options An object containing the channel(s) to write to and the message to write to that channel.
   * @return {Promise} promise A promise containing the data written if successful or an error message if unsuccessful.
   */
  this.publish = function(options) {
    var channel = options.channel;
    var message = options.message;

    if (Object.prototype.toString.call(channel) === "[object Array]") {
      var promises = channel.map(function(channel){
        var newOptions = options;
        newOptions.channel = channel;
        return this.publish(newOptions);
      }, this);
      return RSVP.all(promises);
    }

    return new RSVP.Promise(function(resolve, reject) {
      function onComplete(error) {
        if (error) {
          reject(error);
        }
        else {
          resolve({channel:channel, message:message,user:_uuid});
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

      _firebaseRef.child(channel).push().setWithPriority({message:message,user:_uuid}, Firebase.ServerValue.TIMESTAMP, onComplete);
    });
  };

  /**
   * Publishes a message to a given channel.
   * @param {!Object} options An object containing the channel(s) to write to and the message to write to that channel.
   * @return {Promise} promise A promise containing the data written if successful or an error message if unsuccessful.
   */
  this.subscribe = function(options, callback) {
    var channel = options.channel;
    var cb = options.callback || callback;
    var err = options.error || function(error){throw error;};
    var start = options.start || Date.now();
    var end = options.end;
    var count = options.count || 100;

    if (Object.prototype.toString.call(channel) === "[object Array]") {
      channel.map(function(channel){
        var newOptions = options;
        newOptions.channel = channel;
        return this.subscribe(newOptions);
      }, this);
    }

    if (!channel) {
      err(new Error("Must include a channel"));
    }

    if (!_validateChannel(channel)) {
      err(new Error("Channel " + channel + " must be a valid key"));
    }

    _firebaseRef.child(channel).startAt(start).endAt(end).limit(count).on("child_added", function(snapshot) {
      cb(snapshot);
    }, function(error){
      err(error);
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

  var _firebaseRef = firebaseRef;
  var _uuid = "default";

  // Code to eventually automatically set up a uuid based on either previous auth credentials or on new anonymous auth
  // var _uuid = new RSVP.Promise(function(resolve, reject) {
  //             if (_firebaseRef.getAuth()) {
  //               resolve(_firebaseRef.getAuth().uid);
  //             } else {
  //               _firebaseRef.authAnonymously(function(error, authData) {
  //                 console.log("authed anonymously");
  //                 if (error) {
  //                   reject(error);
  //                 } else {
  //                   resolve(authData);
  //                 }
  //               });
  //             }
  //           }).then(function(authData){return authData.uid;});
};
