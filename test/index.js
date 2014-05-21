'use strict';

var extension = require('es5-ext'),
    diff = extension.array['#'].diff,
    deepCopy = extension.object.copyDeep,
    allStaticMethods = ['constant', 'identity', 'invoke', 'isArguments', 'isFunction', 'noop', 'pluck', 'validFunction'],
    allInstanceMethods = ['compose', 'copy', 'curry', 'lock', 'not', 'partial', 'spread'],
    fakeFunctionObject = {prototype: {}};

exports['Test extending everything'] = function(t, a) {
    var global = {
        Array: {prototype: {}},
        Boolean: {prototype: {}},
        Date: {prototype: {}},
        Error: {prototype: {}},
        Function: {prototype: {}},
        Math: {prototype: {}},
        Number: {prototype: {}},
        Object: {prototype: {}},
        RegExp: {prototype: {}},
        String: {prototype: {}}
    };

    t.call(global);

    assertStaticMethodsRegistered(a, global.Function, allStaticMethods);
    assertInstanceMethodsRegistered(a, global.Function, allInstanceMethods);

    a.ok('pluck' in global.Function);
    a.ok('flatten' in global.Object);
    a.ok('camelToHyphen' in global.String.prototype);
};

var assertStaticMethodsRegistered = function(assert, nativeObject, listOfMethods) {
        listOfMethods.forEach(function(methodName) {
            assert.ok(nativeObject.hasOwnProperty(methodName));
        });
    },
    assertStaticMethodsNotRegistered = function(assert, nativeObject, listOfMethods) {
        listOfMethods.forEach(function(methodName) {
            assert.ok(!nativeObject.hasOwnProperty(methodName));
        });
    },
    assertInstanceMethodsRegistered = function(assert, nativeObject, listOfMethods) {
        listOfMethods.forEach(function(methodName) {
            assert.ok(nativeObject.prototype.hasOwnProperty(methodName));
        });
    },
    assertInstanceMethodsNotRegistered = function(assert, nativeObject, listOfMethods) {
        listOfMethods.forEach(function(methodName) {
            assert.ok(!nativeObject.prototype.hasOwnProperty(methodName));
        });
    };

exports['Test registering all methods'] = function(t, a) {
    var fakeFunction = deepCopy(fakeFunctionObject);
    t.function(fakeFunction);

    assertStaticMethodsRegistered(a, fakeFunction, allStaticMethods);
    assertInstanceMethodsRegistered(a, fakeFunction, allInstanceMethods);
};

exports['Test registering subset of methods'] = function(t, a) {
    var fakeFunction = deepCopy(fakeFunctionObject),
        staticMethods = ['pluck'],
        instanceMethods = ['spread'];

    t.function(fakeFunction, staticMethods.concat(instanceMethods));

    assertStaticMethodsRegistered(a, fakeFunction, staticMethods);
    assertStaticMethodsNotRegistered(a, fakeFunction, diff.call(allStaticMethods, staticMethods));
    assertInstanceMethodsRegistered(a, fakeFunction, instanceMethods);
    assertInstanceMethodsNotRegistered(a, fakeFunction, diff.call(allInstanceMethods, instanceMethods));
};

exports['Test registering subset of methods - methods as first argument'] = function(t, a) {
    var global = {Function: deepCopy(fakeFunctionObject)},
        fakeFunction = global.Function,
        staticMethods = ['pluck'],
        instanceMethods = ['spread'];

    t.function.call(global, staticMethods.concat(instanceMethods));

    assertStaticMethodsRegistered(a, fakeFunction, staticMethods);
    assertStaticMethodsNotRegistered(a, fakeFunction, diff.call(allStaticMethods, staticMethods));
    assertInstanceMethodsRegistered(a, fakeFunction, instanceMethods);
    assertInstanceMethodsNotRegistered(a, fakeFunction, diff.call(allInstanceMethods, instanceMethods));
};

exports['Test defining custom descriptor'] = function(t, a) {
    var fakeFunction = deepCopy(fakeFunctionObject),
        staticMethod1 = 'pluck',
        staticMethod2 = 'noop',
        staticMethod3 = 'invoke',
        descriptor;

    t.function(fakeFunction, [staticMethod1]);
    descriptor = Object.getOwnPropertyDescriptor(fakeFunction, staticMethod1);

    a.ok(descriptor.writable === false);
    a.ok(descriptor.configurable === false);
    a.ok(descriptor.enumerable === false);


    t.function(fakeFunction, [staticMethod2], {
        writable: true,
        configurable: true,
        enumerable: true
    });
    descriptor = Object.getOwnPropertyDescriptor(fakeFunction, staticMethod2);

    a.ok(descriptor.writable);
    a.ok(descriptor.configurable);
    a.ok(descriptor.enumerable);

    t.function(fakeFunction, [staticMethod3], {
        configurable: true
    });
    descriptor = Object.getOwnPropertyDescriptor(fakeFunction, staticMethod3);

    a.ok(descriptor.writable === false);
    a.ok(descriptor.configurable);
    a.ok(descriptor.enumerable === false);
};


exports['Test defining custom descriptor and extending with all method'] = function(t, a) {
    var fakeFunction = deepCopy(fakeFunctionObject),
        descriptor;

    t.function(fakeFunction, {
        writable: true,
        configurable: true,
        enumerable: true
    });

    descriptor = Object.getOwnPropertyDescriptor(fakeFunction, 'pluck');

    a.ok(descriptor.writable);
    a.ok(descriptor.configurable);
    a.ok(descriptor.enumerable);
};
