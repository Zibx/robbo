(function( R ){
    'use strict';
    var ascii = R.ascii = {},

        map = R.asciiHash = {
            Robbo: 'R',
            Empty: '.',
            Walls: 'Oo-QqPpSsyYzJjZi',
            Ground: 'H',
            Stone: '#',
            PushableStone: '~',
            Door: 'D',
            Spaceship: '!',
            Question: '?',
            Bomb: 'b',
            Key: '%',
            Screw: 'Tx',
            Turrel: '}',
            Ammo: "'",
            Teleport: '&',
            Explosion: 'e',
            Bullet: '|',
            Mustache: '^',
            Butterfly: 'V',
            Bear: '@*',
            Lava: '=',
            Magnet: 'M'
        };

    R.each( map, function( k, v ){
        v.split('').forEach(function( letter ){
            ascii[ letter ] = k;
        });
    })

} )(window.R);