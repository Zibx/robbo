(function( R ){
    'use strict';
    R.objects = R.objects || {
        Out: {}
    };
    R.include([
            'Base',
            'Robbo',
            'Empty',
            'Walls',
            'Ground',
            'Stone',
            'PushableStone',
            'Door',
            'Spaceship',
            'Question',
            'Bomb',
            'Key',
            'Screw',
            'Turrel',
            'Ammo',
            'Teleport',
            'Explosion',
            'Bullet',
            'Mustache',
            'Butterfly',
            'Bear',
            'Lava',
            'Magnet'
        ].filter(function(el){
          return !(el in R.objects);
        }).map(function( el ){
            return 'js/objects/' + el + '.js';
        } ),
        function(){

            R.each( R.objects, function( name, obj ){
                if( name !== 'Base' ){
                    var constructor = R.objects[ name ] = obj.init || function(){ };
                    obj.type = name;
                    constructor.prototype = new R.objects.Base( obj );
                }
            } );

            R.objects.factory = function( constructor, x, y, data ){
                var object = R.apply( new constructor( x, y, this ), {
                    x: x,
                    y: y,
                    game: this
                });
                data && R.apply( object, data );
                object.afterInit && object.afterInit();
                return object;
            };

            R.loaded('objects');

        }
    )
    
} )( window.R );