(function( R ){
    'use strict';
    R.objects.Robbo = {
        drawOnCreate: false,
        init: function( x, y, game ){
            game.robbo = this;
            this.direction = 1;
            this.stepAnimation = 0;
            this.keys = 0;
            this.ammo = 0;
            this.inited = true;
            game.addActionObject(this);
            //this.noMove = true;
            this.scrolled = false;
            game.delayedFn(function(){
                this.game.set('screw', this.game.screw);
            }.bind(this),6);
            this.ammo = 9;
            /*game.once('scrolled',function(){
                this.inited = true;
                debugger;
                game.setCell( x, y, 'Explosion', {after: {type: this}, single: true, build: true, callback: function(  ){

                    this.drawOnCreate = true;
                    this.noMove = false;
                    this.game.removeActiveObject(this);
                    this.game.setCell( this, this ); // redraw manually
                    this.game.set('screw', this.game.screw);
                }.bind(this) });
            }, this);*/


        },
        demolishable: true,
        demolish: function(  ){

            !this.dead && this.game.restart();
            this.dead = true;
        },
        explodable: true,
        explode: function(  ){
            this.demolish();
        },
        fireAction: function( ){
            this.fire = false;
            if( this.fireDelay || this.noMove || !this.ammo )
                return;

            this.set( 'ammo', this.ammo - 1 );
            var cell = this.game.getCell( R.addDirection( this.x, this.y, this.direction ) );
            if( cell.is( 'Empty' ) ){
                this.game.setCell( cell, 'Bullet', { direction: this.direction, bulletType: 'gun' } );
            }else if( cell.demolishable ){
                R.behaviors.demolish( cell );
            }else
                return;
            this.game.playSound('shoot_default');

            this.fireDelay = 2;
        },
        step: function(  ){
            this.fireDelay = this.fireDelay > 0 ? this.fireDelay - 1 : 0;
            this.move && this.moveAction();
            this.fire && this.fireAction();
        },
        teleport: function( obj ){
            obj.transfer( this );
        },
        moveAction: function(  ){
            this.move = false;
            if( this.noMove )
                return;
            var newPos, nextCell, noStep = false;

            newPos = R.addDirection( this.x, this.y, this.direction);
            nextCell = this.game.getCell( newPos );

            if( nextCell.is( 'Empty' ) ){
                this.game.swap( nextCell, this );
            }else{
                if( nextCell.eatable )
                    if( !(nextCell.eat && nextCell.eat( this ) === false )){
                        nextCell = this.game.setCell( newPos, 'Empty' );
                        this.game.swap( nextCell, this );
                    }else
                        noStep = true;

                if( nextCell.movable )
                    if( !(nextCell.move && nextCell.move( this.direction ) === false) ){
                        nextCell = this.game.setCell( newPos, 'Empty' );
                        this.game.swap( nextCell, this );
                    }else
                        noStep = true;

                if( nextCell.getNextCell ){ // duck typing. teleport have such method. portal would also have it
                    this.teleport( nextCell );
                    noStep = true;
                    return;
                }
            }
            if( !noStep ){
                this.animateStep = true;
                this.game.playSound('walk_default');
            }
        },
        animate: function(  ){
            debugger;
            if( this.animateStep ){
                this.animateStep = false;
                this.stepAnimation = (this.stepAnimation + 1) % 2;
                this.game.view.redraw( this );
            }
        },
        set: function( key, val ){
            if( val < 0 )
                val = 0;

            this[ key ] = val;

            this.game.fire( 'robboSet', key, val );
        }
    };
} )(window.R);