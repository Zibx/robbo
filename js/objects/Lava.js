(function( R ){
    'use strict';
    R.objects.Lava = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.direction = this.direction || 0;
        },
        step: function(){
            var direction = this.direction,
                antiDirection = ( this.direction + 2 ) % 4,
                cell = this,

                arr = [], i, _i;
            // get full operating area
            do{
                cell = this.game.getCell(R.addDirection( cell, antiDirection ) );
            }while( !cell.is('Walls') && !cell.is('Out') );

            do{
                cell = this.game.getCell(R.addDirection( cell, direction ) );
                arr.push(cell)
            }while( !cell.is('Walls') && !cell.is('Out') );
            arr.pop();

            // tell other elements in this area that they shouldn't do this again
            for( i = 0, _i = arr.length ; i < _i; i++ )
                (cell = arr[ i ]).is( this.type ) && (cell.skipStep = true);


            var lastCell, lastCellType;
            lastCell = arr[ _i - 1 ];

            for( i = 0, _i = arr.length ; i < _i; i++ ){
                lastCellType = lastCell.type;
                cell = arr[ i ];
                if( lastCellType !== this.type && cell.type === this.type ){
                    this.game.removeActiveObject( cell );
                    this.game.setCell(cell, 'Empty');
                }else if( lastCellType === this.type && cell.type !== this.type ){
                    if( cell.demolishable && cell.demolish )
                        cell.demolish();
                    else if( cell.explodable && cell.explode )
                        cell.explode();

                    this.game.removeActiveObject( this.game.getCell( cell ) );
                    this.game.setCell(cell, 'Lava', {direction: this.direction});
                }
                lastCell = cell;
            }
            this.game.getCell(this).skipStep = false;
        },
        explode: R.behaviors.die,
        explodable: true,
        demolish: R.behaviors.die,
        demolishable: true
    };
} )(window.R);