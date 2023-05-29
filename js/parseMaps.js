(function( R ){
'use strict';
  R.parseMaps = function(mapsString){
    var maps = [],
      level,
      current,
      data = [],
      mapping = {
        data: 'map',
        additional: 'data'
      },
      convertData = function( data ){
        return data.slice(1).map(function( str ){
          var tokens = str.split('.'),
            out = {
              x: tokens[0] |0,
              y: tokens[1] |0,
              data: tokens.slice(3)
            },
            ids = [],
            next;
          if( tokens[2] === '&' ){

            data.slice(1).map(function(el){
                el = el.split('.');
                return el[2] === '&' && ( el[3] ) === tokens[3] ? el :void 0;
              })
              .filter(function( el ){
                return el !== void 0;
              } )
              .forEach(function( el ){
                ids[ el[4] ] = el;
              } );
            next = ids[ ( (tokens[4] |0) + 1 ) % ids.length ];
            out.data = {
              teleportX: next[0]|0,
              teleportY: next[1]|0
            }

          }else if( tokens[2] === '}' ){
            out.data = {
              direction: tokens[3]|0,
              bulletType: ['gun','laser','antimatter'][tokens[5]|0],
              rotatable: tokens[7]|0,
              movable: tokens[6]|0,
              moveDirection: tokens[4]|0
            }
          }else if( tokens[2] === '^' ){
            out.data = {
              direction: tokens[3]|0,
              fire: ( tokens[5]|0 ) ? true: false
            }
          }else if( tokens[2] === '@' || tokens[2] === '*' ){
            out.data = {
              direction: tokens[3]|0,
              clockwise: tokens[2] === '@'
            }
          }else if( tokens[2] === 'M' ){
            out.data = {
              direction: tokens[3]|0
            }
          }else if( tokens[2] === '=' ){
            out.data = {
              direction: tokens[3]|0
            }
          }
          return out;
        } );
      };

    mapsString
      .replace(/&amp;/g,'&')
      .replace(/\r/g,'')
      .split('\n')
      .map(function(el){ return el.trim(); })
      .forEach(function( el ){
        var match = el.match( /\[([a-z_]*)\]/ );
        if( match ){
          match = match[1];
          level &&
          ( level[ mapping[current] || current ] =
            current === 'data' ?
              data.join('\n')
              :
              (current === 'additional' ? convertData(data): data ) );

          current = match;
          if( current === 'level' ){
            level && maps.push( level );
            level = {};
          }

          data = [];
        }else{
          data.push( el );
        }
      });
    level && maps.push( level );
    return maps;
  }

})(window.R);