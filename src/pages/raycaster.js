import * as THREE from 'three'

var camera, scene, renderer, sphereGeometry, planeGeometry, sphereMaterial, planeMaterial, sphereMesh, planeMesh;

var theta = 0,
  numCollisions = 0;

init();
render();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 1000;
  camera.position.x = 200;
  camera.position.y = 50;
  camera.lookAt(scene.position);
  scene.add(camera);

  var pointLight = new THREE.DirectionalLight(0xbbbbbb);
  pointLight.position.set(100, 100, 500);
  scene.add(pointLight);

  var ambientLight = new THREE.AmbientLight(0xbbbbbb);
  scene.add(ambientLight);

  sphereGeometry = new THREE.SphereGeometry(200, 64, 64);
  sphereMaterial = new THREE.MeshPhongMaterial({
    color: 'darkgreen',
    opacity: 0.5,
    transparent: true
  });

  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  planeGeometry = new THREE.BoxGeometry(150, 150, 20);
  planeGeometry.dynamic = true;

  planeMaterial = new THREE.MeshPhongMaterial({
    color: 'blue'
  });

  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.position.z = 200;
  planeMesh.position.y = 0;
  planeMesh.name = "plane";

  scene.add(planeMesh);

  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function render() {

  renderer.render(scene, camera);
  theta += 0.01;
  camera.position.x = 1000 * Math.cos(theta);
  camera.position.y = 10;
  camera.position.z = 1000 * Math.sin(theta);

  camera.lookAt(scene.position);

  requestAnimationFrame(render);
}

function wrapMesh() {

    console.log('wrapped');
  for (var vertexIndex = 0; vertexIndex < planeMesh.geometry.vertices.length; vertexIndex++) {

    var localVertex = planeMesh.geometry.vertices[vertexIndex].clone();
    localVertex.z = 220;
    var directionVector = new THREE.Vector3();
    directionVector.subVectors(sphereMesh.position, localVertex);
    directionVector.normalize();

    var ray = new THREE.Raycaster(localVertex, directionVector);

    var collisionResults = ray.intersectObject(sphereMesh);
    console.log(collisionResults)
    numCollisions += collisionResults.length;

    if (collisionResults.length > 0) {

      planeMesh.geometry.vertices[vertexIndex].z = collisionResults[0].point.z + 5;
    }
  }

  planeMesh.geometry.verticesNeedUpdate = true;
  planeMesh.geometry.normalsNeedUpdate = true;
  scene.remove(scene.getObjectByName("plane"));
  scene.add(planeMesh);
}

document.addEventListener('keydown', function(e) {
  var key = e.keyCode;

  switch (key) {
    case 37:

      theta += 0.1;
      break;

    case 39:

      theta -= 0.1;
      break;
    case 81: //key q
      console.log('q');
      wrapMesh();
      break;

  }
}, false);