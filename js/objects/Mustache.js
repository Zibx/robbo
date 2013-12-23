(function( R ){
    'use strict';
    R.objects.Mustache = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = 0;
            this.animate();
        },
        stepAnimation: 0,
        step: function(  ){
            this.dieCheck();
            var cell = this.game.getCell( R.addDirection( this, this.direction )),
                justShootted = this.justShootted;

            this.justShootted = false;
            if( !this.innerSkip ){
                if( cell.is( 'Empty' ) )
                    this.game.swap( this, cell );
                else{
                    this.direction = ( this.direction + 2 ) % 4 ;
                    this.innerSkip = true;
                }
            }else{
                this.innerSkip = false;
            }
            if( this.fire && Math.random() < 1/8 && !justShootted ){

                this.justShootted = true;
                cell = this.game.getCell( R.addDirection( this, 1 ) );

                if( cell.is('Empty') )
                    this.game.setCell( cell, 'Bullet', { direction: 1, bulletType: 'gun' } );
                else
                    R.behaviors.demolish( cell );
            }
        },
        animate: function(  ){
            this.stepAnimation = (this.stepAnimation + 1) % 4;
            this.animationFrame = (this.stepAnimation / 2) | 0
        },
        dieCheck: function(  ){
            R.behaviors.killRobbo.call( this );
        },
        bulletType: 'gun',
        explode: R.behaviors.die,
        explodable: true,
        demolish: R.behaviors.die,
        demolishable: true
    };
} )(window.R);