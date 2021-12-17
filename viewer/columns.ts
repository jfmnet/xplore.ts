class Columns {
    rccolumns: RCColumn[] = [];
    sections: Record<string, FrameSection>;

    GenerateMesh(): [THREE.Mesh, THREE.LineSegments] {
        const mesh = new XCanvas3DGraphics.Mesh();
        const section = new XCanvas3DGraphics.ExtrudeSection();

        let height: number;
        let cp: number;
        let angle: number = 90;

        for (let column of this.rccolumns) {
            cp = column.cp;
            height = this.sections[column.section].h / 2000;

            section.line = [new THREE.Vector3(column.point1.x, column.point1.y, column.point1.z), new THREE.Vector3(column.point2.x, column.point2.y, column.point2.z)];
            section.shape = this.Transform(this.sections[column.section].shape, height, cp, angle);

            mesh.Add(section.GenerateGeometry());
        }

        mesh.material = new THREE.MeshPhongMaterial({ color: 0xFF9800, emissive: 0x000000 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    }

    Transform(shape: THREE.Vector2[], ch: number, cp: number, angle: number) {
        let points = [];

        if (angle !== 0) {
            let a = Math.PI * angle / 180;
            let acos = Math.cos(a);
            let asin = Math.sin(a);

            let x, x1, y, y1;

            points = [];

            for (let i = 0; i < shape.length; i++) {
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
                for (let i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x - ch, shape[i].y));

                shape = points;
                break;

            case 8:
                for (let i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x + ch, shape[i].y));

                shape = points;
                break;

            default:    //10
                for (let i = 0; i < shape.length; i++)
                    points.push(new THREE.Vector2(shape[i].x + ch, shape[i].y));

                shape = points;
                break;
        }

        return shape;
    };
}