"""Compose the two CC0 source meshes as a physical katana display, preserving scales."""
import copy
import gzip
import hashlib
import json
import math
import struct
from pathlib import Path

from prepare_polyhaven import inspect

ROOT = Path(__file__).resolve().parents[3]
CLUBS = ROOT / 'prototypes/festronix-visual/public/models/clubs'
TARGET = CLUBS / 'otaku_display'


def read_glb(path):
    data=path.read_bytes()
    size,kind=struct.unpack_from('<II',data,12)
    if kind!=0x4e4f534a:
        raise ValueError('Missing source JSON')
    document=json.loads(data[20:20+size])
    offset=20+size
    binary_size,binary_type=struct.unpack_from('<II',data,offset)
    if binary_type!=0x004e4942:
        raise ValueError('Missing source binary')
    return document,data[offset+8:offset+8+binary_size]


def positions(document,binary):
    output=[]
    for mesh in document['meshes']:
        for primitive in mesh['primitives']:
            accessor=document['accessors'][primitive['attributes']['POSITION']]
            view=document['bufferViews'][accessor['bufferView']]
            offset=view.get('byteOffset',0)+accessor.get('byteOffset',0)
            stride=view.get('byteStride',12)
            output.extend(struct.unpack_from('<fff',binary,offset+i*stride) for i in range(accessor['count']))
    return output


def blade_lower_edge(document,binary,y):
    """Intersect source triangles with the support plane; do not guess from sparse vertices."""
    lowest=math.inf
    for mesh in document['meshes']:
        for primitive in mesh['primitives']:
            pos=document['accessors'][primitive['attributes']['POSITION']]
            pos_view=document['bufferViews'][pos['bufferView']]
            pos_start=pos_view.get('byteOffset',0)+pos.get('byteOffset',0)
            points=[struct.unpack_from('<fff',binary,pos_start+i*pos_view.get('byteStride',12)) for i in range(pos['count'])]
            idx=document['accessors'][primitive['indices']]
            idx_view=document['bufferViews'][idx['bufferView']]
            idx_start=idx_view.get('byteOffset',0)+idx.get('byteOffset',0)
            fmt={5123:'H',5125:'I'}[idx['componentType']]
            stride=struct.calcsize(fmt)
            indices=[struct.unpack_from('<'+fmt,binary,idx_start+i*stride)[0] for i in range(idx['count'])]
            for i in range(0,len(indices),3):
                triangle=indices[i:i+3]
                for a,b in ((triangle[0],triangle[1]),(triangle[1],triangle[2]),(triangle[2],triangle[0])):
                    pa,pb=points[a],points[b]
                    if not min(pa[1],pb[1])<=y<=max(pa[1],pb[1]):continue
                    if abs(pb[1]-pa[1])<1e-9:
                        lowest=min(lowest,pa[0],pb[0])
                    else:
                        t=(y-pa[1])/(pb[1]-pa[1]);lowest=min(lowest,pa[0]+t*(pb[0]-pa[0]))
    if not math.isfinite(lowest):raise ValueError('Blade does not cross the source stand support')
    return lowest


def shift_texture_indices(value,offset):
    if isinstance(value,dict):
        for key,item in value.items():
            if key.endswith('Texture') and isinstance(item,dict) and 'index' in item:
                item['index']+=offset
            else:
                shift_texture_indices(item,offset)
    elif isinstance(value,list):
        for item in value:
            shift_texture_indices(item,offset)


