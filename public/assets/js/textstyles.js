var normalStyle = new PIXI.TextStyle({
    fontSize: 48,
    fontWeight: 'bold',
    fill: ['#FFFFFF', '#EEEEEE'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});

var rainbowStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#8648A3', '#25AEE4', '#53DD3B', '#FFEB11', '#FF7B20', '#FE1416'], // rainbow gradient
    stroke: 'black',
    strokeThickness: 20,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
});

var buttonStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    stroke: 'black',
    strokeThickness: 20,
    fill: 'white',
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
    padding: 4,
    letterSpacing: 3,
});

var gameWordStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 40,
    stroke: 'black',
    strokeThickness: 20,
    fill: '#FF7B20',
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
    padding: 4,
    letterSpacing: 3,
});

var gameWordStyleWhite = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 40,
    stroke: 'black',
    strokeThickness: 20,
    fill: 'white',
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
    padding: 4,
    letterSpacing: 3,
});

var linkStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 30,
    stroke: 'black',
    strokeThickness: 8,
    fill: 'white',
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
    padding: 4,
    letterSpacing: 3,
    align: 'right'
});