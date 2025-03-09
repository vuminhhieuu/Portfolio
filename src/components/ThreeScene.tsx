import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    // Workspace objects
    const workspace = new THREE.Group();
    // Laptop
    const laptopGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const laptopMaterial = new THREE.MeshPhongMaterial({
      color: 0x303030
    });
    const laptop = new THREE.Mesh(laptopGeometry, laptopMaterial);
    const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x404040
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 1;
    screen.position.z = -1;
    screen.rotation.x = -0.3;
    workspace.add(laptop);
    workspace.add(screen);
    // Coffee cup
    const cupGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.5, 32);
    const cupMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.x = 2;
    cup.position.y = 0.25;
    workspace.add(cup);
    // Add floating animation
    workspace.position.y = 0.5;
    scene.add(workspace);
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    camera.position.z = 8;
    camera.position.y = 2;
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      workspace.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.1;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
}