def combine(tier):
    inputs=[]
    for asset in ('antique_katana_01','katana_stand_01'):
        document,binary=read_glb(CLUBS / asset / f'{asset}-{tier}.glb')
        inputs.append((asset,document,binary))
    sword_points=positions(inputs[0][1],inputs[0][2])
    stand_points=positions(inputs[1][1],inputs[1][2])
    # The blade rests in the upright notches. Preserve the original 1m katana
    # and .296m display stand; no relative scaling manufactures a false fit.
    fork_x=.102
    sword_z=.026828997823031386
    fork_surface=[]
    for sign in (-1,1):
        nearby=[point[1] for point in stand_points if abs(point[0]-sign*fork_x)<.007 and abs(point[2]-sword_z)<.008 and point[1]>.09]
        fork_surface.append(max(nearby))
    cradle_y=sum(fork_surface)/len(fork_surface)
    sword_x=.1948481649160385
    contact_edges=[]
    for sign in (-1,1):
        source_y=sword_x-sign*fork_x
        contact_edges.append(blade_lower_edge(inputs[0][1],inputs[0][2],source_y))
    sword_y=cradle_y-min(contact_edges)+.0008
    document={'asset':{'version':'2.0','generator':'FESTRONIX CC0 source composition'},'scene':0,'scenes':[{'name':'OTAKU sourced katana exhibit','nodes':[]}],
              'nodes':[],'meshes':[],'materials':[],'accessors':[],'bufferViews':[],'images':[],'textures':[],'samplers':[],
              'extensionsUsed':['EXT_texture_webp'],'extensionsRequired':['EXT_texture_webp']}
    binary=bytearray()
    source_roots=[]
    for asset,source,source_binary in inputs:
        while len(binary)%4:
            binary.append(0)
        byte_offset=len(binary)
        offsets={key:len(document[key]) for key in ('nodes','meshes','materials','accessors','bufferViews','images','textures','samplers')}
        prepared=copy.deepcopy(source)
        for view in prepared['bufferViews']:
            view['buffer']=0;view['byteOffset']=view.get('byteOffset',0)+byte_offset
        for accessor in prepared['accessors']:
            accessor['bufferView']+=offsets['bufferViews']
        for mesh in prepared['meshes']:
            for primitive in mesh['primitives']:
                primitive['attributes']={name:index+offsets['accessors'] for name,index in primitive['attributes'].items()}
                primitive['indices']+=offsets['accessors'];primitive['material']+=offsets['materials']
        for material in prepared['materials']:
            shift_texture_indices(material,offsets['textures'])
        for texture in prepared['textures']:
            if 'source' in texture: texture['source']+=offsets['images']
            if 'EXT_texture_webp' in texture.get('extensions',{}):texture['extensions']['EXT_texture_webp']['source']+=offsets['images']
            if 'sampler' in texture:texture['sampler']+=offsets['samplers']
        for image in prepared['images']:
            image['bufferView']+=offsets['bufferViews']
        for node in prepared['nodes']:
            if 'mesh' in node:node['mesh']+=offsets['meshes']
            if 'children' in node:node['children']=[index+offsets['nodes'] for index in node['children']]
        for key in offsets:
            document[key].extend(prepared.get(key,[]))
        roots=[index+offsets['nodes'] for index in source['scenes'][source.get('scene',0)]['nodes']]
        wrapper={'name':'katana_source_pose' if asset=='antique_katana_01' else 'stand_source_pose','children':roots}
        if asset=='antique_katana_01':
            wrapper['rotation']=[0,0,math.sin(math.pi/4),math.cos(math.pi/4)]
            wrapper['translation']=[sword_x,sword_y,sword_z]
        source_roots.append(len(document['nodes']));document['nodes'].append(wrapper)
        binary.extend(source_binary)
    root_index=len(document['nodes'])
    document['nodes'].append({'name':'otaku_display','children':source_roots})
    document['scenes'][0]['nodes']=[root_index]
    document['buffers']=[{'byteLength':len(binary)}]
    report=inspect(document)
    encoded=json.dumps(document,separators=(',',':')).encode();encoded+=b' '*(-len(encoded)%4)
    binary+=b'\0'*(-len(binary)%4)
    glb=struct.pack('<III',0x46546c67,2,12+8+len(encoded)+8+len(binary))
    glb+=struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(binary),0x004e4942)+binary
    compressed=gzip.compress(glb,compresslevel=9,mtime=0)
    TARGET.mkdir(parents=True,exist_ok=True)
    name=f'otaku-display-{tier}.glb'
    (TARGET / name).write_bytes(glb);(TARGET / (name+'.gz')).write_bytes(compressed)
    result={'filename':name,'bytes':len(glb),'gzipBytes':len(compressed),'sha256':hashlib.sha256(glb).hexdigest(),**report,
            'units':'Source metres preserved; +Y up, +Z front. Katana blade points -X, hilt points +X.',
            'composition':{'katanaRotationZ':math.pi/2,'katanaTranslation':[sword_x,sword_y,sword_z],'standTranslation':[0,0,0],
                           'forkX':fork_x,'estimatedCradleY':cradle_y,'sampledBladeLowerEdge':contact_edges,'contactClearanceMetres':.0008,'scabbardIncluded':False},
            'license':'CC0 1.0 Universal','sources':[{'asset':'Antique Katana 01','creator':'Tal Swicegood','url':'https://polyhaven.com/a/antique_katana_01'},
                                                  {'asset':'Katana Stand 01','creator':'Rico Cilliers','url':'https://polyhaven.com/a/katana_stand_01'}],
            'modifications':'Combined original meshes and embedded maps into one GLB; index remapping and source node exhibit poses only. No mesh/UV/material shape changes or relative scaling. Contact pose is authored for visual staging, not engineering simulation.'}
    (TARGET / (name.replace('.glb','.json'))).write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps({key:result[key] for key in ('filename','bytes','gzipBytes','triangles','bounds','composition')}))
    return result


if __name__=='__main__':
    reports={tier:combine(tier) for tier in ('full','reduced')}
    (TARGET / 'provenance.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
    source_dir=ROOT / 'assets/3d/sources/otaku_display';source_dir.mkdir(parents=True,exist_ok=True)
    (source_dir / 'composition.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
