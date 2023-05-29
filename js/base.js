(function(){
    'use strict';
    window.DOM = {
        init: function(){
            if (typeof window.addEventListener === 'function') {
                this.addListener = function (el, type, fn) {
                    el.addEventListener(type, fn, false);
                };
                this.removeListener = function (el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else if (typeof document.attachEvent === 'function') { // IE
                this.addListener = function (el, type, fn) {
                    el.attachEvent('on' + type, fn);
                };
                this.removeListener = function (el, type, fn) {
                    el.detachEvent('on' + type, fn);
                };
            } else { // older browsers
                this.addListener = function (el, type, fn) {
                    el['on' + type] = fn;
                };
                this.removeListener = function (el, type) {
                    el['on' + type] = null;
                };
            }
        }
    };
    DOM.init();

    var toString = Object.prototype.toString,
        getType = function( obj ){
            return toString.call( obj );
        },
        R = window.R = {
            version: '2014.01.02.1',
            getLocationHash: function(  ){
                var hash = {};
                document.location.search.replace(/^\?/, '').split('&').forEach(function (el) {
                    var tokens = el.split('=');
                    hash[ tokens[0] ] = tokens.slice(1).join('=');
                });
                return hash;
            },
            colorToArray: function( color ){

                color.charAt(0) === '#' && (color = color.substr(1));
                if( color.length === 3 )
                    return [parseInt( color.charAt(0), 16 ),parseInt( color.charAt(1), 16 ),parseInt( color.charAt(2), 16 )];
                else
                    return [parseInt( color.substr(0,2), 16 ),parseInt( color.substr(2,2), 16 ),parseInt( color.substr(4,2), 16 )];
            },
            falseFn: function(){ return false; },
            rand: function( a, b ){
                return a + (( Math.random() * ( b - a + 1 ) )|0);
            },
            sign: function( a ){
                return a < 0 ? -1 : 1;
            },
            zeroSign: function( a ){
                return a < 0 ? -1 : ( a > 0 ? 1 : 0 );
            },
            apply: function( a, b ){
                for( var i in b )
                    if(b.hasOwnProperty(i))
                        a[i] = b[i];
                return a;
            },
            getType: getType,
            isArray: function( obj ){
                return getType( obj ) === '[object Array]';
            },
            each: function( el, callback ){ // itterate over objects and arrays
                var i, _i, out = false;

                if( el === null || el === void 0 )
                    return out;

                if( R.isArray( el ) ){
                    for( i = 0, _i = el.length; i < _i; i++ ){
                        out = callback.call( el[i], el[i], i );
                        if( out !== void 0 )
                            return out;
                    }
                }else{
                    for( i in el )
                        if( el.hasOwnProperty( i ) ){
                            out = callback.call( el[i], i, el[i] );
                            if( out !== void 0 )
                                return out;
                        }

                }
                return out;
            },
            include: function( list, fn ){
                var head = document.getElementsByTagName('head')[0],

                    count = list.length,
                    hash = {},
                    finish = function( name ){
                        if( hash[ name ] ){
                            delete hash[ name ];
                            if( !--count && fn )fn();
                        }
                    };

                if(list.length === 0) {
                  fn();
                }

                R.each( list, function( name ){
                    hash[ name ] = true;
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.onreadystatechange = function () { // IE
                        if ( this.readyState === 'complete' || this.readyState === 'loaded' ){
                            this.onload = this.onreadystatechange = null;
                            finish( name );
                        }
                    };
                    script.onload = function () {
                        finish(name);
                    };
                    script.src = name + '?version='+ R.version;
                    head.appendChild(script);
                } );

            },
            _afterLoad: {},
            loaded: function( name ){
                var afterLoad = this._afterLoad[ name ] || (this._afterLoad[ name ] = {fns: []});
                afterLoad.loaded = true;
                this._tryAfterLoad( name );
            },
            _tryAfterLoad: function( name ){
                var afterLoad = this._afterLoad[ name ];
                if( afterLoad.loaded ){
                    R.each( afterLoad.fns, function( fn ){ fn(); } );
                    afterLoad.fns = [];
                }
            },
            afterLoad: function( list, fn ){
                var afterLoad,
                    name;

                list = R.isArray( list ) ? list : [ list ];
                name = list[0];
                afterLoad = this._afterLoad[ name ] || (this._afterLoad[ name ] = {fns: [], loaded: false});
                if( list.length === 1 ){ // if we wait single item -> push fn to its promises
                    afterLoad.fns.push( fn );
                }else{ // else push fn that would call afterLoad for list without first item
                    afterLoad.fns.push( function( list ){
                        this.afterLoad( list, fn );
                    }.bind(this, list.slice(1)) );
                }
                this._tryAfterLoad( name );
            }   
        };

})();