"""Download MD5-verified CC0 Poly Haven sources and prepare self-contained GLBs.

Texture resolution/encoding and container packaging change. Ordinary models
retain source positions, normals, UVs, topology, material assignments and nodes.
Club books select four complete volumes and batch them by original material;
camera/projector diffuse RGBA restores the supplied alpha map. All changes are
recorded in provenance. Asset example renders are not downloaded or shipped.
"""
from __future__ import annotations

import argparse
import copy
import gzip
import hashlib
import io
import json
import math
import struct
import time
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCES = ROOT / 'assets/3d/sources'
DEST = ROOT / 'prototypes/festronix-visual/public/models/world'
ASSETS = ('industrial_microscope', 'gamepad', 'drill_press_01', 'security_camera_01',
          'classic_laptop', 'book_encyclopedia_set_01', 'vintage_video_camera',
          'antique_katana_01', 'katana_stand_01', 'filmstrip_projector_8mm')


def get(url: str) -> bytes:
    for attempt in range(4):
        try:
            request = Request(url, headers={'User-Agent': 'FESTRONIX-licensed-asset-preparation/1.0'})
            with urlopen(request, timeout=60) as response:
                return response.read()
        except Exception:
            if attempt == 3:
                raise
            time.sleep(attempt + 1)
    raise RuntimeError(url)


def source_file(entry: dict, path: Path) -> bytes:
    if path.exists():
        data = path.read_bytes()
        if hashlib.md5(data).hexdigest() == entry['md5']:
            return data
    data = get(entry['url'])
    actual = hashlib.md5(data).hexdigest()
    if actual != entry['md5']:
        raise ValueError(f"Source checksum mismatch: {entry['url']} ({actual})")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return data


def mat_mul(a, b):
    return [[sum(a[row][k] * b[k][col] for k in range(4)) for col in range(4)] for row in range(4)]


def node_matrix(node):
    if 'matrix' in node:
        return [[node['matrix'][col * 4 + row] for col in range(4)] for row in range(4)]
    x, y, z, w = node.get('rotation', [0, 0, 0, 1])
    sx, sy, sz = node.get('scale', [1, 1, 1])
    tx, ty, tz = node.get('translation', [0, 0, 0])
    return [
        [(1-2*(y*y+z*z))*sx, (2*(x*y-z*w))*sy, (2*(x*z+y*w))*sz, tx],
        [(2*(x*y+z*w))*sx, (1-2*(x*x+z*z))*sy, (2*(y*z-x*w))*sz, ty],
        [(2*(x*z-y*w))*sx, (2*(y*z+x*w))*sy, (1-2*(x*x+y*y))*sz, tz],
        [0, 0, 0, 1],
    ]


def inspect(gltf):
    lo, hi = [math.inf]*3, [-math.inf]*3
    identity = [[1 if r == c else 0 for c in range(4)] for r in range(4)]
    def visit(index, parent):
        node = gltf['nodes'][index]
        matrix = mat_mul(parent, node_matrix(node))
        if 'mesh' in node:
            for primitive in gltf['meshes'][node['mesh']]['primitives']:
                accessor = gltf['accessors'][primitive['attributes']['POSITION']]
                for x in (accessor['min'][0], accessor['max'][0]):
                    for y in (accessor['min'][1], accessor['max'][1]):
                        for z in (accessor['min'][2], accessor['max'][2]):
                            point = [sum(matrix[r][c] * [x,y,z,1][c] for c in range(4)) for r in range(3)]
                            for axis in range(3):
                                lo[axis] = min(lo[axis], point[axis])
                                hi[axis] = max(hi[axis], point[axis])
        for child in node.get('children', []):
            visit(child, matrix)
    for node in gltf['scenes'][gltf.get('scene', 0)]['nodes']:
        visit(node, identity)
    tris = 0
    for mesh in gltf['meshes']:
        for primitive in mesh['primitives']:
            if primitive.get('mode', 4) != 4:
                raise ValueError('Preparation expects source triangle primitives')
            tris += gltf['accessors'][primitive.get('indices', primitive['attributes']['POSITION'])]['count'] // 3
    return {
        'triangles': tris,
        'meshes': [mesh.get('name', f'mesh_{i}') for i, mesh in enumerate(gltf['meshes'])],
        'nodes': [{'name': n.get('name', f'node_{i}'), 'mesh': n.get('mesh'), 'children': n.get('children', [])} for i,n in enumerate(gltf['nodes'])],
        'materials': [{'name': m.get('name'), 'alphaMode': m.get('alphaMode','OPAQUE'), 'doubleSided': m.get('doubleSided',False)} for m in gltf.get('materials', [])],
        'animationClips': [a.get('name', f'animation_{i}') for i,a in enumerate(gltf.get('animations', []))],
        'bounds': {'min': lo, 'max': hi, 'dimensions': [b-a for a,b in zip(lo,hi)], 'center': [(a+b)/2 for a,b in zip(lo,hi)]},
        'units': 'Source glTF metres, +Y up; source transforms preserved',
    }


