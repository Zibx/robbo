(function( R ){
    'use strict';
    R.objects.Ammo = {
        eatable: true,
        count: 9,
        eat: function( eater ){
            eater.set('ammo', eater.ammo + this.count);
            this.game.playSound('ammo');
        },
        explodable: true,
        demolishable: true
    };
} )(window.R);