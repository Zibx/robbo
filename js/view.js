/*[level]
 0
 [colour]
 484848,A4AFFF,549A40,601721,101010
 [size]
 16.31
 [author]
 Janusz Pelc
 [level_notes]
 level_notes relating to this level can go here.
 [data]
 ...........................
 .#.#.###.#...#.R..##.......
 .#.#.#...#...#...#..#......
 .###.&##.#...T...#..#......
 .#.#.#...#...T...#..#.##...
 .#.#.###.###.##%..##...#...
 ......................#....
 .#.#..#..##..##...##...~...
 .#.#.#.#.#.#.#.#.#..#..~...
 .###.###.&#..##..####..~...
 .#.#.#.#.#.#.#.#.#..#......
 .#.#.#.#.##..#.#.#..#..!...
 ...........................
 .###....##..#...#..........
 ..#....#..#.##.##..........
 ..#....###M.#.#.#..........
 ..#....#..#.#...#..........
 .###...#..#.#...#..........
 ...........................
 .~~...~~..~~..~~...~~......
 .~.~.~..~.~.~.~.~.~..~.....
 .~~..~..~.~~..~~..~..~.....
 .~.~.~..~.~.~.~.~.~..~.....
 .~.~..~~..~~..~~...~~......
 ...........................
 [additional]
 4
 13.2.&.1.0
 7.2.&.1.1
 13.10.}.1.1.1.0.0.0
 0.22.}.0.0.1.0.0.0
 [end]*/
