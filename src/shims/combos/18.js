// vim: ts=4 sts=4 sw=4 expandtab
// -- kriskowal Kris Kowal Copyright (C) 2009-2011 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright (C) 2010 XXX TODO License or CLA
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Gozala Irakli Gozalishvili Copyright (C) 2010 MIT License
// -- kitcambridge Kit Cambridge Copyright (C) 2011 MIT License
// -- kossnocorp Sasha Koss XXX TODO License or CLA
// -- bryanforbes Bryan Forbes XXX TODO License or CLA
// -- killdream Quildreen Motta Copyright (C) 2011 MIT Licence
// -- michaelficarra Michael Ficarra Copyright (C) 2011 3-clause BSD License
// -- sharkbrainguy Gerard Paapu Copyright (C) 2011 MIT License
// -- bbqsrc Brendan Molloy XXX TODO License or CLA
// -- iwyg XXX TODO License or CLA
// -- DomenicDenicola Domenic Denicola XXX TODO License or CLA
// -- xavierm02 Montillet Xavier XXX TODO License or CLA
// -- Raynos Raynos XXX TODO License or CLA
// -- samsonjs Sami Samhuri XXX TODO License or CLA
// -- rwldrn Rick Waldron Copyright (C) 2011 MIT License
// -- lexer Alexey Zakharov XXX TODO License or CLA

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

(function (undefined) {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 *
 * @module
 */

/*whatsupdoc*/

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var owns;
var toString;

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf

if (!Function.prototype.bind) {
    Function.prototype.bind = function (that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function")
            throw new TypeError(); // TODO message
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var F = function(){};
                F.prototype = target.prototype;
                var self = new F;

                var result = target.apply(
                    self,
                    args.concat(slice.call(arguments))
                );
                if (result !== null && Object(result) === result)
                    return result;
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // XXX bound.length is never writable, so don't even try
        //
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

toString = call.bind(prototypeOfObject.toString);
owns = call.bind(prototypeOfObject.hasOwnProperty);


//
// Array
// =====
//

// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function (obj) {
        return toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp*/) {
        var self = toObject(this),
            thisp = arguments[1],
            i = 0,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object context
                fun.call(thisp, self[i], i, self);
            }
            i++;
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisp*/) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, self);
        }
        return result;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            result = [],
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                result.push(self[i]);
        }
        return result;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function (fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self))
                return false;
        }
        return true;
    };
}

// ES5 15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function (fun /*, thisp */) {
        var self = toObject(this),
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, self))
                return true;
        }
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self)
                result = fun.call(void 0, result, self[i], i, self);
        }

        return result;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function (fun /*, initial*/) {
        var self = toObject(this),
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1)
            throw new TypeError(); // TODO message

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError(); // TODO message
            } while (true);
        }

        do {
            if (i in this)
                result = fun.call(void 0, result, self[i], i, self);
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (sought /*, fromIndex */ ) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;

        var i = 0;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);

        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (sought /*, fromIndex */) {
        var self = toObject(this),
            length = self.length >>> 0;

        if (!length)
            return -1;
        var i = length - 1;
        if (arguments.length > 1)
            i = toInteger(arguments[1]);
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i])
                return i;
        }
        return -1;
    };
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if([1,2].splice(0).length != 2) {
    var _origArraySplice = Array.prototype.splice;

    Array.prototype.splice = function(start, deleteCount) {
        if(!arguments.length)return [];

        return _origArraySplice.apply(this, [
                start === void 0 ? 0 : start,
                deleteCount === void 0 ? (this.length - start) : deleteCount
            ].concat(slice.call(arguments, 2)))
    };
}

//
// Object
// ======
//


// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a simplified subset of the ISO 8601
// standard as defined in 15.9.1.15.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value;
        if (!isFinite(this))
            throw new RangeError;

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10)
                result[length] = "0" + value;
        }
        // pad milliseconds to have three digits.
        return result.slice(0, 3).join("-") + "T" + result.slice(3).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError(); // TODO message
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}


//
// String
// ======
//

// ES5 15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14
// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String, which is the this value (converted to a String). If limit is not undefined, then the output array is truncated so that it contains no more than limit elements.
// "0".split(undefined, 0) -> []
if("0".split(void 0, 0).length) {
    var oldSplit = String.prototype.split;
    String.prototype.split = function(separator, limit) {
        if(separator === void 0 && limit === 0)return [];
        return oldSplit.apply(this, arguments);
    }
}

// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a non-normative section suggesting uniform semantics
// and it should be normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
if("".substr && "0b".substr(-1) !== "b") {
    var oldSubstr = String.prototype.substr;
    /**
* Get the substring of a string
* @param {integer} start where to start the substring
* @param {integer} length how many characters to return
* @return {string}
*/
    String.prototype.substr = function(start, length) {
        return oldSubstr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
    }
}

//
// Util
// ======
//

// http://jsperf.com/to-integer
var toInteger = function (n) {
    n = +n;
    if (n !== n) // isNaN
        n = -1;
    else if (n !== 0 && n !== (1/0) && n !== -(1/0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    return n;
};

var prepareString = "a"[0] != "a",
    // ES5 9.9
    toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError(); // TODO message
        }
        // If the implementation doesn't support by-index access of
        // string characters (ex. IE < 7), split the string
        if (prepareString && typeof o == "string" && o) {
            return o.split("");
        }
        return Object(o);
    };

})();



(function($, shims){
	var defineProperty = 'defineProperty';
	var advancedObjectProperties = !!(Object.create && Object.defineProperties && Object.getOwnPropertyDescriptor);
	//safari5 has defineProperty-interface, but it can't be used on dom-object
	//only do this test in non-IE browsers, because this hurts dhtml-behavior in some IE8 versions
	if (advancedObjectProperties && Object[defineProperty] && Object.prototype.__defineGetter__) {
		(function(){
			try {
				var foo = document.createElement('foo');
				Object[defineProperty](foo, 'bar', {
					get: function(){
						return true;
					}
				});
				advancedObjectProperties = !!foo.bar;
			} 
			catch (e) {
				advancedObjectProperties = false;
			}
			foo = null;
		})();
	}
	
	Modernizr.objectAccessor = !!((advancedObjectProperties || (Object.prototype.__defineGetter__ && Object.prototype.__lookupSetter__)));
	Modernizr.advancedObjectProperties = advancedObjectProperties;
	
if((!advancedObjectProperties || !Object.create || !Object.defineProperties || !Object.getOwnPropertyDescriptor  || !Object.defineProperty)){
	var call = Function.prototype.call;
	var prototypeOfObject = Object.prototype;
	var owns = call.bind(prototypeOfObject.hasOwnProperty);
	
	shims.objectCreate = function(proto, props, opts, no__proto__){
		var o;
		var f = function(){};
		
		f.prototype = proto;
		o = new f();
		
		if(!no__proto__ && !('__proto__' in o) && !Modernizr.objectAccessor){
			o.__proto__ = proto;
		}
		
		if(props){
			shims.defineProperties(o, props);
		}
		
		if(opts){
			o.options = jQuery.extend(true, {}, o.options || {}, opts);
			opts = o.options;
		}
		
		if(o._create && jQuery.isFunction(o._create)){
			o._create(opts);
		}
		return o;
	};
	
	shims.defineProperties = function(object, props){
		for (var name in props) {
			if (owns(props, name)) {
				shims.defineProperty(object, name, props[name]);
			}
		}
		return object;
	};
	
	var descProps = ['configurable', 'enumerable', 'writable'];
	shims.defineProperty = function(proto, property, descriptor){
		if(typeof descriptor != "object" || descriptor === null){return proto;}
		
		if(owns(descriptor, "value")){
			proto[property] = descriptor.value;
			return proto;
		}
		
		if(proto.__defineGetter__){
            if (typeof descriptor.get == "function") {
				proto.__defineGetter__(property, descriptor.get);
			}
            if (typeof descriptor.set == "function"){
                proto.__defineSetter__(property, descriptor.set);
			}
        }
		return proto;
	};
	
	shims.getPrototypeOf = function (object) {
        return Object.getPrototypeOf && Object.getPrototypeOf(object) || object.__proto__ || object.constructor && object.constructor.prototype;
    };
	
	//based on http://www.refactory.org/s/object_getownpropertydescriptor/view/latest 
	shims.getOwnPropertyDescriptor = function(obj, prop){
		if (typeof obj !== "object" && typeof obj !== "function" || obj === null){
            throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");
		}
		var descriptor;
		if(Object.defineProperty && Object.getOwnPropertyDescriptor){
			try{
				descriptor = Object.getOwnPropertyDescriptor(obj, prop);
				return descriptor;
			} catch(e){}
		}
        descriptor = {
            configurable: true,
            enumerable: true,
            writable: true,
            value: undefined
        };
		var getter = obj.__lookupGetter__ && obj.__lookupGetter__(prop), 
			setter = obj.__lookupSetter__ && obj.__lookupSetter__(prop)
		;
        
        if (!getter && !setter) { // not an accessor so return prop
        	if(!owns(obj, prop)){
				return;
			}
            descriptor.value = obj[prop];
            return descriptor;
        }
        
        // there is an accessor, remove descriptor.writable; populate descriptor.get and descriptor.set
        delete descriptor.writable;
        delete descriptor.value;
        descriptor.get = descriptor.set = undefined;
        
        if(getter){
			descriptor.get = getter;
		}
        
        if(setter){
            descriptor.set = setter;
		}
        
        return descriptor;
    };

}
})(jQuery, jQuery.webshims);



