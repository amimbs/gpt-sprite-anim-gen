import bpy
import bmesh
import os
import statistics
from mathutils import Vector
from PIL import Image

# ────────── CONFIG (edit here only) ───────────────────
PNG_COLOR = "front.png"
PNG_DEPTH = "front_depth.png"

SAMPLE = 50          # 40-60 keeps voxel count tiny
VOXEL = 0.20        # size of ONE cube (BU). 0.2 BU ≈ 20 cm
MAX_Z = 12          # layers of depth  (<= 24 fine)
DEPTH_EXP = 0.7         # 0.3-0.8 exaggerates depth
COLL_NAME = "wizard_depth"
# ──────────────────────────────────────────────────────

# derive BASE so cubes butt up even with big SAMPLE
BASE = VOXEL / SAMPLE          # BU per sprite pixel

# ────────── start diagnostics ─────────────────────────
cwd = bpy.path.abspath("//")
pc, pd = os.path.join(cwd, PNG_COLOR), os.path.join(cwd, PNG_DEPTH)
print(f"\n── voxel-wiz (low-fidelity) ─────────────────────")
print(f"Colour  : {pc}")
print(f"Depth   : {pd}")
print(f"SAMPLE  : {SAMPLE}   VOXEL : {VOXEL} BU")
print(f"BASE    : {BASE:.4f} BU/pixel   MAX_Z : {MAX_Z}")
# ------------------------------------------------------

if not (os.path.isfile(pc) and os.path.isfile(pd)):
    raise FileNotFoundError("PNG paths incorrect.")

# fresh collection
if COLL_NAME in bpy.data.collections:
    for o in bpy.data.collections[COLL_NAME].objects:
        bpy.data.objects.remove(o, do_unlink=True)
else:
    bpy.data.collections.new(COLL_NAME)
if COLL_NAME not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(
        bpy.data.collections[COLL_NAME]
    )
col = bpy.data.collections[COLL_NAME]
col.hide_viewport = col.hide_render = False

# master cube
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=VOXEL)
mesh_master = bpy.data.meshes.new("vox")
bm.to_mesh(mesh_master)
bm.free()
master = bpy.data.objects.new("vox_master", mesh_master)
master.hide_viewport = True
bpy.context.scene.collection.objects.link(master)

# load PNGs
img_c = Image.open(pc).convert("RGBA")
img_d = Image.open(pd).convert("L").resize(img_c.size)
w, h = img_c.size
print(f"Sprite  : {w} × {h} px")

# depth stats
vals = list(img_d.getdata())
min_d, max_d = min(vals), max(vals)
print(f"Depth gs: {min_d} – {max_d}")


def mcol(rgb):
    key = f"m_{rgb}"
    if key not in bpy.data.materials:
        m = bpy.data.materials.new(key)
        m.use_nodes = True
        m.node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (
            *[c/255 for c in rgb], 1)
    return bpy.data.materials[key]


half_y = (MAX_Z-1)*VOXEL*0.5
placed, opaque = 0, 0
layer_log = []

for py in range(0, h, SAMPLE):
    for px in range(0, w, SAMPLE):
        r, g, b, a = img_c.getpixel((px, py))
        if a < 25:           # skip transparent
            continue
        opaque += 1
        shade = img_d.getpixel((px, py))
        t = ((shade-min_d) / (max_d-min_d+1e-8)) ** DEPTH_EXP
        layers = max(1, round(t*MAX_Z))
        layer_log.append(layers)

        for k in range(layers):
            inst = master.copy()
            inst.data = master.data.copy()
            inst.hide_viewport = False
            inst.hide_render = False
            inst.location = Vector((
                (px-w/2)*BASE,
                -half_y + k*VOXEL,
                -(py-h/2)*BASE
            ))
            inst.data.materials.clear()
            inst.data.materials.append(mcol((r, g, b)))
            col.objects.link(inst)
            placed += 1

print(f"Opaque pixels : {opaque}")
print(f"Voxels placed : {placed}")
if placed:
    print(f"Layers        : min={min(layer_log)} max={max(layer_log)} "
          f"median={statistics.median(layer_log):.1f}")
else:
    print("‼  ZERO voxels — check alpha or SAMPLE value")
print("Done ─ framing view…")

# ────────── auto-frame result ─────────────────────────
# find first 3-D view so view_all works
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        with bpy.context.temp_override(area=area, region=area.regions[-1]):
            bpy.ops.view3d.view_all(center=True)
        break
print("────────────────────────────────────────────────────\n")
