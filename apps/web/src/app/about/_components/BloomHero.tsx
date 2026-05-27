'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './BloomHero.module.css'

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uPetalCount;
  uniform float uPetalAmplitude;
  uniform float uFuzziness;

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisplacement;
  varying vec3 vWorldPos;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 n = normalize(position);
    float theta = atan(n.x, n.z);
    float petals = sin(theta * uPetalCount + uSeed * 6.28) * 0.5 + 0.5;
    petals = pow(petals, 0.6);
    float band = 1.0 - pow(abs(n.y), 1.4);

    vec3 noiseInput = position * 2.2 + vec3(uSeed * 10.0) + vec3(0.0, uTime * 0.08, 0.0);
    float fuzz = snoise(noiseInput) * uFuzziness;
    float breath = sin(uTime * 0.7 + uSeed * 6.28) * 0.035 + 1.0;

    float displacement = (petals * band * uPetalAmplitude) + fuzz;
    vec3 pos = n * (1.0 + displacement) * breath;

    vDisplacement = displacement;
    vPos = pos;
    vNormal = normalize(normalMatrix * normalize(pos));
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColorTip;
  uniform vec3 uMouseWorld;

  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisplacement;
  varying vec3 vWorldPos;

  void main() {
    float gradT = clamp((vPos.y + 1.0) * 0.5, 0.0, 1.0);
    vec3 baseColor = mix(uColor1, uColor2, gradT);
    baseColor = mix(baseColor, uColorTip, smoothstep(0.04, 0.28, vDisplacement));

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.2);

    vec3 lightDir = normalize(vec3(0.4, 0.8, 0.5));
    float ndotl = max(dot(normalize(vNormal), lightDir), 0.0);
    float diffuse = ndotl * 0.45 + 0.65;

    vec3 fillDir = normalize(vec3(-0.3, -0.5, 0.7));
    float fill = max(dot(normalize(vNormal), fillDir), 0.0) * 0.25;

    float dM = length(vWorldPos - uMouseWorld);
    float mouseGlow = exp(-dM * 0.45) * 0.35;

    vec3 color = baseColor * diffuse + baseColor * fill;
    color += fresnel * mix(uColorTip, vec3(1.0), 0.3) * 0.9;
    color += mouseGlow * mix(uColorTip, vec3(1.0), 0.5);
    color = pow(color, vec3(0.92));

    gl_FragColor = vec4(color, 1.0);
  }
