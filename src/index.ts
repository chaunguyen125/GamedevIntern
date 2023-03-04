import * as _ from "lodash";
import {
  Application,
  Assets,
  Graphics,
  ParticleContainer,
  Sprite,
  Texture,
} from "pixi.js";

let app: any;
window.onload = function () {
  app = new Application({
    backgroundColor: "black",
    width: 600,
    height: 380,
  });

  document.body.appendChild(app.view);
  console.log("width", app.screen.width);
  console.log("height", app.screen.height);
  app.stop();

  // load resources
  Assets.load("./images/spritesheet.json").then(onAssetsLoaded);
  let count = 0;
  const imgTexture = Texture.from("./images/lightstick.png");
  let currentSelect: any[] = [];
  const spriteObjs: {}[] = [];
  let graphics: Graphics[] = [];
  const textures: Texture[] = [];
  const img1: Texture[] = [];
  const img2: Texture[] = [];
  const imgFrames = [
    "baekhyun.jpeg",
    "chen.jpg",
    "do.jpg",
    "kai.jpg",
    "sehun.jpg",
    "suho.jpg",
    "xiumin.jpeg",
  ];

  const containers = new ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });

  app.stage.addChild(containers);

  function gameLoop(sprite: Sprite) {
    let t = Date.now() / 1000;
    let count = 1;
    let yo = sprite.y;
    app.ticker.add(() => {
      if (count > 0) {
        let deltaT = Date.now() / 1000 - t;
        let y = yo - (+10 * deltaT - Math.pow(deltaT, 2) / 2);
        sprite.y = y;
        yo = y;
        t = Date.now() / 1000;
        console.log("sprite y", sprite.y);
        count -= 0.05;
        app.stage.addChild(sprite);
      } else return (count = 0);
    });
  }

  function onAssetsLoaded() {
    let l = imgFrames.length;
    for (let i = 0; i < l; i++) {
      let img = Texture.from(imgFrames[i]);
      textures.push(img);
    }

    const n = (app.screen.width - (app.screen.width % 50)) / 50;
    const m = (app.screen.height - (app.screen.height % 76)) / 76;
    const total = m * n;
    for (let i = 0; i < total / 2; i++) {
      const img = textures[Math.floor(Math.random() * textures.length)];
      img1.push(img);
      img2.push(img);
    }

    let imgs = img1.concat(img2);

    const totalImg = imgs.length;
    while (imgs.length > 0) {
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          const indexRandom = Math.floor(Math.random() * imgs.length);
          const randomTexture = imgs[indexRandom];
          const sprite = new Sprite(randomTexture);
          sprite.x = j * 50;
          sprite.y = i * 76;
          sprite.anchor.x = 0;
          sprite.anchor.y = 0;
          const spriceObj = {
            frame: randomTexture.textureCacheIds[0],
            x: sprite.x,
            y: sprite.y,
            sprite,
          };
          spriteObjs.push(spriceObj);
          console.log('sprite', sprite);
          
          sprite.eventMode="static";
          sprite.cursor = "pointer";
          sprite.on("pointerdown", onButtonDown);
          imgs.splice(indexRandom, 1);
          app.stage.addChild(sprite);
        }
      }
    }

    app.start();
  }

  const onButtonDown = (e: any) => {
    if (currentSelect.length >= 2) {
      currentSelect = [];
    }
    let x = Math.floor(e.clientX / 50) * 50;
    let y = Math.floor(e.clientY / 76) * 76;
    const selectImg = spriteObjs.filter((value: any) => {
      return x == value.x && y == value.y;
    });
    let graphic = new Graphics();
    graphic.lineStyle(2, 0x0000ff, 1);
    graphic.drawRect(x, y, 50, 76);
    graphics.push(graphic);
    app.stage.addChild(graphic);
    currentSelect = currentSelect.concat(...selectImg);
    if (currentSelect.length == 2) {
      for (let i = 0; i < 2; i++) {
        graphics[i].clear();
      }
      if (
        currentSelect[0].x != currentSelect[1].x ||
        currentSelect[0].y != currentSelect[1].y
      ) {
        if (currentSelect[0].frame === currentSelect[1].frame) {
          for (let i = 0; i < currentSelect.length; i++) {
            let count = 1;
            gameLoop(currentSelect[i].sprite);
            if (currentSelect[i].sprite) {
              currentSelect[i].sprite.alpha = 1;
              app.ticker.add(() => {
                if (count > 0) {
                  // currentSelect[i].sprite.rotation += 0.01 * delta;
                  currentSelect[i].sprite.alpha -= 0.1;
                  count -= 0.1;
                  if (count <= 0) {
                    currentSelect[i].sprite.visible = false;
                  }
                } else {
                  return (count = 0);
                }
              });
            }

            const replaceImg = new Sprite(imgTexture);
            replaceImg.x = currentSelect[i].x;
            replaceImg.y = currentSelect[i].y;
            containers.addChild(replaceImg);
            let tick = 1;
            app.ticker.add(() => {
              replaceImg.alpha = tick;
              if (tick > 0) {
                tick -= 0.05;
              } else {
                return (tick = 0);
              }
            });
          }
        } else {
          console.log("fail");
        }
      }

      graphics = [];
    }
  };
};
