(function( R ){
    'use strict';
	var requestAnimationFrame = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
    var Controller = function( cfg ){
            R.apply( this, cfg );
            this._events = {};
            R.afterLoad( ['sprites'], function( ){ R.include(['js/view.js']); });
            R.afterLoad( ['objects', 'sprites', 'view'], this.init.bind(this) );

        },
        objects = R.objects,
        ascii = R.ascii;

    Controller.prototype = {
        screw: 0,
        lives: 0,
        init: function(  ){
            this.ObjectFactory = R.objects.factory;
            this.sound = !('nosound' in R.getLocationHash());

            this.initView();
            if( 'load' in this ){
                this.loadLevel( this.load );
                this.mainLoop();
            }
        },
        initView: function(  ){
            this.view = new R.View({
                renderTo: this.renderTo,
                controller: this
            });

			var _drawChanges = function(){
				this.view.drawChanges( this.animateStep )
			}.bind(this);
			this.drawChanges = function(){
				requestAnimationFrame( _drawChanges );
			};
        },
        clear: function(  ){
            this.map = [];
            this.screw = 0;
            this.screwsCollected = false;
            this._delayed = [];
            this.actionObjects = [];
            this.view.clear();
            this.levelLoaded = false;
            this.scrolled = false;
        },

        loadLevel: function( cfg ){
            var controller = this;
            this.clear();

            if( typeof cfg === 'number' ){
                this._currentLevel = cfg;
                this.loadLevel( this.maps[ cfg - 1 ] );
                return;
            }

            cfg.map
                .split('\n')
                .forEach(function( textRow, y ){
                    controller.map[y] = [];
                    textRow
                        .split('')
                        .forEach(function( el, x ){
                            controller.setCell( x, y, ascii[el], {ascii: el} );
                            el === '@' && cfg.data.push({x:x,y:y,data: {clockwise: true}});
                            el === '*' && cfg.data.push({x:x,y:y,data: {clockwise: false}})
                        } );
                } );

            cfg.data
                .forEach(function( row ){
                    R.apply( controller.getCell( row ), row.data );
                } );

            this.levelLoaded = true;
            this.view.screw = this.screw;
            this.view.planet = this._currentLevel;
            var colors = cfg.colour || ['cccccc,A5F4CA,66B58B,484848,101010'];
            this.view.set('mapColors',
                (colors[0]+',A5F4CA,66B58B,484848,101010').split(',').map(function(el){return '#'+el;}));
            //this.view.bgColor = cfg.colour || 'ccc';
            this.view.updateHud();
            this.afterLoad && this.afterLoad();
        },
        restart: function(  ){
            this.fire('kill');
            var robbo = this.robbo,
                game = this;
            robbo.noMove = true;
            this._delayed = [];

            this.setCell( robbo, 'Explosion', {
                single: true,
                after: { type: 'Empty' }
            });
            this.delayedFn(function(  ){
                this.actionObjects.forEach(function( obj ){
                    obj && (obj.dead = true);
                });
                this.actionObjects = [];
                game.setCell( robbo, 'Empty' );
                this.map.forEach(function(row,j){
                    row.forEach(function(obj,i){
                        if( !( obj.is('Empty') || obj.is( 'Walls' ) ) ){
                            game.setCell(i,j,'Explosion', {
                                animation: R.rand(1,2),
                                single: true,
                                after:{ type: 'Empty' }
                            });
                        }
                    });
                });
                this.delayedFn(function(  ){
                    this.loadLevel( this._currentLevel );
                }, 6)
            }.bind(this), 6);
        },
        finishLevel: function(  ){
            var col = this.map[0].length - 1,
                fn = function(  ){
                    this.map.forEach(function(row,j){
                        this.removeActiveObject( this.getCell( col, j ) );
                        this.setCell( col, j, 'Walls', {ascii: '-'} )
                    }.bind(this));
                    col--;
                    if( col === -2 )
                        this.loadLevel( this._currentLevel + 1 );
                    else
                        this.delayedFn( fn );
                }.bind(this);
            fn();


        },

        swap: function( obj1, obj2 ){
            var tmp = [ obj1.x, obj1.y, obj2.x, obj2.y ];
            this.map[ obj1.y ][ obj1.x ] = obj2;
            this.map[ obj2.y ][ obj2.x ] = obj1;
            obj1.oldX = obj1.x;
            obj1.oldY = obj1.y;

            obj2.oldX = obj2.x;
            obj2.oldY = obj2.y;

            obj1.x = tmp[2];
            obj1.y = tmp[3];
            obj2.x = tmp[0];
            obj2.y = tmp[1];

            this.view.redraw( obj1 );
            this.view.redraw( obj2 );
        },
        getCell: function( x ){
            var y = arguments[1],
                out;
            if( y === void 0 ){
                y = x.y;
                x = x.x;
            }
            out = (this.map[y] || {})[x];
            return out === void 0 ? this.ObjectFactory( objects.Out, x, y ) : out;
        },
        setCell: function( x, y, obj, data ){
            var letter;
            if( typeof x === 'object' ){
                data = obj;
                obj = y;
                y = x.y;
                x = x.x;
            }

            if( typeof obj === 'string' ){
                letter = obj;
                obj = this.map[y][x] = this.ObjectFactory( objects[obj], x, y, data );
                //obj.ascii = letter;
            }else{
                this.map[y][x] = obj;
                obj.x = x;
                obj.y = y;
                data && R.apply( obj, data );
            }

            obj.drawOnCreate !== false && this.view.redraw( obj );
            return obj;
        },
        editMode: true,
        soundCache: {},
        playSound: function( name ){
            // Audio element download sound each time when we create it.
            // So I made a solution that hang out only sounds objects
            // that can be played simultaneously
            if( !this.sound )
                return;

            var sounds, sound, paused, i, _i;
            if( !(sounds = this.soundCache[ name ]) ){
                sounds = this.soundCache[ name ] = [new Audio('sound/'+name+'.ogg')];
            }
            paused = false;
            for( i = 0, _i = sounds.length; i < _i; i++ ){
                sound = sounds[i];
                if( sound.paused ){
                    paused = sound;
                    break;
                }
            }
            if( !paused )
                sounds.push( paused = sounds[0].cloneNode() );

            paused.play();
        },
        removeActiveObject: function( obj ){

            var index = this.actionObjects.indexOf( obj );
            // if we call remove from step => we should skip some objects in cycle
            if( index !== -1 )
                this.actionObjects[ index ].dead = true;
        },
        addActionObject: function( obj ){
            this.actionObjects.push( obj );
        },
        moveMe: function(  ){

            var robbo = this.robbo,
                view = this.view;
            !robbo.noMove &&
                [ 'right','down','left','up', 'D', 'S', 'A', 'W' ].forEach( function( which, i ){
					which.length === 1 && (which = which.charCodeAt(0));
                    if( R.keyboard.get( which ) ){
                        robbo.direction = i % 4;
                        view.redraw( robbo );
                        if( R.keyboard.get( 'shift' ) )
                            robbo.fire = true;
                        else
                            robbo.move = true;
                    }
                } );

            R.keyboard.get( 'R'.charCodeAt(0) ) && this.restart();
            R.keyboard.get( 'K'.charCodeAt(0) ) && this.finishLevel();


            R.keyboard.get( '8'.charCodeAt(0) ) && this.restart();
            R.keyboard.get( '9'.charCodeAt(0) ) && this.finishLevel();
        },

        moveWorld: function( type, check ){
            var actionObjects = this.actionObjects, i, _i, obj, dead;
            if( !this.scrolled )
                return;

            var objectList = [],
                order, lastOrder = 256*256,
                needSort = false,
                deadList = [];
            for( i = 0, _i = actionObjects.length; i < _i; i++ ){
                obj = actionObjects[i];
                order = (256 - obj.y) * 256 + ( 256 - obj.x );
                objectList.push({
                    itterateOrder: order,
                    obj: obj,
                    id: i
                });
                if( lastOrder < order ){
                    needSort = true;
                }
                lastOrder = order;
            }
            if( needSort ){
                objectList.sort( function( a, b ){ return b.itterateOrder - a.itterateOrder });
                actionObjects = this.actionObjects = [];
                for( i = 0, _i = objectList.length; i < _i; i++ ){
                    actionObjects.push( objectList[ i ].obj );
                }
            }
            for( i = 0, _i = objectList.length; i < _i; i++ ){
                obj = objectList[i].obj;
                if(!obj){
                    dead = true;
                }else{
                    if( type && obj.is(type) !== check )
                        continue;
                    dead = obj.dead || false;
                    if( !obj.skipStep ){
                        dead = dead || (obj.step && obj.step() === false);

                    }else
                        obj.skipStep--;
                }
                if( dead ){
                    deadList.push( i );
                }
            }
			for( i = 0, _i = objectList.length; i < _i; i++ ){
				obj = objectList[i];
				if( obj && obj.skipStep )
					obj.skipStep--;
			}
            for( i = deadList.length - 1; i > -1; i-- ){
                actionObjects.splice( deadList[i], 1 );
            }

        },
        getAsciiMap: function(){
            return this.map.map(function(el){ return el.map(function(el){return (R.asciiHash[ el.ascii ] || el.ascii || R.asciiHash[ el.type ])+ (el.animation === void 0 ? ' ': 3-Math.abs(3-Math.min(el.animation,5)))}).join('');}).join('\n');
        },
        getActiveObjectsText: function(){
            return this.actionObjects.map( function(el){ return el.type; }).join(', ')
        },
        animate: function(  ){
            var actionObjects = this.actionObjects, i, _i, obj;

            for( i = 0, _i = actionObjects.length; i < _i; i++ ){
                if( !(obj = actionObjects[i]) ) continue;
                obj.animate && obj.animate();
            }
            this.robbo.animate();
        },
        dieCheck: function(  ){
            var actionObjects = this.actionObjects, i, _i, obj;

            for( i = 0, _i = actionObjects.length; i < _i; i++ ){
                if( !(obj = actionObjects[i]) ) continue;
                obj.dieCheck && obj.dieCheck();
            }
        },
        delayedFn: function( fn, delay ){
            this._delayed.push( {fn: fn, delay: delay || 0})
        },
        callDelays: function(  ){
            var _delayed = this._delayed, i, item;
            for( i = _delayed.length; i; ){
                item = _delayed[--i];
                if( item.delay === 0 ){
                    item.fn.call( this );
                    _delayed.splice( i, 1 );
                }else
                    item.delay--;
            }
        },
        saveMap: function(  ){
            var notIn = {game:1, ascii:1, lastSprite:1,x:1,y:1,BG:1,oldX:1,oldY:1, animationFrame:1,lastSkipped:1,skipStep:1,stepAnimation:1,animation:1}
            var hash = {'"type"':'-1'}, list = ['"type"'], last = 1, resolve = function(name){
                if( typeof name === 'string' ) name='"'+name+'"';
                if(!(name in hash)){
                    hash[name] = (last++).toString(36);
                    list.push(name);
                }
                return hash[name]
            };

            var out = this.map.map(function(row){
                var rowData = row.map(function( cell ){
                        var obj = [resolve(cell.type)];
                        for( var i in cell )
                            if( cell.hasOwnProperty(i) && !notIn[i] )
                                obj.push( resolve(i)+':'+ resolve(cell[i]));

                        return obj.join(',');
                    }),
                    item, i, _i, lastItem, count = 0;
                for( i = 0, _i = rowData.length + 1; i < _i; i++ ){
                    item = rowData[i]
                    if( lastItem !== item ){
                        if( count > 1 ){
                            rowData[i - count] = count + ';' + lastItem;
                            rowData.splice(i-count+1,count-1);
                            _i-=count-1;
                            i-=count+1;
                        }

                        lastItem = item;
                        count = 0;
                    }
                    count++;

                }

                return rowData.join('|')
            }).join('\n');
            return list.join('|')+'\n' + out;
        },

        mainLoop: function(  ){
            var startTime = +new Date(),
                nextCall = 64 + startTime;// 64 syncronized on level 3 by right owl.
            this.animateStep = !this.animateStep;

            if( this.animateStep ){
                this.animate();
            }else{
                this.moveMe();
                if( !this.editMode || true){
                    this.moveWorld();
                    this.dieCheck();
                }else{
                    this.moveWorld('Explosion', true);
                }
            }

            this.callDelays();

			this.drawChanges();

            nextCall -= +new Date(); // calculate next frame time

            

            setTimeout( this.mainLoop.bind(this), nextCall > 0 ? nextCall : 0 );
        },
        set: function( key, value ){
            //var lastValue = this[ key ];
            if( value < 0 ) value = 0;
            this[ key ] = value;
            this.fire( 'gameSet', key, value );
            if( key === 'screw' && value === 0 )
                this.fire('screwsCollected');
        },
        on: function( event, fn, scope ){
            ( this._events[ event ] || ( this._events[ event ] = [] ) )
                .push( { fn: fn, scope: scope } );
        },
        un: function( event, fn, scope ){
            var list = this._events[ event ], i, el;
            if( list )
                for( i = list.length; i; )
                    if( (el = list[--i]) && el.fn === fn && el.scope === scope )
                        list.splice(i,1);
        },
        once: function( event, fn, scope ){

            var wrap = function(){
                fn.apply(scope || this, [].slice.call( arguments ) );
                this.un( event, wrap, scope );
            }.bind( this );
            this.on( event, fn, scope );
        },
        fire: function( event ){
            var args = [].slice.call( arguments, 1),
                list = this._events[ event ];

            list && R.each( list, function( event ){
                event.fn.apply( event.scope, args );
            } );
        }
    };


    window.Robbo = Controller;
} )(window.R);