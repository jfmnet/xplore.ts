enum XCanvas3DAlignment {
    CENTER = 0,
    LEFT = 1,
    RIGHT = 2
}

abstract class XCanvas3DGraphics {
    align: THREE.Vector3 = new THREE.Vector3();
    position: THREE.Vector3 = new THREE.Vector3();
    material: THREE.Material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x333333 });

    AlignMove(mesh): void {
        if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0) {
            mesh.up = new THREE.Vector3(this.align.x, this.align.y, this.align.z);
            mesh.lookAt(this.align);
        }

        if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0)
            mesh.position.copy(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
    };

    abstract Generate(): THREE.Mesh | THREE.LineSegments;
}

namespace XCanvas3DGraphics {
    export class Axis {
        x: number;
        y: number;
        z: number;
        size: number = 1;

        constructor(x?: number, y?: number, z?: number, size?: number) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.size = size || 1;
        }

        Generate() {
            let radius = this.size / 20;
            let height = this.size / 5;

            let thickness = this.size / 50;
            let halfthick = thickness / 2;
            let mid = this.size / 2;

            let object = new THREE.Object3D();
            let red = new THREE.MeshPhongMaterial({ color: 0x880000, emissive: 0x111111 })
            let green = new THREE.MeshPhongMaterial({ color: 0x088000, emissive: 0x111111 })
            let blue = new THREE.MeshPhongMaterial({ color: 0x000088, emissive: 0x111111 })


            //X

            let x = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            x.position = new THREE.Vector3(this.x + this.size, this.y, this.z);
            x.align = new THREE.Vector3(1, 0, 0);
            x.material = red;
            object.add(x.Generate());

            let boxx = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxx.position = new THREE.Vector3(this.x + mid + halfthick, this.y, this.z);
            boxx.align = new THREE.Vector3(1, 0, 0);
            boxx.material = red;
            object.add(boxx.Generate());


            //Y

            let y = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            y.position = new THREE.Vector3(this.x, this.y + this.size, this.z);
            y.align = new THREE.Vector3(0, 1, 0);
            y.material = green;
            object.add(y.Generate());

            let boxy = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxy.position = new THREE.Vector3(this.x, this.y + mid + halfthick, this.z);
            boxy.align = new THREE.Vector3(0, 1, 0);
            boxy.material = green;
            object.add(boxy.Generate());


            //Z

            let z = new XCanvas3DGraphics.Cylinder(0, radius, height, 8);
            z.position = new THREE.Vector3(this.x, this.y, this.z + this.size);
            z.align = new THREE.Vector3(0, 0, 1);
            z.material = blue;
            object.add(z.Generate());

            let boxz = new XCanvas3DGraphics.Box(thickness, thickness, this.size);
            boxz.position = new THREE.Vector3(this.x, this.y, this.z + mid + halfthick);
            boxz.align = new THREE.Vector3(0, 0, 1);
            boxz.material = blue;
            object.add(boxz.Generate());

            return object;
        };
    }

    export class Box extends XCanvas3DGraphics {
        sizex: number;
        sizey: number;
        sizez: number;

        constructor(sizex: number, sizey?: number, sizez?: number) {
            super();

            this.sizex = sizex;
            this.sizey = sizey || sizex;
            this.sizez = sizez || sizex;
        }

        Generate(): THREE.Mesh {
            let geometry = new THREE.BoxBufferGeometry(this.sizex, this.sizey, this.sizez);

            let mesh = new THREE.Mesh(geometry, this.material);
            this.AlignMove(mesh);

            return mesh;
        };
    }

    export class Cylinder extends XCanvas3DGraphics {
        topradius: number;
        bottomradius: number;
        height: number;
        segments: number

        constructor(topradius: number, bottomradius: number, height: number, segments: number) {
            super();

            this.topradius = topradius;
            this.bottomradius = bottomradius;
            this.height = height;
            this.segments = segments;
        }

        Generate(): THREE.Mesh {
            let geometry = new THREE.CylinderBufferGeometry(this.topradius, this.bottomradius, this.height, this.segments);

            let mesh = new THREE.Mesh(geometry, this.material);
            this.AlignMove(mesh);

            return mesh;
        };

        AlignMove(mesh: THREE.Mesh) {
            if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0)
                mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.align);

            if (this.position.x !== 0 || this.position.y !== 0 || this.position.z !== 0)
                mesh.position.copy(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
        };
    }

    export class LineSegments extends XCanvas3DGraphics {
        lines: XLine3D[] = [];

        constructor(lines?: XLine3D[], material?: THREE.Material) {
            super();

            this.lines = lines || [];
            this.material = material || new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1 });
        }

        Generate(): THREE.LineSegments {
            let geometry = new THREE.BufferGeometry();
            let vertices = [];

            for (let line of this.lines)
                vertices.push(line.x1, line.y1, line.z1, line.x2, line.y2, line.z2);

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            return new THREE.LineSegments(geometry, this.material);
        };
    }

    export class Triangles extends XCanvas3DGraphics {
        triangles: XTriangle[] = [];
        colors: XTriangle[] = [];
        usepointcolor: boolean;

        constructor(triangles?: XTriangle[]) {
            super();

            this.triangles = triangles || [];
        }

        Generate(): THREE.Mesh {
            let geometry = new THREE.BufferGeometry();
            let vertices = new Float32Array(this.triangles.length * 9);
            let colors = new Float32Array(this.colors.length * 9);

            let j: number;

            for (let i = 0; i < this.triangles.length; i++) {
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

            let mesh = new THREE.Mesh(geometry, this.material);
            return mesh;
        };
    }

    export class ExtrudeSection extends XCanvas3DGraphics {
        shape: THREE.Vector2[] = [];
        line: THREE.Vector3[];

        settings: THREE.ExtrudeGeometryOptions = {
            steps: 1,
            bevelEnabled: false
        };

        Generate(): THREE.Mesh {
            let mesh = new THREE.Mesh();
            return mesh;
        }

        GenerateGeometry(): THREE.ExtrudeGeometry {
            let spline = new THREE.CatmullRomCurve3(this.line);
            this.settings.extrudePath = spline;

            let shape = new THREE.Shape(this.shape);
            return new THREE.ExtrudeGeometry(shape, this.settings);
        }
    }

    export class Mesh extends XCanvas3DGraphics {
        vertices: number[][] = [];
        normals: number[][] = [];
        indices: number[] = [];
        uvs: number[][] = [];
        lines: THREE.Vector3[] = [];


        Add(geometry: THREE.BufferGeometry): void {
            const vertices = geometry.getAttribute("position").array;
            const normals = geometry.getAttribute("normal").array;
            const uvs = geometry.getAttribute("uv").array;
            const index = geometry.getIndex();
            let indices: ArrayLike<number> = [];

            if (index)
                indices = index.array;

            const lastindex = this.vertices.length;

            for (let n = 0; n < vertices.length; n += 3)
                this.vertices.push([vertices[n], vertices[n + 1], vertices[n + 2]]);

            for (let n = 0; n < normals.length; n += 3)
                this.normals.push([normals[n], normals[n + 1], normals[n + 2]]);

            for (let n = 0; n < uvs.length; n += 3)
                this.uvs.push([uvs[n], uvs[n + 1], uvs[n + 2]]);

            for (let n = 0; n < indices.length; n++)
                this.indices.push(lastindex + indices[n]);

            for (let n = 0; n < vertices.length; n += 9) {
                this.lines.push(new THREE.Vector3(vertices[n], vertices[n + 1], vertices[n + 2]));
                this.lines.push(new THREE.Vector3(vertices[n + 3], vertices[n + 4], vertices[n + 5]));
            }
        }

        // Add(vertices: number[], normals: number[], indices: number[]): void {
        //     let lastindex = this.vertices.length;

        //     for (let n = 0; n < vertices.length; n += 3)
        //         this.vertices.push([vertices[n], vertices[n + 1], vertices[n + 2]]);

        //     for (let n = 0; n < normals.length; n += 3)
        //         this.normals.push([normals[n], normals[n + 1], normals[n + 2]]);

        //     for (let n = 0; n < indices.length; n++)
        //         this.indices.push(lastindex + indices[n]);
        // }

        Generate(): THREE.Mesh {
            let geovertices = new Float32Array(this.vertices.length * 3);
            let j = 0;

            for (let i = 0; i < this.vertices.length; i++) {
                j = i * 3;

                geovertices[j + 0] = this.vertices[i][0];
                geovertices[j + 1] = this.vertices[i][1];
                geovertices[j + 2] = this.vertices[i][2];
            }

            let geonormals = new Float32Array(this.normals.length * 3);

            for (let i = 0; i < this.normals.length; i++) {
                j = i * 3;

                geonormals[j + 0] = this.normals[i][0];
                geonormals[j + 1] = this.normals[i][1];
                geonormals[j + 2] = this.normals[i][2];
            }

            let uvs = new Float32Array(this.uvs.length * 3);

            for (let i = 0; i < this.uvs.length; i++) {
                j = i * 3;

                uvs[j + 0] = this.uvs[i][0];
                uvs[j + 1] = this.uvs[i][1];
                uvs[j + 2] = this.uvs[i][2];
            }

            let buffergeo = new THREE.BufferGeometry();
            buffergeo.setAttribute('position', new THREE.Float32BufferAttribute(geovertices, 3));

            if (uvs.length) {
                buffergeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            }
            else {
                buffergeo.setAttribute('normal', new THREE.Float32BufferAttribute(geonormals, 3));
                buffergeo.setIndex(this.indices);
            }

            buffergeo.computeVertexNormals();

            let mesh = new THREE.Mesh(buffergeo, this.material);
            return mesh;
        }

        GenerateLineSegments(): THREE.LineSegments {
            let geometry = new THREE.BufferGeometry().setFromPoints(this.lines);
            let material = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
            return new THREE.LineSegments(geometry, material);
        }
    }

    export class Text extends XCanvas3DGraphics {
        text: string;
        x: number;
        y: number;
        z: number;
        size: number = 1;
        alignx: XCanvas3DAlignment = XCanvas3DAlignment.CENTER;
        aligny: XCanvas3DAlignment = XCanvas3DAlignment.CENTER;
        rotation: THREE.Vector3 = new THREE.Vector3(Math.PI / 2, 0, 0);

        set color(value: string) {
            let material = this.material as THREE.LineBasicMaterial;
            material.color = new THREE.Color(value);
        }

        constructor(text: string, x: number, y: number, z: number) {
            super();

            this.text = text;
            this.x = x;
            this.y = y;
            this.z = z;

            this.material = new THREE.LineBasicMaterial({
                color: 0x008800
            });
        }

        Generate(): THREE.Mesh {
            let geo = new THREE.TextGeometry(this.text, {
                font: XCanvas3D.font,
                size: this.size,
                height: this.size / 20
            });

            let center = geo.center();
            let widthx = center.boundingBox.max.x - center.boundingBox.min.x;
            let widthy = center.boundingBox.max.y - center.boundingBox.min.y;

            geo.computeBoundingBox();
            geo.computeVertexNormals();

            let mesh = new THREE.Mesh(geo, this.material);

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
        }
    }

    export class UniformGridXY extends XCanvas3DGraphics {
        x1: number;
        y1: number;
        z1: number;
        x2: number;
        y2: number;
        z2: number;
        interval: number;

        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, interval: number) {
            super();

            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.z1 = z1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;
            this.z2 = z2 || 0;
            this.interval = interval || 1;

            this.material = new THREE.LineBasicMaterial({ color: 0xCCCCCC, opacity: 0.5 });
        }

        Generate(): THREE.LineSegments {
            let lines: XLine3D[] = [];
            let color = 0x11171a;

            for (let x = this.x1; x <= this.x2; x += this.interval)
                lines.push(new XLine3D(x, this.y1, this.z1, x, this.y2, this.z2));

            for (let y = this.y1; y <= this.y2; y += this.interval)
                lines.push(new XLine3D(this.x1, y, this.z1, this.x2, y, this.z2));

            let linesegments = new XCanvas3DGraphics.LineSegments(lines, this.material);
            return linesegments.Generate();
        };
    }
}