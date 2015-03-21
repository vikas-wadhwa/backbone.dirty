# backbone.dirty

Simple model dirty-checking for Backbone.js aka tracking of 'unsaved' state.

## Installation

### Node.js

    npm install backbone.dirty

### Bower builds

    bower install backbone.dirty

## Getting started

The plugin is tested with, and should work with the following versions of

* Backbone >= 1.1.2
* Underscore >= 1.8.3

### Basic
Include backbone.dirty after Backbone and underscore


```javascript
<script src="path/to/backbone/dist/backbone.dirty.min.js"></script>
```

### node.js/browserify
If you use Backbone with node.js or browserify backbone.dirty can be
required using 
```javascript
var Dirty = require('backbone.dirty');
``` 


### AMD/Require.js 
```javascript
require.config({
  paths: {
    "jquery"         : "path/to/jquery/jquery",
    "underscore"     : "path/to/underscore/underscore",
    "backbone"       : "path/to/backbone/backbone",
    "backbone.dirty" : "path/to/backbone.dirty/backbone.dirty"
  },
  shim: {
    "underscore": {
      exports: "_"
    },
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});
```

And backbone.dirty can be required with:

```javascript
define(['backbone.dirty'], function(DirtyModel) {
  var MyModel = DirtyModel.extend({}); 

  return MyModel;
});
```

## Usage

Change your models to extend from `Backbone.DirtyModel`, e.g.

```javascript
    var Person = Backbone.Model.extend({ ... });
    
    // becomes
    
    var Person = Backbone.DirtyModel.extend({ ... });
``` 

Its also possible to use another base model to extend from other than ```Backbone.Model``` 

using ```Backbone.DirtyModel.factory```.

This enables backbone.dirty to be used with models/model libraries which overrides set or sync.

For instance Backbone-relational.

```javascript
  var Person = Backbone.DirtyModel.factory(Backbone.RelationalModel).extend({ ... });
``` 

Calling ```set``` will call Backbone.RelationalModel set before updating dirty state of the model. 

## API

### isDirty()
Returns if the model is dirty or not. Calling ```save``` will reset the dirty state
on success.
```javascript
// dot syntax
var person = new Backbone.DirtyModel({ name: 'Bob' });

person.isDirty(); // false 

person.set('name', 'Bill'); 

person.isDirty(); // true 
```

### rollback(object | model, options)
Rollbacks the model to its 'clean' state. Options is the same
as the options which can be provided to a regular ```set```

Its also possible to rollback using an object. This sets the properties of
the provided object as well as marking the model as clean. 
```javascript

var person = new Backbone.DirtyModel({ name: 'Bob'})

person.set('name', 'Bill');
person.rollback(null, { silent: true }); // don't trigger a change
person.get('name'); // returns 'Bob'

// or 

person.rollback({ name: 'Susie' });
person.isDirty(); // false
person.get('name'); // returns 'Susie'

```

### resetDirty()

Marks the model as clean although the stored attributes which are used in a rollback
is unchanged

```javascript
  var person = new Backbone.DirtyModel({ name: 'Bob'})

  person.set('name', 'Bill');
  person.isDirty(); // true 
  person.resetDirty();

  person.isDirty(); //false

  person.rollback();

  person.get('name'); // Bob
```

## Events

### "dirty"

When the model have been dirtied model will trigger a ```dirty``` event.

This can for instance be used to enable save buttons in views when the model is "unsaved"

### "clean"

The opposite of dirty (dah), ```clean``` is triggered on ```rollback```, ```sync``` and by calling ```resetDirty```


## Nested models/collections

Backbone.dirty only does a shallow check and will ignore any nested models and collections.

It's however easy to enable deeper level of dirty checking by letting nested models extend from ```Backbone.DirtyModel``` 

### Nested Model
```
var Job = Backbone.DirtyModel.extend({ })

var Person = Backbone.DirtyModel.extend({ 
  isDirty: function() {
    return this.get('job').isDirty() && Backbone.DirtyModel.prototype.isDirty.call(this);
  }
});
```
