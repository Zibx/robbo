(function( R ){
    'use strict';
    R.objects = R.objects || {
      Out: {}
    };
    R.objects.Base = function( proto ){
        R.apply( this, proto );
    };
    R.objects.Base.prototype = {
        is: function( type ){
            return this.type === type;
        }
    };
} )(window.R);