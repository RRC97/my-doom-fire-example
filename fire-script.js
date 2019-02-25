var canvas = document.getElementById("fireCanvas");
var context = canvas.getContext("2d");

//BASE DAS CORES - getColor - (R, G, B)

// false = cores do DOOM / true = Monocromatic
var monocromatic = false;

//Base da cor monocromatica - vermelho
//Mude a base caso queira outra cor
var baseMonocromatic = getColor(226, 33, 33);

// frames por segundo - (millisegundos / frames)
var timeFrame = (1000 / 60);

// pixel largura
var width = 50;

// pixel altura
var height = 50;

// Tamanho por pixel
var size = 5;

// Decair do fogo
var decayBase = 3;

//Array do fogo
var fire = [];

/*  

Base colors DOOM

baseInit = white,
basePrimary = orange,
baseSecondary = darkorange,
baseFinal = black 

Multiple base - Mude as bases caso queria outras cores */
var baseInit = getColor(255, 255, 255);
var basePrimary = getColor(255, 165, 0);
var baseSecondary = getColor(255, 69, 0);
var baseFinal = getColor(0, 0, 0);


function start() {
    canvas.setAttribute("width", width * size);
    canvas.setAttribute("height", height * size);
    
    createFireInstance();
    createFireSource();
    
    update();
    draw();
}

// Atualização do fogo
function update() {
    
    for(var row = 0; row < height; row++) {
        for(var column = 0; column < width; column++) {
            var index =  column + (row * width);
            var below = index + width;
            
            if(below < width * height) {
                
                var value = fire[below];
                var decay = Math.floor(Math.random() * decayBase);
                
                fire[index - decay] = (value - decay >= 0 ? value - decay : 0);
            }
        }
    }
    
    setTimeout(update, timeFrame);
}

// Desenho do canvas
function draw() {

    context.save();
    context.beginPath();
    for(var row = 0; row < height; row++) {
        for(var column = 0; column < width; column++) {
            var index =  column + (row * width);
            
            if(monocromatic) {
                var alpha = fire[index] / 36;
                var color = alphaColor(baseMonocromatic, alpha);
            } else {
                var color = getBaseColor(fire[index]);
            }

            context.fillStyle = rgbToHex(color);
            
            context.fillRect(column * size, row * size, size, size);
        }
    }
    context.closePath();
    context.restore();
    
    setTimeout(draw, timeFrame);
}

    
//Criação do array de intesidades
function createFireInstance() {
    for(var row = 0; row < height; row++) {
        for(var column = 0; column < width; column++) {
            var index =  column + (row * width);
            
            fire[index] = 0;
        }
    }
    
}

//Criação da origem do fogo
function createFireSource() {
    for(var column = 0; column < width; column++) {
        var index =  column + ((height * width) - width);
        
        fire[index] = 36;
    }
}

// Combinação de duas cores
function mergeColor(colorA, colorB) {
    var r = Math.floor((colorA.r + colorB.r));
    var g = Math.floor((colorA.g + colorB.g));
    var b = Math.floor((colorA.b + colorB.b));
    
    return getColor(r, g, b);
}

// Combinação de uma cor com um alpha
function alphaColor(color, alpha) {
    
    var r = Math.floor(color.r * alpha);
    var g = Math.floor(color.g * alpha);
    var b = Math.floor(color.b * alpha);
    
    return getColor(r, g, b);
}

//Transformação de RGB em objeto
function getColor(r, g, b) {
    return {r: r, g: g, b: b};
}

//Conversão de RGBObject para Hexadecimal
function rgbToHex(color) { 
    return "#" + getHex(color.r) + getHex(color.g) + getHex(color.b);
}

//Pegar base da cor pela intensidade
function getBaseColor(intensity) {
    var type = Math.floor(intensity / 12);
    var alpha = intensity / 36;
    var color, colorA, colorB;

    switch(type) {
        case 0:
            colorA = baseSecondary;
            colorB = baseFinal;
            break;
        case 1:
            colorA = basePrimary;
            colorB = baseSecondary;
            break;
        case 2:
            colorA = baseInit;
            colorB = basePrimary;
            break;
        case 3:
            colorA = baseInit;
            colorB = baseInit;
            break;
    }

    var alphaA = (intensity % 12) / 12;
    var alphaB = (12 - (intensity % 12)) / 12;

    colorA = alphaColor(colorA, alphaA);
    colorB = alphaColor(colorB, alphaB);

    return mergeColor(colorA, colorB);
}

//Pegar hexadecimal de um valor decimal
function getHex(value) { 
    var base = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    
    var lengthUnit = value % 16;
    var lengthDecimal = Math.floor(value / 16);
    
    return base[lengthDecimal] + base[lengthUnit];
}

//Iniciar o programa
start();