(function( R ){
    'use strict';
    R.objects.PushableStone = {
        movable: true,
        explodable: true,
        move: function( direction ){
            if( R.behaviors.move.call( this, direction ) !== false ){
                if(!this.moving){
                    this.game.addActionObject(this);
                    this.direction = direction;
                }
                this.skipStep = true;
                this.moving = true;
            }else{
                return false;
            }
        },
        step: function(  ){
            if( R.behaviors.move.call( this, this.direction ) === false ){
                R.behaviors.demolish.call( this, this.game.getCell( R.addDirection( this, this.direction ) ) );
                this.moving = false;
                return false;
            }
        }
    };
} )(window.R);