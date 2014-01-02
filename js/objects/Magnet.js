(function( R ){
    'use strict';
    R.objects.Magnet = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = this.direction || 0;
        },
        dieCheck: function(  ){
            var direction = this.direction,
                delta = R.addDirection( 0, 0, direction ),
                robbo = this.game.robbo,
                robboDelta = { x: robbo.x - this.x, y: robbo.y - this.y },
                normalizedDelta = {
                    x: R.zeroSign( robboDelta.x ),
                    y: R.zeroSign( robboDelta.y )
                },
                cell,
                distance = 0;

            if( robbo.inMagnetField && robbo.inMagnetField !== this )
                return;

            if( normalizedDelta.x === delta.x && normalizedDelta.y === delta.y ){
                // if robbo is on line of magnet force in right direction
                cell = this.game.getCell( R.addDirection( this, direction ) );
                while( !cell.is( 'Robbo' ) ){
                    if( !cell.is( 'Empty' ) && !cell.is( 'Robbo' ) )
                        return;
                    cell = this.game.getCell( R.addDirection( cell, direction ) );
                    distance++;
                }
                // hehehe
                if( !robbo.noMove ){
                    robbo.noMove = true;
                    robbo.inMagnetField = this;
                }else if( distance ){
                    this.game.swap( robbo, this.game.getCell( R.addDirection( cell, (direction + 2) % 4 ) ) );
                }else{
                    this.game.restart();
                }
            }
        }
    };
} )(window.R);