function onAssetsLoaded() {

    function spriteFromData(data) {
        let scaleFactor = app.renderer.height * 0.001;
        var sprite = new PIXI.Sprite.from(data.animation[0]);
        sprite.anchor.set(0.5);;
        sprite.width = 100;
        sprite.height = 100;
        sprite.scale.x *= scaleFactor;
        sprite.scale.y *= scaleFactor;
        return sprite;
    }


    function buildSprites(correctColor) {
        sprites = [];
        var sprite;
        //12 il numero di celle definite in positions
        //ne prendo 6 a caso e spawno i sei quadrati di colori differenti
        randomPos = _.sample(positions, 6);
        for (var i = 0; i < randomPos.length; i++) {
            sprite = spriteFromData(spritesData[i]);
            sprite.x = randomPos[i].x;
            sprite.y = randomPos[i].y;
            sprite.interactive = true;
            if (spritesData[i].color == correctColor) {
                sprite.on('pointerdown', () => {
                    score++;
                    updateScoreText();
                    if (playerLevel < 1.7) playerLevel += 0.05;
                    if (playerLevel >= 1.7 && playerLevel < 3.5) playerLevel += 0.025;
                    newLevel(playerLevel);
                })
            } else {
                sprite.on('pointerdown', () => {
                    gameOver();
                })
            }
            sprites.push(sprite);
        }

        //the correct sprite
        /*
        sprite = spriteFromData({ animation: [PIXI.Texture.fromFrame(red.frames[0])] });
        sprite.x = app.renderer.width / 2;
        sprite.y = app.renderer.height * 0.9;
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', victory);
        sprites.push(sprite);
        */
        return sprites;
    }



    // Init
    //canvas options
    var app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x111111 });
    var centerX = app.renderer.width / 2;
    var centerY = app.renderer.height / 2;
    //squares positions
    var positions = [];
    var randomPos;
    var sprites;
    var randomFill, random_color, colorWord;
    //player's score
    var score = 0;
    var isPlaying = false;
    const gameScore = new PIXI.Text('0', rainbowStyle);
    gameScore.anchor.set(0.5);
    gameScore.x = centerX;
    gameScore.y = centerY * 1.8;
    //gameovertext
    const gameOverText = new PIXI.Text('GAME OVER', rainbowStyle);
    gameOverText.x = centerX - (gameOverText.width / 2);
    gameOverText.y = centerY * 0.8;
    //setup for title
    const gameTitle = new PIXI.Text('Stroop Color Game', rainbowStyle);
    var titleInitialX = gameTitle.x = centerX - (gameTitle.width / 2);
    var titleInitialY = gameTitle.y = centerY * 0.2;
    //titleanimation (initialX not used but stored, may be useful)  
    var direction = { 'x': 1, 'y': 1 }
    app.ticker.add((delta) => {
        //passing direction by reference ( by using object)
        floatVertically(gameTitle, titleInitialY, delta, 5, direction, 0.25);
    });
    //setup for play button
    const playButton = new PIXI.Text("PLAY", buttonStyle);
    playButton.interactive = true;
    playButton.x = centerX - (playButton.width / 2);
    playButton.y = centerY;
    playButton.on('pointerdown', newGame);
    //setup for instructions button
    const instructionButton = new PIXI.Text("INSTRUCTIONS", buttonStyle);
    instructionButton.interactive = true;
    instructionButton.x = centerX - (instructionButton.width / 2);
    instructionButton.y = centerY * 1.3;
    instructionButton.on('pointerdown', () => { showInstructions(); });
    //setup for back button
    const backButton = new PIXI.Text("BACK", buttonStyle);
    backButton.interactive = true;
    backButton.x = centerX - (backButton.width / 2);
    backButton.y = centerY * 1.35;
    backButton.on('pointerdown', () => { showMenu(); });
    //setup for instructions
    const instructions = new PIXI.Text('Choose the right color according to the color\'s name that appears and... be aware of the Stroop Effect!', rainbowStyle);
    instructions.x = centerX;
    instructions.y = centerY * 0.25;
    instructions.anchor.set(0.5, 0);
    //setup for wiki
    const wikiButton = new PIXI.Text("(Learn more >>) ", linkStyle);
    wikiButton.anchor.set(0.5);
    wikiButton.x = centerX + wikiButton.width / 2;
    wikiButton.y = centerY;
    wikiButton.interactive = true;
    wikiButton.on('pointerdown', () => { window.open("https://en.wikipedia.org/wiki/Stroop_effect"); })



    //place the canvas in the main DOM
    document.getElementById('main').appendChild(app.view);

    //loadanimations
    for (var i = 0; i < spritesData.length; i++) {
        var frames = [];
        for (var j = 0; j < spritesData[i].frames.length; j++) {
            frames.push(PIXI.Texture.fromFrame(spritesData[i].frames[j]));
        }
        spritesData[i].animation = frames;
    }

    //loadbar
    var greenbarSprite = new PIXI.Sprite.from(greenbar.frames[0]);
    greenbarSprite.x = centerX;
    greenbarSprite.y = centerY * 0.5;
    greenbarSprite.anchor.set(0.5);
    greenbarSprite.scale.set(0.5);

    var redbarSprite = new PIXI.Sprite.from(redbar.frames[0]);
    redbarSprite.x = centerX;
    redbarSprite.y = centerY * 0.5;
    redbarSprite.anchor.set(0.5);
    redbarSprite.scale.set(0.5);

    var redbarInitialW = redbarSprite.width;
    var playerInitialLevel, playerLevel;

    //bar logic
    app.ticker.add(function(delta) {
        if (isPlaying) {
            if (redbarSprite.width + delta * playerLevel >= redbarInitialW) {
                redbarSprite.width = 0;
                gameOver();
            } else
                redbarSprite.width += delta * playerLevel;
        }
    });

    app.ticker.add(function(delta) {
        for (i in sprites) {
            moveTo(delta * 0.1, sprites[i], randomPos[i]);
            rotateTo(delta * 0.1, sprites[i], Math.PI * 256);
        }
    });

    // New level
    function newLevel() {
        app.stage.removeChildren();

        //choose the color the player has to select
        var random_color = _.random(colors.length - 1);

        //choose a random color to fill randomly the word        
        var randomFill = _.random(colors.length - 1);
        //the word will be the same color of the color name for 5 levels, then randomly colored
        if (score >= 3 && score < 8) gameWordStyle.fill = colors[random_color].code.toString();
        else gameWordStyle.fill = colors[randomFill].code.toString();

        if (score >= 0 && score < 3) //the word will be uncolored for the first 3 levels
            colorWord = new PIXI.Text(colors[random_color].color.toUpperCase(), gameWordStyleWhite);
        else
            colorWord = new PIXI.Text(colors[random_color].color.toUpperCase(), gameWordStyle);

        colorWord.x = centerX;
        colorWord.y = centerY * 0.2;
        colorWord.anchor.set(0.5);
        app.stage.addChild(colorWord);

        positions = generateGridArray(app.renderer.width, app.renderer.height);
        sprites = buildSprites(colors[random_color].color);

        //Draw squares
        for (var i = 0; i < sprites.length; i++) {
            app.stage.addChild(sprites[i]);
        }

        moveSpritesToTheMiddle(app);

        //draw bars
        redbarSprite.width = 0;
        app.stage.addChild(greenbarSprite);
        app.stage.addChild(redbarSprite);

        // Move some sprites
        /*
        app.ticker.add(function(delta) {
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.vx) {
                    sprite.x += sprite.vx * delta;
                }
            }
        });*/

        app.stage.addChild(gameScore);
    }


    function moveSpritesToTheMiddle(app) {
        for (i in sprites) {
            sprites[i].x = centerX;
            sprites[i].y = centerY;
        }
    }

    lerp = (a, b, c) => a * (1 - c) + b * c;

    function moveTo(delta, sprite, destination) {
        sprite.x = lerp(sprite.x, destination.x, delta);
        sprite.y = lerp(sprite.y, destination.y, delta);
    }

    function rotateTo(delta, sprite, radians) {
        sprite.rotation = lerp(sprite.rotation, radians, delta * 4);
    }

    function showMenu() {
        app.stage.removeChildren();
        stars(app);
        app.stage.addChild(gameTitle);
        app.stage.addChild(playButton);
        app.stage.addChild(instructionButton);
    }

    function showInstructions() {
        app.stage.removeChildren();
        app.stage.addChild(instructions);
        app.stage.addChild(wikiButton);
        app.stage.addChild(backButton);
    }

    function newGame() {
        score = 0;
        gameScore.x = centerX;
        gameScore.y = centerY * 1.8;
        playerInitialLevel = 1.4;
        //devmode
        //playerInitialLevel = 0.1;
        playerLevel = playerInitialLevel;
        isPlaying = true;
        updateScoreText();
        newLevel(playerLevel);
    }

    function updateScoreText() {
        gameScore.text = score.toString();
    }

    function gameOver() {
        isPlaying = false;
        app.stage.removeChildren();
        app.stage.addChild(gameOverText);
        gameScore.x = centerX;
        gameScore.y = centerY * 1.2;
        app.stage.addChild(gameScore);
        setTimeout(showMenu, 3000);
    }

    //start the game
    showMenu();
}



