(function( R ){
    'use strict';
    R.objects.Key = {
        eatable: true,
        eat: function( eater ){
            eater.set( 'keys', eater.keys + 1 );
            this.game.playSound('key');
        },
        explodable: true
    };
} )(window.R);