(function( R ){
    'use strict';
    R.sprites = {
        offset: 2,
        cellSize: 8,
        draw: function( ctx, sprite, rect, blink ){
            ctx.fillStyle = blink === '#fff' ? blink : sprite;
            ctx.globalAlpha = 1;
            /*var zoom = 4;
            rect[0]/=zoom;
            rect[1]/=zoom;
            rect[2]/=zoom;
            rect[3]/=zoom;*/
            ctx.fillRect.apply( ctx, rect );


        },
        modifyColors: function(  ){

        },
        resolveSprite: function( obj, step, step2 ){
            var sprite = this[ obj.type ];
            sprite.ascii && ( sprite = sprite.ascii[ obj.ascii ] );
            return typeof sprite === 'function' ? sprite.call( obj, step, step2 ) : sprite;
        },
        getHash: function( sprite ){
            return sprite;
        },

        Robbo: '#cc6',
        Empty: '#fff',
        Walls: '#fee',
        Ground: '#aaa',
        Stone: '#ccc',
        PushableStone: '#ddd',
        Door: '#ffd29d',
        Spaceship: function( step ){
            return ( this.game.screw === 0 ? ( step ? '#98bb9b' : '#3baa2f' ) : '#3baa2f' );
        },
        Question: '#eee',
        Bomb: '#777',
        Key: '#dfd',
        Screw: '#ddf',
        Turrel: '#eec',
        Ammo: '#ffd',
        Teleport: function( step ){
            return '#ac'+ (step? 'e': '8');
        },
        Explosion: function(){
            return '#'+((this.animation*2+9).toString(16))+'77';
        },
        Bullet: '#caa',
        Mustache: '#ece',
        Butterfly: '#fa7',
        Bear: '#cec',
        Lava: '#aaf',
        Magnet: '#aba',
        Bright: '#faf200',

        'hud.screw': '#ddf',
        'hud.ammo': '#ffd',
        'hud.keys': '#dfd',
        'hud.planet': '#dfd',
        'hud.lives': '#dfd'


    };

    R.loaded('sprites');

})(window.R);
