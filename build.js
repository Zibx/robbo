const {minify} = require("terser"),
    fs = require('fs'),
    path = require( 'path'),

    Robbo = [
      'js/base.js',

      'js/common.js',

      'js/keyboard.js',
      'js/ascii.js',

      'js/objects/Base.js',
      'js/controller.js',

      'js/objects/Ammo.js',
      'js/objects/Bear.js',
      'js/objects/Bomb.js',
      'js/objects/Bullet.js',
      'js/objects/Butterfly.js',
      'js/objects/Door.js',
      'js/objects/Empty.js',
      'js/objects/Explosion.js',
      'js/objects/Ground.js',
      'js/objects/Key.js',
      'js/objects/Lava.js',
      'js/objects/Magnet.js',
      'js/objects/Mustache.js',
      'js/objects/PushableStone.js',
      'js/objects/Question.js',
      'js/objects/Robbo.js',
      'js/objects/Screw.js',
      'js/objects/Spaceship.js',
      'js/objects/Stone.js',
      'js/objects/Teleport.js',
      'js/objects/Turrel.js',
      'js/objects/Walls.js',

      'js/objects.js',
      'js/parseMaps.js',
      'js/sprites.js',

      'js/view.js',



    ],
    dir = 'build',

    header = `/* Robbo game implementation by Ivan Kubota. 
* ©Form.dev 2012—${(new Date()).getFullYear()}
* License: MPL-2.0 for not commercial use and all projects that involves me 
*/
`;
    build = {
      robbo: Robbo
    },

    hash = {},

    {execSync} = require('child_process'),
    commit = execSync( 'git rev-list --count HEAD' ).toString().trim()-0,

    bigVersion = 1,
    version = [bigVersion, commit/17|0, commit % 17];

Object
  .values(build)
  .forEach(files =>
    files.forEach(fileName =>
      hash[fileName] = hash[fileName] || fs.readFileSync(fileName).toString('utf-8')
    )
  );

(async function(){
  for( let outFileName in build ){
    let
      dest = path.join( dir, outFileName )+'_'+version.join('.')+'.js',
      latest = path.join( dir, outFileName )+'_latest.js',
      source =
        (await minify(
          build[ outFileName ].map( fileName => hash[ fileName ] ).join( ';' ),
          {
            sourceMap: true,
            format: {
              preamble: header
            },
            ie8: false,
            compress: {
              passes: 2
            }
          }
        )),
      code = source.code,
      map = source.map;

    fs.writeFileSync( dest, code );
    fs.writeFileSync( dest+'.map', map );
    fs.writeFileSync( latest, code );
    fs.writeFileSync( latest+'.map', map );
    console.log( `Build ${dest} ${( code.length / 1024 ).toFixed( 2 )}K` )
  }
/*  fs.writeFileSync( 'index.html', fs.readFileSync('list.html', 'utf-8')
    .replace('$LIST$', `
      ${fs.readdirSync(dir).filter(a=>a[0]!=='.').map(a=>`<li><a href="build/${a}">${a}</a></li>`).join('\n')}
    `)
  );*/
})();