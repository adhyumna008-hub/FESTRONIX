"""Read-only inspection of candidate topology; does not modify source geometry."""
import json, struct
from pathlib import Path

root = Path(__file__).parent
gltf = json.loads((root / 'circuit_board_1k.gltf').read_text())
data = (root / 'circuit_board.bin').read_bytes()

def values(index):
    accessor = gltf['accessors'][index]
    view = gltf['bufferViews'][accessor['bufferView']]
    size = {'VEC3': 3, 'VEC2': 2, 'SCALAR': 1}[accessor['type']]
    fmt = {5126: 'f', 5123: 'H'}[accessor['componentType']]
    return list(struct.iter_unpack('<' + fmt * size, data[view.get('byteOffset',0) + accessor.get('byteOffset',0):view.get('byteOffset',0) + accessor.get('byteOffset',0) + accessor['count'] * size * struct.calcsize(fmt)]))

for primitive in gltf['meshes'][0]['primitives']:
    positions = values(primitive['attributes']['POSITION'])
    indices = [i[0] for i in values(primitive['indices'])]
    parent = list(range(len(positions)))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i
    def union(a,b):
        parent[find(a)] = find(b)
    shared = {}
    for i,p in enumerate(positions):
        key = tuple(round(v,6) for v in p)
        if key in shared: union(i,shared[key])
        else: shared[key] = i
    for i in range(0,len(indices),3):
        a,b,c = indices[i:i+3]
        union(a,b); union(b,c)
    parts = {}
    for i in range(0,len(indices),3):
        part = parts.setdefault(find(indices[i]),{'triangles':0,'vertices':set()})
        part['triangles'] += 1
        part['vertices'].update(indices[i:i+3])
    report = []
    for part in parts.values():
        points = [positions[i] for i in part['vertices']]
        report.append({'triangles':part['triangles'],'min':[round(min(p[a] for p in points),5) for a in range(3)],'max':[round(max(p[a] for p in points),5) for a in range(3)]})
    print(json.dumps({'material':primitive['material'],'islands':len(report),'parts':sorted(report,key=lambda p:p['triangles'],reverse=True)[:30]},indent=2))
