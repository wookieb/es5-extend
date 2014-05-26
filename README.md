# es5-extend
[![Build Status](https://travis-ci.org/wookieb/es5-extend.png)](https://travis-ci.org/wookieb/es5-extend)

Simple helper for extending native or other objects with es5-ext functions

## Installation

```
npm install es5-extend
```

## Usage
Extending all native objects (for given context)
```
var extend = require('es5-extend');
extend([methods [, customDescriptor] ])
```

* *context* - global object with native objects
* methods - array of methods to insert into native object
* customDescriptor - custom options for property descriptor

Extending specific object
```
extend.array([nativeObject [, methods [, customDescriptor ] ] ]);
extend.boolean([nativeObject [, methods [, customDescriptor ] ] ]);
extend.date([nativeObject [, methods [, customDescriptor ] ] ]);
extend.error([nativeObject [, methods [, customDescriptor ] ] ]);
extend.function([nativeObject [, methods [, customDescriptor ] ] ]);
extend.math([nativeObject [, methods [, customDescriptor ] ] ]);
extend.number([nativeObject [, methods [, customDescriptor ] ] ]);
extend.object([nativeObject [, methods [, customDescriptor ] ] ]);
extend.regExp([nativeObject [, methods [, customDescriptor ] ] ]);
extend.string([nativeObject [, methods [, customDescriptor ] ] ]);
```

* nativeObject - object to extend
* methods - array of methods to insert into native object
* customDescriptor - custom options for property descriptor

### Extending all native objects with all methods in es5-ext
Please use it wisely.

```javascript
// for node.js
require('es5-extend').call(global);

// for browser
require('es5-extend').call(window);
```

### Extending native objects with subset of methods
```javascript
require('es5-extend').call(global, ['pluck', 'contains']);

'pluck' in global.Function; // true
'contains' in String.prototype; // true
'contains' in Array.prototype; // true
```

### Extending specific native object
```javascript
require('es5-extend').array();
// same as
require('es5-extend').array(Array);

'contains' in Array.prototype; // true
'contains' in String.prototype; //
```

### Extending specific native object with subset of methods
```javascript
require('es5-extend').function(['pluck']);

'pluck' in Function; // true
```

### Extending specific non-native object
```javascript
var CustomKlazz = function() {
    // ...
};
CustomKlazz.prototype = new Array();
extend.array(CustomKlazz, ['keys']);

'keys' in Array.prototype; // false
'keys' in CustomKlazz.prototype; // true
```

### Extending specific native object with custom property descriptor
```javascript
require('es5-extend').function(['pluck'], {configurable: true);

Object.getOwnPropertyDescriptor(Function, 'pluck').configurable; // true
```
