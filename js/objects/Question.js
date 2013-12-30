(function( R ){
    'use strict';
    R.objects.Question = {
        randomCfg: [
            { type: 'Question' },
            { type: 'Spaceship', data: {fromQuestion: true} },
            { type: 'Stone' },
            { type: 'Ground' },
            { type: 'Screw' },
            { type: 'Key' },
            { type: 'Ammo' },
            { type: 'Turrel', data: { direction: R.rand(0,3), bulletType: 'gun', rotatable: true } },
            { type: 'Empty' },
            { type: 'Bomb' },
            { type: 'Butterfly' }
        ],
        init: function( ){
            this.randomObject = this.randomCfg[ (Math.random()*this.randomCfg.length)|0 ];

        },
        explodable: true,
        movable: true,
        demolishable: true,
        demolish: function(){
            this.game.setCell(this, 'Explosion', { after: this.randomObject, single: true, fromBullet: true, data: this.randomObject.data });
            return false;
        },
        move: R.behaviors.move
    };
} )(window.R);