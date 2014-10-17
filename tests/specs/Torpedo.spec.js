describe("Torpedo Tests:", function() {
  // Reset the Firebase before each test
  beforeEach(function(done) {
    beforeEachHelper(done);
  });

  afterEach(function(done) {
    afterEachHelper(done);
  });

  describe("Constructor:", function() {
    it("Constructor throws errors given invalid Firebase references", function() {
      invalidFirebaseRefs.forEach(function(invalidFirebaseRef) {
        expect(function() { new Torpedo(invalidFirebaseRef); }).toThrow();
      });
    });

    it("Constructor does not throw errors given valid Firebase references", function() {
      expect(function() { new Torpedo(firebaseRef); }).not.toThrow();
    });
  });

  describe("ref():", function() {
    it("ref() returns the Firebase reference used to create a GeoFire instance", function() {
      expect(torpedo.ref()).toBe(firebaseRef);
    });
  });

  describe("publish():", function() {
    it("publish() returns a promise", function(done) {
      var cl = new Checklist(["p1"], expect, done);

      torpedo.publish({"channel":"room", "message":"message"}).then(function() {
        cl.x("p1");
      });
    });

    it("publish() accepts valid channel names", function(done) {
      var cl = new Checklist(["p1","p2"], expect, done);

      torpedo.publish({"channel":"12345", "message":"message"}).then(function() {
        cl.x("p1");
      });

      torpedo.publish({"channel":"12345", "message":"message"}).then(function() {
        cl.x("p2");
      });
    });

    it("publish() rejects invalid channel names", function(done) {
      var cl = new Checklist(["p0","p1","p2","p3","p4", "p5", "p6", "p7", "p8"], expect, done);
      
      torpedo.publish({"channel":"", "message":"message"}).catch(function(){
        cl.x("p0");
      });

      torpedo.publish({"channel":".", "message":"message"}).catch(function(){
        cl.x("p1");
      });

      torpedo.publish({"channel":"#", "message":"message"}).catch(function(){
        cl.x("p2");
      });

      torpedo.publish({"channel":"[", "message":"message"}).catch(function(){
        cl.x("p3");
      });

      torpedo.publish({"channel":"]", "message":"message"}).catch(function(){
        cl.x("p4");
      });

      torpedo.publish({"channel":"$", "message":"message"}).catch(function(){
        cl.x("p5");
      });

      torpedo.publish({"channel":"\/", "message":"message"}).catch(function(){
        cl.x("p6");
      });

      torpedo.publish({"channel":true, "message":"message"}).catch(function(){
        cl.x("p7");
      });

      torpedo.publish({"channel":false, "message":"message"}).catch(function(){
        cl.x("p8");
      });
    });

    it("publish() publishes to a single valid channel", function(done) {
      var cl = new Checklist(["p1"], expect, done);

      torpedo.publish({channel:"room", message:"message"}).then(function(data) {
        if (JSON.stringify(data) === JSON.stringify({channel:"room", message:"message"})) {
          cl.x("p1");
        }
      });
    });

    it("publish() publishes to multiple valid channels", function(done) {
      var cl = new Checklist(["p1"], expect, done);

      torpedo.publish({channel:["room1", "room2", "room3"], message:"message"}).then(function(data) {
        if (JSON.stringify(data) === JSON.stringify([{channel: 'room1', message: 'message'}, {channel: 'room2', message: 'message'}, {channel: 'room3', message: 'message'}])) {
          cl.x("p1");
        }
      });
    });

    it("publish() publishes to multiple valid and rejects invalid channels", function(done) {
      var cl = new Checklist(["p1"], expect, done);

      torpedo.publish({channel:["room1", "room2", "room$"], message:"message"}).catch(function(){
        cl.x("p1");
      });
    });
  });

});
