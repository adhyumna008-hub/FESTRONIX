"""Inspect authored containers and compare prepared geometry with reviewed sources."""
import json
import struct
import argparse
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TARGET = ROOT / 'prototypes/festronix-visual/public/models/world'


def inspect(asset, tier, collection='world'):
    target = ROOT / f'prototypes/festronix-visual/public/models/{collection}'
    filename = target / asset / f'{"otaku-display" if asset=="otaku_display" else asset}-{tier}.glb'
    data = filename.read_bytes()
    magic, version, size = struct.unpack_from('<III', data)
    if magic != 0x46546c67 or version != 2 or size != len(data):
        raise ValueError(f'Invalid GLB header: {filename}')
    json_size, json_type = struct.unpack_from('<II', data, 12)
    if json_type != 0x4e4f534a:
        raise ValueError('Missing JSON chunk')
    gltf = json.loads(data[20:20 + json_size])
    offset = 20 + json_size
    bin_size, bin_type = struct.unpack_from('<II', data, offset)
    if bin_type != 0x004e4942:
        raise ValueError('Missing binary chunk')
    binary = data[offset + 8:offset + 8 + bin_size]
    for view in gltf['bufferViews']:
        if view.get('buffer',0) != 0 or view.get('byteOffset',0) + view['byteLength'] > gltf['buffers'][0]['byteLength']:
            raise ValueError('Buffer view outside binary data')
    source_dir = ROOT / 'assets/3d/sources' / asset
    provenance = json.loads((target / asset / 'provenance.json').read_text(encoding='utf-8'))
    if asset=='otaku_display':
        cursor=0
        for original in ('antique_katana_01','katana_stand_01'):
            original_data=(target / original / f'{original}-{tier}.glb').read_bytes()
            original_json_size=struct.unpack_from('<I',original_data,12)[0]
            original_offset=20+original_json_size
            original_bin_size=struct.unpack_from('<I',original_data,original_offset)[0]
            original_binary=original_data[original_offset+8:original_offset+8+original_bin_size]
            cursor+=(4-cursor%4)%4
            if binary[cursor:cursor+original_bin_size]!=original_binary:
                raise ValueError('Combined original source buffers changed')
            cursor+=original_bin_size
        if len(gltf['meshes'])!=2 or sum(len(mesh['primitives']) for mesh in gltf['meshes'])!=2:
            raise ValueError('Katana/source stand shape contract changed')
    else:
        source = json.loads((source_dir / f'{asset}_1k.gltf').read_text(encoding='utf-8'))
        source_binary = (source_dir / source['buffers'][0]['uri']).read_bytes()
    if asset=='otaku_display':
        pass
    elif 'selectedSourceNodes' in provenance:
        prepared_geometry = binary[:provenance['preparedGeometryBytes']]
        if hashlib.sha256(prepared_geometry).hexdigest() != provenance['preparedGeometrySha256']:
            raise ValueError('Prepared retained-book geometry changed')
        if len(gltf['meshes'])!=1 or len(gltf['meshes'][0]['primitives'])!=2:
            raise ValueError('Book batching contract changed')
    else:
        if binary[:len(source_binary)] != source_binary:
            raise ValueError('Prepared geometry differs from source')
        for key in ('meshes', 'nodes', 'accessors'):
            if json.dumps(source[key], sort_keys=True) != json.dumps(gltf[key], sort_keys=True):
                raise ValueError(f'Source {key} changed')
    for image in gltf['images']:
        if 'uri' in image or image['mimeType'] != 'image/webp':
            raise ValueError('Runtime image is not embedded WebP')
        view = gltf['bufferViews'][image['bufferView']]
        encoded = binary[view['byteOffset']:view['byteOffset'] + view['byteLength']]
        if encoded[:4] != b'RIFF' or encoded[8:12] != b'WEBP':
            raise ValueError('Invalid embedded WebP signature')
    return {'asset':asset, 'tier':tier, 'bytes':len(data), 'geometryVerified':True, 'retainedBooksBatched':'selectedSourceNodes' in provenance, 'allMapsEmbedded':True}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('assets',nargs='*',default=['industrial_microscope','gamepad','drill_press_01'])
    parser.add_argument('--collection',choices=['world','clubs'],default='world')
    args=parser.parse_args()
    for asset in args.assets:
        for tier in ('full','reduced'):
            print(json.dumps(inspect(asset,tier,args.collection)))
