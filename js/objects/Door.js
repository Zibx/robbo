(function( R ){
    'use strict';
    R.objects.Door = {
        explodable: true,
        eatable: true,
        eat: function( eater ){
            if( eater.keys > 0 ){
                eater.set( 'keys', eater.keys - 1 );
                this.game.setCell( this, 'Empty' );
                this.game.playSound('door_default')
                return false;
            }else{
                return false;
            }
        }
    };
} )(window.R);