function stars(app) {
    // Get the texture for rope.
    let starTexture = PIXI.Texture.from(spritesData[_.random(spritesData.length - 1)].frames[0]);

    const starAmount = 1000;
    let cameraZ = 0;
    const fov = 20;
    const baseSpeed = 0.025;
    let speed = 0;
    let warpSpeed = 0;
    const starStretch = 5;
    const starBaseSize = 0.05;


    // Create the stars
    const stars = [];
    for (let i = 0; i < starAmount; i++) {
        const star = {
            sprite: new PIXI.Sprite(starTexture),
            z: 0,
            x: 0,
            y: 0,
        };
        star.sprite.anchor.x = 0.5;
        star.sprite.anchor.y = 0.7;
        randomizeStar(star, true);
        app.stage.addChild(star.sprite);
        stars.push(star);
        starTexture = PIXI.Texture.from(spritesData[_.random(spritesData.length - 1)].frames[0]);
    }

    function randomizeStar(star, initial) {
        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }

    // Change flight speed every 5 seconds
    setInterval(() => {
        warpSpeed = warpSpeed > 0 ? 0 : 1;
    }, 5000);

    // Listen for animate update
    app.ticker.add((delta) => {
        // Simple easing. This should be changed to proper easing function when used for real.
        speed += (warpSpeed - speed) / 20;
        cameraZ += delta * 10 * (speed + baseSpeed);
        for (let i = 0; i < starAmount; i++) {
            const star = stars[i];
            if (star.z < cameraZ) randomizeStar(star);

            // Map star 3d position to 2d with really simple projection
            const z = star.z - cameraZ;
            star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
            star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;

            // Calculate star scale & rotation.
            const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
            const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / app.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    });
}