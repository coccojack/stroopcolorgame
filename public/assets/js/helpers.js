function generateGridArray(canvasW, canvasH) {
    var gridArray = [];
    gridArray.push({
        x: Math.round(canvasW * 0.20),
        y: Math.round(canvasH * 0.40)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.20),
        y: Math.round(canvasH * 0.55)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.20),
        y: Math.round(canvasH * 0.70)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.40),
        y: Math.round(canvasH * 0.40)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.40),
        y: Math.round(canvasH * 0.55)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.40),
        y: Math.round(canvasH * 0.70)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.60),
        y: Math.round(canvasH * 0.40)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.60),
        y: Math.round(canvasH * 0.55)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.60),
        y: Math.round(canvasH * 0.70)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.80),
        y: Math.round(canvasH * 0.40)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.80),
        y: Math.round(canvasH * 0.55)
    });
    gridArray.push({
        x: Math.round(canvasW * 0.80),
        y: Math.round(canvasH * 0.70)
    });


    return gridArray;
}

function floatVertically(object, initialY, delta, tilt, direction, velocity) {
    if (object.y > initialY + tilt) {
        if (direction.y > 0)
            direction.y = -direction.y;
    }
    if (object.y < initialY - tilt) {
        if (direction.y < 0)
            direction.y = -direction.y;
    }
    object.y += velocity * delta * direction.y;
}