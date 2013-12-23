(function( R ){
    'use strict';
    R.objects.Bear = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = 0;
            this.animate();
        },
        stepAnimation: 0,
        step: function(  ){
            var cell,
                add = this.clockwise ? 1 : -1, testDirection, i;

            for( i = 2; i; ){
                --i;
                testDirection = this.direction;
                this.direction = ( this.direction + 4 - add ) % 4;
                cell = this.game.getCell( R.addDirection( this, testDirection ) );
                if( cell.is( 'Empty' ) ){
                    this.game.swap( this, cell );
                    break;
                }else{
                    this.direction = ( this.direction + 4 + add * 2 ) % 4;
                }
            }
        },
        animate: function(  ){
            this.stepAnimation = (this.stepAnimation + 1) % 4;
            this.animationFrame = (this.stepAnimation / 2) | 0
        },
        dieCheck: function(  ){
            R.behaviors.killRobbo.call( this );
        },
        explode: R.behaviors.die,
        explodable: true,
        demolish: R.behaviors.die,
        demolishable: true
    };
} )(window.R);