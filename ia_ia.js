/*
   view のサイズの初期化
*/

const TAU = Math.PI * 2;

const viewWidth = view.offsetWidth;
const viewHeight = view.offsetHeight;
const viewAspectRatio = viewWidth / viewHeight;

view.setAttribute("width", viewWidth);
view.setAttribute("height", viewHeight);

/*
   renderer, scene, camera を作る
*/

var renderer = new THREE.WebGLRenderer({canvas: view})
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, viewAspectRatio, 1, 100);
camera.position.set(0, 40, -80);
camera.lookAt(new THREE.Vector3(0, 5, 0));

/*
   arm を作る
*/

var armGeometry = new THREE.CylinderGeometry(1, 3, 40, 3, 4, true);

armGeometry.bones = [
  {
    name: "bone0",
    parent: -1,
    pos: [0, -20, 0],
    rotq: [0, 0, 0, 1],
    scl: [1, 1, 1],
  },
  {
    name: "bone1",
    parent: 0,
    pos: [0, 10, 0],
    rotq: [0, 0, 0, 1],
    scl: [1, 1, 1],
  },
  {
    name: "bone2",
    parent: 1,
    pos: [0, 10, 0],
    rotq: [0, 0, 0, 1],
    scl: [1, 1, 1],
  },
  {
    name: "bone3",
    parent: 2,
    pos: [0, 10, 0],
    rotq: [0, 0, 0, 1],
    scl: [1, 1, 1],
  },
  {
    name: "bone4",
    parent: 3,
    pos: [0, 10, 0],
    rotq: [0, 0, 0, 1],
    scl: [1, 1, 1],
  },
];

armGeometry.skinIndices = [
  new THREE.Vector4(4, 3, -1, -1), new THREE.Vector4(4, 3, -1, -1), new THREE.Vector4(4, 3, -1, -1),
  new THREE.Vector4(3, 4,  2, -1), new THREE.Vector4(3, 4,  2, -1), new THREE.Vector4(3, 4,  2, -1),
  new THREE.Vector4(2, 3,  1, -1), new THREE.Vector4(2, 3,  1, -1), new THREE.Vector4(2, 3,  1, -1),
  new THREE.Vector4(1, 2,  0, -1), new THREE.Vector4(1, 2,  0, -1), new THREE.Vector4(1, 2,  0, -1),
  new THREE.Vector4(0, 1, -1, -1), new THREE.Vector4(0, 1, -1, -1), new THREE.Vector4(0, 1, -1, -1),
];

armGeometry.skinWeights = [
  new THREE.Vector4(.8, .2,  0, 0), new THREE.Vector4(.8, .2,  0, 0), new THREE.Vector4(.8, .2,  0, 0),
  new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0),
  new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0),
  new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0), new THREE.Vector4(.6, .2, .2, 0),
  new THREE.Vector4(.8, .2,  0, 0), new THREE.Vector4(.8, .2,  0, 0), new THREE.Vector4(.8, .2,  0, 0),
];

var armMaterial = new THREE.MeshNormalMaterial({
  skinning: true, // これをつけないと、bone での変形が効かない
  side: THREE.DoubleSide,
  shading: THREE.FlatShading,
});

var ctlh = new THREE.Object3D();

var armWrapper, arm;
var arms = [];

for(var i=0; i<64; i++) {
  armWrapper = new THREE.Object3D();
  arm = new THREE.SkinnedMesh(armGeometry, armMaterial);
  arm.userData.boneRotationSpeeds = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(Math.random() * .002, Math.random() * .002, Math.random() * .002),
    new THREE.Vector3(Math.random() * .002, Math.random() * .002, Math.random() * .002),
    new THREE.Vector3(Math.random() * .002, Math.random() * .002, Math.random() * .002),
    new THREE.Vector3(0, 0, 0),
  ];
  arm.position.y = 23;
  armWrapper.rotation.set(
    Math.random() * TAU,
    Math.random() * TAU,
    Math.random() * TAU
  );
  arms.push(arm);
  armWrapper.add(arm);
  ctlh.add(armWrapper);
}

scene.add(ctlh);

/*
   毎フレーム呼び出す処理
*/

var lastTime = 0; // 前回の時間

function step(time) {
  var elapsedTime = time - lastTime; // 前回のstepからの経過時間

  ctlh.rotation.y += elapsedTime * .0002; // 見やすいようにモデルを少しずつ回す

  var arm, bone, speed;
  for(var i=0; i<arms.length; i++) {
    arm = arms[i];
    for(var j=0; j<arm.skeleton.bones.length; j++) {
      bone = arm.skeleton.bones[j];
      speed = arm.userData.boneRotationSpeeds[j];
      bone.rotation.x = Math.sin(time * speed.x) * .5;
      bone.rotation.y = Math.sin(time * speed.y);
      bone.rotation.z = Math.sin(time * speed.z) * .5;
    }
  }

  renderer.render(scene, camera);

  lastTime = time;

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
