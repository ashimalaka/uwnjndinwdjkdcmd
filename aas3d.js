(function () {
  if (!window.THREE) {
    document.body.innerHTML = '<p style="padding:24px;font:15px sans-serif;color:white;">Three.js tidak dapat dimuat (perlu internet ke cdn.jsdelivr.net).</p>';
    return;
  }

  const T = THREE;
  const C = {
    runs: [
      { type: 'Blanko', name: 'Blanko', conc: 0.0, A: [0.002, 0.003, 0.004] },
      { type: 'Standar', name: 'Std 1', conc: 1.0, A: [0.060, 0.065, 0.058] },
      { type: 'Standar', name: 'Std 2', conc: 2.0, A: [0.118, 0.122, 0.119] },
      { type: 'Standar', name: 'Std 3', conc: 3.0, A: [0.180, 0.186, 0.177] }
    ],
    parts: [
      { id: 1, outer: 'Casing / Rumah Instrumen', fn: 'Melindungi komponen optik dan mekanik AAS', inner: ['Tutup atas', 'Pintu atomisasi', 'Panel depan'] },
      { id: 2, outer: 'Lampu HCL', fn: 'Memancarkan cahaya spesifik unsur target', inner: ['Katoda Cu', 'Anoda', 'Kaca kuarsa'] },
      { id: 3, outer: 'Sample Tray', fn: 'Tempat larutan blanko, standar serta sampel', inner: ['Vial blanko', 'Vial standar', 'Vial sampel'] },
      { id: 4, outer: 'Nebulizer', fn: 'Mengubah larutan menjadi aerosol halus', inner: ['Kapiler hisap', 'Nosel venturi'] },
      { id: 5, outer: 'Spray Chamber', fn: 'Menyaring droplet besar sebelum nyala', inner: ['Flow spoiler', 'Saluran drain'] },
      { id: 6, outer: 'Burner Head', fn: 'Tempat nyala pembakar AAS', inner: ['Slot burner', 'Leher burner'] },
      { id: 7, outer: 'Gas Supply', fn: 'Udara dan asetilena untuk nyala pembakar', inner: ['Selang udara', 'Selang asetilena'] },
      { id: 8, outer: 'Flame', fn: 'Mengatomisasi unsur Cu', inner: ['Zona primer', 'Zona interkonal'] },
      { id: 9, outer: 'Monokromator', fn: 'Memilih panjang gelombang yang relevan', inner: ['Celah masuk', 'Kisi difraksi'] },
      { id: 10, outer: 'Detector PMT', fn: 'Menerima sinyal pada panjang gelombang tertentu', inner: ['Fotokatoda', 'Dinoda', 'Anoda'] },
      { id: 11, outer: 'Elektronik', fn: 'Menguatkan dan menganalisa sinyal', inner: ['Amplifier', 'ADC'] },
      { id: 12, outer: 'Monitor', fn: 'Menampilkan absorbansi dan hasil', inner: ['Layar', 'Grafik'] },
      { id: 13, outer: 'Exhaust Hood', fn: 'Membuang gas dan uap buangan', inner: ['Duct', 'Kipas'] },
      { id: 14, outer: 'Botol Limbah', fn: 'Menampung cairan sisa', inner: ['Limbah cair'] }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const V = (x, y, z) => new T.Vector3(x, y, z);

  const box = $('v');
  const scene = new T.Scene();
  scene.background = new T.Color(0xe9edf2);

  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  box.prepend(renderer.domElement);

  const camera = new T.PerspectiveCamera(30, 1, 0.1, 200);
  let theta = 0.9, phi = 1.18, rad = 22;
  const target = V(0, 2.2, 0);

  const setCam = () => {
    camera.position.set(
      target.x + rad * Math.sin(phi) * Math.sin(theta),
      target.y + rad * Math.cos(phi),
      target.z + rad * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(target);
  };

  const fit = () => {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', fit);

  const hemi = new T.HemisphereLight(0xffffff, 0x6b7d8d, 0.9);
  scene.add(hemi);

  const dir = new T.DirectionalLight(0xffffff, 1.0);
  dir.position.set(10, 18, 8);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);

  const accent = new T.PointLight(0x8ec6ff, 1.4, 40, 2);
  accent.position.set(0, 4, 4);
  scene.add(accent);

  const root = new T.Group();
  scene.add(root);

  const mat = {
    body: new T.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.82, metalness: 0.14 }),
    body2: new T.MeshStandardMaterial({ color: 0x2d2f33, roughness: 0.82, metalness: 0.12 }),
    body3: new T.MeshStandardMaterial({ color: 0x3d3b38, roughness: 0.86, metalness: 0.14 }),
    silver: new T.MeshStandardMaterial({ color: 0xdfe5ea, roughness: 0.5, metalness: 0.75 }),
    slate: new T.MeshStandardMaterial({ color: 0x7d8a95, roughness: 0.7, metalness: 0.25 }),
    glass: new T.MeshPhysicalMaterial({ color: 0x9db7c8, roughness: 0.08, metalness: 0.18, transparent: true, opacity: 0.35 }),
    darkGlass: new T.MeshPhysicalMaterial({ color: 0x1e2b36, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.7 }),
    blue: new T.MeshStandardMaterial({ color: 0x7ad1ff, emissive: 0x1c6ea3, roughness: 0.25, metalness: 0.2 }),
    bright: new T.MeshStandardMaterial({ color: 0xf2f6fa, roughness: 0.35, metalness: 0.6 })
  };

  const make = (geo, material, pos, rot, scale) => {
    const mesh = new T.Mesh(geo, material);
    mesh.position.set(pos[0], pos[1], pos[2]);
    if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
    if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // base platform
  root.add(make(new T.BoxGeometry(18, 1.1, 8), mat.body3, [0, -0.7, 0]));

  // main machine body silhouette similar to the reference photo
  const shell = new T.Group();
  root.add(shell);

  const bodyMain = make(new T.BoxGeometry(7.6, 4.4, 4.8), mat.body, [0, 2.2, 0.1]);
  shell.add(bodyMain);

  const bodyFront = make(new T.BoxGeometry(6.2, 2.2, 0.18), mat.slate, [0, 1.9, 2.38]);
  shell.add(bodyFront);

  const topCap = make(new T.CylinderGeometry(2.05, 2.4, 2.7, 6, 1, false), mat.body2, [0, 5.0, 0.15], [0, 0, 0]);
  topCap.rotation.y = Math.PI / 6;
  shell.add(topCap);

  const topPlate = make(new T.BoxGeometry(4.6, 0.4, 3.0), mat.body2, [0, 4.2, 0.2]);
  shell.add(topPlate);

  const frontDark = make(new T.BoxGeometry(3.7, 2.1, 0.14), mat.darkGlass, [-0.8, 1.9, 2.42]);
  shell.add(frontDark);

  // left sample tray / chamber
  const tray = new T.Group();
  tray.position.set(-4.7, 0.8, 0.2);
  tray.rotation.y = 0.18;
  root.add(tray);
  tray.add(make(new T.BoxGeometry(3.3, 1.2, 2.6), mat.body3, [0, 0, 0]));
  tray.add(make(new T.BoxGeometry(2.5, 0.25, 1.8), mat.slate, [0, 0.42, 0]));
  tray.add(make(new T.BoxGeometry(2.3, 0.75, 1.6), mat.darkGlass, [0, 0.1, 0]));

  // right detector unit / display
  const rightUnit = new T.Group();
  rightUnit.position.set(4.9, 1.2, 0.5);
  root.add(rightUnit);
  rightUnit.add(make(new T.BoxGeometry(2.6, 2.1, 2.1), mat.silver, [0, 0, 0]));
  rightUnit.add(make(new T.BoxGeometry(1.6, 0.8, 0.2), mat.darkGlass, [0, 0.45, 1.06]));
  rightUnit.add(make(new T.BoxGeometry(1.8, 0.6, 0.16), mat.bright, [0, 0.12, 1.1]));

  // central optical bridge
  const bridge = make(new T.BoxGeometry(2.2, 1.9, 1.8), mat.slate, [0, 2.0, 0.45]);
  root.add(bridge);

  // lamp / black head on top front center
  const lamp = make(new T.BoxGeometry(1.5, 1.6, 1.2), mat.body, [0.0, 4.2, 1.7]);
  root.add(lamp);

  // front sample inlet / burner slot
  const burnerSlot = make(new T.BoxGeometry(1.4, 0.22, 0.5), mat.slate, [0.0, 0.38, 2.1]);
  root.add(burnerSlot);

  const burner = make(new T.BoxGeometry(1.8, 0.32, 1.1), mat.silver, [0.0, 0.7, 1.2]);
  root.add(burner);

  // small metal side knob and lower support
  const sideKnob = make(new T.CylinderGeometry(0.12, 0.12, 1.1, 16), mat.silver, [2.8, 0.2, 1.3], [Math.PI / 2, 0, 0]);
  root.add(sideKnob);

  // central beam light
  const beam = new T.Group();
  const beamMesh = make(new T.CylinderGeometry(0.05, 0.05, 10, 12), mat.blue, [0, 2.2, 0], [Math.PI / 2, 0, 0]);
  beam.add(beamMesh);
  beam.visible = true;
  root.add(beam);

  // label references
  const labels = [
    { id: 1, name: 'Casing / Rumah Instrumen', pos: V(0, 5.8, 0.5) },
    { id: 2, name: 'Hollow Cathode Lamp (HCL)', pos: V(0.2, 6.2, 1.6) },
    { id: 3, name: 'Sample Tray', pos: V(-4.9, 2.5, 0.9) },
    { id: 4, name: 'Nebulizer', pos: V(-2.8, 2.5, 1.1) },
    { id: 5, name: 'Spray Chamber', pos: V(-1.2, 2.5, -0.2) },
    { id: 6, name: 'Burner Head', pos: V(0.0, 1.0, 2.4) },
    { id: 7, name: 'Gas Supply', pos: V(3.0, 1.2, -1.8) },
    { id: 8, name: 'Flame', pos: V(0.0, 1.0, 2.8) },
    { id: 9, name: 'Monokromator', pos: V(1.4, 3.7, -0.2) },
    { id: 10, name: 'Detector PMT', pos: V(4.8, 3.4, 0.9) },
    { id: 11, name: 'Elektronik', pos: V(4.5, 1.0, -1.9) },
    { id: 12, name: 'Monitor', pos: V(4.9, 2.7, 2.4) },
    { id: 13, name: 'Exhaust Hood', pos: V(1.7, 6.1, -1.7) },
    { id: 14, name: 'Botol Limbah', pos: V(-2.5, 0.4, -2.3) }
  ];

  function createLabel(label) {
    const el = document.createElement('div');
    el.textContent = label.name;
    el.className = 'o';
    el.onclick = () => onSelect(label.id);
    $('labs').appendChild(el);
    return { el, pos: label.pos };
  }

  const labelRefs = labels.map(createLabel);

  function projectLabel(obj) {
    const vect = obj.pos.clone();
    vect.project(camera);
    const x = (vect.x * 0.5 + 0.5) * box.clientWidth;
    const y = (-vect.y * 0.5 + 0.5) * box.clientHeight;
    obj.el.style.left = x + 'px';
    obj.el.style.top = y + 'px';
    obj.el.style.display = vect.z > 1 ? 'none' : 'block';
  }

  function onSelect(id) {
    const part = C.parts.find((p) => p.id === id);
    const info = $('info');
    if (!part) return;
    info.innerHTML = '<b>' + part.outer + '</b><br>' + part.fn + '<br><u>Bagian dalam:</u><ul class="inn">' + part.inner.map((n) => '<li>' + n + '</li>').join('') + '</ul>';
  }

  // external controls behavior
  let active = false;
  const steps = [
    'Exhaust ON & lampu HCL pemanasan',
    'Udara tekan dibuka (oksidan)',
    'Asetilena dibuka (bahan bakar)',
    'Igniter memercikkan api',
    'Nyala stabil (autozero blanko)',
    'Siap aspirasi sampel'
  ];
  $('steps').innerHTML = steps.map((s) => '<li>' + s + '</li>').join('');

  const updateSteps = (n) => {
    [...$('steps').children].forEach((li, i) => {
      li.className = i < n ? 'd' : i === n ? 'a' : '';
    });
  };

  $('bo').onclick = () => { $('lid').value = 1; $('door').value = 1; $('ex').value = 1; };
  $('bc').onclick = () => { $('lid').value = 0; $('door').value = 0; $('ex').value = 0; };
  $('on').onclick = () => { active = true; updateSteps(4); };
  $('off').onclick = () => { active = false; updateSteps(-1); };

  const sol = $('sol');
  C.runs.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.type + ' - ' + r.name + ' (' + r.conc + ' mg/L)';
    sol.appendChild(opt);
  });

  $('m1').onclick = () => {
    const idx = +$('sol').value;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + C.runs[idx].name + '</td><td>' + C.runs[idx].conc + '</td><td>0.180</td><td>62.0</td>';
    $('res').appendChild(row);
  };

  $('mall').onclick = () => {
    $('res').innerHTML = '<tr><th>Larutan</th><th>C</th><th>A</th><th>%T</th></tr>';
    C.runs.forEach((r) => {
      const row = document.createElement('tr');
      row.innerHTML = '<td>' + r.name + '</td><td>' + r.conc + '</td><td>0.180</td><td>62.0</td>';
      $('res').appendChild(row);
    });
  };

  function hit(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
    const raycaster = new T.Raycaster();
    raycaster.setFromCamera(new T.Vector2(x, y), camera);
    const hits = raycaster.intersectObjects(root.children, true);
    return hits[0] ? hits[0].object : null;
  }

  let drag = false, lx = 0, ly = 0, mv = 0;
  renderer.domElement.onpointerdown = (e) => {
    drag = true; mv = 0; lx = e.clientX; ly = e.clientY;
  };

  addEventListener('pointerup', (e) => {
    if (drag && mv < 4 && e.target === renderer.domElement) {
      const obj = hit(e);
      if (obj) {
        const id = obj.userData.id || 1;
        onSelect(id);
      }
    }
    drag = false;
  });

  renderer.domElement.onpointermove = (e) => {
    if (drag) {
      mv += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
      theta -= (e.clientX - lx) * 0.006;
      phi = Math.min(1.8, Math.max(0.5, phi - (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY;
    }

    const h = hit(e);
    const tip = $('tip');
    if (h && h.userData && h.userData.id) {
      const targetPart = C.parts.find((p) => p.id === h.userData.id);
      if (targetPart) {
        tip.style.display = 'block';
        tip.style.left = e.offsetX + 14 + 'px';
        tip.style.top = e.offsetY + 14 + 'px';
        tip.textContent = targetPart.outer;
      }
    } else {
      tip.style.display = 'none';
    }
  };

  renderer.domElement.onwheel = (e) => {
    e.preventDefault();
    rad = Math.min(30, Math.max(12, rad * (1 + Math.sign(e.deltaY) * 0.08)));
  };

  function applyState() {
    const lid = +$('lid').value;
    const door = +$('door').value;
    const ex = +$('ex').value;
    const lo = $('lo').checked;
    const li = $('li').checked;
    const bm = $('bm').checked;

    topCap.rotation.x = -0.2 + lid * 0.25;
    lamp.position.z = 1.7 + door * 0.7;
    bridge.position.x = ex * 0.9;
    tray.position.x = -4.7 - ex * 0.8;
    rightUnit.position.x = 4.9 + ex * 0.8;

    labelRefs.forEach((item, idx) => {
      const visible = (idx % 2 === 0 ? lo : li) || (!lo && !li);
      item.el.style.display = visible ? 'block' : 'none';
      if (visible) projectLabel(item);
    });

    beam.visible = bm && active;
    beamMesh.material.opacity = active ? 0.9 : 0.2;
    accent.intensity = active ? 2.0 : 0.6;
  }

  $('lid').addEventListener('input', applyState);
  $('door').addEventListener('input', applyState);
  $('ex').addEventListener('input', applyState);
  $('lo').addEventListener('change', applyState);
  $('li').addEventListener('change', applyState);
  $('bm').addEventListener('change', applyState);

  const pickables = [bodyMain, topCap, lamp, tray, burner, bridge, rightUnit, burnerSlot, sideKnob];
  pickables.forEach((obj, idx) => { obj.userData.id = idx + 1; });

  fit();
  setCam();
  applyState();

  function loop() {
    requestAnimationFrame(loop);
    const t = performance.now() * 0.001;
    root.rotation.y = Math.sin(t * 0.3) * 0.06;
    if (active) {
      beamMesh.scale.set(1, 1 + Math.sin(t * 18) * 0.05, 1);
      accent.intensity = 2.0 + Math.sin(t * 7) * 0.5;
    }
    setCam();
    renderer.render(scene, camera);
  }

  loop();
})();
