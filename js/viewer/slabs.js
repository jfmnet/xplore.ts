var Slabs = /** @class */ (function () {
    function Slabs() {
        this.slabs = [];
    }
    Slabs.prototype.GenerateMesh = function () {
        var mesh = new XCanvas3DGraphics.Mesh();
        var section = new XCanvas3DGraphics.ExtrudeSection();
        var thickness;
        for (var _i = 0, _a = this.slabs; _i < _a.length; _i++) {
            var slab = _a[_i];
            thickness = this.sections[slab.section].thickness / 2;
            section.line = [new THREE.Vector3(0, 0, slab.points[0].z + thickness), new THREE.Vector3(0, 0, slab.points[0].z - thickness)];
            section.shape = [];
            for (var _b = 0, _c = slab.points; _b < _c.length; _b++) {
                var point = _c[_b];
                section.shape.push(new THREE.Vector2(-point.y, -point.x));
            }
            mesh.Add(section.GenerateGeometry());
        }
        mesh.material = new THREE.MeshPhongMaterial({ color: 0xA1887F, emissive: 0x000000 }); //, transparent: true, opacity: 0.75 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    };
    return Slabs;
}());
//# sourceMappingURL=slabs.js.map