const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let theta;
let fishes = [];
let bubbles = [];

let mouse = {
    x: canvas.width/2,
    y: canvas.height/2
}

window.addEventListener('mousemove',
function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

class LaunchingLeaf {
    constructor(y) {
        this.x = 150;
        this.y = canvas.height;
        this.radius = 200;  
        this.cannonWidth = 40;
        this.cannonHeight = 100;
        this.rotationAngle = 0; 
    }

    draw() {
        // angle
        let leaf_dx = mouse.x - this.x;
        let leaf_dy = mouse.y - this.y;
        theta = Math.atan2(leaf_dy, leaf_dx);
        // leaf
        ctx.save();
        ctx.translate(200, canvas.height - 100);
        ctx.rotate(theta + Math.PI/2);
        ctx.beginPath();
        ctx.moveTo(0, -100);
        ctx.lineTo(60, 100);
        ctx.lineTo(-60, 100);
        ctx.closePath();
        let leafGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        leafGradient.addColorStop(1, "rgba(0, 255, 0, 0.5)");
        ctx.fillStyle = leafGradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 100, 60, 0, Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = leafGradient;
        ctx.fill();
        ctx.restore();
    }

    update(rotationAngle) {
        this.rotationAngle = rotationAngle;
    }
}


class PoppingBubble {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.time = 0;
    }
    draw(){
        ctx.save();
        if (this.radius - this.time * 0.03 >= 10) {
            let bubbleGradient = ctx.createRadialGradient(this.x, this.y - this.time, 0, this.x, this.y - this.time, this.radius);
            bubbleGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
            bubbleGradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
            ctx.fillStyle = bubbleGradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y - this.time, Math.max(0, this.radius - this.time*0.03), 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + this.radius/4, this.y - this.radius/5 - this.time, Math.max(0, this.radius - this.time*0.03) * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = bubbleGradient
            ctx.fill();
            ctx.closePath();
            this.time++;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.radius;
            this.radius = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            this.time = 0;
        }
        ctx.restore();
    }
}


