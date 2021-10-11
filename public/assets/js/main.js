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
        //random select 6 out of 12 positions of the matrix
        randomPos = _.sample(positions, 6);
        for (var i = 0; i < randomPos.length; i++) {
            sprite = spriteFromData(spritesData[i]);
            sprite.x = randomPos[i].x;
            sprite.y = randomPos[i].y;
            sprite.interactive = true;
            if (spritesData[i].color == correctColor) {
                sprite.on('pointerdown', () => {
                    correctSound.play();
                    score++;
                    updateScoreText();
                    if (playerLevel < 1.7) playerLevel += 0.05;
                    if (playerLevel >= 1.7 && playerLevel < 3.5) playerLevel += 0.025;
                    newLevel(playerLevel);
                })
            } else {
                sprite.on('pointerdown', () => {
                    wrongSound.play();
                    gameOver();
                })
            }
            sprites.push(sprite);
        }
        return sprites;
    }

    //telegram variables
    var url = new URL(location.href);
    var playerid = url.searchParams.get("id");
    //url where is hosted server (eventual ngrok url to http local port if hosted locally)
    //const gamehosturl = "http://...";
    const gamehosturl = url.origin; //change according to the game url, if the node server is the same url leave 'url.origin'

    // Init
    //canvas options
    var app = new PIXI.Application((window.innerWidth < 900) ? 900 : window.innerWidth, window.innerHeight, { backgroundColor: 0x111111 });
    var centerX = app.renderer.width / 2;
    var centerY = app.renderer.height / 2;
    //squares positions
    var positions = [];
    var randomPos;
    //square sprites
    var sprites;
    //game logic variables
    var randomFill, random_color, colorWord;
    //player's score
    var score = 0;
    //boolean for bar ticker
    var isPlaying = false;
    //player's score text in numbers
    const gameScore = new PIXI.Text('0', scoreStyle);
    gameScore.anchor.set(0.5);
    gameScore.x = centerX;
    gameScore.y = centerY * 1.8;
    //gameovertext
    const gameOverText = new PIXI.Text('GAME OVER', rainbowStyle);
    gameOverText.x = centerX - (gameOverText.width / 2);
    gameOverText.y = centerY * 0.5;
    //setup for title
    const gameTitle = new PIXI.Text('STROOP COLOR GAME', titleStyle);
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
    playButton.y = centerY * 0.8;
    playButton.on('pointerdown', newGame);
    //setup for instructions button
    const instructionButton = new PIXI.Text("INSTRUCTIONS", buttonStyle);
    instructionButton.interactive = true;
    instructionButton.x = centerX - (instructionButton.width / 2);
    instructionButton.y = centerY * 1;
    instructionButton.on('pointerdown', () => { showInstructions(); });
    //setup for credits button
    const creditsButton = new PIXI.Text("CREDITS", buttonStyle);
    creditsButton.interactive = true;
    creditsButton.x = centerX - (creditsButton.width / 2);
    creditsButton.y = centerY * 1.4;
    creditsButton.on('pointerdown', () => { showCredits(); });
    //setup for back button
    const backButton = new PIXI.Text("BACK", buttonStyle);
    backButton.interactive = true;
    backButton.x = centerX - (backButton.width / 2);
    backButton.y = centerY * 1.5;
    backButton.on('pointerdown', () => { showMenu(); });
    //setup for instructions
    const instructions = new PIXI.Text('Choose the right color according to the color\'s name that appears and... be aware of the Stroop Effect!', instructionStyle);
    instructions.x = centerX;
    instructions.y = centerY * 0.25;
    instructions.anchor.set(0.5, 0);
    //setup for wiki
    const wikiButton = new PIXI.Text("(Learn more >>) ", linkStyle);
    wikiButton.x = centerX * 0.3;
    wikiButton.y = centerY * 1.3;
    wikiButton.interactive = true;
    wikiButton.on('pointerdown', () => { window.open("https://en.wikipedia.org/wiki/Stroop_effect"); })
        //setup for credits
    const credits = new PIXI.Text('A game by coccojack\nGraphic API: Pixi\nAudio API: Howler\nSounds: opengameart', instructionStyle);
    var creditsInitialX = credits.x = centerX;
    credits.y = centerY * 0.25;
    credits.anchor.set(0.5, 0);
    var direction2 = { 'x': 1, 'y': 1 }
    app.ticker.add((delta) => {
        //passing direction by reference ( by using object)
        floatHorizontally(credits, creditsInitialX, delta, 5, direction2, 0.25);
    });

    const linksref = new PIXI.Text(" credits >>", linkStyle);
    linksref.x = centerX * 0.3;
    linksref.y = centerY * 1.3;
    const ogalink1 = new PIXI.Text("BGM", linkStyle);
    ogalink1.x = centerX * 0.8;
    ogalink1.y = centerY * 1.3;
    ogalink1.interactive = true;
    ogalink1.on('pointerdown', () => { window.open("https://opengameart.org/content/a-journey-awaits") });
    const ogalink2 = new PIXI.Text("GUI", linkStyle)
    ogalink2.x = centerX * 1.1;
    ogalink2.y = centerY * 1.3;
    ogalink2.interactive = true;
    ogalink2.on('pointerdown', () => { window.open("https://opengameart.org/content/gui-sound-effects") });

    const muteButton = new PIXI.Text(" <<Mute Music>>", linkStyle);
    const unmuteButton = new PIXI.Text(" <<Unmute Music>>", linkStyle);
    muteButton.x = centerX * 2 - muteButton.width;
    muteButton.y = centerY * 2 - muteButton.height;
    muteButton.interactive = true;
    muteButton.on('pointerdown', stopBgm);
    unmuteButton.x = -1000;
    unmuteButton.y = centerY * 2 - unmuteButton.height;
    unmuteButton.interactive = true;
    unmuteButton.on('pointerdown', playBgm);

    function playBgm() {
        bgm.play();
        unmuteButton.x = -1000;
        muteButton.x = centerX * 2 - muteButton.width;
    }

    function stopBgm() {
        bgm.stop();
        muteButton.x = -1000;
        unmuteButton.x = centerX * 2 - unmuteButton.width;
    }

    //placing the canvas in the main DOM
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

    //linear interpolations from center of the canvas to the positions, rotating
    app.ticker.add(function(delta) {
        for (i in sprites) {
            moveTo(delta * 0.1, sprites[i], randomPos[i]);
            rotateTo(delta * 0.1, sprites[i], Math.PI * 256);
        }
    });

    // New level
    function newLevel() {
        app.stage.removeChildren();
        stars(app);
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
        app.stage.addChild(gameScore);
        app.stage.addChild(muteButton);
        app.stage.addChild(unmuteButton);
    }

    //called each new level
    function moveSpritesToTheMiddle(app) {
        for (i in sprites) {
            sprites[i].x = centerX;
            sprites[i].y = centerY;
        }
    }

    //called to linearly interpolate translations and rotations
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
        stars(app, true);
        app.stage.addChild(gameTitle);
        app.stage.addChild(playButton);
        app.stage.addChild(instructionButton);
        app.stage.addChild(creditsButton);
        app.stage.addChild(muteButton);
        app.stage.addChild(unmuteButton);
    }

    function showInstructions() {
        app.stage.removeChildren();
        stars(app);
        app.stage.addChild(instructions);
        app.stage.addChild(wikiButton);
        app.stage.addChild(backButton);
        app.stage.addChild(muteButton);
        app.stage.addChild(unmuteButton);
    }


    function showCredits() {
        app.stage.removeChildren();
        stars(app);
        app.stage.addChild(credits);
        app.stage.addChild(linksref);
        app.stage.addChild(ogalink1);
        app.stage.addChild(ogalink2);
        app.stage.addChild(backButton);
        app.stage.addChild(muteButton);
        app.stage.addChild(unmuteButton);
    }

    function newGame() {
        score = 0;
        gameScore.x = centerX;
        gameScore.y = centerY * 1.8;
        playerInitialLevel = 1.4;
        //playerInitialLevel = 0.1; //devmode
        playerLevel = playerInitialLevel;
        isPlaying = true;
        updateScoreText();
        newLevel(playerLevel);
    }

    function updateScoreText() {
        gameScore.text = score.toString();
    }

    function gameOver() {
        if (score > 0) setHighScore(score)
        isPlaying = false;
        app.stage.removeChildren();
        stars(app);
        app.stage.addChild(gameOverText);
        gameScore.x = centerX;
        gameScore.y = centerY * 1.1;
        app.stage.addChild(gameScore);
        app.stage.addChild(muteButton);
        app.stage.addChild(unmuteButton);
        setTimeout(showMenu, 3000);
    }

    //telegram
    function setHighScore(score) {
        // Submit highscore to Telegram
        var xmlhttp = new XMLHttpRequest();
        var url = gamehosturl + "/highscore/" + score +
            "?id=" + playerid;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    //start the game
    showMenu();
}



function stars(app, warp) {
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

    // Change flight speed every 5 seconds, if warp is true
    if (warp) {
        setInterval(() => {
            warpSpeed = warpSpeed > 0 ? 0 : 1;
        }, 5000);
    }

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