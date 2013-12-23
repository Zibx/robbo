(function( R ){
    'use strict';
    R.objects.Teleport = {
        init: function( x, y, game ){
            game.addActionObject(this);
            this.teleportX = x;
            this.teleportY = y;
        },
        explodable: true,
        explode: function(){
            var myX = this.x,
                myY = this.y,

                i, active = this.game.actionObjects, obj;
            // reassign teleport that have current as it's exit
            if( this.teleportX !== void 0 ){
                for( i = active.length; i; )
                    if(
                        ( obj = active[ --i ] ) &&
                        obj.is( 'Teleport' ) &&
                        obj.teleportX === myX &&
                        obj.teleportY === myY
                    ){
                        obj.teleportX = this.teleportX;
                        obj.teleportY = this.teleportY;
                    }
            }

            R.behaviors.die.call(this);
        },
        getNextCell: function( obj ){


            var tryCell, i;
            for( i = 0; i < 4; i++ ){
                tryCell = this.game.getCell( R.addDirection( this.teleportX, this.teleportY, obj.direction ) );
                if( tryCell.is( 'Empty' ) )
                    break;
                obj.direction = obj.direction ^ ( 3 - i % 2 );
            }

            if( tryCell.is( 'Empty' ) && this.game.getCell( this.teleportX, this.teleportY).is( 'Teleport' ) ){
                return tryCell;
            }else{
                for( i = 0; i < 4; i++ ){
                    tryCell = this.game.getCell( R.addDirection( this.x, this.y, obj.direction ) );
                    if( tryCell.is( 'Empty' ) )
                        break;
                    obj.direction = obj.direction ^ ( 3 - i % 2 );
                }

                return tryCell.is( 'Empty' ) ? tryCell : obj;
            }



        },
        transfer: function( obj ){
            var to = this.getNextCell( obj ),
                game = this.game,

                integrate = game.setCell.bind( game, to, 'Explosion', { after: { type: obj }, single: true, build: true, callback: function(  ){
                    obj.noMove = false;
                } }),
                desintegrateCfg = { after: { type: 'Empty' }, single: true, fromBullet: true};

            obj.noMove = true;
            this.game.playSound('teleport');
            if( obj === to )
                desintegrateCfg.callback = integrate;
            else
                integrate();

            game.setCell( obj, 'Explosion', desintegrateCfg );
        },
        setData: function( data  ){
            R.apply( this, data );

        }
    };
} )(window.R);