"""Prepare the CC0 source for the prototype without remodelling its surface.

Preserves every source triangle, UV and normal. Loose geometry islands are
assigned to visual component groups, merged per source material, and exported
with the source's separate alpha map (missing from its JPEG-only glTF export).
"""
import gzip, json, struct
from collections import defaultdict
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent
DEST = ROOT.parents[3] / 'prototypes/festronix-visual/public/models/circuit-board'
DEST.mkdir(parents=True, exist_ok=True)
source = json.loads((ROOT / 'circuit_board_1k.gltf').read_text())
source_bin = (ROOT / 'circuit_board.bin').read_bytes()

def read(index):
    acc = source['accessors'][index]
    view = source['bufferViews'][acc['bufferView']]
    n = {'VEC3':3,'VEC2':2,'SCALAR':1}[acc['type']]
    fmt = {5126:'f',5123:'H'}[acc['componentType']]
    start = view.get('byteOffset',0) + acc.get('byteOffset',0)
    return list(struct.iter_unpack('<'+fmt*n,source_bin[start:start+acc['count']*n*struct.calcsize(fmt)]))

def component(lo,hi):
    x,y,z = [(a+b)/2 for a,b in zip(lo,hi)]
    dx,dy,dz = [b-a for a,b in zip(lo,hi)]
    # Classify entire connected islands, never slice through a component.
    if dx>.3 or dz>.3: return 'pcb'
    if -.111<lo[0] and hi[0]<-.021 and -.140<lo[2] and hi[2]<-.044 and lo[1]>.043:
        return 'rotor'
    if -.136 < x < .004 and -.161 < z < -.022 and hi[1]>.006:
        return 'cooler'
    if .075<x<.165 and -.182<z<.022 and hi[1]>.019:
        return 'memory'
    if x<-.17 and z<.026: return 'io'
    if max(dx,dz)<.025 and dy>.011: return 'capacitors'
    if z>.055 and max(dx,dz)>.035: return 'slots'
    if z>.043 and y>.002 and max(dx,dz)>.016: return 'chips'
    return 'pcb'

groups = defaultdict(list)
for primitive in source['meshes'][0]['primitives']:
    attrs = {name:read(idx) for name,idx in primitive['attributes'].items()}
    positions=attrs['POSITION']
    indices=[v[0] for v in read(primitive['indices'])]
    parent=list(range(len(positions)))
    def find(i):
        while parent[i]!=i:
            parent[i]=parent[parent[i]]; i=parent[i]
        return i
    def union(a,b): parent[find(a)]=find(b)
    shared={}
    for i,p in enumerate(positions):
        key=tuple(round(v,6) for v in p)
        if key in shared: union(i,shared[key])
        else: shared[key]=i
    for i in range(0,len(indices),3):
        a,b,c=indices[i:i+3]; union(a,b); union(b,c)
    islands=defaultdict(list)
    for i in range(0,len(indices),3): islands[find(indices[i])].extend(indices[i:i+3])
    grouped_indices=defaultdict(list)
    for island in islands.values():
        pts=[positions[i] for i in set(island)]
        lo=[min(p[a] for p in pts) for a in range(3)]
        hi=[max(p[a] for p in pts) for a in range(3)]
        grouped_indices[component(lo,hi)].extend(island)
    for name, part_indices in grouped_indices.items():
        used=list(dict.fromkeys(part_indices)); mapping={v:i for i,v in enumerate(used)}
        groups[name].append((primitive['material'],{key:[values[i] for i in used] for key,values in attrs.items()},[mapping[i] for i in part_indices]))

binary=bytearray(); views=[]; accessors=[]; meshes=[]; nodes=[]
def append(values,kind,ctype,target):
    while len(binary)%4: binary.append(0)
    offset=len(binary); fmt={5126:'f',5123:'H'}[ctype]
    for value in values: binary.extend(struct.pack('<'+fmt*len(value),*value))
    views.append({'buffer':0,'byteOffset':offset,'byteLength':len(binary)-offset,'target':target})
    acc={'bufferView':len(views)-1,'componentType':ctype,'count':len(values),'type':kind}
    if kind=='VEC3' and target==34962:
        acc['min']=[min(v[a] for v in values) for a in range(3)]
        acc['max']=[max(v[a] for v in values) for a in range(3)]
    accessors.append(acc)
    return len(accessors)-1

