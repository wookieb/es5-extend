'use strict';

var extension = require('es5-ext'),
    assign = extension.object.assign,
    keys = extension.object.keys,
    capitalize = extension.string['#'].capitalize,
    objectFilter = extension.object.filter;

var es5ExtProperties = ['array', 'boolean', 'date', 'error', 'function', 'math', 'number', 'object', 'regExp', 'string'];

var extend = function(staticMethods, instanceMethods, defaultNativeObjectKey) {
        var availableMethods = keys(staticMethods || {}).concat(keys(instanceMethods) || {});

        return function(nativeObject, methods, descriptorOptions) {
            var listOfMethods = availableMethods,
                globalObject = this;

            if (typeof nativeObject === 'undefined') {
                nativeObject = globalObject[defaultNativeObjectKey];
            }

            if (Array.isArray(nativeObject)) {
                descriptorOptions = methods;
                methods = nativeObject;
                nativeObject = globalObject[defaultNativeObjectKey];
            }

            if (!Array.isArray(methods)) {
                descriptorOptions = methods;
                methods = undefined;
            }

            descriptorOptions = assign({
                writable: false,
                enumerable: false,
                configurable: false
            }, descriptorOptions || {});

            if (methods && methods.length) {
                listOfMethods = listOfMethods.filter(function(name) {
                    return methods.indexOf(name) !== -1;
                });
            }

            listOfMethods.forEach(function(methodName) {
                if (methodName in staticMethods) {
                    descriptorOptions.value = staticMethods[methodName];
                    Object.defineProperty(nativeObject, methodName, descriptorOptions);
                }

                if (methodName in instanceMethods) {
                    descriptorOptions.value = instanceMethods[methodName];
                    Object.defineProperty(nativeObject.prototype, methodName, descriptorOptions);
                }
            });
        };
    },
    extractStaticMethods = function(object) {
        return objectFilter(object, function(value, key) {
            return key !== '#';
        }) || {};
    },
    extractInstanceMethods = function(object) {
        return object['#'] || {};
    };


var extendAll = module.exports = function(methods, customDescriptor) {
    var args = [undefined, methods, customDescriptor];
    es5ExtProperties.forEach(function(key) {
        extendAll[key].apply(this, args);
    }, this);
};

es5ExtProperties.forEach(function(key) {
    var methods = extension[key],
        nativeObjectName = capitalize.call(key);

    extendAll[key] = extend(extractStaticMethods(methods), extractInstanceMethods(methods), nativeObjectName);
});
