(function(){
    'use strict';
    var R = window.R;

    R.apply( R, {
        directions: {
            right: 0,
            down: 1,
            left: 2,
            top: 3
        },
        addDirection: (function(  ){
            var xDirections = [ 1, 0, -1, 0 ],
                yDirections = [ 0, 1, 0, -1 ];


            return function( x, y, direction ){
                var out = {};
                if( typeof x === 'object' ){
                    direction = y;
                    y = x.y;
                    x = x.x;
                }
                out.x = x + xDirections[ direction ];
                out.y = y + yDirections[ direction ];
                return out;
            }
        })()
    } );

    // lookup by number gives name
    R.each( R.directions, function( k, v ){
        R.directions[ v ] = k;
    } );


    //COMMON BEHAVIORS
    R.behaviors = {
        move: function( direction ){
            var nextCell = this.game.getCell( R.addDirection(this, direction ) ),
                out;

            if( nextCell.is( 'Empty' ) ){
                this.game.swap( this, nextCell );
                this.game.playSound('box');
            /*}else if(nextCell.getNextCell){
                nextCell.transfer( this );
                out = false;*/
            }else{
                out = false;
            }
            return out;
        },
        demolish: function( cell ){
            if( cell.demolishable )
                if(!( cell.demolish && cell.demolish() === false )){
                    cell.dead = true;
                    cell.game.setCell( cell, 'Explosion', { after: { type: 'Empty' }, single: true, fromBullet: true } );
                    cell.game.playSound('gun_default');
                }

        },
        die: function(  ){
            //this.game.removeActiveObject( this );
            this.dead = true;
        },
        killRobbo: function(  ){
            var robbo = this.game.robbo,
                delta = [ Math.abs( robbo.x - this.x ), Math.abs( robbo.y - this.y ) ];
            delta[0] > delta[1] && (delta = [delta[1], delta[0]]);
            if( delta[0] === 0 && delta[1] === 1 && this.game.getCell( robbo ) === robbo /*maybe robbo is teleporting*/ )
                R.behaviors.demolish( robbo );
        },
        fire: function( direction, type ){
            direction === void 0 && (direction = this.direction);
            var cell = this.game.getCell( R.addDirection( this.x, this.y, direction ) );
            if( cell.is( 'Empty' ) ){
                this.game.setCell( cell, 'Bullet', { direction: direction, bulletType: type || 'gun' } );
                return true;
            }else if( cell.demolishable ){
                R.behaviors.demolish( cell );
            }else
                return false;
        },
        rightHandMove: function( clockwise ){
            var cell,
                add = clockwise ? 1 : -1, testDirection, i,
                out = [];

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
                    out.push(cell);
                }
            }
            return out;
        }
    }
})();