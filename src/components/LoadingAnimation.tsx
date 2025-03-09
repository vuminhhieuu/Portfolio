import React, { useEffect, useRef } from "react";
import * as THREE from "three";
export function LoadingAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0f172a); // slate-900
    mountRef.current.appendChild(renderer.domElement);
    // Create animated cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      // blue-600
      shininess: 100,
      opacity: 0.9,
      transparent: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    camera.position.z = 5;
    // Animation
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      return requestAnimationFrame(animate);
    };
    const animationId = animate();
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  return <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="relative z-10 text-white text-center">
        <h1 className="text-4xl font-bold mb-4 animate-pulse">Loading</h1>
      </div>
    </div>;
}