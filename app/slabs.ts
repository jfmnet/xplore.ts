class Slabs {
    slabs: Slab[] = [];
    sections: Record<string, SlabSection>;

    GenerateMesh(): [THREE.Mesh, THREE.LineSegments] {
        const mesh = new XCanvas3DGraphics.Mesh();
        const section = new XCanvas3DGraphics.ExtrudeSection();

        let thickness: number;

        for (let slab of this.slabs) {
            thickness = this.sections[slab.section].thickness / 2;

            section.line = [new THREE.Vector3(0, 0, slab.points[0].z + thickness), new THREE.Vector3(0, 0, slab.points[0].z - thickness)];
            section.shape = [];

            for (let point of slab.points)
                section.shape.push(new THREE.Vector2(-point.y, -point.x));

            mesh.Add(section.GenerateGeometry());
        }

        mesh.material = new THREE.MeshPhongMaterial({ color: 0xA1887F, emissive: 0x000000 }) ;//, transparent: true, opacity: 0.75 });
        return [mesh.Generate(), mesh.GenerateLineSegments()];
    }
}