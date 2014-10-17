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
});