(function( R ){
    'use strict';
    var View = function( cfg ){
            R.apply( this, cfg );
            this.initLayout();
            this.attachEvents();
            this.step = 0;
            this.gap = [ 0, 9 ];
            this.scrollTop = 0;
            this.blink = 0;
            //this.cellSize = R.sprites.cellSize;
        },
        sprites = R.sprites;

    View.prototype = {
        cellSize: 32,
        set: function( key, value ){
            this[ key ] = value;
            this[key+'Set'] && this[key+'Set'](value);
            this.redrawHud( key, value );
        },
        mapColorsSet: function( data ){
            R.sprites.modifyColors( data );
			      this.canvasCtx.fillStyle = this.bgColor = data[0];
            if(this.controller.editMode) {
              this.mapCanvasCtx.fillStyle = this.bgColor = data[ 0 ];
            }
            this.lastColors = data;
            this.legendCtx.fillStyle = this.lastColors[4];
            this.legendCtx.fillRect(0,0,512,64);
            this.renderTo.style.background = this.lastColors[4];
        },
        cartoon: function(){
          this.animation = false;
          this.controller.scrolled = true;
          this.gap = [0, 9];
          this.canvasHolder.scrollTop = 0;
          this.canvasCtx.fillStyle = '#000000';
          var w = 512, h = 324, cellSize = this.cellSize;

          this.canvasCtx.fillRect(0,0,w, h);
          this.legend.style.visibility = 'hidden';
          var animationFrames = [];
          var animationH = 8;
          var drawAreaTop = h/2 - animationH * cellSize/2,
              _self = this;

          for(var x = 0; x < w; x += cellSize){
            R.sprites.drawFinal(this.canvasCtx, 'floor', [x,drawAreaTop + 7*cellSize,cellSize,cellSize]);
          }
          var drawStarDust = function(){
            var dusts = [[1,0], [5, 1], [27,1], [31,2], [20,3],[9, 4], [29,6], [6,8], [19,8], [26,9], [1,10]]
            dusts.forEach(function(dust){
              R.sprites.drawFinal(_self.canvasCtx, 'stardust', [dust[0]*cellSize/2,drawAreaTop + dust[1]*cellSize/2,cellSize/2,cellSize/2], void 0, 16);
            });
          }
          drawStarDust();
          var pointer = 0;
          var lastFrame = [];
          var undraw = [];
          var draw = function(obj){
            var rect = [obj.x*cellSize/2,drawAreaTop + obj.y*cellSize/2,cellSize,cellSize];
            undraw.push(rect);
            R.sprites.drawFinal(_self.canvasCtx, obj.sprite, rect, obj.variant, 32);
          };
          var spaceshipLeft = {x: 12, y: -1, sprite: 'spaceship', variant: 0};
          var spaceshipRight = {x: 14, y: -1, sprite: 'spaceship', variant: 1};

          var robbo = {x: 31, y: 12, sprite: 'robbo.left', variant: 0, hidden: false};

          this.finalFrameCounter = 0;
          var _animate = function(){
            _self.canvasHolder.scrollTop = 0;
            undraw.forEach(function(rect){
              _self.canvasCtx.fillRect.apply(_self.canvasCtx, rect);
            });
            undraw.length = 0;


            var frame = _self.finalFrameCounter;
            var handWaving = 20;
            var goingToTheShip = 12;

            if(frame < 9){
              robbo.x = 30 - frame;
              robbo.variant = 1 - (frame % 2);
            }else if(frame === 9){
              robbo.x--;
              robbo.sprite = 'robbo.front';
              robbo.variant = 1;
            }else if(frame < 12){
              robbo.sprite = 'robbo.front';
            }else if(frame < 23){
              robbo.sprite = 'robbo.front';
              robbo.variant = (frame % 2);
            }else if(frame < 23+handWaving){
              robbo.sprite = 'robbo.hand';
              robbo.variant = 1 - (frame % 2);
            }else if(frame === 23 + handWaving){
              robbo.sprite = 'robbo.left';
              robbo.variant = (frame % 2);
            }else if(frame < 19 + handWaving + goingToTheShip){
              robbo.sprite = 'robbo.left';
              robbo.x = 21 + 23 + handWaving - frame;
              robbo.variant = (frame % 2);
            }else{
              robbo.hidden = true;
            }

            if(frame >= 9 && frame <= 23 + handWaving){
              robbo.x = 21;
            }

            var spaceshipEnter = 11;
            if(frame >= spaceshipEnter && frame < 24){
              spaceshipLeft.y = spaceshipRight.y = frame - spaceshipEnter;
            }else if(frame >= spaceshipEnter && frame < 21+goingToTheShip+handWaving){
              spaceshipLeft.y = spaceshipRight.y = 12;
            }else{
              spaceshipLeft.y = spaceshipRight.y = 11+ 21+goingToTheShip+handWaving-frame;
            }
            spaceshipLeft.variant = ((frame/2-.5)|0) % 2 ? 2 : 0;
            spaceshipRight.variant = ((frame/2-.5)|0) % 2 ? 3 : 1;


            !robbo.hidden && draw(robbo);

            if(frame >= spaceshipEnter){
              draw(spaceshipLeft);
              draw(spaceshipRight)
            }

            _self.finalFrameCounter++;
            if(_self.finalFrameCounter < 75) {
              setTimeout( animate, 1000 / 6 );
            }else{
              var playAgain = document.createElement('div');
              playAgain.className = 'playAgain playAgain-invisible';
              playAgain.innerText = 'Play again?'
              playAgain.addEventListener('click', function(){
                 _self.controller.cartoonStep = false;
                _self.controller.loadLevel( 1 );
                _self.canvasHolder.removeChild(playAgain);
                _self.controller.mainLoop()
              });
              _self.canvasHolder.appendChild(playAgain);
              setTimeout(function(){
                playAgain.className = 'playAgain playAgain-visible';
              }, 50);
            }
          };

          var animate = function(){
            requestAnimationFrame(_animate);
            //_animate();
          };


          setTimeout(animate, 1200);

        },
        scroll: function(  ){
            var y = this.controller.robbo.y,
                gap = this.gap,
                originalGap = [gap[0],gap[1]];//,
                //animateGap = this.animateGap = gap.slice();
            if( y < gap[0] + 2 ){
                if( gap[0] > 0 ){
                    gap[0]-=3;
                    gap[1]-=3;
                }
                if( gap[0] < 0 ){
                    gap[1] -= gap[0];
                    gap[0] = 0;
                }
                !this.animation && this.animateScroll();
            }else if( y > gap[1] - 2 ){
                if( gap[1] < this.controller.map.length ){
                    gap[0]+=3;
                    gap[1]+=3;
                }
                if( gap[1] >= this.controller.map.length ){
                    gap[0] -= gap[1] - this.controller.map.length;
                    gap[1] -= gap[1] - this.controller.map.length;
                }
                !this.animation && this.animateScroll();
            }
            if( !this.controller.scrolled && originalGap[0] === gap[0] ){
                this.controller.scrolled = true;
                this.controller.robbo.scrolled = true;
                this.controller.fire('scrolled');
            }

        },
        animateScroll: function(  ){
            this.animation = true;
            var delta = this.gap[0]*this.cellSize - this.scrollTop;
            if( Math.abs( delta ) < 10  ){
                this.scrollTop = ( this.canvasHolder.scrollTop += delta );
                this.animation = false;
            }else{
                this.scrollTop = ( this.canvasHolder.scrollTop += R.sign( delta ) * this.cellSize/4 );
                window.setTimeout( this.animateScroll.bind(this), 800 / 20 );
            }

        },
        redrawHud: function( name, value ){
            var x = {screw: 1, ammo: 4, keys: 7, lives: 10, planet: 13}[name],
                cellSize = this.cellSize;
            if(!x)return;
            this.legendCtx.fillStyle = this.lastColors[4];
            this.legendCtx.fillRect(
                x*32+32,
                16,
                32,32
            );
            this.legendCtx.fillStyle = '#fff';

            sprites.draw(
                this.legendCtx,
                sprites.resolveSprite( {type: 'hud.digit.'+ (((value % 100)/10)|0) } ),
                [ x*32+36, 16, cellSize/2, cellSize, cellSize/2 ]
            );
            sprites.draw(
                this.legendCtx,
                sprites.resolveSprite( {type: 'hud.digit.'+ (value % 10) } ),
                [ x*32+32+21, 16, cellSize/2, cellSize, cellSize/2 ]
            );

            /*this.legendCtx.fillText(
                value,
                x*32+10,
                40
            );*/
        },
        updateHud: function(  ){
            var c = 1, cellSize = this.cellSize;

            'screw,ammo,keys,lives,planet'.split(',').forEach(function( key ){
                sprites.draw(
                    this.legendCtx,
                    sprites.resolveSprite( {type: 'hud.' + key } ),
                    [ cellSize*c, cellSize/2, cellSize, cellSize ]
                );
                c += 3;
                this.redrawHud( key, this[ key ] );
            }.bind(this) )
        },
        attachEvents: function(  ){
            this.controller.on( 'gameSet', this.set, this );
            this.controller.on( 'robboSet', this.set, this );
            this.controller.on( 'kill', function(){
                this.controller.playSound('kill');
            }, this );
            this.controller.on( 'screwsCollected', function(){
                if( !this.controller.screwsCollected ){
                    this.controller.screwsCollected = true;
                    this.controller.playSound('capsule');
                    this.blink = 3;
                }
            }, this );
        },
        initLayout: function(  ){

            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('width', 32*16+'');
            this.canvas.setAttribute('height', 32*31+'');
            this.canvas.style.background = '#eee';
            this.canvasCtx = this.canvas.getContext('2d');

            this.canvasHolder = document.createElement('div');

            this.legend = document.createElement('canvas');
            this.legend.setAttribute('width', 32*16+'');
            this.legend.setAttribute('height', 32*2+'');
            this.legendCtx = this.legend.getContext('2d');

            this.legend.style.background = '#888';

            this.canvasHolder.appendChild( this.canvas );
            R.apply( this.canvasHolder.style, {
                height: 32*10 + 4 + 'px',
                width: 32*16 + 'px',
                overflow: 'hidden',
                position: 'relative'
            });
            this.renderTo.innerHTML = '';
            this.renderTo.style.padding = '48px 96px';
            this.renderTo.style.display = 'inline-block';
            this.renderTo.appendChild( this.canvasHolder );
            this.renderTo.appendChild( this.legend );

            if( this.controller.editMode ){
                this.mapCanvas = document.createElement('canvas');
                this.mapCanvas.setAttribute('width', 16*16+'');
                this.mapCanvas.setAttribute('height', 16*31+'');
                this.mapCanvas.style.background = '#eee';
                this.mapCanvasCtx = this.mapCanvas.getContext('2d');
                R.apply( this.renderTo.style, {
                    width: (32*16+32*8+4+96) + 'px',
                    position: 'relative'
                });
                R.apply( this.mapCanvas.style, {
                    left: 32*16 + 48+96 + 'px',
                    top: 0,
                    position: 'absolute'
                });
                this.renderTo.appendChild( this.mapCanvas );
            }
        },
        redraw: function( obj ){
            var x = obj.x,
                y = obj.y,
                yHash = this.changes[ y ] || (this.changes[ y ] = {});
            yHash[x] = obj;
            obj.lastSprite = false;
        },
        clear: function(  ){
            this.changes = {};
            R.apply( this, {
                screw: 0,
                ammo: 0,
                keys: 0,
                lives: 0,
                planet: 0
            })
        },
        _drawObject: function( obj, sprite ){
            var cellSize = this.cellSize;

            sprites.draw(
                this.canvasCtx,
                sprite,
                [
                    obj.x * cellSize,
                    obj.y * cellSize,
                    cellSize,
                    cellSize
                ]
            );
            if( this.controller.editMode ){
                sprites.draw(
                    this.mapCanvasCtx,
                    sprite,
                    [
                        obj.x * cellSize/2,
                        obj.y * cellSize/2,
                        cellSize/2,
                        cellSize/2
                    ]
                );
                if( obj.is('Teleport') ){
                    var ctx = this.mapCanvasCtx;
                    ctx.strokeStyle = '#ff0';
                    ctx.strokeWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo((obj.x+0.5) * cellSize/2,(obj.y+0.5) * cellSize/2);
                    ctx.lineTo((obj.teleportX+0.5) * cellSize/2,(obj.teleportY+0.5) * cellSize/2);
                    ctx.stroke();
                }
            }

        },
        drawObject: function( obj ){
            if( obj === false )return;
            var sprite = sprites.resolveSprite( obj, this.step % 8 > 3 ? 1 : 0, this.step ),
                hash = sprites.getHash( sprite );
            if( !obj.lastSprite || obj.lastSprite !== sprites.getHash( sprite ) || this.blink ){
                !obj.dead && this._drawObject( obj, sprite );
                obj.lastSprite = hash;
            }
        },
        fullRedraw: function(  ){
            var map = this.controller.map, mapRow, i, j;
            for( i in map )
                if( map.hasOwnProperty( i ) )
                    for( j in (mapRow = map[ i ] ) )
                        if( mapRow.hasOwnProperty( j ) )
                            this.drawObject( mapRow[ j ] );
        },
        _fullRedraw: function(  ){
            var map = this.controller.map, mapRow, i, j;
            for( i in map )
                if( map.hasOwnProperty( i ) )
                    for( j in (mapRow = map[ i ] ) )
                        if( mapRow.hasOwnProperty( j ) ){
                            mapRow[ j ].lastSprite = false;
                            this.drawObject( mapRow[ j ] );
                        }
        },
        drawChanges: function( animateStep ){
            if( !animateStep ){
                this.step++;
                //120 % 2, 3, 4, 5, 6, 8, 12, 15, 20, 24, 30, 40, 60 === 0, so it would cover all animations that we need
                this.step === 120 && (this.step = 0);
            }

            var drawObject = this.drawObject.bind(this),
                i, j, changeRow,
                changes = this.changes,
                changeCounter = 0;
            if( this.blink ){
                this.blink--;
				if( this.blink > 1 ){
					this.canvasCtx.fillStyle = '#ffffff';
                    if( this.controller.editMode )
                        this.mapCanvasCtx.fillStyle = '#ffffff';
                }
                this.fullRedraw();
				this.canvasCtx.fillStyle = this.bgColor;
                if( this.controller.editMode )
                    this.mapCanvasCtx.fillStyle = this.bgColor;
            }else{
                this.controller.actionObjects.forEach( drawObject );

                for( i in changes )
                    if( changes.hasOwnProperty( i ) )
                        for( j in ( changeRow = changes[ i ] ) )
                            if( changeRow.hasOwnProperty( j ) ){
                                this.drawObject( changeRow[ j ] );
                                changeCounter++;
                            }
            }
            this.changes = {};

            this.scroll();

        }
    };
    R.View = View;
    R.loaded('view');
} )(window.R);