(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TinyMDE = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty


	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings




	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string


	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty


	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$2();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');
	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;

	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }

	  if (O === global_1) {
	    if (simple) O[key] = value;else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation


	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;



	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols


	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;










	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/


	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray


	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject


	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var nativeJoin = [].join;
	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join

	_export({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD
	}, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var defineProperty = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name

	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys


	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var nativeAssign = Object.assign;
	var defineProperty$1 = Object.defineProperty; // `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign

	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({
	    b: 1
	  }, nativeAssign(defineProperty$1({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$1(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), {
	    b: 2
	  })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

	  var A = {};
	  var B = {}; // eslint-disable-next-line no-undef

	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign


	_export({
	  target: 'Object',
	  stat: true,
	  forced: Object.assign !== objectAssign
	}, {
	  assign: objectAssign
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.


	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});
	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');

	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== regexpExec
	}, {
	  exec: regexpExec
	});

	var SPECIES$2 = wellKnownSymbol('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	}); // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

	var REPLACE_KEEPS_$0 = function () {
	  return 'a'.replace(/./, '$0') === '$0';
	}();

	var REPLACE = wellKnownSymbol('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper


	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$2] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];
	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return regexMethod.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return regexMethod.call(string, this);
	    });
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation


	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex


	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec


	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic


	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [// `String.prototype.match` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.match
	  function match(regexp) {
	    var O = requireObjectCoercible(this);
	    var matcher = regexp == undefined ? undefined : regexp[MATCH];
	    return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, // `RegExp.prototype[@@match]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	  function (regexp) {
	    var res = maybeCallNative(nativeMatch, regexp, this);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    if (!rx.global) return regexpExecAbstract(rx, S);
	    var fullUnicode = rx.unicode;
	    rx.lastIndex = 0;
	    var A = [];
	    var n = 0;
	    var result;

	    while ((result = regexpExecAbstract(rx, S)) !== null) {
	      var matchStr = String(result[0]);
	      A[n] = matchStr;
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      n++;
	    }

	    return n === 0 ? null : A;
	  }];
	});

	var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	var SPECIES$3 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var arrayPush = [].push;
	var min$2 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	  return !RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output.length > lim ? output.slice(0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = min$2(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	}, !SUPPORTS_Y);

	var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml

	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments


	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.anchor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.anchor


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('anchor')
	}, {
	  anchor: function anchor(name) {
	    return createHtml(this, 'a', 'name', name);
	  }
	});

	// `String.prototype.bold` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.bold


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('bold')
	}, {
	  bold: function bold() {
	    return createHtml(this, 'b', '', '');
	  }
	});

	// `String.prototype.link` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.link


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('link')
	}, {
	  link: function link(url) {
	    return createHtml(this, 'a', 'href', url);
	  }
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	function _wrapRegExp(re, groups) {
	  _wrapRegExp = function (re, groups) {
	    return new BabelRegExp(re, undefined, groups);
	  };

	  var _RegExp = _wrapNativeSuper(RegExp);

	  var _super = RegExp.prototype;

	  var _groups = new WeakMap();

	  function BabelRegExp(re, flags, groups) {
	    var _this = _RegExp.call(this, re, flags);

	    _groups.set(_this, groups || _groups.get(re));

	    return _this;
	  }

	  _inherits(BabelRegExp, _RegExp);

	  BabelRegExp.prototype.exec = function (str) {
	    var result = _super.exec.call(this, str);

	    if (result) result.groups = buildGroups(result, this);
	    return result;
	  };

	  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
	    if (typeof substitution === "string") {
	      var groups = _groups.get(this);

	      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
	        return "$" + groups[name];
	      }));
	    } else if (typeof substitution === "function") {
	      var _this = this;

	      return _super[Symbol.replace].call(this, str, function () {
	        var args = [];
	        args.push.apply(args, arguments);

	        if (typeof args[args.length - 1] !== "object") {
	          args.push(buildGroups(args, _this));
	        }

	        return substitution.apply(this, args);
	      });
	    } else {
	      return _super[Symbol.replace].call(this, str, substitution);
	    }
	  };

	  function buildGroups(result, re) {
	    var g = _groups.get(re);

	    return Object.keys(g).reduce(function (groups, name) {
	      groups[name] = result[g[name]];
	      return groups;
	    }, Object.create(null));
	  }

	  return _wrapRegExp.apply(this, arguments);
	}

	var svg = {
	  blockquote: "<svg height=\"18\" width=\"18\"><rect width=\"5\" height=\"5\" x=\"3\" y=\"4\" ry=\"1\"/><rect ry=\"1\" y=\"4\" x=\"10\" height=\"5\" width=\"5\"/><path d=\"M8 6.999v3c0 1-1 3-1 3s-.331 1-1.331 1h-1c-1 0-.669-1-.669-1s1-2 1-3v-3zm7 0v3c0 1-1 3-1 3s-.331 1-1.331 1h-1c-1 0-.669-1-.669-1s1-2 1-3v-3z\"/></svg>",
	  bold: "<svg height=\"18\" width=\"18\"><path d=\"M4 2a1 1 0 00-1 1v12a1 1 0 001 1h6c4 0 5-2 5-4 0-1.322-.434-2.636-1.885-3.381C13.772 7.885 14 6.945 14 6c0-2-1-4-5-4zm1 2h4c1.668 0 2.32.393 2.6.672.28.279.4.662.4 1.328s-.12 1.057-.4 1.338c-.275.274-1.014.646-2.6.662H5zm5 6c1.666.005 2.318.388 2.596.666.277.278.404.667.404 1.334s-.127 1.06-.404 1.338c-.278.278-.93.66-2.596.662l-4.992.004L5 10z\"/></svg>",
	  clear_formatting: "<svg height=\"18\" width=\"18\"><path d=\"M11.03 1a1 1 0 00-.74.3l-9 9a1 1 0 000 1.4l4 4A1 1 0 006 16h2a1 1 0 00.7-.3l8-8a1 1 0 000-1.4l-5-5a1 1 0 00-.67-.3zM8.7 5.7l3.58 3.6L7.6 14H6.4l-3-3 5.3-5.3z\"/><rect ry=\".8\" rx=\".8\" y=\"14\" x=\"16\" height=\"2\" width=\"2\"/><rect width=\"2\" height=\"2\" x=\"13\" y=\"14\" rx=\".8\" ry=\".8\"/><rect ry=\".8\" rx=\".8\" y=\"14\" x=\"10\" height=\"2\" width=\"2\"/></svg>",
	  code: "<svg height=\"18\" width=\"18\"><path d=\"M13.5 2.994a.5.5 0 00-.5.5.5.5 0 000 .034V4.53a5.993 5.993 0 00-7.451-.445A6 6 0 1012.45 13.9a5.99 5.99 0 001.346-1.334.5.5 0 00.096-.101.5.5 0 00-.12-.698.5.5 0 00-.697.12l-.004-.005a5 5 0 01-1.197 1.2 5 5 0 111.215-6.965.5.5 0 00.697.12.5.5 0 00.211-.44V4.745H14V3.493a.5.5 0 00-.5-.5z\"/></svg>",
	  h1: "<svg height=\"18\" width=\"18\"><path d=\"M3 2s0-1 1-1h1c1 0 1 1 1 1v6h6V2s0-1 1-1h1c1 0 1 1 1 1v14s0 1-1 1h-1c-1 0-1-1-1-1v-6H6v6s0 1-1 1H4c-1 0-1-1-1-1z\"/></svg>",
	  h2: "<svg height=\"18\" width=\"18\"><path d=\"M4 2s0-1 1-1 1 1 1 1v6c1-1 2-1 4-1 3 0 4 2 4 4v5s0 1-1 1-1-1-1-1v-5c0-1.094-1-2-2-2-2 0-3 0-4 2v5s0 1-1 1-1-1-1-1z\"/></svg>",
	  hr: "<svg height=\"18\" width=\"18\"><rect ry=\"1\" y=\"8\" height=\"2\" width=\"18\" style=\"font-variation-settings:normal;marker:none\"/></svg>",
	  image: "<svg height=\"18\" width=\"18\"><path d=\"M1 2v14h16V2H1zm2 2h12v7l-3-3-4 4-2-2-3 3V4z\"/><circle r=\"1.5\" cy=\"6.5\" cx=\"5.5\"/></svg>",
	  italic: "<svg height=\"18\" width=\"18\"><path d=\"M9 2a1 1 0 000 2L7 14a1 1 0 100 2h2a1 1 0 000-2l2-10a1 1 0 100-2z\"/></svg>",
	  link: "<svg height=\"18\" width=\"18\"><path d=\"M9.07 5.18a3.9 3.9 0 00-1.52.43C6.31 6.22 5.3 7.29 4.3 8.29c-1 1-2.07 2.02-2.68 3.26-.31.62-.5 1.33-.41 2.07.09.75.48 1.47 1.1 2.09.61.61 1.33 1 2.08 1.1.74.09 1.45-.1 2.07-.42 1.24-.61 2.26-1.68 3.26-2.68.46-.47.94-.94 1.39-1.44l-.43.26c-.68.34-1.49.56-2.36.46-.2-.03-.4-.08-.6-.14-.79.76-1.55 1.45-2.16 1.76-.38.19-.67.24-.92.21-.26-.03-.54-.14-.92-.53-.39-.38-.5-.66-.53-.91-.03-.26.02-.55.21-.93.39-.76 1.32-1.74 2.32-2.74 1-1 1.98-1.93 2.74-2.32.38-.19.67-.24.93-.21.25.03.53.14.91.53.39.38.5.66.53.92v.06l1.12-1.06.44-.47c-.18-.3-.4-.6-.67-.87-.62-.61-1.34-1-2.09-1.1a3.08 3.08 0 00-.55-.01z\"/><path d=\"M13.07.86a3.9 3.9 0 00-1.52.43c-1.24.62-2.26 1.69-3.26 2.69-.46.47-.94.94-1.39 1.43.15-.08.28-.18.43-.25a4.4 4.4 0 012.36-.46c.2.02.4.07.6.14.79-.77 1.55-1.46 2.16-1.76.38-.19.67-.25.93-.21.25.03.53.14.91.52.39.38.5.66.53.92.03.26-.02.55-.21.93-.39.76-1.32 1.74-2.32 2.74-1 1-1.98 1.93-2.74 2.31-.38.2-.67.25-.93.22-.25-.04-.53-.15-.91-.53-.39-.38-.5-.66-.53-.92V9c-.36.33-.73.67-1.12 1.06l-.43.46c.17.3.4.6.66.87.62.62 1.34 1 2.08 1.1.75.1 1.46-.1 2.08-.41 1.24-.62 2.26-1.69 3.26-2.69s2.07-2.02 2.68-3.26c.31-.62.5-1.32.41-2.07a3.63 3.63 0 00-1.1-2.08c-.61-.62-1.33-1-2.07-1.1a3.08 3.08 0 00-.56-.02z\"/></svg>",
	  ol: "<svg height=\"18\" width=\"18\"><path d=\"M1.5 7a.5.5 0 100 1h1a.5.5 0 01.5.5c0 .164-.08.31-.14.355l-1.655 1.25A.492.492 0 001 10.5a.5.5 0 00.5.5h2a.5.5 0 000-1H3l.398-.299A1.5 1.5 0 002.5 7z\"/><path d=\"M1.5 12c-.667 0-.667 1 0 1h1.25c.333 0 .333.5 0 .5H2.5c-.667 0-.667 1 0 1h.25c.333 0 .333.5 0 .5H1.5c-.667 0-.667 1 0 1h1c.398 0 .78-.131 1.06-.365.282-.235.44-.554.44-.885a1.121 1.121 0 00-.303-.75c.191-.204.3-.47.303-.75 0-.332-.158-.651-.44-.885-.3-.241-.675-.37-1.06-.365z\"/><rect y=\"13\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><rect ry=\"1\" width=\"12\" height=\"2\" x=\"6\" y=\"8\"/><rect y=\"3\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><path d=\"M1.5 2a.5.5 0 100 1H2v2h-.5a.5.5 0 100 1h2a.5.5 0 100-1H3V2.5c0-.277-.223-.5-.5-.5z\"/></svg>",
	  strikethrough: "<svg width=\"18\" height=\"18\"><path d=\"M10 2C6 2 4 4 4 6c0 .338.08.672.193 1h2.34C6.113 6.629 6 6.295 6 6c0-.334.117-.725.691-1.154C7.265 4.416 8.331 4 10 4h3a1 1 0 000-2zm1.477 9c.413.368.523.706.523 1 0 .334-.127.712-.701 1.143-.575.43-1.632.85-3.299.857l-1.006.007V14H5a1 1 0 000 2h3c4 0 6-2 6-4 0-.338-.081-.672-.195-1z\"/><rect ry=\"1\" y=\"8\" x=\"1\" height=\"2\" width=\"16\"/></svg>",
	  ul: "<svg height=\"18\" width=\"18\"><circle cx=\"2\" cy=\"9\" r=\"2\"/><circle cy=\"4\" cx=\"2\" r=\"2\"/><rect y=\"3\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><circle cx=\"2\" cy=\"14\" r=\"2\"/><rect ry=\"1\" width=\"12\" height=\"2\" x=\"6\" y=\"8\"/><rect y=\"13\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/></svg>"
	};

	var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
	var DefaultCommands = {
	  'bold': {
	    name: 'bold',
	    action: 'bold',
	    innerHTML: svg.bold,
	    title: 'Bold',
	    hotkey: 'Mod-B'
	  },
	  'italic': {
	    name: 'italic',
	    action: 'italic',
	    innerHTML: svg.italic,
	    title: 'Italic',
	    hotkey: 'Mod-I'
	  },
	  'strikethrough': {
	    name: 'strikethrough',
	    action: 'strikethrough',
	    innerHTML: svg.strikethrough,
	    title: 'Strikethrough',
	    hotkey: 'Mod2-Shift-5'
	  },
	  'code': {
	    name: 'code',
	    action: 'code',
	    innerHTML: svg.code,
	    title: 'Format as code'
	  },
	  'h1': {
	    name: 'h1',
	    action: 'h1',
	    innerHTML: svg.h1,
	    title: 'Level 1 heading',
	    hotkey: 'Mod-Shift-1'
	  },
	  'h2': {
	    name: 'h2',
	    action: 'h2',
	    innerHTML: svg.h2,
	    title: 'Level 2 heading',
	    hotkey: 'Mod-Shift-2'
	  },
	  'ul': {
	    name: 'ul',
	    action: 'ul',
	    innerHTML: svg.ul,
	    title: 'Bulleted list'
	  },
	  'ol': {
	    name: 'ol',
	    action: 'ol',
	    innerHTML: svg.ol,
	    title: 'Numbered list'
	  },
	  'blockquote': {
	    name: 'blockquote',
	    action: 'blockquote',
	    innerHTML: svg.blockquote,
	    title: 'Quote',
	    hotkey: 'Mod2-Shift-Q'
	  },
	  'insertLink': {
	    name: 'insertLink',
	    action: function action(editor) {
	      if (editor.isInlineFormattingAllowed()) editor.wrapSelection('[', ']()');
	    },
	    enabled: function enabled(editor, focus, anchor) {
	      return editor.isInlineFormattingAllowed(focus, anchor) ? false : null;
	    },
	    innerHTML: svg.link,
	    title: 'Insert link',
	    hotkey: 'Mod-K'
	  },
	  'insertImage': {
	    name: 'insertImage',
	    action: function action(editor) {
	      if (editor.isInlineFormattingAllowed()) editor.wrapSelection('![', ']()');
	    },
	    enabled: function enabled(editor, focus, anchor) {
	      return editor.isInlineFormattingAllowed(focus, anchor) ? false : null;
	    },
	    innerHTML: svg.image,
	    title: 'Insert image',
	    hotkey: 'Mod2-Shift-I'
	  },
	  'hr': {
	    name: 'hr',
	    action: function action(editor) {
	      return editor.paste('\n***\n');
	    },
	    enabled: function enabled() {
	      return false;
	    },
	    innerHTML: svg.hr,
	    title: 'Insert horizontal line',
	    hotkey: 'Mod2-Shift-L'
	  }
	};

	var CommandBar = /*#__PURE__*/function () {
	  function CommandBar(props) {
	    var _this = this;

	    _classCallCheck(this, CommandBar);

	    this.e = null;
	    this.editor = null;
	    this.commands = [];
	    this.buttons = {};
	    this.state = {};
	    this.hotkeys = [];
	    var element = props.element;

	    if (element && !element.tagName) {
	      element = document.getElementById(props.element);
	    }

	    if (!element) {
	      element = document.body;
	    }

	    this.createCommandBarElement(element, props.commands || ['bold', 'italic', 'strikethrough', '|', 'code', '|', 'h1', 'h2', '|', 'ul', 'ol', '|', 'blockquote', 'hr', '|', 'insertLink', 'insertImage']);
	    document.addEventListener('keydown', function (e) {
	      return _this.handleKeydown(e);
	    });
	    if (props.editor) this.setEditor(props.editor);
	  }

	  _createClass(CommandBar, [{
	    key: "createCommandBarElement",
	    value: function createCommandBarElement(parentElement, commands) {
	      var _this2 = this;

	      this.e = document.createElement('div');
	      this.e.className = 'TMCommandBar';

	      var _iterator = _createForOfIteratorHelper(commands),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var command = _step.value;

	          if (command == '|') {
	            var el = document.createElement('div');
	            el.className = 'TMCommandDivider';
	            this.e.appendChild(el);
	          } else {
	            var _ret = function () {
	              var commandName = void 0;

	              if (typeof command == "string") {
	                // Reference to default command
	                if (DefaultCommands[command]) {
	                  commandName = command;
	                  _this2.commands[commandName] = DefaultCommands[commandName];
	                } else {
	                  return "continue";
	                }
	              } else if (_typeof(command) == "object" && command.name) {
	                commandName = command.name;
	                _this2.commands[commandName] = {};
	                if (DefaultCommands[commandName]) Object.assign(_this2.commands[commandName], DefaultCommands[commandName]);
	                Object.assign(_this2.commands[commandName], command);
	              } else {
	                return "continue";
	              }

	              var title = _this2.commands[commandName].title || commandName;

	              if (_this2.commands[commandName].hotkey) {
	                var keys = _this2.commands[commandName].hotkey.split('-'); // construct modifiers


	                var modifiers = [];
	                var modifierexplanation = [];

	                for (var i = 0; i < keys.length - 1; i++) {
	                  switch (keys[i]) {
	                    case 'Ctrl':
	                      modifiers.push('ctrlKey');
	                      modifierexplanation.push('Ctrl');
	                      break;

	                    case 'Cmd':
	                      modifiers.push('metaKey');
	                      modifierexplanation.push('⌘');
	                      break;

	                    case 'Alt':
	                      modifiers.push('altKey');
	                      modifierexplanation.push('Alt');
	                      break;

	                    case 'Option':
	                      modifiers.push('altKey');
	                      modifierexplanation.push('⌥');
	                      break;

	                    case 'Win':
	                      modifiers.push('metaKey');
	                      modifierexplanation.push('⊞ Win');
	                      break;

	                    case 'Shift':
	                      modifiers.push('shiftKey');
	                      modifierexplanation.push('⇧');
	                      break;

	                    case 'Mod':
	                      // Mod is a convenience mechanism: Ctrl on Windows, Cmd on Mac
	                      if (isMacLike) {
	                        modifiers.push('metaKey');
	                        modifierexplanation.push('⌘');
	                      } else {
	                        modifiers.push('ctrlKey');
	                        modifierexplanation.push('Ctrl');
	                      }

	                      break;

	                    case 'Mod2':
	                      modifiers.push('altKey');
	                      if (isMacLike) modifierexplanation.push('⌥');else modifierexplanation.push('Alt');
	                      break;
	                    // Mod2 is a convenience mechanism: Alt on Windows, Option on Mac
	                  }
	                }

	                modifierexplanation.push(keys[keys.length - 1]);
	                var hotkey = {
	                  modifiers: modifiers,
	                  command: commandName
	                }; // TODO Right now this is working only for letters and numbers

	                if (keys[keys.length - 1].match(/^[0-9]$/)) {
	                  hotkey.code = "Digit".concat(keys[keys.length - 1]);
	                } else {
	                  hotkey.key = keys[keys.length - 1].toLowerCase();
	                }

	                _this2.hotkeys.push(hotkey);

	                title = title.concat(" (".concat(modifierexplanation.join('+'), ")"));
	              }

	              _this2.buttons[commandName] = document.createElement('div');
	              _this2.buttons[commandName].className = 'TMCommandButton TMCommandButton_Disabled';
	              _this2.buttons[commandName].title = title;
	              _this2.buttons[commandName].innerHTML = _this2.commands[commandName].innerHTML;

	              _this2.buttons[commandName].addEventListener('mousedown', function (e) {
	                return _this2.handleClick(commandName, e);
	              });

	              _this2.e.appendChild(_this2.buttons[commandName]);
	            }();

	            if (_ret === "continue") continue;
	          }
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      parentElement.appendChild(this.e);
	    }
	  }, {
	    key: "handleClick",
	    value: function handleClick(commandName, event) {
	      if (!this.editor) return;
	      event.preventDefault();

	      if (typeof this.commands[commandName].action == "string") {
	        if (this.state[commandName] === false) this.editor.setCommandState(commandName, true);else this.editor.setCommandState(commandName, false);
	      } else if (typeof this.commands[commandName].action == "function") {
	        this.commands[commandName].action(this.editor);
	      }
	    }
	  }, {
	    key: "setEditor",
	    value: function setEditor(editor) {
	      var _this3 = this;

	      this.editor = editor;
	      editor.addEventListener('selection', function (e) {
	        return _this3.handleSelection(e);
	      });
	    }
	  }, {
	    key: "handleSelection",
	    value: function handleSelection(event) {
	      if (event.commandState) {
	        for (var command in this.commands) {
	          if (event.commandState[command] === undefined) {
	            if (this.commands[command].enabled) this.state[command] = this.commands[command].enabled(this.editor, event.focus, event.anchor);else this.state[command] = event.focus ? false : null;
	          } else {
	            this.state[command] = event.commandState[command];
	          }

	          if (this.state[command] === true) {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Active';
	          } else if (this.state[command] === false) {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Inactive';
	          } else {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Disabled';
	          }
	        }
	      }
	    }
	  }, {
	    key: "handleKeydown",
	    value: function handleKeydown(event) {
	      var _iterator2 = _createForOfIteratorHelper(this.hotkeys),
	          _step2;

	      try {
	        outer: for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var hotkey = _step2.value;

	          if (hotkey.key && event.key.toLowerCase() == hotkey.key || hotkey.code && event.code == hotkey.code) {
	            // Key matches hotkey. Look for any required modifier that wasn't pressed
	            var _iterator3 = _createForOfIteratorHelper(hotkey.modifiers),
	                _step3;

	            try {
	              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	                var modifier = _step3.value;
	                if (!event[modifier]) continue outer;
	              } // Everything matches.

	            } catch (err) {
	              _iterator3.e(err);
	            } finally {
	              _iterator3.f();
	            }

	            this.handleClick(hotkey.command, event);
	            return;
	          }
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }
	    }
	  }]);

	  return CommandBar;
	}();

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties


	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);

	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var defineProperty$2 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty$2(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var $includes = arrayIncludes.includes;





	var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', {
	  ACCESSORS: true,
	  1: 0
	}); // `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !USES_TO_LENGTH
	}, {
	  includes: function includes(el
	  /* , fromIndex = 0 */
	  ) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('includes');

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('splice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var max$1 = Math.max;
	var min$3 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$3(max$1(toInteger(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  }

	  return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;

	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) {
	      /* empty */
	    }
	  }

	  return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes


	_export({
	  target: 'String',
	  proto: true,
	  forced: !correctIsRegexpLogic('includes')
	}, {
	  includes: function includes(searchString
	  /* , position = 0 */
	  ) {
	    return !!~String(requireObjectCoercible(this)).indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var max$2 = Math.max;
	var min$4 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // @@replace logic


	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [// `String.prototype.replace` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	  function (regexp, replaceValue) {
	    if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
	      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	      if (res.done) return res.value;
	    }

	    var rx = anObject(regexp);
	    var S = String(this);
	    var functionalReplace = typeof replaceValue === 'function';
	    if (!functionalReplace) replaceValue = String(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regexpExecAbstract(rx, S);
	      if (result === null) break;
	      results.push(result);
	      if (!global) break;
	      var matchStr = String(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = String(result[0]);
	      var position = max$2(min$4(toInteger(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = [matched].concat(captures, position, S);
	        if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	        var replacement = String(replaceValue.apply(undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + S.slice(nextSourcePosition);
	  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }

	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;

	      switch (ch.charAt(0)) {
	        case '$':
	          return '$';

	        case '&':
	          return matched;

	        case '`':
	          return str.slice(0, position);

	        case "'":
	          return str.slice(tailPos);

	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;

	        default:
	          // \d\d?
	          var n = +ch;
	          if (n === 0) return match;

	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }

	          capture = captures[n - 1];
	      }

	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var non = '\u200B\u0085\u180E'; // check that a method works with the correct list
	// of whitespaces and has a correct name

	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;

	 // `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringTrimForced('trim')
	}, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var FAILS_ON_PRIMITIVES = fails(function () {
	  objectKeys(1);
	}); // `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys

	_export({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  }

	  return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.

	/* eslint-disable no-proto */


	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	// makes subclassing work correct for wrapped built-ins


	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if ( // it can work only with native `setPrototypeOf`
	  objectSetPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  typeof (NewTarget = dummy.constructor) == 'function' && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var SPECIES$4 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
	    defineProperty(Constructor, SPECIES$4, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var defineProperty$3 = objectDefineProperty.f;

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;











	var setInternalState = internalState.set;





	var MATCH$2 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g; // "new" should create a new object, old webkit bug

	var CORRECT_NEW = new NativeRegExp(re1) !== re1;
	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
	var FORCED$1 = descriptors && isForced_1('RegExp', !CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
	  re2[MATCH$2] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})); // `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor

	if (FORCED$1) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$2) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
	    if (UNSUPPORTED_Y$2 && sticky) setInternalState(result, {
	      sticky: sticky
	    });
	    return result;
	  };

	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$3(RegExpWrapper, key, {
	      configurable: true,
	      get: function () {
	        return NativeRegExp[key];
	      },
	      set: function (it) {
	        NativeRegExp[key] = it;
	      }
	    });
	  };

	  var keys$1 = getOwnPropertyNames(NativeRegExp);
	  var index = 0;

	  while (keys$1.length > index) proxy(keys$1[index++]);

	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	} // https://tc39.github.io/ecma262/#sec-get-regexp-@@species


	setSpecies('RegExp');

	var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y; // `RegExp.prototype.flags` getter
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
	  objectDefineProperty.f(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regexpFlags
	  });
	}

	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var nativeToString = RegExpPrototype$1[TO_STRING];
	var NOT_GENERIC = fails(function () {
	  return nativeToString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	}); // FF44- RegExp#toString has a wrong name

	var INCORRECT_NAME = nativeToString.name != TO_STRING; // `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, {
	    unsafe: true
	  });
	}

	// const replacements = {
	//   ASCIIPunctuation: '!"#$%&\'()*+,\\-./:;<=>?@\\[\\]^_`{|}~',
	//   TriggerChars: '`_\*\[\]\(\)',
	//   Scheme: `[A-Za-z][A-Za-z0-9\+\.\-]{1,31}`,
	//   Email: `[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*`, // From CommonMark spec
	// }
	var replacements = {
	  ASCIIPunctuation: /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~\\]/,
	  NotTriggerChar: /[^`_*[\]()<>!~]/,
	  Scheme: /[A-Za-z][A-Za-z0-9+.-]{1,31}/,
	  Email: /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/,
	  // From CommonMark spec
	  HTMLOpenTag: /<HTMLTagName(?:HTMLAttribute)*\s*\/?>/,
	  HTMLCloseTag: /<\/HTMLTagName\s*>/,
	  HTMLTagName: /[A-Za-z][A-Za-z0-9-]*/,
	  HTMLComment: /<!--(?:[^>-]|(?:[^>-](?:[^-]|-[^-])*[^-]))-->/,
	  HTMLPI: /<\?(?:|.|(?:[^?]|\?[^>])*)\?>/,
	  HTMLDeclaration: /<![A-Z]+\s[^>]*>/,
	  HTMLCDATA: /<!\[CDATA\[.*?\]\]>/,
	  HTMLAttribute: /\s+[A-Za-z_:][A-Za-z0-9_.:-]*(?:HTMLAttValue)?/,
	  HTMLAttValue: /\s*=\s*(?:(?:'[^']*')|(?:"[^"]*")|(?:[^\s"'=<>`]+))/,
	  KnownTag: /address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul/
	}; // From CommonMark.js. 

	var punctuationLeading = new RegExp(/^(?:[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B])/);
	var punctuationTrailing = new RegExp(/(?:[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B])$/); // export const inlineTriggerChars = new RegExp(`[${replacements.TriggerChars}]`);

	/**
	 * This is CommonMark's block grammar, but we're ignoring nested blocks here.  
	 */

	var lineGrammar = {
	  TMH1: {
	    regexp: /^( {0,3}#\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH1">$1</span>$$2<span class="TMMark TMMark_TMH1">$3</span>'
	  },
	  TMH2: {
	    regexp: /^( {0,3}##\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH2">$1</span>$$2<span class="TMMark TMMark_TMH2">$3</span>'
	  },
	  TMH3: {
	    regexp: /^( {0,3}###\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH3">$1</span>$$2<span class="TMMark TMMark_TMH3">$3</span>'
	  },
	  TMH4: {
	    regexp: /^( {0,3}####\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH4">$1</span>$$2<span class="TMMark TMMark_TMH4">$3</span>'
	  },
	  TMH5: {
	    regexp: /^( {0,3}#####\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH5">$1</span>$$2<span class="TMMark TMMark_TMH5">$3</span>'
	  },
	  TMH6: {
	    regexp: /^( {0,3}######\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH6">$1</span>$$2<span class="TMMark TMMark_TMH6">$3</span>'
	  },
	  TMBlockquote: {
	    regexp: /^( {0,3}>[ ]?)(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMBlockquote">$1</span>$$2'
	  },
	  TMCodeFenceBacktickOpen: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(````*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)([\0-_a-\uFFFF]*?)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceBacktick">$1</span><span class="TMInfoString">$3</span>$4'
	  },
	  TMCodeFenceTildeOpen: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(~~~~*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)(.*?)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceTilde">$1</span><span class="TMInfoString">$3</span>$4'
	  },
	  TMCodeFenceBacktickClose: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(````*))([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceBacktick">$1</span>$3'
	  },
	  TMCodeFenceTildeClose: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(~~~~*))([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceTilde">$1</span>$3'
	  },
	  TMBlankLine: {
	    regexp: /^([ \t]*)$/,
	    replacement: '$0'
	  },
	  TMSetextH1Marker: {
	    regexp: /^ {0,3}=+\s*$/,
	    replacement: '<span class="TMMark TMMark_TMSetextH1Marker">$0</span>'
	  },
	  TMSetextH2Marker: {
	    regexp: /^ {0,3}-+\s*$/,
	    replacement: '<span class="TMMark TMMark_TMSetextH1Marker">$0</span>'
	  },
	  TMHR: {
	    regexp: /^( {0,3}(\*[ \t]*\*[ \t]*\*[ \t*]*)|(-[ \t]*-[ \t]*-[ \t-]*)|(_[ \t]*_[ \t]*_[ \t_]*))$/,
	    replacement: '<span class="TMMark TMMark_TMHR">$0</span>'
	  },
	  TMUL: {
	    regexp: /^( {0,3}[+*-] {1,4})(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMUL">$1</span>$$2'
	  },
	  TMOL: {
	    regexp: /^( {0,3}\d{1,9}[.)] {1,4})(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMOL">$1</span>$$2'
	  },
	  // TODO: This is currently preventing sublists (and any content within list items, really) from working
	  TMIndentedCode: {
	    regexp: /^( {4}|\t)(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMIndentedCode">$1</span>$2'
	  },
	  TMLinkReferenceDefinition: {
	    // TODO: Link destination can't include unbalanced parantheses, but we just ignore that here 
	    regexp: /^( {0,3}\[\s*)([^\s\]](?:[^\]]|\\\])*?)(\s*\]:\s*)((?:[^\s<>]+)|(?:<(?:[^<>\\]|\\.)*>))?(\s*)((?:\((?:[^()\\]|\\.)*\))|(?:"(?:[^"\\]|\\.)*")|(?:'(?:[^'\\]|\\.)*'))?(\s*)$/,
	    replacement: '<span class="TMMark TMMark_TMLinkReferenceDefinition">$1</span><span class="TMLinkLabel TMLinkLabel_Definition">$2</span><span class="TMMark TMMark_TMLinkReferenceDefinition">$3</span><span class="TMLinkDestination">$4</span>$5<span class="TMLinkTitle">$6</span>$7',
	    labelPlaceholder: 2 // this defines which placeholder in the above regex is the link "label"

	  }
	};
	/**
	 * HTML blocks have multiple different classes of opener and closer. This array defines all the cases
	 */

	var htmlBlockGrammar = [{
	  start: /^ {0,3}<(?:script|pre|style)(?:\s|>|$)/i,
	  end: /(?:<\/script>|<\/pre>|<\/style>)/i,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<!--/,
	  end: /-->/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<\?/,
	  end: /\?>/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<![A-Z]/,
	  end: />/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<!\[CDATA\[/,
	  end: /\]\]>/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}(?:<|<\/)(?:KnownTag)(?:\s|>|\/>|$)/i,
	  end: false,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}(?:HTMLOpenTag|HTMLCloseTag)\s*$/,
	  end: false,
	  paraInterrupt: false
	}];
	/**
	 * Structure of the object:
	 * Top level entries are rules, each consisting of a regular expressions (in string format) as well as a replacement.
	 * In the regular expressions, replacements from the object 'replacements' will be processed before compiling into the property regexp.
	 */

	var inlineGrammar = {
	  escape: {
	    regexp: /^\\(ASCIIPunctuation)/,
	    replacement: '<span class="TMMark TMMark_TMEscape">\\</span>$1'
	  },
	  code: {
	    regexp: /^(`+)((?:[^`])|(?:[^`].*?[^`]))(\1)/,
	    replacement: '<span class="TMMark TMMark_TMCode">$1</span><code class="TMCode">$2</code><span class="TMMark TMMark_TMCode">$3</span>'
	  },
	  autolink: {
	    regexp: /^<((?:Scheme:[^\s<>]*)|(?:Email))>/,
	    replacement: '<span class="TMMark TMMark_TMAutolink">&lt;</span><span class="TMAutolink">$1</span><span class="TMMark TMMark_TMAutolink">&gt;</span>'
	  },
	  html: {
	    regexp: /^((?:HTMLOpenTag)|(?:HTMLCloseTag)|(?:HTMLComment)|(?:HTMLPI)|(?:HTMLDeclaration)|(?:HTMLCDATA))/,
	    replacement: '<span class="TMHTML">$1</span>'
	  },
	  linkOpen: {
	    regexp: /^\[/,
	    replacement: ''
	  },
	  imageOpen: {
	    regexp: /^!\[/,
	    replacement: ''
	  },
	  linkLabel: {
	    regexp: /^(\[\s*)([^\]]*?)(\s*\])/,
	    replacement: '',
	    labelPlaceholder: 2
	  },
	  default: {
	    regexp: /^(.|(?:NotTriggerChar+))/,
	    replacement: '$1'
	  }
	}; // Process replacements in regexps

	var replacementRegexp = new RegExp(Object.keys(replacements).join('|')); // Inline

	var inlineRules = _toConsumableArray(Object.keys(inlineGrammar));

	var _iterator = _createForOfIteratorHelper(inlineRules),
	    _step;

	try {
	  for (_iterator.s(); !(_step = _iterator.n()).done;) {
	    var _rule = _step.value;
	    var _re = inlineGrammar[_rule].regexp.source; // Replace while there is something to replace. This means it also works over multiple levels (replacements containing replacements)

	    while (_re.match(replacementRegexp)) {
	      _re = _re.replace(replacementRegexp, function (string) {
	        return replacements[string].source;
	      });
	    }

	    inlineGrammar[_rule].regexp = new RegExp(_re, inlineGrammar[_rule].regexp.flags);
	  } // HTML Block (only opening rule is processed currently)

	} catch (err) {
	  _iterator.e(err);
	} finally {
	  _iterator.f();
	}

	for (var _i = 0, _htmlBlockGrammar = htmlBlockGrammar; _i < _htmlBlockGrammar.length; _i++) {
	  var rule = _htmlBlockGrammar[_i];
	  var re = rule.start.source; // Replace while there is something to replace. This means it also works over multiple levels (replacements containing replacements)

	  while (re.match(replacementRegexp)) {
	    re = re.replace(replacementRegexp, function (string) {
	      return replacements[string].source;
	    });
	  }

	  rule.start = new RegExp(re, rule.start.flags);
	}
	/**
	 * Escapes HTML special characters (<, >, and &) in the string.
	 * @param {string} string The raw string to be escaped
	 * @returns {string} The string, ready to be used in HTML
	 */


	function htmlescape(string) {
	  return (string ? string : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	/**
	 * Contains the commands that can be sent to the editor. Contains objects with a name representing the name of the command.
	 * Each of the objects contains the following keys:
	 * 
	 *   - type: Can be either inline (for inline formatting) or line (for block / line formatting).
	 *   - className: Used to determine whether the command is active at a given position. 
	 *     For line formatting, this looks at the class of the line element. For inline elements, tries to find an enclosing element with that class.
	 *   - set / unset: Contain instructions how to set and unset the command. For line type commands, both consist of a pattern and replacement that 
	 *     will be applied to each line (using String.replace). For inline type commands, the set object contains a pre and post string which will
	 *     be inserted before and after the selection. The unset object contains a prePattern and a postPattern. Both should be regular expressions and 
	 *     they will be applied to the portion of the line before and after the selection (using String.replace, with an empty replacement string).
	 */


	var commands = {
	  // Replacements for unset for inline commands are '' by default
	  bold: {
	    type: 'inline',
	    className: 'TMStrong',
	    set: {
	      pre: '**',
	      post: '**'
	    },
	    unset: {
	      prePattern: /(?:\*\*|__)$/,
	      postPattern: /^(?:\*\*|__)/
	    }
	  },
	  italic: {
	    type: 'inline',
	    className: 'TMEm',
	    set: {
	      pre: '*',
	      post: '*'
	    },
	    unset: {
	      prePattern: /(?:\*|_)$/,
	      postPattern: /^(?:\*|_)/
	    }
	  },
	  code: {
	    type: 'inline',
	    className: 'TMCode',
	    set: {
	      pre: '`',
	      post: '`'
	    },
	    unset: {
	      prePattern: /`+$/,
	      postPattern: /^`+/
	    } // FIXME this doesn't ensure balanced backticks right now

	  },
	  strikethrough: {
	    type: 'inline',
	    className: 'TMStrikethrough',
	    set: {
	      pre: '~~',
	      post: '~~'
	    },
	    unset: {
	      prePattern: /~~$/,
	      postPattern: /^~~/
	    }
	  },
	  h1: {
	    type: 'line',
	    className: 'TMH1',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '# $2'
	    },
	    unset: {
	      pattern: /^( {0,3}#\s+)(.*?)((?:\s+#+\s*)?)$/,
	      replacement: '$2'
	    }
	  },
	  h2: {
	    type: 'line',
	    className: 'TMH2',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '## $2'
	    },
	    unset: {
	      pattern: /^( {0,3}##\s+)(.*?)((?:\s+#+\s*)?)$/,
	      replacement: '$2'
	    }
	  },
	  ul: {
	    type: 'line',
	    className: 'TMUL',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '- $2'
	    },
	    unset: {
	      pattern: /^( {0,3}[+*-] {1,4})(.*)$/,
	      replacement: '$2'
	    }
	  },
	  ol: {
	    type: 'line',
	    className: 'TMOL',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '$#. $2'
	    },
	    unset: {
	      pattern: /^( {0,3}\d{1,9}[.)] {1,4})(.*)$/,
	      replacement: '$2'
	    }
	  },
	  blockquote: {
	    type: 'line',
	    className: 'TMBlockquote',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '> $2'
	    },
	    unset: {
	      pattern: /^( {0,3}>[ ]?)(.*)$/,
	      replacement: '$2'
	    }
	  }
	};

	var Editor = /*#__PURE__*/function () {
	  function Editor() {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Editor);

	    this.e = null;
	    this.textarea = null;
	    this.lines = [];
	    this.lineElements = [];
	    this.lineTypes = [];
	    this.lineCaptures = [];
	    this.lineReplacements = [];
	    this.linkLabels = [];
	    this.lineDirty = [];
	    this.lastCommandState = null;
	    this.listeners = {
	      change: [],
	      selection: []
	    };
	    var element = props.element;
	    this.textarea = props.textarea;

	    if (this.textarea && !this.textarea.tagName) {
	      this.textarea = document.getElementById(this.textarea);
	      if (!element) element = this.textarea;
	    }

	    if (element && !element.tagName) {
	      element = document.getElementById(props.element);
	    }

	    if (!element) {
	      element = document.getElementsByTagName('body')[0];
	    }

	    if (element.tagName == 'TEXTAREA') {
	      this.textarea = element;
	      element = this.textarea.parentNode;
	    }

	    if (this.textarea) {
	      this.textarea.style.display = 'none';
	    }

	    this.createEditorElement(element); // TODO Placeholder for empty content

	    this.setContent(props.content || (this.textarea ? this.textarea.value : false) || '# Hello TinyMDE!\nEdit **here**');
	  }
	  /**
	   * Creates the editor element inside the target element of the DOM tree
	   * @param element The target element of the DOM tree
	   */


	  _createClass(Editor, [{
	    key: "createEditorElement",
	    value: function createEditorElement(element) {
	      var _this = this;

	      this.e = document.createElement('div');
	      this.e.className = 'TinyMDE';
	      this.e.contentEditable = true; // The following is important for formatting purposes, but also since otherwise the browser replaces subsequent spaces with  &nbsp; &nbsp;
	      // That breaks a lot of stuff, so we do this here and not in CSS—therefore, you don't have to remember to but this in the CSS file

	      this.e.style.whiteSpace = 'pre-wrap'; // Avoid formatting (B / I / U) popping up on iOS

	      this.e.style.webkitUserModify = 'read-write-plaintext-only';

	      if (this.textarea && this.textarea.parentNode == element && this.textarea.nextSibling) {
	        element.insertBefore(this.e, this.textarea.nextSibling);
	      } else {
	        element.appendChild(this.e);
	      }

	      this.e.addEventListener("input", function (e) {
	        return _this.handleInputEvent(e);
	      }); // this.e.addEventListener("keydown", (e) => this.handleKeydownEvent(e));

	      document.addEventListener("selectionchange", function (e) {
	        return _this.handleSelectionChangeEvent(e);
	      });
	      this.e.addEventListener("paste", function (e) {
	        return _this.handlePaste(e);
	      }); // this.e.addEventListener('keydown', (e) => this.handleKeyDown(e));

	      this.lineElements = this.e.childNodes; // this will automatically update
	    }
	    /**
	     * Sets the editor content.
	     * @param {string} content The new Markdown content
	     */

	  }, {
	    key: "setContent",
	    value: function setContent(content) {
	      // Delete any existing content
	      while (this.e.firstChild) {
	        this.e.removeChild(this.e.firstChild);
	      }

	      this.lines = content.split(/(?:\r\n|\r|\n)/);
	      this.lineDirty = [];

	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        var le = document.createElement('div');
	        this.e.appendChild(le);
	        this.lineDirty.push(true);
	      }

	      this.lineTypes = new Array(this.lines.length);
	      this.updateFormatting();
	      this.fireChange();
	    }
	    /**
	     * Gets the editor content as a Markdown string.
	     * @returns {string} The editor content as a markdown string
	     */

	  }, {
	    key: "getContent",
	    value: function getContent() {
	      return this.lines.join('\n');
	    }
	    /**
	     * This is the main method to update the formatting (from this.lines to HTML output)
	     */

	  }, {
	    key: "updateFormatting",
	    value: function updateFormatting() {
	      // First, parse line types. This will update this.lineTypes, this.lineReplacements, and this.lineCaptures
	      // We don't apply the formatting yet
	      this.updateLineTypes(); // Collect any valid link labels from link reference definitions—we need that for formatting to determine what's a valid link

	      this.updateLinkLabels(); // Now, apply the formatting

	      this.applyLineTypes();
	    }
	    /**
	     * Updates this.linkLabels: For every link reference definition (line type TMLinkReferenceDefinition), we collect the label
	     */

	  }, {
	    key: "updateLinkLabels",
	    value: function updateLinkLabels() {
	      this.linkLabels = [];

	      for (var l = 0; l < this.lines.length; l++) {
	        if (this.lineTypes[l] == 'TMLinkReferenceDefinition') {
	          this.linkLabels.push(this.lineCaptures[l][lineGrammar.TMLinkReferenceDefinition.labelPlaceholder]);
	        }
	      }
	    }
	    /**
	     * Helper function to replace placeholders from a RegExp capture. The replacement string can contain regular dollar placeholders (e.g., $1),
	     * which are interpreted like in String.replace(), but also double dollar placeholders ($$1). In the case of double dollar placeholders, 
	     * Markdown inline grammar is applied on the content of the captured subgroup, i.e., $$1 processes inline Markdown grammar in the content of the
	     * first captured subgroup, and replaces `$$1` with the result.
	     * 
	     * @param {string} replacement The replacement string, including placeholders.
	     * @param  capture The result of a RegExp.exec() call
	     * @returns The replacement string, with placeholders replaced from the capture result.
	     */

	  }, {
	    key: "replace",
	    value: function replace(replacement, capture) {
	      var _this2 = this;

	      return replacement.replace(/\$\$([0-9])/g, function (str, p1) {
	        return "<span class=\"TMInlineFormatted\">".concat(_this2.processInlineStyles(capture[p1]), "</span>");
	      }).replace(/\$([0-9])/g, function (str, p1) {
	        return htmlescape(capture[p1]);
	      });
	    }
	    /**
	     * Applies the line types (from this.lineTypes as well as the capture result in this.lineReplacements and this.lineCaptures) 
	     * and processes inline formatting for all lines.
	     */

	  }, {
	    key: "applyLineTypes",
	    value: function applyLineTypes() {
	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        if (this.lineDirty[lineNum]) {
	          var contentHTML = this.replace(this.lineReplacements[lineNum], this.lineCaptures[lineNum]); // this.lineHTML[lineNum] = (contentHTML == '' ? '<br />' : contentHTML); // Prevent empty elements which can't be selected etc.

	          this.lineElements[lineNum].className = this.lineTypes[lineNum];
	          this.lineElements[lineNum].removeAttribute('style');
	          this.lineElements[lineNum].innerHTML = contentHTML == '' ? '<br />' : contentHTML; // Prevent empty elements which can't be selected etc.
	        }

	        this.lineElements[lineNum].dataset.lineNum = lineNum;
	      }
	    }
	    /**
	     * Determines line types for all lines based on the line / block grammar. Captures the results of the respective line
	     * grammar regular expressions.
	     * Updates this.lineTypes, this.lineCaptures, and this.lineReplacements.
	     */

	  }, {
	    key: "updateLineTypes",
	    value: function updateLineTypes() {
	      var codeBlockType = false;
	      var codeBlockSeqLength = 0;
	      var htmlBlock = false;

	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        var lineType = 'TMPara';
	        var lineCapture = [this.lines[lineNum]];
	        var lineReplacement = '$$0'; // Default replacement for paragraph: Inline format the entire line
	        // Check ongoing code blocks
	        // if (lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMCodeFenceBacktickOpen' || this.lineTypes[lineNum - 1] == 'TMFencedCodeBacktick')) {

	        if (codeBlockType == 'TMCodeFenceBacktickOpen') {
	          // We're in a backtick-fenced code block, check if the current line closes it
	          var capture = lineGrammar.TMCodeFenceBacktickClose.regexp.exec(this.lines[lineNum]);

	          if (capture && capture.groups['seq'].length >= codeBlockSeqLength) {
	            lineType = 'TMCodeFenceBacktickClose';
	            lineReplacement = lineGrammar.TMCodeFenceBacktickClose.replacement;
	            lineCapture = capture;
	            codeBlockType = false;
	          } else {
	            lineType = 'TMFencedCodeBacktick';
	            lineReplacement = '$0';
	            lineCapture = [this.lines[lineNum]];
	          }
	        } // if (lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMCodeFenceTildeOpen' || this.lineTypes[lineNum - 1] == 'TMFencedCodeTilde')) {
	        else if (codeBlockType == 'TMCodeFenceTildeOpen') {
	            // We're in a tilde-fenced code block
	            var _capture = lineGrammar.TMCodeFenceTildeClose.regexp.exec(this.lines[lineNum]);

	            if (_capture && _capture.groups['seq'].length >= codeBlockSeqLength) {
	              lineType = 'TMCodeFenceTildeClose';
	              lineReplacement = lineGrammar.TMCodeFenceTildeClose.replacement;
	              lineCapture = _capture;
	              codeBlockType = false;
	            } else {
	              lineType = 'TMFencedCodeTilde';
	              lineReplacement = '$0';
	              lineCapture = [this.lines[lineNum]];
	            }
	          } // Check HTML block types


	        if (lineType == 'TMPara' && htmlBlock === false) {
	          var _iterator = _createForOfIteratorHelper(htmlBlockGrammar),
	              _step;

	          try {
	            for (_iterator.s(); !(_step = _iterator.n()).done;) {
	              var htmlBlockType = _step.value;

	              if (this.lines[lineNum].match(htmlBlockType.start)) {
	                // Matching start condition. Check if this tag can start here (not all start conditions allow breaking a paragraph).
	                if (htmlBlockType.paraInterrupt || lineNum == 0 || !(this.lineTypes[lineNum - 1] == 'TMPara' || this.lineTypes[lineNum - 1] == 'TMUL' || this.lineTypes[lineNum - 1] == 'TMOL' || this.lineTypes[lineNum - 1] == 'TMBlockquote')) {
	                  htmlBlock = htmlBlockType;
	                  break;
	                }
	              }
	            }
	          } catch (err) {
	            _iterator.e(err);
	          } finally {
	            _iterator.f();
	          }
	        }

	        if (htmlBlock !== false) {
	          lineType = 'TMHTMLBlock';
	          lineReplacement = '$0'; // No formatting in TMHTMLBlock

	          lineCapture = [this.lines[lineNum]]; // This should already be set but better safe than sorry
	          // Check if HTML block should be closed

	          if (htmlBlock.end) {
	            // Specific end condition
	            if (this.lines[lineNum].match(htmlBlock.end)) {
	              htmlBlock = false;
	            }
	          } else {
	            // No specific end condition, ends with blank line
	            if (lineNum == this.lines.length - 1 || this.lines[lineNum + 1].match(lineGrammar.TMBlankLine.regexp)) {
	              htmlBlock = false;
	            }
	          }
	        } // Check all regexps if we haven't applied one of the code block types


	        if (lineType == 'TMPara') {
	          for (var type in lineGrammar) {
	            if (lineGrammar[type].regexp) {
	              var _capture2 = lineGrammar[type].regexp.exec(this.lines[lineNum]);

	              if (_capture2) {
	                lineType = type;
	                lineReplacement = lineGrammar[type].replacement;
	                lineCapture = _capture2;
	                break;
	              }
	            }
	          }
	        } // If we've opened a code block, remember that


	        if (lineType == 'TMCodeFenceBacktickOpen' || lineType == 'TMCodeFenceTildeOpen') {
	          codeBlockType = lineType;
	          codeBlockSeqLength = lineCapture.groups['seq'].length;
	        } // Link reference definition and indented code can't interrupt a paragraph


	        if ((lineType == 'TMIndentedCode' || lineType == 'TMLinkReferenceDefinition') && lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMPara' || this.lineTypes[lineNum - 1] == 'TMUL' || this.lineTypes[lineNum - 1] == 'TMOL' || this.lineTypes[lineNum - 1] == 'TMBlockquote')) {
	          // Fall back to TMPara
	          lineType = 'TMPara';
	          lineCapture = [this.lines[lineNum]];
	          lineReplacement = '$$0';
	        } // Setext H2 markers that can also be interpreted as an empty list item should be regarded as such (as per CommonMark spec)


	        if (lineType == 'TMSetextH2Marker') {
	          var _capture3 = lineGrammar.TMUL.regexp.exec(this.lines[lineNum]);

	          if (_capture3) {
	            lineType = 'TMUL';
	            lineReplacement = lineGrammar.TMUL.replacement;
	            lineCapture = _capture3;
	          }
	        } // Setext headings are only valid if preceded by a paragraph (and if so, they change the type of the previous paragraph)


	        if (lineType == 'TMSetextH1Marker' || lineType == 'TMSetextH2Marker') {
	          if (lineNum == 0 || this.lineTypes[lineNum - 1] != 'TMPara') {
	            // Setext marker is invalid. However, a H2 marker might still be a valid HR, so let's check that
	            var _capture4 = lineGrammar.TMHR.regexp.exec(this.lines[lineNum]);

	            if (_capture4) {
	              // Valid HR
	              lineType = 'TMHR';
	              lineCapture = _capture4;
	              lineReplacement = lineGrammar.TMHR.replacement;
	            } else {
	              // Not valid HR, format as TMPara
	              lineType = 'TMPara';
	              lineCapture = [this.lines[lineNum]];
	              lineReplacement = '$$0';
	            }
	          } else {
	            // Valid setext marker. Change types of preceding para lines
	            var headingLine = lineNum - 1;
	            var headingLineType = lineType == 'TMSetextH1Marker' ? 'TMSetextH1' : 'TMSetextH2';

	            do {
	              if (this.lineTypes[headingLineType] != headingLineType) {
	                this.lineTypes[headingLine] = headingLineType;
	                this.lineDirty[headingLineType] = true;
	              }

	              this.lineReplacements[headingLine] = '$$0';
	              this.lineCaptures[headingLine] = [this.lines[headingLine]];
	              headingLine--;
	            } while (headingLine >= 0 && this.lineTypes[headingLine] == 'TMPara');
	          }
	        } // Lastly, save the line style to be applied later


	        if (this.lineTypes[lineNum] != lineType) {
	          this.lineTypes[lineNum] = lineType;
	          this.lineDirty[lineNum] = true;
	        }

	        this.lineReplacements[lineNum] = lineReplacement;
	        this.lineCaptures[lineNum] = lineCapture;
	      }
	    }
	    /**
	     * Updates all line contents from the HTML, then re-applies formatting.
	     */

	  }, {
	    key: "updateLineContentsAndFormatting",
	    value: function updateLineContentsAndFormatting() {
	      this.clearDirtyFlag();
	      this.updateLineContents();
	      this.updateFormatting();
	    }
	    /**
	     * Attempts to parse a link or image at the current position. This assumes that the opening [ or ![ has already been matched. 
	     * Returns false if this is not a valid link, image. See below for more information
	     * @param {string} originalString The original string, starting at the opening marker ([ or ![)
	     * @param {boolean} isImage Whether or not this is an image (opener == ![)
	     * @returns false if not a valid link / image. 
	     * Otherwise returns an object with two properties: output is the string to be included in the processed output, 
	     * charCount is the number of input characters (from originalString) consumed.
	     */

	  }, {
	    key: "parseLinkOrImage",
	    value: function parseLinkOrImage(originalString, isImage) {
	      // Skip the opening bracket
	      var textOffset = isImage ? 2 : 1;
	      var opener = originalString.substr(0, textOffset);
	      var type = isImage ? 'TMImage' : 'TMLink';
	      var currentOffset = textOffset;
	      var bracketLevel = 1;
	      var linkText = false;
	      var linkRef = false;
	      var linkLabel = [];
	      var linkDetails = []; // If matched, this will be an array: [whitespace + link destination delimiter, link destination, link destination delimiter, whitespace, link title delimiter, link title, link title delimiter + whitespace]. All can be empty strings.

	      textOuter: while (currentOffset < originalString.length && linkText === false
	      /* empty string is okay */
	      ) {
	        var string = originalString.substr(currentOffset); // Capture any escapes and code blocks at current position, they bind more strongly than links
	        // We don't have to actually process them here, that'll be done later in case the link / image is valid, but we need to skip over them.

	        for (var _i = 0, _arr = ['escape', 'code', 'autolink', 'html']; _i < _arr.length; _i++) {
	          var rule = _arr[_i];
	          var cap = inlineGrammar[rule].regexp.exec(string);

	          if (cap) {
	            currentOffset += cap[0].length;
	            continue textOuter;
	          }
	        } // Check for image. It's okay for an image to be included in a link or image


	        if (string.match(inlineGrammar.imageOpen.regexp)) {
	          // Opening image. It's okay if this is a matching pair of brackets
	          bracketLevel++;
	          currentOffset += 2;
	          continue textOuter;
	        } // Check for link (not an image because that would have been captured and skipped over above)


	        if (string.match(inlineGrammar.linkOpen.regexp)) {
	          // Opening bracket. Two things to do:
	          // 1) it's okay if this part of a pair of brackets.
	          // 2) If we are currently trying to parse a link, this nested bracket musn't start a valid link (no nested links allowed)
	          bracketLevel++; // if (bracketLevel >= 2) return false; // Nested unescaped brackets, this doesn't qualify as a link / image

	          if (!isImage) {
	            if (this.parseLinkOrImage(string, false)) {
	              // Valid link inside this possible link, which makes this link invalid (inner links beat outer ones)
	              return false;
	            }
	          }

	          currentOffset += 1;
	          continue textOuter;
	        } // Check for closing bracket


	        if (string.match(/^\]/)) {
	          bracketLevel--;

	          if (bracketLevel == 0) {
	            // Found matching bracket and haven't found anything disqualifying this as link / image.
	            linkText = originalString.substr(textOffset, currentOffset - textOffset);
	            currentOffset++;
	            continue textOuter;
	          }
	        } // Nothing matches, proceed to next char


	        currentOffset++;
	      } // Did we find a link text (i.e., find a matching closing bracket?)


	      if (linkText === false) return false; // Nope
	      // So far, so good. We've got a valid link text. Let's see what type of link this is

	      var nextChar = currentOffset < originalString.length ? originalString.substr(currentOffset, 1) : ''; // REFERENCE LINKS

	      if (nextChar == '[') {
	        var _string = originalString.substr(currentOffset);

	        var _cap = inlineGrammar.linkLabel.regexp.exec(_string);

	        if (_cap) {
	          // Valid link label
	          currentOffset += _cap[0].length;
	          linkLabel.push(_cap[1], _cap[2], _cap[3]);

	          if (_cap[inlineGrammar.linkLabel.labelPlaceholder]) {
	            // Full reference link
	            linkRef = _cap[inlineGrammar.linkLabel.labelPlaceholder];
	          } else {
	            // Collapsed reference link
	            linkRef = linkText.trim();
	          }
	        } else {
	          // Not a valid link label
	          return false;
	        }
	      } else if (nextChar != '(') {
	        // Shortcut ref link
	        linkRef = linkText.trim(); // INLINE LINKS
	      } else {
	        // nextChar == '('
	        // Potential inline link
	        currentOffset++;
	        var parenthesisLevel = 1;

	        inlineOuter: while (currentOffset < originalString.length && parenthesisLevel > 0) {
	          var _string2 = originalString.substr(currentOffset); // Process whitespace


	          var _cap2 = /^\s+/.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Opening whitespace

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Open destination, but not a destination yet; desination opened with <

	              case 2:
	                // Open destination with content in it. Whitespace only allowed if opened by angle bracket, otherwise this closes the destination
	                if (linkDetails[0].match(/</)) {
	                  linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                } else {
	                  if (parenthesisLevel != 1) return false; // Unbalanced parenthesis

	                  linkDetails.push(''); // Empty end delimiter for destination

	                  linkDetails.push(_cap2[0]); // Whitespace in between destination and title
	                }

	                break;

	              case 3:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Whitespace between destination and title

	              case 4:
	                return false;
	              // This should never happen (no opener for title yet, but more whitespace to capture)

	              case 5:
	                linkDetails.push('');
	              // Whitespace at beginning of title, push empty title and continue

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Whitespace in title

	              case 7:
	                linkDetails[6] = linkDetails[6].concat(_cap2[0]);
	                break;
	              // Whitespace after closing delimiter

	              default:
	                return false;
	              // We should never get here
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          } // Process backslash escapes


	          _cap2 = inlineGrammar.escape.regexp.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // This opens the link destination, append it

	              case 2:
	                linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                break;
	              // Part of the link destination

	              case 3:
	                return false;
	              // Lacking opening delimiter for link title

	              case 4:
	                return false;
	              // Lcaking opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // This opens the link title

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Part of the link title

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          } // Process opening angle bracket as deilimiter of destination


	          if (linkDetails.length < 2 && _string2.match(/^</)) {
	            if (linkDetails.length == 0) linkDetails.push('');
	            linkDetails[0] = linkDetails[0].concat('<');
	            currentOffset++;
	            continue inlineOuter;
	          } // Process closing angle bracket as delimiter of destination


	          if ((linkDetails.length == 1 || linkDetails.length == 2) && _string2.match(/^>/)) {
	            if (linkDetails.length == 1) linkDetails.push(''); // Empty link destination

	            linkDetails.push('>');
	            currentOffset++;
	            continue inlineOuter;
	          } // Process  non-parenthesis delimiter for title. 


	          _cap2 = /^["']/.exec(_string2); // For this to be a valid opener, we have to either have no destination, only whitespace so far,
	          // or a destination with trailing whitespace.

	          if (_cap2 && (linkDetails.length == 0 || linkDetails.length == 1 || linkDetails.length == 4)) {
	            while (linkDetails.length < 4) {
	              linkDetails.push('');
	            }

	            linkDetails.push(_cap2[0]);
	            currentOffset++;
	            continue inlineOuter;
	          } // For this to be a valid closer, we have to have an opener and some or no title, and this has to match the opener


	          if (_cap2 && (linkDetails.length == 5 || linkDetails.length == 6) && linkDetails[4] == _cap2[0]) {
	            if (linkDetails.length == 5) linkDetails.push(''); // Empty link title

	            linkDetails.push(_cap2[0]);
	            currentOffset++;
	            continue inlineOuter;
	          } // Other cases (linkDetails.length == 2, 3, 7) will be handled with the "default" case below.
	          // Process opening parenthesis


	          if (_string2.match(/^\(/)) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push('');
	              // This opens the link destination

	              case 2:
	                // Part of the link destination
	                linkDetails[1] = linkDetails[1].concat('(');
	                if (!linkDetails[0].match(/<$/)) parenthesisLevel++;
	                break;

	              case 3:
	                linkDetails.push('');
	              //  opening delimiter for link title

	              case 4:
	                linkDetails.push('(');
	                break;
	              // opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // opens the link title, add empty title content and proceed to next case 

	              case 6:
	                // Part of the link title. Un-escaped parenthesis only allowed in " or ' delimited title
	                if (linkDetails[4] == '(') return false;
	                linkDetails[5] = linkDetails[5].concat('(');
	                break;

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset++;
	            continue inlineOuter;
	          } // Process closing parenthesis


	          if (_string2.match(/^\)/)) {
	            if (linkDetails.length <= 2) {
	              // We are inside the link destination. Parentheses have to be matched if not in angle brackets
	              while (linkDetails.length < 2) {
	                linkDetails.push('');
	              }

	              if (!linkDetails[0].match(/<$/)) parenthesisLevel--;

	              if (parenthesisLevel > 0) {
	                linkDetails[1] = linkDetails[1].concat(')');
	              }
	            } else if (linkDetails.length == 5 || linkDetails.length == 6) {
	              // We are inside the link title. 
	              if (linkDetails[4] == '(') {
	                // This closes the link title
	                if (linkDetails.length == 5) linkDetails.push('');
	                linkDetails.push(')');
	              } else {
	                // Just regular ol' content
	                if (linkDetails.length == 5) linkDetails.push(')');else linkDetails[5] = linkDetails[5].concat(')');
	              }
	            } else {
	              parenthesisLevel--; // This should decrease it from 1 to 0...
	            }

	            if (parenthesisLevel == 0) {
	              // No invalid condition, let's make sure the linkDetails array is complete
	              while (linkDetails.length < 7) {
	                linkDetails.push('');
	              }
	            }

	            currentOffset++;
	            continue inlineOuter;
	          } // Any old character


	          _cap2 = /^./.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // This opens the link destination, append it

	              case 2:
	                linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                break;
	              // Part of the link destination

	              case 3:
	                return false;
	              // Lacking opening delimiter for link title

	              case 4:
	                return false;
	              // Lcaking opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // This opens the link title

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Part of the link title

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          }

	          throw "Infinite loop"; // we should never get here since the last test matches any character
	        }

	        if (parenthesisLevel > 0) return false; // Parenthes(es) not closed
	      }

	      if (linkRef !== false) {
	        // Ref link; check that linkRef is valid
	        var valid = false;

	        var _iterator2 = _createForOfIteratorHelper(this.linkLabels),
	            _step2;

	        try {
	          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	            var _label = _step2.value;

	            if (_label == linkRef) {
	              valid = true;
	              break;
	            }
	          }
	        } catch (err) {
	          _iterator2.e(err);
	        } finally {
	          _iterator2.f();
	        }

	        var label = valid ? "TMLinkLabel TMLinkLabel_Valid" : "TMLinkLabel TMLinkLabel_Invalid";
	        var output = "<span class=\"TMMark TMMark_".concat(type, "\">").concat(opener, "</span><span class=\"").concat(type, " ").concat(linkLabel.length < 3 || !linkLabel[1] ? label : "", "\">").concat(this.processInlineStyles(linkText), "</span><span class=\"TMMark TMMark_").concat(type, "\">]</span>");

	        if (linkLabel.length >= 3) {
	          output = output.concat("<span class=\"TMMark TMMark_".concat(type, "\">").concat(linkLabel[0], "</span>"), "<span class=\"".concat(label, "\">").concat(linkLabel[1], "</span>"), "<span class=\"TMMark TMMark_".concat(type, "\">").concat(linkLabel[2], "</span>"));
	        }

	        return {
	          output: output,
	          charCount: currentOffset
	        };
	      } else if (linkDetails) {
	        // Inline link
	        // This should never happen, but better safe than sorry.
	        while (linkDetails.length < 7) {
	          linkDetails.push('');
	        }

	        return {
	          output: "<span class=\"TMMark TMMark_".concat(type, "\">").concat(opener, "</span><span class=\"").concat(type, "\">").concat(this.processInlineStyles(linkText), "</span><span class=\"TMMark TMMark_").concat(type, "\">](").concat(linkDetails[0], "</span><span class=\"").concat(type, "Destination\">").concat(linkDetails[1], "</span><span class=\"TMMark TMMark_").concat(type, "\">").concat(linkDetails[2]).concat(linkDetails[3]).concat(linkDetails[4], "</span><span class=\"").concat(type, "Title\">").concat(linkDetails[5], "</span><span class=\"TMMark TMMark_").concat(type, "\">").concat(linkDetails[6], ")</span>"),
	          charCount: currentOffset
	        };
	      }

	      return false;
	    }
	    /**
	     * Formats a markdown string as HTML, using Markdown inline formatting.
	     * @param {string} originalString The input (markdown inline formatted) string
	     * @returns {string} The HTML formatted output
	     */

	  }, {
	    key: "processInlineStyles",
	    value: function processInlineStyles(originalString) {
	      var _this3 = this;

	      var processed = '';
	      var stack = []; // Stack is an array of objects of the format: {delimiter, delimString, count, output}

	      var offset = 0;
	      var string = originalString;

	      var _loop = function _loop() {
	        var _loop2 = function _loop2() {
	          var rule = _arr2[_i2];
	          var cap = inlineGrammar[rule].regexp.exec(string);

	          if (cap) {
	            string = string.substr(cap[0].length);
	            offset += cap[0].length;
	            processed += inlineGrammar[rule].replacement // .replace(/\$\$([1-9])/g, (str, p1) => processInlineStyles(cap[p1])) // todo recursive calling
	            .replace(/\$([1-9])/g, function (str, p1) {
	              return htmlescape(cap[p1]);
	            });
	            return {
	              v: "continue|outer"
	            };
	          }
	        };

	        // Process simple rules (non-delimiter)
	        for (var _i2 = 0, _arr2 = ['escape', 'code', 'autolink', 'html']; _i2 < _arr2.length; _i2++) {
	          var _ret2 = _loop2();

	          if (_typeof(_ret2) === "object") return _ret2.v;
	        } // Check for links / images


	        var potentialLink = string.match(inlineGrammar.linkOpen.regexp);
	        var potentialImage = string.match(inlineGrammar.imageOpen.regexp);

	        if (potentialImage || potentialLink) {
	          var result = _this3.parseLinkOrImage(string, potentialImage);

	          if (result) {
	            processed = "".concat(processed).concat(result.output);
	            string = string.substr(result.charCount);
	            offset += result.charCount;
	            return "continue|outer";
	          }
	        } // Check for em / strong delimiters


	        var cap = /(^\*+)|(^_+)/.exec(string);

	        if (cap) {
	          var delimCount = cap[0].length;
	          var delimString = cap[0];
	          var currentDelimiter = cap[0][0]; // This should be * or _

	          string = string.substr(cap[0].length); // We have a delimiter run. Let's check if it can open or close an emphasis.

	          var preceding = offset > 0 ? originalString.substr(0, offset) : ' '; // beginning and end of line count as whitespace

	          var following = offset + cap[0].length < originalString.length ? string : ' ';
	          var punctuationFollows = following.match(punctuationLeading);
	          var punctuationPrecedes = preceding.match(punctuationTrailing);
	          var whitespaceFollows = following.match(/^\s/);
	          var whitespacePrecedes = preceding.match(/\s$/); // These are the rules for right-flanking and left-flanking delimiter runs as per CommonMark spec

	          var canOpen = !whitespaceFollows && (!punctuationFollows || !!whitespacePrecedes || !!punctuationPrecedes);
	          var canClose = !whitespacePrecedes && (!punctuationPrecedes || !!whitespaceFollows || !!punctuationFollows); // Underscores have more detailed rules than just being part of left- or right-flanking run:

	          if (currentDelimiter == '_' && canOpen && canClose) {
	            canOpen = punctuationPrecedes;
	            canClose = punctuationFollows;
	          } // If the delimiter can close, check the stack if there's something it can close


	          if (canClose) {
	            var stackPointer = stack.length - 1; // See if we can find a matching opening delimiter, move down through the stack

	            while (delimCount && stackPointer >= 0) {
	              if (stack[stackPointer].delimiter == currentDelimiter) {
	                // We found a matching delimiter, let's construct the formatted string
	                // Firstly, if we skipped any stack levels, pop them immediately (non-matching delimiters)
	                while (stackPointer < stack.length - 1) {
	                  var _entry = stack.pop();

	                  processed = "".concat(_entry.output).concat(_entry.delimString.substr(0, _entry.count)).concat(processed);
	                } // Then, format the string


	                if (delimCount >= 2 && stack[stackPointer].count >= 2) {
	                  // Strong
	                  processed = "<span class=\"TMMark\">".concat(currentDelimiter).concat(currentDelimiter, "</span><strong class=\"TMStrong\">").concat(processed, "</strong><span class=\"TMMark\">").concat(currentDelimiter).concat(currentDelimiter, "</span>");
	                  delimCount -= 2;
	                  stack[stackPointer].count -= 2;
	                } else {
	                  // Em
	                  processed = "<span class=\"TMMark\">".concat(currentDelimiter, "</span><em class=\"TMEm\">").concat(processed, "</em><span class=\"TMMark\">").concat(currentDelimiter, "</span>");
	                  delimCount -= 1;
	                  stack[stackPointer].count -= 1;
	                } // If that stack level is empty now, pop it


	                if (stack[stackPointer].count == 0) {
	                  var _entry2 = stack.pop();

	                  processed = "".concat(_entry2.output).concat(processed);
	                  stackPointer--;
	                }
	              } else {
	                // This stack level's delimiter type doesn't match the current delimiter type
	                // Go down one level in the stack
	                stackPointer--;
	              }
	            }
	          } // If there are still delimiters left, and the delimiter run can open, push it on the stack


	          if (delimCount && canOpen) {
	            stack.push({
	              delimiter: currentDelimiter,
	              delimString: delimString,
	              count: delimCount,
	              output: processed
	            });
	            processed = ''; // Current formatted output has been pushed on the stack and will be prepended when the stack gets popped

	            delimCount = 0;
	          } // Any delimiters that are left (closing unmatched) are appended to the output.


	          if (delimCount) {
	            processed = "".concat(processed).concat(delimString.substr(0, delimCount));
	          }

	          offset += cap[0].length;
	          return "continue|outer";
	        } // Check for strikethrough delimiter


	        cap = /^~~/.exec(string);

	        if (cap) {
	          var consumed = false;

	          var _stackPointer = stack.length - 1; // See if we can find a matching opening delimiter, move down through the stack


	          while (!consumed && _stackPointer >= 0) {
	            if (stack[_stackPointer].delimiter == '~') {
	              // We found a matching delimiter, let's construct the formatted string
	              // Firstly, if we skipped any stack levels, pop them immediately (non-matching delimiters)
	              while (_stackPointer < stack.length - 1) {
	                var _entry4 = stack.pop();

	                processed = "".concat(_entry4.output).concat(_entry4.delimString.substr(0, _entry4.count)).concat(processed);
	              } // Then, format the string


	              processed = "<span class=\"TMMark\">~~</span><del class=\"TMStrikethrough\">".concat(processed, "</del><span class=\"TMMark\">~~</span>");

	              var _entry3 = stack.pop();

	              processed = "".concat(_entry3.output).concat(processed);
	              consumed = true;
	            } else {
	              // This stack level's delimiter type doesn't match the current delimiter type
	              // Go down one level in the stack
	              _stackPointer--;
	            }
	          } // If there are still delimiters left, and the delimiter run can open, push it on the stack


	          if (!consumed) {
	            stack.push({
	              delimiter: '~',
	              delimString: '~~',
	              count: 2,
	              output: processed
	            });
	            processed = ''; // Current formatted output has been pushed on the stack and will be prepended when the stack gets popped
	          }

	          offset += cap[0].length;
	          string = string.substr(cap[0].length);
	          return "continue|outer";
	        } // Process 'default' rule


	        cap = inlineGrammar.default.regexp.exec(string);

	        if (cap) {
	          string = string.substr(cap[0].length);
	          offset += cap[0].length;
	          processed += inlineGrammar.default.replacement.replace(/\$([1-9])/g, function (str, p1) {
	            return htmlescape(cap[p1]);
	          });
	          return "continue|outer";
	        }

	        throw 'Infinite loop!';
	      };

	      outer: while (string) {
	        var _ret = _loop();

	        if (_ret === "continue|outer") continue outer;
	      } // Empty the stack, any opening delimiters are unused


	      while (stack.length) {
	        var entry = stack.pop();
	        processed = "".concat(entry.output).concat(entry.delimString.substr(0, entry.count)).concat(processed);
	      }

	      return processed;
	    }
	    /** 
	     * Clears the line dirty flag (resets it to an array of false)
	     */

	  }, {
	    key: "clearDirtyFlag",
	    value: function clearDirtyFlag() {
	      this.lineDirty = new Array(this.lines.length);

	      for (var i = 0; i < this.lineDirty.length; i++) {
	        this.lineDirty[i] = false;
	      }
	    }
	    /**
	     * Updates the class properties (lines, lineElements) from the DOM.
	     * @returns true if contents changed
	     */

	  }, {
	    key: "updateLineContents",
	    value: function updateLineContents() {
	      // this.lineDirty = []; 
	      // Check if we have changed anything about the number of lines (inserted or deleted a paragraph)
	      // < 0 means line(s) removed; > 0 means line(s) added
	      var lineDelta = this.e.childElementCount - this.lines.length;

	      if (lineDelta) {
	        // yup. Let's try how much we can salvage (find out which lines from beginning and end were unchanged)
	        // Find lines from the beginning that haven't changed...
	        var firstChangedLine = 0;

	        while (firstChangedLine <= this.lines.length && firstChangedLine <= this.lineElements.length && this.lineElements[firstChangedLine] // Check that the line element hasn't been deleted
	        && this.lines[firstChangedLine] == this.lineElements[firstChangedLine].textContent) {
	          firstChangedLine++;
	        } // End also from the end


	        var lastChangedLine = -1;

	        while (-lastChangedLine < this.lines.length && -lastChangedLine < this.lineElements.length && this.lines[this.lines.length + lastChangedLine] == this.lineElements[this.lineElements.length + lastChangedLine].textContent) {
	          lastChangedLine--;
	        }

	        var linesToDelete = this.lines.length + lastChangedLine + 1 - firstChangedLine;
	        if (linesToDelete < -lineDelta) linesToDelete = -lineDelta;
	        if (linesToDelete < 0) linesToDelete = 0;
	        var linesToAdd = [];

	        for (var l = 0; l < linesToDelete + lineDelta; l++) {
	          linesToAdd.push(this.lineElements[firstChangedLine + l].textContent);
	        }

	        this.spliceLines(firstChangedLine, linesToDelete, linesToAdd, false);
	      } else {
	        // No lines added or removed
	        for (var line = 0; line < this.lineElements.length; line++) {
	          var e = this.lineElements[line];
	          var ct = e.textContent;

	          if (this.lines[line] !== ct) {
	            // Line changed, update it
	            this.lines[line] = ct;
	            this.lineDirty[line] = true;
	          }
	        }
	      }
	    }
	    /**
	     * Processes a new paragraph.
	     * @param sel The current selection
	     */

	  }, {
	    key: "processNewParagraph",
	    value: function processNewParagraph(sel) {
	      if (!sel) return; // Update lines from content

	      this.updateLineContents();
	      var continuableType = false; // Let's see if we need to continue a list

	      var checkLine = sel.col > 0 ? sel.row : sel.row - 1;

	      switch (this.lineTypes[checkLine]) {
	        case 'TMUL':
	          continuableType = 'TMUL';
	          break;

	        case 'TMOL':
	          continuableType = 'TMOL';
	          break;

	        case 'TMIndentedCode':
	          continuableType = 'TMIndentedCode';
	          break;
	      }

	      var lines = this.lines[sel.row].replace(/\n\n$/, '\n').split(/(?:\r\n|\n|\r)/);

	      if (lines.length == 1) {
	        // No new line
	        this.updateFormatting();
	        return;
	      }

	      this.spliceLines(sel.row, 1, lines, true);
	      sel.row++;
	      sel.col = 0;

	      if (continuableType) {
	        // Check if the previous line was non-empty
	        var capture = lineGrammar[continuableType].regexp.exec(this.lines[sel.row - 1]);

	        if (capture) {
	          // Convention: capture[1] is the line type marker, capture[2] is the content
	          if (capture[2]) {
	            // Previous line has content, continue the continuable type
	            // Hack for OL: increment number
	            if (continuableType == 'TMOL') {
	              capture[1] = capture[1].replace(/\d{1,9}/, function (result) {
	                return parseInt(result[0]) + 1;
	              });
	            }

	            this.lines[sel.row] = "".concat(capture[1]).concat(this.lines[sel.row]);
	            this.lineDirty[sel.row] = true;
	            sel.col = capture[1].length;
	          } else {
	            // Previous line has no content, remove the continuable type from the previous row
	            this.lines[sel.row - 1] = '';
	            this.lineDirty[sel.row - 1] = true;
	          }
	        }
	      }

	      this.updateFormatting();
	    } // /**
	    //  * Processes a "delete" input action.
	    //  * @param {object} focus The selection
	    //  * @param {boolean} forward If true, performs a forward delete, otherwise performs a backward delete
	    //  */
	    // processDelete(focus, forward) {
	    //   if (!focus) return;
	    //   let anchor = this.getSelection(true);
	    //   // Do we have a non-empty selection? 
	    //   if (focus.col != anchor.col || focus.row != anchor.row) {
	    //     // non-empty. direction doesn't matter.
	    //     this.paste('', anchor, focus);
	    //   } else {
	    //     if (forward) {
	    //       if (focus.col < this.lines[focus.row].length) this.paste('', {row: focus.row, col: focus.col + 1}, focus);
	    //       else if (focus.col < this.lines.length) this.paste('', {row: focus.row + 1, col: 0}, focus);
	    //       // Otherwise, we're at the very end and can't delete forward
	    //     } else {
	    //       if (focus.col > 0) this.paste('', {row: focus.row, col: focus.col - 1}, focus);
	    //       else if (focus.row > 0) this.paste('', {row: focus.row - 1, col: this.lines[focus.row - 1].length - 1}, focus);
	    //       // Otherwise, we're at the very beginning and can't delete backwards
	    //     }
	    //   }
	    // }

	    /**
	     * Gets the current position of the selection counted by row and column of the editor Markdown content (as opposed to the position in the DOM).
	     * 
	     * @param {boolean} getAnchor if set to true, gets the selection anchor (start point of the selection), otherwise gets the focus (end point).
	     * @return {object} An object representing the selection, with properties col and row.
	     */

	  }, {
	    key: "getSelection",
	    value: function getSelection() {
	      var getAnchor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      var selection = window.getSelection();
	      var startNode = getAnchor ? selection.anchorNode : selection.focusNode;
	      if (!startNode) return null;
	      var offset = startNode.nodeType === Node.TEXT_NODE ? getAnchor ? selection.anchorOffset : selection.focusOffset : 0;

	      if (startNode == this.e) {
	        return {
	          row: 0,
	          col: offset
	        };
	      }

	      var col = this.computeColumn(startNode, offset);
	      if (col === null) return null; // We are outside of the editor
	      // Find the row node

	      var node = startNode;

	      while (node.parentElement != this.e) {
	        node = node.parentElement;
	      }

	      var row = 0; // Check if we can read a line number from the data-line-num attribute.
	      // The last condition is a security measure since inserting a new paragraph copies the previous rows' line number

	      if (node.dataset && node.dataset.lineNum && (!node.previousSibling || node.previousSibling.dataset.lineNum != node.dataset.lineNum)) {
	        row = parseInt(node.dataset.lineNum);
	      } else {
	        while (node.previousSibling) {
	          row++;
	          node = node.previousSibling;
	        }
	      }

	      return {
	        row: row,
	        col: col,
	        node: startNode
	      };
	    }
	    /**
	     * Computes a column within an editor line from a node and offset within that node.
	     * @param {Node} startNode The node
	     * @param {int} offset THe selection
	     * @returns {int} the column, or null if the node is not inside the editor
	     */

	  }, {
	    key: "computeColumn",
	    value: function computeColumn(startNode, offset) {
	      var node = startNode;
	      var col = offset; // First, make sure we're actually in the editor.

	      while (node && node.parentNode != this.e) {
	        node = node.parentNode;
	      }

	      if (node == null) return null;
	      node = startNode;

	      while (node.parentNode != this.e) {
	        if (node.previousSibling) {
	          node = node.previousSibling;
	          col += node.textContent.length;
	        } else {
	          node = node.parentNode;
	        }
	      }

	      return col;
	    }
	    /**
	     * Computes DOM node and offset within that node from a position expressed as row and column.
	     * @param {int} row Row (line number)
	     * @param {int} col Column
	     * @returns An object with two properties: node and offset. offset may be null;
	     */

	  }, {
	    key: "computeNodeAndOffset",
	    value: function computeNodeAndOffset(row, col) {
	      var bindRight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      if (row >= this.lineElements.length) {
	        // Selection past the end of text, set selection to end of text
	        row = this.lineElements.length - 1;
	        col = this.lines[row].length;
	      }

	      if (col > this.lines[row].length) {
	        col = this.lines[row].length;
	      }

	      var parentNode = this.lineElements[row];
	      var node = parentNode.firstChild;
	      var childrenComplete = false; // default return value

	      var rv = {
	        node: parentNode.firstChild ? parentNode.firstChild : parentNode,
	        offset: 0
	      };

	      while (node != parentNode) {
	        if (!childrenComplete && node.nodeType === Node.TEXT_NODE) {
	          if (node.nodeValue.length >= col) {
	            if (bindRight && node.nodeValue.length == col) {
	              // Selection is at the end of this text node, but we are binding right (prefer an offset of 0 in the next text node)
	              // Remember return value in case we don't find another text node
	              rv = {
	                node: node,
	                offset: col
	              };
	              col = 0;
	            } else {
	              return {
	                node: node,
	                offset: col
	              };
	            }
	          } else {
	            col -= node.nodeValue.length;
	          }
	        }

	        if (!childrenComplete && node.firstChild) {
	          node = node.firstChild;
	        } else if (node.nextSibling) {
	          childrenComplete = false;
	          node = node.nextSibling;
	        } else {
	          childrenComplete = true;
	          node = node.parentNode;
	        }
	      } // Either, the position was invalid and we just return the default return value
	      // Or we are binding right and the selection is at the end of the line


	      return rv;
	    }
	    /**
	     * Sets the selection based on rows and columns within the editor Markdown content.
	     * @param {object} focus Object representing the selection, needs to have properties row and col.
	     */

	  }, {
	    key: "setSelection",
	    value: function setSelection(focus) {
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      if (!focus) return;
	      var range = document.createRange();

	      var _this$computeNodeAndO = this.computeNodeAndOffset(focus.row, focus.col, anchor && anchor.row == focus.row && anchor.col > focus.col),
	          focusNode = _this$computeNodeAndO.node,
	          focusOffset = _this$computeNodeAndO.offset; // Bind selection right if anchor is in the same row and behind the focus


	      var anchorNode = null,
	          anchorOffset = null;

	      if (anchor && (anchor.row != focus.row || anchor.col != focus.col)) {
	        var _this$computeNodeAndO2 = this.computeNodeAndOffset(anchor.row, anchor.col, focus.row == anchor.row && focus.col > anchor.col),
	            node = _this$computeNodeAndO2.node,
	            offset = _this$computeNodeAndO2.offset;

	        anchorNode = node;
	        anchorOffset = offset;
	      }

	      if (anchorNode) range.setStart(anchorNode, anchorOffset);else range.setStart(focusNode, focusOffset);
	      range.setEnd(focusNode, focusOffset);
	      var windowSelection = window.getSelection();
	      windowSelection.removeAllRanges();
	      windowSelection.addRange(range);
	    }
	    /** 
	     * Event handler for input events 
	     */

	  }, {
	    key: "handleInputEvent",
	    value: function handleInputEvent(event) {
	      var focus = this.getSelection();

	      if ((event.inputType == 'insertParagraph' || event.inputType == 'insertLineBreak') && focus) {
	        this.clearDirtyFlag();
	        this.processNewParagraph(focus);
	      } else {
	        if (!this.e.firstChild) {
	          this.e.innerHTML = '<div class="TMBlankLine"><br></div>';
	        } else {
	          for (var childNode = this.e.firstChild; childNode; childNode = childNode.nextSibling) {
	            if (childNode.nodeType != 3 || childNode.tagName != 'DIV') {
	              // Found a child node that's either not an element or not a div. Wrap it in a div.
	              var divWrapper = document.createElement('div');
	              this.e.insertBefore(divWrapper, childNode);
	              this.e.removeChild(childNode);
	              divWrapper.appendChild(childNode);
	            }
	          }
	        }

	        this.updateLineContentsAndFormatting();
	      }

	      if (focus) this.setSelection(focus);
	      this.fireChange();
	    }
	    /**
	     * Event handler for "selectionchange" events.
	     */

	  }, {
	    key: "handleSelectionChangeEvent",
	    value: function handleSelectionChangeEvent() {
	      this.fireSelection();
	    }
	    /**
	     * Convenience function to "splice" new lines into the arrays this.lines, this.lineDirty, this.lineTypes, and the DOM elements 
	     * underneath the editor element.
	     * This method is essentially Array.splice, only that the third parameter takes an un-spread array (and the forth parameter)
	     * determines whether the DOM should also be adjusted.
	     * 
	     * @param {int} startLine Position at which to start changing the array of lines
	     * @param {int} linesToDelete Number of lines to delete
	     * @param {array} linesToInsert Array of strings representing the lines to be inserted
	     * @param {boolean} adjustLineElements If true, then <div> elements are also inserted in the DOM at the respective position
	     */

	  }, {
	    key: "spliceLines",
	    value: function spliceLines(startLine) {
	      var _this$lines, _this$lineTypes, _this$lineDirty;

	      var linesToDelete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var linesToInsert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	      var adjustLineElements = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	      if (adjustLineElements) {
	        for (var i = 0; i < linesToDelete; i++) {
	          this.e.removeChild(this.e.childNodes[startLine]);
	        }
	      }

	      var insertedBlank = [];
	      var insertedDirty = [];

	      for (var _i3 = 0; _i3 < linesToInsert.length; _i3++) {
	        insertedBlank.push('');
	        insertedDirty.push(true);

	        if (adjustLineElements) {
	          if (this.e.childNodes[startLine]) this.e.insertBefore(document.createElement('div'), this.e.childNodes[startLine]);else this.e.appendChild(document.createElement('div'));
	        }
	      }

	      (_this$lines = this.lines).splice.apply(_this$lines, [startLine, linesToDelete].concat(_toConsumableArray(linesToInsert)));

	      (_this$lineTypes = this.lineTypes).splice.apply(_this$lineTypes, [startLine, linesToDelete].concat(insertedBlank));

	      (_this$lineDirty = this.lineDirty).splice.apply(_this$lineDirty, [startLine, linesToDelete].concat(insertedDirty));
	    }
	    /**
	     * Event handler for the "paste" event
	     */

	  }, {
	    key: "handlePaste",
	    value: function handlePaste(event) {
	      event.preventDefault(); // get text representation of clipboard

	      var text = (event.originalEvent || event).clipboardData.getData('text/plain'); // insert text manually

	      this.paste(text);
	    }
	    /**
	     * Pastes the text at the current selection (or at the end, if no current selection)
	     * @param {string} text 
	     */

	  }, {
	    key: "paste",
	    value: function paste(text) {
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      if (!anchor) anchor = this.getSelection(true);
	      if (!focus) focus = this.getSelection(false);
	      var beginning, end;

	      if (!focus) {
	        focus = {
	          row: this.lines.length - 1,
	          col: this.lines[this.lines.length - 1].length
	        }; // Insert at end
	      }

	      if (!anchor) {
	        anchor = focus;
	      }

	      if (anchor.row < focus.row || anchor.row == focus.row && anchor.col <= focus.col) {
	        beginning = anchor;
	        end = focus;
	      } else {
	        beginning = focus;
	        end = anchor;
	      }

	      var insertedLines = text.split(/(?:\r\n|\r|\n)/);
	      var lineBefore = this.lines[beginning.row].substr(0, beginning.col);
	      var lineEnd = this.lines[end.row].substr(end.col);
	      insertedLines[0] = lineBefore.concat(insertedLines[0]);
	      var endColPos = insertedLines[insertedLines.length - 1].length;
	      insertedLines[insertedLines.length - 1] = insertedLines[insertedLines.length - 1].concat(lineEnd);
	      this.spliceLines(beginning.row, 1 + end.row - beginning.row, insertedLines);
	      focus.row = beginning.row + insertedLines.length - 1;
	      focus.col = endColPos;
	      this.updateFormatting();
	      this.setSelection(focus);
	      this.fireChange();
	    }
	    /**
	     * Computes the (lowest in the DOM tree) common ancestor of two DOM nodes.
	     * @param {Node} node1 the first node
	     * @param {Node} node2 the second node
	     * @returns {Node} The commen ancestor node, or null if there is no common ancestor
	     */

	  }, {
	    key: "computeCommonAncestor",
	    value: function computeCommonAncestor(node1, node2) {
	      if (!node1 || !node2) return null;
	      if (node1 == node2) return node1;

	      var ancestry = function ancestry(node) {
	        var ancestry = [];

	        while (node) {
	          ancestry.unshift(node);
	          node = node.parentNode;
	        }

	        return ancestry;
	      };

	      var ancestry1 = ancestry(node1);
	      var ancestry2 = ancestry(node2);
	      if (ancestry1[0] != ancestry2[0]) return null;
	      var i;

	      for (i = 0; ancestry1[i] == ancestry2[i]; i++) {
	      }

	      return ancestry1[i - 1];
	    }
	    /**
	     * Finds the (lowest in the DOM tree) enclosing DOM node with a given class.
	     * @param {object} focus The focus selection object
	     * @param {object} anchor The anchor selection object
	     * @param {string} className The class name to find
	     * @returns {Node} The enclosing DOM node with the respective class (inside the editor), if there is one; null otherwise.
	     */

	  }, {
	    key: "computeEnclosingMarkupNode",
	    value: function computeEnclosingMarkupNode(focus, anchor, className) {
	      var node = null;
	      if (!focus) return null;

	      if (!anchor) {
	        node = focus.node;
	      } else {
	        if (focus.row != anchor.row) return null;
	        node = this.computeCommonAncestor(focus.node, anchor.node);
	      }

	      if (!node) return null;

	      while (node != this.e) {
	        if (node.className && node.className.includes(className)) return node;
	        node = node.parentNode;
	      } // Ascended all the way to the editor element


	      return null;
	    }
	    /**
	     * Returns the state (true / false) of all commands.
	     * @param focus Focus of the selection. If not given, assumes the current focus.
	     */

	  }, {
	    key: "getCommandState",
	    value: function getCommandState() {
	      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      var commandState = {};
	      if (!focus) focus = this.getSelection(false);
	      if (!anchor) anchor = this.getSelection(true);

	      if (!focus) {
	        for (var cmd in commands) {
	          commandState[cmd] = null;
	        }

	        return commandState;
	      }

	      if (!anchor) anchor = focus;
	      var start, end;

	      if (anchor.row < focus.row || anchor.row == focus.row && anchor.col < focus.col) {
	        start = anchor;
	        end = focus;
	      } else {
	        start = focus;
	        end = anchor;
	      }

	      if (end.row > start.row && end.col == 0) {
	        end.row--;
	        end.col = this.lines[end.row].length; // Selection to beginning of next line is said to end at the beginning of the last line
	      }

	      for (var _cmd in commands) {
	        if (commands[_cmd].type == 'inline') {
	          if (!focus || focus.row != anchor.row || !this.isInlineFormattingAllowed(focus, anchor)) {
	            commandState[_cmd] = null;
	          } else {
	            // The command state is true if there is a respective enclosing markup node (e.g., the selection is enclosed in a <b>..</b>) ... 
	            commandState[_cmd] = !!this.computeEnclosingMarkupNode(focus, anchor, commands[_cmd].className) || // ... or if it's an empty string preceded by and followed by formatting markers, e.g. **|** where | is the cursor
	            focus.col == anchor.col && !!this.lines[focus.row].substr(0, focus.col).match(commands[_cmd].unset.prePattern) && !!this.lines[focus.row].substr(focus.col).match(commands[_cmd].unset.postPattern);
	          }
	        }

	        if (commands[_cmd].type == 'line') {
	          if (!focus) {
	            commandState[_cmd] = null;
	          } else {
	            var state = this.lineTypes[start.row] == commands[_cmd].className;

	            for (var line = start.row; line <= end.row; line++) {
	              if (this.lineTypes[line] == commands[_cmd].className != state) {
	                state = null;
	                break;
	              }
	            }

	            commandState[_cmd] = state;
	          }
	        }
	      }

	      return commandState;
	    }
	    /**
	     * Sets a command state
	     * @param {string} command 
	     * @param {boolean} state 
	     */

	  }, {
	    key: "setCommandState",
	    value: function setCommandState(command, state) {
	      if (commands[command].type == 'inline') {
	        var anchor = this.getSelection(true);
	        var focus = this.getSelection(false);
	        if (!anchor) anchor = focus;
	        if (!anchor) return;
	        if (anchor.row != focus.row) return;
	        if (!this.isInlineFormattingAllowed(focus, anchor)) return;
	        var markupNode = this.computeEnclosingMarkupNode(focus, anchor, commands[command].className);
	        this.clearDirtyFlag(); // First case: There's an enclosing markup node, remove the markers around that markup node

	        if (markupNode) {
	          this.lineDirty[focus.row] = true;
	          var startCol = this.computeColumn(markupNode, 0);
	          var len = markupNode.textContent.length;
	          var left = this.lines[focus.row].substr(0, startCol).replace(commands[command].unset.prePattern, '');
	          var mid = this.lines[focus.row].substr(startCol, len);
	          var right = this.lines[focus.row].substr(startCol + len).replace(commands[command].unset.postPattern, '');
	          this.lines[focus.row] = left.concat(mid, right);
	          anchor.col = left.length;
	          focus.col = anchor.col + len;
	          this.updateFormatting();
	          this.setSelection(focus, anchor); // Second case: Empty selection with surrounding formatting markers, remove those
	        } else if (focus.col == anchor.col && !!this.lines[focus.row].substr(0, focus.col).match(commands[command].unset.prePattern) && !!this.lines[focus.row].substr(focus.col).match(commands[command].unset.postPattern)) {
	          this.lineDirty[focus.row] = true;

	          var _left = this.lines[focus.row].substr(0, focus.col).replace(commands[command].unset.prePattern, '');

	          var _right = this.lines[focus.row].substr(focus.col).replace(commands[command].unset.postPattern, '');

	          this.lines[focus.row] = _left.concat(_right);
	          focus.col = anchor.col = _left.length;
	          this.updateFormatting();
	          this.setSelection(focus, anchor); // Not currently formatted, insert formatting markers
	        } else {
	          // Trim any spaces from the selection
	          var _ref = focus.col < anchor.col ? {
	            startCol: focus.col,
	            endCol: anchor.col
	          } : {
	            startCol: anchor.col,
	            endCol: focus.col
	          },
	              _startCol = _ref.startCol,
	              endCol = _ref.endCol;

	          var match = this.lines[focus.row].substr(_startCol, endCol - _startCol).match( /*#__PURE__*/_wrapRegExp(/^([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*).*[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	            leading: 1,
	            trailing: 2
	          }));

	          if (match) {
	            _startCol += match.groups.leading.length;
	            endCol -= match.groups.trailing.length;
	          }

	          focus.col = _startCol;
	          anchor.col = endCol; // Just insert markup before and after and hope for the best. 

	          this.wrapSelection(commands[command].set.pre, commands[command].set.post, focus, anchor); // TODO clean this up so that markup remains properly nested
	        }
	      } else if (commands[command].type == 'line') {
	        var _anchor = this.getSelection(true);

	        var _focus = this.getSelection(false);

	        if (!_anchor) _anchor = _focus;
	        if (!_focus) return;
	        this.clearDirtyFlag();
	        var start = _anchor.row > _focus.row ? _focus : _anchor;
	        var end = _anchor.row > _focus.row ? _anchor : _focus;

	        if (end.row > start.row && end.col == 0) {
	          end.row--;
	        }

	        for (var line = start.row; line <= end.row; line++) {
	          if (state && this.lineTypes[line] != commands[command].className) {
	            this.lines[line] = this.lines[line].replace(commands[command].set.pattern, commands[command].set.replacement.replace('$#', line - start.row + 1));
	            this.lineDirty[line] = true;
	          }

	          if (!state && this.lineTypes[line] == commands[command].className) {
	            this.lines[line] = this.lines[line].replace(commands[command].unset.pattern, commands[command].unset.replacement);
	            this.lineDirty[line] = true;
	          }
	        }

	        this.updateFormatting();
	        this.setSelection({
	          row: end.row,
	          col: this.lines[end.row].length
	        }, {
	          row: start.row,
	          col: 0
	        });
	      }
	    }
	    /**
	     * Returns whether or not inline formatting is allowed at the current focus 
	     * @param {object} focus The current focus
	     */

	  }, {
	    key: "isInlineFormattingAllowed",
	    value: function isInlineFormattingAllowed() {
	      // TODO Remove parameters from all calls
	      var sel = window.getSelection();
	      if (!sel) return false; // Check if we can find a common ancestor with the class `TMInlineFormatted` 
	      // Special case: Empty selection right before `TMInlineFormatted`

	      if (sel.isCollapsed && sel.focusNode.nodeType == 3 && sel.focusOffset == sel.focusNode.nodeValue.length) {
	        var node;

	        for (node = sel.focusNode; node && node.nextSibling == null; node = node.parentNode) {
	        }

	        if (node && node.nextSibling.className && node.nextSibling.className.includes('TMInlineFormatted')) return true;
	      } // Look for a common ancestor


	      var ancestor = this.computeCommonAncestor(sel.focusNode, sel.anchorNode);
	      if (!ancestor) return false; // Check if there's an ancestor of class 'TMInlineFormatted' or 'TMBlankLine'

	      while (ancestor && ancestor != this.e) {
	        if (ancestor.className && (ancestor.className.includes('TMInlineFormatted') || ancestor.className.includes('TMBlankLine'))) return true;
	        ancestor = ancestor.parentNode;
	      }

	      return false;
	    }
	    /**
	     * Wraps the current selection in the strings pre and post. If the selection is not on one line, returns.
	     * @param {string} pre The string to insert before the selection.
	     * @param {string} post The string to insert after the selection.
	     * @param {object} focus The current selection focus. If null, selection will be computed.
	     * @param {object} anchor The current selection focus. If null, selection will be computed.
	     */

	  }, {
	    key: "wrapSelection",
	    value: function wrapSelection(pre, post) {
	      var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      var anchor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	      if (!focus) focus = this.getSelection(false);
	      if (!anchor) anchor = this.getSelection(true);
	      if (!focus || !anchor || focus.row != anchor.row) return;
	      this.lineDirty[focus.row] = true;
	      var startCol = focus.col < anchor.col ? focus.col : anchor.col;
	      var endCol = focus.col < anchor.col ? anchor.col : focus.col;
	      var left = this.lines[focus.row].substr(0, startCol).concat(pre);
	      var mid = endCol == startCol ? '' : this.lines[focus.row].substr(startCol, endCol - startCol);
	      var right = post.concat(this.lines[focus.row].substr(endCol));
	      this.lines[focus.row] = left.concat(mid, right);
	      anchor.col = left.length;
	      focus.col = anchor.col + mid.length;
	      this.updateFormatting();
	      this.setSelection(focus, anchor);
	    }
	    /**
	     * Toggles the command state for a command (true <-> false)
	     * @param {string} command The editor command
	     */

	  }, {
	    key: "toggleCommandState",
	    value: function toggleCommandState(command) {
	      if (!this.lastCommandState) this.lastCommandState = this.getCommandState();
	      this.setCommandState(command, !this.lastCommandState[command]);
	    }
	    /**
	     * Fires a change event. Updates the linked textarea and notifies any event listeners.
	     */

	  }, {
	    key: "fireChange",
	    value: function fireChange() {
	      if (!this.textarea && !this.listeners.change.length) return;
	      var content = this.getContent();
	      if (this.textarea) this.textarea.value = content;

	      var _iterator3 = _createForOfIteratorHelper(this.listeners.change),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var listener = _step3.value;
	          listener({
	            content: content,
	            linesDirty: this.linesDirty
	          });
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }
	    }
	    /**
	     * Fires a "selection changed" event.
	     */

	  }, {
	    key: "fireSelection",
	    value: function fireSelection() {
	      if (this.listeners.selection && this.listeners.selection.length) {
	        var focus = this.getSelection(false);
	        var anchor = this.getSelection(true);
	        var commandState = this.getCommandState(focus, anchor);

	        if (this.lastCommandState) {
	          Object.assign(this.lastCommandState, commandState);
	        } else {
	          this.lastCommandState = Object.assign({}, commandState);
	        }

	        var _iterator4 = _createForOfIteratorHelper(this.listeners.selection),
	            _step4;

	        try {
	          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	            var listener = _step4.value;
	            listener({
	              focus: focus,
	              anchor: anchor,
	              commandState: this.lastCommandState
	            });
	          }
	        } catch (err) {
	          _iterator4.e(err);
	        } finally {
	          _iterator4.f();
	        }
	      }
	    }
	    /**
	     * Adds an event listener.
	     * @param {string} type The type of event to listen to. Can be 'change' or 'selection'
	     * @param {*} listener Function of the type (event) => {} to be called when the event occurs.
	     */

	  }, {
	    key: "addEventListener",
	    value: function addEventListener(type, listener) {
	      if (type.match(/^(?:change|input)$/i)) {
	        this.listeners.change.push(listener);
	      }

	      if (type.match(/^(?:selection|selectionchange)$/i)) {
	        this.listeners.selection.push(listener);
	      }
	    }
	  }]);

	  return Editor;
	}();

	exports.CommandBar = CommandBar;
	exports.Editor = Editor;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC1nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZGVuLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtYnVpbHQtaW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuY29uY2F0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1pcy1zdHJpY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmpvaW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWdleHAtZmxhZ3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLXN0aWNreS1oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAuZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy1tdWx0aWJ5dGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1yZWdleHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuc3BsaXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLWh0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3RyaW5nLWh0bWwtZm9yY2VkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuYW5jaG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuYm9sZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLmxpbmsuanMiLCJzcmMvc3ZnL3N2Zy5qcyIsInNyYy9UaW55TURFQ29tbWFuZEJhci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtdXNlcy10by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5zcGxpY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbm90LWEtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcnJlY3QtaXMtcmVnZXhwLWxvZ2ljLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3doaXRlc3BhY2VzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLWZvcmNlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLnRyaW0uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm9iamVjdC5rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtcG9zc2libGUtcHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnJlZ2V4cC5jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAudG8tc3RyaW5nLmpzIiwic3JjL2dyYW1tYXIuanMiLCJzcmMvVGlueU1ERS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2hlY2sgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICYmIGl0Lk1hdGggPT0gTWF0aCAmJiBpdDtcbn07XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG5tb2R1bGUuZXhwb3J0cyA9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgY2hlY2sodHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZikgfHxcbiAgY2hlY2sodHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIDEsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pWzFdICE9IDc7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICFuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgMTogMiB9LCAxKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciBzcGxpdCA9ICcnLnNwbGl0O1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICByZXR1cm4gIU9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09ICdTdHJpbmcnID8gc3BsaXQuY2FsbChpdCwgJycpIDogT2JqZWN0KGl0KTtcbn0gOiBPYmplY3Q7XG4iLCIvLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZXF1aXJlb2JqZWN0Y29lcmNpYmxlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBQUkVGRVJSRURfU1RSSU5HKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpbnB1dC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIEVYSVNUUyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEVYSVNUUyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9IDc7XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbnZhciBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/IG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcblxudmFyIG5hdGl2ZURlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHlNb2R1bGUuZihvYmplY3QsIGtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGdsb2JhbCwga2V5LCB2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbnZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24udG9TdHJpbmc7XG5cbi8vIHRoaXMgaGVscGVyIGJyb2tlbiBpbiBgMy40LjEtMy40LjRgLCBzbyB3ZSBjYW4ndCB1c2UgYHNoYXJlZGAgaGVscGVyXG5pZiAodHlwZW9mIHN0b3JlLmluc3BlY3RTb3VyY2UgIT0gJ2Z1bmN0aW9uJykge1xuICBzdG9yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcuY2FsbChpdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmUuaW5zcGVjdFNvdXJjZTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nICYmIC9uYXRpdmUgY29kZS8udGVzdChpbnNwZWN0U291cmNlKFdlYWtNYXApKTtcbiIsInZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjYuNScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyBTdHJpbmcoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgKCsraWQgKyBwb3N0Zml4KS50b1N0cmluZygzNik7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBvYmplY3RIYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkJyk7XG4gICAgfSByZXR1cm4gc3RhdGU7XG4gIH07XG59O1xuXG5pZiAoTkFUSVZFX1dFQUtfTUFQKSB7XG4gIHZhciBzdG9yZSA9IG5ldyBXZWFrTWFwKCk7XG4gIHZhciB3bWdldCA9IHN0b3JlLmdldDtcbiAgdmFyIHdtaGFzID0gc3RvcmUuaGFzO1xuICB2YXIgd21zZXQgPSBzdG9yZS5zZXQ7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICB3bXNldC5jYWxsKHN0b3JlLCBpdCwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtZ2V0LmNhbGwoc3RvcmUsIGl0KSB8fCB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtaGFzLmNhbGwoc3RvcmUsIGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGl0LCBTVEFURSwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIG9iamVjdEhhcyhpdCwgU1RBVEUpID8gaXRbU1RBVEVdIDoge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBvYmplY3RIYXMoaXQsIFNUQVRFKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0LFxuICBnZXQ6IGdldCxcbiAgaGFzOiBoYXMsXG4gIGVuZm9yY2U6IGVuZm9yY2UsXG4gIGdldHRlckZvcjogZ2V0dGVyRm9yXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcblxudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZW5mb3JjZTtcbnZhciBURU1QTEFURSA9IFN0cmluZyhTdHJpbmcpLnNwbGl0KCdTdHJpbmcnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJyAmJiAhaGFzKHZhbHVlLCAnbmFtZScpKSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkodmFsdWUsICduYW1lJywga2V5KTtcbiAgICBlbmZvcmNlSW50ZXJuYWxTdGF0ZSh2YWx1ZSkuc291cmNlID0gVEVNUExBVEUuam9pbih0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8ga2V5IDogJycpO1xuICB9XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbiIsInZhciBwYXRoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3BhdGgnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YXJpYWJsZSA9PSAnZnVuY3Rpb24nID8gdmFyaWFibGUgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24ocGF0aFtuYW1lc3BhY2VdKSB8fCBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pXG4gICAgOiBwYXRoW25hbWVzcGFjZV0gJiYgcGF0aFtuYW1lc3BhY2VdW21ldGhvZF0gfHwgZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNOYU4oYXJndW1lbnQgPSArYXJndW1lbnQpID8gMCA6IChhcmd1bWVudCA+IDAgPyBmbG9vciA6IGNlaWwpKGFyZ3VtZW50KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbnRlZ2VyIDwgMCA/IG1heChpbnRlZ2VyICsgbGVuZ3RoLCAwKSA6IG1pbihpbnRlZ2VyLCBsZW5ndGgpO1xufTtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBjcmVhdGVNZXRob2QodHJ1ZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhcyhoaWRkZW5LZXlzLCBrZXkpICYmIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwidmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignUmVmbGVjdCcsICdvd25LZXlzJykgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCkge1xuICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUuZihhbk9iamVjdChpdCkpO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHJldHVybiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzKHRhcmdldCwga2V5KSkgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMubm9UYXJnZXRHZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY2xhc3NvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByaW1pdGl2ZScpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKGtleSk7XG4gIGlmIChwcm9wZXJ0eUtleSBpbiBvYmplY3QpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBwcm9wZXJ0eUtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W3Byb3BlcnR5S2V5XSA9IHZhbHVlO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICEhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgcmV0dXJuICFTdHJpbmcoU3ltYm9sKCkpO1xufSk7XG4iLCJ2YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgJiYgIVN5bWJvbC5zaGFtXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgV2VsbEtub3duU3ltYm9sc1N0b3JlID0gc2hhcmVkKCd3a3MnKTtcbnZhciBTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sIDogU3ltYm9sICYmIFN5bWJvbC53aXRob3V0U2V0dGVyIHx8IHVpZDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIWhhcyhXZWxsS25vd25TeW1ib2xzU3RvcmUsIG5hbWUpKSB7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzKFN5bWJvbCwgbmFtZSkpIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICBlbHNlIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IGNyZWF0ZVdlbGxLbm93blN5bWJvbCgnU3ltYm9sLicgKyBuYW1lKTtcbiAgfSByZXR1cm4gV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gbmV3IChDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEMpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ25hdmlnYXRvcicsICd1c2VyQWdlbnQnKSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgdmVyc2lvbiA9IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbiAmJiArdmVyc2lvbjtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4gIC8vIGRlb3B0aW1pemF0aW9uIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy82NzdcbiAgcmV0dXJuIFY4X1ZFUlNJT04gPj0gNTEgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBhcnJheS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgIGNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZm9vOiAxIH07XG4gICAgfTtcbiAgICByZXR1cm4gYXJyYXlbTUVUSE9EX05BTUVdKEJvb2xlYW4pLmZvbyAhPT0gMTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG52YXIgYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFID0gd2VsbEtub3duU3ltYm9sKCdpc0NvbmNhdFNwcmVhZGFibGUnKTtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQgPSAnTWF4aW11bSBhbGxvd2VkIGluZGV4IGV4Y2VlZGVkJztcblxuLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4vLyBkZW9wdGltaXphdGlvbiBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQgPSBWOF9WRVJTSU9OID49IDUxIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBhcnJheSA9IFtdO1xuICBhcnJheVtJU19DT05DQVRfU1BSRUFEQUJMRV0gPSBmYWxzZTtcbiAgcmV0dXJuIGFycmF5LmNvbmNhdCgpWzBdICE9PSBhcnJheTtcbn0pO1xuXG52YXIgU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnY29uY2F0Jyk7XG5cbnZhciBpc0NvbmNhdFNwcmVhZGFibGUgPSBmdW5jdGlvbiAoTykge1xuICBpZiAoIWlzT2JqZWN0KE8pKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzcHJlYWRhYmxlID0gT1tJU19DT05DQVRfU1BSRUFEQUJMRV07XG4gIHJldHVybiBzcHJlYWRhYmxlICE9PSB1bmRlZmluZWQgPyAhIXNwcmVhZGFibGUgOiBpc0FycmF5KE8pO1xufTtcblxudmFyIEZPUkNFRCA9ICFJU19DT05DQVRfU1BSRUFEQUJMRV9TVVBQT1JUIHx8ICFTUEVDSUVTX1NVUFBPUlQ7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuY29uY2F0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5jb25jYXRcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBpc0NvbmNhdFNwcmVhZGFibGUgYW5kIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogRk9SQ0VEIH0sIHtcbiAgY29uY2F0OiBmdW5jdGlvbiBjb25jYXQoYXJnKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBBID0gYXJyYXlTcGVjaWVzQ3JlYXRlKE8sIDApO1xuICAgIHZhciBuID0gMDtcbiAgICB2YXIgaSwgaywgbGVuZ3RoLCBsZW4sIEU7XG4gICAgZm9yIChpID0gLTEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgRSA9IGkgPT09IC0xID8gTyA6IGFyZ3VtZW50c1tpXTtcbiAgICAgIGlmIChpc0NvbmNhdFNwcmVhZGFibGUoRSkpIHtcbiAgICAgICAgbGVuID0gdG9MZW5ndGgoRS5sZW5ndGgpO1xuICAgICAgICBpZiAobiArIGxlbiA+IE1BWF9TQUZFX0lOVEVHRVIpIHRocm93IFR5cGVFcnJvcihNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQpO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbGVuOyBrKyssIG4rKykgaWYgKGsgaW4gRSkgY3JlYXRlUHJvcGVydHkoQSwgbiwgRVtrXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobiA+PSBNQVhfU0FGRV9JTlRFR0VSKSB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0lOREVYX0VYQ0VFREVEKTtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkoQSwgbisrLCBFKTtcbiAgICAgIH1cbiAgICB9XG4gICAgQS5sZW5ndGggPSBuO1xuICAgIHJldHVybiBBO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgYXJndW1lbnQpIHtcbiAgdmFyIG1ldGhvZCA9IFtdW01FVEhPRF9OQU1FXTtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsLG5vLXRocm93LWxpdGVyYWxcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHRocm93IDE7IH0sIDEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG5cbnZhciBuYXRpdmVKb2luID0gW10uam9pbjtcblxudmFyIEVTM19TVFJJTkdTID0gSW5kZXhlZE9iamVjdCAhPSBPYmplY3Q7XG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2pvaW4nLCAnLCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmpvaW5gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmpvaW5cbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEVTM19TVFJJTkdTIHx8ICFTVFJJQ1RfTUVUSE9EIH0sIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbmF0aXZlSm9pbi5jYWxsKHRvSW5kZXhlZE9iamVjdCh0aGlzKSwgc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnLCcgOiBzZXBhcmF0b3IpO1xuICB9XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZyA9IEZ1bmN0aW9uUHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIG5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLztcbnZhciBOQU1FID0gJ25hbWUnO1xuXG4vLyBGdW5jdGlvbiBpbnN0YW5jZXMgYC5uYW1lYCBwcm9wZXJ0eVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZnVuY3Rpb24taW5zdGFuY2VzLW5hbWVcbmlmIChERVNDUklQVE9SUyAmJiAhKE5BTUUgaW4gRnVuY3Rpb25Qcm90b3R5cGUpKSB7XG4gIGRlZmluZVByb3BlcnR5KEZ1bmN0aW9uUHJvdG90eXBlLCBOQU1FLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uUHJvdG90eXBlVG9TdHJpbmcuY2FsbCh0aGlzKS5tYXRjaChuYW1lUkUpWzFdO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmtleXNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgb2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG5cbnZhciBuYXRpdmVBc3NpZ24gPSBPYmplY3QuYXNzaWduO1xudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmFzc2lnbmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG5tb2R1bGUuZXhwb3J0cyA9ICFuYXRpdmVBc3NpZ24gfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBzaG91bGQgaGF2ZSBjb3JyZWN0IG9yZGVyIG9mIG9wZXJhdGlvbnMgKEVkZ2UgYnVnKVxuICBpZiAoREVTQ1JJUFRPUlMgJiYgbmF0aXZlQXNzaWduKHsgYjogMSB9LCBuYXRpdmVBc3NpZ24oZGVmaW5lUHJvcGVydHkoe30sICdhJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnYicsIHtcbiAgICAgICAgdmFsdWU6IDMsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pLCB7IGI6IDIgfSkpLmIgIT09IDEpIHJldHVybiB0cnVlO1xuICAvLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1ZylcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBzeW1ib2wgPSBTeW1ib2woKTtcbiAgdmFyIGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtzeW1ib2xdID0gNztcbiAgYWxwaGFiZXQuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGNocikgeyBCW2Nocl0gPSBjaHI7IH0pO1xuICByZXR1cm4gbmF0aXZlQXNzaWduKHt9LCBBKVtzeW1ib2xdICE9IDcgfHwgb2JqZWN0S2V5cyhuYXRpdmVBc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBhbHBoYWJldDtcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICB2YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mO1xuICB3aGlsZSAoYXJndW1lbnRzTGVuZ3RoID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IEluZGV4ZWRPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5U3ltYm9scyA/IG9iamVjdEtleXMoUykuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhTKSkgOiBvYmplY3RLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogbmF0aXZlQXNzaWduO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1hc3NpZ24nKTtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogT2JqZWN0LmFzc2lnbiAhPT0gYXNzaWduIH0sIHtcbiAgYXNzaWduOiBhc3NpZ25cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS5mbGFnc2AgZ2V0dGVyIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZXQtcmVnZXhwLnByb3RvdHlwZS5mbGFnc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aGF0ID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKHRoYXQuZ2xvYmFsKSByZXN1bHQgKz0gJ2cnO1xuICBpZiAodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZiAodGhhdC5tdWx0aWxpbmUpIHJlc3VsdCArPSAnbSc7XG4gIGlmICh0aGF0LmRvdEFsbCkgcmVzdWx0ICs9ICdzJztcbiAgaWYgKHRoYXQudW5pY29kZSkgcmVzdWx0ICs9ICd1JztcbiAgaWYgKHRoYXQuc3RpY2t5KSByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9mYWlscycpO1xuXG4vLyBiYWJlbC1taW5pZnkgdHJhbnNwaWxlcyBSZWdFeHAoJ2EnLCAneScpIC0+IC9hL3kgYW5kIGl0IGNhdXNlcyBTeW50YXhFcnJvcixcbi8vIHNvIHdlIHVzZSBhbiBpbnRlcm1lZGlhdGUgZnVuY3Rpb24uXG5mdW5jdGlvbiBSRShzLCBmKSB7XG4gIHJldHVybiBSZWdFeHAocywgZik7XG59XG5cbmV4cG9ydHMuVU5TVVBQT1JURURfWSA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCdhJywgJ3knKSAtPiAvYS95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbiAgdmFyIHJlID0gUkUoJ2EnLCAneScpO1xuICByZS5sYXN0SW5kZXggPSAyO1xuICByZXR1cm4gcmUuZXhlYygnYWJjZCcpICE9IG51bGw7XG59KTtcblxuZXhwb3J0cy5CUk9LRU5fQ0FSRVQgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTc3MzY4N1xuICB2YXIgcmUgPSBSRSgnXnInLCAnZ3knKTtcbiAgcmUubGFzdEluZGV4ID0gMjtcbiAgcmV0dXJuIHJlLmV4ZWMoJ3N0cicpICE9IG51bGw7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWdleHBGbGFncyA9IHJlcXVpcmUoJy4vcmVnZXhwLWZsYWdzJyk7XG52YXIgc3RpY2t5SGVscGVycyA9IHJlcXVpcmUoJy4vcmVnZXhwLXN0aWNreS1oZWxwZXJzJyk7XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuLy8gVGhpcyBhbHdheXMgcmVmZXJzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIGJlY2F1c2UgdGhlXG4vLyBTdHJpbmcjcmVwbGFjZSBwb2x5ZmlsbCB1c2VzIC4vZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyxcbi8vIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBiZWZvcmUgcGF0Y2hpbmcgdGhlIG1ldGhvZC5cbnZhciBuYXRpdmVSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG52YXIgcGF0Y2hlZEV4ZWMgPSBuYXRpdmVFeGVjO1xuXG52YXIgVVBEQVRFU19MQVNUX0lOREVYX1dST05HID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlMSA9IC9hLztcbiAgdmFyIHJlMiA9IC9iKi9nO1xuICBuYXRpdmVFeGVjLmNhbGwocmUxLCAnYScpO1xuICBuYXRpdmVFeGVjLmNhbGwocmUyLCAnYScpO1xuICByZXR1cm4gcmUxLmxhc3RJbmRleCAhPT0gMCB8fCByZTIubGFzdEluZGV4ICE9PSAwO1xufSkoKTtcblxudmFyIFVOU1VQUE9SVEVEX1kgPSBzdGlja3lIZWxwZXJzLlVOU1VQUE9SVEVEX1kgfHwgc3RpY2t5SGVscGVycy5CUk9LRU5fQ0FSRVQ7XG5cbi8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwLCBjb3BpZWQgZnJvbSBlczUtc2hpbSdzIFN0cmluZyNzcGxpdCBwYXRjaC5cbnZhciBOUENHX0lOQ0xVREVEID0gLygpPz8vLmV4ZWMoJycpWzFdICE9PSB1bmRlZmluZWQ7XG5cbnZhciBQQVRDSCA9IFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyB8fCBOUENHX0lOQ0xVREVEIHx8IFVOU1VQUE9SVEVEX1k7XG5cbmlmIChQQVRDSCkge1xuICBwYXRjaGVkRXhlYyA9IGZ1bmN0aW9uIGV4ZWMoc3RyKSB7XG4gICAgdmFyIHJlID0gdGhpcztcbiAgICB2YXIgbGFzdEluZGV4LCByZUNvcHksIG1hdGNoLCBpO1xuICAgIHZhciBzdGlja3kgPSBVTlNVUFBPUlRFRF9ZICYmIHJlLnN0aWNreTtcbiAgICB2YXIgZmxhZ3MgPSByZWdleHBGbGFncy5jYWxsKHJlKTtcbiAgICB2YXIgc291cmNlID0gcmUuc291cmNlO1xuICAgIHZhciBjaGFyc0FkZGVkID0gMDtcbiAgICB2YXIgc3RyQ29weSA9IHN0cjtcblxuICAgIGlmIChzdGlja3kpIHtcbiAgICAgIGZsYWdzID0gZmxhZ3MucmVwbGFjZSgneScsICcnKTtcbiAgICAgIGlmIChmbGFncy5pbmRleE9mKCdnJykgPT09IC0xKSB7XG4gICAgICAgIGZsYWdzICs9ICdnJztcbiAgICAgIH1cblxuICAgICAgc3RyQ29weSA9IFN0cmluZyhzdHIpLnNsaWNlKHJlLmxhc3RJbmRleCk7XG4gICAgICAvLyBTdXBwb3J0IGFuY2hvcmVkIHN0aWNreSBiZWhhdmlvci5cbiAgICAgIGlmIChyZS5sYXN0SW5kZXggPiAwICYmICghcmUubXVsdGlsaW5lIHx8IHJlLm11bHRpbGluZSAmJiBzdHJbcmUubGFzdEluZGV4IC0gMV0gIT09ICdcXG4nKSkge1xuICAgICAgICBzb3VyY2UgPSAnKD86ICcgKyBzb3VyY2UgKyAnKSc7XG4gICAgICAgIHN0ckNvcHkgPSAnICcgKyBzdHJDb3B5O1xuICAgICAgICBjaGFyc0FkZGVkKys7XG4gICAgICB9XG4gICAgICAvLyBeKD8gKyByeCArICkgaXMgbmVlZGVkLCBpbiBjb21iaW5hdGlvbiB3aXRoIHNvbWUgc3RyIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeKD86JyArIHNvdXJjZSArICcpJywgZmxhZ3MpO1xuICAgIH1cblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZS5sYXN0SW5kZXg7XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChzdGlja3kgPyByZUNvcHkgOiByZSwgc3RyQ29weSk7XG5cbiAgICBpZiAoc3RpY2t5KSB7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgbWF0Y2guaW5wdXQgPSBtYXRjaC5pbnB1dC5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2hbMF0gPSBtYXRjaFswXS5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2guaW5kZXggPSByZS5sYXN0SW5kZXg7XG4gICAgICAgIHJlLmxhc3RJbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICB9IGVsc2UgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmUubGFzdEluZGV4ID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoZWRFeGVjO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYycpO1xuXG4kKHsgdGFyZ2V0OiAnUmVnRXhwJywgcHJvdG86IHRydWUsIGZvcmNlZDogLy4vLmV4ZWMgIT09IGV4ZWMgfSwge1xuICBleGVjOiBleGVjXG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIFRPRE86IFJlbW92ZSBmcm9tIGBjb3JlLWpzQDRgIHNpbmNlIGl0J3MgbW92ZWQgdG8gZW50cnkgcG9pbnRzXG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzLnJlZ2V4cC5leGVjJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbnZhciBSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vICNyZXBsYWNlIG5lZWRzIGJ1aWx0LWluIHN1cHBvcnQgZm9yIG5hbWVkIGdyb3Vwcy5cbiAgLy8gI21hdGNoIHdvcmtzIGZpbmUgYmVjYXVzZSBpdCBqdXN0IHJldHVybiB0aGUgZXhlYyByZXN1bHRzLCBldmVuIGlmIGl0IGhhc1xuICAvLyBhIFwiZ3JvcHNcIiBwcm9wZXJ0eS5cbiAgdmFyIHJlID0gLy4vO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXBzID0geyBhOiAnNycgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gJycucmVwbGFjZShyZSwgJyQ8YT4nKSAhPT0gJzcnO1xufSk7XG5cbi8vIElFIDw9IDExIHJlcGxhY2VzICQwIHdpdGggdGhlIHdob2xlIG1hdGNoLCBhcyBpZiBpdCB3YXMgJCZcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYwMjQ2NjYvZ2V0dGluZy1pZS10by1yZXBsYWNlLWEtcmVnZXgtd2l0aC10aGUtbGl0ZXJhbC1zdHJpbmctMFxudmFyIFJFUExBQ0VfS0VFUFNfJDAgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ2EnLnJlcGxhY2UoLy4vLCAnJDAnKSA9PT0gJyQwJztcbn0pKCk7XG5cbnZhciBSRVBMQUNFID0gd2VsbEtub3duU3ltYm9sKCdyZXBsYWNlJyk7XG4vLyBTYWZhcmkgPD0gMTMuMC4zKD8pIHN1YnN0aXR1dGVzIG50aCBjYXB0dXJlIHdoZXJlIG4+bSB3aXRoIGFuIGVtcHR5IHN0cmluZ1xudmFyIFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKC8uL1tSRVBMQUNFXSkge1xuICAgIHJldHVybiAvLi9bUkVQTEFDRV0oJ2EnLCAnJDAnKSA9PT0gJyc7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSkoKTtcblxuLy8gQ2hyb21lIDUxIGhhcyBhIGJ1Z2d5IFwic3BsaXRcIiBpbXBsZW1lbnRhdGlvbiB3aGVuIFJlZ0V4cCNleGVjICE9PSBuYXRpdmVFeGVjXG4vLyBXZWV4IEpTIGhhcyBmcm96ZW4gYnVpbHQtaW4gcHJvdG90eXBlcywgc28gdXNlIHRyeSAvIGNhdGNoIHdyYXBwZXJcbnZhciBTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUgPSAvKD86KS87XG4gIHZhciBvcmlnaW5hbEV4ZWMgPSByZS5leGVjO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3JpZ2luYWxFeGVjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gIHZhciByZXN1bHQgPSAnYWInLnNwbGl0KHJlKTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggIT09IDIgfHwgcmVzdWx0WzBdICE9PSAnYScgfHwgcmVzdWx0WzFdICE9PSAnYic7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMsIHNoYW0pIHtcbiAgdmFyIFNZTUJPTCA9IHdlbGxLbm93blN5bWJvbChLRVkpO1xuXG4gIHZhciBERUxFR0FURVNfVE9fU1lNQk9MID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTdHJpbmcgbWV0aG9kcyBjYWxsIHN5bWJvbC1uYW1lZCBSZWdFcCBtZXRob2RzXG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pO1xuXG4gIHZhciBERUxFR0FURVNfVE9fRVhFQyA9IERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTeW1ib2wtbmFtZWQgUmVnRXhwIG1ldGhvZHMgY2FsbCAuZXhlY1xuICAgIHZhciBleGVjQ2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlID0gL2EvO1xuXG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gV2UgY2FuJ3QgdXNlIHJlYWwgcmVnZXggaGVyZSBzaW5jZSBpdCBjYXVzZXMgZGVvcHRpbWl6YXRpb25cbiAgICAgIC8vIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uIGluIFY4XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzA2XG4gICAgICByZSA9IHt9O1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgICAgcmUuZmxhZ3MgPSAnJztcbiAgICAgIHJlW1NZTUJPTF0gPSAvLi9bU1lNQk9MXTtcbiAgICB9XG5cbiAgICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyBleGVjQ2FsbGVkID0gdHJ1ZTsgcmV0dXJuIG51bGw7IH07XG5cbiAgICByZVtTWU1CT0xdKCcnKTtcbiAgICByZXR1cm4gIWV4ZWNDYWxsZWQ7XG4gIH0pO1xuXG4gIGlmIChcbiAgICAhREVMRUdBVEVTX1RPX1NZTUJPTCB8fFxuICAgICFERUxFR0FURVNfVE9fRVhFQyB8fFxuICAgIChLRVkgPT09ICdyZXBsYWNlJyAmJiAhKFxuICAgICAgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgJiZcbiAgICAgIFJFUExBQ0VfS0VFUFNfJDAgJiZcbiAgICAgICFSRUdFWFBfUkVQTEFDRV9TVUJTVElUVVRFU19VTkRFRklORURfQ0FQVFVSRVxuICAgICkpIHx8XG4gICAgKEtFWSA9PT0gJ3NwbGl0JyAmJiAhU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDKVxuICApIHtcbiAgICB2YXIgbmF0aXZlUmVnRXhwTWV0aG9kID0gLy4vW1NZTUJPTF07XG4gICAgdmFyIG1ldGhvZHMgPSBleGVjKFNZTUJPTCwgJydbS0VZXSwgZnVuY3Rpb24gKG5hdGl2ZU1ldGhvZCwgcmVnZXhwLCBzdHIsIGFyZzIsIGZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICBpZiAocmVnZXhwLmV4ZWMgPT09IHJlZ2V4cEV4ZWMpIHtcbiAgICAgICAgaWYgKERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgICAgLy8gVGhlIG5hdGl2ZSBTdHJpbmcgbWV0aG9kIGFscmVhZHkgZGVsZWdhdGVzIHRvIEBAbWV0aG9kICh0aGlzXG4gICAgICAgICAgLy8gcG9seWZpbGxlZCBmdW5jdGlvbiksIGxlYXNpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIC8vIFdlIGF2b2lkIGl0IGJ5IGRpcmVjdGx5IGNhbGxpbmcgdGhlIG5hdGl2ZSBAQG1ldGhvZCBtZXRob2QuXG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZVJlZ0V4cE1ldGhvZC5jYWxsKHJlZ2V4cCwgc3RyLCBhcmcyKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVNZXRob2QuY2FsbChzdHIsIHJlZ2V4cCwgYXJnMikgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlIH07XG4gICAgfSwge1xuICAgICAgUkVQTEFDRV9LRUVQU18kMDogUkVQTEFDRV9LRUVQU18kMCxcbiAgICAgIFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFOiBSRUdFWFBfUkVQTEFDRV9TVUJTVElUVVRFU19VTkRFRklORURfQ0FQVFVSRVxuICAgIH0pO1xuICAgIHZhciBzdHJpbmdNZXRob2QgPSBtZXRob2RzWzBdO1xuICAgIHZhciByZWdleE1ldGhvZCA9IG1ldGhvZHNbMV07XG5cbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmluZ01ldGhvZCk7XG4gICAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24gKHN0cmluZywgYXJnKSB7IHJldHVybiByZWdleE1ldGhvZC5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uIChzdHJpbmcpIHsgcmV0dXJuIHJlZ2V4TWV0aG9kLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cblxuICBpZiAoc2hhbSkgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KFJlZ0V4cC5wcm90b3R5cGVbU1lNQk9MXSwgJ3NoYW0nLCB0cnVlKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IGNvZGVQb2ludEF0LCBhdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKENPTlZFUlRfVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIHBvcykge1xuICAgIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgc2l6ZSA9IFMubGVuZ3RoO1xuICAgIHZhciBmaXJzdCwgc2Vjb25kO1xuICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gc2l6ZSkgcmV0dXJuIENPTlZFUlRfVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgZmlyc3QgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgIHJldHVybiBmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBwb3NpdGlvbiArIDEgPT09IHNpemVcbiAgICAgIHx8IChzZWNvbmQgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKSkgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGXG4gICAgICAgID8gQ09OVkVSVF9UT19TVFJJTkcgPyBTLmNoYXJBdChwb3NpdGlvbikgOiBmaXJzdFxuICAgICAgICA6IENPTlZFUlRfVE9fU1RSSU5HID8gUy5zbGljZShwb3NpdGlvbiwgcG9zaXRpb24gKyAyKSA6IChmaXJzdCAtIDB4RDgwMCA8PCAxMCkgKyAoc2Vjb25kIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmNvZGVwb2ludGF0XG4gIGNvZGVBdDogY3JlYXRlTWV0aG9kKGZhbHNlKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuYXRgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4gIGNoYXJBdDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNoYXJBdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctbXVsdGlieXRlJykuY2hhckF0O1xuXG4vLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFkdmFuY2VzdHJpbmdpbmRleFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUywgaW5kZXgsIHVuaWNvZGUpIHtcbiAgcmV0dXJuIGluZGV4ICsgKHVuaWNvZGUgPyBjaGFyQXQoUywgaW5kZXgpLmxlbmd0aCA6IDEpO1xufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9jbGFzc29mLXJhdycpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL3JlZ2V4cC1leGVjJyk7XG5cbi8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGNsYXNzb2YoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cblxuICByZXR1cm4gcmVnZXhwRXhlYy5jYWxsKFIsIFMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxuLy8gQEBtYXRjaCBsb2dpY1xuZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ21hdGNoJywgMSwgZnVuY3Rpb24gKE1BVENILCBuYXRpdmVNYXRjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUubWF0Y2hgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubWF0Y2hcbiAgICBmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBtYXRjaGVyID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgICByZXR1cm4gbWF0Y2hlciAhPT0gdW5kZWZpbmVkID8gbWF0Y2hlci5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQG1hdGNoXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVNYXRjaCwgcmVnZXhwLCB0aGlzKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuXG4gICAgICBpZiAoIXJ4Lmdsb2JhbCkgcmV0dXJuIHJlZ0V4cEV4ZWMocngsIFMpO1xuXG4gICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBBID0gW107XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgd2hpbGUgKChyZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKSkgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIEFbbl0gPSBtYXRjaFN0cjtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgICAgbisrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4gPT09IDAgPyBudWxsIDogQTtcbiAgICB9XG4gIF07XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxuLy8gYElzUmVnRXhwYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcmVnZXhwXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjbGFzc29mKGl0KSA9PSAnUmVnRXhwJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG4vLyBgU3BlY2llc0NvbnN0cnVjdG9yYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IGRlZmF1bHRDb25zdHJ1Y3RvciA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYycpO1xudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXJlZ2V4cCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciBjYWxsUmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG52YXIgYXJyYXlQdXNoID0gW10ucHVzaDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBNQVhfVUlOVDMyID0gMHhGRkZGRkZGRjtcblxuLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCd4JywgJ3knKSAtPiAveC95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbnZhciBTVVBQT1JUU19ZID0gIWZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuICFSZWdFeHAoTUFYX1VJTlQzMiwgJ3knKTsgfSk7XG5cbi8vIEBAc3BsaXQgbG9naWNcbmZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdzcGxpdCcsIDIsIGZ1bmN0aW9uIChTUExJVCwgbmF0aXZlU3BsaXQsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICB2YXIgaW50ZXJuYWxTcGxpdDtcbiAgaWYgKFxuICAgICdhYmJjJy5zcGxpdCgvKGIpKi8pWzFdID09ICdjJyB8fFxuICAgICd0ZXN0Jy5zcGxpdCgvKD86KS8sIC0xKS5sZW5ndGggIT0gNCB8fFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT0gMiB8fFxuICAgICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT0gNCB8fFxuICAgICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDEgfHxcbiAgICAnJy5zcGxpdCgvLj8vKS5sZW5ndGhcbiAgKSB7XG4gICAgLy8gYmFzZWQgb24gZXM1LXNoaW0gaW1wbGVtZW50YXRpb24sIG5lZWQgdG8gcmV3b3JrIGl0XG4gICAgaW50ZXJuYWxTcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgICAgdmFyIGxpbSA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyBNQVhfVUlOVDMyIDogbGltaXQgPj4+IDA7XG4gICAgICBpZiAobGltID09PSAwKSByZXR1cm4gW107XG4gICAgICBpZiAoc2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHJldHVybiBbc3RyaW5nXTtcbiAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICBpZiAoIWlzUmVnRXhwKHNlcGFyYXRvcikpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbSk7XG4gICAgICB9XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICB2YXIgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci51bmljb2RlID8gJ3UnIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpO1xuICAgICAgdmFyIGxhc3RMYXN0SW5kZXggPSAwO1xuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHZhciBzZXBhcmF0b3JDb3B5ID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArICdnJyk7XG4gICAgICB2YXIgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4cEV4ZWMuY2FsbChzZXBhcmF0b3JDb3B5LCBzdHJpbmcpKSB7XG4gICAgICAgIGxhc3RJbmRleCA9IHNlcGFyYXRvckNvcHkubGFzdEluZGV4O1xuICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkgYXJyYXlQdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW0pIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHNlcGFyYXRvckNvcHkubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIGlmIChsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3JDb3B5LnRlc3QoJycpKSBvdXRwdXQucHVzaCgnJyk7XG4gICAgICB9IGVsc2Ugb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltID8gb3V0cHV0LnNsaWNlKDAsIGxpbSkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgLy8gQ2hha3JhLCBWOFxuICB9IGVsc2UgaWYgKCcwJy5zcGxpdCh1bmRlZmluZWQsIDApLmxlbmd0aCkge1xuICAgIGludGVybmFsU3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgcmV0dXJuIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwID8gW10gOiBuYXRpdmVTcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH07XG4gIH0gZWxzZSBpbnRlcm5hbFNwbGl0ID0gbmF0aXZlU3BsaXQ7XG5cbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5zcGxpdGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5zcGxpdFxuICAgIGZ1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBzcGxpdHRlciA9IHNlcGFyYXRvciA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZXBhcmF0b3JbU1BMSVRdO1xuICAgICAgcmV0dXJuIHNwbGl0dGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBzcGxpdHRlci5jYWxsKHNlcGFyYXRvciwgTywgbGltaXQpXG4gICAgICAgIDogaW50ZXJuYWxTcGxpdC5jYWxsKFN0cmluZyhPKSwgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHNwbGl0XG4gICAgLy9cbiAgICAvLyBOT1RFOiBUaGlzIGNhbm5vdCBiZSBwcm9wZXJseSBwb2x5ZmlsbGVkIGluIGVuZ2luZXMgdGhhdCBkb24ndCBzdXBwb3J0XG4gICAgLy8gdGhlICd5JyBmbGFnLlxuICAgIGZ1bmN0aW9uIChyZWdleHAsIGxpbWl0KSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKGludGVybmFsU3BsaXQsIHJlZ2V4cCwgdGhpcywgbGltaXQsIGludGVybmFsU3BsaXQgIT09IG5hdGl2ZVNwbGl0KTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgdmFyIEMgPSBzcGVjaWVzQ29uc3RydWN0b3IocngsIFJlZ0V4cCk7XG5cbiAgICAgIHZhciB1bmljb2RlTWF0Y2hpbmcgPSByeC51bmljb2RlO1xuICAgICAgdmFyIGZsYWdzID0gKHJ4Lmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHJ4Lm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocngudW5pY29kZSA/ICd1JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoU1VQUE9SVFNfWSA/ICd5JyA6ICdnJyk7XG5cbiAgICAgIC8vIF4oPyArIHJ4ICsgKSBpcyBuZWVkZWQsIGluIGNvbWJpbmF0aW9uIHdpdGggc29tZSBTIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICB2YXIgc3BsaXR0ZXIgPSBuZXcgQyhTVVBQT1JUU19ZID8gcnggOiAnXig/OicgKyByeC5zb3VyY2UgKyAnKScsIGZsYWdzKTtcbiAgICAgIHZhciBsaW0gPSBsaW1pdCA9PT0gdW5kZWZpbmVkID8gTUFYX1VJTlQzMiA6IGxpbWl0ID4+PiAwO1xuICAgICAgaWYgKGxpbSA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgaWYgKFMubGVuZ3RoID09PSAwKSByZXR1cm4gY2FsbFJlZ0V4cEV4ZWMoc3BsaXR0ZXIsIFMpID09PSBudWxsID8gW1NdIDogW107XG4gICAgICB2YXIgcCA9IDA7XG4gICAgICB2YXIgcSA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgd2hpbGUgKHEgPCBTLmxlbmd0aCkge1xuICAgICAgICBzcGxpdHRlci5sYXN0SW5kZXggPSBTVVBQT1JUU19ZID8gcSA6IDA7XG4gICAgICAgIHZhciB6ID0gY2FsbFJlZ0V4cEV4ZWMoc3BsaXR0ZXIsIFNVUFBPUlRTX1kgPyBTIDogUy5zbGljZShxKSk7XG4gICAgICAgIHZhciBlO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgeiA9PT0gbnVsbCB8fFxuICAgICAgICAgIChlID0gbWluKHRvTGVuZ3RoKHNwbGl0dGVyLmxhc3RJbmRleCArIChTVVBQT1JUU19ZID8gMCA6IHEpKSwgUy5sZW5ndGgpKSA9PT0gcFxuICAgICAgICApIHtcbiAgICAgICAgICBxID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHEsIHVuaWNvZGVNYXRjaGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQS5wdXNoKFMuc2xpY2UocCwgcSkpO1xuICAgICAgICAgIGlmIChBLmxlbmd0aCA9PT0gbGltKSByZXR1cm4gQTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB6Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgQS5wdXNoKHpbaV0pO1xuICAgICAgICAgICAgaWYgKEEubGVuZ3RoID09PSBsaW0pIHJldHVybiBBO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxID0gcCA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEEucHVzaChTLnNsaWNlKHApKTtcbiAgICAgIHJldHVybiBBO1xuICAgIH1cbiAgXTtcbn0sICFTVVBQT1JUU19ZKTtcbiIsInZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG52YXIgcXVvdCA9IC9cIi9nO1xuXG4vLyBCLjIuMy4yLjEgQ3JlYXRlSFRNTChzdHJpbmcsIHRhZywgYXR0cmlidXRlLCB2YWx1ZSlcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNyZWF0ZWh0bWxcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoc3RyaW5nKSk7XG4gIHZhciBwMSA9ICc8JyArIHRhZztcbiAgaWYgKGF0dHJpYnV0ZSAhPT0gJycpIHAxICs9ICcgJyArIGF0dHJpYnV0ZSArICc9XCInICsgU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHF1b3QsICcmcXVvdDsnKSArICdcIic7XG4gIHJldHVybiBwMSArICc+JyArIFMgKyAnPC8nICsgdGFnICsgJz4nO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBjaGVjayB0aGUgZXhpc3RlbmNlIG9mIGEgbWV0aG9kLCBsb3dlcmNhc2Vcbi8vIG9mIGEgdGFnIGFuZCBlc2NhcGluZyBxdW90ZXMgaW4gYXJndW1lbnRzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICByZXR1cm4gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXN0ID0gJydbTUVUSE9EX05BTUVdKCdcIicpO1xuICAgIHJldHVybiB0ZXN0ICE9PSB0ZXN0LnRvTG93ZXJDYXNlKCkgfHwgdGVzdC5zcGxpdCgnXCInKS5sZW5ndGggPiAzO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBjcmVhdGVIVE1MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1odG1sJyk7XG52YXIgZm9yY2VkU3RyaW5nSFRNTE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctaHRtbC1mb3JjZWQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUuYW5jaG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuYW5jaG9yXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogZm9yY2VkU3RyaW5nSFRNTE1ldGhvZCgnYW5jaG9yJykgfSwge1xuICBhbmNob3I6IGZ1bmN0aW9uIGFuY2hvcihuYW1lKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnbmFtZScsIG5hbWUpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGNyZWF0ZUhUTUwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLWh0bWwnKTtcbnZhciBmb3JjZWRTdHJpbmdIVE1MTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1odG1sLWZvcmNlZCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5ib2xkYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuYm9sZFxuJCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IGZvcmNlZFN0cmluZ0hUTUxNZXRob2QoJ2JvbGQnKSB9LCB7XG4gIGJvbGQ6IGZ1bmN0aW9uIGJvbGQoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2InLCAnJywgJycpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGNyZWF0ZUhUTUwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLWh0bWwnKTtcbnZhciBmb3JjZWRTdHJpbmdIVE1MTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1odG1sLWZvcmNlZCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5saW5rYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubGlua1xuJCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IGZvcmNlZFN0cmluZ0hUTUxNZXRob2QoJ2xpbmsnKSB9LCB7XG4gIGxpbms6IGZ1bmN0aW9uIGxpbmsodXJsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnaHJlZicsIHVybCk7XG4gIH1cbn0pO1xuIiwiY29uc3Qgc3ZnID0ge1xuICBibG9ja3F1b3RlOiBgPHN2ZyBoZWlnaHQ9XCIxOFwiIHdpZHRoPVwiMThcIj48cmVjdCB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgeD1cIjNcIiB5PVwiNFwiIHJ5PVwiMVwiLz48cmVjdCByeT1cIjFcIiB5PVwiNFwiIHg9XCIxMFwiIGhlaWdodD1cIjVcIiB3aWR0aD1cIjVcIi8+PHBhdGggZD1cIk04IDYuOTk5djNjMCAxLTEgMy0xIDNzLS4zMzEgMS0xLjMzMSAxaC0xYy0xIDAtLjY2OS0xLS42NjktMXMxLTIgMS0zdi0zem03IDB2M2MwIDEtMSAzLTEgM3MtLjMzMSAxLTEuMzMxIDFoLTFjLTEgMC0uNjY5LTEtLjY2OS0xczEtMiAxLTN2LTN6XCIvPjwvc3ZnPmAsXG4gIGJvbGQ6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNNCAyYTEgMSAwIDAwLTEgMXYxMmExIDEgMCAwMDEgMWg2YzQgMCA1LTIgNS00IDAtMS4zMjItLjQzNC0yLjYzNi0xLjg4NS0zLjM4MUMxMy43NzIgNy44ODUgMTQgNi45NDUgMTQgNmMwLTItMS00LTUtNHptMSAyaDRjMS42NjggMCAyLjMyLjM5MyAyLjYuNjcyLjI4LjI3OS40LjY2Mi40IDEuMzI4cy0uMTIgMS4wNTctLjQgMS4zMzhjLS4yNzUuMjc0LTEuMDE0LjY0Ni0yLjYuNjYySDV6bTUgNmMxLjY2Ni4wMDUgMi4zMTguMzg4IDIuNTk2LjY2Ni4yNzcuMjc4LjQwNC42NjcuNDA0IDEuMzM0cy0uMTI3IDEuMDYtLjQwNCAxLjMzOGMtLjI3OC4yNzgtLjkzLjY2LTIuNTk2LjY2MmwtNC45OTIuMDA0TDUgMTB6XCIvPjwvc3ZnPmAsXG4gIGNsZWFyX2Zvcm1hdHRpbmc6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMTEuMDMgMWExIDEgMCAwMC0uNzQuM2wtOSA5YTEgMSAwIDAwMCAxLjRsNCA0QTEgMSAwIDAwNiAxNmgyYTEgMSAwIDAwLjctLjNsOC04YTEgMSAwIDAwMC0xLjRsLTUtNWExIDEgMCAwMC0uNjctLjN6TTguNyA1LjdsMy41OCAzLjZMNy42IDE0SDYuNGwtMy0zIDUuMy01LjN6XCIvPjxyZWN0IHJ5PVwiLjhcIiByeD1cIi44XCIgeT1cIjE0XCIgeD1cIjE2XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMlwiLz48cmVjdCB3aWR0aD1cIjJcIiBoZWlnaHQ9XCIyXCIgeD1cIjEzXCIgeT1cIjE0XCIgcng9XCIuOFwiIHJ5PVwiLjhcIi8+PHJlY3Qgcnk9XCIuOFwiIHJ4PVwiLjhcIiB5PVwiMTRcIiB4PVwiMTBcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIyXCIvPjwvc3ZnPmAsXG4gIGNvZGU6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMTMuNSAyLjk5NGEuNS41IDAgMDAtLjUuNS41LjUgMCAwMDAgLjAzNFY0LjUzYTUuOTkzIDUuOTkzIDAgMDAtNy40NTEtLjQ0NUE2IDYgMCAxMDEyLjQ1IDEzLjlhNS45OSA1Ljk5IDAgMDAxLjM0Ni0xLjMzNC41LjUgMCAwMC4wOTYtLjEwMS41LjUgMCAwMC0uMTItLjY5OC41LjUgMCAwMC0uNjk3LjEybC0uMDA0LS4wMDVhNSA1IDAgMDEtMS4xOTcgMS4yIDUgNSAwIDExMS4yMTUtNi45NjUuNS41IDAgMDAuNjk3LjEyLjUuNSAwIDAwLjIxMS0uNDRWNC43NDVIMTRWMy40OTNhLjUuNSAwIDAwLS41LS41elwiLz48L3N2Zz5gLFxuICBoMTogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk0zIDJzMC0xIDEtMWgxYzEgMCAxIDEgMSAxdjZoNlYyczAtMSAxLTFoMWMxIDAgMSAxIDEgMXYxNHMwIDEtMSAxaC0xYy0xIDAtMS0xLTEtMXYtNkg2djZzMCAxLTEgMUg0Yy0xIDAtMS0xLTEtMXpcIi8+PC9zdmc+YCxcbiAgaDI6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNNCAyczAtMSAxLTEgMSAxIDEgMXY2YzEtMSAyLTEgNC0xIDMgMCA0IDIgNCA0djVzMCAxLTEgMS0xLTEtMS0xdi01YzAtMS4wOTQtMS0yLTItMi0yIDAtMyAwLTQgMnY1czAgMS0xIDEtMS0xLTEtMXpcIi8+PC9zdmc+YCxcbiAgaHI6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxyZWN0IHJ5PVwiMVwiIHk9XCI4XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMThcIiBzdHlsZT1cImZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOm5vcm1hbDttYXJrZXI6bm9uZVwiLz48L3N2Zz5gLFxuICBpbWFnZTogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk0xIDJ2MTRoMTZWMkgxem0yIDJoMTJ2N2wtMy0zLTQgNC0yLTItMyAzVjR6XCIvPjxjaXJjbGUgcj1cIjEuNVwiIGN5PVwiNi41XCIgY3g9XCI1LjVcIi8+PC9zdmc+YCxcbiAgaXRhbGljOiBgPHN2ZyBoZWlnaHQ9XCIxOFwiIHdpZHRoPVwiMThcIj48cGF0aCBkPVwiTTkgMmExIDEgMCAwMDAgMkw3IDE0YTEgMSAwIDEwMCAyaDJhMSAxIDAgMDAwLTJsMi0xMGExIDEgMCAxMDAtMnpcIi8+PC9zdmc+YCxcbiAgbGluazogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk05LjA3IDUuMThhMy45IDMuOSAwIDAwLTEuNTIuNDNDNi4zMSA2LjIyIDUuMyA3LjI5IDQuMyA4LjI5Yy0xIDEtMi4wNyAyLjAyLTIuNjggMy4yNi0uMzEuNjItLjUgMS4zMy0uNDEgMi4wNy4wOS43NS40OCAxLjQ3IDEuMSAyLjA5LjYxLjYxIDEuMzMgMSAyLjA4IDEuMS43NC4wOSAxLjQ1LS4xIDIuMDctLjQyIDEuMjQtLjYxIDIuMjYtMS42OCAzLjI2LTIuNjguNDYtLjQ3Ljk0LS45NCAxLjM5LTEuNDRsLS40My4yNmMtLjY4LjM0LTEuNDkuNTYtMi4zNi40Ni0uMi0uMDMtLjQtLjA4LS42LS4xNC0uNzkuNzYtMS41NSAxLjQ1LTIuMTYgMS43Ni0uMzguMTktLjY3LjI0LS45Mi4yMS0uMjYtLjAzLS41NC0uMTQtLjkyLS41My0uMzktLjM4LS41LS42Ni0uNTMtLjkxLS4wMy0uMjYuMDItLjU1LjIxLS45My4zOS0uNzYgMS4zMi0xLjc0IDIuMzItMi43NCAxLTEgMS45OC0xLjkzIDIuNzQtMi4zMi4zOC0uMTkuNjctLjI0LjkzLS4yMS4yNS4wMy41My4xNC45MS41My4zOS4zOC41LjY2LjUzLjkydi4wNmwxLjEyLTEuMDYuNDQtLjQ3Yy0uMTgtLjMtLjQtLjYtLjY3LS44Ny0uNjItLjYxLTEuMzQtMS0yLjA5LTEuMWEzLjA4IDMuMDggMCAwMC0uNTUtLjAxelwiLz48cGF0aCBkPVwiTTEzLjA3Ljg2YTMuOSAzLjkgMCAwMC0xLjUyLjQzYy0xLjI0LjYyLTIuMjYgMS42OS0zLjI2IDIuNjktLjQ2LjQ3LS45NC45NC0xLjM5IDEuNDMuMTUtLjA4LjI4LS4xOC40My0uMjVhNC40IDQuNCAwIDAxMi4zNi0uNDZjLjIuMDIuNC4wNy42LjE0Ljc5LS43NyAxLjU1LTEuNDYgMi4xNi0xLjc2LjM4LS4xOS42Ny0uMjUuOTMtLjIxLjI1LjAzLjUzLjE0LjkxLjUyLjM5LjM4LjUuNjYuNTMuOTIuMDMuMjYtLjAyLjU1LS4yMS45My0uMzkuNzYtMS4zMiAxLjc0LTIuMzIgMi43NC0xIDEtMS45OCAxLjkzLTIuNzQgMi4zMS0uMzguMi0uNjcuMjUtLjkzLjIyLS4yNS0uMDQtLjUzLS4xNS0uOTEtLjUzLS4zOS0uMzgtLjUtLjY2LS41My0uOTJWOWMtLjM2LjMzLS43My42Ny0xLjEyIDEuMDZsLS40My40NmMuMTcuMy40LjYuNjYuODcuNjIuNjIgMS4zNCAxIDIuMDggMS4xLjc1LjEgMS40Ni0uMSAyLjA4LS40MSAxLjI0LS42MiAyLjI2LTEuNjkgMy4yNi0yLjY5czIuMDctMi4wMiAyLjY4LTMuMjZjLjMxLS42Mi41LTEuMzIuNDEtMi4wN2EzLjYzIDMuNjMgMCAwMC0xLjEtMi4wOGMtLjYxLS42Mi0xLjMzLTEtMi4wNy0xLjFhMy4wOCAzLjA4IDAgMDAtLjU2LS4wMnpcIi8+PC9zdmc+YCxcbiAgb2w6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMS41IDdhLjUuNSAwIDEwMCAxaDFhLjUuNSAwIDAxLjUuNWMwIC4xNjQtLjA4LjMxLS4xNC4zNTVsLTEuNjU1IDEuMjVBLjQ5Mi40OTIgMCAwMDEgMTAuNWEuNS41IDAgMDAuNS41aDJhLjUuNSAwIDAwMC0xSDNsLjM5OC0uMjk5QTEuNSAxLjUgMCAwMDIuNSA3elwiLz48cGF0aCBkPVwiTTEuNSAxMmMtLjY2NyAwLS42NjcgMSAwIDFoMS4yNWMuMzMzIDAgLjMzMy41IDAgLjVIMi41Yy0uNjY3IDAtLjY2NyAxIDAgMWguMjVjLjMzMyAwIC4zMzMuNSAwIC41SDEuNWMtLjY2NyAwLS42NjcgMSAwIDFoMWMuMzk4IDAgLjc4LS4xMzEgMS4wNi0uMzY1LjI4Mi0uMjM1LjQ0LS41NTQuNDQtLjg4NWExLjEyMSAxLjEyMSAwIDAwLS4zMDMtLjc1Yy4xOTEtLjIwNC4zLS40Ny4zMDMtLjc1IDAtLjMzMi0uMTU4LS42NTEtLjQ0LS44ODUtLjMtLjI0MS0uNjc1LS4zNy0xLjA2LS4zNjV6XCIvPjxyZWN0IHk9XCIxM1wiIHg9XCI2XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMTJcIiByeT1cIjFcIi8+PHJlY3Qgcnk9XCIxXCIgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjJcIiB4PVwiNlwiIHk9XCI4XCIvPjxyZWN0IHk9XCIzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48cGF0aCBkPVwiTTEuNSAyYS41LjUgMCAxMDAgMUgydjJoLS41YS41LjUgMCAxMDAgMWgyYS41LjUgMCAxMDAtMUgzVjIuNWMwLS4yNzctLjIyMy0uNS0uNS0uNXpcIi8+PC9zdmc+YCxcbiAgc3RyaWtldGhyb3VnaDogYDxzdmcgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCI+PHBhdGggZD1cIk0xMCAyQzYgMiA0IDQgNCA2YzAgLjMzOC4wOC42NzIuMTkzIDFoMi4zNEM2LjExMyA2LjYyOSA2IDYuMjk1IDYgNmMwLS4zMzQuMTE3LS43MjUuNjkxLTEuMTU0QzcuMjY1IDQuNDE2IDguMzMxIDQgMTAgNGgzYTEgMSAwIDAwMC0yem0xLjQ3NyA5Yy40MTMuMzY4LjUyMy43MDYuNTIzIDEgMCAuMzM0LS4xMjcuNzEyLS43MDEgMS4xNDMtLjU3NS40My0xLjYzMi44NS0zLjI5OS44NTdsLTEuMDA2LjAwN1YxNEg1YTEgMSAwIDAwMCAyaDNjNCAwIDYtMiA2LTQgMC0uMzM4LS4wODEtLjY3Mi0uMTk1LTF6XCIvPjxyZWN0IHJ5PVwiMVwiIHk9XCI4XCIgeD1cIjFcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxNlwiLz48L3N2Zz5gLFxuICB1bDogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PGNpcmNsZSBjeD1cIjJcIiBjeT1cIjlcIiByPVwiMlwiLz48Y2lyY2xlIGN5PVwiNFwiIGN4PVwiMlwiIHI9XCIyXCIvPjxyZWN0IHk9XCIzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48Y2lyY2xlIGN4PVwiMlwiIGN5PVwiMTRcIiByPVwiMlwiLz48cmVjdCByeT1cIjFcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiMlwiIHg9XCI2XCIgeT1cIjhcIi8+PHJlY3QgeT1cIjEzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48L3N2Zz5gXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzdmc7IiwiaW1wb3J0IHN2ZyBmcm9tICcuL3N2Zy9zdmcnO1xuXG5jb25zdCBpc01hY0xpa2UgPSAvKE1hY3xpUGhvbmV8aVBvZHxpUGFkKS9pLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKTtcblxuY29uc3QgRGVmYXVsdENvbW1hbmRzID0ge1xuICAnYm9sZCc6IHtcbiAgICBuYW1lOiAnYm9sZCcsXG4gICAgYWN0aW9uOiAnYm9sZCcsXG4gICAgaW5uZXJIVE1MOiBzdmcuYm9sZCxcbiAgICB0aXRsZTogJ0JvbGQnLFxuICAgIGhvdGtleTogJ01vZC1CJyxcbiAgfSxcbiAgJ2l0YWxpYyc6IHtcbiAgICBuYW1lOiAnaXRhbGljJyxcbiAgICBhY3Rpb246ICdpdGFsaWMnLFxuICAgIGlubmVySFRNTDogc3ZnLml0YWxpYyxcbiAgICB0aXRsZTogJ0l0YWxpYycsXG4gICAgaG90a2V5OiAnTW9kLUknLFxuICB9LFxuICAnc3RyaWtldGhyb3VnaCc6IHtcbiAgICBuYW1lOiAnc3RyaWtldGhyb3VnaCcsXG4gICAgYWN0aW9uOiAnc3RyaWtldGhyb3VnaCcsXG4gICAgaW5uZXJIVE1MOiBzdmcuc3RyaWtldGhyb3VnaCxcbiAgICB0aXRsZTogJ1N0cmlrZXRocm91Z2gnLFxuICAgIGhvdGtleTogJ01vZDItU2hpZnQtNScsXG4gIH0sXG4gICdjb2RlJzoge1xuICAgIG5hbWU6ICdjb2RlJyxcbiAgICBhY3Rpb246ICdjb2RlJyxcbiAgICBpbm5lckhUTUw6IHN2Zy5jb2RlLFxuICAgIHRpdGxlOiAnRm9ybWF0IGFzIGNvZGUnLFxuICB9LFxuICAnaDEnOiB7XG4gICAgbmFtZTogJ2gxJyxcbiAgICBhY3Rpb246ICdoMScsXG4gICAgaW5uZXJIVE1MOiBzdmcuaDEsXG4gICAgdGl0bGU6ICdMZXZlbCAxIGhlYWRpbmcnLFxuICAgIGhvdGtleTogJ01vZC1TaGlmdC0xJyxcbiAgfSxcbiAgJ2gyJzoge1xuICAgIG5hbWU6ICdoMicsXG4gICAgYWN0aW9uOiAnaDInLFxuICAgIGlubmVySFRNTDogc3ZnLmgyLFxuICAgIHRpdGxlOiAnTGV2ZWwgMiBoZWFkaW5nJyxcbiAgICBob3RrZXk6ICdNb2QtU2hpZnQtMicsXG4gIH0sXG4gICd1bCc6IHtcbiAgICBuYW1lOiAndWwnLFxuICAgIGFjdGlvbjogJ3VsJyxcbiAgICBpbm5lckhUTUw6IHN2Zy51bCxcbiAgICB0aXRsZTogJ0J1bGxldGVkIGxpc3QnLFxuICB9LFxuICAnb2wnOiB7XG4gICAgbmFtZTogJ29sJyxcbiAgICBhY3Rpb246ICdvbCcsXG4gICAgaW5uZXJIVE1MOiBzdmcub2wsXG4gICAgdGl0bGU6ICdOdW1iZXJlZCBsaXN0JyxcbiAgfSxcbiAgJ2Jsb2NrcXVvdGUnOiB7XG4gICAgbmFtZTogJ2Jsb2NrcXVvdGUnLFxuICAgIGFjdGlvbjogJ2Jsb2NrcXVvdGUnLFxuICAgIGlubmVySFRNTDogc3ZnLmJsb2NrcXVvdGUsXG4gICAgdGl0bGU6ICdRdW90ZScsXG4gICAgaG90a2V5OiAnTW9kMi1TaGlmdC1RJyxcbiAgfSxcbiAgJ2luc2VydExpbmsnOiB7XG4gICAgbmFtZTogJ2luc2VydExpbmsnLFxuICAgIGFjdGlvbjogKGVkaXRvcikgPT4ge2lmIChlZGl0b3IuaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCgpKSBlZGl0b3Iud3JhcFNlbGVjdGlvbignWycsICddKCknKX0sXG4gICAgZW5hYmxlZDogKGVkaXRvciwgZm9jdXMsIGFuY2hvcikgPT4gZWRpdG9yLmlzSW5saW5lRm9ybWF0dGluZ0FsbG93ZWQoZm9jdXMsIGFuY2hvcikgPyBmYWxzZSA6IG51bGwsXG4gICAgaW5uZXJIVE1MOiBzdmcubGluayxcbiAgICB0aXRsZTogJ0luc2VydCBsaW5rJyxcbiAgICBob3RrZXk6ICdNb2QtSycsXG4gIH0sXG4gICdpbnNlcnRJbWFnZSc6IHtcbiAgICBuYW1lOiAnaW5zZXJ0SW1hZ2UnLFxuICAgIGFjdGlvbjogKGVkaXRvcikgPT4ge2lmIChlZGl0b3IuaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCgpKSBlZGl0b3Iud3JhcFNlbGVjdGlvbignIVsnLCAnXSgpJyl9LFxuICAgIGVuYWJsZWQ6IChlZGl0b3IsIGZvY3VzLCBhbmNob3IpID0+IGVkaXRvci5pc0lubGluZUZvcm1hdHRpbmdBbGxvd2VkKGZvY3VzLCBhbmNob3IpID8gZmFsc2UgOiBudWxsLFxuICAgIGlubmVySFRNTDogc3ZnLmltYWdlLFxuICAgIHRpdGxlOiAnSW5zZXJ0IGltYWdlJyxcbiAgICBob3RrZXk6ICdNb2QyLVNoaWZ0LUknLFxuICB9LFxuICAnaHInOiB7XG4gICAgbmFtZTogJ2hyJyxcbiAgICBhY3Rpb246IChlZGl0b3IpID0+IGVkaXRvci5wYXN0ZSgnXFxuKioqXFxuJyksXG4gICAgZW5hYmxlZDogKCkgPT4gZmFsc2UsXG4gICAgaW5uZXJIVE1MOiBzdmcuaHIsXG4gICAgdGl0bGU6ICdJbnNlcnQgaG9yaXpvbnRhbCBsaW5lJyxcbiAgICBob3RrZXk6ICdNb2QyLVNoaWZ0LUwnXG4gIH1cbn1cblxuXG5jbGFzcyBDb21tYW5kQmFyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICB0aGlzLmUgPSBudWxsO1xuICAgIHRoaXMuZWRpdG9yID0gbnVsbDtcbiAgICB0aGlzLmNvbW1hbmRzID0gW107XG4gICAgdGhpcy5idXR0b25zID0ge307XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMuaG90a2V5cyA9IFtdO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBwcm9wcy5lbGVtZW50O1xuICAgIGlmIChlbGVtZW50ICYmICFlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5lbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuYm9keTsgXG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQ29tbWFuZEJhckVsZW1lbnQoZWxlbWVudCwgcHJvcHMuY29tbWFuZHMgfHwgWydib2xkJywgJ2l0YWxpYycsICdzdHJpa2V0aHJvdWdoJywgJ3wnLCAnY29kZScsICd8JywgJ2gxJywgJ2gyJywgJ3wnLCAndWwnLCAnb2wnLCAnfCcsICdibG9ja3F1b3RlJywgJ2hyJywgJ3wnLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZSddKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlS2V5ZG93bihlKSk7XG4gICAgaWYgKHByb3BzLmVkaXRvcikgdGhpcy5zZXRFZGl0b3IocHJvcHMuZWRpdG9yKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbW1hbmRCYXJFbGVtZW50KHBhcmVudEVsZW1lbnQsIGNvbW1hbmRzKSB7XG4gICAgdGhpcy5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lLmNsYXNzTmFtZSA9ICdUTUNvbW1hbmRCYXInO1xuXG4gICAgZm9yIChsZXQgY29tbWFuZCBvZiBjb21tYW5kcykge1xuICAgICAgaWYgKGNvbW1hbmQgPT0gJ3wnKSB7XG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSAnVE1Db21tYW5kRGl2aWRlcic7XG4gICAgICAgIHRoaXMuZS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY29tbWFuZE5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgLy8gUmVmZXJlbmNlIHRvIGRlZmF1bHQgY29tbWFuZFxuXG4gICAgICAgICAgaWYgKERlZmF1bHRDb21tYW5kc1tjb21tYW5kXSkge1xuICAgICAgICAgICAgY29tbWFuZE5hbWUgPSBjb21tYW5kO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSBEZWZhdWx0Q29tbWFuZHNbY29tbWFuZE5hbWVdO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21tYW5kID09IFwib2JqZWN0XCIgJiYgY29tbWFuZC5uYW1lKSB7XG4gICAgICAgICAgY29tbWFuZE5hbWUgPSBjb21tYW5kLm5hbWU7XG4gICAgICAgICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSB7fTsgXG4gICAgICAgICAgaWYgKERlZmF1bHRDb21tYW5kc1tjb21tYW5kTmFtZV0pIE9iamVjdC5hc3NpZ24odGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0sIERlZmF1bHRDb21tYW5kc1tjb21tYW5kTmFtZV0pO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0sIGNvbW1hbmQpO1xuICAgICAgICBcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRpdGxlID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0udGl0bGUgfHwgY29tbWFuZE5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmhvdGtleSkge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXS5ob3RrZXkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAvLyBjb25zdHJ1Y3QgbW9kaWZpZXJzXG4gICAgICAgICAgbGV0IG1vZGlmaWVycyA9IFtdO1xuICAgICAgICAgIGxldCBtb2RpZmllcmV4cGxhbmF0aW9uID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgc3dpdGNoIChrZXlzW2ldKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ0N0cmwnOiBtb2RpZmllcnMucHVzaCgnY3RybEtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ0N0cmwnKTsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ0NtZCc6IG1vZGlmaWVycy5wdXNoKCdtZXRhS2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oyYJyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdBbHQnOiBtb2RpZmllcnMucHVzaCgnYWx0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgnQWx0Jyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdPcHRpb24nOiBtb2RpZmllcnMucHVzaCgnYWx0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oylJyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdXaW4nOiBtb2RpZmllcnMucHVzaCgnbWV0YUtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ+KKniBXaW4nKTsgYnJlYWs7XG5cbiAgICAgICAgICAgICAgY2FzZSAnU2hpZnQnOiAgbW9kaWZpZXJzLnB1c2goJ3NoaWZ0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oenJyk7IGJyZWFrO1xuXG4gICAgICAgICAgICAgIGNhc2UgJ01vZCc6IC8vIE1vZCBpcyBhIGNvbnZlbmllbmNlIG1lY2hhbmlzbTogQ3RybCBvbiBXaW5kb3dzLCBDbWQgb24gTWFjXG4gICAgICAgICAgICAgICAgaWYgKGlzTWFjTGlrZSkge21vZGlmaWVycy5wdXNoKCdtZXRhS2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oyYJyk7fSBcbiAgICAgICAgICAgICAgICBlbHNlIHttb2RpZmllcnMucHVzaCgnY3RybEtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ0N0cmwnKTt9IFxuICAgICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgICAgY2FzZSAnTW9kMic6IFxuICAgICAgICAgICAgICAgIG1vZGlmaWVycy5wdXNoKCdhbHRLZXknKTsgXG4gICAgICAgICAgICAgICAgaWYgKGlzTWFjTGlrZSkgbW9kaWZpZXJleHBsYW5hdGlvbi5wdXNoKCfijKUnKTtcbiAgICAgICAgICAgICAgICBlbHNlIG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgnQWx0Jyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIE1vZDIgaXMgYSBjb252ZW5pZW5jZSBtZWNoYW5pc206IEFsdCBvbiBXaW5kb3dzLCBPcHRpb24gb24gTWFjXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaChrZXlzW2tleXMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgIGxldCBob3RrZXkgPSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZE5hbWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICAvLyBUT0RPIFJpZ2h0IG5vdyB0aGlzIGlzIHdvcmtpbmcgb25seSBmb3IgbGV0dGVycyBhbmQgbnVtYmVyc1xuICAgICAgICAgIGlmIChrZXlzW2tleXMubGVuZ3RoIC0gMV0ubWF0Y2goL15bMC05XSQvKSkge1xuICAgICAgICAgICAgaG90a2V5LmNvZGUgPSBgRGlnaXQke2tleXNba2V5cy5sZW5ndGggLSAxXX1gO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob3RrZXkua2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaG90a2V5cy5wdXNoKGhvdGtleSk7XG4gICAgICAgICAgdGl0bGUgPSB0aXRsZS5jb25jYXQoYCAoJHttb2RpZmllcmV4cGxhbmF0aW9uLmpvaW4oJysnKX0pYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZE5hbWVdID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uY2xhc3NOYW1lID0gJ1RNQ29tbWFuZEJ1dHRvbiBUTUNvbW1hbmRCdXR0b25fRGlzYWJsZWQnO1xuICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZE5hbWVdLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uaW5uZXJIVE1MID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0uaW5uZXJIVE1MO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlQ2xpY2soY29tbWFuZE5hbWUsIGUpKTtcbiAgICAgICAgdGhpcy5lLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZSk7XG4gIH1cblxuICBoYW5kbGVDbGljayhjb21tYW5kTmFtZSwgZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yKSByZXR1cm47XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodHlwZW9mIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbiA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtjb21tYW5kTmFtZV0gPT09IGZhbHNlKSB0aGlzLmVkaXRvci5zZXRDb21tYW5kU3RhdGUoY29tbWFuZE5hbWUsIHRydWUpO1xuICAgICAgZWxzZSB0aGlzLmVkaXRvci5zZXRDb21tYW5kU3RhdGUoY29tbWFuZE5hbWUsIGZhbHNlKTsgIFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbih0aGlzLmVkaXRvcik7XG4gICAgfVxuICB9XG5cbiAgc2V0RWRpdG9yKGVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIGVkaXRvci5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb24nLCAoZSkgPT4gdGhpcy5oYW5kbGVTZWxlY3Rpb24oZSkpO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNvbW1hbmRTdGF0ZSkge1xuICAgICAgZm9yIChsZXQgY29tbWFuZCBpbiB0aGlzLmNvbW1hbmRzKSB7XG4gICAgICAgIGlmIChldmVudC5jb21tYW5kU3RhdGVbY29tbWFuZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRzW2NvbW1hbmRdLmVuYWJsZWQpIHRoaXMuc3RhdGVbY29tbWFuZF0gPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmRdLmVuYWJsZWQodGhpcy5lZGl0b3IsIGV2ZW50LmZvY3VzLCBldmVudC5hbmNob3IpO1xuICAgICAgICAgIGVsc2UgdGhpcy5zdGF0ZVtjb21tYW5kXSA9IGV2ZW50LmZvY3VzID8gZmFsc2UgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RhdGVbY29tbWFuZF0gPSBldmVudC5jb21tYW5kU3RhdGVbY29tbWFuZF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0ZVtjb21tYW5kXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kXS5jbGFzc05hbWUgPSAnVE1Db21tYW5kQnV0dG9uIFRNQ29tbWFuZEJ1dHRvbl9BY3RpdmUnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGVbY29tbWFuZF0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5idXR0b25zW2NvbW1hbmRdLmNsYXNzTmFtZSA9ICdUTUNvbW1hbmRCdXR0b24gVE1Db21tYW5kQnV0dG9uX0luYWN0aXZlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZF0uY2xhc3NOYW1lID0gICdUTUNvbW1hbmRCdXR0b24gVE1Db21tYW5kQnV0dG9uX0Rpc2FibGVkJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZXZlbnQpIHtcbiAgICBvdXRlcjogZm9yIChsZXQgaG90a2V5IG9mIHRoaXMuaG90a2V5cykge1xuICAgICAgaWYgKChob3RrZXkua2V5ICYmIGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpID09IGhvdGtleS5rZXkpIHx8IChob3RrZXkuY29kZSAmJiBldmVudC5jb2RlID09IGhvdGtleS5jb2RlKSkge1xuICAgICAgICAvLyBLZXkgbWF0Y2hlcyBob3RrZXkuIExvb2sgZm9yIGFueSByZXF1aXJlZCBtb2RpZmllciB0aGF0IHdhc24ndCBwcmVzc2VkXG4gICAgICAgIGZvciAobGV0IG1vZGlmaWVyIG9mIGhvdGtleS5tb2RpZmllcnMpIHtcbiAgICAgICAgICBpZiAoIWV2ZW50W21vZGlmaWVyXSkgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXZlcnl0aGluZyBtYXRjaGVzLlxuICAgICAgICB0aGlzLmhhbmRsZUNsaWNrKGhvdGtleS5jb21tYW5kLCBldmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tbWFuZEJhcjsiLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgb2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cycpO1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnRpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsZW5ndGggPiBpbmRleCkgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihPLCBrZXkgPSBrZXlzW2luZGV4KytdLCBQcm9wZXJ0aWVzW2tleV0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdkb2N1bWVudCcsICdkb2N1bWVudEVsZW1lbnQnKTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcblxudmFyIEdUID0gJz4nO1xudmFyIExUID0gJzwnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFNDUklQVCA9ICdzY3JpcHQnO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcblxudmFyIHNjcmlwdFRhZyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIHJldHVybiBMVCArIFNDUklQVCArIEdUICsgY29udGVudCArIExUICsgJy8nICsgU0NSSVBUICsgR1Q7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgQWN0aXZlWCBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVggPSBmdW5jdGlvbiAoYWN0aXZlWERvY3VtZW50KSB7XG4gIGFjdGl2ZVhEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJycpKTtcbiAgYWN0aXZlWERvY3VtZW50LmNsb3NlKCk7XG4gIHZhciB0ZW1wID0gYWN0aXZlWERvY3VtZW50LnBhcmVudFdpbmRvdy5PYmplY3Q7XG4gIGFjdGl2ZVhEb2N1bWVudCA9IG51bGw7IC8vIGF2b2lkIG1lbW9yeSBsZWFrXG4gIHJldHVybiB0ZW1wO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBKUyA9ICdqYXZhJyArIFNDUklQVCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNDc1XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoSlMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnZG9jdW1lbnQuRj1PYmplY3QnKSk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIHJldHVybiBpZnJhbWVEb2N1bWVudC5GO1xufTtcblxuLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuLy8gTm8gbmVlZCB0byB1c2UgYWN0aXZlIHggYXBwcm9hY2ggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgbm90IHNldFxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4vLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuLy8gYXZvaWQgSUUgR0MgYnVnXG52YXIgYWN0aXZlWERvY3VtZW50O1xudmFyIE51bGxQcm90b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAqL1xuICAgIGFjdGl2ZVhEb2N1bWVudCA9IGRvY3VtZW50LmRvbWFpbiAmJiBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogaWdub3JlICovIH1cbiAgTnVsbFByb3RvT2JqZWN0ID0gYWN0aXZlWERvY3VtZW50ID8gTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpIDogTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lKCk7XG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkgZGVsZXRlIE51bGxQcm90b09iamVjdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gTnVsbFByb3RvT2JqZWN0KCk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cbi8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5jcmVhdGVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eUNvbnN0cnVjdG9yKCk7XG4gICAgRW1wdHlDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBOdWxsUHJvdG9PYmplY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbnZhciBVTlNDT1BBQkxFUyA9IHdlbGxLbm93blN5bWJvbCgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuaWYgKEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHtcbiAgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihBcnJheVByb3RvdHlwZSwgVU5TQ09QQUJMRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgdmFsdWU6IGNyZWF0ZShudWxsKVxuICB9KTtcbn1cblxuLy8gYWRkIGEga2V5IHRvIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGNhY2hlID0ge307XG5cbnZhciB0aHJvd2VyID0gZnVuY3Rpb24gKGl0KSB7IHRocm93IGl0OyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgb3B0aW9ucykge1xuICBpZiAoaGFzKGNhY2hlLCBNRVRIT0RfTkFNRSkpIHJldHVybiBjYWNoZVtNRVRIT0RfTkFNRV07XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICB2YXIgQUNDRVNTT1JTID0gaGFzKG9wdGlvbnMsICdBQ0NFU1NPUlMnKSA/IG9wdGlvbnMuQUNDRVNTT1JTIDogZmFsc2U7XG4gIHZhciBhcmd1bWVudDAgPSBoYXMob3B0aW9ucywgMCkgPyBvcHRpb25zWzBdIDogdGhyb3dlcjtcbiAgdmFyIGFyZ3VtZW50MSA9IGhhcyhvcHRpb25zLCAxKSA/IG9wdGlvbnNbMV0gOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIGNhY2hlW01FVEhPRF9OQU1FXSA9ICEhbWV0aG9kICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEFDQ0VTU09SUyAmJiAhREVTQ1JJUFRPUlMpIHJldHVybiB0cnVlO1xuICAgIHZhciBPID0geyBsZW5ndGg6IC0xIH07XG5cbiAgICBpZiAoQUNDRVNTT1JTKSBkZWZpbmVQcm9wZXJ0eShPLCAxLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogdGhyb3dlciB9KTtcbiAgICBlbHNlIE9bMV0gPSAxO1xuXG4gICAgbWV0aG9kLmNhbGwoTywgYXJndW1lbnQwLCBhcmd1bWVudDEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkaW5jbHVkZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmNsdWRlcztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcycpO1xudmFyIGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC11c2VzLXRvLWxlbmd0aCcpO1xuXG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnaW5kZXhPZicsIHsgQUNDRVNTT1JTOiB0cnVlLCAxOiAwIH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS1AQHVuc2NvcGFibGVzXG5hZGRUb1Vuc2NvcGFibGVzKCdpbmNsdWRlcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBhcnJheVNwZWNpZXNDcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHknKTtcbnZhciBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1oYXMtc3BlY2llcy1zdXBwb3J0Jyk7XG52YXIgYXJyYXlNZXRob2RVc2VzVG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoJyk7XG5cbnZhciBIQVNfU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnc3BsaWNlJyk7XG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnc3BsaWNlJywgeyBBQ0NFU1NPUlM6IHRydWUsIDA6IDAsIDE6IDIgfSk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfTEVOR1RIX0VYQ0VFREVEID0gJ01heGltdW0gYWxsb3dlZCBsZW5ndGggZXhjZWVkZWQnO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnNwbGljZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc3BsaWNlXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50IC8qICwgLi4uaXRlbXMgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGFjdHVhbFN0YXJ0ID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW4pO1xuICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpbnNlcnRDb3VudCwgYWN0dWFsRGVsZXRlQ291bnQsIEEsIGssIGZyb20sIHRvO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPT09IDApIHtcbiAgICAgIGluc2VydENvdW50ID0gYWN0dWFsRGVsZXRlQ291bnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAxKSB7XG4gICAgICBpbnNlcnRDb3VudCA9IDA7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IGxlbiAtIGFjdHVhbFN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRDb3VudCA9IGFyZ3VtZW50c0xlbmd0aCAtIDI7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IG1pbihtYXgodG9JbnRlZ2VyKGRlbGV0ZUNvdW50KSwgMCksIGxlbiAtIGFjdHVhbFN0YXJ0KTtcbiAgICB9XG4gICAgaWYgKGxlbiArIGluc2VydENvdW50IC0gYWN0dWFsRGVsZXRlQ291bnQgPiBNQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCk7XG4gICAgfVxuICAgIEEgPSBhcnJheVNwZWNpZXNDcmVhdGUoTywgYWN0dWFsRGVsZXRlQ291bnQpO1xuICAgIGZvciAoayA9IDA7IGsgPCBhY3R1YWxEZWxldGVDb3VudDsgaysrKSB7XG4gICAgICBmcm9tID0gYWN0dWFsU3RhcnQgKyBrO1xuICAgICAgaWYgKGZyb20gaW4gTykgY3JlYXRlUHJvcGVydHkoQSwgaywgT1tmcm9tXSk7XG4gICAgfVxuICAgIEEubGVuZ3RoID0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgaWYgKGluc2VydENvdW50IDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgIGZvciAoayA9IGFjdHVhbFN0YXJ0OyBrIDwgbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsrKykge1xuICAgICAgICBmcm9tID0gayArIGFjdHVhbERlbGV0ZUNvdW50O1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudDtcbiAgICAgICAgaWYgKGZyb20gaW4gTykgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIH1cbiAgICAgIGZvciAoayA9IGxlbjsgayA+IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7IGstLSkgZGVsZXRlIE9bayAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaW5zZXJ0Q291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgZm9yIChrID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsgPiBhY3R1YWxTdGFydDsgay0tKSB7XG4gICAgICAgIGZyb20gPSBrICsgYWN0dWFsRGVsZXRlQ291bnQgLSAxO1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudCAtIDE7XG4gICAgICAgIGlmIChmcm9tIGluIE8pIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoayA9IDA7IGsgPCBpbnNlcnRDb3VudDsgaysrKSB7XG4gICAgICBPW2sgKyBhY3R1YWxTdGFydF0gPSBhcmd1bWVudHNbayArIDJdO1xuICAgIH1cbiAgICBPLmxlbmd0aCA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xuIiwidmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXJlZ2V4cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXNSZWdFeHAoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiVGhlIG1ldGhvZCBkb2Vzbid0IGFjY2VwdCByZWd1bGFyIGV4cHJlc3Npb25zXCIpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgdmFyIHJlZ2V4cCA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICByZWdleHBbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gJy8uLydbTUVUSE9EX05BTUVdKHJlZ2V4cCk7XG4gICAgfSBjYXRjaCAoZikgeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIG5vdEFSZWdFeHAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbm90LWEtcmVnZXhwJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciBjb3JyZWN0SXNSZWdFeHBMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LWlzLXJlZ2V4cC1sb2dpYycpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogIWNvcnJlY3RJc1JlZ0V4cExvZ2ljKCdpbmNsdWRlcycpIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHJldHVybiAhIX5TdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKSlcbiAgICAgIC5pbmRleE9mKG5vdEFSZWdFeHAoc2VhcmNoU3RyaW5nKSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmaXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MUyA9IC9cXCQoWyQmJ2BdfFxcZFxcZD98PFtePl0qPikvZztcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCA9IC9cXCQoWyQmJ2BdfFxcZFxcZD8pL2c7XG5cbnZhciBtYXliZVRvU3RyaW5nID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gaXQgOiBTdHJpbmcoaXQpO1xufTtcblxuLy8gQEByZXBsYWNlIGxvZ2ljXG5maXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYygncmVwbGFjZScsIDIsIGZ1bmN0aW9uIChSRVBMQUNFLCBuYXRpdmVSZXBsYWNlLCBtYXliZUNhbGxOYXRpdmUsIHJlYXNvbikge1xuICB2YXIgUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUgPSByZWFzb24uUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkU7XG4gIHZhciBSRVBMQUNFX0tFRVBTXyQwID0gcmVhc29uLlJFUExBQ0VfS0VFUFNfJDA7XG4gIHZhciBVTlNBRkVfU1VCU1RJVFVURSA9IFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID8gJyQnIDogJyQwJztcblxuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUucmVwbGFjZVxuICAgIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIHJlcGxhY2VyID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgICByZXR1cm4gcmVwbGFjZXIgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHJlcGxhY2VyLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgICAgOiBuYXRpdmVSZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEByZXBsYWNlXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICBpZiAoXG4gICAgICAgICghUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUgJiYgUkVQTEFDRV9LRUVQU18kMCkgfHxcbiAgICAgICAgKHR5cGVvZiByZXBsYWNlVmFsdWUgPT09ICdzdHJpbmcnICYmIHJlcGxhY2VWYWx1ZS5pbmRleE9mKFVOU0FGRV9TVUJTVElUVVRFKSA9PT0gLTEpXG4gICAgICApIHtcbiAgICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVSZXBsYWNlLCByZWdleHAsIHRoaXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuXG4gICAgICB2YXIgZnVuY3Rpb25hbFJlcGxhY2UgPSB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFmdW5jdGlvbmFsUmVwbGFjZSkgcmVwbGFjZVZhbHVlID0gU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG5cbiAgICAgIHZhciBnbG9iYWwgPSByeC5nbG9iYWw7XG4gICAgICBpZiAoZ2xvYmFsKSB7XG4gICAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSBicmVhaztcblxuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuXG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWNjdW11bGF0ZWRSZXN1bHQgPSAnJztcbiAgICAgIHZhciBuZXh0U291cmNlUG9zaXRpb24gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG5cbiAgICAgICAgdmFyIG1hdGNoZWQgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gbWF4KG1pbih0b0ludGVnZXIocmVzdWx0LmluZGV4KSwgUy5sZW5ndGgpLCAwKTtcbiAgICAgICAgdmFyIGNhcHR1cmVzID0gW107XG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgZXF1aXZhbGVudCB0b1xuICAgICAgICAvLyAgIGNhcHR1cmVzID0gcmVzdWx0LnNsaWNlKDEpLm1hcChtYXliZVRvU3RyaW5nKVxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIGBuYXRpdmVTbGljZS5jYWxsKHJlc3VsdCwgMSwgcmVzdWx0Lmxlbmd0aClgIChjYWxsZWQgaW5cbiAgICAgICAgLy8gdGhlIHNsaWNlIHBvbHlmaWxsIHdoZW4gc2xpY2luZyBuYXRpdmUgYXJyYXlzKSBcImRvZXNuJ3Qgd29ya1wiIGluIHNhZmFyaSA5IGFuZFxuICAgICAgICAvLyBjYXVzZXMgYSBjcmFzaCAoaHR0cHM6Ly9wYXN0ZWJpbi5jb20vTjIxUXplUUEpIHdoZW4gdHJ5aW5nIHRvIGRlYnVnIGl0LlxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykgY2FwdHVyZXMucHVzaChtYXliZVRvU3RyaW5nKHJlc3VsdFtqXSkpO1xuICAgICAgICB2YXIgbmFtZWRDYXB0dXJlcyA9IHJlc3VsdC5ncm91cHM7XG4gICAgICAgIGlmIChmdW5jdGlvbmFsUmVwbGFjZSkge1xuICAgICAgICAgIHZhciByZXBsYWNlckFyZ3MgPSBbbWF0Y2hlZF0uY29uY2F0KGNhcHR1cmVzLCBwb3NpdGlvbiwgUyk7XG4gICAgICAgICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkgcmVwbGFjZXJBcmdzLnB1c2gobmFtZWRDYXB0dXJlcyk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0c3Vic3RpdHV0aW9uXG4gIGZ1bmN0aW9uIGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBzdHIsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZW1lbnQpIHtcbiAgICB2YXIgdGFpbFBvcyA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgdmFyIG0gPSBjYXB0dXJlcy5sZW5ndGg7XG4gICAgdmFyIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRDtcbiAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuYW1lZENhcHR1cmVzID0gdG9PYmplY3QobmFtZWRDYXB0dXJlcyk7XG4gICAgICBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFM7XG4gICAgfVxuICAgIHJldHVybiBuYXRpdmVSZXBsYWNlLmNhbGwocmVwbGFjZW1lbnQsIHN5bWJvbHMsIGZ1bmN0aW9uIChtYXRjaCwgY2gpIHtcbiAgICAgIHZhciBjYXB0dXJlO1xuICAgICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgICAgY2FzZSAnJCc6IHJldHVybiAnJCc7XG4gICAgICAgIGNhc2UgJyYnOiByZXR1cm4gbWF0Y2hlZDtcbiAgICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICBjYXNlIFwiJ1wiOiByZXR1cm4gc3RyLnNsaWNlKHRhaWxQb3MpO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBcXGRcXGQ/XG4gICAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgICAgaWYgKG4gPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICBpZiAobiA+IG0pIHtcbiAgICAgICAgICAgIHZhciBmID0gZmxvb3IobiAvIDEwKTtcbiAgICAgICAgICAgIGlmIChmID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICBpZiAoZiA8PSBtKSByZXR1cm4gY2FwdHVyZXNbZiAtIDFdID09PSB1bmRlZmluZWQgPyBjaC5jaGFyQXQoMSkgOiBjYXB0dXJlc1tmIC0gMV0gKyBjaC5jaGFyQXQoMSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tuIC0gMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FwdHVyZSA9PT0gdW5kZWZpbmVkID8gJycgOiBjYXB0dXJlO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIi8vIGEgc3RyaW5nIG9mIGFsbCB2YWxpZCB1bmljb2RlIHdoaXRlc3BhY2VzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxubW9kdWxlLmV4cG9ydHMgPSAnXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcXHUyMDI5XFx1RkVGRic7XG4iLCJ2YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciB3aGl0ZXNwYWNlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93aGl0ZXNwYWNlcycpO1xuXG52YXIgd2hpdGVzcGFjZSA9ICdbJyArIHdoaXRlc3BhY2VzICsgJ10nO1xudmFyIGx0cmltID0gUmVnRXhwKCdeJyArIHdoaXRlc3BhY2UgKyB3aGl0ZXNwYWNlICsgJyonKTtcbnZhciBydHJpbSA9IFJlZ0V4cCh3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW0sIHRyaW1TdGFydCwgdHJpbUVuZCwgdHJpbUxlZnQsIHRyaW1SaWdodCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcykge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSgkdGhpcykpO1xuICAgIGlmIChUWVBFICYgMSkgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobHRyaW0sICcnKTtcbiAgICBpZiAoVFlQRSAmIDIpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1MZWZ0LCB0cmltU3RhcnQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1zdGFydFxuICBzdGFydDogY3JlYXRlTWV0aG9kKDEpLFxuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1SaWdodCwgdHJpbUVuZCB9YCBtZXRob2RzXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbWVuZFxuICBlbmQ6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUudHJpbWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbVxuICB0cmltOiBjcmVhdGVNZXRob2QoMylcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciB3aGl0ZXNwYWNlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93aGl0ZXNwYWNlcycpO1xuXG52YXIgbm9uID0gJ1xcdTIwMEJcXHUwMDg1XFx1MTgwRSc7XG5cbi8vIGNoZWNrIHRoYXQgYSBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgY29ycmVjdCBsaXN0XG4vLyBvZiB3aGl0ZXNwYWNlcyBhbmQgaGFzIGEgY29ycmVjdCBuYW1lXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICByZXR1cm4gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXdoaXRlc3BhY2VzW01FVEhPRF9OQU1FXSgpIHx8IG5vbltNRVRIT0RfTkFNRV0oKSAhPSBub24gfHwgd2hpdGVzcGFjZXNbTUVUSE9EX05BTUVdLm5hbWUgIT09IE1FVEhPRF9OQU1FO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkdHJpbSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbScpLnRyaW07XG52YXIgZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbS1mb3JjZWQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUudHJpbWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiQoeyB0YXJnZXQ6ICdTdHJpbmcnLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBmb3JjZWRTdHJpbmdUcmltTWV0aG9kKCd0cmltJykgfSwge1xuICB0cmltOiBmdW5jdGlvbiB0cmltKCkge1xuICAgIHJldHVybiAkdHJpbSh0aGlzKTtcbiAgfVxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxudmFyIEZBSUxTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IG5hdGl2ZUtleXMoMSk7IH0pO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmtleXNcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IEZBSUxTX09OX1BSSU1JVElWRVMgfSwge1xuICBrZXlzOiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXModG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpICYmIGl0ICE9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3Qgc2V0IFwiICsgU3RyaW5nKGl0KSArICcgYXMgYSBwcm90b3R5cGUnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGFQb3NzaWJsZVByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLXBvc3NpYmxlLXByb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LnNldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5zZXRwcm90b3R5cGVvZlxuLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gZnVuY3Rpb24gKCkge1xuICB2YXIgQ09SUkVDVF9TRVRURVIgPSBmYWxzZTtcbiAgdmFyIHRlc3QgPSB7fTtcbiAgdmFyIHNldHRlcjtcbiAgdHJ5IHtcbiAgICBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgc2V0dGVyLmNhbGwodGVzdCwgW10pO1xuICAgIENPUlJFQ1RfU0VUVEVSID0gdGVzdCBpbnN0YW5jZW9mIEFycmF5O1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgIGFuT2JqZWN0KE8pO1xuICAgIGFQb3NzaWJsZVByb3RvdHlwZShwcm90byk7XG4gICAgaWYgKENPUlJFQ1RfU0VUVEVSKSBzZXR0ZXIuY2FsbChPLCBwcm90byk7XG4gICAgZWxzZSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBPO1xuICB9O1xufSgpIDogdW5kZWZpbmVkKTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZicpO1xuXG4vLyBtYWtlcyBzdWJjbGFzc2luZyB3b3JrIGNvcnJlY3QgZm9yIHdyYXBwZWQgYnVpbHQtaW5zXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdGhpcywgZHVtbXksIFdyYXBwZXIpIHtcbiAgdmFyIE5ld1RhcmdldCwgTmV3VGFyZ2V0UHJvdG90eXBlO1xuICBpZiAoXG4gICAgLy8gaXQgY2FuIHdvcmsgb25seSB3aXRoIG5hdGl2ZSBgc2V0UHJvdG90eXBlT2ZgXG4gICAgc2V0UHJvdG90eXBlT2YgJiZcbiAgICAvLyB3ZSBoYXZlbid0IGNvbXBsZXRlbHkgY29ycmVjdCBwcmUtRVM2IHdheSBmb3IgZ2V0dGluZyBgbmV3LnRhcmdldGAsIHNvIHVzZSB0aGlzXG4gICAgdHlwZW9mIChOZXdUYXJnZXQgPSBkdW1teS5jb25zdHJ1Y3RvcikgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIE5ld1RhcmdldCAhPT0gV3JhcHBlciAmJlxuICAgIGlzT2JqZWN0KE5ld1RhcmdldFByb3RvdHlwZSA9IE5ld1RhcmdldC5wcm90b3R5cGUpICYmXG4gICAgTmV3VGFyZ2V0UHJvdG90eXBlICE9PSBXcmFwcGVyLnByb3RvdHlwZVxuICApIHNldFByb3RvdHlwZU9mKCR0aGlzLCBOZXdUYXJnZXRQcm90b3R5cGUpO1xuICByZXR1cm4gJHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SX05BTUUpIHtcbiAgdmFyIENvbnN0cnVjdG9yID0gZ2V0QnVpbHRJbihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgQ29uc3RydWN0b3IgJiYgIUNvbnN0cnVjdG9yW1NQRUNJRVNdKSB7XG4gICAgZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFNQRUNJRVMsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICAgIH0pO1xuICB9XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5JykuZjtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJykuZjtcbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1yZWdleHAnKTtcbnZhciBnZXRGbGFncyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZmxhZ3MnKTtcbnZhciBzdGlja3lIZWxwZXJzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1zdGlja3ktaGVscGVycycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBzZXRJbnRlcm5hbFN0YXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJykuc2V0O1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LXNwZWNpZXMnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIE1BVENIID0gd2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xudmFyIE5hdGl2ZVJlZ0V4cCA9IGdsb2JhbC5SZWdFeHA7XG52YXIgUmVnRXhwUHJvdG90eXBlID0gTmF0aXZlUmVnRXhwLnByb3RvdHlwZTtcbnZhciByZTEgPSAvYS9nO1xudmFyIHJlMiA9IC9hL2c7XG5cbi8vIFwibmV3XCIgc2hvdWxkIGNyZWF0ZSBhIG5ldyBvYmplY3QsIG9sZCB3ZWJraXQgYnVnXG52YXIgQ09SUkVDVF9ORVcgPSBuZXcgTmF0aXZlUmVnRXhwKHJlMSkgIT09IHJlMTtcblxudmFyIFVOU1VQUE9SVEVEX1kgPSBzdGlja3lIZWxwZXJzLlVOU1VQUE9SVEVEX1k7XG5cbnZhciBGT1JDRUQgPSBERVNDUklQVE9SUyAmJiBpc0ZvcmNlZCgnUmVnRXhwJywgKCFDT1JSRUNUX05FVyB8fCBVTlNVUFBPUlRFRF9ZIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmUyW01BVENIXSA9IGZhbHNlO1xuICAvLyBSZWdFeHAgY29uc3RydWN0b3IgY2FuIGFsdGVyIGZsYWdzIGFuZCBJc1JlZ0V4cCB3b3JrcyBjb3JyZWN0IHdpdGggQEBtYXRjaFxuICByZXR1cm4gTmF0aXZlUmVnRXhwKHJlMSkgIT0gcmUxIHx8IE5hdGl2ZVJlZ0V4cChyZTIpID09IHJlMiB8fCBOYXRpdmVSZWdFeHAocmUxLCAnaScpICE9ICcvYS9pJztcbn0pKSk7XG5cbi8vIGBSZWdFeHBgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAtY29uc3RydWN0b3JcbmlmIChGT1JDRUQpIHtcbiAgdmFyIFJlZ0V4cFdyYXBwZXIgPSBmdW5jdGlvbiBSZWdFeHAocGF0dGVybiwgZmxhZ3MpIHtcbiAgICB2YXIgdGhpc0lzUmVnRXhwID0gdGhpcyBpbnN0YW5jZW9mIFJlZ0V4cFdyYXBwZXI7XG4gICAgdmFyIHBhdHRlcm5Jc1JlZ0V4cCA9IGlzUmVnRXhwKHBhdHRlcm4pO1xuICAgIHZhciBmbGFnc0FyZVVuZGVmaW5lZCA9IGZsYWdzID09PSB1bmRlZmluZWQ7XG4gICAgdmFyIHN0aWNreTtcblxuICAgIGlmICghdGhpc0lzUmVnRXhwICYmIHBhdHRlcm5Jc1JlZ0V4cCAmJiBwYXR0ZXJuLmNvbnN0cnVjdG9yID09PSBSZWdFeHBXcmFwcGVyICYmIGZsYWdzQXJlVW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9XG5cbiAgICBpZiAoQ09SUkVDVF9ORVcpIHtcbiAgICAgIGlmIChwYXR0ZXJuSXNSZWdFeHAgJiYgIWZsYWdzQXJlVW5kZWZpbmVkKSBwYXR0ZXJuID0gcGF0dGVybi5zb3VyY2U7XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwV3JhcHBlcikge1xuICAgICAgaWYgKGZsYWdzQXJlVW5kZWZpbmVkKSBmbGFncyA9IGdldEZsYWdzLmNhbGwocGF0dGVybik7XG4gICAgICBwYXR0ZXJuID0gcGF0dGVybi5zb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKFVOU1VQUE9SVEVEX1kpIHtcbiAgICAgIHN0aWNreSA9ICEhZmxhZ3MgJiYgZmxhZ3MuaW5kZXhPZigneScpID4gLTE7XG4gICAgICBpZiAoc3RpY2t5KSBmbGFncyA9IGZsYWdzLnJlcGxhY2UoL3kvZywgJycpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBpbmhlcml0SWZSZXF1aXJlZChcbiAgICAgIENPUlJFQ1RfTkVXID8gbmV3IE5hdGl2ZVJlZ0V4cChwYXR0ZXJuLCBmbGFncykgOiBOYXRpdmVSZWdFeHAocGF0dGVybiwgZmxhZ3MpLFxuICAgICAgdGhpc0lzUmVnRXhwID8gdGhpcyA6IFJlZ0V4cFByb3RvdHlwZSxcbiAgICAgIFJlZ0V4cFdyYXBwZXJcbiAgICApO1xuXG4gICAgaWYgKFVOU1VQUE9SVEVEX1kgJiYgc3RpY2t5KSBzZXRJbnRlcm5hbFN0YXRlKHJlc3VsdCwgeyBzdGlja3k6IHN0aWNreSB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBrZXkgaW4gUmVnRXhwV3JhcHBlciB8fCBkZWZpbmVQcm9wZXJ0eShSZWdFeHBXcmFwcGVyLCBrZXksIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gTmF0aXZlUmVnRXhwW2tleV07IH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChpdCkgeyBOYXRpdmVSZWdFeHBba2V5XSA9IGl0OyB9XG4gICAgfSk7XG4gIH07XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhOYXRpdmVSZWdFeHApO1xuICB2YXIgaW5kZXggPSAwO1xuICB3aGlsZSAoa2V5cy5sZW5ndGggPiBpbmRleCkgcHJveHkoa2V5c1tpbmRleCsrXSk7XG4gIFJlZ0V4cFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlZ0V4cFdyYXBwZXI7XG4gIFJlZ0V4cFdyYXBwZXIucHJvdG90eXBlID0gUmVnRXhwUHJvdG90eXBlO1xuICByZWRlZmluZShnbG9iYWwsICdSZWdFeHAnLCBSZWdFeHBXcmFwcGVyKTtcbn1cblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC1AQHNwZWNpZXNcbnNldFNwZWNpZXMoJ1JlZ0V4cCcpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgb2JqZWN0RGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIHJlZ0V4cEZsYWdzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1mbGFncycpO1xudmFyIFVOU1VQUE9SVEVEX1kgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLXN0aWNreS1oZWxwZXJzJykuVU5TVVBQT1JURURfWTtcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NgIGdldHRlclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC5wcm90b3R5cGUuZmxhZ3NcbmlmIChERVNDUklQVE9SUyAmJiAoLy4vZy5mbGFncyAhPSAnZycgfHwgVU5TVVBQT1JURURfWSkpIHtcbiAgb2JqZWN0RGVmaW5lUHJvcGVydHlNb2R1bGUuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogcmVnRXhwRmxhZ3NcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGZsYWdzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1mbGFncycpO1xuXG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBSZWdFeHBQcm90b3R5cGUgPSBSZWdFeHAucHJvdG90eXBlO1xudmFyIG5hdGl2ZVRvU3RyaW5nID0gUmVnRXhwUHJvdG90eXBlW1RPX1NUUklOR107XG5cbnZhciBOT1RfR0VORVJJQyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5hdGl2ZVRvU3RyaW5nLmNhbGwoeyBzb3VyY2U6ICdhJywgZmxhZ3M6ICdiJyB9KSAhPSAnL2EvYic7IH0pO1xuLy8gRkY0NC0gUmVnRXhwI3RvU3RyaW5nIGhhcyBhIHdyb25nIG5hbWVcbnZhciBJTkNPUlJFQ1RfTkFNRSA9IG5hdGl2ZVRvU3RyaW5nLm5hbWUgIT0gVE9fU1RSSU5HO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG5pZiAoTk9UX0dFTkVSSUMgfHwgSU5DT1JSRUNUX05BTUUpIHtcbiAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHZhciBwID0gU3RyaW5nKFIuc291cmNlKTtcbiAgICB2YXIgcmYgPSBSLmZsYWdzO1xuICAgIHZhciBmID0gU3RyaW5nKHJmID09PSB1bmRlZmluZWQgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiAhKCdmbGFncycgaW4gUmVnRXhwUHJvdG90eXBlKSA/IGZsYWdzLmNhbGwoUikgOiByZik7XG4gICAgcmV0dXJuICcvJyArIHAgKyAnLycgKyBmO1xuICB9LCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cbiIsIi8vIGNvbnN0IHJlcGxhY2VtZW50cyA9IHtcbi8vICAgQVNDSUlQdW5jdHVhdGlvbjogJyFcIiMkJSZcXCcoKSorLFxcXFwtLi86Ozw9Pj9AXFxcXFtcXFxcXV5fYHt8fX4nLFxuLy8gICBUcmlnZ2VyQ2hhcnM6ICdgX1xcKlxcW1xcXVxcKFxcKScsXG4vLyAgIFNjaGVtZTogYFtBLVphLXpdW0EtWmEtejAtOVxcK1xcLlxcLV17MSwzMX1gLFxuLy8gICBFbWFpbDogYFthLXpBLVowLTkuISMkJSYnKisvPT9eX1xcYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKmAsIC8vIEZyb20gQ29tbW9uTWFyayBzcGVjXG5cbi8vIH1cbmNvbnN0IHJlcGxhY2VtZW50cyA9IHtcbiAgQVNDSUlQdW5jdHVhdGlvbjogL1shXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXV5fYHt8fX5cXFxcXS8sICBcbiAgTm90VHJpZ2dlckNoYXI6IC9bXmBfKltcXF0oKTw+IX5dLyxcbiAgU2NoZW1lOiAvW0EtWmEtel1bQS1aYS16MC05Ky4tXXsxLDMxfS8sXG4gIEVtYWlsOiAvW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSovLCAvLyBGcm9tIENvbW1vbk1hcmsgc3BlY1xuICBIVE1MT3BlblRhZzogLzxIVE1MVGFnTmFtZSg/OkhUTUxBdHRyaWJ1dGUpKlxccypcXC8/Pi8sXG4gIEhUTUxDbG9zZVRhZzogLzxcXC9IVE1MVGFnTmFtZVxccyo+LyxcbiAgSFRNTFRhZ05hbWU6IC9bQS1aYS16XVtBLVphLXowLTktXSovLCBcbiAgSFRNTENvbW1lbnQ6IC88IS0tKD86W14+LV18KD86W14+LV0oPzpbXi1dfC1bXi1dKSpbXi1dKSktLT4vLFxuICBIVE1MUEk6IC88XFw/KD86fC58KD86W14/XXxcXD9bXj5dKSopXFw/Pi8sXG4gIEhUTUxEZWNsYXJhdGlvbjogLzwhW0EtWl0rXFxzW14+XSo+LyxcbiAgSFRNTENEQVRBOiAvPCFcXFtDREFUQVxcWy4qP1xcXVxcXT4vLFxuICBIVE1MQXR0cmlidXRlOiAvXFxzK1tBLVphLXpfOl1bQS1aYS16MC05Xy46LV0qKD86SFRNTEF0dFZhbHVlKT8vLFxuICBIVE1MQXR0VmFsdWU6IC9cXHMqPVxccyooPzooPzonW14nXSonKXwoPzpcIlteXCJdKlwiKXwoPzpbXlxcc1wiJz08PmBdKykpLyxcbiAgS25vd25UYWc6IC9hZGRyZXNzfGFydGljbGV8YXNpZGV8YmFzZXxiYXNlZm9udHxibG9ja3F1b3RlfGJvZHl8Y2FwdGlvbnxjZW50ZXJ8Y29sfGNvbGdyb3VwfGRkfGRldGFpbHN8ZGlhbG9nfGRpcnxkaXZ8ZGx8ZHR8ZmllbGRzZXR8ZmlnY2FwdGlvbnxmaWd1cmV8Zm9vdGVyfGZvcm18ZnJhbWV8ZnJhbWVzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aGVhZHxoZWFkZXJ8aHJ8aHRtbHxpZnJhbWV8bGVnZW5kfGxpfGxpbmt8bWFpbnxtZW51fG1lbnVpdGVtfG5hdnxub2ZyYW1lc3xvbHxvcHRncm91cHxvcHRpb258cHxwYXJhbXxzZWN0aW9ufHNvdXJjZXxzdW1tYXJ5fHRhYmxlfHRib2R5fHRkfHRmb290fHRofHRoZWFkfHRpdGxlfHRyfHRyYWNrfHVsL1xufVxuXG4vLyBGcm9tIENvbW1vbk1hcmsuanMuIFxuY29uc3QgcHVuY3R1YXRpb25MZWFkaW5nID0gbmV3IFJlZ0V4cCgvXig/OlshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXVxcXFxeX2B7fH1+XFx4QTFcXHhBN1xceEFCXFx4QjZcXHhCN1xceEJCXFx4QkZcXHUwMzdFXFx1MDM4N1xcdTA1NUEtXFx1MDU1RlxcdTA1ODlcXHUwNThBXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RjNcXHUwNUY0XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRFxcdTA2MUJcXHUwNjFFXFx1MDYxRlxcdTA2NkEtXFx1MDY2RFxcdTA2RDRcXHUwNzAwLVxcdTA3MERcXHUwN0Y3LVxcdTA3RjlcXHUwODMwLVxcdTA4M0VcXHUwODVFXFx1MDk2NFxcdTA5NjVcXHUwOTcwXFx1MEFGMFxcdTBERjRcXHUwRTRGXFx1MEU1QVxcdTBFNUJcXHUwRjA0LVxcdTBGMTJcXHUwRjE0XFx1MEYzQS1cXHUwRjNEXFx1MEY4NVxcdTBGRDAtXFx1MEZENFxcdTBGRDlcXHUwRkRBXFx1MTA0QS1cXHUxMDRGXFx1MTBGQlxcdTEzNjAtXFx1MTM2OFxcdTE0MDBcXHUxNjZEXFx1MTY2RVxcdTE2OUJcXHUxNjlDXFx1MTZFQi1cXHUxNkVEXFx1MTczNVxcdTE3MzZcXHUxN0Q0LVxcdTE3RDZcXHUxN0Q4LVxcdTE3REFcXHUxODAwLVxcdTE4MEFcXHUxOTQ0XFx1MTk0NVxcdTFBMUVcXHUxQTFGXFx1MUFBMC1cXHUxQUE2XFx1MUFBOC1cXHUxQUFEXFx1MUI1QS1cXHUxQjYwXFx1MUJGQy1cXHUxQkZGXFx1MUMzQi1cXHUxQzNGXFx1MUM3RVxcdTFDN0ZcXHUxQ0MwLVxcdTFDQzdcXHUxQ0QzXFx1MjAxMC1cXHUyMDI3XFx1MjAzMC1cXHUyMDQzXFx1MjA0NS1cXHUyMDUxXFx1MjA1My1cXHUyMDVFXFx1MjA3RFxcdTIwN0VcXHUyMDhEXFx1MjA4RVxcdTIzMDgtXFx1MjMwQlxcdTIzMjlcXHUyMzJBXFx1Mjc2OC1cXHUyNzc1XFx1MjdDNVxcdTI3QzZcXHUyN0U2LVxcdTI3RUZcXHUyOTgzLVxcdTI5OThcXHUyOUQ4LVxcdTI5REJcXHUyOUZDXFx1MjlGRFxcdTJDRjktXFx1MkNGQ1xcdTJDRkVcXHUyQ0ZGXFx1MkQ3MFxcdTJFMDAtXFx1MkUyRVxcdTJFMzAtXFx1MkU0MlxcdTMwMDEtXFx1MzAwM1xcdTMwMDgtXFx1MzAxMVxcdTMwMTQtXFx1MzAxRlxcdTMwMzBcXHUzMDNEXFx1MzBBMFxcdTMwRkJcXHVBNEZFXFx1QTRGRlxcdUE2MEQtXFx1QTYwRlxcdUE2NzNcXHVBNjdFXFx1QTZGMi1cXHVBNkY3XFx1QTg3NC1cXHVBODc3XFx1QThDRVxcdUE4Q0ZcXHVBOEY4LVxcdUE4RkFcXHVBOEZDXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM5XFx1RERDRFxcdUREREJcXHVERERELVxcdUREREZcXHVERTM4LVxcdURFM0RcXHVERUE5XXxcXHVEODA1W1xcdURDQzZcXHVEREMxLVxcdURERDdcXHVERTQxLVxcdURFNDNcXHVERjNDLVxcdURGM0VdfFxcdUQ4MDlbXFx1REM3MC1cXHVEQzc0XXxcXHVEODFBW1xcdURFNkVcXHVERTZGXFx1REVGNVxcdURGMzctXFx1REYzQlxcdURGNDRdfFxcdUQ4MkZcXHVEQzlGfFxcdUQ4MzZbXFx1REU4Ny1cXHVERThCXSkvKTtcblxuY29uc3QgcHVuY3R1YXRpb25UcmFpbGluZyA9IG5ldyBSZWdFeHAoLyg/OlshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXVxcXFxeX2B7fH1+XFx4QTFcXHhBN1xceEFCXFx4QjZcXHhCN1xceEJCXFx4QkZcXHUwMzdFXFx1MDM4N1xcdTA1NUEtXFx1MDU1RlxcdTA1ODlcXHUwNThBXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RjNcXHUwNUY0XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRFxcdTA2MUJcXHUwNjFFXFx1MDYxRlxcdTA2NkEtXFx1MDY2RFxcdTA2RDRcXHUwNzAwLVxcdTA3MERcXHUwN0Y3LVxcdTA3RjlcXHUwODMwLVxcdTA4M0VcXHUwODVFXFx1MDk2NFxcdTA5NjVcXHUwOTcwXFx1MEFGMFxcdTBERjRcXHUwRTRGXFx1MEU1QVxcdTBFNUJcXHUwRjA0LVxcdTBGMTJcXHUwRjE0XFx1MEYzQS1cXHUwRjNEXFx1MEY4NVxcdTBGRDAtXFx1MEZENFxcdTBGRDlcXHUwRkRBXFx1MTA0QS1cXHUxMDRGXFx1MTBGQlxcdTEzNjAtXFx1MTM2OFxcdTE0MDBcXHUxNjZEXFx1MTY2RVxcdTE2OUJcXHUxNjlDXFx1MTZFQi1cXHUxNkVEXFx1MTczNVxcdTE3MzZcXHUxN0Q0LVxcdTE3RDZcXHUxN0Q4LVxcdTE3REFcXHUxODAwLVxcdTE4MEFcXHUxOTQ0XFx1MTk0NVxcdTFBMUVcXHUxQTFGXFx1MUFBMC1cXHUxQUE2XFx1MUFBOC1cXHUxQUFEXFx1MUI1QS1cXHUxQjYwXFx1MUJGQy1cXHUxQkZGXFx1MUMzQi1cXHUxQzNGXFx1MUM3RVxcdTFDN0ZcXHUxQ0MwLVxcdTFDQzdcXHUxQ0QzXFx1MjAxMC1cXHUyMDI3XFx1MjAzMC1cXHUyMDQzXFx1MjA0NS1cXHUyMDUxXFx1MjA1My1cXHUyMDVFXFx1MjA3RFxcdTIwN0VcXHUyMDhEXFx1MjA4RVxcdTIzMDgtXFx1MjMwQlxcdTIzMjlcXHUyMzJBXFx1Mjc2OC1cXHUyNzc1XFx1MjdDNVxcdTI3QzZcXHUyN0U2LVxcdTI3RUZcXHUyOTgzLVxcdTI5OThcXHUyOUQ4LVxcdTI5REJcXHUyOUZDXFx1MjlGRFxcdTJDRjktXFx1MkNGQ1xcdTJDRkVcXHUyQ0ZGXFx1MkQ3MFxcdTJFMDAtXFx1MkUyRVxcdTJFMzAtXFx1MkU0MlxcdTMwMDEtXFx1MzAwM1xcdTMwMDgtXFx1MzAxMVxcdTMwMTQtXFx1MzAxRlxcdTMwMzBcXHUzMDNEXFx1MzBBMFxcdTMwRkJcXHVBNEZFXFx1QTRGRlxcdUE2MEQtXFx1QTYwRlxcdUE2NzNcXHVBNjdFXFx1QTZGMi1cXHVBNkY3XFx1QTg3NC1cXHVBODc3XFx1QThDRVxcdUE4Q0ZcXHVBOEY4LVxcdUE4RkFcXHVBOEZDXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM5XFx1RERDRFxcdUREREJcXHVERERELVxcdUREREZcXHVERTM4LVxcdURFM0RcXHVERUE5XXxcXHVEODA1W1xcdURDQzZcXHVEREMxLVxcdURERDdcXHVERTQxLVxcdURFNDNcXHVERjNDLVxcdURGM0VdfFxcdUQ4MDlbXFx1REM3MC1cXHVEQzc0XXxcXHVEODFBW1xcdURFNkVcXHVERTZGXFx1REVGNVxcdURGMzctXFx1REYzQlxcdURGNDRdfFxcdUQ4MkZcXHVEQzlGfFxcdUQ4MzZbXFx1REU4Ny1cXHVERThCXSkkLyk7XG5cbi8vIGV4cG9ydCBjb25zdCBpbmxpbmVUcmlnZ2VyQ2hhcnMgPSBuZXcgUmVnRXhwKGBbJHtyZXBsYWNlbWVudHMuVHJpZ2dlckNoYXJzfV1gKTtcblxuLyoqXG4gKiBUaGlzIGlzIENvbW1vbk1hcmsncyBibG9jayBncmFtbWFyLCBidXQgd2UncmUgaWdub3JpbmcgbmVzdGVkIGJsb2NrcyBoZXJlLiAgXG4gKi8gXG5jb25zdCBsaW5lR3JhbW1hciA9IHsgXG4gIFRNSDE6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jXFxzKSguKj8pKCg/OlxccysjK1xccyopPykkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1IMVwiPiQxPC9zcGFuPiQkMjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgxXCI+JDM8L3NwYW4+J1xuICB9LFxuICBUTUgyOiB7IFxuICAgIHJlZ2V4cDogL14oIHswLDN9IyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgyXCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDJcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDM6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgzXCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDNcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDQ6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyMjXFxzKSguKj8pKCg/OlxccysjK1xccyopPykkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1INFwiPiQxPC9zcGFuPiQkMjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg0XCI+JDM8L3NwYW4+J1xuICB9LFxuICBUTUg1OiB7IFxuICAgIHJlZ2V4cDogL14oIHswLDN9IyMjIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg1XCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDVcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDY6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyMjIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg2XCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDZcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNQmxvY2txdW90ZTogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfT5bIF0/KSguKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1CbG9ja3F1b3RlXCI+JDE8L3NwYW4+JCQyJ1xuICB9LFxuICBUTUNvZGVGZW5jZUJhY2t0aWNrT3BlbjogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5gYGBgKilcXHMqKShbXmBdKj8pKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlQmFja3RpY2tcIj4kMTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNSW5mb1N0cmluZ1wiPiQzPC9zcGFuPiQ0J1xuICB9LFxuICBUTUNvZGVGZW5jZVRpbGRlT3BlbjogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5+fn5+KilcXHMqKSguKj8pKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlVGlsZGVcIj4kMTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNSW5mb1N0cmluZ1wiPiQzPC9zcGFuPiQ0J1xuICB9LFxuICBUTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2U6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30oPzxzZXE+YGBgYCopKShcXHMqKSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVGZW5jZUJhY2t0aWNrXCI+JDE8L3NwYW4+JDMnXG4gIH0sXG4gIFRNQ29kZUZlbmNlVGlsZGVDbG9zZTogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5+fn5+KikpKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlVGlsZGVcIj4kMTwvc3Bhbj4kMydcbiAgfSxcbiAgVE1CbGFua0xpbmU6IHsgXG4gICAgcmVnZXhwOiAvXihbIFxcdF0qKSQvLCBcbiAgICByZXBsYWNlbWVudDogJyQwJ1xuICB9LFxuICBUTVNldGV4dEgxTWFya2VyOiB7IFxuICAgIHJlZ2V4cDogL14gezAsM309K1xccyokLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1TZXRleHRIMU1hcmtlclwiPiQwPC9zcGFuPidcbiAgfSxcbiAgVE1TZXRleHRIMk1hcmtlcjogeyBcbiAgICByZWdleHA6IC9eIHswLDN9LStcXHMqJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNU2V0ZXh0SDFNYXJrZXJcIj4kMDwvc3Bhbj4nXG4gIH0sXG4gIFRNSFI6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30oXFwqWyBcXHRdKlxcKlsgXFx0XSpcXCpbIFxcdCpdKil8KC1bIFxcdF0qLVsgXFx0XSotWyBcXHQtXSopfChfWyBcXHRdKl9bIFxcdF0qX1sgXFx0X10qKSkkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1IUlwiPiQwPC9zcGFuPidcbiAgfSxcbiAgVE1VTDogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfVsrKi1dIHsxLDR9KSguKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1VTFwiPiQxPC9zcGFuPiQkMidcbiAgfSxcbiAgVE1PTDogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfVxcZHsxLDl9Wy4pXSB7MSw0fSkoLiopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNT0xcIj4kMTwvc3Bhbj4kJDInXG4gIH0sXG4gIC8vIFRPRE86IFRoaXMgaXMgY3VycmVudGx5IHByZXZlbnRpbmcgc3VibGlzdHMgKGFuZCBhbnkgY29udGVudCB3aXRoaW4gbGlzdCBpdGVtcywgcmVhbGx5KSBmcm9tIHdvcmtpbmdcbiAgVE1JbmRlbnRlZENvZGU6IHsgXG4gICAgcmVnZXhwOiAvXiggezR9fFxcdCkoLiopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSW5kZW50ZWRDb2RlXCI+JDE8L3NwYW4+JDInXG4gIH0sXG4gIFRNTGlua1JlZmVyZW5jZURlZmluaXRpb246IHtcbiAgICAvLyBUT0RPOiBMaW5rIGRlc3RpbmF0aW9uIGNhbid0IGluY2x1ZGUgdW5iYWxhbmNlZCBwYXJhbnRoZXNlcywgYnV0IHdlIGp1c3QgaWdub3JlIHRoYXQgaGVyZSBcbiAgICByZWdleHA6IC9eKCB7MCwzfVxcW1xccyopKFteXFxzXFxdXSg/OlteXFxdXXxcXFxcXFxdKSo/KShcXHMqXFxdOlxccyopKCg/OlteXFxzPD5dKyl8KD86PCg/OltePD5cXFxcXXxcXFxcLikqPikpPyhcXHMqKSgoPzpcXCgoPzpbXigpXFxcXF18XFxcXC4pKlxcKSl8KD86XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwoPzonKD86W14nXFxcXF18XFxcXC4pKicpKT8oXFxzKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1MaW5rUmVmZXJlbmNlRGVmaW5pdGlvblwiPiQxPC9zcGFuPjxzcGFuIGNsYXNzPVwiVE1MaW5rTGFiZWwgVE1MaW5rTGFiZWxfRGVmaW5pdGlvblwiPiQyPC9zcGFuPjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUxpbmtSZWZlcmVuY2VEZWZpbml0aW9uXCI+JDM8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTUxpbmtEZXN0aW5hdGlvblwiPiQ0PC9zcGFuPiQ1PHNwYW4gY2xhc3M9XCJUTUxpbmtUaXRsZVwiPiQ2PC9zcGFuPiQ3JyxcbiAgICBsYWJlbFBsYWNlaG9sZGVyOiAyLCAvLyB0aGlzIGRlZmluZXMgd2hpY2ggcGxhY2Vob2xkZXIgaW4gdGhlIGFib3ZlIHJlZ2V4IGlzIHRoZSBsaW5rIFwibGFiZWxcIlxuICB9LFxufTtcblxuLyoqXG4gKiBIVE1MIGJsb2NrcyBoYXZlIG11bHRpcGxlIGRpZmZlcmVudCBjbGFzc2VzIG9mIG9wZW5lciBhbmQgY2xvc2VyLiBUaGlzIGFycmF5IGRlZmluZXMgYWxsIHRoZSBjYXNlc1xuICovXG52YXIgaHRtbEJsb2NrR3JhbW1hciA9IFtcbiAgeyBzdGFydDogL14gezAsM308KD86c2NyaXB0fHByZXxzdHlsZSkoPzpcXHN8PnwkKS9pLCBlbmQ6IC8oPzo8XFwvc2NyaXB0Pnw8XFwvcHJlPnw8XFwvc3R5bGU+KS9pLCBwYXJhSW50ZXJydXB0OiB0cnVlIH0sXG4gIHsgc3RhcnQ6IC9eIHswLDN9PCEtLS8sIGVuZDogLy0tPi8sIHBhcmFJbnRlcnJ1cHQ6IHRydWUgfSxcbiAgeyBzdGFydDogL14gezAsM308XFw/LywgZW5kOiAvXFw/Pi8sIHBhcmFJbnRlcnJ1cHQ6IHRydWUgfSxcbiAgeyBzdGFydDogL14gezAsM308IVtBLVpdLywgZW5kOiAvPi8sIHBhcmFJbnRlcnJ1cHQgOiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM308IVxcW0NEQVRBXFxbLywgZW5kOiAvXFxdXFxdPi8sIHBhcmFJbnRlcnJ1cHQgOiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM30oPzo8fDxcXC8pKD86S25vd25UYWcpKD86XFxzfD58XFwvPnwkKS9pLCBlbmQ6IGZhbHNlLCBwYXJhSW50ZXJydXB0OiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM30oPzpIVE1MT3BlblRhZ3xIVE1MQ2xvc2VUYWcpXFxzKiQvLCBlbmQ6IGZhbHNlLCBwYXJhSW50ZXJydXB0OiBmYWxzZX0sXG5dO1xuXG4vKipcbiAqIFN0cnVjdHVyZSBvZiB0aGUgb2JqZWN0OlxuICogVG9wIGxldmVsIGVudHJpZXMgYXJlIHJ1bGVzLCBlYWNoIGNvbnNpc3Rpbmcgb2YgYSByZWd1bGFyIGV4cHJlc3Npb25zIChpbiBzdHJpbmcgZm9ybWF0KSBhcyB3ZWxsIGFzIGEgcmVwbGFjZW1lbnQuXG4gKiBJbiB0aGUgcmVndWxhciBleHByZXNzaW9ucywgcmVwbGFjZW1lbnRzIGZyb20gdGhlIG9iamVjdCAncmVwbGFjZW1lbnRzJyB3aWxsIGJlIHByb2Nlc3NlZCBiZWZvcmUgY29tcGlsaW5nIGludG8gdGhlIHByb3BlcnR5IHJlZ2V4cC5cbiAqL1xudmFyIGlubGluZUdyYW1tYXIgPSB7XG4gIGVzY2FwZSA6IHtcbiAgICByZWdleHA6IC9eXFxcXChBU0NJSVB1bmN0dWF0aW9uKS8sXG4gICAgcmVwbGFjZW1lbnQgOiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNRXNjYXBlXCI+XFxcXDwvc3Bhbj4kMSdcbiAgfSxcbiAgY29kZSA6IHtcbiAgICByZWdleHA6IC9eKGArKSgoPzpbXmBdKXwoPzpbXmBdLio/W15gXSkpKFxcMSkvLFxuICAgIHJlcGxhY2VtZW50IDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVcIj4kMTwvc3Bhbj48Y29kZSBjbGFzcz1cIlRNQ29kZVwiPiQyPC9jb2RlPjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVcIj4kMzwvc3Bhbj4nIFxuICB9LFxuICBhdXRvbGluayA6IHtcbiAgICByZWdleHA6IC9ePCgoPzpTY2hlbWU6W15cXHM8Pl0qKXwoPzpFbWFpbCkpPi8sXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1BdXRvbGlua1wiPiZsdDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTUF1dG9saW5rXCI+JDE8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQXV0b2xpbmtcIj4mZ3Q7PC9zcGFuPidcbiAgfSxcbiAgaHRtbCA6IHtcbiAgICByZWdleHA6IC9eKCg/OkhUTUxPcGVuVGFnKXwoPzpIVE1MQ2xvc2VUYWcpfCg/OkhUTUxDb21tZW50KXwoPzpIVE1MUEkpfCg/OkhUTUxEZWNsYXJhdGlvbil8KD86SFRNTENEQVRBKSkvLFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTUhUTUxcIj4kMTwvc3Bhbj4nLFxuICB9LFxuICBsaW5rT3BlbiA6IHtcbiAgICByZWdleHA6IC9eXFxbLyxcbiAgICByZXBsYWNlbWVudDogJydcbiAgfSxcbiAgaW1hZ2VPcGVuIDoge1xuICAgIHJlZ2V4cDogL14hXFxbLyxcbiAgICByZXBsYWNlbWVudCA6ICcnXG4gIH0sXG4gIGxpbmtMYWJlbCA6IHtcbiAgICByZWdleHA6IC9eKFxcW1xccyopKFteXFxdXSo/KShcXHMqXFxdKS8sXG4gICAgcmVwbGFjZW1lbnQ6ICcnLFxuICAgIGxhYmVsUGxhY2Vob2xkZXI6IDJcbiAgfSxcbiAgZGVmYXVsdCA6IHtcbiAgICByZWdleHA6IC9eKC58KD86Tm90VHJpZ2dlckNoYXIrKSkvLFxuICAgIHJlcGxhY2VtZW50OiAnJDEnXG4gIH1cbn07XG5cbi8vIFByb2Nlc3MgcmVwbGFjZW1lbnRzIGluIHJlZ2V4cHNcbmNvbnN0IHJlcGxhY2VtZW50UmVnZXhwID0gbmV3IFJlZ0V4cChPYmplY3Qua2V5cyhyZXBsYWNlbWVudHMpLmpvaW4oJ3wnKSk7XG5cbi8vIElubGluZVxuY29uc3QgaW5saW5lUnVsZXMgPVsuLi5PYmplY3Qua2V5cyhpbmxpbmVHcmFtbWFyKV07XG5mb3IgKGxldCBydWxlIG9mIGlubGluZVJ1bGVzKSB7XG4gIGxldCByZSA9IGlubGluZUdyYW1tYXJbcnVsZV0ucmVnZXhwLnNvdXJjZTtcbiAgLy8gUmVwbGFjZSB3aGlsZSB0aGVyZSBpcyBzb21ldGhpbmcgdG8gcmVwbGFjZS4gVGhpcyBtZWFucyBpdCBhbHNvIHdvcmtzIG92ZXIgbXVsdGlwbGUgbGV2ZWxzIChyZXBsYWNlbWVudHMgY29udGFpbmluZyByZXBsYWNlbWVudHMpXG4gIHdoaWxlIChyZS5tYXRjaChyZXBsYWNlbWVudFJlZ2V4cCkpIHtcbiAgICByZSA9IHJlLnJlcGxhY2UocmVwbGFjZW1lbnRSZWdleHAsIChzdHJpbmcpID0+IHsgcmV0dXJuIHJlcGxhY2VtZW50c1tzdHJpbmddLnNvdXJjZTsgfSk7XG4gIH1cbiAgaW5saW5lR3JhbW1hcltydWxlXS5yZWdleHAgPSBuZXcgUmVnRXhwKHJlLCBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlZ2V4cC5mbGFncyk7XG59XG5cbi8vIEhUTUwgQmxvY2sgKG9ubHkgb3BlbmluZyBydWxlIGlzIHByb2Nlc3NlZCBjdXJyZW50bHkpXG5mb3IgKGxldCBydWxlIG9mIGh0bWxCbG9ja0dyYW1tYXIpIHtcbiAgbGV0IHJlID0gcnVsZS5zdGFydC5zb3VyY2U7XG4gIC8vIFJlcGxhY2Ugd2hpbGUgdGhlcmUgaXMgc29tZXRoaW5nIHRvIHJlcGxhY2UuIFRoaXMgbWVhbnMgaXQgYWxzbyB3b3JrcyBvdmVyIG11bHRpcGxlIGxldmVscyAocmVwbGFjZW1lbnRzIGNvbnRhaW5pbmcgcmVwbGFjZW1lbnRzKVxuICB3aGlsZSAocmUubWF0Y2gocmVwbGFjZW1lbnRSZWdleHApKSB7XG4gICAgcmUgPSByZS5yZXBsYWNlKHJlcGxhY2VtZW50UmVnZXhwLCAoc3RyaW5nKSA9PiB7IHJldHVybiByZXBsYWNlbWVudHNbc3RyaW5nXS5zb3VyY2U7IH0pO1xuICB9XG4gIHJ1bGUuc3RhcnQgPSBuZXcgUmVnRXhwKHJlLCBydWxlLnN0YXJ0LmZsYWdzKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIEhUTUwgc3BlY2lhbCBjaGFyYWN0ZXJzICg8LCA+LCBhbmQgJikgaW4gdGhlIHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHJhdyBzdHJpbmcgdG8gYmUgZXNjYXBlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHN0cmluZywgcmVhZHkgdG8gYmUgdXNlZCBpbiBIVE1MXG4gKi9cbmZ1bmN0aW9uIGh0bWxlc2NhcGUoc3RyaW5nKSB7XG4gIHJldHVybiAoc3RyaW5nID8gc3RyaW5nIDogJycpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cbi8qKlxuICogQ29udGFpbnMgdGhlIGNvbW1hbmRzIHRoYXQgY2FuIGJlIHNlbnQgdG8gdGhlIGVkaXRvci4gQ29udGFpbnMgb2JqZWN0cyB3aXRoIGEgbmFtZSByZXByZXNlbnRpbmcgdGhlIG5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gKiBFYWNoIG9mIHRoZSBvYmplY3RzIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqIFxuICogICAtIHR5cGU6IENhbiBiZSBlaXRoZXIgaW5saW5lIChmb3IgaW5saW5lIGZvcm1hdHRpbmcpIG9yIGxpbmUgKGZvciBibG9jayAvIGxpbmUgZm9ybWF0dGluZykuXG4gKiAgIC0gY2xhc3NOYW1lOiBVc2VkIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBjb21tYW5kIGlzIGFjdGl2ZSBhdCBhIGdpdmVuIHBvc2l0aW9uLiBcbiAqICAgICBGb3IgbGluZSBmb3JtYXR0aW5nLCB0aGlzIGxvb2tzIGF0IHRoZSBjbGFzcyBvZiB0aGUgbGluZSBlbGVtZW50LiBGb3IgaW5saW5lIGVsZW1lbnRzLCB0cmllcyB0byBmaW5kIGFuIGVuY2xvc2luZyBlbGVtZW50IHdpdGggdGhhdCBjbGFzcy5cbiAqICAgLSBzZXQgLyB1bnNldDogQ29udGFpbiBpbnN0cnVjdGlvbnMgaG93IHRvIHNldCBhbmQgdW5zZXQgdGhlIGNvbW1hbmQuIEZvciBsaW5lIHR5cGUgY29tbWFuZHMsIGJvdGggY29uc2lzdCBvZiBhIHBhdHRlcm4gYW5kIHJlcGxhY2VtZW50IHRoYXQgXG4gKiAgICAgd2lsbCBiZSBhcHBsaWVkIHRvIGVhY2ggbGluZSAodXNpbmcgU3RyaW5nLnJlcGxhY2UpLiBGb3IgaW5saW5lIHR5cGUgY29tbWFuZHMsIHRoZSBzZXQgb2JqZWN0IGNvbnRhaW5zIGEgcHJlIGFuZCBwb3N0IHN0cmluZyB3aGljaCB3aWxsXG4gKiAgICAgYmUgaW5zZXJ0ZWQgYmVmb3JlIGFuZCBhZnRlciB0aGUgc2VsZWN0aW9uLiBUaGUgdW5zZXQgb2JqZWN0IGNvbnRhaW5zIGEgcHJlUGF0dGVybiBhbmQgYSBwb3N0UGF0dGVybi4gQm90aCBzaG91bGQgYmUgcmVndWxhciBleHByZXNzaW9ucyBhbmQgXG4gKiAgICAgdGhleSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcnRpb24gb2YgdGhlIGxpbmUgYmVmb3JlIGFuZCBhZnRlciB0aGUgc2VsZWN0aW9uICh1c2luZyBTdHJpbmcucmVwbGFjZSwgd2l0aCBhbiBlbXB0eSByZXBsYWNlbWVudCBzdHJpbmcpLlxuICovXG5jb25zdCBjb21tYW5kcyA9IHtcbiAgLy8gUmVwbGFjZW1lbnRzIGZvciB1bnNldCBmb3IgaW5saW5lIGNvbW1hbmRzIGFyZSAnJyBieSBkZWZhdWx0XG4gIGJvbGQ6IHtcbiAgICB0eXBlOiAnaW5saW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1TdHJvbmcnLCBcbiAgICBzZXQ6IHtwcmU6ICcqKicsIHBvc3Q6ICcqKid9LCBcbiAgICB1bnNldDoge3ByZVBhdHRlcm46IC8oPzpcXCpcXCp8X18pJC8sIHBvc3RQYXR0ZXJuOiAvXig/OlxcKlxcKnxfXykvfVxuICB9LCBcbiAgaXRhbGljOiB7XG4gICAgdHlwZTogJ2lubGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNRW0nLCBcbiAgICBzZXQ6IHtwcmU6ICcqJywgcG9zdDogJyonfSwgXG4gICAgdW5zZXQ6IHtwcmVQYXR0ZXJuOiAvKD86XFwqfF8pJC8sIHBvc3RQYXR0ZXJuOiAvXig/OlxcKnxfKS99XG4gIH0sXG4gIGNvZGU6IHtcbiAgICB0eXBlOiAnaW5saW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1Db2RlJywgXG4gICAgc2V0OiB7cHJlOiAnYCcsIHBvc3Q6ICdgJ30sIFxuICAgIHVuc2V0OiB7cHJlUGF0dGVybjogL2ArJC8sIHBvc3RQYXR0ZXJuOiAvXmArL30gLy8gRklYTUUgdGhpcyBkb2Vzbid0IGVuc3VyZSBiYWxhbmNlZCBiYWNrdGlja3MgcmlnaHQgbm93XG4gIH0sIFxuICBzdHJpa2V0aHJvdWdoOiB7XG4gICAgdHlwZTogJ2lubGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNU3RyaWtldGhyb3VnaCcsIFxuICAgIHNldDoge3ByZTogJ35+JywgcG9zdDogJ35+J30sIFxuICAgIHVuc2V0OiB7cHJlUGF0dGVybjovfn4kLywgcG9zdFBhdHRlcm46IC9efn4vIH1cbiAgfSxcbiAgaDE6IHtcbiAgICB0eXBlOiAnbGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNSDEnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJyMgJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30jXFxzKykoLio/KSgoPzpcXHMrIytcXHMqKT8pJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxuICBoMjoge1xuICAgIHR5cGU6ICdsaW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1IMicsIFxuICAgIHNldDoge3BhdHRlcm46IC9eKCB7MCwzfSg/Oig/OiMrfFswLTldezEsOX1bKS5dfFs+XFwtKitdKVxccyspPykoLiopJC8sIHJlcGxhY2VtZW50OiAnIyMgJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30jI1xccyspKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCByZXBsYWNlbWVudDogJyQyJ31cbiAgfSxcbiAgdWw6IHtcbiAgICB0eXBlOiAnbGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNVUwnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJy0gJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM31bKyotXSB7MSw0fSkoLiopJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxuICBvbDoge1xuICAgIHR5cGU6ICdsaW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1PTCcsIFxuICAgIHNldDoge3BhdHRlcm46IC9eKCB7MCwzfSg/Oig/OiMrfFswLTldezEsOX1bKS5dfFs+XFwtKitdKVxccyspPykoLiopJC8sIHJlcGxhY2VtZW50OiAnJCMuICQyJ30sIFxuICAgIHVuc2V0OiB7cGF0dGVybjogL14oIHswLDN9XFxkezEsOX1bLildIHsxLDR9KSguKikkLywgcmVwbGFjZW1lbnQ6ICckMid9XG4gIH0sIFxuICBibG9ja3F1b3RlOiB7XG4gICAgdHlwZTogJ2xpbmUnLCBcbiAgICBjbGFzc05hbWU6ICdUTUJsb2NrcXVvdGUnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJz4gJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30+WyBdPykoLiopJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxufTtcblxuZXhwb3J0IHsgbGluZUdyYW1tYXIsIGlubGluZUdyYW1tYXIsIHB1bmN0dWF0aW9uTGVhZGluZywgcHVuY3R1YXRpb25UcmFpbGluZywgaHRtbGVzY2FwZSwgaHRtbEJsb2NrR3JhbW1hciwgY29tbWFuZHMgfTsiLCJpbXBvcnQgeyBpbmxpbmVHcmFtbWFyLCBsaW5lR3JhbW1hciwgcHVuY3R1YXRpb25MZWFkaW5nLCBwdW5jdHVhdGlvblRyYWlsaW5nLCBodG1sZXNjYXBlLCBodG1sQmxvY2tHcmFtbWFyLCBjb21tYW5kcyB9IGZyb20gXCIuL2dyYW1tYXJcIjtcblxuY2xhc3MgRWRpdG9yIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7ICAgIFxuICAgIHRoaXMuZSA9IG51bGw7XG4gICAgdGhpcy50ZXh0YXJlYSA9IG51bGw7XG4gICAgdGhpcy5saW5lcyA9IFtdO1xuICAgIHRoaXMubGluZUVsZW1lbnRzID0gW107XG4gICAgdGhpcy5saW5lVHlwZXMgPSBbXTtcbiAgICB0aGlzLmxpbmVDYXB0dXJlcyA9IFtdO1xuICAgIHRoaXMubGluZVJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHRoaXMubGlua0xhYmVscyA9IFtdO1xuICAgIHRoaXMubGluZURpcnR5ID0gW107XG4gICAgdGhpcy5sYXN0Q29tbWFuZFN0YXRlID0gbnVsbDtcblxuICAgIHRoaXMubGlzdGVuZXJzID0ge1xuICAgICAgY2hhbmdlOiBbXSxcbiAgICAgIHNlbGVjdGlvbjogW10sXG4gICAgfTtcblxuICAgIGxldCBlbGVtZW50ID0gcHJvcHMuZWxlbWVudDtcbiAgICB0aGlzLnRleHRhcmVhID0gcHJvcHMudGV4dGFyZWE7XG5cbiAgICBpZiAodGhpcy50ZXh0YXJlYSAmJiAhdGhpcy50ZXh0YXJlYS50YWdOYW1lKSB7XG4gICAgICB0aGlzLnRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZXh0YXJlYSk7XG4gICAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSB0aGlzLnRleHRhcmVhO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50ICYmICFlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5lbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTsgXG4gICAgfVxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJykge1xuICAgICAgdGhpcy50ZXh0YXJlYSA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gdGhpcy50ZXh0YXJlYS5wYXJlbnROb2RlOyBcbiAgICB9XG5cbiAgICBpZiAodGhpcy50ZXh0YXJlYSkge1xuICAgICAgdGhpcy50ZXh0YXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlRWRpdG9yRWxlbWVudChlbGVtZW50KTtcbiAgICAvLyBUT0RPIFBsYWNlaG9sZGVyIGZvciBlbXB0eSBjb250ZW50XG4gICAgdGhpcy5zZXRDb250ZW50KHByb3BzLmNvbnRlbnQgfHwgKHRoaXMudGV4dGFyZWEgPyB0aGlzLnRleHRhcmVhLnZhbHVlIDogZmFsc2UpIHx8ICcjIEhlbGxvIFRpbnlNREUhXFxuRWRpdCAqKmhlcmUqKicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGVkaXRvciBlbGVtZW50IGluc2lkZSB0aGUgdGFyZ2V0IGVsZW1lbnQgb2YgdGhlIERPTSB0cmVlXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSB0YXJnZXQgZWxlbWVudCBvZiB0aGUgRE9NIHRyZWVcbiAgICovXG4gIGNyZWF0ZUVkaXRvckVsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZS5jbGFzc05hbWUgPSAnVGlueU1ERSc7XG4gICAgdGhpcy5lLmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBpbXBvcnRhbnQgZm9yIGZvcm1hdHRpbmcgcHVycG9zZXMsIGJ1dCBhbHNvIHNpbmNlIG90aGVyd2lzZSB0aGUgYnJvd3NlciByZXBsYWNlcyBzdWJzZXF1ZW50IHNwYWNlcyB3aXRoICAmbmJzcDsgJm5ic3A7XG4gICAgLy8gVGhhdCBicmVha3MgYSBsb3Qgb2Ygc3R1ZmYsIHNvIHdlIGRvIHRoaXMgaGVyZSBhbmQgbm90IGluIENTU+KAlHRoZXJlZm9yZSwgeW91IGRvbid0IGhhdmUgdG8gcmVtZW1iZXIgdG8gYnV0IHRoaXMgaW4gdGhlIENTUyBmaWxlXG4gICAgdGhpcy5lLnN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnOyBcbiAgICAvLyBBdm9pZCBmb3JtYXR0aW5nIChCIC8gSSAvIFUpIHBvcHBpbmcgdXAgb24gaU9TXG4gICAgdGhpcy5lLnN0eWxlLndlYmtpdFVzZXJNb2RpZnkgPSAncmVhZC13cml0ZS1wbGFpbnRleHQtb25seSc7XG4gICAgaWYgKHRoaXMudGV4dGFyZWEgJiYgdGhpcy50ZXh0YXJlYS5wYXJlbnROb2RlID09IGVsZW1lbnQgJiYgdGhpcy50ZXh0YXJlYS5uZXh0U2libGluZykge1xuICAgICAgZWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lLCB0aGlzLnRleHRhcmVhLm5leHRTaWJsaW5nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZSk7XG4gICAgfVxuXG4gICAgdGhpcy5lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4gdGhpcy5oYW5kbGVJbnB1dEV2ZW50KGUpKTtcbiAgICAvLyB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHRoaXMuaGFuZGxlS2V5ZG93bkV2ZW50KGUpKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0aW9uY2hhbmdlXCIsIChlKSA9PiB0aGlzLmhhbmRsZVNlbGVjdGlvbkNoYW5nZUV2ZW50KGUpKTtcbiAgICB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIChlKSA9PiB0aGlzLmhhbmRsZVBhc3RlKGUpKTtcbiAgICAvLyB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB0aGlzLmhhbmRsZUtleURvd24oZSkpO1xuICAgIHRoaXMubGluZUVsZW1lbnRzID0gdGhpcy5lLmNoaWxkTm9kZXM7IC8vIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IHVwZGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGVkaXRvciBjb250ZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCBUaGUgbmV3IE1hcmtkb3duIGNvbnRlbnRcbiAgICovXG4gIHNldENvbnRlbnQoY29udGVudCkge1xuICAgIC8vIERlbGV0ZSBhbnkgZXhpc3RpbmcgY29udGVudFxuICAgIHdoaWxlICh0aGlzLmUuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5lLnJlbW92ZUNoaWxkKHRoaXMuZS5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgdGhpcy5saW5lcyA9IGNvbnRlbnQuc3BsaXQoLyg/OlxcclxcbnxcXHJ8XFxuKS8pO1xuICAgIHRoaXMubGluZURpcnR5ID0gW107XG4gICAgZm9yIChsZXQgbGluZU51bSA9IDA7IGxpbmVOdW0gPCB0aGlzLmxpbmVzLmxlbmd0aDsgbGluZU51bSsrKSB7XG4gICAgICBsZXQgbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZS5hcHBlbmRDaGlsZChsZSk7XG4gICAgICB0aGlzLmxpbmVEaXJ0eS5wdXNoKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmxpbmVUeXBlcyA9IG5ldyBBcnJheSh0aGlzLmxpbmVzLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgdGhpcy5maXJlQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWRpdG9yIGNvbnRlbnQgYXMgYSBNYXJrZG93biBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlZGl0b3IgY29udGVudCBhcyBhIG1hcmtkb3duIHN0cmluZ1xuICAgKi9cbiAgZ2V0Q29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcy5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBtYWluIG1ldGhvZCB0byB1cGRhdGUgdGhlIGZvcm1hdHRpbmcgKGZyb20gdGhpcy5saW5lcyB0byBIVE1MIG91dHB1dClcbiAgICovXG4gIHVwZGF0ZUZvcm1hdHRpbmcoKSB7XG4gICAgLy8gRmlyc3QsIHBhcnNlIGxpbmUgdHlwZXMuIFRoaXMgd2lsbCB1cGRhdGUgdGhpcy5saW5lVHlwZXMsIHRoaXMubGluZVJlcGxhY2VtZW50cywgYW5kIHRoaXMubGluZUNhcHR1cmVzXG4gICAgLy8gV2UgZG9uJ3QgYXBwbHkgdGhlIGZvcm1hdHRpbmcgeWV0XG4gICAgdGhpcy51cGRhdGVMaW5lVHlwZXMoKTtcbiAgICAvLyBDb2xsZWN0IGFueSB2YWxpZCBsaW5rIGxhYmVscyBmcm9tIGxpbmsgcmVmZXJlbmNlIGRlZmluaXRpb25z4oCUd2UgbmVlZCB0aGF0IGZvciBmb3JtYXR0aW5nIHRvIGRldGVybWluZSB3aGF0J3MgYSB2YWxpZCBsaW5rXG4gICAgdGhpcy51cGRhdGVMaW5rTGFiZWxzKCk7XG4gICAgLy8gTm93LCBhcHBseSB0aGUgZm9ybWF0dGluZ1xuICAgIHRoaXMuYXBwbHlMaW5lVHlwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoaXMubGlua0xhYmVsczogRm9yIGV2ZXJ5IGxpbmsgcmVmZXJlbmNlIGRlZmluaXRpb24gKGxpbmUgdHlwZSBUTUxpbmtSZWZlcmVuY2VEZWZpbml0aW9uKSwgd2UgY29sbGVjdCB0aGUgbGFiZWxcbiAgICovXG4gIHVwZGF0ZUxpbmtMYWJlbHMoKSB7XG4gICAgdGhpcy5saW5rTGFiZWxzID0gW107XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCB0aGlzLmxpbmVzLmxlbmd0aDsgbCsrKSB7XG4gICAgICBpZiAodGhpcy5saW5lVHlwZXNbbF0gPT0gJ1RNTGlua1JlZmVyZW5jZURlZmluaXRpb24nKSB7XG4gICAgICAgIHRoaXMubGlua0xhYmVscy5wdXNoKHRoaXMubGluZUNhcHR1cmVzW2xdW2xpbmVHcmFtbWFyLlRNTGlua1JlZmVyZW5jZURlZmluaXRpb24ubGFiZWxQbGFjZWhvbGRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnMgZnJvbSBhIFJlZ0V4cCBjYXB0dXJlLiBUaGUgcmVwbGFjZW1lbnQgc3RyaW5nIGNhbiBjb250YWluIHJlZ3VsYXIgZG9sbGFyIHBsYWNlaG9sZGVycyAoZS5nLiwgJDEpLFxuICAgKiB3aGljaCBhcmUgaW50ZXJwcmV0ZWQgbGlrZSBpbiBTdHJpbmcucmVwbGFjZSgpLCBidXQgYWxzbyBkb3VibGUgZG9sbGFyIHBsYWNlaG9sZGVycyAoJCQxKS4gSW4gdGhlIGNhc2Ugb2YgZG91YmxlIGRvbGxhciBwbGFjZWhvbGRlcnMsIFxuICAgKiBNYXJrZG93biBpbmxpbmUgZ3JhbW1hciBpcyBhcHBsaWVkIG9uIHRoZSBjb250ZW50IG9mIHRoZSBjYXB0dXJlZCBzdWJncm91cCwgaS5lLiwgJCQxIHByb2Nlc3NlcyBpbmxpbmUgTWFya2Rvd24gZ3JhbW1hciBpbiB0aGUgY29udGVudCBvZiB0aGVcbiAgICogZmlyc3QgY2FwdHVyZWQgc3ViZ3JvdXAsIGFuZCByZXBsYWNlcyBgJCQxYCB3aXRoIHRoZSByZXN1bHQuXG4gICAqIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbGFjZW1lbnQgVGhlIHJlcGxhY2VtZW50IHN0cmluZywgaW5jbHVkaW5nIHBsYWNlaG9sZGVycy5cbiAgICogQHBhcmFtICBjYXB0dXJlIFRoZSByZXN1bHQgb2YgYSBSZWdFeHAuZXhlYygpIGNhbGxcbiAgICogQHJldHVybnMgVGhlIHJlcGxhY2VtZW50IHN0cmluZywgd2l0aCBwbGFjZWhvbGRlcnMgcmVwbGFjZWQgZnJvbSB0aGUgY2FwdHVyZSByZXN1bHQuXG4gICAqL1xuICByZXBsYWNlKHJlcGxhY2VtZW50LCBjYXB0dXJlKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50XG4gICAgICAucmVwbGFjZSgvXFwkXFwkKFswLTldKS9nLCAoc3RyLCBwMSkgPT4gYDxzcGFuIGNsYXNzPVwiVE1JbmxpbmVGb3JtYXR0ZWRcIj4ke3RoaXMucHJvY2Vzc0lubGluZVN0eWxlcyhjYXB0dXJlW3AxXSl9PC9zcGFuPmApIFxuICAgICAgLnJlcGxhY2UoL1xcJChbMC05XSkvZywgKHN0ciwgcDEpID0+IGh0bWxlc2NhcGUoY2FwdHVyZVtwMV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBsaW5lIHR5cGVzIChmcm9tIHRoaXMubGluZVR5cGVzIGFzIHdlbGwgYXMgdGhlIGNhcHR1cmUgcmVzdWx0IGluIHRoaXMubGluZVJlcGxhY2VtZW50cyBhbmQgdGhpcy5saW5lQ2FwdHVyZXMpIFxuICAgKiBhbmQgcHJvY2Vzc2VzIGlubGluZSBmb3JtYXR0aW5nIGZvciBhbGwgbGluZXMuXG4gICAqL1xuICBhcHBseUxpbmVUeXBlcygpIHtcbiAgICBmb3IgKGxldCBsaW5lTnVtID0gMDsgbGluZU51bSA8IHRoaXMubGluZXMubGVuZ3RoOyBsaW5lTnVtKyspIHtcbiAgICAgIGlmICh0aGlzLmxpbmVEaXJ0eVtsaW5lTnVtXSkge1xuICAgICAgICBsZXQgY29udGVudEhUTUwgPSB0aGlzLnJlcGxhY2UodGhpcy5saW5lUmVwbGFjZW1lbnRzW2xpbmVOdW1dLCB0aGlzLmxpbmVDYXB0dXJlc1tsaW5lTnVtXSk7XG4gICAgICAgIC8vIHRoaXMubGluZUhUTUxbbGluZU51bV0gPSAoY29udGVudEhUTUwgPT0gJycgPyAnPGJyIC8+JyA6IGNvbnRlbnRIVE1MKTsgLy8gUHJldmVudCBlbXB0eSBlbGVtZW50cyB3aGljaCBjYW4ndCBiZSBzZWxlY3RlZCBldGMuXG4gICAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmNsYXNzTmFtZSA9IHRoaXMubGluZVR5cGVzW2xpbmVOdW1dO1xuICAgICAgICB0aGlzLmxpbmVFbGVtZW50c1tsaW5lTnVtXS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmlubmVySFRNTCA9IChjb250ZW50SFRNTCA9PSAnJyA/ICc8YnIgLz4nIDogY29udGVudEhUTUwpOyAvLyBQcmV2ZW50IGVtcHR5IGVsZW1lbnRzIHdoaWNoIGNhbid0IGJlIHNlbGVjdGVkIGV0Yy5cbiAgICAgIH1cbiAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmRhdGFzZXQubGluZU51bSA9IGxpbmVOdW07XG4gICAgfSAgICBcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGxpbmUgdHlwZXMgZm9yIGFsbCBsaW5lcyBiYXNlZCBvbiB0aGUgbGluZSAvIGJsb2NrIGdyYW1tYXIuIENhcHR1cmVzIHRoZSByZXN1bHRzIG9mIHRoZSByZXNwZWN0aXZlIGxpbmVcbiAgICogZ3JhbW1hciByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgKiBVcGRhdGVzIHRoaXMubGluZVR5cGVzLCB0aGlzLmxpbmVDYXB0dXJlcywgYW5kIHRoaXMubGluZVJlcGxhY2VtZW50cy5cbiAgICovXG4gIHVwZGF0ZUxpbmVUeXBlcygpIHtcbiAgICBsZXQgY29kZUJsb2NrVHlwZSA9IGZhbHNlO1xuICAgIGxldCBjb2RlQmxvY2tTZXFMZW5ndGggPSAwO1xuICAgIGxldCBodG1sQmxvY2sgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGxpbmVOdW0gPSAwOyBsaW5lTnVtIDwgdGhpcy5saW5lcy5sZW5ndGg7IGxpbmVOdW0rKykge1xuICAgICAgbGV0IGxpbmVUeXBlID0gJ1RNUGFyYSc7XG4gICAgICBsZXQgbGluZUNhcHR1cmUgPSBbdGhpcy5saW5lc1tsaW5lTnVtXV07XG4gICAgICBsZXQgbGluZVJlcGxhY2VtZW50ID0gJyQkMCc7IC8vIERlZmF1bHQgcmVwbGFjZW1lbnQgZm9yIHBhcmFncmFwaDogSW5saW5lIGZvcm1hdCB0aGUgZW50aXJlIGxpbmVcblxuICAgICAgLy8gQ2hlY2sgb25nb2luZyBjb2RlIGJsb2Nrc1xuICAgICAgLy8gaWYgKGxpbmVOdW0gPiAwICYmICh0aGlzLmxpbmVUeXBlc1tsaW5lTnVtIC0gMV0gPT0gJ1RNQ29kZUZlbmNlQmFja3RpY2tPcGVuJyB8fCB0aGlzLmxpbmVUeXBlc1tsaW5lTnVtIC0gMV0gPT0gJ1RNRmVuY2VkQ29kZUJhY2t0aWNrJykpIHtcbiAgICAgIGlmIChjb2RlQmxvY2tUeXBlID09ICdUTUNvZGVGZW5jZUJhY2t0aWNrT3BlbicpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gYSBiYWNrdGljay1mZW5jZWQgY29kZSBibG9jaywgY2hlY2sgaWYgdGhlIGN1cnJlbnQgbGluZSBjbG9zZXMgaXRcbiAgICAgICAgbGV0IGNhcHR1cmUgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2UucmVnZXhwLmV4ZWModGhpcy5saW5lc1tsaW5lTnVtXSk7XG4gICAgICAgIGlmIChjYXB0dXJlICYmIGNhcHR1cmUuZ3JvdXBzWydzZXEnXS5sZW5ndGggPj0gY29kZUJsb2NrU2VxTGVuZ3RoKSB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1Db2RlRmVuY2VCYWNrdGlja0Nsb3NlJztcbiAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2UucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgIGNvZGVCbG9ja1R5cGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lVHlwZSA9ICdUTUZlbmNlZENvZGVCYWNrdGljayc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJztcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICAgIC8vIGlmIChsaW5lTnVtID4gMCAmJiAodGhpcy5saW5lVHlwZXNbbGluZU51bSAtIDFdID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bSAtIDFdID09ICdUTUZlbmNlZENvZGVUaWxkZScpKSB7XG4gICAgICBlbHNlIGlmIChjb2RlQmxvY2tUeXBlID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gYSB0aWxkZS1mZW5jZWQgY29kZSBibG9ja1xuICAgICAgICBsZXQgY2FwdHVyZSA9IGxpbmVHcmFtbWFyLlRNQ29kZUZlbmNlVGlsZGVDbG9zZS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgaWYgKGNhcHR1cmUgJiYgY2FwdHVyZS5ncm91cHNbJ3NlcSddLmxlbmd0aCA+PSBjb2RlQmxvY2tTZXFMZW5ndGgpICB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1Db2RlRmVuY2VUaWxkZUNsb3NlJztcbiAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZVRpbGRlQ2xvc2UucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgIGNvZGVCbG9ja1R5cGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBsaW5lVHlwZSA9ICdUTUZlbmNlZENvZGVUaWxkZSc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJztcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgfSBcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgSFRNTCBibG9jayB0eXBlc1xuICAgICAgaWYgKGxpbmVUeXBlID09ICdUTVBhcmEnICYmIGh0bWxCbG9jayA9PT0gZmFsc2UpIHtcbiAgICAgICAgZm9yIChsZXQgaHRtbEJsb2NrVHlwZSBvZiBodG1sQmxvY2tHcmFtbWFyKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGluZXNbbGluZU51bV0ubWF0Y2goaHRtbEJsb2NrVHlwZS5zdGFydCkpIHtcbiAgICAgICAgICAgIC8vIE1hdGNoaW5nIHN0YXJ0IGNvbmRpdGlvbi4gQ2hlY2sgaWYgdGhpcyB0YWcgY2FuIHN0YXJ0IGhlcmUgKG5vdCBhbGwgc3RhcnQgY29uZGl0aW9ucyBhbGxvdyBicmVha2luZyBhIHBhcmFncmFwaCkuXG4gICAgICAgICAgICBpZiAoaHRtbEJsb2NrVHlwZS5wYXJhSW50ZXJydXB0IHx8IGxpbmVOdW0gPT0gMCB8fCAhKHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNUGFyYScgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1VTCcgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1PTCcgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1CbG9ja3F1b3RlJykpIHtcbiAgICAgICAgICAgICAgaHRtbEJsb2NrID0gaHRtbEJsb2NrVHlwZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChodG1sQmxvY2sgIT09IGZhbHNlKSB7XG4gICAgICAgIGxpbmVUeXBlID0gJ1RNSFRNTEJsb2NrJztcbiAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJzsgLy8gTm8gZm9ybWF0dGluZyBpbiBUTUhUTUxCbG9ja1xuICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTsgLy8gVGhpcyBzaG91bGQgYWxyZWFkeSBiZSBzZXQgYnV0IGJldHRlciBzYWZlIHRoYW4gc29ycnlcblxuICAgICAgICAvLyBDaGVjayBpZiBIVE1MIGJsb2NrIHNob3VsZCBiZSBjbG9zZWRcbiAgICAgICAgaWYgKGh0bWxCbG9jay5lbmQpIHtcbiAgICAgICAgICAvLyBTcGVjaWZpYyBlbmQgY29uZGl0aW9uXG4gICAgICAgICAgaWYgKHRoaXMubGluZXNbbGluZU51bV0ubWF0Y2goaHRtbEJsb2NrLmVuZCkpIHtcbiAgICAgICAgICAgIGh0bWxCbG9jayA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBObyBzcGVjaWZpYyBlbmQgY29uZGl0aW9uLCBlbmRzIHdpdGggYmxhbmsgbGluZVxuICAgICAgICAgIGlmIChsaW5lTnVtID09IHRoaXMubGluZXMubGVuZ3RoIC0gMSB8fCB0aGlzLmxpbmVzW2xpbmVOdW0rMV0ubWF0Y2gobGluZUdyYW1tYXIuVE1CbGFua0xpbmUucmVnZXhwKSkge1xuICAgICAgICAgICAgaHRtbEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGFsbCByZWdleHBzIGlmIHdlIGhhdmVuJ3QgYXBwbGllZCBvbmUgb2YgdGhlIGNvZGUgYmxvY2sgdHlwZXNcbiAgICAgIGlmIChsaW5lVHlwZSA9PSAnVE1QYXJhJykge1xuICAgICAgICBmb3IgKGxldCB0eXBlIGluIGxpbmVHcmFtbWFyKSB7XG4gICAgICAgICAgaWYgKGxpbmVHcmFtbWFyW3R5cGVdLnJlZ2V4cCkge1xuICAgICAgICAgICAgbGV0IGNhcHR1cmUgPSBsaW5lR3JhbW1hclt0eXBlXS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgICAgIGlmIChjYXB0dXJlKSB7XG4gICAgICAgICAgICAgIGxpbmVUeXBlID0gdHlwZTtcbiAgICAgICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXJbdHlwZV0ucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgIGxpbmVDYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlJ3ZlIG9wZW5lZCBhIGNvZGUgYmxvY2ssIHJlbWVtYmVyIHRoYXRcbiAgICAgIGlmIChsaW5lVHlwZSA9PSAnVE1Db2RlRmVuY2VCYWNrdGlja09wZW4nIHx8IGxpbmVUeXBlID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicpIHtcbiAgICAgICAgY29kZUJsb2NrVHlwZSA9IGxpbmVUeXBlO1xuICAgICAgICBjb2RlQmxvY2tTZXFMZW5ndGggPSBsaW5lQ2FwdHVyZS5ncm91cHNbJ3NlcSddLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgLy8gTGluayByZWZlcmVuY2UgZGVmaW5pdGlvbiBhbmQgaW5kZW50ZWQgY29kZSBjYW4ndCBpbnRlcnJ1cHQgYSBwYXJhZ3JhcGhcbiAgICAgIGlmIChcbiAgICAgICAgKGxpbmVUeXBlID09ICdUTUluZGVudGVkQ29kZScgfHwgbGluZVR5cGUgPT0gJ1RNTGlua1JlZmVyZW5jZURlZmluaXRpb24nKSBcbiAgICAgICAgJiYgbGluZU51bSA+IDAgXG4gICAgICAgICYmICh0aGlzLmxpbmVUeXBlc1tsaW5lTnVtLTFdID09ICdUTVBhcmEnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNVUwnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNT0wnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNQmxvY2txdW90ZScpXG4gICAgICApIHtcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIFRNUGFyYVxuICAgICAgICBsaW5lVHlwZSA9ICdUTVBhcmEnO1xuICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQkMCc7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldGV4dCBIMiBtYXJrZXJzIHRoYXQgY2FuIGFsc28gYmUgaW50ZXJwcmV0ZWQgYXMgYW4gZW1wdHkgbGlzdCBpdGVtIHNob3VsZCBiZSByZWdhcmRlZCBhcyBzdWNoIChhcyBwZXIgQ29tbW9uTWFyayBzcGVjKVxuICAgICAgaWYgKGxpbmVUeXBlID09ICdUTVNldGV4dEgyTWFya2VyJykge1xuICAgICAgICBsZXQgY2FwdHVyZSA9IGxpbmVHcmFtbWFyLlRNVUwucmVnZXhwLmV4ZWModGhpcy5saW5lc1tsaW5lTnVtXSk7XG4gICAgICAgIGlmIChjYXB0dXJlKSB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1VTCc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXIuVE1VTC5yZXBsYWNlbWVudDtcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgIH0gICAgICBcbiAgICAgIH1cblxuICAgICAgLy8gU2V0ZXh0IGhlYWRpbmdzIGFyZSBvbmx5IHZhbGlkIGlmIHByZWNlZGVkIGJ5IGEgcGFyYWdyYXBoIChhbmQgaWYgc28sIHRoZXkgY2hhbmdlIHRoZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBwYXJhZ3JhcGgpXG4gICAgICBpZiAobGluZVR5cGUgPT0gJ1RNU2V0ZXh0SDFNYXJrZXInIHx8IGxpbmVUeXBlID09ICdUTVNldGV4dEgyTWFya2VyJykge1xuICAgICAgICBpZiAobGluZU51bSA9PSAwIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0gLSAxXSAhPSAnVE1QYXJhJykge1xuICAgICAgICAgIC8vIFNldGV4dCBtYXJrZXIgaXMgaW52YWxpZC4gSG93ZXZlciwgYSBIMiBtYXJrZXIgbWlnaHQgc3RpbGwgYmUgYSB2YWxpZCBIUiwgc28gbGV0J3MgY2hlY2sgdGhhdFxuICAgICAgICAgIGxldCBjYXB0dXJlID0gbGluZUdyYW1tYXIuVE1IUi5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgICBpZiAoY2FwdHVyZSkge1xuICAgICAgICAgICAgLy8gVmFsaWQgSFJcbiAgICAgICAgICAgIGxpbmVUeXBlID0gJ1RNSFInO1xuICAgICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXIuVE1IUi5yZXBsYWNlbWVudDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm90IHZhbGlkIEhSLCBmb3JtYXQgYXMgVE1QYXJhXG4gICAgICAgICAgICBsaW5lVHlwZSA9ICdUTVBhcmEnO1xuICAgICAgICAgICAgbGluZUNhcHR1cmUgPSBbdGhpcy5saW5lc1tsaW5lTnVtXV07XG4gICAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSAnJCQwJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVmFsaWQgc2V0ZXh0IG1hcmtlci4gQ2hhbmdlIHR5cGVzIG9mIHByZWNlZGluZyBwYXJhIGxpbmVzXG4gICAgICAgICAgbGV0IGhlYWRpbmdMaW5lID0gbGluZU51bSAtIDE7XG4gICAgICAgICAgY29uc3QgaGVhZGluZ0xpbmVUeXBlID0gKGxpbmVUeXBlID09ICdUTVNldGV4dEgxTWFya2VyJyA/ICdUTVNldGV4dEgxJyA6ICdUTVNldGV4dEgyJyk7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKHRoaXMubGluZVR5cGVzW2hlYWRpbmdMaW5lVHlwZV0gIT0gaGVhZGluZ0xpbmVUeXBlKSB7XG4gICAgICAgICAgICAgIHRoaXMubGluZVR5cGVzW2hlYWRpbmdMaW5lXSA9IGhlYWRpbmdMaW5lVHlwZTsgXG4gICAgICAgICAgICAgIHRoaXMubGluZURpcnR5W2hlYWRpbmdMaW5lVHlwZV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saW5lUmVwbGFjZW1lbnRzW2hlYWRpbmdMaW5lXSA9ICckJDAnO1xuICAgICAgICAgICAgdGhpcy5saW5lQ2FwdHVyZXNbaGVhZGluZ0xpbmVdID0gW3RoaXMubGluZXNbaGVhZGluZ0xpbmVdXTtcblxuICAgICAgICAgICAgaGVhZGluZ0xpbmUtLTtcbiAgICAgICAgICB9IHdoaWxlKGhlYWRpbmdMaW5lID49IDAgJiYgdGhpcy5saW5lVHlwZXNbaGVhZGluZ0xpbmVdID09ICdUTVBhcmEnKTsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIExhc3RseSwgc2F2ZSB0aGUgbGluZSBzdHlsZSB0byBiZSBhcHBsaWVkIGxhdGVyXG4gICAgICBpZiAodGhpcy5saW5lVHlwZXNbbGluZU51bV0gIT0gbGluZVR5cGUpIHtcbiAgICAgICAgdGhpcy5saW5lVHlwZXNbbGluZU51bV0gPSBsaW5lVHlwZTtcbiAgICAgICAgdGhpcy5saW5lRGlydHlbbGluZU51bV0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5saW5lUmVwbGFjZW1lbnRzW2xpbmVOdW1dID0gbGluZVJlcGxhY2VtZW50O1xuICAgICAgdGhpcy5saW5lQ2FwdHVyZXNbbGluZU51bV0gPSBsaW5lQ2FwdHVyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgbGluZSBjb250ZW50cyBmcm9tIHRoZSBIVE1MLCB0aGVuIHJlLWFwcGxpZXMgZm9ybWF0dGluZy5cbiAgICovXG4gIHVwZGF0ZUxpbmVDb250ZW50c0FuZEZvcm1hdHRpbmcoKSB7XG4gICAgdGhpcy5jbGVhckRpcnR5RmxhZygpO1xuICAgIHRoaXMudXBkYXRlTGluZUNvbnRlbnRzKCk7XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gcGFyc2UgYSBsaW5rIG9yIGltYWdlIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLiBUaGlzIGFzc3VtZXMgdGhhdCB0aGUgb3BlbmluZyBbIG9yICFbIGhhcyBhbHJlYWR5IGJlZW4gbWF0Y2hlZC4gXG4gICAqIFJldHVybnMgZmFsc2UgaWYgdGhpcyBpcyBub3QgYSB2YWxpZCBsaW5rLCBpbWFnZS4gU2VlIGJlbG93IGZvciBtb3JlIGluZm9ybWF0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW5hbFN0cmluZyBUaGUgb3JpZ2luYWwgc3RyaW5nLCBzdGFydGluZyBhdCB0aGUgb3BlbmluZyBtYXJrZXIgKFsgb3IgIVspXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNJbWFnZSBXaGV0aGVyIG9yIG5vdCB0aGlzIGlzIGFuIGltYWdlIChvcGVuZXIgPT0gIVspXG4gICAqIEByZXR1cm5zIGZhbHNlIGlmIG5vdCBhIHZhbGlkIGxpbmsgLyBpbWFnZS4gXG4gICAqIE90aGVyd2lzZSByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOiBvdXRwdXQgaXMgdGhlIHN0cmluZyB0byBiZSBpbmNsdWRlZCBpbiB0aGUgcHJvY2Vzc2VkIG91dHB1dCwgXG4gICAqIGNoYXJDb3VudCBpcyB0aGUgbnVtYmVyIG9mIGlucHV0IGNoYXJhY3RlcnMgKGZyb20gb3JpZ2luYWxTdHJpbmcpIGNvbnN1bWVkLlxuICAgKi9cbiAgcGFyc2VMaW5rT3JJbWFnZShvcmlnaW5hbFN0cmluZywgaXNJbWFnZSkge1xuICAgIC8vIFNraXAgdGhlIG9wZW5pbmcgYnJhY2tldFxuICAgIGxldCB0ZXh0T2Zmc2V0ID0gaXNJbWFnZSA/IDIgOiAxO1xuICAgIGxldCBvcGVuZXIgPSBvcmlnaW5hbFN0cmluZy5zdWJzdHIoMCwgdGV4dE9mZnNldCk7XG4gICAgbGV0IHR5cGUgPSBpc0ltYWdlID8gJ1RNSW1hZ2UnIDogJ1RNTGluayc7XG4gICAgbGV0IGN1cnJlbnRPZmZzZXQgPSB0ZXh0T2Zmc2V0O1xuICAgIFxuICAgIGxldCBicmFja2V0TGV2ZWwgPSAxO1xuICAgIGxldCBsaW5rVGV4dCA9IGZhbHNlO1xuICAgIGxldCBsaW5rUmVmID0gZmFsc2U7XG4gICAgbGV0IGxpbmtMYWJlbCA9IFtdO1xuICAgIGxldCBsaW5rRGV0YWlscyA9IFtdOyAvLyBJZiBtYXRjaGVkLCB0aGlzIHdpbGwgYmUgYW4gYXJyYXk6IFt3aGl0ZXNwYWNlICsgbGluayBkZXN0aW5hdGlvbiBkZWxpbWl0ZXIsIGxpbmsgZGVzdGluYXRpb24sIGxpbmsgZGVzdGluYXRpb24gZGVsaW1pdGVyLCB3aGl0ZXNwYWNlLCBsaW5rIHRpdGxlIGRlbGltaXRlciwgbGluayB0aXRsZSwgbGluayB0aXRsZSBkZWxpbWl0ZXIgKyB3aGl0ZXNwYWNlXS4gQWxsIGNhbiBiZSBlbXB0eSBzdHJpbmdzLlxuXG4gIFxuICAgIHRleHRPdXRlcjogd2hpbGUgKGN1cnJlbnRPZmZzZXQgPCBvcmlnaW5hbFN0cmluZy5sZW5ndGggJiYgbGlua1RleHQgPT09IGZhbHNlIC8qIGVtcHR5IHN0cmluZyBpcyBva2F5ICovKSB7XG4gICAgICBsZXQgc3RyaW5nID0gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKGN1cnJlbnRPZmZzZXQpO1xuICBcbiAgICAgIC8vIENhcHR1cmUgYW55IGVzY2FwZXMgYW5kIGNvZGUgYmxvY2tzIGF0IGN1cnJlbnQgcG9zaXRpb24sIHRoZXkgYmluZCBtb3JlIHN0cm9uZ2x5IHRoYW4gbGlua3NcbiAgICAgIC8vIFdlIGRvbid0IGhhdmUgdG8gYWN0dWFsbHkgcHJvY2VzcyB0aGVtIGhlcmUsIHRoYXQnbGwgYmUgZG9uZSBsYXRlciBpbiBjYXNlIHRoZSBsaW5rIC8gaW1hZ2UgaXMgdmFsaWQsIGJ1dCB3ZSBuZWVkIHRvIHNraXAgb3ZlciB0aGVtLlxuICAgICAgZm9yIChsZXQgcnVsZSBvZiBbJ2VzY2FwZScsICdjb2RlJywgJ2F1dG9saW5rJywgJ2h0bWwnXSkge1xuICAgICAgICBsZXQgY2FwID0gaW5saW5lR3JhbW1hcltydWxlXS5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgY3VycmVudE9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIGNvbnRpbnVlIHRleHRPdXRlcjsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgXG4gICAgICAvLyBDaGVjayBmb3IgaW1hZ2UuIEl0J3Mgb2theSBmb3IgYW4gaW1hZ2UgdG8gYmUgaW5jbHVkZWQgaW4gYSBsaW5rIG9yIGltYWdlXG4gICAgICBpZiAoc3RyaW5nLm1hdGNoKGlubGluZUdyYW1tYXIuaW1hZ2VPcGVuLnJlZ2V4cCkpIHtcbiAgICAgICAgLy8gT3BlbmluZyBpbWFnZS4gSXQncyBva2F5IGlmIHRoaXMgaXMgYSBtYXRjaGluZyBwYWlyIG9mIGJyYWNrZXRzXG4gICAgICAgIGJyYWNrZXRMZXZlbCsrO1xuICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IDI7XG4gICAgICAgIGNvbnRpbnVlIHRleHRPdXRlcjtcbiAgICAgIH1cbiAgXG4gICAgICAvLyBDaGVjayBmb3IgbGluayAobm90IGFuIGltYWdlIGJlY2F1c2UgdGhhdCB3b3VsZCBoYXZlIGJlZW4gY2FwdHVyZWQgYW5kIHNraXBwZWQgb3ZlciBhYm92ZSlcbiAgICAgIGlmIChzdHJpbmcubWF0Y2goaW5saW5lR3JhbW1hci5saW5rT3Blbi5yZWdleHApKSB7XG4gICAgICAgIC8vIE9wZW5pbmcgYnJhY2tldC4gVHdvIHRoaW5ncyB0byBkbzpcbiAgICAgICAgLy8gMSkgaXQncyBva2F5IGlmIHRoaXMgcGFydCBvZiBhIHBhaXIgb2YgYnJhY2tldHMuXG4gICAgICAgIC8vIDIpIElmIHdlIGFyZSBjdXJyZW50bHkgdHJ5aW5nIHRvIHBhcnNlIGEgbGluaywgdGhpcyBuZXN0ZWQgYnJhY2tldCBtdXNuJ3Qgc3RhcnQgYSB2YWxpZCBsaW5rIChubyBuZXN0ZWQgbGlua3MgYWxsb3dlZClcbiAgICAgICAgYnJhY2tldExldmVsKys7XG4gICAgICAgIC8vIGlmIChicmFja2V0TGV2ZWwgPj0gMikgcmV0dXJuIGZhbHNlOyAvLyBOZXN0ZWQgdW5lc2NhcGVkIGJyYWNrZXRzLCB0aGlzIGRvZXNuJ3QgcXVhbGlmeSBhcyBhIGxpbmsgLyBpbWFnZVxuICAgICAgICBpZiAoIWlzSW1hZ2UpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJzZUxpbmtPckltYWdlKHN0cmluZywgZmFsc2UpKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBsaW5rIGluc2lkZSB0aGlzIHBvc3NpYmxlIGxpbmssIHdoaWNoIG1ha2VzIHRoaXMgbGluayBpbnZhbGlkIChpbm5lciBsaW5rcyBiZWF0IG91dGVyIG9uZXMpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRPZmZzZXQgKz0gMTtcbiAgICAgICAgY29udGludWUgdGV4dE91dGVyO1xuICAgICAgfVxuICBcbiAgICAgIC8vIENoZWNrIGZvciBjbG9zaW5nIGJyYWNrZXRcbiAgICAgIGlmIChzdHJpbmcubWF0Y2goL15cXF0vKSkge1xuICAgICAgICBicmFja2V0TGV2ZWwtLTtcbiAgICAgICAgaWYgKGJyYWNrZXRMZXZlbCA9PSAwKSB7XG4gICAgICAgICAgLy8gRm91bmQgbWF0Y2hpbmcgYnJhY2tldCBhbmQgaGF2ZW4ndCBmb3VuZCBhbnl0aGluZyBkaXNxdWFsaWZ5aW5nIHRoaXMgYXMgbGluayAvIGltYWdlLlxuICAgICAgICAgIGxpbmtUZXh0ID0gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKHRleHRPZmZzZXQsIGN1cnJlbnRPZmZzZXQgLSB0ZXh0T2Zmc2V0KTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgdGV4dE91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgLy8gTm90aGluZyBtYXRjaGVzLCBwcm9jZWVkIHRvIG5leHQgY2hhclxuICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgIH1cbiAgXG4gICAgLy8gRGlkIHdlIGZpbmQgYSBsaW5rIHRleHQgKGkuZS4sIGZpbmQgYSBtYXRjaGluZyBjbG9zaW5nIGJyYWNrZXQ/KVxuICAgIGlmIChsaW5rVGV4dCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTsgLy8gTm9wZVxuICBcbiAgICAvLyBTbyBmYXIsIHNvIGdvb2QuIFdlJ3ZlIGdvdCBhIHZhbGlkIGxpbmsgdGV4dC4gTGV0J3Mgc2VlIHdoYXQgdHlwZSBvZiBsaW5rIHRoaXMgaXNcbiAgICBsZXQgbmV4dENoYXIgPSBjdXJyZW50T2Zmc2V0IDwgb3JpZ2luYWxTdHJpbmcubGVuZ3RoID8gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKGN1cnJlbnRPZmZzZXQsIDEpIDogJyc7IFxuXG4gICAgLy8gUkVGRVJFTkNFIExJTktTXG4gICAgaWYgKG5leHRDaGFyID09ICdbJykge1xuICAgICAgbGV0IHN0cmluZyA9IG9yaWdpbmFsU3RyaW5nLnN1YnN0cihjdXJyZW50T2Zmc2V0KTtcbiAgICAgIGxldCBjYXAgPSBpbmxpbmVHcmFtbWFyLmxpbmtMYWJlbC5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICAvLyBWYWxpZCBsaW5rIGxhYmVsXG4gICAgICAgIGN1cnJlbnRPZmZzZXQgKz0gY2FwWzBdLmxlbmd0aDtcbiAgICAgICAgbGlua0xhYmVsLnB1c2goY2FwWzFdLCBjYXBbMl0sIGNhcFszXSk7XG4gICAgICAgIGlmIChjYXBbaW5saW5lR3JhbW1hci5saW5rTGFiZWwubGFiZWxQbGFjZWhvbGRlcl0pIHtcbiAgICAgICAgICAvLyBGdWxsIHJlZmVyZW5jZSBsaW5rXG4gICAgICAgICAgbGlua1JlZiA9IGNhcFtpbmxpbmVHcmFtbWFyLmxpbmtMYWJlbC5sYWJlbFBsYWNlaG9sZGVyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDb2xsYXBzZWQgcmVmZXJlbmNlIGxpbmtcbiAgICAgICAgICBsaW5rUmVmID0gbGlua1RleHQudHJpbSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3QgYSB2YWxpZCBsaW5rIGxhYmVsXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gICBcbiAgICB9IGVsc2UgaWYgKG5leHRDaGFyICE9ICcoJykge1xuICAgICAgXG4gICAgICAvLyBTaG9ydGN1dCByZWYgbGlua1xuICAgICAgbGlua1JlZiA9IGxpbmtUZXh0LnRyaW0oKTtcblxuICAgIC8vIElOTElORSBMSU5LU1xuICAgIH0gZWxzZSB7IC8vIG5leHRDaGFyID09ICcoJ1xuICAgICAgXG4gICAgICAvLyBQb3RlbnRpYWwgaW5saW5lIGxpbmtcbiAgICAgIGN1cnJlbnRPZmZzZXQrKztcblxuICAgICAgbGV0IHBhcmVudGhlc2lzTGV2ZWwgPSAxO1xuICAgICAgaW5saW5lT3V0ZXI6IHdoaWxlIChjdXJyZW50T2Zmc2V0IDwgb3JpZ2luYWxTdHJpbmcubGVuZ3RoICYmIHBhcmVudGhlc2lzTGV2ZWwgPiAwKSB7XG4gICAgICAgIGxldCBzdHJpbmcgPSBvcmlnaW5hbFN0cmluZy5zdWJzdHIoY3VycmVudE9mZnNldCk7XG5cbiAgICAgICAgLy8gUHJvY2VzcyB3aGl0ZXNwYWNlXG4gICAgICAgIGxldCBjYXAgPSAvXlxccysvLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgIHN3aXRjaCAobGlua0RldGFpbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6IGxpbmtEZXRhaWxzLnB1c2goY2FwWzBdKTsgYnJlYWs7IC8vIE9wZW5pbmcgd2hpdGVzcGFjZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOy8vIE9wZW4gZGVzdGluYXRpb24sIGJ1dCBub3QgYSBkZXN0aW5hdGlvbiB5ZXQ7IGRlc2luYXRpb24gb3BlbmVkIHdpdGggPFxuICAgICAgICAgICAgY2FzZSAyOiAvLyBPcGVuIGRlc3RpbmF0aW9uIHdpdGggY29udGVudCBpbiBpdC4gV2hpdGVzcGFjZSBvbmx5IGFsbG93ZWQgaWYgb3BlbmVkIGJ5IGFuZ2xlIGJyYWNrZXQsIG90aGVyd2lzZSB0aGlzIGNsb3NlcyB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgICAgaWYgKGxpbmtEZXRhaWxzWzBdLm1hdGNoKC88LykpIHtcbiAgICAgICAgICAgICAgICBsaW5rRGV0YWlsc1sxXSA9IGxpbmtEZXRhaWxzWzFdLmNvbmNhdChjYXBbMF0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsICE9IDEpIHJldHVybiBmYWxzZTsgLy8gVW5iYWxhbmNlZCBwYXJlbnRoZXNpc1xuICAgICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBFbXB0eSBlbmQgZGVsaW1pdGVyIGZvciBkZXN0aW5hdGlvblxuICAgICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goY2FwWzBdKTsgLy8gV2hpdGVzcGFjZSBpbiBiZXR3ZWVuIGRlc3RpbmF0aW9uIGFuZCB0aXRsZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGJldHdlZW4gZGVzdGluYXRpb24gYW5kIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmYWxzZTsgLy8gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuIChubyBvcGVuZXIgZm9yIHRpdGxlIHlldCwgYnV0IG1vcmUgd2hpdGVzcGFjZSB0byBjYXB0dXJlKVxuICAgICAgICAgICAgY2FzZSA1OiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gV2hpdGVzcGFjZSBhdCBiZWdpbm5pbmcgb2YgdGl0bGUsIHB1c2ggZW1wdHkgdGl0bGUgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBjYXNlIDY6IGxpbmtEZXRhaWxzWzVdID0gbGlua0RldGFpbHNbNV0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGluIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDc6IGxpbmtEZXRhaWxzWzZdID0gbGlua0RldGFpbHNbNl0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGFmdGVyIGNsb3NpbmcgZGVsaW1pdGVyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7IC8vIFdlIHNob3VsZCBuZXZlciBnZXQgaGVyZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIGJhY2tzbGFzaCBlc2NhcGVzXG4gICAgICAgIGNhcCA9IGlubGluZUdyYW1tYXIuZXNjYXBlLnJlZ2V4cC5leGVjKHN0cmluZyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICBzd2l0Y2ggKGxpbmtEZXRhaWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gdGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYWRkIGVtcHR5IG9wZW5pbmcgZGVsaW1pdGVyIGFuZCBwcm9jZWVkIHRvIG5leHQgY2FzZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOyAvLyBUaGlzIG9wZW5zIHRoZSBsaW5rIGRlc3RpbmF0aW9uLCBhcHBlbmQgaXRcbiAgICAgICAgICAgIGNhc2UgMjogbGlua0RldGFpbHNbMV0gPSBsaW5rRGV0YWlsc1sxXS5jb25jYXQoY2FwWzBdKTsgYnJlYWs7IC8vIFBhcnQgb2YgdGhlIGxpbmsgZGVzdGluYXRpb25cbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIGZhbHNlOyAvLyBMYWNraW5nIG9wZW5pbmcgZGVsaW1pdGVyIGZvciBsaW5rIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmYWxzZTsgLy8gTGNha2luZyBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA1OiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gVGhpcyBvcGVucyB0aGUgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA2OiBsaW5rRGV0YWlsc1s1XSA9IGxpbmtEZXRhaWxzWzVdLmNvbmNhdChjYXBbMF0pOyBicmVhazsgLy8gUGFydCBvZiB0aGUgbGluayB0aXRsZVxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlOyAvLyBBZnRlciBsaW5rIHRpdGxlIHdhcyBjbG9zZWQsIHdpdGhvdXQgY2xvc2luZyBwYXJlbnRoZXNpc1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIG9wZW5pbmcgYW5nbGUgYnJhY2tldCBhcyBkZWlsaW1pdGVyIG9mIGRlc3RpbmF0aW9uXG4gICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPCAyICYmIHN0cmluZy5tYXRjaCgvXjwvKSkge1xuICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gMCkgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgbGlua0RldGFpbHNbMF0gPSBsaW5rRGV0YWlsc1swXS5jb25jYXQoJzwnKTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIGNsb3NpbmcgYW5nbGUgYnJhY2tldCBhcyBkZWxpbWl0ZXIgb2YgZGVzdGluYXRpb25cbiAgICAgICAgaWYgKChsaW5rRGV0YWlscy5sZW5ndGggPT0gMSB8fCBsaW5rRGV0YWlscy5sZW5ndGggPT0gMikgJiYgc3RyaW5nLm1hdGNoKC9ePi8pKSB7XG4gICAgICAgICAgaWYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAxKSBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gRW1wdHkgbGluayBkZXN0aW5hdGlvblxuICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJz4nKTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzICBub24tcGFyZW50aGVzaXMgZGVsaW1pdGVyIGZvciB0aXRsZS4gXG4gICAgICAgIGNhcCA9IC9eW1wiJ10vLmV4ZWMoc3RyaW5nKVxuICAgICAgICAvLyBGb3IgdGhpcyB0byBiZSBhIHZhbGlkIG9wZW5lciwgd2UgaGF2ZSB0byBlaXRoZXIgaGF2ZSBubyBkZXN0aW5hdGlvbiwgb25seSB3aGl0ZXNwYWNlIHNvIGZhcixcbiAgICAgICAgLy8gb3IgYSBkZXN0aW5hdGlvbiB3aXRoIHRyYWlsaW5nIHdoaXRlc3BhY2UuXG4gICAgICAgIGlmIChjYXAgJiYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAwIHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAxIHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA0KSkge1xuICAgICAgICAgIHdoaWxlIChsaW5rRGV0YWlscy5sZW5ndGggPCA0KSBsaW5rRGV0YWlscy5wdXNoKCcnKTtcbiAgICAgICAgICBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7XG4gICAgICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIHRoaXMgdG8gYmUgYSB2YWxpZCBjbG9zZXIsIHdlIGhhdmUgdG8gaGF2ZSBhbiBvcGVuZXIgYW5kIHNvbWUgb3Igbm8gdGl0bGUsIGFuZCB0aGlzIGhhcyB0byBtYXRjaCB0aGUgb3BlbmVyXG4gICAgICAgIGlmIChjYXAgJiYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA1IHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA2KSAmJiBsaW5rRGV0YWlsc1s0XSA9PSBjYXBbMF0pIHtcbiAgICAgICAgICBpZiAobGlua0RldGFpbHMubGVuZ3RoID09IDUpIGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBFbXB0eSBsaW5rIHRpdGxlXG4gICAgICAgICAgbGlua0RldGFpbHMucHVzaChjYXBbMF0pO1xuICAgICAgICAgIGN1cnJlbnRPZmZzZXQrKztcbiAgICAgICAgICBjb250aW51ZSBpbmxpbmVPdXRlcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlciBjYXNlcyAobGlua0RldGFpbHMubGVuZ3RoID09IDIsIDMsIDcpIHdpbGwgYmUgaGFuZGxlZCB3aXRoIHRoZSBcImRlZmF1bHRcIiBjYXNlIGJlbG93LlxuXG4gICAgICAgIC8vIFByb2Nlc3Mgb3BlbmluZyBwYXJlbnRoZXNpc1xuICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKC9eXFwoLykpIHtcbiAgICAgICAgICBzd2l0Y2ggKGxpbmtEZXRhaWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gdGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYWRkIGVtcHR5IG9wZW5pbmcgZGVsaW1pdGVyIGFuZCBwcm9jZWVkIHRvIG5leHQgY2FzZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gVGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvblxuICAgICAgICAgICAgY2FzZSAyOiAvLyBQYXJ0IG9mIHRoZSBsaW5rIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAgIGxpbmtEZXRhaWxzWzFdID0gbGlua0RldGFpbHNbMV0uY29uY2F0KCcoJyk7IFxuICAgICAgICAgICAgICBpZiAoIWxpbmtEZXRhaWxzWzBdLm1hdGNoKC88JC8pKSBwYXJlbnRoZXNpc0xldmVsKys7ICBcbiAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgY2FzZSAzOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgIC8vICBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA0OiBsaW5rRGV0YWlscy5wdXNoKCcoJyk7IGJyZWFrOy8vIG9wZW5pbmcgZGVsaW1pdGVyIGZvciBsaW5rIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDU6IGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBvcGVucyB0aGUgbGluayB0aXRsZSwgYWRkIGVtcHR5IHRpdGxlIGNvbnRlbnQgYW5kIHByb2NlZWQgdG8gbmV4dCBjYXNlIFxuICAgICAgICAgICAgY2FzZSA2Oi8vIFBhcnQgb2YgdGhlIGxpbmsgdGl0bGUuIFVuLWVzY2FwZWQgcGFyZW50aGVzaXMgb25seSBhbGxvd2VkIGluIFwiIG9yICcgZGVsaW1pdGVkIHRpdGxlXG4gICAgICAgICAgICAgIGlmIChsaW5rRGV0YWlsc1s0XSA9PSAnKCcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgbGlua0RldGFpbHNbNV0gPSBsaW5rRGV0YWlsc1s1XS5jb25jYXQoJygnKTsgXG4gICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTsgLy8gQWZ0ZXIgbGluayB0aXRsZSB3YXMgY2xvc2VkLCB3aXRob3V0IGNsb3NpbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJvY2VzcyBjbG9zaW5nIHBhcmVudGhlc2lzXG4gICAgICAgIGlmIChzdHJpbmcubWF0Y2goL15cXCkvKSkge1xuICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPD0gMikge1xuICAgICAgICAgICAgLy8gV2UgYXJlIGluc2lkZSB0aGUgbGluayBkZXN0aW5hdGlvbi4gUGFyZW50aGVzZXMgaGF2ZSB0byBiZSBtYXRjaGVkIGlmIG5vdCBpbiBhbmdsZSBicmFja2V0c1xuICAgICAgICAgICAgd2hpbGUgKGxpbmtEZXRhaWxzLmxlbmd0aCA8IDIpIGxpbmtEZXRhaWxzLnB1c2goJycpO1xuXG4gICAgICAgICAgICBpZiAoIWxpbmtEZXRhaWxzWzBdLm1hdGNoKC88JC8pKSBwYXJlbnRoZXNpc0xldmVsLS07XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID4gMCkge1xuICAgICAgICAgICAgICBsaW5rRGV0YWlsc1sxXSA9IGxpbmtEZXRhaWxzWzFdLmNvbmNhdCgnKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSBlbHNlIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gNSB8fCBsaW5rRGV0YWlscy5sZW5ndGggPT0gNikge1xuICAgICAgICAgICAgLy8gV2UgYXJlIGluc2lkZSB0aGUgbGluayB0aXRsZS4gXG4gICAgICAgICAgICBpZiAobGlua0RldGFpbHNbNF0gPT0gJygnKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgY2xvc2VzIHRoZSBsaW5rIHRpdGxlXG4gICAgICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gNSkgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJyknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEp1c3QgcmVndWxhciBvbCcgY29udGVudFxuICAgICAgICAgICAgICBpZiAobGlua0RldGFpbHMubGVuZ3RoID09IDUpIGxpbmtEZXRhaWxzLnB1c2goJyknKTtcbiAgICAgICAgICAgICAgZWxzZSBsaW5rRGV0YWlsc1s1XSA9IGxpbmtEZXRhaWxzWzVdLmNvbmNhdCgnKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgcGFyZW50aGVzaXNMZXZlbC0tOyAvLyBUaGlzIHNob3VsZCBkZWNyZWFzZSBpdCBmcm9tIDEgdG8gMC4uLlxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID09IDApIHtcbiAgICAgICAgICAgIC8vIE5vIGludmFsaWQgY29uZGl0aW9uLCBsZXQncyBtYWtlIHN1cmUgdGhlIGxpbmtEZXRhaWxzIGFycmF5IGlzIGNvbXBsZXRlXG4gICAgICAgICAgICB3aGlsZSAobGlua0RldGFpbHMubGVuZ3RoIDwgNykgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgfSBcblxuICAgICAgICAgIGN1cnJlbnRPZmZzZXQrKztcbiAgICAgICAgICBjb250aW51ZSBpbmxpbmVPdXRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFueSBvbGQgY2hhcmFjdGVyXG4gICAgICAgIGNhcCA9IC9eLi8uZXhlYyhzdHJpbmcpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgc3dpdGNoIChsaW5rRGV0YWlscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogbGlua0RldGFpbHMucHVzaCgnJyk7IC8vIHRoaXMgb3BlbnMgdGhlIGxpbmsgZGVzdGluYXRpb24sIGFkZCBlbXB0eSBvcGVuaW5nIGRlbGltaXRlciBhbmQgcHJvY2VlZCB0byBuZXh0IGNhc2VcbiAgICAgICAgICAgIGNhc2UgMTogbGlua0RldGFpbHMucHVzaChjYXBbMF0pOyBicmVhazsgLy8gVGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYXBwZW5kIGl0XG4gICAgICAgICAgICBjYXNlIDI6IGxpbmtEZXRhaWxzWzFdID0gbGlua0RldGFpbHNbMV0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBQYXJ0IG9mIHRoZSBsaW5rIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBmYWxzZTsgLy8gTGFja2luZyBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gZmFsc2U7IC8vIExjYWtpbmcgb3BlbmluZyBkZWxpbWl0ZXIgZm9yIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGNhc2UgNTogbGlua0RldGFpbHMucHVzaCgnJyk7IC8vIFRoaXMgb3BlbnMgdGhlIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGNhc2UgNjogbGlua0RldGFpbHNbNV0gPSBsaW5rRGV0YWlsc1s1XS5jb25jYXQoY2FwWzBdKTsgYnJlYWs7IC8vIFBhcnQgb2YgdGhlIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTsgLy8gQWZ0ZXIgbGluayB0aXRsZSB3YXMgY2xvc2VkLCB3aXRob3V0IGNsb3NpbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudE9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgbG9vcFwiOyAvLyB3ZSBzaG91bGQgbmV2ZXIgZ2V0IGhlcmUgc2luY2UgdGhlIGxhc3QgdGVzdCBtYXRjaGVzIGFueSBjaGFyYWN0ZXJcbiAgICAgIH1cbiAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID4gMCkgcmV0dXJuIGZhbHNlOyAvLyBQYXJlbnRoZXMoZXMpIG5vdCBjbG9zZWRcblxuICAgIH1cblxuICAgIGlmIChsaW5rUmVmICE9PSBmYWxzZSkge1xuICAgICAgLy8gUmVmIGxpbms7IGNoZWNrIHRoYXQgbGlua1JlZiBpcyB2YWxpZFxuICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBsYWJlbCBvZiB0aGlzLmxpbmtMYWJlbHMpIHtcbiAgICAgICAgaWYgKGxhYmVsID09IGxpbmtSZWYpIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsYWJlbCA9IHZhbGlkID8gXCJUTUxpbmtMYWJlbCBUTUxpbmtMYWJlbF9WYWxpZFwiIDogXCJUTUxpbmtMYWJlbCBUTUxpbmtMYWJlbF9JbnZhbGlkXCJcbiAgICAgIGxldCBvdXRwdXQgPSBgPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke29wZW5lcn08L3NwYW4+PHNwYW4gY2xhc3M9XCIke3R5cGV9ICR7KGxpbmtMYWJlbC5sZW5ndGggPCAzIHx8ICFsaW5rTGFiZWxbMV0pID8gbGFiZWwgOiBcIlwifVwiPiR7dGhpcy5wcm9jZXNzSW5saW5lU3R5bGVzKGxpbmtUZXh0KX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj5dPC9zcGFuPmA7XG5cbiAgICAgIGlmIChsaW5rTGFiZWwubGVuZ3RoID49IDMpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmNvbmNhdChcbiAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke2xpbmtMYWJlbFswXX08L3NwYW4+YCxcbiAgICAgICAgICBgPHNwYW4gY2xhc3M9XCIke2xhYmVsfVwiPiR7bGlua0xhYmVsWzFdfTwvc3Bhbj5gLFxuICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfJHt0eXBlfVwiPiR7bGlua0xhYmVsWzJdfTwvc3Bhbj5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvdXRwdXQgOiBvdXRwdXQsXG4gICAgICAgIGNoYXJDb3VudCA6ICBjdXJyZW50T2Zmc2V0XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmtEZXRhaWxzKSB7XG4gICAgICAvLyBJbmxpbmUgbGlua1xuXG4gICAgICAvLyBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4sIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5LlxuICAgICAgd2hpbGUgKGxpbmtEZXRhaWxzLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG91dHB1dDogYDxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya18ke3R5cGV9XCI+JHtvcGVuZXJ9PC9zcGFuPjxzcGFuIGNsYXNzPVwiJHt0eXBlfVwiPiR7dGhpcy5wcm9jZXNzSW5saW5lU3R5bGVzKGxpbmtUZXh0KX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj5dKCR7bGlua0RldGFpbHNbMF19PC9zcGFuPjxzcGFuIGNsYXNzPVwiJHt0eXBlfURlc3RpbmF0aW9uXCI+JHtsaW5rRGV0YWlsc1sxXX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke2xpbmtEZXRhaWxzWzJdfSR7bGlua0RldGFpbHNbM119JHtsaW5rRGV0YWlsc1s0XX08L3NwYW4+PHNwYW4gY2xhc3M9XCIke3R5cGV9VGl0bGVcIj4ke2xpbmtEZXRhaWxzWzVdfTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfJHt0eXBlfVwiPiR7bGlua0RldGFpbHNbNl19KTwvc3Bhbj5gLFxuICAgICAgICBjaGFyQ291bnQ6IGN1cnJlbnRPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgbWFya2Rvd24gc3RyaW5nIGFzIEhUTUwsIHVzaW5nIE1hcmtkb3duIGlubGluZSBmb3JtYXR0aW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3JpZ2luYWxTdHJpbmcgVGhlIGlucHV0IChtYXJrZG93biBpbmxpbmUgZm9ybWF0dGVkKSBzdHJpbmdcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIEhUTUwgZm9ybWF0dGVkIG91dHB1dFxuICAgKi9cbiAgcHJvY2Vzc0lubGluZVN0eWxlcyhvcmlnaW5hbFN0cmluZykge1xuICAgIGxldCBwcm9jZXNzZWQgPSAnJztcbiAgICBsZXQgc3RhY2sgPSBbXTsgLy8gU3RhY2sgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0aGUgZm9ybWF0OiB7ZGVsaW1pdGVyLCBkZWxpbVN0cmluZywgY291bnQsIG91dHB1dH1cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgc3RyaW5nID0gb3JpZ2luYWxTdHJpbmc7XG4gIFxuICBcbiAgICBvdXRlcjogd2hpbGUgKHN0cmluZykge1xuICAgICAgLy8gUHJvY2VzcyBzaW1wbGUgcnVsZXMgKG5vbi1kZWxpbWl0ZXIpXG4gICAgICBmb3IgKGxldCBydWxlIG9mIFsnZXNjYXBlJywgJ2NvZGUnLCAnYXV0b2xpbmsnLCAnaHRtbCddKSB7XG4gICAgICAgIGxldCBjYXAgPSBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlZ2V4cC5leGVjKHN0cmluZyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyKGNhcFswXS5sZW5ndGgpO1xuICAgICAgICAgIG9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIHByb2Nlc3NlZCArPSBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlcGxhY2VtZW50XG4gICAgICAgICAgICAvLyAucmVwbGFjZSgvXFwkXFwkKFsxLTldKS9nLCAoc3RyLCBwMSkgPT4gcHJvY2Vzc0lubGluZVN0eWxlcyhjYXBbcDFdKSkgLy8gdG9kbyByZWN1cnNpdmUgY2FsbGluZ1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcJChbMS05XSkvZywgKHN0ciwgcDEpID0+IGh0bWxlc2NhcGUoY2FwW3AxXSkpO1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyOyBcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIC8vIENoZWNrIGZvciBsaW5rcyAvIGltYWdlc1xuICAgICAgbGV0IHBvdGVudGlhbExpbmsgPSBzdHJpbmcubWF0Y2goaW5saW5lR3JhbW1hci5saW5rT3Blbi5yZWdleHApO1xuICAgICAgbGV0IHBvdGVudGlhbEltYWdlID0gc3RyaW5nLm1hdGNoKGlubGluZUdyYW1tYXIuaW1hZ2VPcGVuLnJlZ2V4cCk7XG4gICAgICBpZiAocG90ZW50aWFsSW1hZ2UgfHwgcG90ZW50aWFsTGluaykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXJzZUxpbmtPckltYWdlKHN0cmluZywgcG90ZW50aWFsSW1hZ2UpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gYCR7cHJvY2Vzc2VkfSR7cmVzdWx0Lm91dHB1dH1gO1xuICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIocmVzdWx0LmNoYXJDb3VudCk7XG4gICAgICAgICAgb2Zmc2V0ICs9IHJlc3VsdC5jaGFyQ291bnQ7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQ2hlY2sgZm9yIGVtIC8gc3Ryb25nIGRlbGltaXRlcnNcbiAgICAgIGxldCBjYXAgPSAvKF5cXCorKXwoXl8rKS8uZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICBsZXQgZGVsaW1Db3VudCA9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGRlbGltU3RyaW5nID0gY2FwWzBdO1xuICAgICAgICBjb25zdCBjdXJyZW50RGVsaW1pdGVyID0gY2FwWzBdWzBdOyAvLyBUaGlzIHNob3VsZCBiZSAqIG9yIF9cbiAgXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRlbGltaXRlciBydW4uIExldCdzIGNoZWNrIGlmIGl0IGNhbiBvcGVuIG9yIGNsb3NlIGFuIGVtcGhhc2lzLlxuICAgICAgICBcbiAgICAgICAgY29uc3QgcHJlY2VkaW5nID0gKG9mZnNldCA+IDApID8gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCkgOiAnICc7IC8vIGJlZ2lubmluZyBhbmQgZW5kIG9mIGxpbmUgY291bnQgYXMgd2hpdGVzcGFjZVxuICAgICAgICBjb25zdCBmb2xsb3dpbmcgPSAob2Zmc2V0ICsgY2FwWzBdLmxlbmd0aCA8IG9yaWdpbmFsU3RyaW5nLmxlbmd0aCkgPyBzdHJpbmcgOiAnICc7XG4gIFxuICAgICAgICBjb25zdCBwdW5jdHVhdGlvbkZvbGxvd3MgPSBmb2xsb3dpbmcubWF0Y2gocHVuY3R1YXRpb25MZWFkaW5nKTtcbiAgICAgICAgY29uc3QgcHVuY3R1YXRpb25QcmVjZWRlcyA9IHByZWNlZGluZy5tYXRjaChwdW5jdHVhdGlvblRyYWlsaW5nKTtcbiAgICAgICAgY29uc3Qgd2hpdGVzcGFjZUZvbGxvd3MgPSBmb2xsb3dpbmcubWF0Y2goL15cXHMvKTtcbiAgICAgICAgY29uc3Qgd2hpdGVzcGFjZVByZWNlZGVzID0gcHJlY2VkaW5nLm1hdGNoKC9cXHMkLyk7XG4gIFxuICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIHJ1bGVzIGZvciByaWdodC1mbGFua2luZyBhbmQgbGVmdC1mbGFua2luZyBkZWxpbWl0ZXIgcnVucyBhcyBwZXIgQ29tbW9uTWFyayBzcGVjXG4gICAgICAgIGxldCBjYW5PcGVuID0gIXdoaXRlc3BhY2VGb2xsb3dzICYmICghcHVuY3R1YXRpb25Gb2xsb3dzIHx8ICEhd2hpdGVzcGFjZVByZWNlZGVzIHx8ICEhcHVuY3R1YXRpb25QcmVjZWRlcyk7XG4gICAgICAgIGxldCBjYW5DbG9zZSA9ICF3aGl0ZXNwYWNlUHJlY2VkZXMgJiYgKCFwdW5jdHVhdGlvblByZWNlZGVzIHx8ICEhd2hpdGVzcGFjZUZvbGxvd3MgfHwgISFwdW5jdHVhdGlvbkZvbGxvd3MpO1xuICBcbiAgICAgICAgLy8gVW5kZXJzY29yZXMgaGF2ZSBtb3JlIGRldGFpbGVkIHJ1bGVzIHRoYW4ganVzdCBiZWluZyBwYXJ0IG9mIGxlZnQtIG9yIHJpZ2h0LWZsYW5raW5nIHJ1bjpcbiAgICAgICAgaWYgKGN1cnJlbnREZWxpbWl0ZXIgPT0gJ18nICYmIGNhbk9wZW4gJiYgY2FuQ2xvc2UpIHtcbiAgICAgICAgICBjYW5PcGVuID0gcHVuY3R1YXRpb25QcmVjZWRlcztcbiAgICAgICAgICBjYW5DbG9zZSA9IHB1bmN0dWF0aW9uRm9sbG93cztcbiAgICAgICAgfVxuICBcbiAgICAgICAgLy8gSWYgdGhlIGRlbGltaXRlciBjYW4gY2xvc2UsIGNoZWNrIHRoZSBzdGFjayBpZiB0aGVyZSdzIHNvbWV0aGluZyBpdCBjYW4gY2xvc2VcbiAgICAgICAgaWYgKGNhbkNsb3NlKSB7XG4gICAgICAgICAgbGV0IHN0YWNrUG9pbnRlciA9IHN0YWNrLmxlbmd0aCAtIDE7XG4gICAgICAgICAgLy8gU2VlIGlmIHdlIGNhbiBmaW5kIGEgbWF0Y2hpbmcgb3BlbmluZyBkZWxpbWl0ZXIsIG1vdmUgZG93biB0aHJvdWdoIHRoZSBzdGFja1xuICAgICAgICAgIHdoaWxlIChkZWxpbUNvdW50ICYmIHN0YWNrUG9pbnRlciA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5kZWxpbWl0ZXIgPT0gY3VycmVudERlbGltaXRlcikge1xuICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGRlbGltaXRlciwgbGV0J3MgY29uc3RydWN0IHRoZSBmb3JtYXR0ZWQgc3RyaW5nXG4gIFxuICAgICAgICAgICAgICAvLyBGaXJzdGx5LCBpZiB3ZSBza2lwcGVkIGFueSBzdGFjayBsZXZlbHMsIHBvcCB0aGVtIGltbWVkaWF0ZWx5IChub24tbWF0Y2hpbmcgZGVsaW1pdGVycylcbiAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrUG9pbnRlciA8IHN0YWNrLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZCA9IGAke2VudHJ5Lm91dHB1dH0ke2VudHJ5LmRlbGltU3RyaW5nLnN1YnN0cigwLCBlbnRyeS5jb3VudCl9JHtwcm9jZXNzZWR9YDtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgICAgLy8gVGhlbiwgZm9ybWF0IHRoZSBzdHJpbmdcbiAgICAgICAgICAgICAgaWYgKGRlbGltQ291bnQgPj0gMiAmJiBzdGFja1tzdGFja1BvaW50ZXJdLmNvdW50ID49IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBTdHJvbmdcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWQgPSBgPHNwYW4gY2xhc3M9XCJUTU1hcmtcIj4ke2N1cnJlbnREZWxpbWl0ZXJ9JHtjdXJyZW50RGVsaW1pdGVyfTwvc3Bhbj48c3Ryb25nIGNsYXNzPVwiVE1TdHJvbmdcIj4ke3Byb2Nlc3NlZH08L3N0cm9uZz48c3BhbiBjbGFzcz1cIlRNTWFya1wiPiR7Y3VycmVudERlbGltaXRlcn0ke2N1cnJlbnREZWxpbWl0ZXJ9PC9zcGFuPmA7XG4gICAgICAgICAgICAgICAgZGVsaW1Db3VudCAtPSAyO1xuICAgICAgICAgICAgICAgIHN0YWNrW3N0YWNrUG9pbnRlcl0uY291bnQgLT0gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBFbVxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZCA9IGA8c3BhbiBjbGFzcz1cIlRNTWFya1wiPiR7Y3VycmVudERlbGltaXRlcn08L3NwYW4+PGVtIGNsYXNzPVwiVE1FbVwiPiR7cHJvY2Vzc2VkfTwvZW0+PHNwYW4gY2xhc3M9XCJUTU1hcmtcIj4ke2N1cnJlbnREZWxpbWl0ZXJ9PC9zcGFuPmA7XG4gICAgICAgICAgICAgICAgZGVsaW1Db3VudCAtPSAxO1xuICAgICAgICAgICAgICAgIHN0YWNrW3N0YWNrUG9pbnRlcl0uY291bnQgLT0gMTtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgICAgLy8gSWYgdGhhdCBzdGFjayBsZXZlbCBpcyBlbXB0eSBub3csIHBvcCBpdFxuICAgICAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5jb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVudHJ5ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7cHJvY2Vzc2VkfWBcbiAgICAgICAgICAgICAgICBzdGFja1BvaW50ZXItLTtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgc3RhY2sgbGV2ZWwncyBkZWxpbWl0ZXIgdHlwZSBkb2Vzbid0IG1hdGNoIHRoZSBjdXJyZW50IGRlbGltaXRlciB0eXBlXG4gICAgICAgICAgICAgIC8vIEdvIGRvd24gb25lIGxldmVsIGluIHRoZSBzdGFja1xuICAgICAgICAgICAgICBzdGFja1BvaW50ZXItLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIHN0aWxsIGRlbGltaXRlcnMgbGVmdCwgYW5kIHRoZSBkZWxpbWl0ZXIgcnVuIGNhbiBvcGVuLCBwdXNoIGl0IG9uIHRoZSBzdGFja1xuICAgICAgICBpZiAoZGVsaW1Db3VudCAmJiBjYW5PcGVuKSB7XG4gICAgICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgICAgICBkZWxpbWl0ZXI6IGN1cnJlbnREZWxpbWl0ZXIsXG4gICAgICAgICAgICBkZWxpbVN0cmluZzogZGVsaW1TdHJpbmcsXG4gICAgICAgICAgICBjb3VudDogZGVsaW1Db3VudCxcbiAgICAgICAgICAgIG91dHB1dDogcHJvY2Vzc2VkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gJyc7IC8vIEN1cnJlbnQgZm9ybWF0dGVkIG91dHB1dCBoYXMgYmVlbiBwdXNoZWQgb24gdGhlIHN0YWNrIGFuZCB3aWxsIGJlIHByZXBlbmRlZCB3aGVuIHRoZSBzdGFjayBnZXRzIHBvcHBlZFxuICAgICAgICAgIGRlbGltQ291bnQgPSAwO1xuICAgICAgICB9XG4gIFxuICAgICAgICAvLyBBbnkgZGVsaW1pdGVycyB0aGF0IGFyZSBsZWZ0IChjbG9zaW5nIHVubWF0Y2hlZCkgYXJlIGFwcGVuZGVkIHRvIHRoZSBvdXRwdXQuXG4gICAgICAgIGlmIChkZWxpbUNvdW50KSB7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gYCR7cHJvY2Vzc2VkfSR7ZGVsaW1TdHJpbmcuc3Vic3RyKDAsZGVsaW1Db3VudCl9YDtcbiAgICAgICAgfVxuICBcbiAgICAgICAgb2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3Igc3RyaWtldGhyb3VnaCBkZWxpbWl0ZXJcbiAgICAgIGNhcCA9IC9efn4vLmV4ZWMoc3RyaW5nKTtcbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgbGV0IGNvbnN1bWVkID0gZmFsc2U7XG4gICAgICAgIGxldCBzdGFja1BvaW50ZXIgPSBzdGFjay5sZW5ndGggLSAxO1xuICAgICAgICAvLyBTZWUgaWYgd2UgY2FuIGZpbmQgYSBtYXRjaGluZyBvcGVuaW5nIGRlbGltaXRlciwgbW92ZSBkb3duIHRocm91Z2ggdGhlIHN0YWNrXG4gICAgICAgIHdoaWxlICghY29uc3VtZWQgJiYgc3RhY2tQb2ludGVyID49IDApIHtcbiAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5kZWxpbWl0ZXIgPT0gJ34nKSB7XG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGRlbGltaXRlciwgbGV0J3MgY29uc3RydWN0IHRoZSBmb3JtYXR0ZWQgc3RyaW5nXG5cbiAgICAgICAgICAgIC8vIEZpcnN0bHksIGlmIHdlIHNraXBwZWQgYW55IHN0YWNrIGxldmVscywgcG9wIHRoZW0gaW1tZWRpYXRlbHkgKG5vbi1tYXRjaGluZyBkZWxpbWl0ZXJzKVxuICAgICAgICAgICAgd2hpbGUgKHN0YWNrUG9pbnRlciA8IHN0YWNrLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7ZW50cnkuZGVsaW1TdHJpbmcuc3Vic3RyKDAsIGVudHJ5LmNvdW50KX0ke3Byb2Nlc3NlZH1gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGVuLCBmb3JtYXQgdGhlIHN0cmluZ1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0gYDxzcGFuIGNsYXNzPVwiVE1NYXJrXCI+fn48L3NwYW4+PGRlbCBjbGFzcz1cIlRNU3RyaWtldGhyb3VnaFwiPiR7cHJvY2Vzc2VkfTwvZGVsPjxzcGFuIGNsYXNzPVwiVE1NYXJrXCI+fn48L3NwYW4+YDtcbiAgICAgICAgICAgIGxldCBlbnRyeSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7cHJvY2Vzc2VkfWBcbiAgICAgICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBzdGFjayBsZXZlbCdzIGRlbGltaXRlciB0eXBlIGRvZXNuJ3QgbWF0Y2ggdGhlIGN1cnJlbnQgZGVsaW1pdGVyIHR5cGVcbiAgICAgICAgICAgIC8vIEdvIGRvd24gb25lIGxldmVsIGluIHRoZSBzdGFja1xuICAgICAgICAgICAgc3RhY2tQb2ludGVyLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgc3RpbGwgZGVsaW1pdGVycyBsZWZ0LCBhbmQgdGhlIGRlbGltaXRlciBydW4gY2FuIG9wZW4sIHB1c2ggaXQgb24gdGhlIHN0YWNrXG4gICAgICAgIGlmICghY29uc3VtZWQpIHtcbiAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgIGRlbGltaXRlcjogJ34nLFxuICAgICAgICAgICAgZGVsaW1TdHJpbmc6ICd+ficsXG4gICAgICAgICAgICBjb3VudDogMixcbiAgICAgICAgICAgIG91dHB1dDogcHJvY2Vzc2VkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gJyc7IC8vIEN1cnJlbnQgZm9ybWF0dGVkIG91dHB1dCBoYXMgYmVlbiBwdXNoZWQgb24gdGhlIHN0YWNrIGFuZCB3aWxsIGJlIHByZXBlbmRlZCB3aGVuIHRoZSBzdGFjayBnZXRzIHBvcHBlZFxuICAgICAgICB9XG5cbiAgICAgICAgb2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIoY2FwWzBdLmxlbmd0aCk7IFxuICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgIH1cbiAgICAgIFxuICBcbiAgICAgIC8vIFByb2Nlc3MgJ2RlZmF1bHQnIHJ1bGVcbiAgICAgIGNhcCA9IGlubGluZUdyYW1tYXIuZGVmYXVsdC5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyKGNhcFswXS5sZW5ndGgpO1xuICAgICAgICBvZmZzZXQgKz0gY2FwWzBdLmxlbmd0aDtcbiAgICAgICAgcHJvY2Vzc2VkICs9IGlubGluZUdyYW1tYXIuZGVmYXVsdC5yZXBsYWNlbWVudFxuICAgICAgICAgIC5yZXBsYWNlKC9cXCQoWzEtOV0pL2csIChzdHIsIHAxKSA9PiBodG1sZXNjYXBlKGNhcFtwMV0pKTtcbiAgICAgICAgY29udGludWUgb3V0ZXI7IFxuICAgICAgfVxuICAgICAgdGhyb3cgJ0luZmluaXRlIGxvb3AhJztcbiAgICB9XG4gIFxuICAgIC8vIEVtcHR5IHRoZSBzdGFjaywgYW55IG9wZW5pbmcgZGVsaW1pdGVycyBhcmUgdW51c2VkXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW50cnkgPSBzdGFjay5wb3AoKTtcbiAgICAgIHByb2Nlc3NlZCA9IGAke2VudHJ5Lm91dHB1dH0ke2VudHJ5LmRlbGltU3RyaW5nLnN1YnN0cigwLCBlbnRyeS5jb3VudCl9JHtwcm9jZXNzZWR9YDtcbiAgICB9XG4gIFxuICAgIHJldHVybiBwcm9jZXNzZWQ7XG4gIH1cblxuICAvKiogXG4gICAqIENsZWFycyB0aGUgbGluZSBkaXJ0eSBmbGFnIChyZXNldHMgaXQgdG8gYW4gYXJyYXkgb2YgZmFsc2UpXG4gICAqL1xuICBjbGVhckRpcnR5RmxhZygpIHtcbiAgICB0aGlzLmxpbmVEaXJ0eSA9IG5ldyBBcnJheSh0aGlzLmxpbmVzLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVEaXJ0eS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5saW5lRGlydHlbaV0gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY2xhc3MgcHJvcGVydGllcyAobGluZXMsIGxpbmVFbGVtZW50cykgZnJvbSB0aGUgRE9NLlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIGNvbnRlbnRzIGNoYW5nZWRcbiAgICovXG4gIHVwZGF0ZUxpbmVDb250ZW50cygpIHtcbiAgICAvLyB0aGlzLmxpbmVEaXJ0eSA9IFtdOyBcbiAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIGNoYW5nZWQgYW55dGhpbmcgYWJvdXQgdGhlIG51bWJlciBvZiBsaW5lcyAoaW5zZXJ0ZWQgb3IgZGVsZXRlZCBhIHBhcmFncmFwaClcbiAgICAvLyA8IDAgbWVhbnMgbGluZShzKSByZW1vdmVkOyA+IDAgbWVhbnMgbGluZShzKSBhZGRlZFxuICAgIGxldCBsaW5lRGVsdGEgPSB0aGlzLmUuY2hpbGRFbGVtZW50Q291bnQgLSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgICBpZiAobGluZURlbHRhKSB7XG4gICAgICAvLyB5dXAuIExldCdzIHRyeSBob3cgbXVjaCB3ZSBjYW4gc2FsdmFnZSAoZmluZCBvdXQgd2hpY2ggbGluZXMgZnJvbSBiZWdpbm5pbmcgYW5kIGVuZCB3ZXJlIHVuY2hhbmdlZClcbiAgICAgIC8vIEZpbmQgbGluZXMgZnJvbSB0aGUgYmVnaW5uaW5nIHRoYXQgaGF2ZW4ndCBjaGFuZ2VkLi4uXG4gICAgICBsZXQgZmlyc3RDaGFuZ2VkTGluZSA9IDA7XG4gICAgICB3aGlsZSAoXG4gICAgICAgICAgZmlyc3RDaGFuZ2VkTGluZSA8PSB0aGlzLmxpbmVzLmxlbmd0aCBcbiAgICAgICAgICAmJiBmaXJzdENoYW5nZWRMaW5lIDw9IHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aFxuICAgICAgICAgICYmIHRoaXMubGluZUVsZW1lbnRzW2ZpcnN0Q2hhbmdlZExpbmVdIC8vIENoZWNrIHRoYXQgdGhlIGxpbmUgZWxlbWVudCBoYXNuJ3QgYmVlbiBkZWxldGVkXG4gICAgICAgICAgJiYgdGhpcy5saW5lc1tmaXJzdENoYW5nZWRMaW5lXSA9PSB0aGlzLmxpbmVFbGVtZW50c1tmaXJzdENoYW5nZWRMaW5lXS50ZXh0Q29udGVudFxuICAgICAgKSB7XG4gICAgICAgIGZpcnN0Q2hhbmdlZExpbmUrKztcbiAgICAgIH1cblxuICAgICAgLy8gRW5kIGFsc28gZnJvbSB0aGUgZW5kXG4gICAgICBsZXQgbGFzdENoYW5nZWRMaW5lID0gLTE7XG4gICAgICB3aGlsZSAoXG4gICAgICAgICAgLWxhc3RDaGFuZ2VkTGluZSA8IHRoaXMubGluZXMubGVuZ3RoIFxuICAgICAgICAgICYmIC1sYXN0Q2hhbmdlZExpbmUgPCB0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGhcbiAgICAgICAgICAmJiB0aGlzLmxpbmVzW3RoaXMubGluZXMubGVuZ3RoICsgbGFzdENoYW5nZWRMaW5lXSA9PSB0aGlzLmxpbmVFbGVtZW50c1t0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGggKyBsYXN0Q2hhbmdlZExpbmVdLnRleHRDb250ZW50XG4gICAgICApIHtcbiAgICAgICAgbGFzdENoYW5nZWRMaW5lLS07XG4gICAgICB9XG5cbiAgICAgIGxldCBsaW5lc1RvRGVsZXRlID0gdGhpcy5saW5lcy5sZW5ndGggKyBsYXN0Q2hhbmdlZExpbmUgKyAxIC0gZmlyc3RDaGFuZ2VkTGluZTtcbiAgICAgIGlmIChsaW5lc1RvRGVsZXRlIDwgLWxpbmVEZWx0YSkgbGluZXNUb0RlbGV0ZSA9IC1saW5lRGVsdGE7XG4gICAgICBpZiAobGluZXNUb0RlbGV0ZSA8IDApIGxpbmVzVG9EZWxldGUgPSAwO1xuXG4gICAgICBsZXQgbGluZXNUb0FkZCA9IFtdO1xuICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBsaW5lc1RvRGVsZXRlICsgbGluZURlbHRhOyBsKyspIHtcbiAgICAgICAgbGluZXNUb0FkZC5wdXNoKHRoaXMubGluZUVsZW1lbnRzW2ZpcnN0Q2hhbmdlZExpbmUgKyBsXS50ZXh0Q29udGVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNwbGljZUxpbmVzKGZpcnN0Q2hhbmdlZExpbmUsIGxpbmVzVG9EZWxldGUsIGxpbmVzVG9BZGQsIGZhbHNlKTtcbiAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBsaW5lcyBhZGRlZCBvciByZW1vdmVkXG4gICAgICBmb3IgKGxldCBsaW5lID0gMDsgbGluZSA8IHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aDsgbGluZSsrKSB7XG4gICAgICAgIGxldCBlID0gdGhpcy5saW5lRWxlbWVudHNbbGluZV07XG4gICAgICAgIGxldCBjdCA9IGUudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmICh0aGlzLmxpbmVzW2xpbmVdICE9PSBjdCkge1xuICAgICAgICAgIC8vIExpbmUgY2hhbmdlZCwgdXBkYXRlIGl0XG4gICAgICAgICAgdGhpcy5saW5lc1tsaW5lXSA9IGN0O1xuICAgICAgICAgIHRoaXMubGluZURpcnR5W2xpbmVdID0gdHJ1ZTsgXG4gICAgICAgIH0gXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhIG5ldyBwYXJhZ3JhcGguXG4gICAqIEBwYXJhbSBzZWwgVGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAqL1xuICBwcm9jZXNzTmV3UGFyYWdyYXBoKHNlbCkge1xuICAgIGlmICghc2VsKSByZXR1cm47XG5cbiAgICAvLyBVcGRhdGUgbGluZXMgZnJvbSBjb250ZW50XG4gICAgdGhpcy51cGRhdGVMaW5lQ29udGVudHMoKTtcblxuICAgIGxldCBjb250aW51YWJsZVR5cGUgPSBmYWxzZTtcbiAgICAvLyBMZXQncyBzZWUgaWYgd2UgbmVlZCB0byBjb250aW51ZSBhIGxpc3RcblxuICAgIGxldCBjaGVja0xpbmUgPSBzZWwuY29sID4gMCA/IHNlbC5yb3cgOiBzZWwucm93IC0gMTtcbiAgICBzd2l0Y2ggKHRoaXMubGluZVR5cGVzW2NoZWNrTGluZV0pIHtcbiAgICAgIGNhc2UgJ1RNVUwnOiBjb250aW51YWJsZVR5cGUgPSAnVE1VTCc7IGJyZWFrO1xuICAgICAgY2FzZSAnVE1PTCc6IGNvbnRpbnVhYmxlVHlwZSA9ICdUTU9MJzsgYnJlYWs7XG4gICAgICBjYXNlICdUTUluZGVudGVkQ29kZSc6IGNvbnRpbnVhYmxlVHlwZSA9ICdUTUluZGVudGVkQ29kZSc7IGJyZWFrO1xuICAgIH1cblxuICAgIGxldCBsaW5lcyA9IHRoaXMubGluZXNbc2VsLnJvd10ucmVwbGFjZSgvXFxuXFxuJC8sICdcXG4nKS5zcGxpdCgvKD86XFxyXFxufFxcbnxcXHIpLyk7XG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBObyBuZXcgbGluZVxuICAgICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3BsaWNlTGluZXMoc2VsLnJvdywgMSwgbGluZXMsIHRydWUpO1xuICAgIHNlbC5yb3crKztcbiAgICBzZWwuY29sID0gMDtcblxuICAgIGlmIChjb250aW51YWJsZVR5cGUpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBsaW5lIHdhcyBub24tZW1wdHlcbiAgICAgIGxldCBjYXB0dXJlID0gbGluZUdyYW1tYXJbY29udGludWFibGVUeXBlXS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW3NlbC5yb3cgLSAxXSk7XG4gICAgICBpZiAoY2FwdHVyZSkge1xuICAgICAgICAvLyBDb252ZW50aW9uOiBjYXB0dXJlWzFdIGlzIHRoZSBsaW5lIHR5cGUgbWFya2VyLCBjYXB0dXJlWzJdIGlzIHRoZSBjb250ZW50XG4gICAgICAgIGlmIChjYXB0dXJlWzJdKSB7XG4gICAgICAgICAgLy8gUHJldmlvdXMgbGluZSBoYXMgY29udGVudCwgY29udGludWUgdGhlIGNvbnRpbnVhYmxlIHR5cGVcblxuICAgICAgICAgIC8vIEhhY2sgZm9yIE9MOiBpbmNyZW1lbnQgbnVtYmVyXG4gICAgICAgICAgaWYgKGNvbnRpbnVhYmxlVHlwZSA9PSAnVE1PTCcpIHtcbiAgICAgICAgICAgIGNhcHR1cmVbMV0gPSBjYXB0dXJlWzFdLnJlcGxhY2UoL1xcZHsxLDl9LywgKHJlc3VsdCkgPT4geyByZXR1cm4gcGFyc2VJbnQocmVzdWx0WzBdKSArIDF9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5saW5lc1tzZWwucm93XSA9IGAke2NhcHR1cmVbMV19JHt0aGlzLmxpbmVzW3NlbC5yb3ddfWA7XG4gICAgICAgICAgdGhpcy5saW5lRGlydHlbc2VsLnJvd10gPSB0cnVlO1xuICAgICAgICAgIHNlbC5jb2wgPSBjYXB0dXJlWzFdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBQcmV2aW91cyBsaW5lIGhhcyBubyBjb250ZW50LCByZW1vdmUgdGhlIGNvbnRpbnVhYmxlIHR5cGUgZnJvbSB0aGUgcHJldmlvdXMgcm93XG4gICAgICAgICAgdGhpcy5saW5lc1tzZWwucm93IC0gMV0gPSAnJztcbiAgICAgICAgICB0aGlzLmxpbmVEaXJ0eVtzZWwucm93IC0gMV0gPSB0cnVlO1xuICAgICAgICB9ICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gIH1cblxuICAvLyAvKipcbiAgLy8gICogUHJvY2Vzc2VzIGEgXCJkZWxldGVcIiBpbnB1dCBhY3Rpb24uXG4gIC8vICAqIEBwYXJhbSB7b2JqZWN0fSBmb2N1cyBUaGUgc2VsZWN0aW9uXG4gIC8vICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBJZiB0cnVlLCBwZXJmb3JtcyBhIGZvcndhcmQgZGVsZXRlLCBvdGhlcndpc2UgcGVyZm9ybXMgYSBiYWNrd2FyZCBkZWxldGVcbiAgLy8gICovXG4gIC8vIHByb2Nlc3NEZWxldGUoZm9jdXMsIGZvcndhcmQpIHtcbiAgLy8gICBpZiAoIWZvY3VzKSByZXR1cm47XG4gIC8vICAgbGV0IGFuY2hvciA9IHRoaXMuZ2V0U2VsZWN0aW9uKHRydWUpO1xuICAvLyAgIC8vIERvIHdlIGhhdmUgYSBub24tZW1wdHkgc2VsZWN0aW9uPyBcbiAgLy8gICBpZiAoZm9jdXMuY29sICE9IGFuY2hvci5jb2wgfHwgZm9jdXMucm93ICE9IGFuY2hvci5yb3cpIHtcbiAgLy8gICAgIC8vIG5vbi1lbXB0eS4gZGlyZWN0aW9uIGRvZXNuJ3QgbWF0dGVyLlxuICAvLyAgICAgdGhpcy5wYXN0ZSgnJywgYW5jaG9yLCBmb2N1cyk7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGlmIChmb3J3YXJkKSB7XG4gIC8vICAgICAgIGlmIChmb2N1cy5jb2wgPCB0aGlzLmxpbmVzW2ZvY3VzLnJvd10ubGVuZ3RoKSB0aGlzLnBhc3RlKCcnLCB7cm93OiBmb2N1cy5yb3csIGNvbDogZm9jdXMuY29sICsgMX0sIGZvY3VzKTtcbiAgLy8gICAgICAgZWxzZSBpZiAoZm9jdXMuY29sIDwgdGhpcy5saW5lcy5sZW5ndGgpIHRoaXMucGFzdGUoJycsIHtyb3c6IGZvY3VzLnJvdyArIDEsIGNvbDogMH0sIGZvY3VzKTtcbiAgLy8gICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSdyZSBhdCB0aGUgdmVyeSBlbmQgYW5kIGNhbid0IGRlbGV0ZSBmb3J3YXJkXG4gIC8vICAgICB9IGVsc2Uge1xuICAvLyAgICAgICBpZiAoZm9jdXMuY29sID4gMCkgdGhpcy5wYXN0ZSgnJywge3JvdzogZm9jdXMucm93LCBjb2w6IGZvY3VzLmNvbCAtIDF9LCBmb2N1cyk7XG4gIC8vICAgICAgIGVsc2UgaWYgKGZvY3VzLnJvdyA+IDApIHRoaXMucGFzdGUoJycsIHtyb3c6IGZvY3VzLnJvdyAtIDEsIGNvbDogdGhpcy5saW5lc1tmb2N1cy5yb3cgLSAxXS5sZW5ndGggLSAxfSwgZm9jdXMpO1xuICAvLyAgICAgICAvLyBPdGhlcndpc2UsIHdlJ3JlIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBhbmQgY2FuJ3QgZGVsZXRlIGJhY2t3YXJkc1xuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHNlbGVjdGlvbiBjb3VudGVkIGJ5IHJvdyBhbmQgY29sdW1uIG9mIHRoZSBlZGl0b3IgTWFya2Rvd24gY29udGVudCAoYXMgb3Bwb3NlZCB0byB0aGUgcG9zaXRpb24gaW4gdGhlIERPTSkuXG4gICAqIFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdldEFuY2hvciBpZiBzZXQgdG8gdHJ1ZSwgZ2V0cyB0aGUgc2VsZWN0aW9uIGFuY2hvciAoc3RhcnQgcG9pbnQgb2YgdGhlIHNlbGVjdGlvbiksIG90aGVyd2lzZSBnZXRzIHRoZSBmb2N1cyAoZW5kIHBvaW50KS5cbiAgICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzZWxlY3Rpb24sIHdpdGggcHJvcGVydGllcyBjb2wgYW5kIHJvdy5cbiAgICovXG4gIGdldFNlbGVjdGlvbihnZXRBbmNob3IgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBsZXQgc3RhcnROb2RlID0gKGdldEFuY2hvciA/IHNlbGVjdGlvbi5hbmNob3JOb2RlIDogc2VsZWN0aW9uLmZvY3VzTm9kZSk7XG4gICAgaWYgKCFzdGFydE5vZGUpIHJldHVybiBudWxsO1xuICAgIGxldCBvZmZzZXQgPSBzdGFydE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gKGdldEFuY2hvciA/IHNlbGVjdGlvbi5hbmNob3JPZmZzZXQgOiBzZWxlY3Rpb24uZm9jdXNPZmZzZXQpIDogMDtcbiAgXG4gICAgaWYgKHN0YXJ0Tm9kZSA9PSB0aGlzLmUpIHtcbiAgICAgIHJldHVybiB7cm93OiAwLCBjb2w6IG9mZnNldH07XG4gICAgfVxuXG4gICAgbGV0IGNvbCA9IHRoaXMuY29tcHV0ZUNvbHVtbihzdGFydE5vZGUsIG9mZnNldCk7ICAgIFxuICAgIGlmIChjb2wgPT09IG51bGwpIHJldHVybiBudWxsOyAvLyBXZSBhcmUgb3V0c2lkZSBvZiB0aGUgZWRpdG9yXG5cbiAgICAvLyBGaW5kIHRoZSByb3cgbm9kZVxuICAgIGxldCBub2RlID0gc3RhcnROb2RlO1xuICAgIHdoaWxlIChub2RlLnBhcmVudEVsZW1lbnQgIT0gdGhpcy5lKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cblxuICAgIGxldCByb3cgPSAwO1xuICAgIC8vIENoZWNrIGlmIHdlIGNhbiByZWFkIGEgbGluZSBudW1iZXIgZnJvbSB0aGUgZGF0YS1saW5lLW51bSBhdHRyaWJ1dGUuXG4gICAgLy8gVGhlIGxhc3QgY29uZGl0aW9uIGlzIGEgc2VjdXJpdHkgbWVhc3VyZSBzaW5jZSBpbnNlcnRpbmcgYSBuZXcgcGFyYWdyYXBoIGNvcGllcyB0aGUgcHJldmlvdXMgcm93cycgbGluZSBudW1iZXJcbiAgICBpZiAobm9kZS5kYXRhc2V0ICYmIG5vZGUuZGF0YXNldC5saW5lTnVtICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcgfHwgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YXNldC5saW5lTnVtICE9IG5vZGUuZGF0YXNldC5saW5lTnVtICkpIHtcbiAgICAgIHJvdyA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC5saW5lTnVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG5vZGUucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIHJvdysrO1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7cm93OiByb3csIGNvbDogY29sLCBub2RlOiBzdGFydE5vZGV9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIGEgY29sdW1uIHdpdGhpbiBhbiBlZGl0b3IgbGluZSBmcm9tIGEgbm9kZSBhbmQgb2Zmc2V0IHdpdGhpbiB0aGF0IG5vZGUuXG4gICAqIEBwYXJhbSB7Tm9kZX0gc3RhcnROb2RlIFRoZSBub2RlXG4gICAqIEBwYXJhbSB7aW50fSBvZmZzZXQgVEhlIHNlbGVjdGlvblxuICAgKiBAcmV0dXJucyB7aW50fSB0aGUgY29sdW1uLCBvciBudWxsIGlmIHRoZSBub2RlIGlzIG5vdCBpbnNpZGUgdGhlIGVkaXRvclxuICAgKi9cbiAgY29tcHV0ZUNvbHVtbihzdGFydE5vZGUsIG9mZnNldCkge1xuICAgIGxldCBub2RlID0gc3RhcnROb2RlO1xuICAgIGxldCBjb2wgPSBvZmZzZXQ7XG4gICAgLy8gRmlyc3QsIG1ha2Ugc3VyZSB3ZSdyZSBhY3R1YWxseSBpbiB0aGUgZWRpdG9yLlxuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSAhPSB0aGlzLmUpIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGlmIChub2RlID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIFxuICAgIG5vZGUgPSBzdGFydE5vZGU7XG4gICAgd2hpbGUgKG5vZGUucGFyZW50Tm9kZSAhPSB0aGlzLmUpIHtcbiAgICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIGNvbCArPSBub2RlLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2w7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgRE9NIG5vZGUgYW5kIG9mZnNldCB3aXRoaW4gdGhhdCBub2RlIGZyb20gYSBwb3NpdGlvbiBleHByZXNzZWQgYXMgcm93IGFuZCBjb2x1bW4uXG4gICAqIEBwYXJhbSB7aW50fSByb3cgUm93IChsaW5lIG51bWJlcilcbiAgICogQHBhcmFtIHtpbnR9IGNvbCBDb2x1bW5cbiAgICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6IG5vZGUgYW5kIG9mZnNldC4gb2Zmc2V0IG1heSBiZSBudWxsO1xuICAgKi9cbiAgY29tcHV0ZU5vZGVBbmRPZmZzZXQocm93LCBjb2wsIGJpbmRSaWdodCA9IGZhbHNlKSB7XG4gICAgaWYgKHJvdyA+PSB0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIFNlbGVjdGlvbiBwYXN0IHRoZSBlbmQgb2YgdGV4dCwgc2V0IHNlbGVjdGlvbiB0byBlbmQgb2YgdGV4dFxuICAgICAgcm93ID0gdGhpcy5saW5lRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIGNvbCA9IHRoaXMubGluZXNbcm93XS5sZW5ndGg7XG4gICAgfSBcbiAgICBpZiAoY29sID4gdGhpcy5saW5lc1tyb3ddLmxlbmd0aCkge1xuICAgICAgY29sID0gdGhpcy5saW5lc1tyb3ddLmxlbmd0aDtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubGluZUVsZW1lbnRzW3Jvd107XG4gICAgbGV0IG5vZGUgPSBwYXJlbnROb2RlLmZpcnN0Q2hpbGQ7XG5cbiAgICBsZXQgY2hpbGRyZW5Db21wbGV0ZSA9IGZhbHNlO1xuICAgIC8vIGRlZmF1bHQgcmV0dXJuIHZhbHVlXG4gICAgbGV0IHJ2ID0ge25vZGU6IHBhcmVudE5vZGUuZmlyc3RDaGlsZCA/IHBhcmVudE5vZGUuZmlyc3RDaGlsZCA6IHBhcmVudE5vZGUsIG9mZnNldDogMH07XG5cbiAgICB3aGlsZSAobm9kZSAhPSBwYXJlbnROb2RlKSB7XG4gICAgICBpZiAoIWNoaWxkcmVuQ29tcGxldGUgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVZhbHVlLmxlbmd0aCA+PSBjb2wpIHtcbiAgICAgICAgICBpZiAoYmluZFJpZ2h0ICYmIG5vZGUubm9kZVZhbHVlLmxlbmd0aCA9PSBjb2wpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdGlvbiBpcyBhdCB0aGUgZW5kIG9mIHRoaXMgdGV4dCBub2RlLCBidXQgd2UgYXJlIGJpbmRpbmcgcmlnaHQgKHByZWZlciBhbiBvZmZzZXQgb2YgMCBpbiB0aGUgbmV4dCB0ZXh0IG5vZGUpXG4gICAgICAgICAgICAvLyBSZW1lbWJlciByZXR1cm4gdmFsdWUgaW4gY2FzZSB3ZSBkb24ndCBmaW5kIGFub3RoZXIgdGV4dCBub2RlXG4gICAgICAgICAgICBydiA9IHtub2RlOiBub2RlLCBvZmZzZXQ6IGNvbH07XG4gICAgICAgICAgICBjb2wgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybih7bm9kZTogbm9kZSwgb2Zmc2V0OiBjb2x9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sIC09IG5vZGUubm9kZVZhbHVlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGlmICghY2hpbGRyZW5Db21wbGV0ZSAmJiBub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgICBjaGlsZHJlbkNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW5Db21wbGV0ZSA9IHRydWU7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRWl0aGVyLCB0aGUgcG9zaXRpb24gd2FzIGludmFsaWQgYW5kIHdlIGp1c3QgcmV0dXJuIHRoZSBkZWZhdWx0IHJldHVybiB2YWx1ZVxuICAgIC8vIE9yIHdlIGFyZSBiaW5kaW5nIHJpZ2h0IGFuZCB0aGUgc2VsZWN0aW9uIGlzIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmVcbiAgICByZXR1cm4gcnY7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0aW9uIGJhc2VkIG9uIHJvd3MgYW5kIGNvbHVtbnMgd2l0aGluIHRoZSBlZGl0b3IgTWFya2Rvd24gY29udGVudC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGZvY3VzIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNlbGVjdGlvbiwgbmVlZHMgdG8gaGF2ZSBwcm9wZXJ0aWVzIHJvdyBhbmQgY29sLlxuICAgKi9cbiAgc2V0U2VsZWN0aW9uKGZvY3VzLCBhbmNob3IgPSBudWxsKSB7XG4gICAgaWYgKCFmb2N1cykgcmV0dXJuO1xuXG4gICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcblxuICAgIGxldCB7bm9kZTogZm9jdXNOb2RlLCBvZmZzZXQ6IGZvY3VzT2Zmc2V0fSA9IHRoaXMuY29tcHV0ZU5vZGVBbmRPZmZzZXQoZm9jdXMucm93LCBmb2N1cy5jb2wsIChhbmNob3IgJiYgYW5jaG9yLnJvdyA9PSBmb2N1cy5yb3cgJiYgYW5jaG9yLmNvbCA+IGZvY3VzLmNvbCkpOyAvLyBCaW5kIHNlbGVjdGlvbiByaWdodCBpZiBhbmNob3IgaXMgaW4gdGhlIHNhbWUgcm93IGFuZCBiZWhpbmQgdGhlIGZvY3VzXG4gICAgbGV0IGFuY2hvck5vZGUgPSBudWxsLCBhbmNob3JPZmZzZXQgPSBudWxsO1xuICAgIGlmIChhbmNob3IgJiYgKGFuY2hvci5yb3cgIT0gZm9jdXMucm93IHx8IGFuY2hvci5jb2wgIT0gZm9jdXMuY29sKSkge1xuICAgICAgbGV0IHtub2RlLCBvZmZzZXR9ID0gdGhpcy5jb21wdXRlTm9kZUFuZE9mZnNldChhbmNob3Iucm93LCBhbmNob3IuY29sLCBmb2N1cy5yb3cgPT0gYW5jaG9yLnJvdyAmJiBmb2N1cy5jb2wgPiBhbmNob3IuY29sKTtcbiAgICAgIGFuY2hvck5vZGUgPSBub2RlO1xuICAgICAgYW5jaG9yT2Zmc2V0ID0gb2Zmc2V0O1xuICAgIH1cblxuICAgIGlmIChhbmNob3JOb2RlKSByYW5nZS5zZXRTdGFydChhbmNob3JOb2RlLCBhbmNob3JPZmZzZXQpO1xuICAgIGVsc2UgcmFuZ2Uuc2V0U3RhcnQoZm9jdXNOb2RlLCBmb2N1c09mZnNldCk7XG4gICAgcmFuZ2Uuc2V0RW5kKGZvY3VzTm9kZSwgZm9jdXNPZmZzZXQpO1xuICAgIFxuICAgIGxldCB3aW5kb3dTZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgd2luZG93U2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHdpbmRvd1NlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG4gIH1cblxuICAvKiogXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIGlucHV0IGV2ZW50cyBcbiAgICovXG4gIGhhbmRsZUlucHV0RXZlbnQoZXZlbnQpIHtcbiAgICBsZXQgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuXG4gICAgaWYgKChldmVudC5pbnB1dFR5cGUgPT0gJ2luc2VydFBhcmFncmFwaCcgfHwgZXZlbnQuaW5wdXRUeXBlID09ICdpbnNlcnRMaW5lQnJlYWsnKSAmJiBmb2N1cykge1xuICAgICAgdGhpcy5jbGVhckRpcnR5RmxhZygpO1xuICAgICAgdGhpcy5wcm9jZXNzTmV3UGFyYWdyYXBoKGZvY3VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmUuZmlyc3RDaGlsZCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJUTUJsYW5rTGluZVwiPjxicj48L2Rpdj4nO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkTm9kZSA9IHRoaXMuZS5maXJzdENoaWxkOyBjaGlsZE5vZGU7IGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZykge1xuICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgIT0gMyB8fCBjaGlsZE5vZGUudGFnTmFtZSAhPSAnRElWJykge1xuICAgICAgICAgICAgLy8gRm91bmQgYSBjaGlsZCBub2RlIHRoYXQncyBlaXRoZXIgbm90IGFuIGVsZW1lbnQgb3Igbm90IGEgZGl2LiBXcmFwIGl0IGluIGEgZGl2LlxuICAgICAgICAgICAgbGV0IGRpdldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZS5pbnNlcnRCZWZvcmUoZGl2V3JhcHBlciwgY2hpbGROb2RlKTtcbiAgICAgICAgICAgIHRoaXMuZS5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgICAgZGl2V3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVMaW5lQ29udGVudHNBbmRGb3JtYXR0aW5nKCk7ICBcbiAgICB9XG4gICAgaWYgKGZvY3VzKSB0aGlzLnNldFNlbGVjdGlvbihmb2N1cyk7XG4gICAgdGhpcy5maXJlQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3IgXCJzZWxlY3Rpb25jaGFuZ2VcIiBldmVudHMuXG4gICAqL1xuICBoYW5kbGVTZWxlY3Rpb25DaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLmZpcmVTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBcInNwbGljZVwiIG5ldyBsaW5lcyBpbnRvIHRoZSBhcnJheXMgdGhpcy5saW5lcywgdGhpcy5saW5lRGlydHksIHRoaXMubGluZVR5cGVzLCBhbmQgdGhlIERPTSBlbGVtZW50cyBcbiAgICogdW5kZXJuZWF0aCB0aGUgZWRpdG9yIGVsZW1lbnQuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGVzc2VudGlhbGx5IEFycmF5LnNwbGljZSwgb25seSB0aGF0IHRoZSB0aGlyZCBwYXJhbWV0ZXIgdGFrZXMgYW4gdW4tc3ByZWFkIGFycmF5IChhbmQgdGhlIGZvcnRoIHBhcmFtZXRlcilcbiAgICogZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBET00gc2hvdWxkIGFsc28gYmUgYWRqdXN0ZWQuXG4gICAqIFxuICAgKiBAcGFyYW0ge2ludH0gc3RhcnRMaW5lIFBvc2l0aW9uIGF0IHdoaWNoIHRvIHN0YXJ0IGNoYW5naW5nIHRoZSBhcnJheSBvZiBsaW5lc1xuICAgKiBAcGFyYW0ge2ludH0gbGluZXNUb0RlbGV0ZSBOdW1iZXIgb2YgbGluZXMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7YXJyYXl9IGxpbmVzVG9JbnNlcnQgQXJyYXkgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlIGxpbmVzIHRvIGJlIGluc2VydGVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0TGluZUVsZW1lbnRzIElmIHRydWUsIHRoZW4gPGRpdj4gZWxlbWVudHMgYXJlIGFsc28gaW5zZXJ0ZWQgaW4gdGhlIERPTSBhdCB0aGUgcmVzcGVjdGl2ZSBwb3NpdGlvblxuICAgKi9cbiAgc3BsaWNlTGluZXMoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlID0gMCwgbGluZXNUb0luc2VydCA9IFtdLCBhZGp1c3RMaW5lRWxlbWVudHMgPSB0cnVlKSB7XG4gICAgaWYgKGFkanVzdExpbmVFbGVtZW50cykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc1RvRGVsZXRlOyBpKyspIHtcbiAgICAgICAgdGhpcy5lLnJlbW92ZUNoaWxkKHRoaXMuZS5jaGlsZE5vZGVzW3N0YXJ0TGluZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBsZXQgaW5zZXJ0ZWRCbGFuayA9IFtdO1xuICAgIGxldCBpbnNlcnRlZERpcnR5ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzVG9JbnNlcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluc2VydGVkQmxhbmsucHVzaCgnJyk7XG4gICAgICBpbnNlcnRlZERpcnR5LnB1c2godHJ1ZSk7XG4gICAgICBpZiAoYWRqdXN0TGluZUVsZW1lbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmUuY2hpbGROb2Rlc1tzdGFydExpbmVdKSB0aGlzLmUuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLHRoaXMuZS5jaGlsZE5vZGVzW3N0YXJ0TGluZV0pO1xuICAgICAgICBlbHNlIHRoaXMuZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcy5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5saW5lc1RvSW5zZXJ0KTtcbiAgICB0aGlzLmxpbmVUeXBlcy5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5pbnNlcnRlZEJsYW5rKTtcbiAgICB0aGlzLmxpbmVEaXJ0eS5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5pbnNlcnRlZERpcnR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgXCJwYXN0ZVwiIGV2ZW50XG4gICAqL1xuICBoYW5kbGVQYXN0ZShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIFxuICAgIC8vIGdldCB0ZXh0IHJlcHJlc2VudGF0aW9uIG9mIGNsaXBib2FyZFxuICAgIGxldCB0ZXh0ID0gKGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQpLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuXG4gICAgLy8gaW5zZXJ0IHRleHQgbWFudWFsbHlcbiAgICB0aGlzLnBhc3RlKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3RlcyB0aGUgdGV4dCBhdCB0aGUgY3VycmVudCBzZWxlY3Rpb24gKG9yIGF0IHRoZSBlbmQsIGlmIG5vIGN1cnJlbnQgc2VsZWN0aW9uKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBcbiAgICovXG4gIHBhc3RlKHRleHQsIGFuY2hvciA9IG51bGwsIGZvY3VzID0gbnVsbCkge1xuICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSB0aGlzLmdldFNlbGVjdGlvbih0cnVlKTtcbiAgICBpZiAoIWZvY3VzKSBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICBsZXQgYmVnaW5uaW5nLCBlbmQ7XG4gICAgaWYgKCFmb2N1cykge1xuICAgICAgZm9jdXMgPSB7IHJvdzogdGhpcy5saW5lcy5sZW5ndGgsIGNvbDogdGhpcy5saW5lc1t0aGlzLmxpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aCB9OyAvLyBJbnNlcnQgYXQgZW5kXG4gICAgfVxuICAgIGlmICghYW5jaG9yKSB7XG4gICAgICBhbmNob3IgPSBmb2N1cztcbiAgICB9XG4gICAgaWYgKGFuY2hvci5yb3cgPCBmb2N1cy5yb3cgfHwgKGFuY2hvci5yb3cgPT0gZm9jdXMucm93ICYmIGFuY2hvci5jb2wgPD0gZm9jdXMuY29sKSkge1xuICAgICAgYmVnaW5uaW5nID0gYW5jaG9yO1xuICAgICAgZW5kID0gZm9jdXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYmVnaW5uaW5nID0gZm9jdXM7XG4gICAgICBlbmQgPSBhbmNob3I7XG4gICAgfVxuICAgIGxldCBpbnNlcnRlZExpbmVzID0gdGV4dC5zcGxpdCgvKD86XFxyXFxufFxccnxcXG4pLyk7XG4gICAgbGV0IGxpbmVCZWZvcmUgPSB0aGlzLmxpbmVzW2JlZ2lubmluZy5yb3ddLnN1YnN0cigwLCBiZWdpbm5pbmcuY29sKTtcbiAgICBsZXQgbGluZUVuZCA9IHRoaXMubGluZXNbZW5kLnJvd10uc3Vic3RyKGVuZC5jb2wpO1xuICAgIGluc2VydGVkTGluZXNbMF0gPSBsaW5lQmVmb3JlLmNvbmNhdChpbnNlcnRlZExpbmVzWzBdKTtcbiAgICBsZXQgZW5kQ29sUG9zID0gaW5zZXJ0ZWRMaW5lc1tpbnNlcnRlZExpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aDtcbiAgICBpbnNlcnRlZExpbmVzW2luc2VydGVkTGluZXMubGVuZ3RoIC0gMV0gPSBpbnNlcnRlZExpbmVzW2luc2VydGVkTGluZXMubGVuZ3RoIC0gMV0uY29uY2F0KGxpbmVFbmQpO1xuICAgIHRoaXMuc3BsaWNlTGluZXMoYmVnaW5uaW5nLnJvdywgMSArIGVuZC5yb3cgLSBiZWdpbm5pbmcucm93LCBpbnNlcnRlZExpbmVzKTtcbiAgICBmb2N1cy5yb3cgPSBiZWdpbm5pbmcucm93ICsgaW5zZXJ0ZWRMaW5lcy5sZW5ndGggLSAxO1xuICAgIGZvY3VzLmNvbCA9IGVuZENvbFBvcztcbiAgICB0aGlzLnVwZGF0ZUZvcm1hdHRpbmcoKTtcbiAgICB0aGlzLnNldFNlbGVjdGlvbihmb2N1cyk7XG4gICAgdGhpcy5maXJlQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIChsb3dlc3QgaW4gdGhlIERPTSB0cmVlKSBjb21tb24gYW5jZXN0b3Igb2YgdHdvIERPTSBub2Rlcy5cbiAgICogQHBhcmFtIHtOb2RlfSBub2RlMSB0aGUgZmlyc3Qgbm9kZVxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUyIHRoZSBzZWNvbmQgbm9kZVxuICAgKiBAcmV0dXJucyB7Tm9kZX0gVGhlIGNvbW1lbiBhbmNlc3RvciBub2RlLCBvciBudWxsIGlmIHRoZXJlIGlzIG5vIGNvbW1vbiBhbmNlc3RvclxuICAgKi9cbiAgY29tcHV0ZUNvbW1vbkFuY2VzdG9yKG5vZGUxLCBub2RlMikge1xuICAgIGlmICghbm9kZTEgfHwgIW5vZGUyKSByZXR1cm4gbnVsbDtcbiAgICBpZiAobm9kZTEgPT0gbm9kZTIpIHJldHVybiBub2RlMTtcbiAgICBjb25zdCBhbmNlc3RyeSA9IChub2RlKSA9PiB7XG4gICAgICBsZXQgYW5jZXN0cnkgPSBbXTtcbiAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGFuY2VzdHJ5LnVuc2hpZnQobm9kZSk7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYW5jZXN0cnk7XG4gICAgfVxuXG4gICAgY29uc3QgYW5jZXN0cnkxID0gYW5jZXN0cnkobm9kZTEpO1xuICAgIGNvbnN0IGFuY2VzdHJ5MiA9IGFuY2VzdHJ5KG5vZGUyKTtcblxuICAgIGlmIChhbmNlc3RyeTFbMF0gIT0gYW5jZXN0cnkyWzBdKSByZXR1cm4gbnVsbDtcbiAgICBsZXQgaTtcbiAgICBmb3IgKGkgPSAwOyBhbmNlc3RyeTFbaV0gPT0gYW5jZXN0cnkyW2ldOyBpKyspO1xuICAgIHJldHVybiBhbmNlc3RyeTFbaS0xXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgKGxvd2VzdCBpbiB0aGUgRE9NIHRyZWUpIGVuY2xvc2luZyBET00gbm9kZSB3aXRoIGEgZ2l2ZW4gY2xhc3MuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmb2N1cyBUaGUgZm9jdXMgc2VsZWN0aW9uIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gYW5jaG9yIFRoZSBhbmNob3Igc2VsZWN0aW9uIG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyBuYW1lIHRvIGZpbmRcbiAgICogQHJldHVybnMge05vZGV9IFRoZSBlbmNsb3NpbmcgRE9NIG5vZGUgd2l0aCB0aGUgcmVzcGVjdGl2ZSBjbGFzcyAoaW5zaWRlIHRoZSBlZGl0b3IpLCBpZiB0aGVyZSBpcyBvbmU7IG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgY29tcHV0ZUVuY2xvc2luZ01hcmt1cE5vZGUoZm9jdXMsIGFuY2hvciwgY2xhc3NOYW1lKSB7XG4gICAgbGV0IG5vZGUgPSBudWxsO1xuICAgIGlmICghZm9jdXMpIHJldHVybiBudWxsO1xuICAgIGlmICghYW5jaG9yKSB7XG4gICAgICBub2RlID0gZm9jdXMubm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZvY3VzLnJvdyAhPSBhbmNob3Iucm93KSByZXR1cm4gbnVsbDtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbXB1dGVDb21tb25BbmNlc3Rvcihmb2N1cy5ub2RlLCBhbmNob3Iubm9kZSk7XG4gICAgfVxuICAgIGlmICghbm9kZSkgcmV0dXJuIG51bGw7XG4gICAgd2hpbGUgKG5vZGUgIT0gdGhpcy5lKSB7XG4gICAgICBpZiAobm9kZS5jbGFzc05hbWUgJiYgbm9kZS5jbGFzc05hbWUuaW5jbHVkZXMoY2xhc3NOYW1lKSkgcmV0dXJuIG5vZGU7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgIH1cbiAgICAvLyBBc2NlbmRlZCBhbGwgdGhlIHdheSB0byB0aGUgZWRpdG9yIGVsZW1lbnRcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSAodHJ1ZSAvIGZhbHNlKSBvZiBhbGwgY29tbWFuZHMuXG4gICAqIEBwYXJhbSBmb2N1cyBGb2N1cyBvZiB0aGUgc2VsZWN0aW9uLiBJZiBub3QgZ2l2ZW4sIGFzc3VtZXMgdGhlIGN1cnJlbnQgZm9jdXMuXG4gICAqL1xuICBnZXRDb21tYW5kU3RhdGUoZm9jdXMgPSBudWxsLCBhbmNob3IgPSBudWxsKSB7XG4gICAgbGV0IGNvbW1hbmRTdGF0ZSA9IHt9O1xuICAgIGlmICghZm9jdXMpIGZvY3VzID0gdGhpcy5nZXRTZWxlY3Rpb24oZmFsc2UpO1xuICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSB0aGlzLmdldFNlbGVjdGlvbih0cnVlKTtcbiAgICBpZiAoIWZvY3VzKSB7XG4gICAgICBmb3IgKGxldCBjbWQgaW4gY29tbWFuZHMpIHtcbiAgICAgICAgY29tbWFuZFN0YXRlW2NtZF0gPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbW1hbmRTdGF0ZTtcbiAgICB9XG4gICAgaWYgKCFhbmNob3IpIGFuY2hvciA9IGZvY3VzOyBcbiAgICBcbiAgICBsZXQgc3RhcnQsIGVuZDtcbiAgICBpZiAoYW5jaG9yLnJvdyA8IGZvY3VzLnJvdyB8fCAoYW5jaG9yLnJvdyA9PSBmb2N1cy5yb3cgJiYgYW5jaG9yLmNvbCA8IGZvY3VzLmNvbCkpIHtcbiAgICAgIHN0YXJ0ID0gYW5jaG9yO1xuICAgICAgZW5kID0gZm9jdXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZm9jdXM7XG4gICAgICBlbmQgPSBhbmNob3I7XG4gICAgfVxuICAgIGlmIChlbmQucm93ID4gc3RhcnQucm93ICYmIGVuZC5jb2wgPT0gMCkge1xuICAgICAgZW5kLnJvdy0tO1xuICAgICAgZW5kLmNvbCA9IHRoaXMubGluZXNbZW5kLnJvd10ubGVuZ3RoOyAvLyBTZWxlY3Rpb24gdG8gYmVnaW5uaW5nIG9mIG5leHQgbGluZSBpcyBzYWlkIHRvIGVuZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsYXN0IGxpbmVcbiAgICB9XG5cbiAgICBmb3IgKGxldCBjbWQgaW4gY29tbWFuZHMpIHtcbiAgICAgIGlmIChjb21tYW5kc1tjbWRdLnR5cGUgPT0gJ2lubGluZScpIHtcblxuICAgICAgICBpZiAoIWZvY3VzIHx8IGZvY3VzLnJvdyAhPSBhbmNob3Iucm93IHx8ICF0aGlzLmlzSW5saW5lRm9ybWF0dGluZ0FsbG93ZWQoZm9jdXMsIGFuY2hvcikpIHtcbiAgICAgICAgICBjb21tYW5kU3RhdGVbY21kXSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIGNvbW1hbmQgc3RhdGUgaXMgdHJ1ZSBpZiB0aGVyZSBpcyBhIHJlc3BlY3RpdmUgZW5jbG9zaW5nIG1hcmt1cCBub2RlIChlLmcuLCB0aGUgc2VsZWN0aW9uIGlzIGVuY2xvc2VkIGluIGEgPGI+Li48L2I+KSAuLi4gXG4gICAgICAgICAgY29tbWFuZFN0YXRlW2NtZF0gPSBcbiAgICAgICAgICAgICEhdGhpcy5jb21wdXRlRW5jbG9zaW5nTWFya3VwTm9kZShmb2N1cywgYW5jaG9yLCBjb21tYW5kc1tjbWRdLmNsYXNzTmFtZSkgfHxcbiAgICAgICAgICAvLyAuLi4gb3IgaWYgaXQncyBhbiBlbXB0eSBzdHJpbmcgcHJlY2VkZWQgYnkgYW5kIGZvbGxvd2VkIGJ5IGZvcm1hdHRpbmcgbWFya2VycywgZS5nLiAqKnwqKiB3aGVyZSB8IGlzIHRoZSBjdXJzb3JcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgZm9jdXMuY29sID09IGFuY2hvci5jb2wgXG4gICAgICAgICAgICAgICYmICEhdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cigwLCBmb2N1cy5jb2wpLm1hdGNoKGNvbW1hbmRzW2NtZF0udW5zZXQucHJlUGF0dGVybilcbiAgICAgICAgICAgICAgJiYgISF0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKGZvY3VzLmNvbCkubWF0Y2goY29tbWFuZHNbY21kXS51bnNldC5wb3N0UGF0dGVybilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBpZiAoY29tbWFuZHNbY21kXS50eXBlID09ICdsaW5lJykge1xuICAgICAgICBpZiAoIWZvY3VzKSB7XG4gICAgICAgICAgY29tbWFuZFN0YXRlW2NtZF0gPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMubGluZVR5cGVzW3N0YXJ0LnJvd10gPT0gY29tbWFuZHNbY21kXS5jbGFzc05hbWU7XG4gICAgICAgICAgXG4gICAgICAgICAgZm9yIChsZXQgbGluZSA9IHN0YXJ0LnJvdzsgbGluZSA8PSBlbmQucm93OyBsaW5lICsrKSB7XG4gICAgICAgICAgICBpZiAoKHRoaXMubGluZVR5cGVzW2xpbmVdID09IGNvbW1hbmRzW2NtZF0uY2xhc3NOYW1lKSAhPSBzdGF0ZSkge1xuICAgICAgICAgICAgICBzdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb21tYW5kU3RhdGVbY21kXSA9IHN0YXRlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29tbWFuZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjb21tYW5kIHN0YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kIFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN0YXRlIFxuICAgKi9cbiAgc2V0Q29tbWFuZFN0YXRlKGNvbW1hbmQsIHN0YXRlKSB7XG4gICAgaWYgKGNvbW1hbmRzW2NvbW1hbmRdLnR5cGUgPT0gJ2lubGluZScpIHtcbiAgICAgIGxldCBhbmNob3IgPSB0aGlzLmdldFNlbGVjdGlvbih0cnVlKTtcbiAgICAgIGxldCBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSBmb2N1cztcbiAgICAgIGlmICghYW5jaG9yKSByZXR1cm47XG4gICAgICBpZiAoYW5jaG9yLnJvdyAhPSBmb2N1cy5yb3cpIHJldHVybjtcbiAgICAgIGlmICghdGhpcy5pc0lubGluZUZvcm1hdHRpbmdBbGxvd2VkKGZvY3VzLCBhbmNob3IpKSByZXR1cm47IFxuICAgICAgbGV0IG1hcmt1cE5vZGUgPSB0aGlzLmNvbXB1dGVFbmNsb3NpbmdNYXJrdXBOb2RlKGZvY3VzLCBhbmNob3IsIGNvbW1hbmRzW2NvbW1hbmRdLmNsYXNzTmFtZSk7XG4gICAgICB0aGlzLmNsZWFyRGlydHlGbGFnKCk7XG4gICAgICBcbiAgICAgIC8vIEZpcnN0IGNhc2U6IFRoZXJlJ3MgYW4gZW5jbG9zaW5nIG1hcmt1cCBub2RlLCByZW1vdmUgdGhlIG1hcmtlcnMgYXJvdW5kIHRoYXQgbWFya3VwIG5vZGVcbiAgICAgIGlmIChtYXJrdXBOb2RlKSB7XG4gICAgICAgIHRoaXMubGluZURpcnR5W2ZvY3VzLnJvd10gPSB0cnVlO1xuICAgICAgICBjb25zdCBzdGFydENvbCA9IHRoaXMuY29tcHV0ZUNvbHVtbihtYXJrdXBOb2RlLCAwKTtcbiAgICAgICAgY29uc3QgbGVuID0gbWFya3VwTm9kZS50ZXh0Q29udGVudC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKDAsIHN0YXJ0Q29sKS5yZXBsYWNlKGNvbW1hbmRzW2NvbW1hbmRdLnVuc2V0LnByZVBhdHRlcm4sICcnKTtcbiAgICAgICAgY29uc3QgbWlkID0gdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cihzdGFydENvbCwgbGVuKTtcbiAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKHN0YXJ0Q29sICsgbGVuKS5yZXBsYWNlKGNvbW1hbmRzW2NvbW1hbmRdLnVuc2V0LnBvc3RQYXR0ZXJuLCAnJyk7XG4gICAgICAgIHRoaXMubGluZXNbZm9jdXMucm93XSA9IGxlZnQuY29uY2F0KG1pZCwgcmlnaHQpO1xuICAgICAgICBhbmNob3IuY29sID0gbGVmdC5sZW5ndGg7XG4gICAgICAgIGZvY3VzLmNvbCA9IGFuY2hvci5jb2wgKyBsZW47XG4gICAgICAgIHRoaXMudXBkYXRlRm9ybWF0dGluZygpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihmb2N1cywgYW5jaG9yKTsgIFxuXG4gICAgICAvLyBTZWNvbmQgY2FzZTogRW1wdHkgc2VsZWN0aW9uIHdpdGggc3Vycm91bmRpbmcgZm9ybWF0dGluZyBtYXJrZXJzLCByZW1vdmUgdGhvc2VcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGZvY3VzLmNvbCA9PSBhbmNob3IuY29sIFxuICAgICAgICAmJiAhIXRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoMCwgZm9jdXMuY29sKS5tYXRjaChjb21tYW5kc1tjb21tYW5kXS51bnNldC5wcmVQYXR0ZXJuKVxuICAgICAgICAmJiAhIXRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoZm9jdXMuY29sKS5tYXRjaChjb21tYW5kc1tjb21tYW5kXS51bnNldC5wb3N0UGF0dGVybilcbiAgICAgICkge1xuICAgICAgICB0aGlzLmxpbmVEaXJ0eVtmb2N1cy5yb3ddID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoMCwgZm9jdXMuY29sKS5yZXBsYWNlKGNvbW1hbmRzW2NvbW1hbmRdLnVuc2V0LnByZVBhdHRlcm4sICcnKTtcbiAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKGZvY3VzLmNvbCkucmVwbGFjZShjb21tYW5kc1tjb21tYW5kXS51bnNldC5wb3N0UGF0dGVybiwgJycpO1xuICAgICAgICB0aGlzLmxpbmVzW2ZvY3VzLnJvd10gPSBsZWZ0LmNvbmNhdChyaWdodCk7XG4gICAgICAgIGZvY3VzLmNvbCA9IGFuY2hvci5jb2wgPSBsZWZ0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGZvY3VzLCBhbmNob3IpO1xuXG4gICAgICAvLyBOb3QgY3VycmVudGx5IGZvcm1hdHRlZCwgaW5zZXJ0IGZvcm1hdHRpbmcgbWFya2Vyc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgIC8vIFRyaW0gYW55IHNwYWNlcyBmcm9tIHRoZSBzZWxlY3Rpb25cbiAgICAgICAgbGV0IHtzdGFydENvbCwgZW5kQ29sfSA9IGZvY3VzLmNvbCA8IGFuY2hvci5jb2wgPyB7c3RhcnRDb2w6IGZvY3VzLmNvbCwgZW5kQ29sOiBhbmNob3IuY29sfSA6IHtzdGFydENvbDogYW5jaG9yLmNvbCwgZW5kQ29sOiBmb2N1cy5jb2x9O1xuXG4gICAgICAgIGxldCBtYXRjaCA9IHRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoc3RhcnRDb2wsIGVuZENvbCAtIHN0YXJ0Q29sKS5tYXRjaCgvXig/PGxlYWRpbmc+XFxzKikuKlxcUyg/PHRyYWlsaW5nPlxccyopJC8pO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICBzdGFydENvbCArPSBtYXRjaC5ncm91cHMubGVhZGluZy5sZW5ndGg7XG4gICAgICAgICAgZW5kQ29sIC09IG1hdGNoLmdyb3Vwcy50cmFpbGluZy5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb2N1cy5jb2wgPSBzdGFydENvbDtcbiAgICAgICAgYW5jaG9yLmNvbCA9IGVuZENvbDtcblxuICAgICAgICAvLyBKdXN0IGluc2VydCBtYXJrdXAgYmVmb3JlIGFuZCBhZnRlciBhbmQgaG9wZSBmb3IgdGhlIGJlc3QuIFxuICAgICAgICB0aGlzLndyYXBTZWxlY3Rpb24oY29tbWFuZHNbY29tbWFuZF0uc2V0LnByZSwgY29tbWFuZHNbY29tbWFuZF0uc2V0LnBvc3QsIGZvY3VzLCBhbmNob3IpO1xuICAgICAgICAvLyBUT0RPIGNsZWFuIHRoaXMgdXAgc28gdGhhdCBtYXJrdXAgcmVtYWlucyBwcm9wZXJseSBuZXN0ZWRcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoY29tbWFuZHNbY29tbWFuZF0udHlwZSA9PSAnbGluZScpIHtcbiAgICAgIGxldCBhbmNob3IgPSB0aGlzLmdldFNlbGVjdGlvbih0cnVlKTtcbiAgICAgIGxldCBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSBmb2N1cztcbiAgICAgIGlmICghZm9jdXMpIHJldHVybjtcbiAgICAgIHRoaXMuY2xlYXJEaXJ0eUZsYWcoKTtcbiAgICAgIGxldCBzdGFydCA9IGFuY2hvci5yb3cgPiBmb2N1cy5yb3cgPyBmb2N1cyA6IGFuY2hvcjtcbiAgICAgIGxldCBlbmQgPSAgYW5jaG9yLnJvdyA+IGZvY3VzLnJvdyA/IGFuY2hvciA6IGZvY3VzO1xuICAgICAgaWYgKGVuZC5yb3cgPiBzdGFydC5yb3cgJiYgZW5kLmNvbCA9PSAwKSB7XG4gICAgICAgIGVuZC5yb3ctLTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbGluZSA9IHN0YXJ0LnJvdzsgbGluZSA8PSBlbmQucm93OyBsaW5lKyspIHtcbiAgICAgICAgaWYgKHN0YXRlICYmIHRoaXMubGluZVR5cGVzW2xpbmVdICE9IGNvbW1hbmRzW2NvbW1hbmRdLmNsYXNzTmFtZSkge1xuICAgICAgICAgIHRoaXMubGluZXNbbGluZV0gPSB0aGlzLmxpbmVzW2xpbmVdLnJlcGxhY2UoY29tbWFuZHNbY29tbWFuZF0uc2V0LnBhdHRlcm4sIGNvbW1hbmRzW2NvbW1hbmRdLnNldC5yZXBsYWNlbWVudC5yZXBsYWNlKCckIycsIChsaW5lIC0gc3RhcnQucm93ICsgMSkpKTtcbiAgICAgICAgICB0aGlzLmxpbmVEaXJ0eVtsaW5lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdGF0ZSAmJiB0aGlzLmxpbmVUeXBlc1tsaW5lXSA9PSBjb21tYW5kc1tjb21tYW5kXS5jbGFzc05hbWUpIHtcbiAgICAgICAgICB0aGlzLmxpbmVzW2xpbmVdID0gdGhpcy5saW5lc1tsaW5lXS5yZXBsYWNlKGNvbW1hbmRzW2NvbW1hbmRdLnVuc2V0LnBhdHRlcm4sIGNvbW1hbmRzW2NvbW1hbmRdLnVuc2V0LnJlcGxhY2VtZW50KTtcbiAgICAgICAgICB0aGlzLmxpbmVEaXJ0eVtsaW5lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlRm9ybWF0dGluZygpO1xuICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oe3JvdzogZW5kLnJvdywgY29sOiB0aGlzLmxpbmVzW2VuZC5yb3ddLmxlbmd0aH0sIHtyb3c6IHN0YXJ0LnJvdywgY29sOiAwfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgaW5saW5lIGZvcm1hdHRpbmcgaXMgYWxsb3dlZCBhdCB0aGUgY3VycmVudCBmb2N1cyBcbiAgICogQHBhcmFtIHtvYmplY3R9IGZvY3VzIFRoZSBjdXJyZW50IGZvY3VzXG4gICAqL1xuICBpc0lubGluZUZvcm1hdHRpbmdBbGxvd2VkKCkge1xuICAgIC8vIFRPRE8gUmVtb3ZlIHBhcmFtZXRlcnMgZnJvbSBhbGwgY2FsbHNcbiAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKCFzZWwpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIENoZWNrIGlmIHdlIGNhbiBmaW5kIGEgY29tbW9uIGFuY2VzdG9yIHdpdGggdGhlIGNsYXNzIGBUTUlubGluZUZvcm1hdHRlZGAgXG5cbiAgICAvLyBTcGVjaWFsIGNhc2U6IEVtcHR5IHNlbGVjdGlvbiByaWdodCBiZWZvcmUgYFRNSW5saW5lRm9ybWF0dGVkYFxuICAgIGlmIChzZWwuaXNDb2xsYXBzZWQgJiYgc2VsLmZvY3VzTm9kZS5ub2RlVHlwZSA9PSAzICYmIHNlbC5mb2N1c09mZnNldCA9PSBzZWwuZm9jdXNOb2RlLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGxldCBub2RlO1xuICAgICAgZm9yIChub2RlID0gc2VsLmZvY3VzTm9kZTsgbm9kZSAmJiBub2RlLm5leHRTaWJsaW5nID09IG51bGw7IG5vZGUgPSBub2RlLnBhcmVudE5vZGUpO1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5uZXh0U2libGluZy5jbGFzc05hbWUgJiYgbm9kZS5uZXh0U2libGluZy5jbGFzc05hbWUuaW5jbHVkZXMoJ1RNSW5saW5lRm9ybWF0dGVkJykpIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIExvb2sgZm9yIGEgY29tbW9uIGFuY2VzdG9yXG4gICAgbGV0IGFuY2VzdG9yID0gdGhpcy5jb21wdXRlQ29tbW9uQW5jZXN0b3Ioc2VsLmZvY3VzTm9kZSwgc2VsLmFuY2hvck5vZGUpO1xuICAgIGlmICghYW5jZXN0b3IpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIENoZWNrIGlmIHRoZXJlJ3MgYW4gYW5jZXN0b3Igb2YgY2xhc3MgJ1RNSW5saW5lRm9ybWF0dGVkJyBvciAnVE1CbGFua0xpbmUnXG4gICAgd2hpbGUgKGFuY2VzdG9yICYmIGFuY2VzdG9yICE9IHRoaXMuZSkge1xuICAgICAgaWYgKGFuY2VzdG9yLmNsYXNzTmFtZSAmJiAoYW5jZXN0b3IuY2xhc3NOYW1lLmluY2x1ZGVzKCdUTUlubGluZUZvcm1hdHRlZCcpIHx8IGFuY2VzdG9yLmNsYXNzTmFtZS5pbmNsdWRlcygnVE1CbGFua0xpbmUnKSkpIHJldHVybiB0cnVlO1xuICAgICAgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gaW4gdGhlIHN0cmluZ3MgcHJlIGFuZCBwb3N0LiBJZiB0aGUgc2VsZWN0aW9uIGlzIG5vdCBvbiBvbmUgbGluZSwgcmV0dXJucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByZSBUaGUgc3RyaW5nIHRvIGluc2VydCBiZWZvcmUgdGhlIHNlbGVjdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc3QgVGhlIHN0cmluZyB0byBpbnNlcnQgYWZ0ZXIgdGhlIHNlbGVjdGlvbi5cbiAgICogQHBhcmFtIHtvYmplY3R9IGZvY3VzIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBmb2N1cy4gSWYgbnVsbCwgc2VsZWN0aW9uIHdpbGwgYmUgY29tcHV0ZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhbmNob3IgVGhlIGN1cnJlbnQgc2VsZWN0aW9uIGZvY3VzLiBJZiBudWxsLCBzZWxlY3Rpb24gd2lsbCBiZSBjb21wdXRlZC5cbiAgICovXG4gIHdyYXBTZWxlY3Rpb24ocHJlLCBwb3N0LCBmb2N1cyA9IG51bGwsIGFuY2hvciA9IG51bGwpIHtcbiAgICBpZiAoIWZvY3VzKSBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICBpZiAoIWFuY2hvcikgYW5jaG9yID0gdGhpcy5nZXRTZWxlY3Rpb24odHJ1ZSk7XG4gICAgaWYgKCFmb2N1cyB8fCAhYW5jaG9yIHx8IGZvY3VzLnJvdyAhPSBhbmNob3Iucm93KSByZXR1cm47XG4gICAgdGhpcy5saW5lRGlydHlbZm9jdXMucm93XSA9IHRydWU7XG5cbiAgICBjb25zdCBzdGFydENvbCA9IGZvY3VzLmNvbCA8IGFuY2hvci5jb2wgPyBmb2N1cy5jb2wgOiBhbmNob3IuY29sO1xuICAgIGNvbnN0IGVuZENvbCA9IGZvY3VzLmNvbCA8IGFuY2hvci5jb2wgPyBhbmNob3IuY29sIDogZm9jdXMuY29sO1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKDAsIHN0YXJ0Q29sKS5jb25jYXQocHJlKTtcbiAgICBjb25zdCBtaWQgPSAoZW5kQ29sID09IHN0YXJ0Q29sID8gJycgOiB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKHN0YXJ0Q29sLCBlbmRDb2wgLSBzdGFydENvbCkpOyBcbiAgICBjb25zdCByaWdodCA9IHBvc3QuY29uY2F0KHRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoZW5kQ29sKSk7XG4gICAgdGhpcy5saW5lc1tmb2N1cy5yb3ddID0gbGVmdC5jb25jYXQobWlkLCByaWdodCk7XG4gICAgYW5jaG9yLmNvbCA9IGxlZnQubGVuZ3RoO1xuICAgIGZvY3VzLmNvbCA9IGFuY2hvci5jb2wgKyBtaWQubGVuZ3RoO1xuXG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgdGhpcy5zZXRTZWxlY3Rpb24oZm9jdXMsIGFuY2hvcik7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgY29tbWFuZCBzdGF0ZSBmb3IgYSBjb21tYW5kICh0cnVlIDwtPiBmYWxzZSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1hbmQgVGhlIGVkaXRvciBjb21tYW5kXG4gICAqL1xuICB0b2dnbGVDb21tYW5kU3RhdGUoY29tbWFuZCkge1xuICAgIGlmICghdGhpcy5sYXN0Q29tbWFuZFN0YXRlKSB0aGlzLmxhc3RDb21tYW5kU3RhdGUgPSB0aGlzLmdldENvbW1hbmRTdGF0ZSgpO1xuICAgIHRoaXMuc2V0Q29tbWFuZFN0YXRlKGNvbW1hbmQsICF0aGlzLmxhc3RDb21tYW5kU3RhdGVbY29tbWFuZF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIGEgY2hhbmdlIGV2ZW50LiBVcGRhdGVzIHRoZSBsaW5rZWQgdGV4dGFyZWEgYW5kIG5vdGlmaWVzIGFueSBldmVudCBsaXN0ZW5lcnMuXG4gICAqL1xuICBmaXJlQ2hhbmdlKCkge1xuICAgIGlmICghdGhpcy50ZXh0YXJlYSAmJiAhdGhpcy5saXN0ZW5lcnMuY2hhbmdlLmxlbmd0aCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKTtcbiAgICBpZiAodGhpcy50ZXh0YXJlYSkgdGhpcy50ZXh0YXJlYS52YWx1ZSA9IGNvbnRlbnQ7XG4gICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMuY2hhbmdlKSB7XG4gICAgICBsaXN0ZW5lcih7XG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQsXG4gICAgICAgIGxpbmVzRGlydHk6IHRoaXMubGluZXNEaXJ0eSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyBhIFwic2VsZWN0aW9uIGNoYW5nZWRcIiBldmVudC5cbiAgICovXG4gIGZpcmVTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzLnNlbGVjdGlvbiAmJiB0aGlzLmxpc3RlbmVycy5zZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICBsZXQgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbihmYWxzZSk7XG4gICAgICBsZXQgYW5jaG9yID0gdGhpcy5nZXRTZWxlY3Rpb24odHJ1ZSk7XG4gICAgICBsZXQgY29tbWFuZFN0YXRlID0gdGhpcy5nZXRDb21tYW5kU3RhdGUoZm9jdXMsIGFuY2hvcik7XG4gICAgICBpZiAodGhpcy5sYXN0Q29tbWFuZFN0YXRlKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5sYXN0Q29tbWFuZFN0YXRlLCBjb21tYW5kU3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sYXN0Q29tbWFuZFN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgY29tbWFuZFN0YXRlKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzLnNlbGVjdGlvbikge1xuICAgICAgICBsaXN0ZW5lcih7XG4gICAgICAgICAgZm9jdXM6IGZvY3VzLFxuICAgICAgICAgIGFuY2hvcjogYW5jaG9yLFxuICAgICAgICAgIGNvbW1hbmRTdGF0ZTogdGhpcy5sYXN0Q29tbWFuZFN0YXRlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgb2YgZXZlbnQgdG8gbGlzdGVuIHRvLiBDYW4gYmUgJ2NoYW5nZScgb3IgJ3NlbGVjdGlvbidcbiAgICogQHBhcmFtIHsqfSBsaXN0ZW5lciBGdW5jdGlvbiBvZiB0aGUgdHlwZSAoZXZlbnQpID0+IHt9IHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBvY2N1cnMuXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKHR5cGUubWF0Y2goL14oPzpjaGFuZ2V8aW5wdXQpJC9pKSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnMuY2hhbmdlLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZS5tYXRjaCgvXig/OnNlbGVjdGlvbnxzZWxlY3Rpb25jaGFuZ2UpJC9pKSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnMuc2VsZWN0aW9uLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFZGl0b3I7XG4iXSwibmFtZXMiOlsiY2hlY2siLCJpdCIsIk1hdGgiLCJtb2R1bGUiLCJnbG9iYWxUaGlzIiwid2luZG93Iiwic2VsZiIsImdsb2JhbCIsIkZ1bmN0aW9uIiwiZXhlYyIsImVycm9yIiwiZmFpbHMiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIm5hdGl2ZVByb3BlcnR5SXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJOQVNIT1JOX0JVRyIsImNhbGwiLCJleHBvcnRzIiwiViIsImRlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwiYml0bWFwIiwidmFsdWUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInRvU3RyaW5nIiwic2xpY2UiLCJzcGxpdCIsImNsYXNzb2YiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJJbmRleGVkT2JqZWN0IiwicmVxdWlyZU9iamVjdENvZXJjaWJsZSIsImlucHV0IiwiUFJFRkVSUkVEX1NUUklORyIsImlzT2JqZWN0IiwiZm4iLCJ2YWwiLCJ2YWx1ZU9mIiwiaGFzT3duUHJvcGVydHkiLCJrZXkiLCJkb2N1bWVudCIsIkVYSVNUUyIsImNyZWF0ZUVsZW1lbnQiLCJERVNDUklQVE9SUyIsImEiLCJuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJPIiwiUCIsInRvSW5kZXhlZE9iamVjdCIsInRvUHJpbWl0aXZlIiwiSUU4X0RPTV9ERUZJTkUiLCJoYXMiLCJjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSIsImYiLCJTdHJpbmciLCJuYXRpdmVEZWZpbmVQcm9wZXJ0eSIsIkF0dHJpYnV0ZXMiLCJhbk9iamVjdCIsIm9iamVjdCIsImRlZmluZVByb3BlcnR5TW9kdWxlIiwiY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5IiwiU0hBUkVEIiwic3RvcmUiLCJzZXRHbG9iYWwiLCJmdW5jdGlvblRvU3RyaW5nIiwiaW5zcGVjdFNvdXJjZSIsIldlYWtNYXAiLCJ0ZXN0IiwicHVzaCIsInZlcnNpb24iLCJtb2RlIiwiY29weXJpZ2h0IiwiaWQiLCJwb3N0Zml4IiwicmFuZG9tIiwia2V5cyIsInNoYXJlZCIsInVpZCIsInNldCIsImVuZm9yY2UiLCJnZXR0ZXJGb3IiLCJUWVBFIiwic3RhdGUiLCJ0eXBlIiwiTkFUSVZFX1dFQUtfTUFQIiwid21nZXQiLCJ3bWhhcyIsIndtc2V0IiwibWV0YWRhdGEiLCJTVEFURSIsInNoYXJlZEtleSIsImhpZGRlbktleXMiLCJvYmplY3RIYXMiLCJnZXRJbnRlcm5hbFN0YXRlIiwiSW50ZXJuYWxTdGF0ZU1vZHVsZSIsImVuZm9yY2VJbnRlcm5hbFN0YXRlIiwiVEVNUExBVEUiLCJvcHRpb25zIiwidW5zYWZlIiwic2ltcGxlIiwibm9UYXJnZXRHZXQiLCJzb3VyY2UiLCJqb2luIiwicHJvdG90eXBlIiwiYUZ1bmN0aW9uIiwidmFyaWFibGUiLCJuYW1lc3BhY2UiLCJtZXRob2QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwYXRoIiwiY2VpbCIsImZsb29yIiwiYXJndW1lbnQiLCJpc05hTiIsIm1pbiIsInRvSW50ZWdlciIsIm1heCIsImluZGV4IiwiaW50ZWdlciIsImNyZWF0ZU1ldGhvZCIsIklTX0lOQ0xVREVTIiwiJHRoaXMiLCJlbCIsImZyb21JbmRleCIsInRvTGVuZ3RoIiwidG9BYnNvbHV0ZUluZGV4IiwiaW5jbHVkZXMiLCJpbmRleE9mIiwicmVxdWlyZSIsIm5hbWVzIiwiaSIsInJlc3VsdCIsImVudW1CdWdLZXlzIiwiY29uY2F0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImludGVybmFsT2JqZWN0S2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsImdldEJ1aWx0SW4iLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSIsImdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSIsInRhcmdldCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvck1vZHVsZSIsInJlcGxhY2VtZW50IiwiaXNGb3JjZWQiLCJmZWF0dXJlIiwiZGV0ZWN0aW9uIiwiZGF0YSIsIm5vcm1hbGl6ZSIsIlBPTFlGSUxMIiwiTkFUSVZFIiwic3RyaW5nIiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwiVEFSR0VUIiwiR0xPQkFMIiwiU1RBVElDIiwic3RhdCIsIkZPUkNFRCIsInRhcmdldFByb3BlcnR5Iiwic291cmNlUHJvcGVydHkiLCJmb3JjZWQiLCJjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzIiwic2hhbSIsInJlZGVmaW5lIiwiQXJyYXkiLCJpc0FycmF5IiwiYXJnIiwicHJvcGVydHlLZXkiLCJTeW1ib2wiLCJOQVRJVkVfU1lNQk9MIiwiaXRlcmF0b3IiLCJXZWxsS25vd25TeW1ib2xzU3RvcmUiLCJjcmVhdGVXZWxsS25vd25TeW1ib2wiLCJVU0VfU1lNQk9MX0FTX1VJRCIsIndpdGhvdXRTZXR0ZXIiLCJuYW1lIiwiU1BFQ0lFUyIsIndlbGxLbm93blN5bWJvbCIsIm9yaWdpbmFsQXJyYXkiLCJDIiwiY29uc3RydWN0b3IiLCJwcm9jZXNzIiwidmVyc2lvbnMiLCJ2OCIsIm1hdGNoIiwidXNlckFnZW50IiwiTUVUSE9EX05BTUUiLCJWOF9WRVJTSU9OIiwiYXJyYXkiLCJmb28iLCJCb29sZWFuIiwiSVNfQ09OQ0FUX1NQUkVBREFCTEUiLCJNQVhfU0FGRV9JTlRFR0VSIiwiTUFYSU1VTV9BTExPV0VEX0lOREVYX0VYQ0VFREVEIiwiSVNfQ09OQ0FUX1NQUkVBREFCTEVfU1VQUE9SVCIsIlNQRUNJRVNfU1VQUE9SVCIsImFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQiLCJpc0NvbmNhdFNwcmVhZGFibGUiLCJzcHJlYWRhYmxlIiwiJCIsInByb3RvIiwidG9PYmplY3QiLCJBIiwiYXJyYXlTcGVjaWVzQ3JlYXRlIiwibiIsImsiLCJsZW4iLCJFIiwiY3JlYXRlUHJvcGVydHkiLCJuYXRpdmVKb2luIiwiRVMzX1NUUklOR1MiLCJTVFJJQ1RfTUVUSE9EIiwiYXJyYXlNZXRob2RJc1N0cmljdCIsInNlcGFyYXRvciIsIkZ1bmN0aW9uUHJvdG90eXBlIiwiRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZyIsIm5hbWVSRSIsIk5BTUUiLCJuYXRpdmVBc3NpZ24iLCJhc3NpZ24iLCJiIiwiQiIsInN5bWJvbCIsImFscGhhYmV0IiwiZm9yRWFjaCIsImNociIsIm9iamVjdEtleXMiLCJUIiwiYXJndW1lbnRzTGVuZ3RoIiwiUyIsImoiLCJ0aGF0IiwiaWdub3JlQ2FzZSIsIm11bHRpbGluZSIsImRvdEFsbCIsInVuaWNvZGUiLCJzdGlja3kiLCJSRSIsInMiLCJSZWdFeHAiLCJyZSIsImxhc3RJbmRleCIsIm5hdGl2ZUV4ZWMiLCJuYXRpdmVSZXBsYWNlIiwicGF0Y2hlZEV4ZWMiLCJVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkciLCJyZTEiLCJyZTIiLCJVTlNVUFBPUlRFRF9ZIiwic3RpY2t5SGVscGVycyIsIkJST0tFTl9DQVJFVCIsIk5QQ0dfSU5DTFVERUQiLCJQQVRDSCIsInN0ciIsInJlQ29weSIsImZsYWdzIiwicmVnZXhwRmxhZ3MiLCJjaGFyc0FkZGVkIiwic3RyQ29weSIsIlJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTIiwiZ3JvdXBzIiwiUkVQTEFDRV9LRUVQU18kMCIsIlJFUExBQ0UiLCJSRUdFWFBfUkVQTEFDRV9TVUJTVElUVVRFU19VTkRFRklORURfQ0FQVFVSRSIsIlNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQyIsIm9yaWdpbmFsRXhlYyIsImFwcGx5IiwiS0VZIiwiU1lNQk9MIiwiREVMRUdBVEVTX1RPX1NZTUJPTCIsIkRFTEVHQVRFU19UT19FWEVDIiwiZXhlY0NhbGxlZCIsIm5hdGl2ZVJlZ0V4cE1ldGhvZCIsIm1ldGhvZHMiLCJuYXRpdmVNZXRob2QiLCJyZWdleHAiLCJhcmcyIiwiZm9yY2VTdHJpbmdNZXRob2QiLCJyZWdleHBFeGVjIiwiZG9uZSIsInN0cmluZ01ldGhvZCIsInJlZ2V4TWV0aG9kIiwiQ09OVkVSVF9UT19TVFJJTkciLCJwb3MiLCJwb3NpdGlvbiIsInNpemUiLCJmaXJzdCIsInNlY29uZCIsImNoYXJDb2RlQXQiLCJjaGFyQXQiLCJjb2RlQXQiLCJSIiwiZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMiLCJNQVRDSCIsIm5hdGl2ZU1hdGNoIiwibWF5YmVDYWxsTmF0aXZlIiwibWF0Y2hlciIsInJlcyIsInJ4IiwicmVnRXhwRXhlYyIsImZ1bGxVbmljb2RlIiwibWF0Y2hTdHIiLCJhZHZhbmNlU3RyaW5nSW5kZXgiLCJpc1JlZ0V4cCIsImRlZmF1bHRDb25zdHJ1Y3RvciIsImFycmF5UHVzaCIsIk1BWF9VSU5UMzIiLCJTVVBQT1JUU19ZIiwiU1BMSVQiLCJuYXRpdmVTcGxpdCIsImludGVybmFsU3BsaXQiLCJsaW1pdCIsImxpbSIsIm91dHB1dCIsImxhc3RMYXN0SW5kZXgiLCJzZXBhcmF0b3JDb3B5IiwibGFzdExlbmd0aCIsInNwbGl0dGVyIiwic3BlY2llc0NvbnN0cnVjdG9yIiwidW5pY29kZU1hdGNoaW5nIiwiY2FsbFJlZ0V4cEV4ZWMiLCJwIiwicSIsInoiLCJlIiwicXVvdCIsInRhZyIsImF0dHJpYnV0ZSIsInAxIiwiZm9yY2VkU3RyaW5nSFRNTE1ldGhvZCIsImFuY2hvciIsImNyZWF0ZUhUTUwiLCJib2xkIiwibGluayIsInVybCIsInN2ZyIsImJsb2NrcXVvdGUiLCJjbGVhcl9mb3JtYXR0aW5nIiwiY29kZSIsImgxIiwiaDIiLCJociIsImltYWdlIiwiaXRhbGljIiwib2wiLCJzdHJpa2V0aHJvdWdoIiwidWwiLCJpc01hY0xpa2UiLCJuYXZpZ2F0b3IiLCJwbGF0Zm9ybSIsIkRlZmF1bHRDb21tYW5kcyIsImFjdGlvbiIsImlubmVySFRNTCIsInRpdGxlIiwiaG90a2V5IiwiZWRpdG9yIiwiaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCIsIndyYXBTZWxlY3Rpb24iLCJlbmFibGVkIiwiZm9jdXMiLCJwYXN0ZSIsIkNvbW1hbmRCYXIiLCJwcm9wcyIsImNvbW1hbmRzIiwiYnV0dG9ucyIsImhvdGtleXMiLCJlbGVtZW50IiwidGFnTmFtZSIsImdldEVsZW1lbnRCeUlkIiwiYm9keSIsImNyZWF0ZUNvbW1hbmRCYXJFbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUtleWRvd24iLCJzZXRFZGl0b3IiLCJwYXJlbnRFbGVtZW50IiwiY2xhc3NOYW1lIiwiY29tbWFuZCIsImFwcGVuZENoaWxkIiwiY29tbWFuZE5hbWUiLCJtb2RpZmllcnMiLCJtb2RpZmllcmV4cGxhbmF0aW9uIiwiaGFuZGxlQ2xpY2siLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic2V0Q29tbWFuZFN0YXRlIiwiaGFuZGxlU2VsZWN0aW9uIiwiY29tbWFuZFN0YXRlIiwib3V0ZXIiLCJtb2RpZmllciIsImRlZmluZVByb3BlcnRpZXMiLCJQcm9wZXJ0aWVzIiwiR1QiLCJMVCIsIlBST1RPVFlQRSIsIlNDUklQVCIsIklFX1BST1RPIiwiRW1wdHlDb25zdHJ1Y3RvciIsInNjcmlwdFRhZyIsImNvbnRlbnQiLCJOdWxsUHJvdG9PYmplY3RWaWFBY3RpdmVYIiwiYWN0aXZlWERvY3VtZW50Iiwid3JpdGUiLCJjbG9zZSIsInRlbXAiLCJwYXJlbnRXaW5kb3ciLCJOdWxsUHJvdG9PYmplY3RWaWFJRnJhbWUiLCJpZnJhbWUiLCJkb2N1bWVudENyZWF0ZUVsZW1lbnQiLCJKUyIsImlmcmFtZURvY3VtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiaHRtbCIsInNyYyIsImNvbnRlbnRXaW5kb3ciLCJvcGVuIiwiRiIsIk51bGxQcm90b09iamVjdCIsImRvbWFpbiIsIkFjdGl2ZVhPYmplY3QiLCJjcmVhdGUiLCJVTlNDT1BBQkxFUyIsIkFycmF5UHJvdG90eXBlIiwiY2FjaGUiLCJ0aHJvd2VyIiwiQUNDRVNTT1JTIiwiYXJndW1lbnQwIiwiYXJndW1lbnQxIiwiJGluY2x1ZGVzIiwiVVNFU19UT19MRU5HVEgiLCJhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCIsImFkZFRvVW5zY29wYWJsZXMiLCJIQVNfU1BFQ0lFU19TVVBQT1JUIiwiTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCIsInNwbGljZSIsInN0YXJ0IiwiZGVsZXRlQ291bnQiLCJhY3R1YWxTdGFydCIsImluc2VydENvdW50IiwiYWN0dWFsRGVsZXRlQ291bnQiLCJmcm9tIiwidG8iLCJjb3JyZWN0SXNSZWdFeHBMb2dpYyIsInNlYXJjaFN0cmluZyIsIm5vdEFSZWdFeHAiLCJTVUJTVElUVVRJT05fU1lNQk9MUyIsIlNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEIiwibWF5YmVUb1N0cmluZyIsInJlYXNvbiIsIlVOU0FGRV9TVUJTVElUVVRFIiwic2VhcmNoVmFsdWUiLCJyZXBsYWNlVmFsdWUiLCJyZXBsYWNlciIsImZ1bmN0aW9uYWxSZXBsYWNlIiwicmVzdWx0cyIsImFjY3VtdWxhdGVkUmVzdWx0IiwibmV4dFNvdXJjZVBvc2l0aW9uIiwibWF0Y2hlZCIsImNhcHR1cmVzIiwibmFtZWRDYXB0dXJlcyIsInJlcGxhY2VyQXJncyIsImdldFN1YnN0aXR1dGlvbiIsInRhaWxQb3MiLCJtIiwic3ltYm9scyIsImNoIiwiY2FwdHVyZSIsIndoaXRlc3BhY2UiLCJ3aGl0ZXNwYWNlcyIsImx0cmltIiwicnRyaW0iLCJlbmQiLCJ0cmltIiwibm9uIiwiJHRyaW0iLCJmb3JjZWRTdHJpbmdUcmltTWV0aG9kIiwiRkFJTFNfT05fUFJJTUlUSVZFUyIsIm5hdGl2ZUtleXMiLCJzZXRQcm90b3R5cGVPZiIsIkNPUlJFQ1RfU0VUVEVSIiwic2V0dGVyIiwiYVBvc3NpYmxlUHJvdG90eXBlIiwiX19wcm90b19fIiwiZHVtbXkiLCJXcmFwcGVyIiwiTmV3VGFyZ2V0IiwiTmV3VGFyZ2V0UHJvdG90eXBlIiwiQ09OU1RSVUNUT1JfTkFNRSIsIkNvbnN0cnVjdG9yIiwic2V0SW50ZXJuYWxTdGF0ZSIsIk5hdGl2ZVJlZ0V4cCIsIlJlZ0V4cFByb3RvdHlwZSIsIkNPUlJFQ1RfTkVXIiwiUmVnRXhwV3JhcHBlciIsInBhdHRlcm4iLCJ0aGlzSXNSZWdFeHAiLCJwYXR0ZXJuSXNSZWdFeHAiLCJmbGFnc0FyZVVuZGVmaW5lZCIsImdldEZsYWdzIiwiaW5oZXJpdElmUmVxdWlyZWQiLCJwcm94eSIsInNldFNwZWNpZXMiLCJvYmplY3REZWZpbmVQcm9wZXJ0eU1vZHVsZSIsInJlZ0V4cEZsYWdzIiwiVE9fU1RSSU5HIiwibmF0aXZlVG9TdHJpbmciLCJOT1RfR0VORVJJQyIsIklOQ09SUkVDVF9OQU1FIiwicmYiLCJyZXBsYWNlbWVudHMiLCJBU0NJSVB1bmN0dWF0aW9uIiwiTm90VHJpZ2dlckNoYXIiLCJTY2hlbWUiLCJFbWFpbCIsIkhUTUxPcGVuVGFnIiwiSFRNTENsb3NlVGFnIiwiSFRNTFRhZ05hbWUiLCJIVE1MQ29tbWVudCIsIkhUTUxQSSIsIkhUTUxEZWNsYXJhdGlvbiIsIkhUTUxDREFUQSIsIkhUTUxBdHRyaWJ1dGUiLCJIVE1MQXR0VmFsdWUiLCJLbm93blRhZyIsInB1bmN0dWF0aW9uTGVhZGluZyIsInB1bmN0dWF0aW9uVHJhaWxpbmciLCJsaW5lR3JhbW1hciIsIlRNSDEiLCJUTUgyIiwiVE1IMyIsIlRNSDQiLCJUTUg1IiwiVE1INiIsIlRNQmxvY2txdW90ZSIsIlRNQ29kZUZlbmNlQmFja3RpY2tPcGVuIiwiVE1Db2RlRmVuY2VUaWxkZU9wZW4iLCJUTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2UiLCJUTUNvZGVGZW5jZVRpbGRlQ2xvc2UiLCJUTUJsYW5rTGluZSIsIlRNU2V0ZXh0SDFNYXJrZXIiLCJUTVNldGV4dEgyTWFya2VyIiwiVE1IUiIsIlRNVUwiLCJUTU9MIiwiVE1JbmRlbnRlZENvZGUiLCJUTUxpbmtSZWZlcmVuY2VEZWZpbml0aW9uIiwibGFiZWxQbGFjZWhvbGRlciIsImh0bWxCbG9ja0dyYW1tYXIiLCJwYXJhSW50ZXJydXB0IiwiaW5saW5lR3JhbW1hciIsImVzY2FwZSIsImF1dG9saW5rIiwibGlua09wZW4iLCJpbWFnZU9wZW4iLCJsaW5rTGFiZWwiLCJkZWZhdWx0IiwicmVwbGFjZW1lbnRSZWdleHAiLCJpbmxpbmVSdWxlcyIsInJ1bGUiLCJodG1sZXNjYXBlIiwicHJlIiwicG9zdCIsInVuc2V0IiwicHJlUGF0dGVybiIsInBvc3RQYXR0ZXJuIiwiRWRpdG9yIiwidGV4dGFyZWEiLCJsaW5lcyIsImxpbmVFbGVtZW50cyIsImxpbmVUeXBlcyIsImxpbmVDYXB0dXJlcyIsImxpbmVSZXBsYWNlbWVudHMiLCJsaW5rTGFiZWxzIiwibGluZURpcnR5IiwibGFzdENvbW1hbmRTdGF0ZSIsImxpc3RlbmVycyIsImNoYW5nZSIsInNlbGVjdGlvbiIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwicGFyZW50Tm9kZSIsImNyZWF0ZUVkaXRvckVsZW1lbnQiLCJzZXRDb250ZW50IiwiY29udGVudEVkaXRhYmxlIiwid2hpdGVTcGFjZSIsIndlYmtpdFVzZXJNb2RpZnkiLCJuZXh0U2libGluZyIsImluc2VydEJlZm9yZSIsImhhbmRsZUlucHV0RXZlbnQiLCJoYW5kbGVTZWxlY3Rpb25DaGFuZ2VFdmVudCIsImhhbmRsZVBhc3RlIiwiY2hpbGROb2RlcyIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImxpbmVOdW0iLCJsZSIsInVwZGF0ZUZvcm1hdHRpbmciLCJmaXJlQ2hhbmdlIiwidXBkYXRlTGluZVR5cGVzIiwidXBkYXRlTGlua0xhYmVscyIsImFwcGx5TGluZVR5cGVzIiwibCIsInByb2Nlc3NJbmxpbmVTdHlsZXMiLCJjb250ZW50SFRNTCIsInJlbW92ZUF0dHJpYnV0ZSIsImRhdGFzZXQiLCJjb2RlQmxvY2tUeXBlIiwiY29kZUJsb2NrU2VxTGVuZ3RoIiwiaHRtbEJsb2NrIiwibGluZVR5cGUiLCJsaW5lQ2FwdHVyZSIsImxpbmVSZXBsYWNlbWVudCIsImh0bWxCbG9ja1R5cGUiLCJoZWFkaW5nTGluZSIsImhlYWRpbmdMaW5lVHlwZSIsImNsZWFyRGlydHlGbGFnIiwidXBkYXRlTGluZUNvbnRlbnRzIiwib3JpZ2luYWxTdHJpbmciLCJpc0ltYWdlIiwidGV4dE9mZnNldCIsIm9wZW5lciIsInN1YnN0ciIsImN1cnJlbnRPZmZzZXQiLCJicmFja2V0TGV2ZWwiLCJsaW5rVGV4dCIsImxpbmtSZWYiLCJsaW5rRGV0YWlscyIsInRleHRPdXRlciIsImNhcCIsInBhcnNlTGlua09ySW1hZ2UiLCJuZXh0Q2hhciIsInBhcmVudGhlc2lzTGV2ZWwiLCJpbmxpbmVPdXRlciIsInZhbGlkIiwibGFiZWwiLCJjaGFyQ291bnQiLCJwcm9jZXNzZWQiLCJzdGFjayIsIm9mZnNldCIsInBvdGVudGlhbExpbmsiLCJwb3RlbnRpYWxJbWFnZSIsImRlbGltQ291bnQiLCJkZWxpbVN0cmluZyIsImN1cnJlbnREZWxpbWl0ZXIiLCJwcmVjZWRpbmciLCJmb2xsb3dpbmciLCJwdW5jdHVhdGlvbkZvbGxvd3MiLCJwdW5jdHVhdGlvblByZWNlZGVzIiwid2hpdGVzcGFjZUZvbGxvd3MiLCJ3aGl0ZXNwYWNlUHJlY2VkZXMiLCJjYW5PcGVuIiwiY2FuQ2xvc2UiLCJzdGFja1BvaW50ZXIiLCJkZWxpbWl0ZXIiLCJlbnRyeSIsInBvcCIsImNvdW50IiwiY29uc3VtZWQiLCJsaW5lRGVsdGEiLCJjaGlsZEVsZW1lbnRDb3VudCIsImZpcnN0Q2hhbmdlZExpbmUiLCJ0ZXh0Q29udGVudCIsImxhc3RDaGFuZ2VkTGluZSIsImxpbmVzVG9EZWxldGUiLCJsaW5lc1RvQWRkIiwic3BsaWNlTGluZXMiLCJsaW5lIiwiY3QiLCJzZWwiLCJjb250aW51YWJsZVR5cGUiLCJjaGVja0xpbmUiLCJjb2wiLCJyb3ciLCJwYXJzZUludCIsImdldEFuY2hvciIsImdldFNlbGVjdGlvbiIsInN0YXJ0Tm9kZSIsImFuY2hvck5vZGUiLCJmb2N1c05vZGUiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJhbmNob3JPZmZzZXQiLCJmb2N1c09mZnNldCIsImNvbXB1dGVDb2x1bW4iLCJub2RlIiwicHJldmlvdXNTaWJsaW5nIiwiYmluZFJpZ2h0IiwiY2hpbGRyZW5Db21wbGV0ZSIsInJ2Iiwibm9kZVZhbHVlIiwicmFuZ2UiLCJjcmVhdGVSYW5nZSIsImNvbXB1dGVOb2RlQW5kT2Zmc2V0Iiwic2V0U3RhcnQiLCJzZXRFbmQiLCJ3aW5kb3dTZWxlY3Rpb24iLCJyZW1vdmVBbGxSYW5nZXMiLCJhZGRSYW5nZSIsImlucHV0VHlwZSIsInByb2Nlc3NOZXdQYXJhZ3JhcGgiLCJjaGlsZE5vZGUiLCJkaXZXcmFwcGVyIiwidXBkYXRlTGluZUNvbnRlbnRzQW5kRm9ybWF0dGluZyIsInNldFNlbGVjdGlvbiIsImZpcmVTZWxlY3Rpb24iLCJzdGFydExpbmUiLCJsaW5lc1RvSW5zZXJ0IiwiYWRqdXN0TGluZUVsZW1lbnRzIiwiaW5zZXJ0ZWRCbGFuayIsImluc2VydGVkRGlydHkiLCJ0ZXh0Iiwib3JpZ2luYWxFdmVudCIsImNsaXBib2FyZERhdGEiLCJnZXREYXRhIiwiYmVnaW5uaW5nIiwiaW5zZXJ0ZWRMaW5lcyIsImxpbmVCZWZvcmUiLCJsaW5lRW5kIiwiZW5kQ29sUG9zIiwibm9kZTEiLCJub2RlMiIsImFuY2VzdHJ5IiwidW5zaGlmdCIsImFuY2VzdHJ5MSIsImFuY2VzdHJ5MiIsImNvbXB1dGVDb21tb25BbmNlc3RvciIsImNtZCIsImNvbXB1dGVFbmNsb3NpbmdNYXJrdXBOb2RlIiwibWFya3VwTm9kZSIsInN0YXJ0Q29sIiwibGVmdCIsIm1pZCIsInJpZ2h0IiwiZW5kQ29sIiwibGVhZGluZyIsInRyYWlsaW5nIiwiaXNDb2xsYXBzZWQiLCJhbmNlc3RvciIsImdldENvbW1hbmRTdGF0ZSIsImdldENvbnRlbnQiLCJsaXN0ZW5lciIsImxpbmVzRGlydHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBQSxJQUFJQSxLQUFLLEdBQUcsVUFBVUMsRUFBVixFQUFjO0NBQ3hCLFNBQU9BLEVBQUUsSUFBSUEsRUFBRSxDQUFDQyxJQUFILElBQVdBLElBQWpCLElBQXlCRCxFQUFoQztDQUNELENBRkQ7OztDQUtBRSxZQUFBO0NBRUVILEtBQUssQ0FBQyxPQUFPSSxVQUFQLElBQXFCLFFBQXJCLElBQWlDQSxVQUFsQyxDQUFMLElBQ0FKLEtBQUssQ0FBQyxPQUFPSyxNQUFQLElBQWlCLFFBQWpCLElBQTZCQSxNQUE5QixDQURMLElBRUFMLEtBQUssQ0FBQyxPQUFPTSxJQUFQLElBQWUsUUFBZixJQUEyQkEsSUFBNUIsQ0FGTCxJQUdBTixLQUFLLENBQUMsT0FBT08sY0FBUCxJQUFpQixRQUFqQixJQUE2QkEsY0FBOUIsQ0FITDtDQUtBQyxR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