(function( R ){
    'use strict';
    R.objects.Walls = {
        ascii: 'q',
        afterInit: function(  ){
            if( this.img )
                this.ascii = 'OIo-QqPpSsyYzZJji'.split('')[ this.img ];
            else
                this.img = 'OIo-QqPpSsyYzZJji'.indexOf(this.ascii);
        }
    };
} )(window.R);