`

const PALETTES = [
  { c1: [0xff, 0x9a, 0xc4], c2: [0xb6, 0x9e, 0xff], tip: [0xff, 0xe2, 0xee] },
  { c1: [0xa0, 0xbf, 0xff], c2: [0xd4, 0xb0, 0xff], tip: [0xea, 0xf2, 0xff] },
  { c1: [0xb0, 0xe8, 0xc8], c2: [0xff, 0xe0, 0xa0], tip: [0xff, 0xfa, 0xe5] },
  { c1: [0xff, 0xc0, 0xa0], c2: [0xff, 0x90, 0xb8], tip: [0xff, 0xee, 0xd5] },
  { c1: [0xc8, 0xff, 0xe5], c2: [0xa0, 0xc8, 0xff], tip: [0xff, 0xff, 0xff] },
  { c1: [0xff, 0xb0, 0xd5], c2: [0x90, 0x80, 0xff], tip: [0xff, 0xe5, 0xff] },
  { c1: [0xf5, 0xc8, 0xff], c2: [0xff, 0xa0, 0xc4], tip: [0xff, 0xfa, 0xff] },
] as const

function toColor(arr: readonly number[]) {
  return new THREE.Color((arr[0] ?? 0) / 255, (arr[1] ?? 0) / 255, (arr[2] ?? 0) / 255)
}

export function BloomHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    let rafId = 0
    let isVisible = true
    let renderer: THREE.WebGLRenderer | null = null
    const flowers: THREE.Mesh[] = []
    let baseGeometry: THREE.IcosahedronGeometry | null = null

    const mouseMoveHandler = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const touchMoveHandler = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) onMove(t.clientX, t.clientY)
    }
    const resizeHandler = () => onResize()

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    const mouseNdc = new THREE.Vector2()
    const mouseNdcTarget = new THREE.Vector2()
    const mouseWorld = new THREE.Vector3()
    const raycaster = new THREE.Raycaster()
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const tmp = new THREE.Vector3()

    function onMove(clientX: number, clientY: number) {
      mouseNdcTarget.x = (clientX / window.innerWidth) * 2 - 1
      mouseNdcTarget.y = -(clientY / window.innerHeight) * 2 + 1
    }

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    const clock = new THREE.Clock()

    function onResize() {
      if (!renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    try {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 13)

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
      renderer.setClearColor(0x000000, 0)

      const GEO_DETAIL = isMobile ? 3 : 5
      baseGeometry = new THREE.IcosahedronGeometry(1, GEO_DETAIL)

      const FLOWER_COUNT = isMobile ? 18 : 36
      for (let i = 0; i < FLOWER_COUNT; i++) {
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)] ?? PALETTES[0]
        const angle = Math.random() * Math.PI * 2
        const radius = Math.pow(Math.random(), 0.6) * 7.5
        const x = Math.cos(angle) * radius * 1.4
        const y = Math.sin(angle) * radius * 0.9
        const z = -3 + (Math.random() - 0.5) * 6
        const scale = 0.55 + Math.random() * 1.5

        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms: {
            uTime:           { value: 0 },
            uSeed:           { value: Math.random() },
            uPetalCount:     { value: 6 + Math.floor(Math.random() * 6) },
            uPetalAmplitude: { value: 0.22 + Math.random() * 0.28 },
            uFuzziness:      { value: 0.04 + Math.random() * 0.08 },
            uColor1:         { value: toColor(palette.c1) },
            uColor2:         { value: toColor(palette.c2) },
            uColorTip:       { value: toColor(palette.tip) },
            uMouseWorld:     { value: new THREE.Vector3() },
          },
        })

        const mesh = new THREE.Mesh(baseGeometry, material)
        const pos = new THREE.Vector3(x, y, z)
        mesh.position.copy(pos)
        mesh.scale.setScalar(scale)
        mesh.userData = {
          basePos: pos.clone(),
          baseScale: scale,
          floatSpeed: 0.25 + Math.random() * 0.5,
          floatPhase: Math.random() * Math.PI * 2,
          floatAmpX: 0.15 + Math.random() * 0.25,
          floatAmpY: 0.2 + Math.random() * 0.3,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.0035,
            (Math.random() - 0.5) * 0.0035,
            (Math.random() - 0.5) * 0.0035,
          ),
          pushOffset: new THREE.Vector3(),
          currentScale: scale,
        }
        scene.add(mesh)
        flowers.push(mesh)
      }

      window.addEventListener('mousemove', mouseMoveHandler)
      window.addEventListener('touchmove', touchMoveHandler, { passive: true })
      window.addEventListener('resize', resizeHandler)

      function animate() {
        rafId = requestAnimationFrame(animate)
        if (!isVisible) return

        const t = clock.getElapsedTime()
        mouseNdc.lerp(mouseNdcTarget, 0.08)
        raycaster.setFromCamera(mouseNdc, camera)
        raycaster.ray.intersectPlane(interactionPlane, mouseWorld)

        for (let i = 0; i < flowers.length; i++) {
          const f = flowers[i]
          if (!f) continue
          const d = f.userData as {
            basePos: THREE.Vector3; baseScale: number; floatSpeed: number;
            floatPhase: number; floatAmpX: number; floatAmpY: number;
            rotSpeed: THREE.Vector3; pushOffset: THREE.Vector3; currentScale: number;
          }

          const fx = Math.cos(t * d.floatSpeed * 0.7 + d.floatPhase) * d.floatAmpX
          const fy = Math.sin(t * d.floatSpeed + d.floatPhase) * d.floatAmpY

          const dx = d.basePos.x - mouseWorld.x
          const dy = d.basePos.y - mouseWorld.y
          const dz = d.basePos.z - mouseWorld.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          const falloff = Math.exp(-dist * 0.35)
          const force = falloff * 2.2

          tmp.set(
            (dx / (dist + 0.001)) * force,
            (dy / (dist + 0.001)) * force,
            (dz / (dist + 0.001)) * force * 0.3,
          )
          d.pushOffset.lerp(tmp, 0.12)

          f.position.x = d.basePos.x + fx + d.pushOffset.x
          f.position.y = d.basePos.y + fy + d.pushOffset.y
          f.position.z = d.basePos.z + d.pushOffset.z

          f.rotation.x += d.rotSpeed.x
          f.rotation.y += d.rotSpeed.y
          f.rotation.z += d.rotSpeed.z

          const scaleTarget = d.baseScale * (1 + falloff * 0.15)
          d.currentScale += (scaleTarget - d.currentScale) * 0.1
          f.scale.setScalar(d.currentScale)

          const mat = f.material as THREE.ShaderMaterial
          if (mat.uniforms.uTime) mat.uniforms.uTime.value = t
          if (mat.uniforms.uMouseWorld) (mat.uniforms.uMouseWorld.value as THREE.Vector3).copy(mouseWorld)
        }

        camera.position.x += (mouseNdc.x * 0.6 - camera.position.x) * 0.04
        camera.position.y += (mouseNdc.y * 0.4 - camera.position.y) * 0.04
        camera.lookAt(0, 0, 0)

        renderer!.render(scene, camera)
      }

      animate()

      setTimeout(() => setLoaded(true), 200)
    } catch (err) {
      console.error('[BloomHero]', err)
      setLoaded(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry?.isIntersecting ?? false },
      { threshold: 0 },
    )
    observer.observe(section)

    return () => {
      isVisible = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('mousemove', mouseMoveHandler)
      window.removeEventListener('touchmove', touchMoveHandler)
      window.removeEventListener('resize', resizeHandler)
      renderer?.dispose()
      baseGeometry?.dispose()
      flowers.forEach(f => (f.material as THREE.ShaderMaterial).dispose())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${loaded ? styles.loaded : ''}`}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      <div className={styles.inner}>
        <div className={styles.brandWrap}>
          <h2 className={styles.brandLetters} aria-label="DBC">
            {['D', 'B', 'C'].map((l) => (
              <span key={l} className={styles.letterWrap}>
                <span className={styles.letter}>{l}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className={styles.heroRight}>
          <p className={styles.tagline}>
            <em>Enter the living garden.</em>
          </p>
          <p className={styles.description}>
            <strong>DBC</strong>는 UI/UX 기획자들이 모여 만든 팀입니다.
            작업을 기록하고, 경험을 나누며,
            더 나은 사용자 경험을 함께 만들어갑니다.
          </p>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.liveDot} />
        <span>Scroll · 아래로 스크롤하세요</span>
      </div>
    </section>
  )
}
