(function( R ){
    'use strict';
    R.sprites = {
        src: 'icons32.png',
        gridSize: 34,
        cellSize: 32,
        offset: 2,
        draw: function( ctx, sprite, rect, blink ){
            var c = ((80+Math.random()*20)|0);

            ctx.fillStyle = blink;
            ctx.globalAlpha = 1;
            ctx.fillRect.apply( ctx, rect );
            //rect[0]+=8;
            //rect[1]+=8;
            //rect[2]/=4;
            //rect[3]/=4;
            ctx.globalAlpha = 1;
            !blink && ctx.drawImage.apply(
                ctx,
                [this.scheme]
                    .concat( this.getRect( sprite ) )
                    .concat( rect )
            );
        },
        modifyColors: function( data ){
            var canvas = this.scheme = document.createElement('canvas'),
                imageData,
                ctx = canvas.getContext('2d'),
                w = canvas.width = this.img.width,
                h = canvas.height = this.img.height,
                i, _i;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0,0,w,h);
            ctx.drawImage( this.img, 0, 0 );

            imageData = ctx.getImageData(0, 0, w, h);

            var hash = {
                    '16': {
                        '16': {
                            '16': R.colorToArray(data[4])
                        }
                    },
                    '254': {
                        '254': {
                            '2': R.colorToArray(data[1])//+
                        }
                    },
                    '2': {
                        '194': {
                            '2': R.colorToArray(data[2])//+
                        }
                    },

                    '0': {
                        '0': {
                            '0': R.colorToArray(data[0])
                        }
                    },
                    '28': {
                        '39': {
                            '131': R.colorToArray(data[3])
                        }
                    },
                    '138': {
                        '54': {
                            '2':  R.colorToArray((data[5]||'')+'ff0000')
                        }
                    }
                },
                imageDataData = imageData.data,
                tmp;
            for( i = 0, _i = imageDataData.length; i < _i; i+=4 )
            {

                if(
                    (tmp = hash[ imageDataData[i] ]) &&
                    (tmp = tmp[ imageDataData[i + 1] ]) &&
                    (tmp = tmp[ imageDataData[i + 2] ])
                ){
                    imageData.data[i] = tmp[0];
                    imageData.data[i+1] = tmp[1];
                    imageData.data[i+2] = tmp[2];
                    imageData.data[i+3] = 255;
                }
            }
            // put the altered data back on the canvas
            ctx.putImageData(imageData,0,0);

        },
        resolveSprite: function( obj, step, step2 ){
            var sprite = this[ obj.type ];
            sprite.ascii && ( sprite = sprite.ascii[ obj.ascii ] );
            return typeof sprite === 'function' ? sprite.call( obj, step, step2 ) : sprite;
        },
        getRect: function( sprite ){
            var offset = this.offset, grid = this.gridSize, cell = this.cellSize;
            return [
                offset + sprite[0] * grid,
                offset + sprite[1] * grid,
                cell,
                cell
            ];
        },
        getHash: function( sprite ){
            return sprite[0] + ',' + sprite[1];
        },

        Robbo: function(  ){
            if( this.inited )
                return [ this.direction * 2 + this.stepAnimation, 5 ];
            else
                return [ 5, 1 ]; //spaceship
        },

        Empty: [ 10, 2 ],

        Walls: {
            ascii: {
                'O': [ 2, 0 ],
                'o': [ 5, 2 ],
                'Q': [ 3, 0 ],
                'q': [ 9, 1 ],

                '-': [ 7, 1 ],
                'S': [ 10, 1 ],


                'P': [ 9, 5 ],
                'p': [ 8, 5 ],
                's': [ 10, 0 ],
                'y': [9,5],
                'Y': [9,6],
                'z': [9,7],
                'Z': [8,6],

                'i': [8,7],

                'J': [10,6],
                'j': [10,7]

            }
        },

        Ground: [ 4, 2 ],

        Stone: [ 6, 0 ],

        PushableStone: [ 8, 1 ],

        Door: [ 9, 0 ],

        Spaceship: function( step ){
            return [ 6 - ( this.game.screw === 0 ? step : 1 ), 1 ];
        },

        Question: [ 0, 1 ],

        Bomb: [ 8, 0 ],

        Key: [ 7, 0 ],

        Screw: [ 4, 0 ],

        Turrel: function(  ){
            return [ 5+this.direction, 4 ];
        },

        Ammo: [ 5, 0 ],

        Teleport: function( step ){
            var spriteX = step % 4 > 1;
            this.BG = '#fe'+ (step? 'e': 'c');
            return [ step, 4 ];
        },

        Explosion: function(  ){
            //console.log(this.animation)
            return [3-Math.abs(3-Math.min(this.animation,5)),7];
            /*var animation = this.animation;
            //console.log(this.animation)
            return this.fromBullet ?
                [  Math.abs( 2 - animation ) + 1, 2 ] :

                [ 3 - this.animation, 7 ];//(this.build ? 2-this.animation :*/
        },

        Bullet: ( function(){
          var fn,
              spriteFns = {
                laser: fn = function( step,step2 ){

                    return [ ( this.direction % 2 ) * 2 + (step2 % 4 < 2 ? 1: 0), 3 ];
                },
                gun: fn,
                antimatter: function(){
                    return [[0,1,2,3,2,1,0][this.animation],7];
                }
              };

            return function( step, step2 ){
                return spriteFns[ this.bulletType ].call( this, step, step2 );
            };
        } )(),

        Mustache: function( step, step2 ){
            return [ 3 + this.animationFrame, 1 ];
        },

        Butterfly: function( step ){
            return [ 8 + step, 2 ];
        },

        Bear: function( step, step2 ){
            return this.clockwise ?
                [ 1 + this.animationFrame, 1 ]
                    :
                [ 6 + this.animationFrame, 2 ];
        },

        Lava: function( step ){
            return [ 9, 3 + step ];
        },

        Magnet: function(){
            return [[0,0],[],[1,0],[]][this.direction];
        },

        'hud.screw': [ 4, 3 ],
        'hud.ammo': [ 7, 3 ],
        'hud.keys': [ 6, 3 ],
        'hud.planet': [ 8, 3 ],
        'hud.lives': [ 5, 3 ]
    };


    R.sprites.img = new Image();
    R.sprites.img.onload = function(){
        R.loaded('sprites');
    };
    //R.sprites.img.crossOrigin = "Anonymous";
    R.sprites.img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAAESCAMAAADALD6oAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABAQEBERFxIUJjI6MhojbRsmfBwnfxwngwelGwS4CgLCAv7+AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgc+K8AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAAhLAAAISwGhi2UaAAAAB3RJTUUH2gEBFR4ANAGFeAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAZAElEQVR4Xu2ai5YkN3JDLdtra9f7/7+7JgJAMsgks1g9WY/R8h51MR4gGcRoukdz9B9/bD7CNv5DFOP/9YAVBfgzcc7/74LYfsscCqa8S6FnD6FiG99xj0LPHkKFjP+nQAyUBn/8oSCQoNlB43RucM5hsJITsf02S3haVStVL0oXPKPw7F5VLgpUZkC5jT/xjMKze1W5KFCZAeXxwxW2ALn5T6WR03gVTgruBzo3OOfQKjkR22PsfLJxb9WSOKwQpYLS7ox4RELli1vaM5B59ryyh2gGlNv4A5UvbmnPQObZ88oeohlQDo1XGCBvjQc55/7HQKubT1CBkfubgHtzS0wcczyaWZ9Dh1t6cBPPwGePd8YRjdGjtd45goptvMBNPAOfPd4ZR5yM7td65wgqkvG+PoPa2XjgGvfrzON64/ydxl8DnW+JTYWcn2/xLlMNnq2MZlCxjS/k/HyLd5lq8Gn9b78FlRlUFONxmK82bI6QIMCuOgqAQmHg/D7jQ5pAzah0CXS+JTYVct6eOMIvmq+MZlCxjS/kvD1xRDV4tjKaQUX3wxUg1x3B+XESBsjrRTkGzleNv4IKKGGUyTsRPwI6bW3AfDwDn0abApVKzTPPVkYzqNjGC8zHM/BptClQqdQ882xlNIOKznjEOv9gVGl3rACtbj5BhQ5vvt3kOiNUwqmEVVUBEAOlSQG0NcBNKieFtjWw7plnq3VXbOMLuEnlpNC2BtY982y17orOeIyBTZk6ivGwgPsBrjXnHFolJ2L76Zae+hzcb/LO9sFRKihVL0oC+zGX0qA9wze0eGZ3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';//R.sprites.src;
})(window.R);
