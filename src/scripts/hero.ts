import * as THREE from 'three';

const isMobile = matchMedia('(max-width: 768px)').matches;
const COUNT = isMobile ? 90 : 220;
const RANGE = 14;          // half-extent of node box
const LINK_DIST = 3.2;     // max distance to draw an edge
const MOUSE_R = 4;         // mouse influence radius

export function initHero(canvas: HTMLCanvasElement): void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 18;

  // nodes
  const pos = new Float32Array(COUNT * 3);
  const vel = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 2 * RANGE;
    vel[i] = (Math.random() - 0.5) * 0.02;
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.12, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(nodes);

  // edges (rebuilt each frame, capped)
  const MAX_EDGES = COUNT * 6;
  const edgePos = new Float32Array(MAX_EDGES * 6);
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  const edges = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(edges);

  // mouse in world space (z=0 plane)
  const mouse = new THREE.Vector3(999, 999, 0);
  const ndc = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  canvas.parentElement!.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(plane, mouse);
  });
  canvas.parentElement!.addEventListener('pointerleave', () => mouse.set(999, 999, 0));

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const v = new THREE.Vector3();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    // drift + bounce + mouse repel
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      v.set(pos[j] - mouse.x, pos[j + 1] - mouse.y, 0);
      const d = v.length();
      if (d < MOUSE_R) {
        v.normalize().multiplyScalar((MOUSE_R - d) * 0.004);
        vel[j] += v.x; vel[j + 1] += v.y;
      }
      for (let a = 0; a < 3; a++) {
        pos[j + a] += vel[j + a];
        if (Math.abs(pos[j + a]) > RANGE) vel[j + a] *= -1;
        vel[j + a] *= 0.999; // damp
      }
    }
    nodeGeo.attributes.position.needsUpdate = true;

    // rebuild edges
    let e = 0;
    for (let a = 0; a < COUNT && e < MAX_EDGES; a++) {
      for (let b = a + 1; b < COUNT && e < MAX_EDGES; b++) {
        const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
          edgePos.set([pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], e * 6);
          e++;
        }
      }
    }
    edgeGeo.setDrawRange(0, e * 2);
    edgeGeo.attributes.position.needsUpdate = true;

    scene.rotation.y += 0.0004;
    renderer.render(scene, camera);
  });
}
