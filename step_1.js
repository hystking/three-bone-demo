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
camera.position.set(0, 20, -40);
camera.lookAt(new THREE.Vector3(0, 5, 0));

/*
   arm を作る
*/

var armGeometry = new THREE.CylinderGeometry(5, 5, 40, 3, 4, true);

var armMaterial = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  shading: THREE.FlatShading,
});

var arm = new THREE.Mesh(armGeometry, armMaterial);

/*
   シーンにオブジェクトを追加
*/

scene.add(arm);

/*
   毎フレーム呼び出す処理
*/

var lastTime = 0; // 前回の時間

function step(time) {
  var elapsedTime = time - lastTime; // 前回のstepからの経過時間

  arm.rotation.y += elapsedTime * .0002; // 見やすいようにモデルを少しずつ回す

  renderer.render(scene, camera);

  lastTime = time;

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
