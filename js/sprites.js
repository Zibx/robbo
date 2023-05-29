(function( R ){
    'use strict';

    var Sprites = R.Sprites = function(){

    };
    Sprites.prototype = {
        src: 'icons32.png',
        gridSize: 34,
        cellSize: 32,
        offset: 2,
        draw: function( ctx, sprite, rect ){
            ctx.globalAlpha = 1;
            ctx.fillRect.apply( ctx, rect );
            ctx.globalAlpha = 1;
			      ctx.drawImage.apply(
                ctx,
                [this.scheme]
                    .concat( this.getRect( sprite, rect.slice(4) ) )
                    .concat( rect.slice(0,4) )
            );
        },
        drawFinal: function( ctx, spriteName, rect, sub, size ){
          size = size || 32;

          var sprite = this.win[spriteName];

          if(sub !== void 0) {
            sprite = sprite[ sub ];
          }

          ctx.drawImage.apply(
            ctx,
            [this.finalImg]
              .concat( [
                sprite[0] * 32,
                sprite[1] * 32,
                size,
                size
              ] )
              .concat( rect.slice(0,4) )
          );
        },
        modifyColors: function( data ){
            var canvas = this.scheme = document.createElement('canvas'),
                imageData,
                ctx = canvas.getContext('2d'),
                w = canvas.width = this.img.width,
                h = canvas.height = this.img.height,
                i, _i;
            //ctx.fillStyle = '#000000';
            //ctx.fillRect(0,0,w,h);
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
        getRect: function( sprite, advanced ){
            advanced = advanced && advanced[0];
            var offset = this.offset, grid = this.gridSize, cell = this.cellSize;
            return [
                offset + sprite[0] * grid,
                offset + sprite[1] * grid,
                advanced || cell,
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
                'I': [ 7, 6 ],
                'o': [ 5, 2 ],
                '-': [ 7, 1 ],
                'Q': [ 3, 0 ],
                'q': [ 9, 1 ],
                'P': [ 9, 5 ],
                'p': [ 8, 5 ],
                'S': [ 10, 1 ],
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
            return [ 6 - ( this.game.screw === 0 || this.fromQuestion ? step : 1 ), 1 ];
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

            return this.build ?
				[2-this.animation,7]
				:
				[3-Math.abs(3-Math.min(this.animation,5)),7];

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
        'hud.lives': [ 5, 3 ],

      win: {
          spaceship: [[0,0], [1,0], [2,0], [3,0]],
          floor: [5, 0],
          'robbo.front': [[0, 1], [2, 1]],
          'robbo.hand': [[1, 1], [3, 1]],
          'robbo.left': [[4, 1], [5, 1]],
          stardust: [4, 0]
      }
    };

    for( var i = 0; i < 10; i++) {
      R.Sprites.prototype[ 'hud.digit.' + i ] = [ 1 + i * 0.5, 6 ];
    }

    R.Sprites.prototype.finalImg = new Image();
    R.Sprites.prototype.finalImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAABACAYAAABMbHjfAAAAAXNSR0IArs4c6QAAA3NJREFUeJztncGN8kAMhcOvrQMJ0QYX2uAIZaCcEG1wpA0utIGQaIS9EucXT17bM5P4fbcoEI/R5r14PJlddF337gLp+970/dPp5DSSOmTPH7Fer4vGezweg+N/RaMT0hg/1gtYFQ6BFELe0aXJnv/UoQOQ1Cw6UANEK5yV6/X69bxVIbPnHw1rAEIqMnKAqSnebrf7el6CFDF7/rXxdgSZ73a7HRzTAUhqFn3fh/YBorEqovz81Ji6I0hFvt1uodeX0AFIasx9gNJYFW/qROd/uVwGx/v93nQ9LUixpUOgmu1+v389TwcgqfmRd8hms6k0lP+jVTx0frlcDo5Xq9Xg+Pl8/mmcUXjnfzweB8dS4UsrvjdI8SV0AJKa0SwQuoOiHcKqeGj8r9fr6/elI0iiHcKaPxr/+XweHNeeBZJoZ4VQzYCgA5DUqPsA2mes0kiFR2j7AEhhayMVHlHbAZDia88j5PfpACQ17muBvGctvOe5o9cCTT3/bNABSGrg+wBydV5rioawKl72/KOxdnK1sAYg5ANYA6BdCUq/0SNBCifHp60BsuVfGvl7R88y0gEI+QCuBkUK0rqiWJ+xs+cfTe2+Eh2ApGbUCZaK0ZrCaUGKiGZl5p5/7fysa3m0sAYg5IPJvRFGyCfatUMSOgBJDewEExKJdTWndTUpHYCkZvYOYN3lQNsZbi2+Fe345ecPh0P3frf7J0YHIKkx7w4tFUkqgMSqgNr43rscIEVuLb7EOh6UX7QDaOOjfOkAJDXmGqD2MyrjM74lPh2ApMZcA2h3SfCuARif8S3x6QAkNeq1QGivSbkvjTxvhfHbju9NdL50AJIatQOgO8yqCHIeV+7FGR0fwfix15egnfus46EDkNSo+wDaqlxb9aNOXnR8hHd8bedyavl7d4K986cDkNQ01wdANUB0fEl0/mjtztzzrx2fDkBSM5oFQgps3R/funYjOn7p/LWO0Nrv7/37aONLtOOhA5DUNLcrhHbWZ25kz780dACSGt4AJDW8AUhqitcApd8Y0sJn8FzQAUhqRg5gVUDvtSfeaB0IfR7N21vje+Mdv7X/m6wdDx2ApMZ9ZzjpGNGrE6OZWz5kCB2ApAbOAtVWQG38qY3X+3ql80fxSu8Mp82fDkBS494HqD3L4c3c8rFSui+C4lnHQwcgqfkFxhh7me2F860AAAAASUVORK5CYII=';

    R.Sprites.prototype.img = new Image();
    R.Sprites.prototype.img.onload = function(){
        R.loaded('sprites');
    };
    //R.sprites.img.crossOrigin = "Anonymous";
    R.Sprites.prototype.img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAAESCAMAAADALD6oAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAABAQEBERFxIUJjI6MhojbRsmfBwnfxwngwelGwS4CgLCAv7+AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgc+K8AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAAhLAAAISwGhi2UaAAAAB3RJTUUH2gEBFR4ANAGFeAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAZE0lEQVR4Xu2ai5YkuXFDvbZlr2T9/+/KRABIBl9ZWT1Zj1nxHnUxHiAZxGi6R330H39sPsI2/kMU4//1gCsK8GdizP/vhNh+yxwKlrxLoWdPoWIb33GPQs+eQoWM/6dADJQGf/yhIJCg2UHjdG4w5jBYyUBsv80SnlbVStWL0gnPKDy7V5WLApUVUG7jB55ReHavKhcFKiugPH64whYgN/+pNHIar8Kg4H6gc4Mxh1bJQGyPsfPJxr2rlsRhhSgVlHZnxCMSKp/c0p6BzLPnlT1EK6Dcxh+ofHJLewYyz55X9hCtgHJqvMIAeWs8yDn3PwZa3TxABUbubwLurS0xcczxaGZ9Dh1u6cFNPAOfPd4ZRzRGz9Z65wwqtvECN/EMfPZ4ZxwxGN2v9c4ZVCTjfX0GtdF44Br368zjeuP8ncafA51viU2FnI+3eJepBq9WRiuo2MYXcj7e4l2mGjys/+23oLKCimI8DvPVhs0ZEgTYVUcBUCgMnN9nfEgTqBmVToHOt8SmQs7bE2f4ReuV0QoqtvGFnLcnzqgGr1ZGK6jofrgC5LojGB8nYYC8XpRj4Pyq8WdQASWMMnkn4kdAp60NmI9n4NNoU6BSqXnm1cpoBRXbeIH5eAY+jTYFKpWaZ16tjFZQ0RmPWOcfzCrtjitAq5sHqNDhzbebXGeESjiVsKoqAGKgNCmAtga4SeWk0LYG1j3zarXujG18ATepnBTa1sC6Z16t1p3RGY8xsClTRzEeFnA/wLVmzKFVMhDbh1t66nNwv8k72wdHqaBUvSgJ7MdcSoP2DN/Q4pndde61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    ';//R.sprites.src;
})(window.R);
