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
            R.behaviors.rightHandMove.call( this, this.clockwise );
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