(function( R ){
    'use strict';
    R.objects.Screw = {
        init: function( x, y, game ){
            !game.levelLoaded && game.screw++;
        },
        eatable: true,
        eat: function( ){
            this.game.set( 'screw', this.game.screw - 1 );
            this.game.playSound('screw');
        },
        explodable: true
    };
} )(window.R);