class HanenbowFish {
    constructor(x, y, angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = 20;
        this.time = 0;
        this.speed = 6;
        this.accelerationY = 0;
    }
    draw(){
        // tail
        ctx.save();
        let offsetY = Math.sin(this.time * 0.3) * this.radius/2;
        let offsetX = Math.cos(this.time * 0.3);
        let ellipseX = this.x - Math.cos(this.angle) * offsetX;
        let ellipseY = this.y - Math.sin(this.angle) * offsetX;
        let rotationAngle = Math.sin(this.time * 0.3) * (Math.PI / 6);
        ctx.translate(ellipseX, ellipseY);
        ctx.rotate(this.angle + rotationAngle);
        let tailGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        tailGradient.addColorStop(1, "rgba(255, 255, 0, 0.7)");
        ctx.fillStyle = tailGradient;
        ctx.beginPath();
        ctx.ellipse(-(this.radius*3/2), offsetY, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        this.time++
        ctx.restore();
        // body
        ctx.beginPath();
        let bodyGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        bodyGradient.addColorStop(.5, "rgba(255, 20, 147, 0.4)")
        bodyGradient.addColorStop(1, "rgba(255, 20, 147, 0.8)")
        ctx.fillStyle = bodyGradient;
        // mouth
        const isOpenMouth = Math.random() < 0.2;
        if (isOpenMouth) {
            ctx.arc(this.x, this.y, this.radius, Math.PI * 0.05 + this.angle, Math.PI * 1.95 + this.angle, false);    
        } else {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        }
        ctx.lineTo(this.x + 10*Math.cos(this.angle), this.y + 10*Math.sin(this.angle));
        ctx.fill();
        ctx.closePath();
        // eye
        ctx.beginPath();
        let eye_y;
        let eye_x = this.x + 8*Math.cos(this.angle - 0.85)
        this.angle >= (3 * Math.PI / 2) || this.angle < (Math.PI / 2) ? eye_y = this.y + 12*Math.sin(this.angle - 0.85) : eye_y = this.y + 12*Math.sin(this.angle + 0.85)
        let eyeGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        eyeGradient.addColorStop(.4, "rgba(255, 255, 255, 0.4)")
        eyeGradient.addColorStop(.8, "rgba(255, 255, 255, 0.8)")
        ctx.ellipse(eye_x, eye_y, 4, 7, this.angle, 0, Math.PI * 2);
        ctx.fillStyle = eyeGradient;
        ctx.fill();
        ctx.closePath();
        // iris
        ctx.beginPath();
        let iris_y;
        let iris_x = this.x + 8*Math.cos(this.angle - 0.85)
        this.angle >= (3 * Math.PI / 2) || this.angle < (Math.PI / 2) ? iris_y = this.y + 12*Math.sin(this.angle - 0.85) : iris_y = this.y + 12*Math.sin(this.angle + 0.85)
        let irisGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        irisGradient.addColorStop(1, "rgba(255, 20, 147, 0.6)")
        ctx.ellipse(iris_x, iris_y, 3, 6, this.angle, 0, Math.PI * 2);
        ctx.fillStyle = irisGradient;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.radian = (Math.PI / 180) * this.angle;
		// this.x += this.speed;
		// this.y += 4 * Math.cos(this.radian);
        // this.x += this.speed;
        if (this.x >= canvas.width) {
            this.speed *= -1;
            this.x = canvas.width;
            this.angle += 1;
        } else if (this.x <= 0) {
            this.speed *= -1;
            this.x = 0;
        }
        
        this.x += this.speed;
        this.y -= this.speed/2;
    }
}

class BaseWater {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.radius = 20;
        this.time = 0;
        this.amplitude = 10;
        this.frequency = 0.03;
        this.height = 140;
    }
    draw(){
        ctx.save();
        const waterGradient = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, canvas.width);
        waterGradient.addColorStop(1, "rgba(0, 191, 255, 0.6)");
        ctx.fillStyle = waterGradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height - this.height - (Math.sin((x + this.time) * this.frequency) * this.amplitude);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
        this.time++;
        ctx.restore();
    }
}

function init() {
    fishes = [];
    let overlapping = false;
    let numberOfEyeballs = 10;
    let protection = 10000;
    let counter = 0;

    while (fishes.length < numberOfEyeballs && counter < protection) {
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * 60) + 5
        };
        overlapping = false;
        for (let i = 0; i < fishes.length; i++) {
            let previousEye = fishes[i];
            let dx = eye.x - previousEye.x;
            let dy = eye.y - previousEye.y;
            let distance = Math.sqrt(dx*dx + dy*dy)
            if (distance < (eye.radius + previousEye.radius)) {
                overlapping = true;
                break;
            };
        }
        if (!overlapping) {
            fishes.push(new HanenbowFish(eye.x, eye.y, 0))
        }
        counter++
    }

    bubbles = [];
    let bubblesNumber = 120;
    let bubblesCounter = 0;

    while (bubbles.length < bubblesNumber) {
        let bubble = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * (30 - 10 + 1)) + 10
        };
        bubbles.push(new PoppingBubble(bubble.x, bubble.y, bubble.radius));
        bubblesCounter++;
    }
}

init();

function animate(){
    requestAnimationFrame(animate);
    const lineWidth = 30;
    ctx.lineWidth = lineWidth;

    for (let y = 0; y < canvas.height; y += lineWidth) {
        const gradient = 1 - (y*0.75 / canvas.height);
        const lineColor = `rgb(${gradient * 0}, ${gradient * 255}, ${gradient * 0})`;
        ctx.strokeStyle = lineColor;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    const launcher = new LaunchingLeaf(canvas.height);
    // stick.update(stick.rotationAngle + Math.PI / 180);
    launcher.draw();

    fishes.map((f) => {
		f.update();
		f.draw();
	});

    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].draw();
    }
    
    const water = new BaseWater();
    water.draw();
}
animate();

window.addEventListener('resize',
function(){
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    init();
})
