(function( R ){
    'use strict';
    R.objects = {};
    R.include([
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
        ].map(function( el ){
            return 'js/objects/' + el + '.js';
        } ),
        function(){
            var typeCheck = function( type ){
                return this.type === type;
            };
            R.each( R.objects, function( name, obj ){
                var constructor = R.objects[ name ] = obj.init || function(){ };
                constructor.prototype = obj;
                obj.type = name;
                obj.is = typeCheck;
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