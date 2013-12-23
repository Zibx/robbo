(function( R ){
    'use strict';
    R.objects.Explosion = {
        init: function( x, y, game ){
            game.addActionObject(this);
        },
        afterInit: function(){

            if( this.animation === void 0 )
                this.animation = this.fromBullet ? 1 : 2;
            //this.innerSkip = true;
        },
        step: function(  ){
           // console.log('explosion')
           // console.log(Ro.getAsciiMap());

            if( this.innerSkip ){
                this.innerSkip = false;
                return true;
            }
            this.animation--;
            if( this.animation === -1 ){
                this.game.setCell( this, this.after.type, this.after.data );
                this.callback && this.callback();
                return false;
            }
            //console.log(Ro.getAsciiMap());
            return true;
        }
    };
} )(window.R);