const canvas = document.getElementById("siet");
const ctx = canvas.getContext("2d");

const paintCanvas = document.getElementById("paint");
const paintCtx = paintCanvas.getContext("2d");


canvas.height = window.innerHeight+10;
canvas.width = window.innerWidth;
paintCanvas.height = window.innerHeight+10;
paintCanvas.width = window.innerWidth;
let squaresInLine = 0;
let squaresInColumn = 0;
let anglesCalculated = false;
let viewModeSelected = "darkAlpha"

let Circles = [];
let DrawPoints = [];
let pointInRow = 0;

class Circle {
    constructor(x,y,radius, velocity,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.angle = 1.5707963268*2;
        this.color = color;
        this.counter = 0;
    }
    draw(){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x,this.y,2,2);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x,this.y,this.radius, 0, Math.PI*2, true);
        ctx.stroke();
    }
    update(){
        this.draw(); 
    }
    changeSpeed(min, max){
        this.velocity = min + Math.floor(Math.random()*(max-min));
    }
    changeSpeedFluent(min, max){
        let random = Math.floor(Math.random()*2);
        if(random === 1 && this.velocity < max){
            this.velocity++;
        } else if(random === 0 && this.velocity > min){
            this.velocity--;
        }
    }
}

class DrawingPoint {
    constructor(x,y, velocity, color, width, indexOfCircle){  
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.angle = 1.5707963268*2;
        this.color = color;
        this.width = width;
        this.indexOfCircle = indexOfCircle
        this.lastPoint = {x: this.x, y: this.y};
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x-Math.floor(this.width/2),this.y-Math.floor(this.width/2),this.width,this.width);
        if(pointInRow > 1 && this.lastPoint != null){
            paintCtx.beginPath();
            paintCtx.strokeStyle = this.color;
            paintCtx.lineWidth = this.width;
            paintCtx.moveTo(this.lastPoint.x, this.lastPoint.y);
            paintCtx.lineTo(this.x-Math.floor(this.width/2),this.y-Math.floor(this.width/2))
            paintCtx.stroke();
        }
        this.lastPoint = {x:this.x-Math.floor(this.width/2), y:this.y-Math.floor(this.width/2)};
        pointInRow ++
    }
    update(){
        this.draw();
    }
    
    changeSpeed(min, max){
        this.velocity = min + Math.floor(Math.random()*(max-min));
    }
}

function createCircle(x,y,radius,velocity,color){
    if(Circles.length>0){
        Circles.push(new Circle(Circles[Circles.length-1].x - x, Circles[Circles.length-1].y - y, radius, velocity,color));
    } else {
        Circles.push(new Circle(x, y, radius, velocity, color));
    }
}

