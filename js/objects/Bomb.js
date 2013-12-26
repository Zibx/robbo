(function( R ){
    'use strict';
    R.objects.Bomb = {
        demolishable: true,
        explodable: true,
        demolish: function(  ){
            this.isExploding = true;
            this.game.addActionObject( this );
            this.animation = 2;
			this.step();

            return false;
        },
        explode: function( c ){
            if( this.isExploding )
                return false;

            this.isExploding = true;
            this.game.addActionObject( this );
            this.animation = 2;
            this.skipStep = true;
            return false;
        },
        step: function(  ){
            this.animation--;
            console.log('bomb')
            console.log(Ro.getAsciiMap());
            if( this.animation === 0 ){
                this.game.removeActiveObject( this );
                this.game.playSound('bomb');
				this.exploding([
					5, 4, 5,
					4, 3, 2,
					0, 0, 0
				]);
				return;
                
            }else if( this.animation === 1 ){
                this.exploding([ // right one
					0, 0, 0,
					0, 0, 2,
					5, 4, 5
				]);
            }
            console.log(Ro.getAsciiMap());
            //this.dead = true;

        },
        tryExplode: function( x, y, animation, skip ){
            if( animation !== 0 ){
                var cell = this.game.getCell( x, y );
                if( cell ){
                    if( cell.is('Explosion') ){
                        cell.animation = Math.min( cell.animation + animation, 5 );
                        //cell.innerSkip = false;
                    }else if( cell.is('Empty') || cell.explodable || cell === this ){
                        if( cell === this || !cell.explode || cell.explode(animation) !== false ){
                            if( cell === this )
                                this.game.removeActiveObject( this );
                            this.game.setCell( x, y, 'Explosion', { after: { type: 'Empty' }, animation: animation});
                        }
                    }
                }
            }
        },
        exploding: function( explodingMatrix ){
            // 0 1 2
            // 3 4 5
            // 6 7 8
            var x = this.x,
                y = this.y,
                i, j, b, a;

            for( b = 0; b < 9; b++ ){
                a = [2,1,0,5,4,3,8,7,6][b];
                i = x - 1 + ( a % 3 );
                j = y - 1 + ( ( a / 3 )|0 );

                this.tryExplode( i, j, explodingMatrix[a] );

/*
                if( cell && ( cell.is( 'Empty' ) || cell.is( 'Bullet' ) || cell.is( 'Explosion' ) || cell.explodable ) ){


                    if( cell.is('Explosion') ){
                        //this.game.setCell(cell, 'Wall');
                        //this.game.removeActiveObject( cell );
                        //this.game.setCell(i, j, 'Explosion', { after: { type: 'Empty' }, single: 'true', animation: 2 *//*+ ( a % 2 )*//* });
                        cell.animation+=1+( c % 2 );
                        cell.animation > 4 && (cell.animation = 4);
                    }else if ( !( cell.explode && cell.explode(c) === false )){
                        // this.game.removeActiveObject( cell );
                        this.game.setCell(i, j, 'Explosion', { after: { type: 'Empty' }, single: 'true', animation: 2 + ( c % 2 ) });
                    }


                }*/
                // 0 1 2
                // 3   5
                // 6 7 8
                //c++;
                //c === 4 && c++; // skip 4 cell
            }
        },
        movable: true,
        move: R.behaviors.move
    };
} )(window.R);