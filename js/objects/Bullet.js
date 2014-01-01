(function( R ){
    'use strict';
    R.objects.Bullet = {
        init: function( x, y, game ){
            game.addActionObject(this);
        },
        afterInit: function(  ){
            this.bulletType === 'antimatter' && (this.animation = 6);
        },
        logics: {
            laser: function(  ){
                var cell;
                if( this.wait === true )
                    return;

                if( this.return ){

                    this.previous && (cell = this.game.getCell(this.previous.x, this.previous.y));
                    this.game.setCell( this, 'Empty' );
                    if( cell && cell.wait ){

						// bullets can be traversed in any order, and we need previous cell to be processed exactly in next world step
						this.game.delayedFn(function(){
							cell.wait = false;
							cell.return = true;
						});

                    }else{
                        this.game.setCell( this, 'Explosion', { after: { type: 'Empty' }, single: true, fromBullet: true } );
                    }
                    return false;
                }else{
                    cell = this.game.getCell( R.addDirection( this, this.direction ) );
                    if( cell.is( 'Empty' ) ){
                        this.wait = true;
                        this.game.setCell( cell, 'Bullet', { direction: this.direction, previous: this, bulletType: this.bulletType} );
                        return true;
                    }/*else if( cell.getNextCell ){
                        var tmp = {direction: this.direction, x: this.x, y: this.y};
                        var nextCell = cell.getNextCell( tmp );
                        if( nextCell !== cell ){
                            this.game.setCell( nextCell, 'Bullet', { direction: tmp.direction, previous: this, bulletType: this.bulletType, skipStep: true } );
                            this.wait = true;
                        }
                    }*/else{
						if( cell.demolishable )
                        	R.behaviors.demolish( cell );

                        this.return = true;
                        return true;
                    }
                }
            },
            gun: function(  ){

                var cell = this.game.getCell( R.addDirection( this, this.direction ) );
                if( cell.is( 'Empty' ) ){
                    this.game.swap( this, cell );
                    return true;
                }else if( cell.demolishable ){
                    R.behaviors.demolish( cell );
                }
                    //this.game.setCell( this, 'Empty' );
                this.game.removeActiveObject( this );
                this.game.setCell( this, 'Explosion', { after: { type: 'Empty' }, fromBullet: true } );

                /*}else{
                    this.game.setCell( this, 'Explosion', { after: { type: 'Empty' }, single: true, fromBullet: true, animation: 4} );
                    return false;
                } */
            },
            antimatter: function(  ){
                //debugger;
                this.animation--;


                if( this.animation === -1 ){
                    this.game.removeActiveObject( this );
                    this.game.setCell( this, 'Empty' );
                    return;
                }else if(this.animation === 5){
                    var cell = this.game.getCell( R.addDirection( this, this.direction ) );
                    if( cell.is( 'Empty' ) || cell.demolishable ){

                        if( cell.demolishable ){
                            R.behaviors.demolish( cell );
                            cell = this.game.getCell( R.addDirection( this, this.direction ) );
                            this.game.removeActiveObject( cell );
                        }
                        this.game.setCell( cell, 'Bullet', { bulletType: 'antimatter', direction: this.direction } );
                        return true;
                    }
                }
                    /*else if( cell.explodable ){

                }*/


            }
        },
        step: function(  ){
            return this.logics[ this.bulletType ].call( this );
        }
    };
} )(window.R);