rotor_pivot=(-.065935,.057085,-.09170)
for name in ['pcb','cooler','memory','io','chips','slots','capacitors','rotor']:
    primitives=[]
    for material,attrs,indices in groups[name]:
        if name=='rotor':
            attrs={**attrs,'POSITION':[tuple(p[a]-rotor_pivot[a] for a in range(3)) for p in attrs['POSITION']]}
        attr_ids={key:append(vals,'VEC2' if key=='TEXCOORD_0' else 'VEC3',5126,34962) for key,vals in attrs.items()}
        primitives.append({'attributes':attr_ids,'indices':append([(i,) for i in indices],'SCALAR',5123,34963),'material':material})
    nodes.append({'name':name,'mesh':len(meshes)})
    if name=='rotor': nodes[-1]['translation']=list(rotor_pivot)
    meshes.append({'name':name,'primitives':primitives})
nodes[1]['children']=[7]

materials=[{'name':'Source board surface','doubleSided':True,'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicRoughnessTexture':{'index':2}},'normalTexture':{'index':1},'occlusionTexture':{'index':2}},
           {'name':'Source cutout details','doubleSided':True,'alphaMode':'MASK','alphaCutoff':.45,'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicRoughnessTexture':{'index':2}},'normalTexture':{'index':1},'occlusionTexture':{'index':2}}]
diff=Image.open(ROOT/'diff.jpg').convert('RGB')
normal=Image.open(ROOT/'normal.jpg').convert('RGB')
arm=Image.open(ROOT/'arm.jpg').convert('RGB')
alpha=Image.open(ROOT/'alpha.png').convert('L')
report={'source':'https://polyhaven.com/a/circuit_board','creator':'Benny Weimer','license':'CC0','triangles':sum(len(indices)//3 for parts in groups.values() for _,_,indices in parts),'groups':{},'tiers':{}}
for name,parts in groups.items():
    points=[p for _,attrs,_ in parts for p in attrs['POSITION']]
    report['groups'][name]={'triangles':sum(len(indices)//3 for _,_,indices in parts),'min':[min(p[a] for p in points) for a in range(3)],'max':[max(p[a] for p in points) for a in range(3)]}

for tier,size,quality in [('full',1536,82),('reduced',768,76)]:
    paths=[]
    for name,img in [('surface',diff),('normal',normal),('arm',arm)]:
        image=img.resize((size,size),Image.Resampling.LANCZOS)
        if name=='surface':
            image=image.convert('RGBA'); image.putalpha(alpha.resize((size,size),Image.Resampling.LANCZOS))
        filename=f'{name}-{tier}.webp'
        image.save(DEST/filename,'WEBP',quality=quality if name=='surface' else (85 if tier=='full' else 76),method=6,exact=True)
        paths.append(filename)
    gltf={'asset':{'version':'2.0','generator':'FESTRONIX source-preserving component export','copyright':'Circuit Board by Benny Weimer / Poly Haven, CC0'},'scene':0,'scenes':[{'nodes':list(range(7))}],'nodes':nodes,'meshes':meshes,'materials':materials,'images':[{'uri':p} for p in paths],'textures':[{'source':i} for i in range(3)],'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':accessors,'extras':{'source':report['source'],'componentGrouping':'Loose-island visual disassembly; not a manufacturer engineering teardown'}}
    jsonbytes=json.dumps(gltf,separators=(',',':')).encode()
    jsonbytes+=b' ' *((-len(jsonbytes))%4)
    binbytes=bytes(binary)+b'\x00' *((-len(binary))%4)
    glb=struct.pack('<III',0x46546c67,2,12+8+len(jsonbytes)+8+len(binbytes))+struct.pack('<II',len(jsonbytes),0x4e4f534a)+jsonbytes+struct.pack('<II',len(binbytes),0x004e4942)+binbytes
    filename=f'board-{tier}.glb.gz'
    (DEST/filename).write_bytes(gzip.compress(glb,compresslevel=9,mtime=0))
    report['tiers'][tier]={'geometryBytes':(DEST/filename).stat().st_size,'textures':{p:(DEST/p).stat().st_size for p in paths},'totalBytes':(DEST/filename).stat().st_size+sum((DEST/p).stat().st_size for p in paths),'resolution':size}
if (DEST/'poster.webp').exists():
    report['poster']={'method':'Local browser capture of the licensed model with our scene lighting; not a source preview render','dimensions':list(Image.open(DEST/'poster.webp').size),'bytes':(DEST/'poster.webp').stat().st_size,'phoneBytes':(DEST/'poster-small.webp').stat().st_size}
(DEST/'provenance.json').write_text(json.dumps(report,indent=2))
(ROOT/'prepared-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
