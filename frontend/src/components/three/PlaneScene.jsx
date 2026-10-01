import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function buildAirplane() {
  const group = new THREE.Group()

  const white = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.65,
  })
  const accent = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, metalness: 0.4 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.7 })

  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 7.4, 28), white)
  fuselage.rotation.x = Math.PI / 2
  group.add(fuselage)

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.7, 28), white)
  nose.rotation.x = Math.PI / 2
  nose.position.z = 4.45
  group.add(nose)

  const noseTip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 20), dark)
  noseTip.rotation.x = Math.PI / 2
  noseTip.position.z = 5.35
  group.add(noseTip)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 28), white)
  tail.rotation.x = -Math.PI / 2
  tail.position.z = -4.4
  group.add(tail)

  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.8), dark)
  cockpit.position.set(0, 0.42, 3.85)
  group.add(cockpit)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.12, 1.7), white)
  wing.position.set(0, -0.12, 0.7)
  wing.rotation.x = Math.PI * 0.012
  group.add(wing)

  const wingFairing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.9), accent)
  wingFairing.position.set(0, -0.05, 0.7)
  group.add(wingFairing)

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 1.0), white)
  hStab.position.set(0, -0.06, -2.7)
  group.add(hStab)

  const vStab = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 1.2), accent)
  vStab.position.set(0, 0.95, -2.5)
  group.add(vStab)

  const engineGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.95, 20)
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5, metalness: 0.8 })
  ;[-1.65, 1.65].forEach((x) => {
    const engine = new THREE.Mesh(engineGeo, engineMat)
    engine.rotation.x = Math.PI / 2
    engine.position.set(x, -0.72, 0.9)
    group.add(engine)

    const intake = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.14, 20), dark)
    intake.rotation.x = Math.PI / 2
    intake.position.set(x, -0.72, 1.42)
    group.add(intake)
  })

  const paneColors = [0x38bdf8, 0x38bdf8, 0x38bdf8, 0x38bdf8]
  paneColors.forEach((color, i) => {
    const win = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      new THREE.MeshBasicMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.6,
      }),
    )
    win.position.set(0.56, 0.28, 1.5 + i * 0.9)
    group.add(win)
    const win2 = win.clone()
    win2.position.x = -0.56
    group.add(win2)
  })

  return group
}

function buildClouds() {
  const clouds = new THREE.Group()
  const mat = new THREE.MeshBasicMaterial({
    color: 0xfef3c7,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  })
  const rng = (min, max) => min + Math.random() * (max - min)

  for (let i = 0; i < 14; i++) {
    const puff = new THREE.Group()
    const puffs = 3 + Math.floor(Math.random() * 3)
    for (let j = 0; j < puffs; j++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), mat)
      s.scale.set(rng(2.2, 4.2), rng(0.6, 1.1), rng(1.6, 2.8))
      s.position.set(rng(-2, 2), rng(-0.4, 0.5), rng(-1, 1))
      puff.add(s)
    }
    const radius = rng(26, 62)
    const angle = rng(0, Math.PI * 2)
    puff.position.set(Math.cos(angle) * radius, rng(2.5, 10), Math.sin(angle) * radius)
    puff.userData.speed = rng(0.3, 1.1)
    clouds.add(puff)
  }
  return clouds
}

function buildStars() {
  const count = 320
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 0.85)
    const r = 500 + Math.random() * 300
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi)
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({ color: 0xfef9c3, size: 0.8, transparent: true, opacity: 0.85 })
  return new THREE.Points(geo, mat)
}

export default function PlaneScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x4c1d95, 0.0045)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000)
    camera.position.set(0, 6.5, 21)
    camera.lookAt(0, 0.4, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0x0b1026)

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth
      const h = mount.clientHeight || window.innerHeight
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    mount.appendChild(renderer.domElement)

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(900, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color(0x0b1026) },
          midColor: { value: new THREE.Color(0x7c3aed) },
          bottomColor: { value: new THREE.Color(0xf97316) },
          offset: { value: 18 },
          exponent: { value: 0.55 },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
            h = max(h, 0.0);
            float tLow = pow(h, exponent);
            float tMid = smoothstep(0.0, 0.55, h);
            vec3 col = mix(bottomColor, midColor, step(0.05, h) * tMid);
            col = mix(col, topColor, smoothstep(0.35, 0.85, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    )
    sky.frustumCulled = false
    scene.add(sky)

    scene.add(buildStars())

    const clouds = buildClouds()
    scene.add(clouds)

    const hemi = new THREE.HemisphereLight(0xffd9b0, 0x1e1b4b, 0.9)
    scene.add(hemi)

    const sun = new THREE.DirectionalLight(0xffb84d, 1.6)
    sun.position.set(18, 5, -14)
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0x7c3aed, 0.7)
    fill.position.set(-14, 10, 10)
    scene.add(fill)

    const orbit = new THREE.Group()
    orbit.add(buildAirplane())
    orbit.position.y = 3.4
    scene.add(orbit)

    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      const t = clock.getElapsedTime()
      const dt = Math.min(clock.getDelta() || 0.016, 0.05)

      orbit.rotation.y += dt * 0.09
      const plane = orbit.children[0]
      plane.position.y = Math.sin(t * 0.5) * 0.45
      plane.rotation.z = Math.sin(t * 0.3) * 0.07
      plane.rotation.x = Math.sin(t * 0.22) * 0.03

      clouds.children.forEach((puff) => {
        puff.position.x = ((puff.position.x + puff.userData.speed * dt + 80) % 160) - 80
      })

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 overflow-hidden" aria-hidden="true" />
}