def four_source_books(source, binary):
    """Keep complete sourced volumes and batch their stationary surface materials."""
    groups = {}
    selected = source['scenes'][source.get('scene',0)]['nodes'][:4]
    def values(index):
        accessor = source['accessors'][index]
        view = source['bufferViews'][accessor['bufferView']]
        width = {'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[accessor['type']]
        fmt = {5126:'f',5123:'H',5125:'I'}[accessor['componentType']]
        start = view.get('byteOffset',0) + accessor.get('byteOffset',0)
        stride = view.get('byteStride',struct.calcsize(fmt)*width)
        return [struct.unpack_from('<'+fmt*width,binary,start+i*stride) for i in range(accessor['count'])]
    for node_index in selected:
        node = source['nodes'][node_index]
        matrix = node_matrix(node)
        for primitive in source['meshes'][node['mesh']]['primitives']:
            group = groups.setdefault(primitive['material'], {'POSITION':[], 'NORMAL':[], 'TEXCOORD_0':[], 'indices':[]})
            base = len(group['POSITION'])
            for point in values(primitive['attributes']['POSITION']):
                group['POSITION'].append(tuple(sum(matrix[r][c]*[*point,1][c] for c in range(4)) for r in range(3)))
            for normal in values(primitive['attributes']['NORMAL']):
                group['NORMAL'].append(tuple(sum(matrix[r][c]*normal[c] for c in range(3)) for r in range(3)))
            group['TEXCOORD_0'].extend(values(primitive['attributes']['TEXCOORD_0']))
            group['indices'].extend(base+value[0] for value in values(primitive['indices']))
    document = copy.deepcopy(source)
    document['accessors'],document['bufferViews'] = [],[]
    output = bytearray()
    def append(entries, fmt, kind):
        while len(output)%4:
            output.append(0)
        view_index = len(document['bufferViews'])
        data = b''.join(struct.pack('<'+fmt*len(entry),*entry) for entry in entries)
        document['bufferViews'].append({'buffer':0,'byteOffset':len(output),'byteLength':len(data),'target':34963 if kind=='SCALAR' else 34962})
        output.extend(data)
        accessor = {'bufferView':view_index,'componentType':5126 if fmt=='f' else 5125 if fmt=='I' else 5123,'count':len(entries),'type':kind}
        if kind=='VEC3':
            accessor['min'] = [min(e[a] for e in entries) for a in range(3)]
            accessor['max'] = [max(e[a] for e in entries) for a in range(3)]
        index = len(document['accessors']); document['accessors'].append(accessor)
        return index
    primitives=[]
    for material, group in groups.items():
        attributes = {name:append(group[name],'f','VEC2' if name=='TEXCOORD_0' else 'VEC3') for name in ('POSITION','NORMAL','TEXCOORD_0')}
        index_fmt = 'I' if len(group['POSITION'])>65535 else 'H'
        index = append([(value,) for value in group['indices']], index_fmt, 'SCALAR')
        primitives.append({'attributes':attributes,'indices':index,'material':material})
    document['meshes'] = [{'name':'four_sourced_encyclopedia_volumes','primitives':primitives}]
    document['nodes'] = [{'name':'literature_book_stack','mesh':0}]
    document['scenes'] = [{'name':'Four sourced encyclopedia volumes','nodes':[0]}]
    document['scene'] = 0
    document['buffers'] = [{'byteLength':len(output)}]
    return document,bytes(output),[source['nodes'][index]['name'] for index in selected]


def prepare(asset: str, source_only: bool):
    directory = SOURCES / asset
    directory.mkdir(parents=True, exist_ok=True)
    info_bytes = get(f'https://api.polyhaven.com/info/{asset}')
    files_bytes = get(f'https://api.polyhaven.com/files/{asset}')
    (directory / 'source-info.json').write_bytes(info_bytes)
    (directory / 'source-files.json').write_bytes(files_bytes)
    info, files = json.loads(info_bytes), json.loads(files_bytes)
    entry = files['gltf']['1k']['gltf']
    gltf_bytes = source_file(entry, directory / f'{asset}_1k.gltf')
    evidence = [{'path': f'{asset}_1k.gltf', 'url': entry['url'], 'md5': entry['md5'], 'bytes': len(gltf_bytes)}]
    for relative, dependency in entry.get('include', {}).items():
        data = source_file(dependency, directory / relative)
        evidence.append({'path': relative, 'url': dependency['url'], 'md5': dependency['md5'], 'bytes': len(data)})
    gltf = json.loads(gltf_bytes)
    alpha_path = None
    if asset in ('vintage_video_camera','filmstrip_projector_8mm') and any(m.get('alphaMode')=='BLEND' for m in gltf.get('materials',[])):
        alpha_entry = files['Alpha']['1k']['png']
        alpha_path = directory / 'textures' / f'{asset}_alpha_1k.png'
        alpha_bytes = source_file(alpha_entry,alpha_path)
        evidence.append({'path':str(alpha_path.relative_to(directory)), 'url':alpha_entry['url'],'md5':alpha_entry['md5'],'bytes':len(alpha_bytes)})
    source_binary = (directory / gltf['buffers'][0]['uri']).read_bytes()
    selected_books = []
    if asset=='book_encyclopedia_set_01' and not source_only:
        gltf,source_binary,selected_books = four_source_books(gltf,source_binary)
    report = inspect(gltf)
    report.update({
        'asset': asset,
        'name': info['name'],
        'authors': info['authors'],
        'sourceUrl': f'https://polyhaven.com/a/{asset}',
        'license': 'CC0 1.0 Universal',
        'licenseUrl': 'https://polyhaven.com/license',
        'sourceFiles': evidence,
        'modifications': 'Only WebP texture encoding/resolution and glTF-to-GLB container repack; geometry/materials/nodes unchanged.',
        'tiers': {},
    })
    if selected_books:
        report['modifications'] = 'Retained complete first four source encyclopedia volumes; baked their source node translations and batched stationary geometry into original cover/paper material groups. Retained original triangles, normals and UVs for those volumes. Embedded FULL1024/REDUCED512 WebP source maps.'
        report['selectedSourceNodes'] = selected_books
        report['sourceSetTriangles'] = info['polycount']
        report['preparedGeometryBytes'] = len(source_binary)
        report['preparedGeometrySha256'] = hashlib.sha256(source_binary).hexdigest()
    if alpha_path:
        report['modifications'] += ' Restored original supplied alpha to diffuse RGBA, omitted by provider JPEG-only glTF export; OPAQUE material ignores alpha, BLEND material uses it.'
    if not source_only:
        target = DEST / asset
        target.mkdir(parents=True, exist_ok=True)
        for tier, resolution, quality in [('full',1024,88), ('reduced',512,80)]:
            document = copy.deepcopy(gltf)
            if len(document['buffers']) != 1:
                raise ValueError('Expected one source geometry buffer')
            binary = bytearray(source_binary)
            texture_bytes = 0
            embedded_images = {}
            for image in document.get('images', []):
                image_uri = image.pop('uri')
                source_path = directory / image_uri
                with Image.open(source_path) as decoded:
                    if alpha_path and '_diff_' in image_uri:
                        decoded = decoded.convert('RGBA')
                        with Image.open(alpha_path) as alpha:
                            decoded.putalpha(alpha.convert('L').resize(decoded.size,Image.Resampling.LANCZOS))
                    decoded.thumbnail((resolution,resolution), Image.Resampling.LANCZOS)
                    output = io.BytesIO()
                    decoded.save(output, format='WEBP', quality=quality, method=6)
                data = output.getvalue()
                digest = hashlib.sha256(data).hexdigest()
                if digest in embedded_images:
                    view_index = embedded_images[digest]
                else:
                    texture_bytes += len(data)
                    while len(binary) % 4:
                        binary.append(0)
                    view_index = len(document['bufferViews'])
                    embedded_images[digest] = view_index
                    document['bufferViews'].append({'buffer':0, 'byteOffset':len(binary), 'byteLength':len(data)})
                    binary.extend(data)
                image.update({'bufferView':view_index, 'mimeType':'image/webp'})
            for texture in document.get('textures', []):
                source = texture.pop('source')
                texture.setdefault('extensions', {})['EXT_texture_webp'] = {'source':source}
            for key in ('extensionsUsed','extensionsRequired'):
                document[key] = sorted(set(document.get(key, []) + ['EXT_texture_webp']))
            document['buffers'] = [{'byteLength':len(binary)}]
            document.setdefault('asset', {})['extras'] = {'source': report['sourceUrl'], 'license':'CC0 1.0', 'preparedFor':'FESTRONIX'}
            encoded = json.dumps(document,separators=(',', ':')).encode()
            encoded += b' ' * (-len(encoded) % 4)
            binary += b'\0' * (-len(binary) % 4)
            glb = struct.pack('<III', 0x46546c67, 2, 12 + 8 + len(encoded) + 8 + len(binary))
            glb += struct.pack('<II',len(encoded),0x4e4f534a) + encoded
            glb += struct.pack('<II',len(binary),0x004e4942) + binary
            name = f'{asset}-{tier}.glb'
            compressed = gzip.compress(glb, compresslevel=9, mtime=0)
            (target / name).write_bytes(glb)
            (target / (name + '.gz')).write_bytes(compressed)
            report['tiers'][tier] = {'path':f'/models/{DEST.name}/{asset}/{name}', 'textureSize':resolution, 'glbBytes':len(glb), 'gzipBytes':len(compressed), 'textureBytes':texture_bytes, 'sha256':hashlib.sha256(glb).hexdigest()}
        (target / 'provenance.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    (directory / 'inspection.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps({k:report[k] for k in ('asset','triangles','meshes','bounds','tiers','materials','animationClips')}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('assets', nargs='*', default=['industrial_microscope', 'gamepad', 'drill_press_01'])
    parser.add_argument('--source-only', action='store_true')
    parser.add_argument('--collection', choices=['world', 'clubs'], default='world')
    args = parser.parse_args()
    DEST = ROOT / f'prototypes/festronix-visual/public/models/{args.collection}'
    for asset in args.assets:
        if asset not in ASSETS:
            raise ValueError('Use a reviewed asset ID')
        prepare(asset, args.source_only)