function createDrawingPoint(x,y,velocity,color,width,indexOfCircle){
    DrawPoints.push(new DrawingPoint(Circles[indexOfCircle].x - x,Circles[indexOfCircle].y - y,velocity,color,width,indexOfCircle))
}


    
function atan2FunctionVisuality (){
    let x = 100;
    let y = 150;
    let i = 1;
    ctx.fillRect(0,y,canvas.width,1);
    ctx.fillRect(x,0,1,canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(x,y,1,1);
    ctx.arc(x,y,20,0,Math.PI*2,true);
    ctx.moveTo(0,0);
    ctx.lineTo(x,y);
    ctx.stroke();
    const angle = Math.atan2(y,x)
    console.log("Radians: " + angle);
    console.log("Degrees: " + (angle > 0 ? angle : (2*Math.PI + angle)) * 360 / (2*Math.PI))
}

function calAngle(index){
    if(index>0){
        let x = Circles[index].x;
        let y = Circles[index].y;
        const angle = Math.atan2(Circles[index-1].y - y, Circles[index-1].x - x);
        Circles[index].angle = angle * -1;
    }
}



function drawAllCircles (circlesOff){
    Circles.forEach((circle, i)=>{
        if(i > 0){
            circle.angle += circle.velocity/100;
            circle.x = Circles[i-1].x+(Math.cos(circle.angle) * Circles[i-1].radius);
            circle.y = Circles[i-1].y+(Math.sin(circle.angle) * Circles[i-1].radius);
        }
        if(i > circlesOff-1){
            circle.update()
        }
    });
}

function drawAllDrawingPoints (){
    DrawPoints.forEach((point, i)=>{
        point.angle += point.velocity/100;
        point.x = Circles[point.indexOfCircle].x+(Math.cos(point.angle) * Circles[point.indexOfCircle].radius);
        point.y = Circles[point.indexOfCircle].y+(Math.sin(point.angle) * Circles[point.indexOfCircle].radius);
        point.update();
    })
}

function animate(){
    let animationId = requestAnimationFrame(animate);
    viewModeCheck()
    if(anglesCalculated === false){
        for(let i=0;i<Circles.length;i++){
            calAngle(i);
        }
        anglesCalculated = true;
    }
    drawAllDrawingPoints();
    
}

function drawSquareNet (color, space, lineWidth){
    for (let i=0;i<canvas.width;i+=space){
        ctx.fillStyle = color;
        ctx.fillRect(i,0,lineWidth, canvas.height);
        squaresInLine++;
    }
    for (let j=0;j<canvas.height;j+=space){
        ctx.fillStyle = color;
        ctx.fillRect(0,j,canvas.width, lineWidth);
        squaresInColumn++;
    }
}

function setRandom(min, max){
    return min + Math.floor(Math.random()*(max-min));
}

createCircle(canvas.width/2,canvas.height/2,70,0, "black");
createCircle(setRandom(-1,1),setRandom(-1,1),60,2,"black");
createCircle(setRandom(-1,1),setRandom(-1,1),50,1, "black");
createCircle(setRandom(-1,1),setRandom(-1,1),90,2, "black");
createDrawingPoint(setRandom(-1,1),setRandom(-1,1),1,"red",2,1);
createDrawingPoint(setRandom(-1,1),setRandom(-1,1),2,"blue",2,3);
// createDrawingPoint(setRandom(-1,1),setRandom(-1,1),3,"green",1,3);
// createDrawingPoint(setRandom(-1,1),setRandom(-1,1),4,"orange",1,3);
animate();

const settingsBtn = document.getElementById('settingsBtn');
const settingsSlider = document.getElementById('settingsSlider');
const circlesBtn = document.getElementById('circlesBtn');
const viewModeBtn = document.getElementById('viewModeBtn');
const pointsModeBtn = document.getElementById('pointsModeBtn');
const resetViewModeBtn = document.getElementById('resetViewModeBtn');

let settingsSliderPos = false;
let circleModeSettings = false;
let viewModeSettings = false;
let pointsModeSettings = false;

// document.getElementById('circlesToHide').addEventListener('change', function(){
//     document.getElementById('circlesToHide').max = Circles.length;
// })
settingsBtn.addEventListener("click",(event)=>{
    if(settingsSliderPos === false){
        settingsSlider.classList.remove('animate-closeSettingsSlider');
        settingsBtn.classList.remove('animate-moveSettingsButtonLeft');
        settingsSlider.classList.add('animate-openSettingsSlider');
        settingsBtn.classList.add('animate-moveSettingsButtonRight');
        settingsSliderPos = true;
    } else if (settingsSliderPos === true){ 
        document.getElementById('moreViewOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-moreViewOptions').classList.remove('animate-openModeSquare');
        document.getElementById('moreViewOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-moreViewOptions').classList.add('animate-closeModeSquare');
        document.getElementById('moreCircleOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-moreCircleOptions').classList.remove('animate-openModeSquare');
        document.getElementById('moreCircleOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-moreCircleOptions').classList.add('animate-closeModeSquare');
        document.getElementById('morePointsOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-morePointsOptions').classList.remove('animate-openModeSquare');
        document.getElementById('morePointsOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-morePointsOptions').classList.add('animate-closeModeSquare'); 
        settingsSlider.classList.remove('animate-openSettingsSlider');
        settingsBtn.classList.remove('animate-moveSettingsButtonRight');
        settingsSlider.classList.add('animate-closeSettingsSlider');
        settingsBtn.classList.add('animate-moveSettingsButtonLeft');
        settingsSliderPos = false;
        circleModeSettings = false;
        viewModeSettings = false;
        pointsModeSettings = false;       
    }
})
circlesBtn.addEventListener('click', (event)=>{
    if(circleModeSettings === false){
        document.getElementById('moreCircleOptions').classList.remove('animate-closeModeSettings');
        document.getElementById('square-moreCircleOptions').classList.remove('animate-closeModeSquare');
        document.getElementById('moreCircleOptions').classList.add('animate-openModeSettings');
        document.getElementById('square-moreCircleOptions').classList.add('animate-openModeSquare');
        circleModeSettings = true;
    } else if(circleModeSettings === true){
        document.getElementById('moreCircleOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-moreCircleOptions').classList.remove('animate-openModeSquare');
        document.getElementById('moreCircleOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-moreCircleOptions').classList.add('animate-closeModeSquare');
        circleModeSettings = false;
    }
})
viewModeBtn.addEventListener('click', (event)=>{
    if(viewModeSettings === false){
        document.getElementById('moreViewOptions').classList.remove('animate-closeModeSettings');
        document.getElementById('square-moreViewOptions').classList.remove('animate-closeModeSquare');
        document.getElementById('moreViewOptions').classList.add('animate-openModeSettings');
        document.getElementById('square-moreViewOptions').classList.add('animate-openModeSquare');
        viewModeSettings = true;
    } else if(viewModeSettings === true){
        document.getElementById('moreViewOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-moreViewOptions').classList.remove('animate-openModeSquare');
        document.getElementById('moreViewOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-moreViewOptions').classList.add('animate-closeModeSquare');
        viewModeSettings = false;
    }
})
pointsModeBtn.addEventListener('click', (event)=>{
    if(pointsModeSettings === false){
        document.getElementById('morePointsOptions').classList.remove('animate-closeModeSettings');
        document.getElementById('square-morePointsOptions').classList.remove('animate-closeModeSquare');
        document.getElementById('morePointsOptions').classList.add('animate-openModeSettings');
        document.getElementById('square-morePointsOptions').classList.add('animate-openModeSquare');
        pointsModeSettings = true;
    } else if(pointsModeSettings === true){
        document.getElementById('morePointsOptions').classList.remove('animate-openModeSettings');
        document.getElementById('square-morePointsOptions').classList.remove('animate-openModeSquare');
        document.getElementById('morePointsOptions').classList.add('animate-closeModeSettings');
        document.getElementById('square-morePointsOptions').classList.add('animate-closeModeSquare'); 
        pointsModeSettings = false;       
    }
})


function viewModeCheck (){
    let formBackgroundColor = document.querySelector('#viewModeRadioBoxes');
    let drawness = document.getElementById('drawness').checked;
    
    if(formBackgroundColor.background.value === "dark"){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        paintCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    } else if (formBackgroundColor.background.value === "white"){
        ctx.fillStyle = 'rgb(255, 255, 255)';
        paintCtx.fillStyle = 'rgb(255, 255, 255)';
    }
    if(drawness != true){
        paintCtx.fillRect(0,0,canvas.width,canvas.height);
    }
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawAllCircles(0);
}


function darkAlpha (){
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    paintCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    paintCtx.fillRect(0,0,canvas.width,canvas.height);
    drawAllCircles(0);
}
function whiteCircle(circlesOff){
    paintCtx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawAllCircles(circlesOff);
}
function whiteCirclesDraw(circlesOff){
    paintCtx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawAllCircles(circlesOff);
}



function addNewCircle(radius, velocity, index){
    let child = document.createElement("div");
    let radiusInput = document.createElement("input");
    let velocityInput = document.createElement("input");
    child.className = "circleSettings";

    radiusInput.type = "number";
    radiusInput.min = 10;
    radiusInput.max = 100;
    radiusInput.classList.add('circleRadius');
    radiusInput.value = radius;
    radiusInput.addEventListener('change', function(){
        Circles[index].radius = radiusInput.value;
    })
    
    velocityInput.type = "number";
    velocityInput.min = 0;
    velocityInput.max = 10;
    velocityInput.classList.add("circleVelocity");
    velocityInput.value = velocity;
    velocityInput.addEventListener('change', function(){
        Circles[index].velocity = velocityInput.value;
    })

    child.appendChild(radiusInput)
    child.appendChild(velocityInput)
    document.getElementById("circleForm").appendChild(child)
}
function removeCircle(){
    if(Circles.length > 1){
        document.getElementById("circleForm").removeChild(document.querySelector("div.circleSettings:last-Child"))
        Circles.pop();
        DrawPoints.forEach((drawingPoint, index)=>{
            drawingPoint.lastPoint = null;
        })
    }
    //document.getElementById("circleForm").removeChild(document.getElementById("circleForm").childNodes[document.getElementById("circleForm").childNodes.length-1])
}
function addPoint (width, velocity, index, indexOfCircle){
    let child = document.createElement('div');
    let velocityInput = document.createElement('input');
    let widthInput = document.createElement('input');
    let colorInput = document.createElement('input');
    let onCircleInput = document.createElement('input');
    child.className = "pointsSettings";

    velocityInput.type = 'number';
    velocityInput.min = 0;
    velocityInput.max = 10;
    velocityInput.classList.add("pointVelocity");
    velocityInput.value = velocity;
    velocityInput.addEventListener('change', function(){
        DrawPoints[index].velocity = velocityInput.value;
    })

    widthInput.type = 'number';
    widthInput.min = 1;
    widthInput.max = 10;
    widthInput.classList.add('pointWidth');
    widthInput.value = width;
    widthInput.addEventListener('change', ()=>{
        DrawPoints[index].width = widthInput.value;
    })

    colorInput.type = 'color';
    colorInput.classList.add('pointColor');
    colorInput.addEventListener('change', function(){
        DrawPoints[index].color = colorInput.value;
    })

    onCircleInput.type = 'number';
    onCircleInput.min = 0;
    onCircleInput.max = Circles.length-1;
    onCircleInput.classList.add('pointOnCircle');
    onCircleInput.value = indexOfCircle;
    onCircleInput.addEventListener('change', ()=>{
        DrawPoints[index].indexOfCircle = onCircleInput.value;
    })

    child.appendChild(velocityInput);
    child.appendChild(widthInput);
    child.appendChild(colorInput);
    child.appendChild(onCircleInput);
    document.getElementById("pointsForm").appendChild(child)
    console.log(child)
}
function removePoint (){

}



document.getElementById('addPointBtn').addEventListener('click', ()=>{
    addPoint(2, 2, DrawPoints.length-1, Circles.length-1);
    createDrawingPoint(setRandom(-1,1), setRandom(-1,1), 2, "blue", 2, Circles.length-1)
})
document.getElementById('removePointBtn').addEventListener('click', function(){
})
document.getElementById("addCircleBtn").addEventListener('click', function(){
    createCircle(setRandom(-1,1),setRandom(-1,1), 50, 0, "black");
    addNewCircle(50, 0, Circles.length-1);
})
document.getElementById("removeCircleBtn").addEventListener('click', function(){
    removeCircle()
})
Circles.forEach((circle, index)=>{
    addNewCircle(circle.radius, circle.velocity, index);
})
DrawPoints.forEach((point,index)=>{
    addPoint(point.width, point.velocity, index, point.indexOfCircle);
})