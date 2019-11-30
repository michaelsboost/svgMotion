var tl = new TimelineMax({})
.set(".swing", {
  y: -240
}, 0)
.to(".swing", 1.5, {
  y: 0,
  rotation: 0,
  ease: Bounce.easeOut
}, 0)
.to(".swing", 1.2, {
  rotation: 16
}, 0)
.to(".swing", 1.2, {
  repeat: -1,
  yoyo: true,
  rotation: -3,
  ease: Power0.easeInOut
}, 0)
.to(".wave1", 5, {
  repeat: -1,
  yoyo: false,
  x: 900,
  ease: "none"
}, 0)
.set(".wave2", {
  repeat: -1,
  yoyo: false,
  x: -410,
  ease: "none"
}, 0)
.to(".wave2", 5, {
  repeat: -1,
  yoyo: false,
  x: -820,
  ease: "none"
}, 0)
.set(".lines line", {
  y: -900
}, 0)
.to(".lines line:nth-child(1)", 1, {
  repeat: -1,
  yoyo: false,
  y: 900,
  ease: "none"
}, 0)
.to(".lines line:nth-child(2)", 0.5, {
  repeat: -1,
  yoyo: false,
  y: 1300,
  ease: "none"
}, 0)
.to(".lines line:nth-child(3)", 0.75, {
  repeat: -1,
  yoyo: false,
  y: 1500,
  ease: "none"
}, 0)
.to(".lines line:nth-child(4)", 0.5, {
  repeat: -1,
  yoyo: false,
  y: 800,
  ease: "none"
}, 0)
.to(".lines line:nth-child(5)", 0.75, {
  repeat: -1,
  yoyo: false,
  y: 1700,
  ease: "none"
}, 0)
.to(".lines line:nth-child(6)", 1, {
  repeat: -1,
  yoyo: false,
  y: 850,
  ease: "none"
}, 0)
.set(".fire", {
  y: -10,
  scaleY: 1.6,
  ease: "none"
}, 0)
.to(".fire", 0.5, {
  repeat: -1,
  yoyo: true,
  scaleY: 1,
  transformOrigin: "100% 0"
}, 0)
.set(".bg", {
  fill: "#fff",
  ease: "none"
}, 0)
.to(".bg", 2, {
  repeat: 0,
  yoyo: false,
  fill: "#871bd0"
}, 0)
.set(".waves", {
  bottom: "0"
})

var fps = 30
var duration = tl.duration()
var frames = Math.ceil(duration / 1 * fps)
tl.play(0).timeScale(1)