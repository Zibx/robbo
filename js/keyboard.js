(function( R ){
    'use strict';
    var keyboard = R.keyboard = {
        key: {},
        releaseAfterGet: {},
        get: function( key ){

            this.key[ key ] === 2 && ( this.key[ key ] = 1 );
            var out = this.key[ key ];
            if( this.releaseAfterGet[ key ] ){
                typeof this.releaseAfterGet[ key ] === 'function' && setTimeout(this.releaseAfterGet[ key ],10);
                this.releaseAfterGet[ key ] = false;
                this.key[ key ] = void 0
            };
            return out ? true : false;
        },
        _stack: [],
        _stackExecute: false,
        emulateStack: function(){
            this._stack.push( [].slice.call(arguments) );
            this.stackExecute();
            return keyboard.emulateStack.bind( keyboard );
        },
        stackExecute: function(  ){
            if( this._stackExecute === false ){
                this._stackExecute = true;
                if( this._stack.length ){
                    var el = this._stack.shift();
                    this.emulate(el[0], function(){
                        el[1] && el[1]();
                        keyboard._stackExecute = false;
                        keyboard.stackExecute();
                    });
                }else{
                    this._stackExecute = false;
                }
            }
        },
        emulate: function( key, callback ){
            var key = key.split('+');
            key.forEach(function( el ){
                this.key[ el ] = 1;
                this.releaseAfterGet[ el ] = true;
            }.bind(this));

            var fn = function(){
                    callback && callback();
                };
            this.releaseAfterGet[ key[0] ] = fn;
        }
    },
        mapping = {};
    R.each({
        backspace: 8,
        comma: 188,
        'delete': 46,
        down: 40,
        end: 35,
        enter: 13,
        escape: 27,
        home: 36,
        left: 37,
        numpad_add: 107,
        numpad_decimal: 110,
        numpad_divide: 111,
        numpad_enter: 108,
        numpad_multiply: 106,
        numpad_subtract: 109,
        page_down: 34,
        page_up: 33,
        period: 190,
        right: 39,
        space: 32,
        tab: 9,
        up: 38
    }, function( k, v ){
        mapping[ v ] = k;
    } );

var isTouched = false, center = [], radius = 32, circle, fire = false;

DOM.addListener( window, 'touchstart', function( e ){
    circle = document.createElement('div');
    R.apply( circle.style, {
      position:'absolute',
      'borderRadius': '50%',
      background: '#449',
      opacity: 0.5,
      border: '1px solid #006'
    });
    document.body.appendChild(circle);
    isTouched = true;
    e=e.touches[ e.touches.length - 1 ];
    if( e.clientX < 500 ){
      R.apply( circle.style, { background: '#944'});
      fire = true;
    }else

      center = [e.clientX, e.clientY];

    R.apply( circle.style, {
      left: e.clientX-radius+'px',
      top: e.clientY-radius+'px',
      width: radius*2+'px',
      height: radius*2+'px'
    });
});


DOM.addListener( window, 'touchend', function( e ){
    isTouched = false;
    var key = keyboard.key;
    'up,down,left,right'.split(',').forEach(function(mapped){
        key[ mapped ] === 1 && (key[ mapped ] = void 0);
        key[ mapped ] === 2 && ( keyboard.releaseAfterGet[ mapped ] = true );
    });
    document.body.removeChild(circle);

    var txt = [];
    e=e.changedTouches[0]
          for(var i in e)
            if(  e.hasOwnProperty(i) ){
               txt.push( i +': ' + e[i] );
            }
            log(e.identifier);
            //document.body.innerHTML=txt.join('<br>');

})

DOM.addListener( window, 'touchmove', function( e ){
    e.preventDefault();
    e=e.changedTouches[0];
    var pos = [e.clientX, e.clientY],
        delta = [ -center[0] + pos[0], -center[1] + pos[1] ],
        distance = Math.sqrt( delta[0]*delta[0]+delta[1]*delta[1] ),
        normalize = [ delta[0] / distance, delta[1] / distance ],
        pressed = 0.9;


        var key = keyboard.key;
        if( distance > radius ){
           center = [pos[0]-normalize[0]*radius, pos[1]-normalize[1]*radius];
        }else{
           normalize = normalize.map(function(val){
             return distance > radius*pressed ? val : 0;
           });
        }
            key.up = normalize[1] < -pressed ? key.up || 2 : 0;

            key.down = normalize[1] > pressed ? key.down || 2 : 0;

            key.left = normalize[0] < -pressed ? key.left || 2 : 0;

            key.right = normalize[0] > pressed ? key.right || 2 : 0;
           // log(key.up);


    R.apply( circle.style, {
      left: center[0]-radius+'px',
      top: center[1]-radius+'px',
      width: radius*2+'px',
      height: radius*2+'px'
    });

});
/*

});
*/
    DOM.addListener( window, 'keydown', function( e ){
        var key = keyboard.key,
            mapped = mapping[ e.which ] || e.which;/*,

            txt = [];
          for(var i in e)
            if(  e.hasOwnProperty(i) ){
              if(typeof e[i] !== 'object' ) txt.push( i +': ' + e[i] );
            }
            document.body.innerHTML=txt.join('<br>');*/
        key.shift = e.shiftKey ? 2 : 0;
        !key[ mapped ] && ( key[ mapped ] = 2 );

        if(e.which > 8 && e.which < 80){
            e.preventDefault();
            e.stopPropagation();
        }
    } );
    DOM.addListener( window, 'keyup', function( e ){
        var which = e.which,
            mapped = mapping[ which ] || which,
            key = keyboard.key;

        key.shift = e.shiftKey;
        key[ mapped ] === 1 && (key[ mapped ] = void 0);
        key[ mapped ] === 2 && ( keyboard.releaseAfterGet[ mapped ] = true );


    } );
} )(window.R);