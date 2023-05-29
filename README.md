# Robbo Game

This is a JavaScript implementation of the Robbo game from Atari XL800

Some details are published in my blog: https://blog.form.dev/game/robbo

28 May 2023 — Added the final cartoon. Recovered some tests

To run — just open game.html in your browser

Build is not needed, I use package.json for bundling code together

standalone.html - demonstration of small recorded scenes. If `standalone` flag is passed - no UI would be drawn and renderTo should be a canvas.

build script is optional. it glue everything together and minifies the result in the `build` folder.

```sh
yarn
node build.js
```


This code can be modified under the MPL 2.0 License