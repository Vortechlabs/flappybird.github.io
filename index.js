const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

var myGamePiece;
var myObstacles = [];
var myScore;

var objectImage = new Image();
objectImage.src = '/sprites/object.png'; 

var resistanceImage = new Image();
resistanceImage.src = '/sprites/resistance.png'; 

objectImage.onload = function() {
    console.log('Gambar object dimuat');
    startGame(); 
};

function startGame() {
    myGamePiece = new component(60, 74, objectImage, 10, 120, 'image'); // Use image for game piece
    myGamePiece.gravity = 0.5;
    myScore = new component('30px', 'Consolas', 'black', 280, 40, 'text');
    myGameArea.start();
}

var myGameArea = {
    canvas: canvas,
    context: c,
    frameNo: 0,
    start: function() {
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert("Silakan putar perangkat Anda ke mode landscape untuk pengalaman bermain yang lebih baik.");
    }
}

// Panggil fungsi saat halaman dimuat
window.onload = function() {
    checkOrientation();
    startGame();
};

// Tambahkan event listener untuk mendeteksi perubahan orientasi
window.addEventListener("resize", checkOrientation);

function component(width, height, image, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.speedX = 0;
    this.y = y;
    this.x = x;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.text = '';
    this.image = image; 

    this.update = function() {
        ctx = myGameArea.context;
        if (this.type === 'text') {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = 'black'; 
            ctx.fillText(this.text, this.x, this.y);
        } else {
            if (this.image.complete) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                console.error("Image not loaded: ", this.image.src);
            }
        }
    }

    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 200;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        myObstacles.push(new component(50, height, resistanceImage, x, 0, 'image')); // Rintangan atas
        myObstacles.push(new component(50, myGameArea.canvas.height - height - gap, resistanceImage, x, height + gap, 'image')); // Rintangan bawah
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1; 
        myObstacles[i].update();
    }
    myScore.text = 'SCORE: ' + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n; 
}

window.onload = startGame;
