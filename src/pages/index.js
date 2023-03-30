import React, { useEffect, useState } from "react";
import GlobalStyle from "../style";
import styled from "styled-components";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const IndexPage = () => {
  const scene = new THREE.Scene();

  useEffect(() => {
    const canvas = document.querySelector("canvas.webgl");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const move = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(move);
    };

    move();
  }, []);

  const material = new THREE.MeshPhysicalMaterial();
  material.color = new THREE.Color(0xA8A9AD);
  material.metalness = 0.45;
  material.roughness = 0.65;
  material.reflectivity = 1;
  material.clearcoat = 1;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    material
  );
  sphere.position.x = 0;

  const smallSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    material
  );

  smallSphere.position.x = 0.5;
  smallSphere.position.y = 0.5;
  smallSphere.position.z = -0.75;

  scene.add(sphere, smallSphere);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 2;
  scene.add(pointLight);

  const gui = new dat.GUI();
  gui.add(material, "metalness").min(0).max(1).step(0.0001);
  gui.add(material, "roughness").min(0).max(1).step(0.0001);
  gui.add(material, "reflectivity").min(0).max(1).step(0.0001);
  gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
  return (
    <>
      <GlobalStyle />
      <Container>
        <canvas className="webgl"></canvas>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
`;

export default IndexPage;

export const Head = () => <title>Home Page</title>;
