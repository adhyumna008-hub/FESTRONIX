/**
 * FESTRONIX original mechanical prototype assets.
 * Units: metres; +Y up; X-Core front: +Z. No third-party mesh or image content.
 * Uses installed Three.js and GLTFExporter only. Run from the prototype directory:
 * node tools/build-mechanical-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { deflateSync, gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.({ target: this }); }
    async readAsDataURL(blob) { this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`; this.onloadend?.({ target: this }); }
  };
}

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/models/festronix');
await fs.mkdir(directory, { recursive: true });
const TAU = Math.PI * 2;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const mats = {
  graphite: new THREE.MeshStandardMaterial({ name: 'Anodized graphite chassis', color: '#192127', metalness: .82, roughness: .32 }),
  titanium: new THREE.MeshStandardMaterial({ name: 'Satin machined titanium', color: '#91a0a6', metalness: .92, roughness: .27 }),
  darkMetal: new THREE.MeshStandardMaterial({ name: 'Black oxide steel', color: '#303940', metalness: .9, roughness: .37 }),
  copper: new THREE.MeshStandardMaterial({ name: 'Satin copper busbar', color: '#bb744b', metalness: .92, roughness: .25 }),
  gasket: new THREE.MeshStandardMaterial({ name: 'Elastomer cable and gasket', color: '#080c0e', metalness: .05, roughness: .82 }),
  light: new THREE.MeshStandardMaterial({ name: 'Mint indicator acrylic', color: '#90d7c4', emissive: '#69baa5', emissiveIntensity: .48, metalness: .1, roughness: .3 }),
  warmLight: new THREE.MeshStandardMaterial({ name: 'Amber status acrylic', color: '#f3bd71', emissive: '#b8752b', emissiveIntensity: .4, metalness: .1, roughness: .32 }),
  glass: new THREE.MeshPhysicalMaterial({ name: 'Smoked inspection glass', color: '#7da69e', metalness: .15, roughness: .13, transparent: true, opacity: .23, depthWrite: false, clearcoat: .7, clearcoatRoughness: .12 }),
  ceramic: new THREE.MeshStandardMaterial({ name: 'Powder-coated cast aluminum', color: '#b5bfbc', metalness: .48, roughness: .44 }),
};

function roundedRectangle(width, height, radius = .03) {
  const s = new THREE.Shape(); const x = -width / 2, y = -height / 2, r = Math.min(radius, width / 2, height / 2);
  s.moveTo(x + r, y); s.lineTo(x + width - r, y); s.quadraticCurveTo(x + width, y, x + width, y + r);
  s.lineTo(x + width, y + height - r); s.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  s.lineTo(x + r, y + height); s.quadraticCurveTo(x, y + height, x, y + height - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function circlePath(radius, segments, cx = 0, cy = 0, reverse = false) {
  const s = new THREE.Path();
  for (let i = 0; i <= segments; i++) {
    const a = (reverse ? -1 : 1) * i / segments * TAU;
    if (i === 0) s.moveTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    else s.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
  }
  s.closePath(); return s;
}
function slotHole(width, height, x, y, radius = .012) {
  const s = roundedRectangle(width, height, radius); const points = s.getPoints(3).reverse();
  const p = new THREE.Path(); p.moveTo(points[0].x + x, points[0].y + y);
  points.slice(1).forEach(v => p.lineTo(v.x + x, v.y + y)); p.closePath(); return p;
}
function extrude(shape, depth, detail, bevel = .01) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, curveSegments: detail === 'full' ? 3 : 2, steps: 1, bevelEnabled: bevel > 0, bevelSegments: 1, bevelSize: bevel, bevelThickness: bevel });
  g.translate(0, 0, -depth / 2); g.clearGroups(); return g;
}
function plate(width, height, depth, detail, radius = .035, holes = [], bevel = .01) {
  const s = roundedRectangle(width, height, radius); s.holes.push(...holes); return extrude(s, depth, detail, bevel);
}
function annulus(outer, inner, depth, detail, bevel = .01, segments = null) {
  const n = segments ?? (detail === 'full' ? 64 : 36); const p = circlePath(outer, n); const s = new THREE.Shape(p.getPoints());
  s.holes.push(circlePath(inner, n, 0, 0, true)); return extrude(s, depth, detail, bevel);
}
function cylinder(radius, length, detail, segments = null) {
  const g = new THREE.CylinderGeometry(radius, radius, length, segments ?? (detail === 'full' ? 24 : 12)); g.rotateX(Math.PI / 2); g.clearGroups(); return g;
}
function taperedCylinder(a, b, length, detail, segments = null) {
  const g = new THREE.CylinderGeometry(a, b, length, segments ?? (detail === 'full' ? 28 : 16)); g.rotateX(Math.PI / 2); g.clearGroups(); return g;
}
function tube(points, radius, detail) {
  const curve = new THREE.CatmullRomCurve3(points); return new THREE.TubeGeometry(curve, detail === 'full' ? 22 : 12, radius, detail === 'full' ? 8 : 5, false);
}
function radialPoint(radius, angle, z) { return V(Math.cos(angle) * radius, Math.sin(angle) * radius, z); }
function bucket(group, label) {
  const pieces = new Map(); return {
    add(geometry, material, position = V(0, 0, 0), rotation = V(0, 0, 0), scale = V(1, 1, 1)) {
      const transform = new THREE.Matrix4().compose(position, new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z)), scale);
      geometry.applyMatrix4(transform); geometry.clearGroups();
      // All sources become non-indexed with the same attributes before deterministic merging.
      const g = geometry.index ? geometry.toNonIndexed() : geometry;
      if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
      const list = pieces.get(material) ?? []; list.push(g); pieces.set(material, list);
      if (g !== geometry) geometry.dispose();
    },
    finish() {
      for (const [material, geometries] of pieces) {
        const merged = mergeVertices(mergeGeometries(geometries, false), .000001);
        const mesh = new THREE.Mesh(merged, material); mesh.name = `${label}_${material.name.replaceAll(' ', '_')}`; mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
        geometries.forEach(g => g.dispose());
      }
    },
  };
}
function screw(target, x, y, z, detail, radius = .018) {
  target.add(cylinder(radius, .012, detail, 6), mats.titanium, V(x, y, z));
  target.add(plate(radius * .85, .004, .002, detail, .001, [], 0), mats.gasket, V(x, y, z + .007));
}
function consolidateDirectMeshes(group) {
  const meshes = group.children.filter(o => o.isMesh); if (meshes.length < 2) return;
  const combined = bucket(group, group.name);
  for (const mesh of meshes) { mesh.updateMatrix(); combined.add(mesh.geometry.clone().applyMatrix4(mesh.matrix), mesh.material); group.remove(mesh); mesh.geometry.dispose(); }
  combined.finish();
}
function xCore(detail) {
  const scene = new THREE.Scene(); scene.name = 'FESTRONIX_X_CORE';
  scene.userData = { author: 'FESTRONIX original modeled prototype', units: 'metres', front: '+Z', up: '+Y', source: 'tools/build-mechanical-assets.mjs', purpose: 'Mechanically designed sci-fi exhibition artifact; not an engineering-certified machine or physical scan', detail };
  const chassis = new THREE.Group(); chassis.name = 'xcore_chassis'; scene.add(chassis); const shell = bucket(chassis, 'chassis');
  // The load-bearing back plate is an engineered cross, rather than four intersecting boxes.
  for (let arm = 0; arm < 4; arm++) {
    const angle = Math.PI / 4 + arm * Math.PI / 2;
    const local = new THREE.Group(); local.rotation.z = angle; const pieces = bucket(local, `arm_${arm}`);
    pieces.add(plate(.61, 1.2, .21, detail, .085), mats.graphite, V(0, 1.06, -.075));
    // Recessed channel, inset stiffeners, copper conductors and distal connector.
    pieces.add(plate(.42, 1.04, .05, detail, .055), mats.gasket, V(0, 1.09, .07));
    pieces.add(plate(.044, 1.06, .065, detail, .012), mats.titanium, V(-.267, 1.08, .075));
    pieces.add(plate(.044, 1.06, .065, detail, .012), mats.titanium, V(.267, 1.08, .075));
    for (let side = -1; side <= 1; side += 2) {
      pieces.add(plate(.043, .94, .018, detail, .008), mats.copper, V(side * .207, 1.11, .12));
      // Bolted conductor bridges across insulated standoffs.
      for (let j = 0; j < 5; j++) {
        const y = .74 + j * .17;
        pieces.add(plate(.077, .037, .035, detail, .007), mats.gasket, V(side * .207, y, .106));
        screw(pieces, side * .27, y, .117, detail, .013);
      }
    }
    pieces.add(plate(.45, .105, .13, detail, .025), mats.darkMetal, V(0, 1.63, .02));
    for (let contact = 0; contact < 7; contact++) pieces.add(plate(.021, .075, .025, detail, .006), mats.copper, V(-.135 + contact * .045, 1.675, .103));
    // Upper and lower structural braces, connector fixings, industrial cable gland.
    pieces.add(plate(.58, .095, .045, detail, .02), mats.titanium, V(0, .58, .072));
    pieces.add(plate(.058, .24, .075, detail, .015), mats.darkMetal, V(-.32, 1.18, -.015));
    pieces.add(plate(.058, .24, .075, detail, .015), mats.darkMetal, V(.32, 1.18, -.015));
    for (const y of [.6, 1.56]) for (const x of [-.223, .223]) screw(pieces, x, y, .1, detail);
    pieces.add(tube([V(-.36, .63, -.08), V(-.42, .92, -.1), V(-.35, 1.3, -.045), V(-.25, 1.5, -.04)], .023, detail), mats.gasket);
    pieces.add(tube([V(.36, .63, -.08), V(.42, .92, -.1), V(.35, 1.3, -.045), V(.25, 1.5, -.04)], .015, detail), mats.copper);
    // Unbaked panel assembly is a named, independently movable export node.
    const panel = new THREE.Group(); panel.name = `arm_panel_${arm}`; panel.rotation.z = angle;
    panel.userData = { role: 'unlocking arm heat-shield', axis: '+Z', activationOrder: arm, maxTravel: .18 }; scene.add(panel);
    const cover = bucket(panel, `heatshield_${arm}`);
    const vents = [];
    for (let v = 0; v < (detail === 'full' ? 9 : 6); v++) vents.push(slotHole(.24, .024, 0, -.3 + v * (detail === 'full' ? .072 : .12), .009));
    cover.add(plate(.344, .84, .028, detail, .035, vents, .004), mats.titanium, V(0, 1.095, .146));
    cover.add(plate(.176, .094, .04, detail, .019), mats.graphite, V(0, 1.51, .163));
    for (let j = 0; j < 3; j++) cover.add(plate(.026, .012, .014, detail, .004), mats.light, V(-.05 + j * .05, 1.517, .19));
    for (const x of [-.127, .127]) for (const y of [.722, 1.466]) screw(cover, x, y, .168, detail, .012);
    cover.finish(); pieces.finish();
    // Bake arm placement into the shared static material buckets.
    local.updateMatrixWorld(true); local.traverse(o => { if (o.isMesh) shell.add(o.geometry.clone().applyMatrix4(o.matrixWorld), o.material); });
    local.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
  }
  // Several machined concentric surfaces have distinct depths and functional fasteners.
  shell.add(cylinder(.64, .19, detail, detail === 'full' ? 80 : 48), mats.graphite, V(0, 0, -.04));
  // Rear pressure housing gives the reactor genuine spatial depth when the camera orbits.
  shell.add(taperedCylinder(.54, .43, .56, detail, detail === 'full' ? 64 : 32), mats.graphite, V(0, 0, -.42));
  shell.add(annulus(.548, .414, .054, detail), mats.titanium, V(0, 0, -.175));
  shell.add(annulus(.442, .302, .048, detail), mats.darkMetal, V(0, 0, -.69));
  shell.add(cylinder(.298, .087, detail), mats.graphite, V(0, 0, -.745));
  for (let i = 0; i < (detail === 'full' ? 24 : 12); i++) {
    const a = i / (detail === 'full' ? 24 : 12) * TAU;
    shell.add(plate(.033, .405, .059, detail, .01), mats.darkMetal, radialPoint(.483, a, -.43), V(Math.PI / 2, 0, a));
  }
  shell.add(annulus(.65, .526, .063, detail), mats.darkMetal, V(0, 0, .095));
  shell.add(annulus(.604, .553, .018, detail, .004), mats.titanium, V(0, 0, .141));
  shell.add(annulus(.51, .488, .046, detail, .004), mats.copper, V(0, 0, .17));
  shell.add(annulus(.482, .448, .063, detail, .004), mats.gasket, V(0, 0, .139));
  shell.add(annulus(.448, .42, .023, detail, .003), mats.titanium, V(0, 0, .176));
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * TAU; screw(shell, Math.cos(a) * .576, Math.sin(a) * .576, .167, detail);
    // Tangentially mounted cooling fingers, a physically readable radial heat exchanger.
    if (detail === 'full' || i % 2 === 0) {
      shell.add(plate(.035, .122, .073, detail, .005), mats.titanium, radialPoint(.677, a, .06), V(0, 0, a - Math.PI / 2));
      shell.add(plate(.016, .084, .01, detail, .002), mats.copper, radialPoint(.681, a, .103), V(0, 0, a - Math.PI / 2));
    }
  }
  // Engine-mounted split copper power harness: two U-shaped channels with actual depth.
  for (const side of [-1, 1]) {
    shell.add(tube([V(side * .55, -.3, -.04), V(side * .76, -.18, -.12), V(side * .73, .16, -.13), V(side * .57, .31, -.035)], .028, detail), mats.copper);
    for (const y of [-.22, .2]) shell.add(plate(.055, .081, .069, detail, .01), mats.gasket, V(side * .736, y, -.085));
  }
  // Rotating turbine: nonuniform swept blades, machined hub, carrier plate.
  const rotor = new THREE.Group(); rotor.name = 'core_rotor'; rotor.position.z = .181;
  rotor.userData = { role: 'actual turbine rotor assembly', axis: 'local +Z', minRpm: 0, prototypeMaxRpm: 12 }; scene.add(rotor); const blades = bucket(rotor, 'rotor');
  blades.add(annulus(.411, .118, .018, detail, .003), mats.darkMetal, V(0, 0, -.008));
  const bladeCount = detail === 'full' ? 32 : 22;
  for (let i = 0; i < bladeCount; i++) {
    const shape = new THREE.Shape(); shape.moveTo(.143, -.015); shape.bezierCurveTo(.21, -.039, .326, -.018, .397, .016); shape.lineTo(.4, .043); shape.bezierCurveTo(.31, .008, .24, .002, .149, .012); shape.closePath();
    blades.add(extrude(shape, .045, detail, .003), mats.titanium, V(0, 0, .025), V(.12, 0, i / bladeCount * TAU));
  }
  blades.add(taperedCylinder(.116, .16, .094, detail), mats.titanium, V(0, 0, .036));
  blades.add(annulus(.122, .088, .026, detail, .005), mats.copper, V(0, 0, .095));
  blades.add(cylinder(.084, .038, detail, 12), mats.graphite, V(0, 0, .112));
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; screw(blades, Math.cos(a) * .061, Math.sin(a) * .061, .14, detail, .01); }
  blades.finish();
  // Inspection cover is restrained and transparent; assembled machinery remains visible.
  const inspection = new THREE.Group(); inspection.name = 'inspection_shield'; inspection.userData = { role: 'hinged inspection cover', axis: 'local +Y', maxRotation: .25 }; scene.add(inspection); const front = bucket(inspection, 'inspection');
  front.add(cylinder(.442, .008, detail, detail === 'full' ? 72 : 40), mats.glass, V(0, 0, .31));
  front.add(annulus(.472, .442, .025, detail, .004), mats.titanium, V(0, 0, .307));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; screw(front, Math.cos(a) * .456, Math.sin(a) * .456, .326, detail, .012); }
  front.finish();
  // Distinct minute indicators and recessed status windows, rather than a glowing entire body.
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; shell.add(plate(.072, .016, .02, detail, .005), i === 3 ? mats.warmLight : mats.light, radialPoint(.532, a, .207), V(0, 0, a - Math.PI / 2)); }
  shell.finish();
  const assembly = new THREE.Group(); assembly.name = 'mechanical_xcore'; assembly.scale.setScalar(1.25);
  [...scene.children].forEach(child => assembly.add(child)); scene.add(assembly);
  return scene;
}

function robotArm(detail) {
  const scene = new THREE.Scene(); scene.name = 'FESTRONIX_ROBOTICS_MANIPULATOR';
  scene.userData = { author: 'FESTRONIX original modeled prototype', units: 'metres', up: '+Y', front: '+Z', source: 'tools/build-mechanical-assets.mjs', purpose: 'Generic articulated industrial robot visualization; not manufacturer CAD or a certified physical mechanism', detail };
  const base = new THREE.Group(); base.name = 'robot_base'; scene.add(base); const foundation = bucket(base, 'robot_base');
  foundation.add(cylinder(.48, .105, detail, detail === 'full' ? 56 : 32), mats.graphite, V(0, .065, 0), V(Math.PI / 2, 0, 0));
  foundation.add(annulus(.435, .274, .034, detail, .008), mats.titanium, V(0, .143, 0), V(Math.PI / 2, 0, 0));
  foundation.add(taperedCylinder(.27, .37, .33, detail, detail === 'full' ? 48 : 28), mats.graphite, V(0, .309, 0), V(-Math.PI / 2, 0, 0));
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU;
    foundation.add(cylinder(.034, .03, detail, 6), mats.titanium, V(Math.cos(a) * .39, .143, Math.sin(a) * .39), V(Math.PI / 2, 0, 0));
  }
  // Integrated plinth connector, cable gland and keyed cooling grille.
  foundation.add(plate(.24, .12, .046, detail, .015), mats.darkMetal, V(0, .28, .281));
  for (let i = 0; i < 7; i++) foundation.add(plate(.019, .05, .008, detail, .003), mats.gasket, V(-.09 + i * .03, .28, .308));
  foundation.add(tube([V(-.28, .31, -.16), V(-.49, .29, -.24), V(-.55, .095, -.47), V(-.73, .046, -.55)], .034, detail), mats.gasket);
  foundation.finish();

  const waist = new THREE.Group(); waist.name = 'robot_waist'; waist.position.y = .485;
  waist.userData = { role: 'waist swivel', axis: 'local +Y', rest: [0, 0, 0], maxOffset: .18 }; scene.add(waist); const turret = bucket(waist, 'robot_waist');
  turret.add(annulus(.305, .201, .055, detail), mats.copper, V(0, 0, 0), V(Math.PI / 2, 0, 0));
  turret.add(plate(.42, .27, .34, detail, .073), mats.graphite, V(0, .177, 0));
  turret.add(plate(.435, .24, .036, detail, .06), mats.ceramic, V(0, .178, .178));
  for (const x of [-.166, .166]) for (const y of [.098, .265]) screw(turret, x, y, .208, detail, .017);
  turret.add(plate(.095, .02, .012, detail, .004), mats.warmLight, V(0, .183, .203));
  turret.finish();

  function joint(parent, name, position, rotation, radius, role) {
    const group = new THREE.Group(); group.name = name; group.position.copy(position); group.rotation.z = rotation;
    group.userData = { role, axis: 'local +Z', restRotationZ: rotation, maxOffset: .16 }; parent.add(group); const body = bucket(group, name);
    body.add(cylinder(radius, .375, detail, detail === 'full' ? 48 : 28), mats.graphite);
    for (const z of [-.201, .201]) {
      body.add(annulus(radius * .96, radius * .73, .039, detail, .006), mats.titanium, V(0, 0, z));
      body.add(cylinder(radius * .728, .047, detail, detail === 'full' ? 36 : 20), mats.darkMetal, V(0, 0, z * 1.12));
      body.add(cylinder(radius * .55, .014, detail, 12), mats.graphite, V(0, 0, z * 1.27));
      if (z > 0) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; screw(body, Math.cos(a) * radius * .83, Math.sin(a) * radius * .83, z + .031, detail, .011); }
    }
    body.add(annulus(radius * .43, radius * .35, .006, detail, .001), mats.copper, V(0, 0, .266));
    body.finish(); return group;
  }
  function castLink(parent, prefix, length, lowerWidth, upperWidth, depth) {
    const s = new THREE.Shape(); const y0 = .14, y1 = length - .09;
    s.moveTo(-lowerWidth / 2 + .06, y0); s.quadraticCurveTo(-lowerWidth / 2, y0, -lowerWidth / 2, y0 + .11);
    s.lineTo(-upperWidth / 2, y1 - .12); s.quadraticCurveTo(-upperWidth / 2, y1, -upperWidth / 2 + .06, y1);
    s.lineTo(upperWidth / 2 - .06, y1); s.quadraticCurveTo(upperWidth / 2, y1, upperWidth / 2, y1 - .12);
    s.lineTo(lowerWidth / 2, y0 + .11); s.quadraticCurveTo(lowerWidth / 2, y0, lowerWidth / 2 - .06, y0); s.closePath();
    const parts = bucket(parent, prefix);
    parts.add(extrude(s, depth, detail, .018), mats.ceramic);
    // A real recessed service panel with bolt pattern and apertures; no bright toy finish.
    const coverH = length - .57;
    parts.add(plate(lowerWidth * .54, coverH, .026, detail, .039), mats.graphite, V(0, length * .49, depth / 2 + .014));
    const slots = [];
    for (let i = 0; i < 5; i++) slots.push(slotHole(lowerWidth * .34, .018, 0, -coverH * .28 + i * coverH * .14, .005));
    parts.add(plate(lowerWidth * .48, coverH * .73, .018, detail, .022, slots, .003), mats.titanium, V(0, length * .49, depth / 2 + .041));
    for (const x of [-lowerWidth * .21, lowerWidth * .21]) for (const y of [length * .25, length * .72]) screw(parts, x, y, depth / 2 + .061, detail, .012);
    parts.add(plate(.029, length - .45, .021, detail, .007), mats.copper, V(lowerWidth * .34, length * .48, depth / 2 + .021));
    const x = -lowerWidth * .66;
    parts.add(tube([V(x, .12, -.055), V(x - .05, .43, -.068), V(-upperWidth * .72, length - .38, -.088), V(-upperWidth * .57, length + .02, -.04)], .024, detail), mats.gasket);
    // Physical cable clips attach to the cast body at intervals.
    for (let i = 0; i < 4; i++) {
      const y = .25 + i * (length - .5) / 3; const clipX = THREE.MathUtils.lerp(x, -upperWidth * .63, i / 3);
      parts.add(plate(.064, .05, .073, detail, .015), mats.darkMetal, V(clipX, y, -.055));
    }
    parts.finish();
  }

  const shoulder = joint(waist, 'robot_shoulder', V(0, .28, 0), -.6, .25, 'primary shoulder actuator');
  castLink(shoulder, 'upper_arm_casting', 1.5, .46, .34, .29);
  const elbow = joint(shoulder, 'robot_elbow', V(0, 1.5, 0), 1.0, .206, 'elbow hinge actuator');
  castLink(elbow, 'forearm_casting', 1.24, .342, .248, .242);
  const wrist = joint(elbow, 'robot_wrist', V(0, 1.24, 0), -.3, .143, 'wrist pitch actuator');
  const coupler = bucket(wrist, 'wrist_coupling');
  coupler.add(cylinder(.105, .175, detail), mats.titanium, V(0, .176, 0), V(Math.PI / 2, 0, 0));
  coupler.add(annulus(.142, .077, .029, detail, .004), mats.darkMetal, V(0, .267, 0), V(Math.PI / 2, 0, 0));
  coupler.add(plate(.365, .177, .233, detail, .032), mats.graphite, V(0, .359, 0));
  coupler.add(plate(.282, .092, .012, detail, .019), mats.titanium, V(0, .36, .128));
  coupler.add(plate(.048, .014, .012, detail, .003), mats.light, V(0, .36, .144));
  for (const x of [-.113, .113]) screw(coupler, x, .36, .141, detail, .013);
  coupler.finish();
  const gripper = new THREE.Group(); gripper.name = 'robot_gripper'; wrist.add(gripper); gripper.userData = { role: 'parallel gripper assembly', axis: 'local X' };
  for (const side of [-1, 1]) {
    const jaw = new THREE.Group(); jaw.name = side < 0 ? 'gripper_left' : 'gripper_right'; jaw.position.set(side * .135, .448, 0); jaw.scale.x = side < 0 ? -1 : 1; jaw.userData = { role: 'parallel gripper jaw', axis: 'local X', direction: side, maxTravel: .044 }; gripper.add(jaw); const finger = bucket(jaw, jaw.name);
    const p = new THREE.Shape(); p.moveTo(-.047, 0); p.lineTo(.047, 0); p.lineTo(.041, .269); p.quadraticCurveTo(.041, .298, .01, .298); p.lineTo(-.064, .298); p.lineTo(-.064, .258); p.lineTo(-.035, .254); p.closePath();
    finger.add(extrude(p, .106, detail, .008), mats.titanium);
    finger.add(plate(.021, .116, .112, detail, .007), mats.gasket, V(-.038, .225, 0));
    for (const y of [.065, .145]) screw(finger, 0, y, .066, detail, .012);
    finger.finish();
  }
  for (const group of [shoulder, elbow, wrist]) consolidateDirectMeshes(group);
  const assembly = new THREE.Group(); assembly.name = 'mechanical_robot'; assembly.scale.setScalar(.9);
  [...scene.children].forEach(child => assembly.add(child)); scene.add(assembly);
  return scene;
}

const crcTable = Uint32Array.from({ length: 256 }, (_, n) => { let c = n; for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(buffer) { let c = 0xffffffff; for (const n of buffer) c = crcTable[(c ^ n) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function png(size, normal) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const seed = ((x * 7919 + y * 104729) ^ (x * y * 31)) >>> 0; const micro = (seed % 13 - 6) / 6; const at = y * (size * 4 + 1) + 1 + x * 4;
    if (normal) { raw[at] = 128 + Math.round(micro); raw[at + 1] = 128 + Math.round(Math.sin(y * 1.31) * 4 + micro); raw[at + 2] = 254; }
    else { raw[at] = 255; raw[at + 1] = 225 + Math.round(Math.sin(y * 1.31) * 12 + micro * 4); raw[at + 2] = 255; }
    raw[at + 3] = 255;
  }
  const chunk = (name, bytes) => { const out = Buffer.alloc(bytes.length + 12); out.writeUInt32BE(bytes.length, 0); out.write(name, 4); bytes.copy(out, 8); out.writeUInt32BE(crc32(out.subarray(4, out.length - 4)), out.length - 4); return out; };
  const header = Buffer.alloc(13); header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
// The exporter needs a browser canvas to encode DataTextures. Append our original
// deterministic PNG micro-surface maps directly to its standard GLB buffer instead.
function addSurfaceMaps(arrayBuffer, size) {
  const input = Buffer.from(arrayBuffer); const jsonLength = input.readUInt32LE(12); const json = JSON.parse(input.subarray(20, 20 + jsonLength).toString());
  const binaryOffset = 28 + jsonLength; const binaryLength = input.readUInt32LE(20 + jsonLength); const chunks = [input.subarray(binaryOffset, binaryOffset + binaryLength)]; let offset = binaryLength;
  json.images ??= []; json.textures ??= []; json.samplers ??= []; const sampler = json.samplers.length; json.samplers.push({ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 });
  const textures = [];
  for (const normal of [false, true]) {
    const pad = (4 - offset % 4) % 4; if (pad) { chunks.push(Buffer.alloc(pad)); offset += pad; }
    const image = png(size, normal); const view = json.bufferViews.length; json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: image.length }); chunks.push(image); offset += image.length;
    const index = json.images.length; json.images.push({ name: normal ? 'Original brushed normal' : 'Original metallic roughness', bufferView: view, mimeType: 'image/png' });
    textures.push(json.textures.length); json.textures.push({ name: normal ? 'Brushed normal detail' : 'Brushed metal roughness', source: index, sampler });
  }
  const textureInfo = index => ({ index, texCoord: 0, extensions: { KHR_texture_transform: { scale: [8, 8] } } });
  for (const material of json.materials) {
    if (material.pbrMetallicRoughness?.metallicFactor >= .45) {
      material.pbrMetallicRoughness.metallicRoughnessTexture = textureInfo(textures[0]);
      material.normalTexture = { ...textureInfo(textures[1]), scale: .3 };
    }
  }
  json.extensionsUsed ??= []; if (!json.extensionsUsed.includes('KHR_texture_transform')) json.extensionsUsed.push('KHR_texture_transform');
  const binPad = (4 - offset % 4) % 4; if (binPad) { chunks.push(Buffer.alloc(binPad)); offset += binPad; } json.buffers[0].byteLength = offset;
  const jsonBuffer = Buffer.from(JSON.stringify(json)); const jsonPad = (4 - jsonBuffer.length % 4) % 4; const paddedJson = Buffer.concat([jsonBuffer, Buffer.alloc(jsonPad, 32)]); const binary = Buffer.concat(chunks);
  const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + paddedJson.length + 8 + binary.length, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(paddedJson.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binary.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, paddedJson, binHeader, binary]);
}

async function save(scene, filename) {
  scene.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(scene); let triangles = 0, draws = 0; const nodes = [];
  scene.traverse(o => { if (o.name) nodes.push(o.name); if (o.isMesh) { draws++; triangles += (o.geometry.index?.count ?? o.geometry.getAttribute('position').count) / 3; } });
  const exported = await new GLTFExporter().parseAsync(scene, { binary: true, onlyVisible: true, maxTextureSize: 1024 });
  const data = addSurfaceMaps(exported, filename.includes('full') ? 256 : 128);
  await fs.writeFile(path.join(directory, filename), data);
  const gzip = gzipSync(data, { level: 9 }); await fs.writeFile(path.join(directory, filename + '.gz'), gzip);
  const manifest = { filename, bytes: data.byteLength, gzipBytes: gzip.byteLength, triangles, drawCalls: draws, bounds: { min: box.min.toArray(), max: box.max.toArray(), size: box.getSize(V(0, 0, 0)).toArray() }, nodes, materials: Object.values(mats).map(m => ({ name: m.name, metalness: m.metalness, roughness: m.roughness })), surfaceMaps: { type: 'original procedural brushed-metal metallic-roughness and normal PNGs', embedded: true, size: filename.includes('full') ? 256 : 128, normalStrength: .3 }, creator: 'FESTRONIX original modeled prototype', license: 'Project-authored asset; no external mesh or texture', source: 'tools/build-mechanical-assets.mjs' };
  await fs.writeFile(path.join(directory, filename.replace('.glb', '.json')), JSON.stringify(manifest, null, 2) + '\n');
  process.stdout.write(JSON.stringify(manifest) + '\n');
  scene.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
}

await save(xCore('full'), 'x-core-full.glb');
await save(xCore('reduced'), 'x-core-reduced.glb');
await save(robotArm('full'), 'robot-arm-full.glb');
await save(robotArm('reduced'), 'robot-arm-reduced.glb');
