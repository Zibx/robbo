(function( R ){
    'use strict';
    R.objects.Butterfly = {
        explodable: true,
        explode: R.behaviors.die,
        demolishable: true,
        demolish: R.behaviors.die,
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = 0;
        },
        step: function(  ){

            var robbo = this.game.robbo,
                directions = [],
                direction,
                cell,
                lastMove = this.direction;

            robbo.x < this.x && directions.push( 2 );
            robbo.x > this.x && directions.push( 0 );
            robbo.y < this.y && directions.push( 3 );
            robbo.y > this.y && directions.push( 1 );

            if( Math.random() < 1/2 && lastMove !== false && directions.indexOf( lastMove ) > -1 ){
                direction = lastMove;
            }else{
                if( Math.random() < 1/6 ){
                    direction = directions[0];
                    while( directions.indexOf( direction ) !== -1 )
                        direction = R.rand( 0, 3 );
                }else
                    direction = directions[ R.rand( 0, directions.length - 1 ) ];
            }

            cell = this.game.getCell( R.addDirection( this, direction ) );
            if( cell.is( 'Empty' ) ){
                this.game.swap( this, cell );
                this.direction = direction;
            }else{
                this.direction = false;
            }

        },
        dieCheck: function(  ){
            R.behaviors.killRobbo.call( this );
        }
    };
} )(window.R);