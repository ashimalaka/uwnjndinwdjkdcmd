(function () {
  if (!window.THREE) {
    document.body.innerHTML = '<p style="padding:24px;font:15px sans-serif;color:white;">Three.js tidak dapat dimuat (perlu internet ke cdn.jsdelivr.net).</p>';
    return;
  }

  const T = THREE, C = {
    runs: [
      { type: 'Blanko', name: 'Blanko', conc: 0.0, A: [0.002, 0.003, 0.004] },
      { type: 'Standar', name: 'Std 1', conc: 1.0, A: [0.060, 0.065, 0.058] },
      { type: 'Standar', name: 'Std 2', conc: 2.0, A: [0.118, 0.122, 0.119] },
      { type: 'Standar', name: 'Std 3', conc: 3.0, A: [0.180, 0.186, 0.177] }
    ],
    parts: [
      { id: 1, outer: 'Casing / Rumah Instrumen', fn: 'Melindungi dan menahan seluruh komponen AAS', inner: ['Tutup atas', 'Pintu atomisasi', 'Panel depan'] },
      { id: 2, outer: 'Lampu HCL', fn: 'Memancarkan cahaya garis spesifik Cu', inner: ['Katoda Cu', 'Anoda', 'Kaca kuarsa'] },
      { id: 3, outer: 'Tray Sampel', fn: 'Tempat larutan blanko dan standar', inner: ['Vial blanko', 'Vial standar', 'Vial sampel'] },
      { id: 4, outer: 'Nebulizer', fn: 'Mengubah larutan menjadi aerosol halus', inner: ['Kapiler hisap', 'Nosel venturi'] },
      { id: 5, outer: 'Spray Chamber', fn: 'Menyaring droplet besar sebelum nyala', inner: ['Flow spoiler', 'Saluran drain'] },
      { id: 6, outer: 'Burner Head', fn: 'Tempat nyala pembakar AAS', inner: ['Slot burner', 'Leher burner'] },
      { id: 7, outer: 'Gas Supply', fn: 'Udara dan asetilena untuk nyala pembakar', inner: ['Selang udara', 'Selang asetilena'] },
      { id: 8, outer: 'Flame', fn: 'Mengatomisasi unsur Cu', inner: ['Zona primer', 'Zona interkonal'] },
      { id: 9, outer: 'Monokromator', fn: 'Memilih panjang gelombang yang relevan', inner: ['Celah masuk', 'Kisi difraksi'] },
      { id: 10, outer: 'Detector PMT', fn: 'Menerima sinyal pada gelombang tertentu', inner: ['Fotokatoda', 'Dinoda', 'Anoda'] },
      { id: 11, outer: 'Elektronik', fn: 'Menguatkan dan mengolah sinyal', inner: ['Amplifier', 'ADC'] },
      { id: 12, outer: 'Monitor', fn: 'Menampilkan absorbansi dan hasil', inner: ['Layar', 'Grafik'] },
      { id: 13, outer: 'Exhaust Hood', fn: 'Membuang gas dan uap buangan', inner: ['Duct', 'Kipas'] },
      { id: 14, outer: 'Botol Limbah', fn: 'Menampung cairan sisa', inner: ['Limbah cair'] }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const PI = Math.PI;
  const box = $('v');

  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  box.prepend(renderer.domElement);

  const scene = new T.Scene();
  scene.background = new T.Color(0x061a2b);

  const camera = new T.PerspectiveCamera(36, 1, 0.1, 200);
  let theta = 0.75, phi = 1.1, rad = 25;
  const target = V(0, 1.5, 0);

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

  scene.add(new T.HemisphereLight(0xffffff, 0x29435b, 0.9));
  const dir = new T.DirectionalLight(0xffffff, 0.9);
  dir.position.set(8, 15, 10);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);

  const shine = new T.PointLight(0x5aa9ff, 0.8, 30);
  shine.position.set(0, 2.6, 5);
  scene.add(shine);

  const mat = {
    dark: new T.MeshStandardMaterial({ color: 0x111a22, roughness: 0.7, metalness: 0.3 }),
    dark2: new T.MeshStandardMaterial({ color: 0x1b2730, roughness: 0.7, metalness: 0.25 }),
    grey: new T.MeshStandardMaterial({ color: 0xc8d0d6, roughness: 0.45, metalness: 0.55 }),
    silver: new T.MeshStandardMaterial({ color: 0xb0bac5, roughness: 0.4, metalness: 0.8 }),
    glass: new T.MeshPhysicalMaterial({ color: 0x9db9c7, roughness: 0.08, metalness: 0.15, transparent: true, opacity: 0.35 }),
    accent: new T.MeshStandardMaterial({ color: 0x2d7df6, roughness: 0.3, metalness: 0.7 }),
    smoke: new T.MeshStandardMaterial({ color: 0x515d66, roughness: 0.8, metalness: 0.2 }),
    blue: new T.MeshStandardMaterial({ color: 0x70c8ff, emissive: 0x1b5e9a, roughness: 0.2, metalness: 0.2 })
  };

  const M = (geo, material, p, r, s) => {
    const m = new T.Mesh(geo, material);
    m.position.set(...(p || [0, 0, 0]));
    if (r) m.rotation.set(...r);
    if (s) m.scale.set(...s);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const group = new T.Group();
  scene.add(group);

  // base platform / floor
  const base = M(new T.BoxGeometry(14, 1.2, 8), mat.dark2, [0, -0.5, 0]);
  group.add(base);

  // main body
  const mainBody = M(new T.BoxGeometry(8.8, 4.0, 5.2), mat.dark, [0, 1.9, 0.3]);
  group.add(mainBody);

  // illuminated top cap to match reference photo
  const topCap = M(new T.BoxGeometry(5.3, 2.7, 3.8), mat.dark, [0, 4.1, 0.2]);
  topCap.rotation.x = -0.12;
  group.add(topCap);

  // front access panel + dark top face
  const frontPanel = M(new T.BoxGeometry(6.4, 2.4, 0.18), mat.grey, [0, 2.0, 2.6]);
  group.add(frontPanel);

  // door cavity / opening area
  const doorFrame = M(new T.BoxGeometry(2.3, 2.0, 0.08), mat.smoke, [-1.6, 1.9, 2.65]);
  group.add(doorFrame);

  // left sample rack area
  const tray = M(new T.BoxGeometry(2.6, 1.8, 2.4), mat.dark2, [-4.2, 0.8, 0.5]);
  tray.rotation.y = 0.2;
  group.add(tray);

  const trayInset = M(new T.BoxGeometry(2.0, 0.2, 1.6), mat.grey, [-4.2, 1.1, 0.5]);
  group.add(trayInset);

  // right detector/block
  const detector = M(new T.BoxGeometry(2.2, 2.1, 2.0), mat.silver, [4.3, 1.6, 0.5]);
  group.add(detector);

  const display = M(new T.BoxGeometry(1.4, 0.8, 0.5), mat.glass, [4.4, 2.0, 1.3]);
  group.add(display);

  // central optical unit
  const optical = M(new T.BoxGeometry(2.8, 2.2, 2.3), mat.grey, [0.1, 2.0, 0.35]);
  group.add(optical);

  // flame chamber / burner slot at the front
  const burner = M(new T.BoxGeometry(1.6, 0.5, 1.5), mat.silver, [0.2, 0.5, 1.2]);
  group.add(burner);

  // black lamp head at top front
  const lampHead = M(new T.BoxGeometry(1.8, 1.7, 1.4), mat.dark, [0.1, 4.0, 1.8]);
  group.add(lampHead);

  // central support beam and slit
  const support = M(new T.BoxGeometry(0.3, 2.7, 1.8), mat.silver, [0.1, 2.0, 1.3]);
  group.add(support);

  // sample inlet tube and burner line
  const tubeMat = new T.MeshStandardMaterial({ color: 0x7aa7ce, emissive: 0x123857, roughness: 0.55, metalness: 0.3 });
  const tube = M(new T.CylinderGeometry(0.12, 0.12, 2.7, 16), tubeMat, [-2.4, 0.7, 1.2], [Math.PI / 2, 0, 0]);
  group.add(tube);

  // top front black sloped cap
  const hood = M(new T.BoxGeometry(3.8, 1.2, 2.0), mat.dark, [0.2, 4.7, 1.0]);
  hood.rotation.z = -0.18;
  group.add(hood);

  // light beam visualization
  const beam = new T.Group();
  const beamMesh = M(new T.CylinderGeometry(0.04, 0.04, 7, 8), mat.blue, [0, 2.3, 0], [Math.PI / 2, 0, 0]);
  beamMesh.position.z = 0.5;
  beam.add(beamMesh);
  beam.visible = true;
  group.add(beam);

  // labels for components
  const labels = [
    { id: 1, name: 'Casing / Rumah Instrumen', pos: V(0.4, 4.7, 0.4), inner: ['Tutup atas', 'Pintu atomisasi', 'Panel depan'] },
    { id: 2, name: 'Hollow Cathode Lamp (HCL)', pos: V(0.2, 5.3, 1.8), inner: ['Katoda Cu', 'Anoda', 'Kaca kuarsa'] },
    { id: 3, name: 'Sample Tray', pos: V(-4.6, 2.4, 0.6), inner: ['Vial blanko', 'Vial standar'] },
    { id: 4, name: 'Nebulizer', pos: V(-2.4, 1.8, 1.2), inner: ['Kapiler hisap', 'Nosel venturi'] },
    { id: 5, name: 'Spray Chamber', pos: V(-1.2, 1.8, -0.2), inner: ['Flow spoiler', 'Saluran drain'] },
    { id: 6, name: 'Burner Head', pos: V(0.2, 0.9, 1.6), inner: ['Slot burner', 'Leher burner'] },
    { id: 7, name: 'Gas Supply', pos: V(2.0, 0.9, -1.8), inner: ['Udara', 'Asetilena'] },
    { id: 8, name: 'Flame', pos: V(0.0, 1.0, 2.0), inner: ['Zona primer', 'Zona interkonal'] },
    { id: 9, name: 'Monokromator', pos: V(1.5, 3.2, -0.2), inner: ['Celah masuk', 'Kisi difraksi'] },
    { id: 10, name: 'Detector PMT', pos: V(4.4, 2.8, 0.8), inner: ['Fotokatoda', 'Dinoda'] },
    { id: 11, name: 'Elektronik', pos: V(4.2, 0.7, -2.1), inner: ['Amplifier', 'ADC'] },
    { id: 12, name: 'Monitor', pos: V(4.5, 2.2, 2.4), inner: ['Layar', 'Grafik'] },
    { id: 13, name: 'Exhaust Hood', pos: V(2.2, 5.3, -2.0), inner: ['Duct', 'Kipas'] },
    { id: 14, name: 'Botol Limbah', pos: V(-2.8, 0.2, -2.4), inner: ['Limbah cair'] }
  ];

  function createLabel(label) {
    const el = document.createElement('div');
    el.textContent = label.name;
    el.className = 'o';
    el.onclick = () => onSelect(label.id);
    $('#labs').appendChild(el);
    return { obj: el, position: label.pos };
  }

  const labelRefs = labels.map(createLabel);

  function projectLabel(label, element) {
    const vect = label.position.clone();
    vect.project(camera);
    const x = (vect.x * 0.5 + 0.5) * box.clientWidth;
    const y = (-vect.y * 0.5 + 0.5) * box.clientHeight;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.display = vect.z > 1 ? 'none' : 'block';
  }

  function onSelect(id) {
    const part = C.parts.find((p) => p.id === id);
    const info = $('info');
    if (!part) return;
    info.innerHTML = `<b>${part.outer}</b><br>${part.fn}<br><u>Bagian dalam:</u><ul class="inn">${part.inner.map((n) => '<li>' + n + '</li>').join('')}</ul>`;
  }

  // UI behavior
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

  $('bo').onclick = () => {
    $('lid').value = 1; $('door').value = 1; $('ex').value = 1;
  };
  $('bc').onclick = () => {
    $('lid').value = 0; $('door').value = 0; $('ex').value = 0;
  };

  $('on').onclick = () => {
    active = true;
    updateSteps(4);
    shine.intensity = 2.3;
  };
  $('off').onclick = () => {
    active = false;
    updateSteps(-1);
    shine.intensity = 0.3;
  };

  const sol = $('sol');
  C.runs.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.type + ' - ' + r.name + ' (' + r.conc + ' mg/L)';
    sol.appendChild(opt);
  });

  $('m1').onclick = () => {
    const index = +$('sol').value;
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + C.runs[index].name + '</td><td>' + C.runs[index].conc + '</td><td>0.180</td><td>62.0</td>';
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
    const hits = raycaster.intersectObjects(group.children, true);
    return hits[0] ? hits[0].object : null;
  }

  let drag = false, lx = 0, ly = 0, moved = 0;
  renderer.domElement.onpointerdown = (e) => {
    drag = true; moved = 0; lx = e.clientX; ly = e.clientY;
  };
  addEventListener('pointerup', (e) => {
    if (drag && moved < 4 && e.target === renderer.domElement) {
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
      moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
      theta -= (e.clientX - lx) * 0.006;
      phi = Math.min(1.6, Math.max(0.5, phi - (e.clientY - ly) * 0.006));
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
    rad = Math.min(32, Math.max(10, rad * (1 + Math.sign(e.deltaY) * 0.08)));
  };

  function applyState() {
    const lid = +$('lid').value;
    const door = +$('door').value;
    const ex = +$('ex').value;
    const xr = $('xr').checked;
    const lo = $('lo').checked;
    const li = $('li').checked;
    const bm = $('bm').checked;

    topCap.rotation.x = -0.12 + lid * 0.25;
    doorFrame.position.z = 2.65 - door * 0.7;
    doorFrame.rotation.x = -door * 1.3;

    // Slight explosion separation for component groups
    [mainBody, topCap, lampHead, tray, burner, optical, detector, tube].forEach((mesh, i) => {
      const spread = ex * (i % 2 === 0 ? 0.45 : 0.28);
      mesh.position.x += ((i % 2 === 0 ? 1 : -1) * spread - mesh.position.x * 0.02);
      mesh.position.z += ((i % 3 === 0 ? 1 : -1) * spread * 0.1);
    });

    const visible = lo || li;
    $('#labs').style.display = visible ? 'block' : 'none';
    labelRefs.forEach(({ obj, position }, idx) => {
      const show = (idx % 2 === 0 ? lo : li) || (!lo && !li && !xr);
      obj.style.display = show ? 'block' : 'none';
      if (show) projectLabel({ position }, obj);
    });

    beam.visible = bm && active;
    beam.material = active ? mat.blue : mat.smoke;
    if (active) shine.intensity = 2.2;
    else shine.intensity = 0.6;
  }

  Object.keys({ lid: 1, door: 1, ex: 1 }).forEach((id) => {
    $(id).addEventListener('input', applyState);
  });
  $('xr').addEventListener('change', applyState);
  $('lo').addEventListener('change', applyState);
  $('li').addEventListener('change', applyState);
  $('bm').addEventListener('change', applyState);

  // assign userData ids for pickability
  [mainBody, topCap, lampHead, tray, burner, optical, detector, tube, doorFrame].forEach((obj, idx) => {
    obj.userData.id = idx + 1;
  });

  // default scene
  fit();
  setCam();
  applyState();

  function loop() {
    requestAnimationFrame(loop);
    const t = performance.now() * 0.001;
    group.rotation.y = Math.sin(t * 0.3) * 0.07;
    if (active) {
      beamMesh.material.emissiveIntensity = 0.6 + Math.sin(t * 8) * 0.2;
      beam.scale.set(1, 1 + Math.sin(t * 12) * 0.05, 1);
    }
    setCam();
    renderer.render(scene, camera);
  }
  loop();
})();
