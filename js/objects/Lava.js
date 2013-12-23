(function( R ){
    'use strict';
    R.objects.Lava = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = 0;
        },
        step: function(){
            var cell = this.game.getCell( R.addDirection( this, this.direction ));
            console.log(this.direction)
            this.tryCell( cell );
        },
        tryCell: function( cell ){

            var direction = this.direction,
                antiDirection = ( this.direction + 2 ) % 4;
            if( !cell.is('Walls') ){
                if( !cell.is('Lava') ){
                    if( cell.demolishable && cell.demolish )
                        cell.demolish();
                    else if( cell.explodable && cell.explode )
                        cell.explode();

                    this.game.removeActiveObject( cell );
                    this.game.swap( this, this.game.getCell( cell ) );
                    this.game.setCell( cell, 'Empty' );


                }
            }else{

                do{
                    cell = this.game.getCell(R.addDirection( cell, antiDirection ) );
                }while( !cell.is('Walls') );
                this.tryCell( this.game.getCell(R.addDirection( cell, direction ) ) );
            }
        },
        explode: R.behaviors.die,
        explodable: true,
        demolish: R.behaviors.die,
        demolishable: true
    };
} )(window.R);