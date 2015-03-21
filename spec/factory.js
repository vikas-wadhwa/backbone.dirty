'use strict';
var expect = chai.expect,
    factory = Backbone.DirtyModel.factory;

describe('backbone.dirty factory', function() {
  var hasSet,
      hasInitialize,
      hasSync;

  beforeEach(function () {
    hasSet = hasInitialize = hasSync = false;

    var toExtendFrom = Backbone.Model.extend({
      set: function () {
        hasSet = true;
        Backbone.Model.prototype.set.apply(this, arguments);
      },

      initialize: function () {
        hasInitialize = true;
      },

      sync: function () {
        hasSync = true;
      }
    });

    var Model = factory(toExtendFrom);
    this.model = new Model();
  });

  it('calls the parent initialize', function () {
    expect(hasInitialize).to.be.true;
  });

  it('calls the parent set method', function() {
    expect(hasSet).to.be.true;
  });

  it('calls the parent sync', function () {
    this.model.sync();
    expect(hasSync).to.be.true;
  });
});
