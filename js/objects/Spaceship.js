(function( R ){
    'use strict';
    R.objects.Spaceship = {
        init: function( x, y, game ){
            game.addActionObject(this);
        },
        movable: true,
        eatable: true,
        eat: function( eater ){
            if( this.game.screw === 0 || this.fromQuestion ){
                this.movable = false;
                eater.noMove = true;
                this.game.setCell( eater, 'Empty');
                this.game.playSound( 'end_default' );
                this.game.finishLevel();
            }
            return false;
        },
        move: R.behaviors.move
    };
} )(window.R);