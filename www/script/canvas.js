// set the size
var canvasW = 200;
var canvasH = 300;

// panel
var panel = document.getElementById('canvasPanel');
var panel_canvas = document.createElement('canvas');
panel.appendChild(panel_canvas);
panel_canvas.width = canvasW;
panel_canvas.height = canvasH;
var ctx = panel_canvas.getContext('2d');

var Dot = function(x, y, offsetx1, offsety1, offsetx2, offsety2) {
    this.x = x;
    this.y = y;

    this.offsetx1 = offsetx1;
    this.offsety1 = offsety1;
    this.offsetx2 = offsetx2;
    this.offsety2 = offsety2;

    this.x1 = x + offsetx1;
    this.y1 = y + offsety1;

    this.x2 = x + offsetx2;
    this.y2 = y + offsety2;
}
Dot.prototype = {
    setPos: function(circle) {
        this.x = circle.x + circle.radius * Math.cos(circle.currentAngle * Math.PI / 180);
        this.y = circle.y + circle.radius * Math.sin(circle.currentAngle * Math.PI / 180);
    },
    setAnchors: function() {
        this.x1 = this.x + this.offsetx1;
        this.y1 = this.y + this.offsety1;
        this.x2 = this.x + this.offsetx2;
        this.y2 = this.y + this.offsety2;
    }
}

var Circle = function(x, y, radius, clock, startAngle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.clock = clock;
    this.startAngle = startAngle;
    this.currentAngle = startAngle;
}

var dot01 = new Dot(50, -100, 0, 40, 0, -40);
    var dot02 = new Dot(-5, -205, 35, 30, -15, 65);
    var dot03 = new Dot(-50, -80, 0, -50, 0, 55);
    var dots = [dot01, dot02, dot03];
    var circle01 = new Circle(50, -85, 50, false, 180);
    var circle02 = new Circle(-5, -235, 40, false, 90);
    var circle03 = new Circle(-20, -80, 30, false, 180);

    var dot01 = new Dot(25, -50, 0, 20, 0, -20);
    var dot02 = new Dot(-2.5, -102.5, 17.5, 15, -7.5, 30);
    var dot03 = new Dot(-25, -40, 0, -25, 0, 27.5);
    var dots = [dot01, dot02, dot03];
    var circle01 = new Circle(25, -42.5, 25, false, 90);
    var circle02 = new Circle(-2.5, -117.5, 20, false, 45);
    var circle03 = new Circle(-10, -40, 15, false, 90);
    var circles = [circle01, circle02, circle03];
    var frame = 0;
    function init() {
    dot01.setPos(circle01);
    dot02.setPos(circle02);
    dot03.setPos(circle03);
    }
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    requestAnimationFrame(run);
    function run() {
    update();
    drawShape();
    // drawTrack();
    requestAnimationFrame(run);
    }
    run();
    function update() {
    frame++;
    for (var i = 0; i < circles.length; ++i) {
    circles[i].currentAngle += 3;
    }
    for (var d = 0; d < dots.length; ++d) {
    dots[d].setPos(circles[d]);
    dots[d].setAnchors();
    }
    }
    function drawShape() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    var grd = ctx.createLinearGradient(dot02.x - 100, dot02.y, -10, 0);
    grd.addColorStop(0.0, '#ef3979');
    grd.addColorStop(0.6, '#f26330');
    grd.addColorStop(1.0, '#ffe56b');
    ctx.beginPath();
    ctx.arc(0, -50, 100, 0, 2 * Math.PI);
    ctx.fillStyle = "#024";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(0, -10, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#036";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "RGBA(44,138,243,0.3)";
    ctx.fill();
    ctx.closePath();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(5, -15, dot01.x1, dot01.y1, dot01.x, dot01.y);
    ctx.bezierCurveTo(dot01.x2, dot01.y2, dot02.x1, dot02.y1, dot02.x, dot02.y);
    ctx.bezierCurveTo(dot02.x2, dot02.y2, dot03.x1, dot03.y1, dot03.x, dot03.y);
    ctx.bezierCurveTo(dot03.x2, dot03.y2, -5, -15, 0, 0);
    ctx.fillStyle = grd;
    ctx.shadowColor = "#f90";
    ctx.shadowBlur = 100;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(-16, 15);
    ctx.lineTo(16, 5);
    ctx.lineTo(16, 70);
    ctx.lineTo(-16, 80);
    var grd_candle = ctx.createLinearGradient(-16, 5, 16, 75);
    grd_candle.addColorStop(0, '#FF5A59');
    grd_candle.addColorStop(1, '#FFCB7B');
    ctx.fillStyle = grd_candle;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    }
function drawTrack() {

    for (var c = 0; c < circles.length; ++c) {
        ctx.save();
        ctx.translate(canvasW / 2, canvasH / 2);

        ctx.beginPath();
        ctx.arc(circles[c].x, circles[c].y, circles[c].radius, 0, Math.PI * 2);
        ctx.strokeStyle = "RGBA( 255,250,255,1 )";
        ctx.stroke();
        ctx.closePath();

        ctx.translate(circles[c].x, circles[c].y);
        ctx.rotate(Math.PI * circles[c].currentAngle / 180);
        ctx.translate(circles[c].radius, 0);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 10, 10);

        ctx.restore();
    }

}