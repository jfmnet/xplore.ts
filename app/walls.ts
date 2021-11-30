class Walls {
    walls: Wall[] = [];
    sections: Record<string, WallSection>;


    Initialize(): void {
        let points: XPoint3D[];
        let line: XLine2D;
        let angle: number;
        let sin: number;
        let cos: number;
        let thickness: number;
        let shape: THREE.Vector2[];

        for (let wall of this.walls) {
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
    }

    GenerateMesh(): [THREE.Mesh, THREE.LineSegments] {
        const mesh = new XCanvas3DGraphics.Mesh();
        const section = new XCanvas3DGraphics.ExtrudeSection();

        let thickness: number;

        for (let wall of this.walls) {
            thickness = this.sections[wall.section].thickness / 2;

            section.line = [new THREE.Vector3(0, 0, wall.points[0].z), new THREE.Vector3(0, 0, wall.points[2].z)];
            section.shape = wall.shape;

            mesh.Add(section.GenerateGeometry());
        }

        mesh.material = new THREE.MeshPhongMaterial({ color: 0xB71C1C, emissive: 0x000000 });//, transparent: true, opacity: 0.75 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    }
}