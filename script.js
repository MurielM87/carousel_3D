let radius = 240;
let autorotate = true;
let rotatespeed = -60;
let imgwidth = 120;
let imgheight = 170;

setTimeout(init, 500);

let odrag = document.getElementById('dragcontainer');
let ospin = document.getElementById('spincontainer');

let aimg = ospin.getElementsByTagName('img');
let ele = [...aimg];

ospin.style.width = imgwidth + "px";
ospin.style.height = imgheight + "px";

let ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delaytime) {
    for(let i = 0; i < ele.length; i++) {
        ele[i].style.transform = "rotateY(" + (i * (360 / ele.length)) + "deg) translateZ(" + radius + "px)";
        ele[i].style.transition = "transform 1s";
        ele[i].style.transitionDelay = delaytime || (ele.length - 1) / 4 + "s";
    }
}

function applytransform(obj) {
    if(ty > 180) ty = 180;
    if (ty < 0) ty = 0;

    obj.style.transform = "rotateX(" + (-ty) + "deg) rotateY(" + (tx) + "deg)";
}

function playspin(yes) {
    ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

let sx, sy, nx, ny, desx = 0, desy = 0, tx = 0, ty = 10;

if(autorotate) {
    let animationname = (rotatespeed > 0 ? 'spin' : 'spinrevert');

    ospin.style.animation = `${animationname} ${Math.abs(rotatespeed)}s infinite linear`;
}

document.onpointerdown = function(e) {
    clearInterval(odrag.timer);

    e = e || window.event;

    let sx = e.clientX;
    sy = e.clientY;

    this.onpointermove = function(e) {
        e = e || window.event;

        let nx = e.clientX;
        ny = e.clientY;
        desx = nx - sx;
        desy = ny - sy;

        tx += desx * 0.1;
        ty += desy * 0.1;

        applytransform(odrag);
        sx = nx;
        sy = ny;
    }

    this.onpointerup = function(e) {
        odrag.timer = setInterval(function() {
            desx *= 0.95;
            desy *= 0.95;
            tx += desx * 0.1;
            ty += desy * 0.1;

            applytransform(odrag);
            playspin(false);

            if(Math.abs(desx) < 0.5 && Math.abs(desy) < 0.5) {
                clearInterval(odrag.timer);
                playspin(true)
            }
        }, 17);

        this.onpointermove = this.onpointerup = null;
    };
    return false;
}

document.onmousewheel = function(e) {
    e = e || window.event;
    let d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
}