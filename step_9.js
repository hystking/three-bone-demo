/*
   view のサイズの初期化
*/

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
camera.position.set(0, 3, -5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var armMaterial = new THREE.MeshNormalMaterial({
  skinning: true, // これをつけないと、bone での変形が効かない
});

/*
  JSONLoader でファイルの読み込み
*/

var loader = new THREE.JSONLoader();
var man;
var mixer;

loader.load("man.json", function (geometry) {
    man = new THREE.SkinnedMesh(geometry, armMaterial);
    mixer = new THREE.AnimationMixer(man);
    var action = mixer.clipAction(geometry.animations[0]);
    action.play();
    scene.add(man);
  }
);

/*
   毎フレーム呼び出す処理
*/

var lastTime = 0; // 前回の時間

function step(time) {
  var elapsedTime = time - lastTime; // 前回のstepからの経過時間

  if(man) {
    man.rotation.y += elapsedTime * .0002; // 見やすいようにモデルを少しずつ回す
  }

  if(mixer) {
    mixer.update(elapsedTime * .001);
  }


  renderer.render(scene, camera);

  lastTime = time;

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
