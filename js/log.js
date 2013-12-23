(function(){

  var Logger = function( cfg ){
    this._log = [];
    R.apply( this, this.defaultCfg );
    R.apply( this, cfg || {} );
    this.initUI();
    this.initLogFn();
  };
  Logger.prototype = {
    initLogFn: function(){
      !('log' in window) && (window.log = this.log.bind(this));
    },
    log: function(){
      var log = this._log,
          obj = { data: [].slice.call( arguments ) },
          renderTo = this.renderTo;
      log.push( obj );
      
      this.buildLogRow( obj );
      renderTo.appendChild( obj.el );
      
      if( log.length > this.limit ){
        obj = log.shift();
        renderTo.removeChild( obj.el );
      }
      
      
    },
    logArray: function( data, span ){
      span.innerHTML = '';
      var subData, el, i, _i, out = [];
      el = document.createElement('span');
      el.className = '__l_arr_decor';
      el.innerHTML = '[';
      span.appendChild( el );
      
      if( data.length > 20 ){
        for( i = 0, _i = 10; i < _i; i++ )
          out.push( this.singleLogItem( data[ i ] ) );
        
        el = document.createElement('span');
        el.className = '__l_arr_more';
        el.innerHTML = '...';  
        out.push( el );
          
        for( _i = data.length, i = _i - 10; i < _i; i++ )
          out.push( this.singleLogItem( data[ i ] ) );
      }else{
        for( i = 0, _i = data.length; i < _i; i++ )
          out.push( this.singleLogItem( data[ i ] ) );
      }
      for( i = out.length - 1; !(i<=0); ){
        el = document.createElement('span');
        el.className = '__l_arr_decor_comma';
        el.innerHTML = ',';
        out.splice( --i + 1, 0, el );
      }
      
      out.forEach( span.appendChild.bind( span ) );
      
      el = document.createElement('span');
      el.className = '__l_arr_decor';
      el.innerHTML = ']';
      span.appendChild( el );
    },
    singleLogItem: function( data ){
      var span = document.createElement('span'),
          type = R.getType( data );
      if( type === '[object Array]' ){
        this.logArray( data, span );
      
      }else if( data.toString ){
        span.innerHTML = data.toString();
      }else if( data.valueOf ){
        span.innerHTML = data.valueOf();
      
      }else{
        span.innerHTML = '1';
      }
      return span;
    },
    buildLogRow: function( obj ){
      var div = obj.el = document.createElement( 'div' );
      obj.data
        .map( this.singleLogItem.bind( this ) )
        .forEach( div.appendChild.bind( div ) );
      
      
    },
    initUI: function(){
      if(! this.renderTo )
        this.buildRenderTo();
    },
    buildRenderTo: function(){
      var renderTo = this.renderTo = document.createElement( 'div' );
      window.document.body.appendChild( renderTo );
      R.apply( renderTo.style, {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: '#eee',
        opacity: 0.5,
        maxHeight: '33%',
        overflowY: 'auto'
      } );
      
      
    },
    defaultCfg: {
      limit: 100
    }
  };
  var l = new Logger();
  DOM.addListener( window, 'error', function(e){
    l.log('error: ' +e.message +' '+ e.filename +':'+ e.lineno);
    l.log(e);
  });
 // log('log inited');
  //log([1,2,3, [4,4,5],5,6,7,8,9,10,11,2,3,4,5,6,7,8,9,0,1,2,3,24,25]);
})();
   