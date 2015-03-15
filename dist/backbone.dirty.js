
;(function(root, factory) {
  'use strict';

  if (typeof exports !== 'undefined') {
    // Define as CommonJS export:
    module.exports = factory(require('underscore'), require('backbone'));
  } else if (typeof define === 'function' && define.amd) {
    // Define as AMD:
    define(['underscore', 'backbone'], factory);
  } else {
    // Just run it:
    factory(root._, root.Backbone);
  }

}(this, function(_, Backbone) {
  'use strict';

  var isModel      = function(obj) { return obj instanceof Backbone.Model; },
      isCollection = function(obj) { return obj instanceof Backbone.Collection; };

  var factory = function (Model) {
    return Model.extend({
      _modelAttrs: {},

      constructor: function () {
        Model.apply(this, arguments);
        this._copyModelAttr(this.attributes);
        this.dirty = false;
      },

      set: _.wrap(Model.prototype.set, function(oldSet, key, value, options) {
        oldSet.call(this, key, value, options);
        this._checkDirty(this);
      }),

      sync: _.wrap(Model.prototype.sync, function (oldSync, method, model, options) {
        options = options || {};

        var methods = ['update', 'create', 'patch'];

        if (_.contains(methods, method)) {
          options.success = _.wrap(options.success, _.bind(function(oldSuccess, data, textStatus, jqXHR) {
            var ret;

            if (oldSuccess) {
              ret = oldSuccess.call(this, data, textStatus, jqXHR);
            }

            this._copyModelAttr(model);
            this.resetDirty();

            return ret;

          }, this));
        }
        return oldSync(method, model, options);
      }),

      isDirty: function () {
        return this.dirty;
      },

      rollback: function (model) {
        var attrs = isModel(model) ? model.attributes : model || {};

        if (!_.isEmpty(attrs)) {
          this._copyModelAttr(attrs);
        }

        this.set(this._modelAttrs);
        this.resetDirty();
      },

      resetDirty: function () {
        this.dirty = false;
        this.changed = {};
      },

      _checkDirty: function (model) {
        var addedAttr = false;
        _.each(model.attributes, function (value, key) {
          // added attribute, the model is dirty
          if (!_.has(this._modelAttrs, key) && (!isModel(value) || !isCollection(value))) {
            addedAttr = true;
            return;
          }

        }, this);

        this.dirty = addedAttr || !_.isEqual(_.pick(model.attributes, _.keys(this._modelAttrs)), this._modelAttrs);

        if(this.dirty) {
          this.trigger('dirty', this);
        }

      },

      _copyModelAttr: function (newAttrs) {
        var result = {},
            attrs = _.clone(newAttrs);

        _.each(attrs, function (value, key) {
          if (!isModel(value) && !isCollection(value)) {
            result[key] = value;
          }
        });

        this._modelAttrs = result;
      }

    });
  };

  var dirty = Backbone.DirtyModel = factory(Backbone.Model);

  return {
    DirtyModel: dirty,
    dirtyModelFactory: factory
  };

}));
