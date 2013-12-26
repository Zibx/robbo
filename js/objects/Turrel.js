(function( R ){
    'use strict';
    R.objects.Turrel = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = 0;
        },
        move: R.behaviors.move,
        step: function(  ){
            var justShootted = this.justShootted, cell, bullet;
            this.justShootted = false;

            if( this.movable && !this.justMoved ){

                cell = this.game.getCell( R.addDirection( this, this.moveDirection ));
                this.justMoved = true;
                if( cell.is( 'Empty' ) )
                    this.game.swap( this, cell );
                else
                    this.moveDirection = ( this.moveDirection + 2 ) % 4 ;
            }else{
                this.justMoved = false;
            }

            if( this.rotatable && Math.random() < 1/16 ){
                this.direction += R.rand( -1, 1 );
                this.direction = (this.direction + 4 ) % 4;
            }else if( Math.random() < 1/12 && !this.justShootted ){

                this.justShootted = true;
                if( R.behaviors.fire.call( this, this.direction, this.bulletType ) === true )
                    this.game.playSound('gun_default');

            }

        },
        explode: R.behaviors.die,
        explodable: true
    };
} )(window.R);