var c;
var r;

var pi = Math.PI, tau = 2 * pi;

function ready() {
  //scrolling
  d('poemscroll').addEventListener('scroll', function() {
    sp = d('poemscroll').scrollTop / (d('poem').offsetHeight - d('poemscroll').offsetHeight);
    scroll();
  });
  sp = d('poemscroll').scrollTop / (d('poem').offsetHeight - d('poemscroll').offsetHeight);

  //canvas
  c = d('c');
  r = c.getContext('2d');

  //dimensions
  c.height = window.innerHeight;
  h = window.innerHeight;
  c.width = window.innerWidth;
  w = window.innerWidth;

  //functions
  init();
  setInterval(loop, 33);
  // loop();
  window.requestAnimationFrame(draw);
}
function d(el) {
  return document.getElementById(el);
}

function loop() {
  moveani();
  moveme();
  if(!obj.me.on && !obj.me.ou) wrapchase();
}

function scroll() {

}

window.addEventListener('resize', function() {
  c.height = window.innerHeight;
  h = window.innerHeight;
  c.width = window.innerWidth;
  w = window.innerWidth;
});

function ang(ax, ay, bx, by) {
  var ret = Math.acos((bx-ax)/Math.sqrt(sqr(bx-ax)+sqr(by-ay)));
  if(ay - by > 0) return -ret + pi; else return ret + pi;
  // return ret;
}
function dist(ax, ay, bx, by) {
  return Math.sqrt(sqr(bx-ax)+sqr(by-ay));
}
function sqr(n) { return n*n; }
function afix(a) {
  while(a > tau) a -= tau;
  while(a < 0) a += tau;
  return a;
}
function per() {
  return 2 * h + 2 * w;
}
function pta(p) {
  if(p < w)            return [p, 0, 0];
  else if(p < w + h)   return [w, p - w, 1];
  else if(p < 2*w + h) return [p - h, h, 2];
  else                 return [0, 2*h + 2*w - p, 3];
}
function inbounds(x, y) {
  if(0 > x || x > w) return false;
  if(0 > y || y > h) return false;
  return true;
}
function rgb(r, g, b) {
  return 'rgb('+r+','+g+','+b+')';
}
function rgba(r, g, b, a) {
  return 'rgba('+r+','+g+','+b+','+a+')'
}

var h = window.innerHeight, w = window.innerWidth;
var sp = 0;
var t;
var obj = {
  'background': {'color': rgb(29, 171, 43)},
  'ani': {'x': 0, 'y': 0, 'v': 0, 'vx': 0, 'vy': 0, 's': 0, 'd': 0, 'color': rgb(224, 185, 13)},
  'me': {'x': 0, 'y': 0, 'on': false, 'p': false, 'fd': 0, 'ou':false, 'color': rgb(158, 0, 255)}
};

function init() {
  obj.ani.x = Math.random() * w;
  obj.ani.y = Math.random() * h;
  obj.ani.s = Math.random() * 5 + 3;
  obj.ani.d = Math.random() * pi * 2;
  obj.ani.dm = false;

  t = Math.random() * tau;
  obj.me.x = Math.cos(t) * 100 + obj.ani.x;
  obj.me.y = Math.sin(t) * 100 + obj.ani.y;
}

function wrapchase() {
  var t = pta(Math.random() * per());

  obj.ani.x = t[0];
  obj.ani.y = t[1];
  obj.ani.s = Math.random() * 4 + 3;
  obj.ani.d = Math.random() * pi * 2;
  obj.ani.dm = false;

  t = Math.random() * pi + t[2]*pi/2 + pi;
  obj.me.x = Math.cos(t) * 100 + obj.ani.x;
  obj.me.y = Math.sin(t) * 100 + obj.ani.y;
  obj.me.ou = true;
}

function moveani() {
  if(obj.ani.v >= 100) obj.ani.s = -(Math.random() * 4 + 2);
  else if(obj.ani.v <= -100) obj.ani.s = Math.random() * 4 + 2;
  obj.ani.v += obj.ani.s;

  obj.ani.x += Math.cos(obj.ani.d) * 3;
  obj.ani.y += Math.sin(obj.ani.d) * 3;
  obj.ani.vx = obj.ani.x + obj.ani.v * Math.cos(obj.ani.d - pi / 2);
  obj.ani.vy = obj.ani.y + obj.ani.v * Math.sin(obj.ani.d - pi / 2);
}

function moveme() {
  //angle
  if(!obj.me.p) t = ang(obj.me.x, obj.me.y, obj.ani.vx, obj.ani.vy);
  if(dist(obj.me.x, obj.me.y, obj.ani.vx, obj.ani.vy) > 100) {
    if(obj.me.p) {
      t = ang(obj.me.x, obj.me.y, obj.ani.vx, obj.ani.vy);
      obj.me.p = false;
    }
    obj.me.x = obj.ani.vx + Math.cos(t) * 100;
    obj.me.y = obj.ani.vy + Math.sin(t) * 100;
  } else {
    obj.me.fd = t;
    obj.me.p = true;
    if(afix(obj.ani.d - t) < pi) {
      t -= pi/2;
    } else {
      t += pi/2;
    }
    obj.me.x += 7 * Math.cos(t);
    obj.me.y += 7 * Math.sin(t);
    t = obj.me.fd;
  }

  if(inbounds(obj.me.x, obj.me.y)) obj.me.on = true; else obj.me.on = false;
  if(obj.me.x < -100 || obj.me.x > w + 100 || obj.me.y < -100 || obj.me.y > h + 100) obj.me.ou = false;
  if(obj.me.on) obj.me.ou = false;
}

function draw() {
  var co;
  //background
  co = obj.background.color;
  r.fillStyle = co;
  r.fillRect(0, 0, w, h);

  //ani
  co = obj.ani.color;
  r.fillStyle = co;
  r.beginPath();
  r.arc(obj.ani.vx, obj.ani.vy, 8, 0, tau);
  r.fill();
  r.closePath();


  //me
  co = obj.me.color;
  r.fillStyle = co;
  r.beginPath();
  r.arc(obj.me.x, obj.me.y, 9, 0, tau);
  r.fill();
  r.closePath();

  window.requestAnimationFrame(draw);
}
