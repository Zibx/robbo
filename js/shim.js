if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        /*if (typeof this !== 'function') {
         // closest thing possible to the ECMAScript 5 internal IsCallable function
         throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
         }*/

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply( oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== '[object Function]') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while(k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[ k ] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement) {
        var len = this.length,
            i = +arguments[1] || 0; // fromIndex

        if (len === 0 || isNaN(i) || i >= len)
            return -1;

        if (i < 0) {
            i = len + i;
            i < 0 && (i = 0);
        }

        for (; i < len; ++i) {
            if (this.hasOwnProperty(String(i)) && this[i] === searchElement)
                return i;
        }

        return -1;
    };
}


Array.prototype.reduce = Array.prototype.reduce || function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
        // At the moment all modern browsers, that support strict mode, have
        // native implementation of Array.prototype.reduce. For instance, IE8
        // does not support strict mode, so this check is actually useless.
        throw new TypeError(
            'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
        throw new TypeError(callback + ' is not a function');
    }
    var index, value,
        length = this.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
        value = opt_initialValue;
        isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
        if (this.hasOwnProperty(index)) {
            if (isValueSet) {
                value = callback(value, this[index], index, this);
            }
            else {
                value = this[index];
                isValueSet = true;
            }
        }
    }
    if (!isValueSet) {
        throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
};

Array.prototype.forEach = Array.prototype.forEach || function forEach(callback, thisArg) {
    'use strict';
    var T, k;

    if (this == null) {
        throw new TypeError("this is null or not defined");
    }

    var kValue,
        O = Object(this),
        len = O.length >>> 0; // Hack to convert O.length to a UInt32
    if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
    }
    if (arguments.length >= 2) {
        T = thisArg;
    }
    k = 0;
    while (k < len) {
        if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
        }
        k++;
    }
};
(function(  ){
    var jTrimLeft = /^\s+/,
        jTrimRight = /\s+$/,
        escapeRegExp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    if( String.prototype.trim === undefined )
        String.prototype.trim = function(){
            return this.replace( jTrimLeft, '' ).replace( jTrimRight, '' );
        };
    if( String.prototype.capitalize === undefined )
        String.prototype.capitalize = function(){
            return this.charAt( 0 ).toUpperCase() + this.substr( 1 );
        };

    if (String.prototype.endsWith === void 0) {
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
})();
Array.prototype.filter = Array.prototype.filter || function (fn) {
    var arr = [];
    var i = 0, _i = this.length;
    for (; i < _i; i++) {
        if(fn.apply(this[i], [this[i], i])) arr.push(this[i]);
    }
    return arr;
};

// check if it is IE and it's version is 8 or older  
if (document.documentMode && document.documentMode < 9) {
    // save original function of splice  
    var originalSplice = Array.prototype.splice;

    // provide a new implementation  
    Array.prototype.splice = function () {

        // since we can't modify 'arguments' array,   
        // let's create a new one and copy all elements of 'arguments' into it  
        var arr = [],
            i = 0,
            max = arguments.length;

        for (; i < max; i++) {
            arr.push(arguments[i]);
        }

        // if this function had only one argument  
        // compute 'deleteCount' and push it into arr  
        if (arr.length == 1) {
            arr.push(this.length - arr[0]);
        }

        // invoke original splice() with our new arguments array  
        return originalSplice.apply(this, arr);
    };
}