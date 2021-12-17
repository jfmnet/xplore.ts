var Walls = /** @class */ (function () {
    function Walls() {
        this.walls = [];
    }
    Walls.prototype.Initialize = function () {
        var points;
        var line;
        var angle;
        var sin;
        var cos;
        var thickness;
        var shape;
        for (var _i = 0, _a = this.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            points = wall.points;
            line = new XLine2D(points[0].y, points[0].x, points[1].y, points[1].x);
            thickness = this.sections[wall.section].thickness / 2;
            angle = Math.PI * line.angle / 180;
            sin = thickness * Math.sin(angle);
            cos = thickness * Math.cos(angle);
            shape = [];
            shape.push(new THREE.Vector2(-points[0].y + sin, -points[0].x + cos));
            shape.push(new THREE.Vector2(-points[0].y - sin, -points[0].x - cos));
            shape.push(new THREE.Vector2(-points[1].y - sin, -points[1].x - cos));
            shape.push(new THREE.Vector2(-points[1].y + sin, -points[1].x + cos));
            shape.push(new THREE.Vector2(-points[0].y + sin, -points[0].x + cos));
            wall.shape = shape;
        }
    };
    Walls.prototype.GenerateMesh = function () {
        var mesh = new XCanvas3DGraphics.Mesh();
        var section = new XCanvas3DGraphics.ExtrudeSection();
        var thickness;
        for (var _i = 0, _a = this.walls; _i < _a.length; _i++) {
            var wall = _a[_i];
            thickness = this.sections[wall.section].thickness / 2;
            section.line = [new THREE.Vector3(0, 0, wall.points[0].z), new THREE.Vector3(0, 0, wall.points[2].z)];
            section.shape = wall.shape;
            mesh.Add(section.GenerateGeometry());
        }
        mesh.material = new THREE.MeshPhongMaterial({ color: 0xB71C1C, emissive: 0x000000 }); //, transparent: true, opacity: 0.75 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    };
    return Walls;
}());
//# sourceMappingURL=walls.js.map