webshims.register('form-number-date-api', function($, webshims, window, document, undefined, options){
	"use strict";
	if(!webshims.addInputType){
		webshims.error("you can not call forms-ext feature after calling forms feature. call both at once instead: $.webshims.polyfill('forms forms-ext')");
	}
	
	if(!webshims.getStep){
		webshims.getStep = function(elem, type){
			var step = $.attr(elem, 'step');
			if(step === 'any'){
				return step;
			}
			type = type || getType(elem);
			if(!typeModels[type] || !typeModels[type].step){
				return step;
			}
			step = typeProtos.number.asNumber(step);
			return ((!isNaN(step) && step > 0) ? step : typeModels[type].step) * (typeModels[type].stepScaleFactor || 1);
		};
	}
	if(!webshims.addMinMaxNumberToCache){
		webshims.addMinMaxNumberToCache = function(attr, elem, cache){
			if (!(attr+'AsNumber' in cache)) {
				cache[attr+'AsNumber'] = typeModels[cache.type].asNumber(elem.attr(attr));
				if(isNaN(cache[attr+'AsNumber']) && (attr+'Default' in typeModels[cache.type])){
					cache[attr+'AsNumber'] = typeModels[cache.type][attr+'Default'];
				}
			}
		};
	}
	
	var nan = parseInt('NaN', 10),
		doc = document,
		typeModels = webshims.inputTypes,
		isNumber = function(string){
			return (typeof string == 'number' || (string && string == string * 1));
		},
		supportsType = function(type){
			return ($('<input type="'+type+'" />').prop('type') === type);
		},
		getType = function(elem){
			return (elem.getAttribute('type') || '').toLowerCase();
		},
		isDateTimePart = function(string){
			return (string && !(isNaN(string * 1)));
		},
		addMinMaxNumberToCache = webshims.addMinMaxNumberToCache,
		addleadingZero = function(val, len){
			val = ''+val;
			len = len - val.length;
			for(var i = 0; i < len; i++){
				val = '0'+val;
			}
			return val;
		},
		EPS = 1e-7,
		typeBugs = webshims.bugs.bustedValidity
	;
	
	webshims.addValidityRule('stepMismatch', function(input, val, cache, validityState){
		if(val === ''){return false;}
		if(!('type' in cache)){
			cache.type = getType(input[0]);
		}
		
		var ret = (validityState || {}).stepMismatch || false, base;
		if(typeModels[cache.type] && typeModels[cache.type].step){
			if( !('step' in cache) ){
				cache.step = webshims.getStep(input[0], cache.type);
			}
			
			if(cache.step == 'any'){return false;}
			
			if(!('valueAsNumber' in cache)){
				cache.valueAsNumber = typeModels[cache.type].asNumber( val );
			}
			if(isNaN(cache.valueAsNumber)){return false;}
			
			addMinMaxNumberToCache('min', input, cache);
			base = cache.minAsNumber;
			if(isNaN(base)){
				base = typeModels[cache.type].stepBase || 0;
			}
			
			ret =  Math.abs((cache.valueAsNumber - base) % cache.step);
							
			ret = !(  ret <= EPS || Math.abs(ret - cache.step) <= EPS  );
		}
		return ret;
	});
	
	
	
	[{name: 'rangeOverflow', attr: 'max', factor: 1}, {name: 'rangeUnderflow', attr: 'min', factor: -1}].forEach(function(data, i){
		webshims.addValidityRule(data.name, function(input, val, cache, validityState) {
			var ret = (validityState || {})[data.name] || false;
			if(val === ''){return ret;}
			if (!('type' in cache)) {
				cache.type = getType(input[0]);
			}
			if (typeModels[cache.type] && typeModels[cache.type].asNumber) {
				if(!('valueAsNumber' in cache)){
					cache.valueAsNumber = typeModels[cache.type].asNumber( val );
				}
				if(isNaN(cache.valueAsNumber)){
					return false;
				}
				
				addMinMaxNumberToCache(data.attr, input, cache);
				
				if(isNaN(cache[data.attr+'AsNumber'])){
					return ret;
				}
				ret = ( cache[data.attr+'AsNumber'] * data.factor <  cache.valueAsNumber * data.factor - EPS );
			}
			return ret;
		});
	});
	
	webshims.reflectProperties(['input'], ['max', 'min', 'step']);
	
	
	//IDLs and methods, that aren't part of constrain validation, but strongly tight to it
	var valueAsNumberDescriptor = webshims.defineNodeNameProperty('input', 'valueAsNumber', {
		prop: {
			get: function(){
				var elem = this;
				var type = getType(elem);
				var ret = (typeModels[type] && typeModels[type].asNumber) ? 
					typeModels[type].asNumber($.prop(elem, 'value')) :
					(valueAsNumberDescriptor.prop._supget && valueAsNumberDescriptor.prop._supget.apply(elem, arguments));
				if(ret == null){
					ret = nan;
				}
				return ret;
			},
			set: function(val){
				var elem = this;
				var type = getType(elem);
				if(typeModels[type] && typeModels[type].numberToString){
					//is NaN a number?
					if(isNaN(val)){
						$.prop(elem, 'value', '');
						return;
					}
					var set = typeModels[type].numberToString(val);
					if(set !==  false){
						$.prop(elem, 'value', set);
					} else {
						webshims.error('INVALID_STATE_ERR: DOM Exception 11');
					}
				} else {
					valueAsNumberDescriptor.prop._supset && valueAsNumberDescriptor.prop._supset.apply(elem, arguments);
				}
			}
		}
	});
	
	var valueAsDateDescriptor = webshims.defineNodeNameProperty('input', 'valueAsDate', {
		prop: {
			get: function(){
				var elem = this;
				var type = getType(elem);
				return (typeModels[type] && typeModels[type].asDate && !typeModels[type].noAsDate) ? 
					typeModels[type].asDate($.prop(elem, 'value')) :
					valueAsDateDescriptor.prop._supget && valueAsDateDescriptor.prop._supget.call(elem) || null;
			},
			set: function(value){
				var elem = this;
				var type = getType(elem);
				if(typeModels[type] && typeModels[type].dateToString && !typeModels[type].noAsDate){
					
					if(value === null){
						$.prop(elem, 'value', '');
						return '';
					}
					var set = typeModels[type].dateToString(value);
					if(set !== false){
						$.prop(elem, 'value', set);
						return set;
					} else {
						webshims.error('INVALID_STATE_ERR: DOM Exception 11');
					}
				} else {
					return valueAsDateDescriptor.prop._supset && valueAsDateDescriptor.prop._supset.apply(elem, arguments) || null;
				}
			}
		}
	});
	
	$.each({stepUp: 1, stepDown: -1}, function(name, stepFactor){
		var stepDescriptor = webshims.defineNodeNameProperty('input', name, {
			prop: {
				value: function(factor){
					var step, val, dateVal, valModStep, alignValue, cache;
					var type = getType(this);
					if(typeModels[type] && typeModels[type].asNumber){
						cache = {type: type};
						if(!factor){
							factor = 1;
							webshims.info("you should always use a factor for stepUp/stepDown");
						}
						factor *= stepFactor;
						
						val = $.prop(this, 'valueAsNumber');
						
						if(isNaN(val)){
							webshims.info("valueAsNumber is NaN can't apply stepUp/stepDown ");
							throw('invalid state error');
						}
						
						step = webshims.getStep(this, type);
						
						if(step == 'any'){
							webshims.info("step is 'any' can't apply stepUp/stepDown");
							throw('invalid state error');
						}
						
						webshims.addMinMaxNumberToCache('min', $(this), cache);
						webshims.addMinMaxNumberToCache('max', $(this), cache);
						
						step *= factor;
						
						val = (val + step).toFixed(5) * 1;
						valModStep = (val - (cache.minAsNumber || 0)) % step;
						
						if ( valModStep && (Math.abs(valModStep) > EPS) ) {
							alignValue = val - valModStep;
							alignValue += ( valModStep > 0 ) ? step : ( -step );
							val = alignValue.toFixed(5) * 1;
						}
						
						if( (!isNaN(cache.maxAsNumber) && val > cache.maxAsNumber) || (!isNaN(cache.minAsNumber) && val < cache.minAsNumber) ){
							webshims.info("max/min overflow can't apply stepUp/stepDown");
							throw('invalid state error');
						}
						if(dateVal){
							$.prop(this, 'valueAsDate', dateVal);
						} else {
							$.prop(this, 'valueAsNumber', val);
						}
					} else if(stepDescriptor.prop && stepDescriptor.prop.value){
						return stepDescriptor.prop.value.apply(this, arguments);
					} else {
						webshims.info("no step method for type: "+ type);
						throw('invalid state error');
					}
				}
			}
		});
	});
	
	
	var typeProtos = {
		
		number: {
			mismatch: function(val){
				return !(isNumber(val));
			},
			step: 1,
			//stepBase: 0, 0 = default
			stepScaleFactor: 1,
			asNumber: function(str){
				return (isNumber(str)) ? str * 1 : nan;
			},
			numberToString: function(num){
				return (isNumber(num)) ? num : false;
			}
		},
		
		range: {
			minDefault: 0,
			maxDefault: 100
		},
		color: {
			mismatch: (function(){
				var cReg = /^\u0023[a-f0-9]{6}$/;
				return function(val){
					return (!val || val.length != 7 || !(cReg.test(val)));
				};
			})()
		},
		date: {
			mismatch: function(val){
				if(!val || !val.split || !(/\d$/.test(val))){return true;}
				var i;
				var valA = val.split(/\u002D/);
				if(valA.length !== 3){return true;}
				var ret = false;
				
				
				if(valA[0].length < 4 || valA[1].length != 2 || valA[1] > 12 || valA[2].length != 2 || valA[2] > 33){
					ret = true;
				} else {
					for(i = 0; i < 3; i++){
						if(!isDateTimePart(valA[i])){
							ret = true;
							break;
						}
					}
				}
				
				return ret || (val !== this.dateToString( this.asDate(val, true) ) );
			},
			step: 1,
			//stepBase: 0, 0 = default
			stepScaleFactor:  86400000,
			asDate: function(val, _noMismatch){
				if(!_noMismatch && this.mismatch(val)){
					return null;
				}
				return new Date(this.asNumber(val, true));
			},
			asNumber: function(str, _noMismatch){
				var ret = nan;
				if(_noMismatch || !this.mismatch(str)){
					str = str.split(/\u002D/);
					ret = Date.UTC(str[0], str[1] - 1, str[2]);
				}
				return ret;
			},
			numberToString: function(num){
				return (isNumber(num)) ? this.dateToString(new Date( num * 1)) : false;
			},
			dateToString: function(date){
				return (date && date.getFullYear) ? addleadingZero(date.getUTCFullYear(), 4) +'-'+ addleadingZero(date.getUTCMonth()+1, 2) +'-'+ addleadingZero(date.getUTCDate(), 2) : false;
			}
		},
		time: {
			mismatch: function(val, _getParsed){
				if(!val || !val.split || !(/\d$/.test(val))){return true;}
				val = val.split(/\u003A/);
				if(val.length < 2 || val.length > 3){return true;}
				var ret = false,
					sFraction;
				if(val[2]){
					val[2] = val[2].split(/\u002E/);
					sFraction = parseInt(val[2][1], 10);
					val[2] = val[2][0];
				}
				$.each(val, function(i, part){
					if(!isDateTimePart(part) || part.length !== 2){
						ret = true;
						return false;
					}
				});
				if(ret){return true;}
				if(val[0] > 23 || val[0] < 0 || val[1] > 59 || val[1] < 0){
					return true;
				}
				if(val[2] && (val[2] > 59 || val[2] < 0 )){
					return true;
				}
				if(sFraction && isNaN(sFraction)){
					return true;
				}
				if(sFraction){
					if(sFraction < 100){
						sFraction *= 100;
					} else if(sFraction < 10){
						sFraction *= 10;
					}
				}
				return (_getParsed === true) ? [val, sFraction] : false;
			},
			step: 60,
			stepBase: 0,
			stepScaleFactor:  1000,
			asDate: function(val){
				val = new Date(this.asNumber(val));
				return (isNaN(val)) ? null : val;
			},
			asNumber: function(val){
				var ret = nan;
				val = this.mismatch(val, true);
				if(val !== true){
					ret = Date.UTC('1970', 0, 1, val[0][0], val[0][1], val[0][2] || 0);
					if(val[1]){
						ret += val[1];
					}
				}
				return ret;
			},
			dateToString: function(date){
				if(date && date.getUTCHours){
					var str = addleadingZero(date.getUTCHours(), 2) +':'+ addleadingZero(date.getUTCMinutes(), 2),
						tmp = date.getSeconds()
					;
					if(tmp != "0"){
						str += ':'+ addleadingZero(tmp, 2);
					}
					tmp = date.getUTCMilliseconds();
					if(tmp != "0"){
						str += '.'+ addleadingZero(tmp, 3);
					}
					return str;
				} else {
					return false;
				}
			}
		},
		month: {
			mismatch: function(val){
				return typeProtos.date.mismatch(val+'-01');
			},
			step: 1,
			stepScaleFactor:  false,
			//stepBase: 0, 0 = default
			asDate: function(val){
				return new Date(typeProtos.date.asNumber(val+'-01'));
			},
			asNumber: function(val){
				//1970-01
				var ret = nan;
				if(val && !this.mismatch(val)){
					val = val.split(/\u002D/);
					val[0] = (val[0] * 1) - 1970;
					val[1] = (val[1] * 1) - 1;
					ret = (val[0] * 12) + val[1];
				}
				return ret;
			},
			numberToString: function(num){
				var mod;
				var ret = false;
				if(isNumber(num)){
					mod = (num % 12);
					num = ((num - mod) / 12) + 1970;
					mod += 1;
					if(mod < 1){
						num -= 1;
						mod += 12;
					}
					ret = addleadingZero(num, 4)+'-'+addleadingZero(mod, 2);
					
				}
				
				return ret;
			},
			dateToString: function(date){
				if(date && date.getUTCHours){
					var str = typeProtos.date.dateToString(date);
					return (str.split && (str = str.split(/\u002D/))) ? str[0]+'-'+str[1] : false;
				} else {
					return false;
				}
			}
		}
//		,'datetime-local': {
//			mismatch: function(val, _getParsed){
//				if(!val || !val.split || (val+'special').split(/\u0054/).length !== 2){return true;}
//				val = val.split(/\u0054/);
//				return ( typeProtos.date.mismatch(val[0]) || typeProtos.time.mismatch(val[1], _getParsed) );
//			},
//			noAsDate: true,
//			asDate: function(val){
//				val = new Date(this.asNumber(val));
//				
//				return (isNaN(val)) ? null : val;
//			},
//			asNumber: function(val){
//				var ret = nan;
//				var time = this.mismatch(val, true);
//				if(time !== true){
//					val = val.split(/\u0054/)[0].split(/\u002D/);
//					
//					ret = Date.UTC(val[0], val[1] - 1, val[2], time[0][0], time[0][1], time[0][2] || 0);
//					if(time[1]){
//						ret += time[1];
//					}
//				}
//				return ret;
//			},
//			dateToString: function(date, _getParsed){
//				return typeProtos.date.dateToString(date) +'T'+ typeProtos.time.dateToString(date, _getParsed);
//			}
//		}
	};
	
	if(typeBugs || !supportsType('range') || !supportsType('time') || !supportsType('month')){
		typeProtos.range = $.extend({}, typeProtos.number, typeProtos.range);
		typeProtos.time = $.extend({}, typeProtos.date, typeProtos.time);
		typeProtos.month = $.extend({}, typeProtos.date, typeProtos.month);
//		typeProtos['datetime-local'] = $.extend({}, typeProtos.date, typeProtos.time, typeProtos['datetime-local']);
	}
	
	
	
	//'datetime-local'
	['number', 'month', 'range', 'date', 'time', 'color'].forEach(function(type){
		if(typeBugs || !supportsType(type)){
			webshims.addInputType(type, typeProtos[type]);
		}
	});
	
	if($('<input />').prop('labels') == null){
		webshims.defineNodeNamesProperty('button, input, keygen, meter, output, progress, select, textarea', 'labels', {
			prop: {
				get: function(){
					if(this.type == 'hidden'){return null;}
					var id = this.id;
					var labels = $(this)
						.closest('label')
						.filter(function(){
							var hFor = (this.attributes['for'] || {});
							return (!hFor.specified || hFor.value == id);
						})
					;
					
					if(id) {
						labels = labels.add('label[for="'+ id +'"]');
					}
					return labels.get();
				},
				writeable: false
			}
		});
	}
	
});
(function($){
	
	var id = 0;
	var isNumber = function(string){
		return (typeof string == 'number' || (string && string == string * 1));
	};
	var retDefault = function(val, def){
		if(!(typeof val == 'number' || (val && val == val * 1))){
			return def;
		}
		return val * 1;
	};
	var createOpts = ['step', 'min', 'max', 'readonly', 'title', 'disabled', 'tabindex'];
	var rangeProto = {
		_create: function(){
			var i;
			
			
			this.element.addClass('ws-range').attr({role: 'slider'}).append('<span class="ws-range-min" /><span class="ws-range-rail"><span class="ws-range-thumb" /></span>');
			this.trail = $('.ws-range-rail', this.element);
			this.range = $('.ws-range-min', this.element);
			this.thumb = $('.ws-range-thumb', this.trail);
			
			this.updateMetrics();
			
			this.orig = this.options.orig;
			
			for(i = 0; i < createOpts.length; i++){
				this[createOpts[i]](this.options[createOpts[i]]);
			}
			this.value = this._value;
			this.value(this.options.value);
			this.initDataList();
			this.element.data('rangeUi', this);
			this.addBindings();
			this._init = true;
		},
		value: $.noop,
		_value: function(val, _noNormalize, animate){
			var left, posDif;
			var o = this.options;
			var oVal = val;
			var thumbStyle = {};
			var rangeStyle = {};
			
			if(!_noNormalize && parseFloat(val, 10) != val){
				val = o.min + ((o.max - o.min) / 2);
			}
			
			if(!_noNormalize){
				val = this.normalizeVal(val);
			}
			left =  100 * ((val - o.min) / (o.max - o.min));
			
			if(this._init && val == o.value && oVal == val){return;}
			this.options.value = val;
			this.thumb.stop();
			this.range.stop();
			
			rangeStyle[this.dirs.width] = left+'%';
			if(this.vertical){
				left = Math.abs(left - 100);
			}
			thumbStyle[this.dirs.left] = left+'%';
			
			
			if(!animate){
				this.thumb.css(thumbStyle);
				this.range.css(rangeStyle);
			} else {
				if(typeof animate != 'object'){
					animate = {};
				} else {
					animate = $.extend({}, animate);
				}
				if(!animate.duration){
					posDif = Math.abs(left - parseInt(this.thumb[0].style[this.dirs.left] || 50, 10));
					animate.duration = Math.max(Math.min(999, posDif * 5), 99);
				}
				this.thumb.animate(thumbStyle, animate);
				this.range.animate(rangeStyle, animate);
			}
			if(this.orig && (oVal != val || (!this._init && this.orig.value != val)) ){
				this.options._change(val);
			}
			this.element.attr({
				'aria-valuenow': this.options.value,
				'aria-valuetext': this.options.textValue ? this.options.textValue(this.options.value) : this.options.options[this.options.value] || this.options.value
			});
		},
		initDataList: function(){
			if(this.orig){
				var listTimer;
				var that = this;
				var updateList = function(){
					$(that.orig)
						.jProp('list')
						.off('updateDatalist', updateList)
						.on('updateDatalist', updateList)
					;
					clearTimeout(listTimer);
					listTimer = setTimeout(function(){
						if(that.list){
							that.list();
						}
					}, 9);
					
				};
				
				$(this.orig).on('listdatalistchange', updateList);
				this.list();
			}
		},
		list: function(opts){
			var o = this.options;
			var min = o.min;
			var max = o.max;
			var trail = this.trail;
			var that = this;
			
			this.element.attr({'aria-valuetext': o.options[o.value] || o.value});
			$('.ws-range-ticks', trail).remove();
			
			
			$(this.orig).jProp('list').find('option:not([disabled])').each(function(){
				o.options[$.prop(this, 'value')] = $.prop(this, 'label') || '';
			});
			
			$.each(o.options, function(val, label){
				if(!isNumber(val) || val < min || val > max){return;}
				var left = 100 * ((val - min) / (max - min));
				var title = o.showLabels && label ? ' title="'+ label +'"' : '';
				if(that.vertical){
					left = Math.abs(left - 100);
				}
				
				that.posCenter(
					$('<span class="ws-range-ticks"'+ title +' data-label="'+label+'" style="'+(that.dirs.left)+': '+left+'%;" />').appendTo(trail)
				);
			});
		},
		readonly: function(val){
			val = !!val;
			this.options.readonly = val;
			this.element.attr('aria-readonly', ''+val);
			if(this._init){
				this.updateMetrics();
			}
		},
		disabled: function(val){
			val = !!val;
			this.options.disabled = val;
			if(val){
				this.element.attr({tabindex: -1, 'aria-disabled': 'true'});
			} else {
				this.element.attr({tabindex: this.options.tabindex, 'aria-disabled': 'false'});
			}
			if(this._init){
				this.updateMetrics();
			}
		},
		tabindex: function(val){
			this.options.tabindex = val;
			if(!this.options.disabled){
				this.element.attr({tabindex: val});
			}
		},
		title: function(val){
			this.element.prop('title', val);
		},
		min: function(val){
			this.options.min = retDefault(val, 0);
			this.value(this.options.value, true);
		},
		max: function(val){
			this.options.max = retDefault(val, 100);
			this.value(this.options.value, true);
		},
		step: function(val){
			this.options.step = val == 'any' ? 'any' : retDefault(val, 1);
			this.value(this.options.value);
		},
		
		normalizeVal: function(val){
			var valModStep, alignValue, step;
			var o = this.options;
			
			if(val <= o.min){
				val = o.min;
			} else if(val >= o.max) {
				val = o.max;
			} else if(o.step != 'any'){
				step = o.step;
				valModStep = (val - o.min) % step;
				alignValue = val - valModStep;
				
				if ( Math.abs(valModStep) * 2 >= step ) {
					alignValue += ( valModStep > 0 ) ? step : ( -step );
				}
				val = alignValue.toFixed(5) * 1;
			}
			return val;
		},
		doStep: function(factor, animate){
			var step = retDefault(this.options.step, 1);
			if(this.options.step == 'any'){
				step = Math.min(step, (this.options.max - this.options.min) / 10);
			}
			this.value( this.options.value + (step * factor), false, animate );
			
		},
		 
		getStepedValueFromPos: function(pos){
			var val, valModStep, alignValue, step;
			
			if(pos <= 0){
				val = this.options[this.dirs.min];
			} else if(pos > 100) {
				val = this.options[this.dirs.max];
			} else {
				if(this.vertical){
					pos = Math.abs(pos - 100);
				}
				val = ((this.options.max - this.options.min) * (pos / 100)) + this.options.min;
				step = this.options.step;
				if(step != 'any'){
					valModStep = (val - this.options.min) % step;
					alignValue = val - valModStep;
					
					if ( Math.abs(valModStep) * 2 >= step ) {
						alignValue += ( valModStep > 0 ) ? step : ( -step );
					}
					val = ((alignValue).toFixed(5)) * 1;
					
				}
			}
			
			return val;
		},
		addRemoveClass: function(cName, add){
			var isIn = this.element.prop('className').indexOf(cName) != -1;
			var action;
			if(!add && isIn){
				action = 'removeClass';
				this.element.removeClass(cName);
				this.updateMetrics();
			} else if(add && !isIn){
				action = 'addClass';
				
			}
			if(action){
				this.element[action](cName);
				if(this._init){
					this.updateMetrics();
				}
			}
		},
		addBindings: function(){
			var leftOffset, widgetUnits, hasFocus;
			var that = this;
			var o = this.options;
			
			var eventTimer = (function(){
				var events = {};
				return {
					init: function(name, curVal, fn){
						if(!events[name]){
							events[name] = {fn: fn};
							if(that.orig){
								$(that.orig).on(name, function(){
									events[name].val = $.prop(that.orig, 'value');
								});
							}
							
						}
						events[name].val = curVal;
					},
					call: function(name, val){
						if(events[name].val != val){
							clearTimeout(events[name].timer);
							events[name].val = val;
							events[name].timer = setTimeout(function(){
								events[name].fn(val, that);
							}, 0);
						}
					}
				};
			})();
			
			var setValueFromPos = function(e, animate){
				
				var val = that.getStepedValueFromPos((e[that.dirs.mouse] - leftOffset) * widgetUnits);
				if(val != o.value){
					that.value(val, false, animate);
					eventTimer.call('input', val);
				}
				if(e && e.type == 'mousemove'){
					e.preventDefault();
				}
			};
			var remove = function(e){
				if(e && e.type == 'mouseup'){
					eventTimer.call('input', o.value);
					eventTimer.call('change', o.value);
				}
				that.addRemoveClass('ws-active');
				$(document).off('mousemove', setValueFromPos).off('mouseup', remove);
				$(window).off('blur', removeWin);
			};
			var removeWin = function(e){
				if(e.target == window){remove();}
			};
			var add = function(e){
				var outerWidth;
				e.preventDefault();
				$(document).off('mousemove', setValueFromPos).off('mouseup', remove);
				$(window).off('blur', removeWin);
				if(!o.readonly && !o.disabled){
					that.element.focus();
					that.addRemoveClass('ws-active', true);
					leftOffset = that.element.focus().offset();
					widgetUnits = that.element[that.dirs.innerWidth]();
					if(!widgetUnits || !leftOffset){return;}
					outerWidth = that.thumb[that.dirs.outerWidth]();
					leftOffset = leftOffset[that.dirs.pos];
					widgetUnits = 100 / widgetUnits;
					setValueFromPos(e, o.animate);
					$(document)
						.on({
							mouseup: remove,
							mousemove: setValueFromPos
						})
					;
					$(window).on('blur', removeWin);
					e.stopPropagation();
				}
			};
			var elementEvts = {
				mousedown: add,
				focus: function(e){
					if(!o.disabled){
						eventTimer.init('input', o.value);
						eventTimer.init('change', o.value);
						that.addRemoveClass('ws-focus', true);
						that.updateMetrics();
					}
					hasFocus = true;
				},
				blur: function(e){
					that.element.removeClass('ws-focus ws-active');
					that.updateMetrics();
					hasFocus = false;
					eventTimer.init('input', o.value);
					eventTimer.call('change', o.value);
				},
				keyup: function(){
					that.addRemoveClass('ws-active');
					eventTimer.call('input', o.value);
					eventTimer.call('change', o.value);
				},
				
				keydown: function(e){
					var step = true;
					var code = e.keyCode;
					if(!o.readonly && !o.disabled){
						if (code == 39 || code == 38) {
							that.doStep(1);
						} else if (code == 37 || code == 40) {
							that.doStep(-1);
						} else if (code == 33) {
							that.doStep(10, o.animate);
						} else if (code == 34) {
							that.doStep(-10, o.animate);
						} else if (code == 36) {
							that.value(that.options.max, false, o.animate);
						} else if (code == 35) {
							that.value(that.options.min, false, o.animate);
						} else {
							step = false;
						}
						if (step) {
							that.addRemoveClass('ws-active', true);
							eventTimer.call('input', o.value);
							e.preventDefault();
						}
					}
				}
			};
			
			eventTimer.init('input', o.value, this.options.input);
			eventTimer.init('change', o.value, this.options.change);
			
			elementEvts[$.fn.mwheelIntent ? 'mwheelIntent' : 'mousewheel'] = function(e, delta){
				if(delta && hasFocus && !o.readonly && !o.disabled){
					that.doStep(delta);
					e.preventDefault();
					eventTimer.call('input', o.value);
				}
			};
			this.element.on(elementEvts);
			this.thumb.on({
				mousedown: add
			});
			$(function(){
				if(window.webshims){
					webshims.ready('dom-support', function(){
						if($.fn.onWSOff){
							that.element.onWSOff('updateshadowdom', function(){
								that.updateMetrics();
							});
						}
					});
					if(!$.fn.onWSOff && webshims._polyfill){
						webshims._polyfill(['dom-support']);
					}
				}
			});
		},
		posCenter: function(elem, outerWidth){
			var temp;
			if(this.options.calcCenter && (!this._init || this.element[0].offsetWidth)){
				if(!elem){
					elem = this.thumb;
				}
				if(!outerWidth){
					outerWidth = elem[this.dirs.outerWidth]();
				}
				outerWidth = outerWidth / -2;
				elem.css(this.dirs.marginLeft, outerWidth);
				
				if(this.options.calcTrail && elem[0] == this.thumb[0]){
					temp = this.element[this.dirs.innerHeight]();
					elem.css(this.dirs.marginTop, (elem[this.dirs.outerHeight]() - temp) / -2);
					this.range.css(this.dirs.marginTop, (this.range[this.dirs.outerHeight]() - temp) / -2 );
					outerWidth *= -1;
					this.trail
						.css(this.dirs.left, outerWidth)
						.css(this.dirs.right, outerWidth)
					;
				}
			}
		},
		updateMetrics: function(){
			var width = this.element.innerWidth();
			this.vertical = (width && this.element.innerHeight() - width  > 10);
			
			this.dirs = this.vertical ? 
				{mouse: 'pageY', pos: 'top', min: 'max', max: 'min', left: 'top', right: 'bottom', width: 'height', innerWidth: 'innerHeight', innerHeight: 'innerWidth', outerWidth: 'outerHeight', outerHeight: 'outerWidth', marginTop: 'marginLeft', marginLeft: 'marginTop'} :
				{mouse: 'pageX', pos: 'left', min: 'min', max: 'max', left: 'left', right: 'right', width: 'width', innerWidth: 'innerWidth', innerHeight: 'innerHeight', outerWidth: 'outerWidth', outerHeight: 'outerHeight', marginTop: 'marginTop', marginLeft: 'marginLeft'}
			;
			this.element
				[this.vertical ? 'addClass' : 'removeClass']('vertical-range')
				[this.vertical ? 'addClass' : 'removeClass']('horizontal-range')
			;
			this.posCenter();
		}
	};
	
	var oCreate = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
	
	$.fn.rangeUI = function(opts){
		opts = $.extend({
			readonly: false, 
			disabled: false, 
			tabindex: 0, 
			min: 0, 
			step: 1, 
			max: 100, 
			value: 50, 
			input: $.noop, 
			change: $.noop, 
			_change: $.noop, 
			showLabels: true, 
			options: {},
			calcCenter: true,
			calcTrail: true
		}, opts);
		return this.each(function(){
			var obj = $.extend(oCreate(rangeProto), {element: $(this)});
			obj.options = opts;
			obj._create.call(obj);
		});
	};
	if(window.webshims && webshims.isReady){
		webshims.ready('es5', function(){
			webshims.isReady('range-ui', true);
		});
		if(webshims._polyfill){
			 webshims._polyfill(['es5']);
		}
	}
})(jQuery);
webshims.register('form-number-date-ui', function($, webshims, window, document, undefined, options){
	"use strict";
	var curCfg;
	var formcfg = webshims.formcfg;
	
	var stopPropagation = function(e){
		e.stopImmediatePropagation(e);
	};
	var createFormat = function(name){
		if(!curCfg.patterns[name+'Obj']){
			var obj = {};
			$.each(curCfg.patterns[name].split(curCfg[name+'Format']), function(i, name){
				obj[name] = i;
			});
			curCfg.patterns[name+'Obj'] = obj;
		}
	};
	var splitInputs = {
		date: {
			_create: function(){
				var obj = {
					splits: [$('<input type="text" class="yy" size="4" inputmode="numeric" />')[0], $('<input type="text" class="mm" inputmode="numeric" maxlength="2" size="2" />')[0], $('<input type="text" class="dd ws-spin" inputmode="numeric" maxlength="2" size="2" />')[0]] 
				};
				obj.elements = [obj.splits[0], $('<span class="ws-input-seperator" />')[0], obj.splits[1], $('<span class="ws-input-seperator" />')[0], obj.splits[2]];
				return obj;
			},
			sort: function(element){
				createFormat('d');
				var i = 0;
				var seperators = $('.ws-input-seperator', element).html(curCfg.dFormat);
				var inputs = $('input', element);
				$.each(curCfg.patterns.dObj, function(name, value){
					var input = inputs.filter('.'+ name);
					if(input[0]){
						
						input.appendTo(element);
						if(i < seperators.length){
							seperators.eq(i).insertAfter(input);
						}
						i++;
					}
				});
			}
		},
		month: {
			_create: function(){
				var obj = {
					splits: [$('<input type="text" class="yy" inputmode="numeric" size="4" />')[0], $('<input type="text" class="mm ws-spin" />')[0]] 
				};
				obj.elements = [obj.splits[0], $('<span class="ws-input-seperator" />')[0], obj.splits[1]];
				return obj;
			},
			sort: function(element){
				var seperator = $('.ws-input-seperator', element).html(curCfg.dFormat);
				var mm = $('input.mm', element);
				var action;
				if(curCfg.date.showMonthAfterYear){
					mm.appendTo(element);
					action = 'insertBefore';
				} else {
					mm.prependTo(element);
					action = 'insertAfter';
				}
				seperator[action](mm);
			}
		}
	};
	
	var steps = {
		number: {
			step: 1
		},
		time: {
			step: 60
		},
		month: {
			step: 1,
			start: new Date()
		},
		date: {
			step: 1,
			start: new Date()
		}
	};
	var labelWidth = (function(){
		var getId = function(){
			return webshims.getID(this);
		};
		return function(element, labels, noFocus){
			$(element).attr({'aria-labelledby': labels.map(getId).get().join(' ')});
			if(!noFocus){
				labels.on('click', function(e){
					element.getShadowFocusElement().focus();
					e.preventDefault();
					return false;
				});
			}
		};
	})();
	var addZero = function(val){
		if(!val){return "";}
		val = val+'';
		return val.length == 1 ? '0'+val : val;
	};
	
		
	(function(){
		var monthDigits = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
		
		formcfg.de = $.extend(true, {
			numberFormat: {
				",": ".",
				".": ","
			},
			timeSigns: ":. ",
			numberSigns: ',',
			dateSigns: '.',
			dFormat: ".",
			patterns: {
				d: "dd.mm.yy"
			},
			month:  {
				currentText: 'Aktueller Monat'
			},
			date: {
				close: 'schließen',
				clear: 'Löschen',
				prevText: 'Zurück',
				nextText: 'Vor',
				currentText: 'Heute',
				monthNames: ['Januar','Februar','März','April','Mai','Juni',
				'Juli','August','September','Oktober','November','Dezember'],
				monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
				'Jul','Aug','Sep','Okt','Nov','Dez'],
				dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
				dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				weekHeader: 'KW',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''
			}
		}, formcfg.de || {});
		
		formcfg.en = $.extend(true, {
			numberFormat: {
				".": ".",
				",": ","
			},
			numberSigns: '.',
			dateSigns: '/',
			timeSigns: ":. ",
			dFormat: "/",
			patterns: {
				d: "mm/dd/yy"
			},
			month:  {
				currentText: 'This month'
			},
			date: {
				"closeText": "Done",
				clear: 'Clear',
				"prevText": "Prev",
				"nextText": "Next",
				"currentText": "Today",
				"monthNames": ["January","February","March","April","May","June","July","August","September","October","November","December"],
				"monthNamesShort": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				"dayNames": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				"dayNamesShort": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
				"dayNamesMin": ["Su","Mo","Tu","We","Th","Fr","Sa"],
				"weekHeader": "Wk",
				"firstDay": 0,
				"isRTL": false,
				"showMonthAfterYear": false,
				"yearSuffix": ""
			}
		}, formcfg.en || {});
		
		if(!formcfg['en-US']){
			formcfg['en-US'] = formcfg['en'];
		}
		if(!formcfg['en-GB']){
			formcfg['en-GB'] = $.extend(true, {}, formcfg.en, {
				date: {firstDay: 1}, 
				patterns: {d: "dd/mm/yy"}
			});
		}
		if(!formcfg['']){
			formcfg[''] = formcfg['en-US'];
		}
		
		curCfg = formcfg[''];
		
		var processLangCFG = function(langCfg){
			if(!langCfg.date.monthkeys){
				var create = function(i, name){
					var strNum;
					var num = i + 1;
					strNum = (num < 10) ? '0'+num : ''+num;
					langCfg.date.monthkeys[num] = strNum;
					langCfg.date.monthkeys[name] = strNum;
					langCfg.date.monthkeys[name.toLowerCase()] = strNum;
				};
				langCfg.date.monthkeys = {};
				langCfg.date.monthDigits = monthDigits;
				langCfg.numberSigns += '-';
				$.each(langCfg.date.monthNames, create);
				$.each(langCfg.date.monthNamesShort, create);
			}
			if(!langCfg.colorSigns){
				langCfg.colorSigns = '#abcdefABCDEF';
			}
		};
		var triggerLocaleChange = function(){
			processLangCFG(curCfg);
			$(document).triggerHandler('wslocalechange');
		};
		
		triggerLocaleChange();
		
		webshims.activeLang({
			register: 'form-core',
			callback: function(){
				$.each(arguments, function(i, val){
					if(formcfg[val]){
						if(formcfg[val] != curCfg){
							curCfg = formcfg[val];
							triggerLocaleChange();
						}
						return false;
					}
				});
			}
		});
		webshims.activeLang({
			langObj: formcfg, 
			module: 'form-core',
			callback: function(val){
				if(curCfg != val){
					curCfg = val;
					triggerLocaleChange();
				}
			}
		});
	})();
		
	
	
	(function(){
		
		
		var mousePress = function(e){
			$(this)[e.type == 'mousepressstart' ? 'addClass' : 'removeClass']('mousepress-ui');
		};
		
		var retDefault = function(val, def){
			if(!(typeof val == 'number' || (val && val == val * 1))){
				return def;
			}
			return val * 1;
		};
		
		
		var formatVal = {
			number: function(val){
				return (val+'').replace(/\,/g, '').replace(/\./, curCfg.numberFormat['.']);
			},
			time: function(val){
				return val;
			},
			//todo empty val for month/split
			month: function(val, options){
				var names;
				var p = val.split('-');
				if(p[0] && p[1]){
					names = curCfg.date[options.formatMonthNames] || curCfg.date[options.monthNames] || curCfg.date.monthNames;
					p[1] = names[(p[1] * 1) - 1];
					if(options && options.splitInput){
						val = [p[0] || '', p[1] || ''];
					} else if(p[1]){
						val = curCfg.date.showMonthAfterYear ? p.join(' ') : p[1]+' '+p[0];
					}
				}
				return val;
			},
			date: function(val, opts){
				var p = (val+'').split('-');
				if(p[2] && p[1] && p[0]){
					if(opts && opts.splitInput){
						val = p;
					} else {
						val = curCfg.patterns.d.replace('yy', p[0] || '');
						val = val.replace('mm', p[1] || '');
						val = val.replace('dd', p[2] || '');
					}
				} else if(opts && opts.splitInput){
					val = [p[0] || '', p[1] || '', p[2] || ''];
				}
				
				return val;
			},
			color: function(val, opts){
				var ret = '#000000';
				if(val){
					val = val.toLowerCase();
					if(val.length == 7 && createHelper('color').isValid(val)) {
						ret = val;
					}
				}
				return ret;
			}
		};
		
		var parseVal = {
			number: function(val){
				return (val+'').replace(curCfg.numberFormat[','], '').replace(curCfg.numberFormat['.'], '.');
			},
			time: function(val){
				return val;
			},
			month: function(val, opts){
				
				var p = (!opts.splitInput) ? val.trim().split(/[\.\s-\/\\]+/) : val;
				
				if(p.length == 2 && p[0] && p[1]){
					p[0] = curCfg.date.monthkeys[p[0]] || p[0];
					p[1] = curCfg.date.monthkeys[p[1]] || p[1];
					if(p[1].length == 2){
						val = p[0]+'-'+p[1];
					} else if(p[0].length == 2){
						val = p[1]+'-'+p[0];
					} else {
						val = '';
					}
				} else if(opts.splitInput) {
					val = '';
				}
				return val;
			},
			date: function(val, opts){
				createFormat('d');
				var i;
				var obj;
				if(opts.splitInput){
					obj = {yy: 0, mm: 1, dd: 2};
				} else {
					obj = curCfg.patterns.dObj;
					val = val.split(curCfg.dFormat);
				}
				
				return (val.length == 3 && val[0] && val[1] && val[2]) ? 
					([addZero(val[obj.yy]), addZero(val[obj.mm]), addZero(val[obj.dd])]).join('-') : 
					''
				;
			},
			color: function(val, opts){
				var ret = '#000000';
				if(val){
					val = val.toLowerCase();
					if (val.indexOf('#') !== 0) {
						val = '#' + val;
					}
					if(val.length == 4){
						val = '#' + val.charAt(1) + val.charAt(1) + val.charAt(2) + val.charAt(2) + val.charAt(3) + val.charAt(3);
					}
					if(val.length == 7 && createHelper('color').isValid(val)) {
						ret = val;
					}
				}
				return ret;
			}
		};
		
		var placeholderFormat = {
			date: function(val, opts){
				var hintValue = (val || '').split('-');
				if(hintValue.length == 3){
					hintValue = opts.splitInput ? 
						hintValue : 
						curCfg.patterns.d.replace('yy', hintValue[0]).replace('mm', hintValue[1]).replace('dd', hintValue[2]);
				} else {
					hintValue = opts.splitInput ?
						[val, val, val] :
						val;
				}
				return hintValue;
			},
			month: function(val, opts){
				var hintValue = (val || '').split('-');
				
				if(hintValue.length == 2){
					hintValue = opts.splitInput ? 
						hintValue : 
						curCfg.patterns.d.replace('yy', hintValue[0]).replace('mm', hintValue[1]);
				} else {
					hintValue = opts.splitInput ?
						[val, val] :
						val;
				}
				return hintValue;
			}
		};
		
		var createHelper = (function(){
			var types = {};
			return function(type){
				var input;
				if(!types[type]){
					input = $('<input type="'+type+'" />');
					types[type] = {
						asNumber: function(val){
							var type = (typeof val == 'object') ? 'valueAsDate' : 'value';
							return input.prop(type, val).prop('valueAsNumber');
						},
						asValue: function(val){
							var type = (typeof val == 'object') ? 'valueAsDate' : 'valueAsNumber';
							return input.prop(type, val).prop('value');
						},
						isValid: function(val){
							return input.prop('value', val).is(':valid') && input.prop('value') == val;
						}
					};
				}
				return types[type];
			};
		})();
		
		steps.range = steps.number;
		
		var wsWidgetProto = {
			_create: function(){
				var i, that, timedMirror;
				var o = this.options;
				var createOpts = this.createOpts;
				
				this.type = o.type;
				this.orig = o.orig;
				
				this.buttonWrapper = $('<span class="input-buttons '+this.type+'-input-buttons"></span>').insertAfter(this.element);
				this.options.containerElements.push(this.buttonWrapper[0]);
				
				o.mirrorValidity = o.mirrorValidity && this.orig && Modernizr.formvalidation && !webshims.bugs.bustedValidity;
				
				if(o.splitInput && this._addSplitInputs){
					this._addSplitInputs();
				} else {
					this.inputElements = this.element;
				}
				
				if( steps[this.type] && typeof steps[this.type].start == 'object'){
					steps[this.type].start = this.asNumber(steps[this.type].start);
				}
				
				for(i = 0; i < createOpts.length; i++){
					if(o[createOpts[i]] != null){
						this[createOpts[i]](o[createOpts[i]], o[createOpts[i]]);
					}
				}
				if(this.type == 'color'){
					this.inputElements.prop('maxLength', 7);
				}
				this.addBindings();
				$(this.element).data('wsWidget'+o.type, this);
				
				this._init = true;
				
				if(o.mirrorValidity){
					that = this;
					timedMirror = function(){
						clearTimeout(timedMirror._timerDealy);
						timedMirror._timerDealy = setTimeout(timedMirror._wsexec, 9);
					};
					timedMirror._wsexec = function(){
						clearTimeout(timedMirror._timerDealy);
						that.mirrorValidity(true);
					};
					
					timedMirror();
					$(this.orig).on('change input', function(e){
						if(e.type == 'input'){
							timedMirror();
						} else {
							timedMirror._wsexec();
						}
					});
				}
			},
			mirrorValidity: function(_noTest){
				//
				if(this._init && this.options.mirrorValidity){
					if(!_noTest){
						$.prop(this.orig, 'validity');
					}
					var message = $(this.orig).getErrorMessage();
					if(message !== this.lastErrorMessage){
						this.inputElements.prop('setCustomValidity', function(i, val){
							if(val._supvalue){
								val._supvalue.call(this, message);
							}
						});
						this.lastErrorMessage = message;
					}
				}
			},
			addBindings: function(){
				var isFocused;
				
				var that = this;
				var o = this.options;
				
				var eventTimer = (function(){
					var events = {};
					return {
						init: function(name, curVal, fn){
							if(!events[name]){
								events[name] = {fn: fn};
								$(that.orig).on(name, function(){
									events[name].val = $.prop(that.orig, 'value');
								});
							}
							events[name].val = curVal;
						},
						call: function(name, val){
							if(events[name] && events[name].val != val){
								clearTimeout(events[name].timer);
								events[name].val = val;
								events[name].timer = setTimeout(function(){
									events[name].fn(val, that);
								}, 9);
							}
						}
					};
				})();
				var initChangeEvents = function(){
					eventTimer.init('input', $.prop(that.orig, 'value'), that.options.input);
					eventTimer.init('change', $.prop(that.orig, 'value'), that.options.change);
				};
				
				var step = {};
				
				var preventBlur = function(e){
					if(preventBlur.prevent){
						e.preventDefault();
						(isFocused || that.element.getShadowFocusElement()).focus();
						e.stopImmediatePropagation();
						return true;
					}
				};
				var callSplitChange = (function(){
					var timer;
					
					var call = function(e){
						var val;
						clearTimeout(timer);
						val = that.parseValue();
						if(that.type == 'color'){
							that.inputElements.val(val);
						}
						$.prop(that.orig, 'value', val);
						eventTimer.call('input', val);
						if(!e || e.type != 'wsupdatevalue'){
							eventTimer.call('change', val);
						}
					};
					
					var onFocus = function(){
						clearTimeout(timer);
					};
					var onBlur = function(e){
						clearTimeout(timer);
						timer = setTimeout(call, 0);
						
						if(e.type == 'change'){
							stopPropagation(e);
							if(!o.splitInput){
								call();
							}
						}
					};
					
					that.element.on('wsupdatevalue', call);
					
					that.inputElements
						.add(that.buttonWrapper)
						.add(that.element)
						.on(
							{
								'focus focusin': onFocus,
								'blur focusout change': onBlur
							}
						)
					;
					setTimeout(function(){
						if(that.popover){
							that.popover.element.on('wspopoverhide', onBlur);
							$('> *', that.popover.element)
								.on({
									'focusin': onFocus,
									'focusout': onBlur
								})
							;
						}
					}, 0);
				})();
				
				var spinEvents = {};
				var spinElement = o.splitInput ? this.inputElements.filter('.ws-spin') : this.inputElements.eq(0);
				var elementEvts = {
					blur: function(e){
						if(!preventBlur(e) && !o.disabled && !o.readonly){
							if(!preventBlur.prevent){
								isFocused = false;
							}
						}
						stopPropagation(e);
					},
					focus: function(e){
						if(!isFocused){
							initChangeEvents();
							isFocused = this;
						}
					},
					keypress: function(e){
						if(e.isDefaultPrevented()){return;}
						var chr;
						var stepped = true;
						var code = e.keyCode;
						if(!e.ctrlKey && !e.metaKey && curCfg[that.type+'Signs']){
							chr = String.fromCharCode(e.charCode == null ? code : e.charCode);
							stepped = !(chr < " " || (curCfg[that.type+'Signs']+'0123456789').indexOf(chr) > -1);
						} else {
							stepped = false;
						}
						if(stepped){
							e.preventDefault();
						}
					},
					'input keydown keypress': (function(){
						var timer;
						var isStopped = false;
						var releaseTab = function(){
							if(isStopped === true){
								isStopped = 'semi';
								timer = setTimeout(releaseTab, 250);
							} else {
								isStopped = false;
							}
						};
						var stopTab = function(){
							isStopped = true;
							clearTimeout(timer);
							timer = setTimeout(releaseTab, 300);
						};
						var select = function(){
							this.focus();
							this.select();
							stopTab();
						};
						
						return function(e){
							if(o.splitInput && o.jumpInputs){
								if(e.type == 'input'){
									if($.prop(this, 'value').length === $.prop(this, 'maxLength')){
										try {
											$(this)
												.next()
												.next('input')
												.each(select)
											;
										} catch(er){}
									}
								} else if(!e.shiftKey && !e.crtlKey && e.keyCode == 9 && (isStopped === true || (isStopped && !$.prop(this, 'value')))){
									e.preventDefault();
								}
							}
						};
					})()
				};
				var mouseDownInit = function(){
					if(!o.disabled && !isFocused){
						that.element.getShadowFocusElement().focus();
					}
					preventBlur.set();
					
					return false;
				};
				
				preventBlur.set = (function(){
					var timer;
					var reset = function(){
						preventBlur.prevent = false;
					};
					return function(){
						clearTimeout(timer);
						preventBlur.prevent = true;
						setTimeout(reset, 9);
					};
				})();
				
				
				this.buttonWrapper.on('mousedown', mouseDownInit);
				
				this.setInput = function(value){
					that.value(value);
					eventTimer.call('input', value);
				};
				this.setChange = function(value){
					that.setInput(value);
					eventTimer.call('change', value);
				};
				
				
				
				this.inputElements.on(elementEvts);
				
				if(steps[this.type]){
					['stepUp', 'stepDown'].forEach(function(name){
						step[name] = function(factor){
							if(!o.disabled && !o.readonly){
								if(!isFocused){
									mouseDownInit();
								}
								var ret = false;
								if (!factor) {
									factor = 1;
								}
								try {
									that.elemHelper[name](factor);
									ret = that.elemHelper.prop('value');
									that.value(ret);
									eventTimer.call('input', ret);
								} catch (er) {}
								return ret;
							}
						};
					});
					if(!o.noSpinbtn){
						spinEvents[$.fn.mwheelIntent ? 'mwheelIntent' : 'mousewheel'] = function(e, delta){
							if(delta && isFocused && !o.disabled){
								step[delta > 0 ? 'stepUp' : 'stepDown']();
								e.preventDefault();
							}
						};
						spinEvents.keydown = function(e){
							if(o.list || e.isDefaultPrevented() || $.attr(this, 'list')){return;}
							var stepped = true;
							var code = e.keyCode;
							if (code == 38) {
								step.stepUp();
							} else if (code == 40) {
								step.stepDown();
							} else {
								stepped = false;
							}
							if(stepped){
								e.preventDefault();
							}
						};
						
						spinElement.attr({'autocomplete': 'off', role: 'spinbutton'}).on(spinEvents);
					}
					$(this.buttonWrapper)
						.on('mousepressstart mousepressend', '.step-up, .step-down', mousePress)
						.on('mousedown mousepress', '.step-up', function(e){
								step.stepUp();
						})
						.on('mousedown mousepress', '.step-down', function(e){
								step.stepDown();
						})
					;
				}
				if(this.type != 'color'){
					(function(){
						var localeChange ;
						if(!o.splitInput){
							localeChange = function(){
								
								if(o.value){
									that.value(o.value, true);
								}
		
								if(placeholderFormat[that.type] && o.placeholder){
									that.placeholder(o.placeholder);
								}
							};
						} else {
							localeChange = function(){
								that.reorderInputs();
							};
							that.reorderInputs();
						}
						$(that.orig).onWSOff('wslocalechange', localeChange);
					})();
				}
				
				initChangeEvents();
			},
			value: function(val, force){
				if(!this._init || force || val !== this.options.value){
					this.element.val(this.formatValue(val));
					this.options.value = val;
					this._propertyChange('value');
					this.mirrorValidity();
				}
				
			},
			required: function(val, boolVal){
				this.inputElements.attr({'aria-required': ''+boolVal});
				this.mirrorValidity();
			},
			parseValue: function(){
				var value = this.inputElements.map(function(){
					return $.prop(this, 'value');
				}).get();
				if(!this.options.splitInput){
					value = value[0];
				}
				return parseVal[this.type](value, this.options);
			},
			formatValue: function(val, noSplit){
				return formatVal[this.type](val, noSplit === false ? false : this.options);
			},
			createOpts: ['readonly', 'title', 'disabled', 'tabindex', 'placeholder', 'value', 'required'],
			placeholder: function(val){
				var options = this.options;
				options.placeholder = val;
				var placeholder = val;
				if(placeholderFormat[this.type]){
					placeholder = placeholderFormat[this.type](val, this.options);
				}
				if(options.splitInput && typeof placeholder == 'object'){
					$.each(this.splits, function(i, elem){
						$.prop(elem, 'placeholder', placeholder[i]);
					});
				} else {
					this.element.prop('placeholder', placeholder);
				}
			},
			initDataList: function(){
				var listTimer;
				var that = this;
				var updateList = function(){
					$(that.orig)
						.jProp('list')
						.off('updateDatalist', updateList)
						.on('updateDatalist', updateList)
					;
					clearTimeout(listTimer);
					listTimer = setTimeout(function(){
						if(that.list){
							that.list();
						}
					}, 9);
					
				};
				
				$(this.orig).onTrigger('listdatalistchange', updateList);
			},
			getOptions: function(){
				var options = {};
				var datalist = $(this.orig).jProp('list');
				datalist.find('option').each(function(){
					options[$.prop(this, 'value')] = $.prop(this, 'label');
				});
				return [options, datalist.data('label')];
			},
			list: function(val){
				if(this.type == 'number' || this.type == 'time'){
					this.element.attr('list', $.attr(this.orig, 'list'));
				}
				this.options.list = val;
				this._propertyChange('list');
			},
			_propertyChange: $.noop,
			tabindex: function(val){
				this.options.tabindex = val;
				this.inputElements.prop('tabindex', this.options.tabindex);
				$('button', this.buttonWrapper).prop('tabindex', this.options.tabindex);
			},
			title: function(val){
				if(!val && this.orig && $.attr(this.orig, 'title') == null){
					val = null;
				}
				this.options.title = val;
				if(val == null){
					this.inputElements.removeAttr('title');
				} else {
					this.inputElements.prop('title', this.options.title);
				}
			}
		};
		
		
		['readonly', 'disabled'].forEach(function(name){
			var isDisabled = name == 'disabled';
			wsWidgetProto[name] = function(val, boolVal){
				if(this.options[name] != boolVal || !this._init){
					this.options[name] = !!boolVal;
					this.inputElements.prop(name, this.options[name]);
					this.buttonWrapper[this.options[name] ? 'addClass' : 'removeClass']('ws-'+name);
					if(isDisabled){
						$('button', this.buttonWrapper).prop('disabled', this.options[name]);
					}
				}
			};
		});
		
		var spinBtnProto = $.extend({}, wsWidgetProto, {
			_create: function(){
				var o = this.options;
				var helper = createHelper(o.type);
				
				this.elemHelper = $('<input type="'+ o.type+'" />');
				this.asNumber = helper.asNumber;
				this.asValue = helper.asValue;
				
				wsWidgetProto._create.apply(this, arguments);
				this._init = false;
				
				this.buttonWrapper.html('<span unselectable="on" class="step-controls"><span class="step-up"></span><span class="step-down"></span></span>');
				
				if(this.type == 'number'){
					this.inputElements.attr('inputmode', 'numeric');
				}
				
				
				if(!o.min && typeof o.relMin == 'number'){
					o.min = this.asValue(this.getRelNumber(o.relMin));
					$.prop(this.orig, 'min', o.min);
				}
				
				if(!o.max && typeof o.relMax == 'number'){
					o.max = this.asValue(this.getRelNumber(o.relMax));
					$.prop(this.orig, 'max', o.max);
				}
				this._init = true;
			},
			createOpts: ['step', 'min', 'max', 'readonly', 'title', 'disabled', 'tabindex', 'placeholder', 'value', 'required'],
			_addSplitInputs: function(){
				if(!this.inputElements){
					var create = splitInputs[this.type]._create();
					this.splits = create.splits;
					this.inputElements = $(create.elements).prependTo(this.element).filter('input');
				}
			},
			
			getRelNumber: function(rel){
				var start = steps[this.type].start || 0;
				if(rel){
					start += rel;
				}
				return start;
			},
			addZero: addZero,
			_setStartInRange: function(){
				var start = this.getRelNumber(this.options.relDefaultValue);
				if(!isNaN(this.minAsNumber) && start < this.minAsNumber){
					start = this.minAsNumber;
				} else if(!isNaN(this.maxAsNumber) && start > this.maxAsNumber){
					start = this.maxAsNumber;
				}
				this.elemHelper.prop('valueAsNumber', start);
				this.options.defValue = this.elemHelper.prop('value');
				
			},
			reorderInputs: function(){
				if(splitInputs[this.type]){
					var element = this.element;
					splitInputs[this.type].sort(element);
					setTimeout(function(){
						var data = webshims.data(element);
						if(data && data.shadowData){
							data.shadowData.shadowFocusElement = element.find('input')[0] || element[0];
						}
					}, 9);
				}
			},
			value: function(val, force){
				
				if(!this._init || force || this.options.value !== val){
					this.valueAsNumber = this.asNumber(val);
					this.options.value = val;
					
					if(isNaN(this.valueAsNumber) || (!isNaN(this.minAsNumber) && this.valueAsNumber < this.minAsNumber) || (!isNaN(this.maxAsNumber) && this.valueAsNumber > this.maxAsNumber)){
						this._setStartInRange();
					} else {
						this.elemHelper.prop('value', val);
						this.options.defValue = "";
					}
					
					val = formatVal[this.type](val, this.options);
					if(this.options.splitInput){
						$.each(this.splits, function(i, elem){
							$.prop(elem, 'value', val[i]);
						});
					} else {
						this.element.prop('value', val);
					}
					this._propertyChange('value');
					this.mirrorValidity();
				}
			},
			step: function(val){
				var defStep = steps[this.type];
				this.options.step = val;
				this.elemHelper.prop('step', retDefault(val, defStep.step));
				this.mirrorValidity();
			}
		});
		
		$.each({min: 1, max: -1}, function(name, factor){
			var numName = name +'AsNumber';
			spinBtnProto[name] = function(val){
				this.elemHelper.prop(name, val);
				this[numName] = this.asNumber(val);
				if(this.valueAsNumber != null && (isNaN(this.valueAsNumber) || (!isNaN(this[numName]) && (this.valueAsNumber * factor) < (this[numName] * factor)))){
					this._setStartInRange();
				}
				this.options[name] = val;
				this._propertyChange(name);
				this.mirrorValidity();
			};
		});
		
		$.fn.wsBaseWidget = function(opts){
			opts = $.extend({}, opts);
			return this.each(function(){
				$.webshims.objectCreate(wsWidgetProto, {
					element: {
						value: $(this)
					}
				}, opts);
			});
		};
		
		$.fn.spinbtnUI = function(opts){
			opts = $.extend({
				monthNames: 'monthNames',
				size: 1,
				startView: 0
			}, opts);
			return this.each(function(){
				$.webshims.objectCreate(spinBtnProto, {
					element: {
						value: $(this)
					}
				}, opts);
			});
		};
	})();
	
	(function(){
		var picker = {};

		var loadPicker = function(type, name){
			type = (type == 'color' ? 'color' : 'forms')+'-picker';
			if(!loadPicker[name+'Loaded'+type]){
				loadPicker[name+'Loaded'+type] = true;
				webshims.ready(name, function(){
					webshims.loader.loadList([type]);
				});
			}
			return type;
		};
		options.addZero = addZero;
		webshims.loader.addModule('forms-picker', {
			noAutoCallback: true,
			options: options
		});
		webshims.loader.addModule('color-picker', {
			noAutoCallback: true, 
			css: 'jpicker/jpicker.css',
			options: options
		});
		
		picker._genericSetFocus = function(element, _noFocus){
			element = $(element || this.activeButton);
			if(!this.popover.openedByFocus && !_noFocus){
				var that = this;
				var setFocus = function(noTrigger){
					clearTimeout(that.timer);
					that.timer = setTimeout(function(){
						if(element[0]){
							element[0].focus();
							if(noTrigger !== true && !element.is(':focus')){
								setFocus(true);
							}
						}
					}, that.popover.isVisible ? 99 : 360);
				};
				this.popover.activateElement(element);
				setFocus();
			}
		};
		
		picker._actions = {
			changeInput: function(val, popover, data){
				picker._actions.cancel(val, popover, data);
				data.setChange(val);
			},
			cancel: function(val, popover, data){
				popover.stopOpen = true;
				data.element.getShadowFocusElement().focus();
				setTimeout(function(){
					popover.stopOpen = false;
				}, 9);
				popover.hide();
			}
		};
		
		
		picker.commonInit = function(data, popover){
			var tabbable;
			
			popover.isDirty = true;
			
			popover.element.on('updatepickercontent pickerchange', function(){
				tabbable = false;
			});
			popover.contentElement.on({
				keydown: function(e){
					if(e.keyCode == 9){
						if(!tabbable){
							tabbable = $('input:not(:disabled), [tabindex="0"]:not(:disabled)', this).filter(':visible');
						}
						var index = tabbable.index(e.target);
						if(e.shiftKey && index <= 0){
							tabbable.last().focus();
							return false;
						}
						if(!e.shiftKey && index >= tabbable.length - 1){
							tabbable.first().focus();
							return false;
						}
					} else if(e.keyCode == 27){
						data.element.getShadowFocusElement().focus();
						popover.hide();
						return false;
					}
				}
			});
			
			data._propertyChange = (function(){
				var timer;
				var update = function(){
					if(popover.isVisible){
						popover.element.triggerHandler('updatepickercontent');
					}
				};
				return function(prop){
					if(prop == 'value'){return;}
					popover.isDirty = true;
					if(popover.isVisible){
						clearTimeout(timer);
						timer = setTimeout(update, 9);
					}
				};
			})();
			
			popover.activeElement = $([]);
			
			popover.activateElement = function(element){
				element = $(element);
				if(element[0] != popover.activeElement[0]){
					popover.activeElement.removeClass('ws-focus');
					element.addClass('ws-focus');
				}
				popover.activeElement = element;
			};
			popover.element.on({
				wspopoverbeforeshow: function(){
					data.element.triggerHandler('wsupdatevalue');
					popover.element.triggerHandler('updatepickercontent');
				}
			});
			
			
			$(data.orig).on('remove', function(e){
				if(!e.originalEvent){
					$(document).off('wslocalechange', data._propertyChange);
				}
			});
		};
		
		
		picker._common = function(data){
			var popover = webshims.objectCreate(webshims.wsPopover, {}, {prepareFor: data.element});
			var opener = $('<button type="button" class="ws-popover-opener"><span /></button>').appendTo(data.buttonWrapper);
			var options = data.options;
			
			var showPickerContent = function(){
				(picker[data.type].showPickerContent || picker.showPickerContent)(data, popover);
			};
			var show = function(){
				var type = loadPicker(data.type, 'DOM');
				if(!options.disabled && !options.readonly && !popover.isVisible){
					webshims.ready(type, showPickerContent);
					popover.show(data.element);
				}
			};
			
			options.containerElements.push(popover.element[0]);
			
			if(data.type != 'color'){
				if(!options.startView){
					options.startView = 0;
				}
				if(!options.minView){
					options.minView = 0;
				}
				if(options.startView < options.minView){
					options.startView = options.minView;
					webshims.warn("wrong config for minView/startView.");
				}
				if(!options.size){
					options.size = 1;
				}
			}
			
			popover.element
				.addClass(data.type+'-popover input-picker')
				.attr({role: 'application'})
				.on({
					wspopoverhide: function(){
						popover.openedByFocus = false;
					},
					focusin: function(e){
						if(popover.activateElement){
							popover.openedByFocus = false;
							popover.activateElement(e.target);
						}
					},
					focusout: function(){
						if(popover.activeElement){
							popover.activeElement.removeClass('ws-focus');
						}
					}
				})
			;
			
			labelWidth(popover.element.children('div.ws-po-outerbox').attr({role: 'group'}), options.labels, true);
			labelWidth(opener, options.labels, true);
			
			if(options.tabindex != null){
				opener.attr({tabindex: options.tabindex});
			}
			
			if(options.disabled){
				opener.prop({disabled: true});
			}
			
			opener
				.on({
					mousedown: function(){
						stopPropagation.apply(this, arguments);
						popover.preventBlur();
					},
					click: function(){
						if(popover.isVisible && popover.activeElement){
							popover.openedByFocus = false;
							popover.activeElement.focus();
						}
						show();
					},
					focus: function(){
						popover.preventBlur();
					}
				})
			;
			
			(function(){
				var mouseFocus = false;
				var resetMouseFocus = function(){
					mouseFocus = false;
				};
				data.inputElements.on({
					focus: function(){
						if(!popover.stopOpen && (data.options.openOnFocus || (mouseFocus && options.openOnMouseFocus))){
							popover.openedByFocus = !options.noInput;
							show();
						} else {
							popover.preventBlur();
						}
					},
					mousedown: function(){
						mouseFocus = true;
						setTimeout(resetMouseFocus, 9);
						if(data.element.is(':focus')){
							popover.openedByFocus = !options.noInput;
							show();
						}
						popover.preventBlur();
					}
				});
			})();
			data.popover = popover;
			data.opener = opener;
			$(data.orig).on('remove', function(e){
				if(!e.originalEvent){
					opener.remove();
					popover.element.remove();
				}
			});
			
			loadPicker(data.type, 'WINDOWLOAD');
		};
		
		picker.month = picker._common;
		picker.date = picker._common;
		picker.color = function(data){
			var ret = picker._common.apply(this, arguments);
			var alpha = $(data.orig).data('alphacontrol');
			var colorIndicator = data.opener
				.prepend('<span class="ws-color-indicator-bg"><span class="ws-color-indicator" /></span>')
				.find('.ws-color-indicator')
			;
			var showColor = function(){
				colorIndicator.css({backgroundColor: $.prop(this, 'value') || '#000'})
			};
			var showOpacity = (function(){
				var timer;
				var show = function(){
					try {
						var value = data.alpha.prop('valueAsNumber') / (data.alpha.prop('max') || 1);
						if(!isNaN(value)){
							colorIndicator.css({opacity: value});
						}
					} catch(er){}
					
				};
				return function(e){
					clearTimeout(timer);
					timer = setTimeout(show, !e || e.type == 'change' ? 4: 40);
				};
			})();
			data.alpha = (alpha) ? $('#'+alpha) : $([]);
			
			$(data.orig).on('wsupdatevalue change', showColor).each(showColor);
			data.alpha.on('wsupdatevalue change input', showOpacity).each(showOpacity);
			return ret;
		};
		
		webshims.picker = picker;
	})();
	
	(function(){
		
		var stopCircular, isCheckValidity;
		
		var modernizrInputTypes = Modernizr.inputtypes;
		var inputTypes = {
			
		};
		var copyProps = [
			'disabled',
			'readonly',
			'value',
			'min',
			'max',
			'step',
			'title',
			'required',
			'placeholder'
		];
		
		//
		var copyAttrs = ['data-placeholder', 'tabindex'];
			
		$.each(copyProps.concat(copyAttrs), function(i, name){
			var fnName = name.replace(/^data\-/, '');
			webshims.onNodeNamesPropertyModify('input', name, function(val, boolVal){
				if(!stopCircular){
					var shadowData = webshims.data(this, 'shadowData');
					if(shadowData && shadowData.data && shadowData.nativeElement === this && shadowData.data[fnName]){
						shadowData.data[fnName](val, boolVal);
					}
				}
			});
		});
		
		if(options.replaceUI && 'valueAsNumber' in document.createElement('input')){
			var reflectFn = function(val){
				if(webshims.data(this, 'hasShadow')){
					$.prop(this, 'value', $.prop(this, 'value'));
				}
			};
			
			webshims.onNodeNamesPropertyModify('input', 'valueAsNumber', reflectFn);
			webshims.onNodeNamesPropertyModify('input', 'valueAsDate', reflectFn);
		}
		
		var extendType = (function(){
			return function(name, data){
				inputTypes[name] = data;
				data.attrs = $.merge([], copyAttrs, data.attrs);
				data.props = $.merge([], copyProps, data.props);
			};
		})();
		
		var isVisible = function(){
			return $.css(this, 'display') != 'none';
		};
		var sizeInput = function(data){
			var init;
			var updateStyles = function(){
				$(data.orig).removeClass('ws-important-hide');
				$.style( data.orig, 'display', '' );
				var hasButtons, marginR, marginL;
				var correctWidth = 0.6;
				if(!init || data.orig.offsetWidth){
					hasButtons = data.buttonWrapper && data.buttonWrapper.filter(isVisible).length;
					marginR = $.css( data.orig, 'marginRight');
					data.element.css({
						marginLeft: $.css( data.orig, 'marginLeft'),
						marginRight: hasButtons ? 0 : marginR
					});
					
					if(hasButtons){
						marginL = (parseInt(data.buttonWrapper.css('marginLeft'), 10) || 0);
						data.element.css({paddingRight: ''});
						
						if(marginL < 0){
							marginR = (parseInt(marginR, 10) || 0) + ((data.buttonWrapper.outerWidth() + marginL) * -1);
							data.buttonWrapper.css('marginRight', marginR);
							data.element
								.css({paddingRight: ''})
								.css({
									paddingRight: (parseInt( data.element.css('paddingRight'), 10) || 0) + data.buttonWrapper.outerWidth()
								})
							;
						} else {
							data.buttonWrapper.css('marginRight', marginR);
							correctWidth = data.buttonWrapper.outerWidth(true) + 0.6;
						}
					}
					
					data.element.outerWidth( $(data.orig).outerWidth() - correctWidth );
				}
				init = true;
				$(data.orig).addClass('ws-important-hide');
			};
			data.element.onWSOff('updateshadowdom', updateStyles, true);
		};
		
		
		var implementType = function(){
			
			var type = $.prop(this, 'type');
			
			var i, opts, data, optsName, labels;
			if(inputTypes[type] && webshims.implement(this, 'inputwidgets')){
				data = {};
				optsName = type;
				
				//todo: do we need deep extend?
				
				labels = $(this).jProp('labels');
				
				opts = $.extend({}, options.widgets, options[type], $($.prop(this, 'form')).data(type) || {}, $(this).data(type) || {}, {
					orig: this,
					type: type,
					labels: labels,
					options: {},
					input: function(val){
						opts._change(val, 'input');
					},
					change: function(val){
						opts._change(val, 'change');
					},
					_change: function(val, trigger){
						stopCircular = true;
						$.prop(opts.orig, 'value', val);
						stopCircular = false;
						if(trigger){
							$(opts.orig).trigger(trigger);
						}
					},
					containerElements: []
				});
				
				
				for(i = 0; i < copyProps.length; i++){
					opts[copyProps[i]] = $.prop(this, copyProps[i]);
				}
				
				for(i = 0; i < copyAttrs.length; i++){
					optsName = copyAttrs[i].replace(/^data\-/, '');
					if(optsName == 'placeholder' || !opts[optsName]){
						opts[optsName] = $.attr(this, copyAttrs[i]) || opts[optsName];
					}
				}
				
				data.shim = inputTypes[type]._create(opts);
				
				webshims.addShadowDom(this, data.shim.element, {
					data: data.shim || {}
				});
				
				data.shim.options.containerElements.push(data.shim.element[0]);
				
				labelWidth($(this).getShadowFocusElement(), labels);
				
				$(this).on('change', function(e){
					if(!stopCircular){
						data.shim.value($.prop(this, 'value'));
					}
				});
				
				(function(){
					var has = {
						focusin: true,
						focus: true
					};
					var timer;
					var hasFocusTriggered = false;
					var hasFocus = false;
					
					$(data.shim.options.containerElements)
						.on({
							'focusin focus focusout blur': function(e){
								e.stopImmediatePropagation();
								hasFocus = has[e.type];
								clearTimeout(timer);
								timer = setTimeout(function(){
									if(hasFocus != hasFocusTriggered){
										hasFocusTriggered = hasFocus;
										$(opts.orig).triggerHandler(hasFocus ? 'focus' : 'blur');
										$(opts.orig).trigger(hasFocus ? 'focusin' : 'focusout');
									}
									hasFocusTriggered = hasFocus;
								}, 0);
							}
						})
					;
				})();
								
				
				data.shim.element.on('change input', stopPropagation);
				
				if(Modernizr.formvalidation){
					$(opts.orig).on('firstinvalid', function(e){
						if(!webshims.fromSubmit && isCheckValidity){return;}
						$(opts.orig).off('invalid.replacedwidgetbubble').on('invalid.replacedwidgetbubble', function(evt){
							if(!e.isInvalidUIPrevented() && !evt.isDefaultPrevented()){
								webshims.validityAlert.showFor( e.target );
								e.preventDefault();
								evt.preventDefault();
							}
							$(opts.orig).off('invalid.replacedwidgetbubble');
						});
					});
				}
				
				
				if(data.shim.buttonWrapper && data.shim.buttonWrapper.filter(isVisible).length){
					data.shim.element.addClass('has-input-buttons');
				}
				
				if(opts.calculateWidth){
					sizeInput(data.shim);
				} else {
					$(this).css({display: 'none'});
				}
			}
			
		};
		
		
		if(Modernizr.formvalidation){
			['input', 'form'].forEach(function(name){
				var desc = webshims.defineNodeNameProperty(name, 'checkValidity', {
					prop: {
						value: function(){
							isCheckValidity = true;
							var ret = desc.prop._supvalue.apply(this, arguments);
							isCheckValidity = false;
							return ret;
						}
					}
				});
			});
		}
		
		if(!modernizrInputTypes.range || options.replaceUI){
			extendType('range', {
				_create: function(opts, set){
					var data = $('<span />').insertAfter(opts.orig).rangeUI(opts).data('rangeUi');
					return data;
				}
			});
		}
		
		var isStupid = navigator.userAgent.indexOf('MSIE 10.0') != -1 && navigator.userAgent.indexOf('Touch') == -1;
		['number', 'time', 'month', 'date', 'color'].forEach(function(name){
			if(!modernizrInputTypes[name] || options.replaceUI || (name == 'number' && isStupid)){
				extendType(name, {
					_create: function(opts, set){
						if(opts.splitInput && !splitInputs[name]){
							webshims.warn('splitInput not supported for '+ name);
							opts.splitInput = false;
						}
						var markup = opts.splitInput ?
								'<span class="ws-'+name+' ws-input" role="group"></span>' :
								'<input class="ws-'+name+'" type="text" />';
						var data = $(markup).insertAfter(opts.orig);
						if(steps[name]){
							data = data.spinbtnUI(opts).data('wsWidget'+name);
						} else {
							data = data.wsBaseWidget(opts).data('wsWidget'+name);
						}
						if(webshims.picker && webshims.picker[name]){
							webshims.picker[name](data);
						}
						data.buttonWrapper.addClass('input-button-size-'+(data.buttonWrapper.children().filter(isVisible).length));
						return data;
					}
				});
			}
		});
		
		
		webshims.addReady(function(context, contextElem){
			$('input', context)
				.add(contextElem.filter('input'))
				.each(implementType)
			;
		});
	})();
});

