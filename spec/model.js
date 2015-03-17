'use strict';
var expect = chai.expect,
    DirtyModel = Backbone.Dirty.Model;


describe('backbone.dirty', function() {
  beforeEach(function () {
    this.model = new DirtyModel({ prop: 'test' });
  });

  describe('#constructor', function () {

    it('should not be dirty', function () {
      expect(this.model.isDirty()).to.be.false;
    });

    it('should contain the initial properties', function () {
      expect(this.model.attributes).to.deep.equal(this.model._modelAttrs);
    });
  });

  describe('#dirty', function() {
    it('the model should be marked as dirty if a property changes', function() {
      this.model.set('prop', 'test2');
      expect(this.model.isDirty()).to.be.true;
    });

    it('is not dirty if the property is the same as default', function () {
      this.model.set('prop', 'test2');
      expect(this.model.isDirty()).to.be.true;
      this.model.set('prop', 'test');
      expect(this.model.isDirty()).to.be.false;
    });

    it('the model should be marked as dirty if an attribute is added', function () {
      this.model.set('prop2', 'test2');

      expect(this.model.isDirty()).to.be.true;
    });

    it('the model should be marked as dirty if an attribute is deleted', function () {
      this.model.unset('prop');

      expect(this.model.isDirty()).to.be.true;
    });

    it('ignores backbone models', function () {
      var model = new DirtyModel({ prop: 'test', mod: new Backbone.Model() });

      model.get('mod').set('prop', 'a property');
      expect(model.isDirty()).to.be.false;
    });

    it('ignores backbone collections', function () {
      var model = new DirtyModel({ prop: 'test', mod: new Backbone.Collection() });

      model.get('mod').add({ prop: 'test'});

      expect(model.isDirty()).to.be.false;
    });
  });

  describe('#sync', function () {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
    });

    afterEach(function () {
      this.server.restore();
    });

    it('should reset dirty state and set default attributes when doing create', function (done) {
      var Model = DirtyModel.extend({ urlRoot: '/tests' }),
          model = new Model();
      this.server.respondWith('POST', '/tests',
        [
          200,
          { 'Content-Type': 'application/json' },
          '{"id":123,"prop":"test"}'
        ]
      );

      model.set('prop', 'test');
      expect(model.isDirty()).to.be.true;

      model.save().done(function () {
        expect(model.isDirty()).to.be.false;
        done();
      });

      this.server.respond();

    });
  });

  describe('#rollback', function() {
    it('should reset the attributes to the default values', function () {
      var oldValue = this.model.get('prop');

      this.model.set('prop', 'abcdefgh');
      this.model.rollback();

      expect(this.model.isDirty()).to.be.false;
      expect(this.model.get('prop')).to.be.equal(oldValue);
    });

    it('can rollback using new attributes to be set', function() {
      this.model.rollback({ test: 1, prop: 'test2'});
      expect(this.model.isDirty()).to.be.false;
    });

    it('can rollback using a new model', function () {
      this.model.rollback(new Backbone.Model({ test: 1 }));
      expect(this.model.isDirty()).to.be.false;
      expect(this.model.get('test')).to.be.equal(1);
    });
  });
});
