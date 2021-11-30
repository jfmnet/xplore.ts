var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var XCanvas3DAlignment;
(function (XCanvas3DAlignment) {
    XCanvas3DAlignment[XCanvas3DAlignment["CENTER"] = 0] = "CENTER";
    XCanvas3DAlignment[XCanvas3DAlignment["LEFT"] = 1] = "LEFT";
    XCanvas3DAlignment[XCanvas3DAlignment["RIGHT"] = 2] = "RIGHT";
})(XCanvas3DAlignment || (XCanvas3DAlignment = {}));
var XCanvas3DGraphics = /** @class */ (function () {
    function XCanvas3DGraphics() {
        this.align = new THREE.Vector3();
        this.position = new THREE.Vector3();
        this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x333333 });
    }
    XCanvas3DGraphics.prototype.AlignMove = function (mesh) {
        if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0) {
            mesh.up = new THREE.Vector3(this.align.x, this.align.y, this.align.z);
            mesh.lookAt(this.align);
        }
        if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0)
            mesh.position.copy(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
    };
    ;
    return XCanvas3DGraphics;
}());
(function (XCanvas3DGraphics) {
    var Axis = /** @class */ (function () {
        function Axis(x, y, z, size) {
            this.size = 1;
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.size = size || 1;
        }
        Axis.prototype.Generate = function () {
            var radius = this.size / 20;
            var height = this.size / 5;
            var thickness = this.size / 50;
            var halfthick = thickness / 2;
            var mid = this.size / 2;
            var object = new THREE.Object3D();
            var red = new THREE.MeshPhongMaterial({ color: 0x880000, emissive: 0x111111 });
            var green = new THREE.MeshPhongMaterial({ color: 0x088000, emissive: 0x111111 });
            var blue = new THREE.MeshPhongMaterial({ color: 0x000088, emissive: 0x111111 });
            //X
            var x = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            x.position = new THREE.Vector3(this.x + this.size, this.y, this.z);
            x.align = new THREE.Vector3(1, 0, 0);
            x.material = red;
            object.add(x.Generate());
            var boxx = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxx.position = new THREE.Vector3(this.x + mid + halfthick, this.y, this.z);
            boxx.align = new THREE.Vector3(1, 0, 0);
            boxx.material = red;
            object.add(boxx.Generate());
            //Y
            var y = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            y.position = new THREE.Vector3(this.x, this.y + this.size, this.z);
            y.align = new THREE.Vector3(0, 1, 0);
            y.material = green;
            object.add(y.Generate());
            var boxy = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxy.position = new THREE.Vector3(this.x, this.y + mid + halfthick, this.z);
            boxy.align = new THREE.Vector3(0, 1, 0);
            boxy.material = green;
            object.add(boxy.Generate());
            //Z
            var z = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            z.position = new THREE.Vector3(this.x, this.y, this.z + this.size);
            z.align = new THREE.Vector3(0, 0, 1);
            z.material = blue;
            object.add(z.Generate());
            var boxz = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxz.position = new THREE.Vector3(this.x, this.y, this.z + mid + halfthick);
            boxz.align = new THREE.Vector3(0, 0, 1);
            boxz.material = blue;
            object.add(boxz.Generate());
            return object;
        };
        ;
        return Axis;
    }());
    XCanvas3DGraphics.Axis = Axis;
    var Box = /** @class */ (function (_super) {
        __extends(Box, _super);
        function Box(sizex, sizey, sizez) {
            var _this = _super.call(this) || this;
            _this.sizex = sizex;
            _this.sizey = sizey || sizex;
            _this.sizez = sizez || sizex;
            return _this;
        }
        Box.prototype.Generate = function () {
            var geometry = new THREE.BoxBufferGeometry(this.sizex, this.sizey, this.sizez);
            var mesh = new THREE.Mesh(geometry, this.material);
            this.AlignMove(mesh);
            return mesh;
        };
        ;
        return Box;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.Box = Box;
    var Cylinder = /** @class */ (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder(topradius, bottomradius, height, segments) {
            var _this = _super.call(this) || this;
            _this.topradius = topradius;
            _this.bottomradius = bottomradius;
            _this.height = height;
            _this.segments = segments;
            return _this;
        }
        Cylinder.prototype.Generate = function () {
            var geometry = new THREE.CylinderBufferGeometry(this.topradius, this.bottomradius, this.height, this.segments);
            var mesh = new THREE.Mesh(geometry, this.material);
            this.AlignMove(mesh);
            return mesh;
        };
        ;
        Cylinder.prototype.AlignMove = function (mesh) {
            if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0)
                mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.align);
            if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0)
                mesh.position.copy(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
        };
        ;
        return Cylinder;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.Cylinder = Cylinder;
    var LineSegments = /** @class */ (function (_super) {
        __extends(LineSegments, _super);
        function LineSegments(lines, material) {
            var _this = _super.call(this) || this;
            _this.lines = [];
            _this.lines = lines || [];
            _this.material = material || new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1 });
            return _this;
        }
        LineSegments.prototype.Generate = function () {
            var geometry = new THREE.BufferGeometry();
            var vertices = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                vertices.push(line.x1, line.y1, line.z1, line.x2, line.y2, line.z2);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            return new THREE.LineSegments(geometry, this.material);
        };
        ;
        return LineSegments;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.LineSegments = LineSegments;
    var Triangles = /** @class */ (function (_super) {
        __extends(Triangles, _super);
        function Triangles(triangles) {
            var _this = _super.call(this) || this;
            _this.triangles = [];
            _this.colors = [];
            _this.triangles = triangles || [];
            return _this;
        }
        Triangles.prototype.Generate = function () {
            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(this.triangles.length * 9);
            var colors = new Float32Array(this.colors.length * 9);
            var j;
            for (var i = 0; i < this.triangles.length; i++) {
                j = i * 9;
                vertices[j + 0] = this.triangles[i].point1.x;
                vertices[j + 1] = this.triangles[i].point1.y;
                vertices[j + 2] = this.triangles[i].point1.z;
                vertices[j + 3] = this.triangles[i].point2.x;
                vertices[j + 4] = this.triangles[i].point2.y;
                vertices[j + 5] = this.triangles[i].point2.z;
                vertices[j + 6] = this.triangles[i].point3.x;
                vertices[j + 7] = this.triangles[i].point3.y;
                vertices[j + 8] = this.triangles[i].point3.z;
                if (this.usepointcolor) {
                    colors[j + 0] = this.colors[i].point1.x;
                    colors[j + 1] = this.colors[i].point1.y;
                    colors[j + 2] = this.colors[i].point1.z;
                    colors[j + 3] = this.colors[i].point2.x;
                    colors[j + 4] = this.colors[i].point2.y;
                    colors[j + 5] = this.colors[i].point2.z;
                    colors[j + 6] = this.colors[i].point3.x;
                    colors[j + 7] = this.colors[i].point3.y;
                    colors[j + 8] = this.colors[i].point3.z;
                }
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            if (this.usepointcolor) {
                this.material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3, true));
            }
            geometry.computeVertexNormals();
            var mesh = new THREE.Mesh(geometry, this.material);
            return mesh;
        };
        ;
        return Triangles;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.Triangles = Triangles;
    var ExtrudeSection = /** @class */ (function (_super) {
        __extends(ExtrudeSection, _super);
        function ExtrudeSection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shape = [];
            _this.settings = {
                steps: 1,
                bevelEnabled: false
            };
            return _this;
        }
        ExtrudeSection.prototype.Generate = function () {
            var mesh = new THREE.Mesh();
            return mesh;
        };
        ExtrudeSection.prototype.GenerateGeometry = function () {
            var spline = new THREE.CatmullRomCurve3(this.line);
            this.settings.extrudePath = spline;
            var shape = new THREE.Shape(this.shape);
            return new THREE.ExtrudeGeometry(shape, this.settings);
        };
        return ExtrudeSection;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.ExtrudeSection = ExtrudeSection;
    var Mesh = /** @class */ (function (_super) {
        __extends(Mesh, _super);
        function Mesh() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.vertices = [];
            _this.normals = [];
            _this.indices = [];
            _this.uvs = [];
            _this.lines = [];
            return _this;
        }
        Mesh.prototype.Add = function (geometry) {
            var vertices = geometry.getAttribute("position").array;
            var normals = geometry.getAttribute("normal").array;
            var uvs = geometry.getAttribute("uv").array;
            var index = geometry.getIndex();
            var indices = [];
            if (index)
                indices = index.array;
            var lastindex = this.vertices.length;
            for (var n = 0; n < vertices.length; n += 3)
                this.vertices.push([vertices[n], vertices[n + 1], vertices[n + 2]]);
            for (var n = 0; n < normals.length; n += 3)
                this.normals.push([normals[n], normals[n + 1], normals[n + 2]]);
            for (var n = 0; n < uvs.length; n += 3)
                this.uvs.push([uvs[n], uvs[n + 1], uvs[n + 2]]);
            for (var n = 0; n < indices.length; n++)
                this.indices.push(lastindex + indices[n]);
            for (var n = 0; n < vertices.length; n += 9) {
                this.lines.push(new THREE.Vector3(vertices[n], vertices[n + 1], vertices[n + 2]));
                this.lines.push(new THREE.Vector3(vertices[n + 3], vertices[n + 4], vertices[n + 5]));
            }
        };
        // Add(vertices: number[], normals: number[], indices: number[]): void {
        //     let lastindex = this.vertices.length;
        //     for (let n = 0; n < vertices.length; n += 3)
        //         this.vertices.push([vertices[n], vertices[n + 1], vertices[n + 2]]);
        //     for (let n = 0; n < normals.length; n += 3)
        //         this.normals.push([normals[n], normals[n + 1], normals[n + 2]]);
        //     for (let n = 0; n < indices.length; n++)
        //         this.indices.push(lastindex + indices[n]);
        // }
        Mesh.prototype.Generate = function () {
            var geovertices = new Float32Array(this.vertices.length * 3);
            var j = 0;
            for (var i = 0; i < this.vertices.length; i++) {
                j = i * 3;
                geovertices[j + 0] = this.vertices[i][0];
                geovertices[j + 1] = this.vertices[i][1];
                geovertices[j + 2] = this.vertices[i][2];
            }
            var geonormals = new Float32Array(this.normals.length * 3);
            for (var i = 0; i < this.normals.length; i++) {
                j = i * 3;
                geonormals[j + 0] = this.normals[i][0];
                geonormals[j + 1] = this.normals[i][1];
                geonormals[j + 2] = this.normals[i][2];
            }
            var uvs = new Float32Array(this.uvs.length * 3);
            for (var i = 0; i < this.uvs.length; i++) {
                j = i * 3;
                uvs[j + 0] = this.uvs[i][0];
                uvs[j + 1] = this.uvs[i][1];
                uvs[j + 2] = this.uvs[i][2];
            }
            var buffergeo = new THREE.BufferGeometry();
            buffergeo.setAttribute('position', new THREE.Float32BufferAttribute(geovertices, 3));
            if (uvs.length) {
                buffergeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            }
            else {
                buffergeo.setAttribute('normal', new THREE.Float32BufferAttribute(geonormals, 3));
                buffergeo.setIndex(this.indices);
            }
            buffergeo.computeVertexNormals();
            var mesh = new THREE.Mesh(buffergeo, this.material);
            return mesh;
        };
        Mesh.prototype.GenerateLineSegments = function () {
            var geometry = new THREE.BufferGeometry().setFromPoints(this.lines);
            var material = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
            return new THREE.LineSegments(geometry, material);
        };
        return Mesh;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.Mesh = Mesh;
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text(text, x, y, z) {
            var _this = _super.call(this) || this;
            _this.size = 1;
            _this.alignx = XCanvas3DAlignment.CENTER;
            _this.aligny = XCanvas3DAlignment.CENTER;
            _this.rotation = new THREE.Vector3(Math.PI / 2, 0, 0);
            _this.text = text;
            _this.x = x;
            _this.y = y;
            _this.z = z;
            _this.material = new THREE.LineBasicMaterial({
                color: 0x008800
            });
            return _this;
        }
        Object.defineProperty(Text.prototype, "color", {
            set: function (value) {
                var material = this.material;
                material.color = new THREE.Color(value);
            },
            enumerable: false,
            configurable: true
        });
        Text.prototype.Generate = function () {
            var geo = new THREE.TextGeometry(this.text, {
                font: XCanvas3D.font,
                size: this.size,
                height: this.size / 20
            });
            var center = geo.center();
            var widthx = center.boundingBox.max.x - center.boundingBox.min.x;
            var widthy = center.boundingBox.max.y - center.boundingBox.min.y;
            geo.computeBoundingBox();
            geo.computeVertexNormals();
            var mesh = new THREE.Mesh(geo, this.material);
            if (this.alignx === XCanvas3DAlignment.LEFT)
                mesh.position.x = this.x + widthx / 2;
            else if (this.alignx === XCanvas3DAlignment.RIGHT)
                mesh.position.x = this.x - widthx / 2;
            else
                mesh.position.x = this.x;
            if (this.aligny === XCanvas3DAlignment.LEFT)
                mesh.position.y = this.y + widthy / 2;
            else if (this.aligny === XCanvas3DAlignment.RIGHT)
                mesh.position.y = this.y - widthy / 2;
            else
                mesh.position.y = this.y;
            mesh.position.z = this.z;
            mesh.rotation.x = this.rotation.x;
            mesh.rotation.y = this.rotation.y;
            mesh.rotation.z = this.rotation.z;
            return mesh;
        };
        return Text;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.Text = Text;
    var UniformGridXY = /** @class */ (function (_super) {
        __extends(UniformGridXY, _super);
        function UniformGridXY(x1, y1, z1, x2, y2, z2, interval) {
            var _this = _super.call(this) || this;
            _this.x1 = x1 || 0;
            _this.y1 = y1 || 0;
            _this.z1 = z1 || 0;
            _this.x2 = x2 || 0;
            _this.y2 = y2 || 0;
            _this.z2 = z2 || 0;
            _this.interval = interval || 1;
            _this.material = new THREE.LineBasicMaterial({ color: 0xCCCCCC, opacity: 0.5 });
            return _this;
        }
        UniformGridXY.prototype.Generate = function () {
            var lines = [];
            var color = 0x11171a;
            for (var x = this.x1; x <= this.x2; x += this.interval)
                lines.push(new XLine3D(x, this.y1, this.z1, x, this.y2, this.z2));
            for (var y = this.y1; y <= this.y2; y += this.interval)
                lines.push(new XLine3D(this.x1, y, this.z1, this.x2, y, this.z2));
            var linesegments = new XCanvas3DGraphics.LineSegments(lines, this.material);
            return linesegments.Generate();
        };
        ;
        return UniformGridXY;
    }(XCanvas3DGraphics));
    XCanvas3DGraphics.UniformGridXY = UniformGridXY;
})(XCanvas3DGraphics || (XCanvas3DGraphics = {}));
//# sourceMappingURL=xcanvas3dgraphics.js.map