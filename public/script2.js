const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


let particleArray = [];
let adjustX = 27;
let adjustY = 20;
ctx.lineWidth = 3;




const mouse = {
    x: null,
    y: null,
    radius: 250
};
// window.addEventListener(inputEvent, function(event) {
//     if (inputEvent === 'touchmove') {
//         mouse.x = event.touches[0].clientX;
//         mouse.y = event.touches[0].clientY;
//     } else {
//         mouse.x = event.clientX;
//         mouse.y = event.clientY;
//     }
// });
window.addEventListener('mousemove', function(event) {
   
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    
});



ctx.fillStyle = 'black';
// ctx.font = baseFontSize + 'px helvetica'; 
ctx.font = '30px helvetica';//폰트 크기
ctx.fillText('Bubble', 0, 30); //그려지는 좌표
const textCoordinates = ctx.getImageData(0, 0,1920, 1280); //보여지는 크기
ctx.setTransform(1, 0, 0, 1, 0, 0);





class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 8) + 1;
        this.distance;
    }
    draw() {
        ctx.fillStyle = '#E40304';
        ctx.strokeStyle = '#E40304';
        ctx.beginPath();
        if (this.distance < mouse.radius - 5) {
            this.size =100;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else if (this.distance <= mouse.radius) {
            this.size += (60 - this.size) * 0.05;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        } else {
            this.size +=(30 - this.size) * 0.05
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
        
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}

init();

function animate() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

animate();

// // 윈도우 크기가 변경될 때마다 캔버스 크기를 조절
// window.addEventListener('resize', function() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     init(); // 파티클 재설정
// });
function connect(){
    let opacityValue =1; 
    for (let a = 0; a< particleArray.length; a++){
        for (let b=a; b < particleArray.length;b++ ){
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // let distance = Math.sqrt(dx * dx +dy * dy);
            let dx = particleArray[a].x-particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx +dy * dy);
            opacityValue = 1 -(distance/50);
            ctx.strokeStyle = 'rgba(255,255,255' +opacityValue +')';

            if(distance <50){
                ctx.lineWidth =2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();

            }


        }
    }

}