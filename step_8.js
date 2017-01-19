/*
   view のサイズの初期化
*/

var viewWidth = view.offsetWidth;
var viewHeight = view.offsetHeight;
var viewAspectRatio = viewWidth / viewHeight;

view.setAttribute("width", viewWidth);
view.setAttribute("height", viewHeight);

/*
   renderer, scene, camera を作る
*/

var renderer = new THREE.WebGLRenderer({canvas: view})
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, viewAspectRatio, 1, 100);
camera.position.set(0, 20, -40);
camera.lookAt(new THREE.Vector3(0, 5, 0));

/*
   arm を作る
*/

var armGeometry = new THREE.CylinderGeometry(5, 5, 40, 3, 4, true);

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

var arm = new THREE.SkinnedMesh(armGeometry, armMaterial);

/*
   arm のアニメーション関連のオブジェクトを作成
*/

var waveClip = THREE.AnimationClip.parseAnimation({
  hierarchy: [
    {},
    {},
    {
      keys: [
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(- Math.PI / 4, 0, 0)),
          scl: [1, 1, 1],
          time: 0,
        },
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 4, 0, 0)),
          scl: [1, 1, 1],
          time: 1000,
        },
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(- Math.PI / 4, 0, 0)),
          scl: [1, 1, 1],
          time: 2000,
        },
      ],
    },
    {},
    {},
  ]
}, armGeometry.bones);

var twistClip = THREE.AnimationClip.parseAnimation({
  hierarchy: [
    {},
    {},
    {
      keys: [
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, - Math.PI / 3, 0)),
          scl: [1, 1, 1],
          time: 0,
        },
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 3, 0)),
          scl: [1, 1, 1],
          time: 1000,
        },
        {
          pos: [0, 10, 0],
          rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, - Math.PI / 3, 0)),
          scl: [1, 1, 1],
          time: 2000,
        },
      ],
    },
    {},
    {},
  ]
}, armGeometry.bones);

var armMixer = new THREE.AnimationMixer(arm);
var waveAction = armMixer.clipAction(waveClip);
var twistAction = armMixer.clipAction(twistClip);

var actionSwitchFlag = false; // アクションを切り替えるためのフラグ

waveAction.play();

window.addEventListener("click", function() {
  /* 
     フラグを見て、アニメーションをクロスフェードで切り替える
  */
  if(actionSwitchFlag) {
    waveAction.crossFadeFrom(twistAction, 1000);
    waveAction.play();
    waveAction.enabled = true;
  } else {
    twistAction.crossFadeFrom(waveAction, 1000);
    twistAction.play();
    twistAction.enabled = true;
  }
  actionSwitchFlag = !actionSwitchFlag;
})

/*
   ボーンの確認用のヘルパーを作る
*/

var skeletonHelper = new THREE.SkeletonHelper(arm);

/*
   シーンにオブジェクトを追加
*/

scene.add(arm);
scene.add(skeletonHelper);

/*
   毎フレーム呼び出す処理
*/

var lastTime = 0; // 前回の時間

function step(time) {
  var elapsedTime = time - lastTime; // 前回のstepからの経過時間

  arm.rotation.y += elapsedTime * .0002; // 見やすいようにモデルを少しずつ回す

  armMixer.update(elapsedTime);
  skeletonHelper.update();

  renderer.render(scene, camera);

  lastTime = time;

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
