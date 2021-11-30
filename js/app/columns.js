var Columns = /** @class */ (function () {
    function Columns() {
        this.rccolumns = [];
    }
    Columns.prototype.GenerateMesh = function () {
        var mesh = new XCanvas3DGraphics.Mesh();
        var section = new XCanvas3DGraphics.ExtrudeSection();
        var height;
        var cp;
        var angle = 90;
        for (var _i = 0, _a = this.rccolumns; _i < _a.length; _i++) {
            var column = _a[_i];
            cp = column.cp;
            height = this.sections[column.section].h / 2000;
            section.line = [new THREE.Vector3(column.point1.x, column.point1.y, column.point1.z), new THREE.Vector3(column.point2.x, column.point2.y, column.point2.z)];
            section.shape = this.Transform(this.sections[column.section].shape, height, cp, angle);
            mesh.Add(section.GenerateGeometry());
        }
        mesh.material = new THREE.MeshPhongMaterial({ color: 0xFF9800, emissive: 0x000000 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    };
    Columns.prototype.Transform = function (shape, ch, cp, angle) {
        var points = [];
        if (angle !== 0) {
            var a = Math.PI * angle / 180;
            var acos = Math.cos(a);
            var asin = Math.sin(a);
            var x = void 0, x1 = void 0, y = void 0, y1 = void 0;
            points = [];
            for (var i = 0; i < shape.length; i++) {
                x = shape[i].x;
                y = shape[i].y;
                x1 = acos * (x) - asin * (y);
                y1 = asin * (x) + acos * (y);
                points.push(new THREE.Vector2(x1, y1));
            }
            shape = points;
        }
        points = [];
        switch (cp) {
            case 2:
                for (var i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x - ch, shape[i].y));
                shape = points;
                break;
            case 8:
                for (var i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x + ch, shape[i].y));
                shape = points;
                break;
            default: //10
                for (var i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x + ch, shape[i].y));
                shape = points;
                break;
        }
        return shape;
    };
    ;
    return Columns;
}());
//# sourceMappingURL=columns.js.map