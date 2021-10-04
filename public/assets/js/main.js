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
        var sprites = [];
        var sprite;
        //12 il numero di celle definite in positions
        //ne prendo 6 a caso e spawno i sei quadrati di colori differenti
        var randomPos = _.sample(positions, 6);
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
                    if (playerInitialLevel >= 1.7 && playerLevel < 1.8) playerLevel += 0.025;
                    console.log(playerLevel);
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
    var app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0xeeeeee });
    var centerX = app.renderer.width / 2;
    var centerY = app.renderer.height / 2;
    //squares positions
    var positions = [];
    var randomFill, random_color, colorWord;
    //player's score
    var score = 0;
    const gameScore = new PIXI.Text('0', rainbowStyle);
    gameScore.anchor.set(0.5);
    gameScore.x = centerX;
    gameScore.y = centerY * 1.8;
    //gameovertext
    const gameOverText = new PIXI.Text('GAME OVER', rainbowStyle);
    gameOverText.x = centerX - (gameOverText.width / 2);
    gameOverText.y = centerY;
    //setup for title
    const gameTitle = new PIXI.Text('Stroop Color Game', rainbowStyle);
    var titleInitialX = gameTitle.x = centerX - (gameTitle.width / 2);
    var titleInitialY = gameTitle.y = centerY * 0.2;
    //titleanimation (initialX not used but stored, may be useful)  
    var direction = { 'x': 1, 'y': 1 }
    app.ticker.add((delta) => {
        //passing direction by reference ( by using object)
        floatVertically(gameTitle, titleInitialY, delta, 25, direction);
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
    backButton.y = centerY * 1.75;
    backButton.on('pointerdown', () => { showMenu(); });
    //setup for instructions
    const instructions = new PIXI.Text('Choose the right color just us:\n -The font COLOR, if COLORED\n -The COLOR NAME if UNCOLORED', rainbowStyle);
    instructions.x = centerX;
    instructions.y = centerY * 0.25;
    instructions.anchor.set(0.5, 0);
    //setup for wiki
    const wikiButton = new PIXI.Text("Learn more about the \nStroop Effect ~~>", linkStyle);
    wikiButton.anchor.set(0.5);
    wikiButton.x = centerX;
    wikiButton.y = centerY * 1.3;
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
    var playerInitialLevel = 1.3;
    var playerLevel = playerInitialLevel;

    // New level
    function newLevel(leveln) {
        app.stage.removeChildren();
        //choose a random color to fill randomly the word        
        randomFill = _.random(colors.length - 1);
        gameWordStyle.fill = colors[randomFill].code.toString();
        //choose the color the player has to select
        random_color = _.random(colors.length - 1);
        if (_.random(100) <= 50) {
            //the word will be colored
            colorWord = new PIXI.Text(colors[random_color].color.toUpperCase(), gameWordStyle);
        } else {
            //the word will be uncolored
            colorWord = new PIXI.Text(colors[random_color].color.toUpperCase(), gameWordStyleWhite);
        }
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

        //draw bars
        redbarSprite.width = 0;
        app.stage.addChild(greenbarSprite);
        app.stage.addChild(redbarSprite);

        app.ticker.add(function(delta) {
            if (redbarSprite.width + delta >= redbarInitialW) redbarSprite.width = redbarInitialW;
            else
                redbarSprite.width += delta * leveln * 0.2;
        });
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

    function showMenu() {
        app.stage.removeChildren();
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
        playerLevel = playerInitialLevel;
        updateScoreText();
        newLevel(playerLevel);
    }

    function updateScoreText() {
        gameScore.text = score.toString();
    }

    function gameOver() {
        app.stage.removeChildren();
        app.stage.addChild(gameOverText);
        app.stage.addChild(gameScore);
        setTimeout(showMenu, 3000);

        /*
        var richText = new PIXI.Text(_.sample(['BRAVO!', 'Great.', 'SUPER!', 'You found it!', 'Amazing!', 'Voilà!', 'AWESOME!']), normalStyle);
        richText.anchor.set(0.5);
        richText.x = app.renderer.width / 2;
        richText.y = app.renderer.height / 2;
        /*
        //disableinteraction and show message
        /*
        for (var i = 0; i < sprites.length; i++) {
            sprites[i].interactive = false;
        }
        app.stage.addChild(richText);
        setTimeout(newLevel, 500);*/
    }

    //start the game
    showMenu();
}


//TODO game over quando la barra finisce->problema: il ticker continua a girare a vuoto e da problemi a iniziare una nuova partita
//suggerimenti nel vecchio progetto??