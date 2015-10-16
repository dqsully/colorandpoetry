var c;
var r;

var pi = Math.PI, tau = 2 * pi;
var speed = 5;

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
  moveIdeas();
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
var cos = Math.cos;
var sin = Math.sin;
function afix(a) {
  while(a > tau) a -= tau;
  while(a < 0) a += tau;
  return a;
}
function per() {
  return 2 * h + 2 * w;
}
/*
  Directions:
    0: down;
    1: left;
    2: up;
    3: right;
*/
function pta(p) {
  if(p < w)            return [p, 0, 0];
  else if(p < w + h)   return [w, p - w, 1];
  else if(p < 2*w + h) return [w - (p - w - h), h, 2];
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
function frgb(str) {
  return str.match(/[0-9]+/g);
}
function move(x, y, dx, dy, a) {
  if(a == undefined) return [x + dx, y + dy];
  else return [x+dx*cos(a), y+dy*sin(a)];
}

var h = window.innerHeight, w = window.innerWidth;
var sp = 0;
var t;
var obj = {
  //Each idea contains a current position, direction, color, and list of corners with position and direction
  'ideas': [],
  'opacity': {'ideas': 1},
  'rain': [],
  'trees': [],
  'background': {'color': rgb(197, 196, 213)}
};
/*
  Other colors
  rgb(156, 238, 93),  //color of leaves outside after it is wet
  rgb(94, 54, 4),     //color of tree trunks
  rgb(96, 111, 213),  //color of rain
*/
var ideacolors = [
  rgb(156, 238, 93),  //color of leaves outside after it is wet
  rgb(94, 54, 4),     //color of tree trunks
  rgb(147, 160, 244),  //color of rain
  rgb(134, 133, 157), //color of cloud

  rgb(36, 0, 255),
  rgb(1, 222, 109),
  rgb(238, 4, 13),

  rgb(242, 141, 44),
  rgb(36, 46, 50),

  rgb(170, 23, 222),
  rgb(221, 85, 85),
  rgb(88, 98, 226)
];

function init() {
  //Create Ideas w*h/138240
  for(var i=0; i<w*h/138240; i++) {
    t = pta(Math.random() * per());
    obj.ideas[i] = {'pos': {'x': t[0], 'y': t[1]}, 'd': t[2], 'c': Math.floor(Math.random()*(ideacolors.length - 0.00001)), 'cn': [{'x': t[0], 'y': t[1], 'd': t[2]}], 'v': -1};
  }
}

function moveIdeas() {
  var d;
  for(var i=0; i<obj.ideas.length; i++) {
    d = obj.ideas[i];
    //move in direction
    if(d.v == -1) {
      if(d.d == 0) obj.ideas[i].pos.y += speed;
      else if(d.d == 1) obj.ideas[i].pos.x -= speed;
      else if(d.d == 2) obj.ideas[i].pos.y -= speed;
      else obj.ideas[i].pos.x += speed;
    }
    //1/60 chance to change direction
    if(Math.random() > 0.98333333) {
      //1/2 chance to go right or left
      if(Math.random() > 0.5) obj.ideas[i].d += 1;
      else obj.ideas[i].d -= 1;
      //Fix direction
      if(d.d < 0) obj.ideas[i].d += 4;
      else if(d.d > 3) obj.ideas[i].d -= 4;
      //Add corner
      obj.ideas[i].cn.push({'x': obj.ideas[i].pos.x, 'y': obj.ideas[i].pos.y, 'd': obj.ideas[i].d});
    }

    //if out of bounds, set to remove and spawn new one
    if(!inbounds(d.pos.x, d.pos.y) && obj.ideas[i].v == -1) {
      obj.ideas[i].v = 0;
      t = pta(Math.random() * per());
      obj.ideas.push({'pos': {'x': t[0], 'y': t[1]}, 'd': t[2], 'c': Math.floor(Math.random()*(ideacolors.length - 0.00001)), 'cn': [{'x': t[0], 'y': t[1], 'd': t[2]}], 'v': -1});
    }
  }
}

function draw() {
  var co;

  //background
  co = obj.background.color;
  r.fillStyle = co;
  r.fillRect(0, 0, w, h);

  //ideas
  var d, skip;
  r.miterLimit = 1;
  for(var i=0; i<obj.ideas.length; i++) {
    d = obj.ideas[i];
    skip = false;
    //Setup line/styles
    if(d.v != -1) {
      obj.ideas[i].v += .02;
      if(obj.ideas[i].v > 1) {
        obj.ideas.splice(i, 1);
        skip = true;
      }
    }
    if(!skip) {
      t = frgb(ideacolors[d.c]);
      if(d.v == -1) r.strokeStyle = rgba(t[0], t[1], t[2], obj.opacity.ideas)
      else r.strokeStyle = rgba(t[0], t[1], t[2], (1 - obj.ideas[i].v) * obj.opacity.ideas);

      r.lineWidth = 10;
      r.beginPath();
      r.moveTo(d.cn[0].x, d.cn[0].y);
      //Create full line
      for(var a=1; a<=d.cn.length; a++) {
        if(a != d.cn.length) r.lineTo(d.cn[a].x, d.cn[a].y);
        else r.lineTo(d.pos.x, d.pos.y);
      }
      //Finish line
      r.stroke();
    }
    r.closePath();
  }

  //Continue loop
  window.requestAnimationFrame(draw);
}
