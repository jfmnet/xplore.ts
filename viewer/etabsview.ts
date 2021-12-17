interface ETABSModel {
    FrameSections: ETABSFrameSection[];
    PropAreas: ETABSAreaSection[];
    RCBeams: ETABSRCBeam[];
    RCColumns: ETABSRCColumn[];
    RCBraces: ETABSRCColumn[];
    AreaObjects: ETABSAreaObject[];
}

 interface ETABSFrameSection {
    N: number;
    ST: number;
    H: number;
    BF: number;
    T2B: number;
    TF: number;
    TFB: number;
    TW: number;
    TwC: number;
    TwF: number;
    TwT: number;
    Mat: string;
    RebarBeam: string;
    RebarColumn: string;
}

 class ETABSAreaSection {
    Name: string;
    AreaType: number;
    SlabType: number;
    ShellType: number;
    MatProp: string;
    Thickness: number;
    OverallDepth: number;
    SlabThickness: number;
    StemWidthTop: number;
    StemWidthBot: number;
    RibSpacing: number;
    RibsParallelTo: number;
    RibSpacing1: number;
    RibSpacing2: number;
    DeckType: number;
    SlabDepth: number;
    RibDepth: number;
    RibWidthTop: number;
    RibWidthBot: number;
    DeckShearThickness: number;
    DeckUnitWeight: number;
    ShearStudDia: number;
    ShearStudHt: number;
    ShearStudFu: number;
    ShearThickness: number;
    UnitWeight: number;
    WallPropType: number;
}

 interface ETABSRCBeam {
    N: string;
    Label: string;
    PJ: ETABSFramePoint;
    PK: ETABSFramePoint;
    XS: string;
    O1: number[];
    O2: number[];
    CardinalPoint: number;
    SN: string;
    TId: number;
    A: number;
    D: number;
    DI: number;
    NSEC: number;
    EndOffsetI: number;
    EndOffsetJ: number;
    ColumnDesignForces: [];
    SpliceOption: number;
    SpliceHeight: number;
    FramingType: number;
    TransformationMatrix: number[];
    GUID: string;
}

 interface ETABSRCColumn {
    N: string;
    Label: string;
    PJ: ETABSFramePoint;
    PK: ETABSFramePoint;
    XS: string;
    O1: number[];
    O2: number[];
    CardinalPoint: number;
    SN: string;
    TId: number;
    A: number;
    D: number;
    DI: number;
    NSEC: number;
    EndOffsetI: number;
    EndOffsetJ: number;
    ColumnDesignForces: [];
    SpliceOption: number;
    SpliceHeight: number;
    FramingType: number;
    TransformationMatrix: number[];
    GUID: string;
}

 interface ETABSAreaObject {
    Name: string,
    PN: string,
    O: number,
    IO: boolean,
    ISB: string,
    StoryName: string,
    ST: string,
    Angle: number,
    TowerId: number,
    Offsets: number[],
    PT: ETABSFramePoint[];
    CurveData: {},
    PierLabel: string,
    SpandrelLabel: string,
    GUID: string,
}

 interface ETABSFramePoint {
    Name: string;
    X: number;
    Y: number;
    Z: number;
    Restraint: boolean;
    U1: boolean;
    U2: boolean;
    U3: boolean;
    R1: boolean;
    R2: boolean;
    R3: boolean;
}

 class FrameSection {
    name: number;
    sectiontype: number;
    h: number;
    w: number;
    bf: number;
    t2b: number;
    tf: number;
    tfb: number;
    tw: number;
    twc: number;
    twf: number;
    twt: number;
    material: string;
    rebarbeam: string;
    rebarcolumn: string;
    shape: THREE.Vector2[];
}

 class SlabSection {
    name: string;
    material: string;
    thickness: number;
}

 class WallSection {
    name: string;
    material: string;
    thickness: number;
}

 class RCBeam {
    name: string;
    label: string;
    point1: XPoint3D;
    point2: XPoint3D;
    section: string;
    o1: number[];
    o2: number[];
    cp: number;
    story: string;
    tid: number;
    angle: number;
    eo1: number;
    eo2: number;
    matrix: number[];
}

 class RCColumn {
    name: string;
    label: string;
    point1: XPoint3D;
    point2: XPoint3D;
    section: string;
    o1: number[];
    o2: number[];
    cp: number;
    story: string;
    tid: number;
    angle: number;
    eo1: number;
    eo2: number;
    matrix: number[];
}

 class Slab {
    name: string;
    section: string;
    points: XPoint3D[] = [];
}

 class Wall {
    name: string;
    section: string;
    points: XPoint3D[] = [];
    shape: THREE.Vector2[];
}

 class ETABSViewer {
    canvas2D: XCanvas2D;
    canvas3D: XCanvas3D;
    framesections: Record<string, FrameSection>;
    slabsections: Record<string, SlabSection>;
    wallsections: Record<string, WallSection>;
    beams: Beams = new Beams();
    columns: Columns = new Columns();
    slabs: Slabs = new Slabs();
    walls: Walls = new Walls();
    factor: number = 1000;

    Show(): void {
        let view = new Xplore.AppView({
            text: "ETABS Viewer"
        });

        view.buttons = [
            new Xplore.Button({ icon: "magnify" }),
            new Xplore.Button({ icon: "heart" })
        ];

        this.canvas3D = view.Add(new XCanvas3D()) as XCanvas3D;

        view.Show();

        this.LoadModel();
    }

    LoadModel(): void {
        let self = this;

        Xplore.GetJSON("resources/model.edj", function (model: ETABSModel) {
            self.ExtractModel(model);
            self.ShowModel();
        });
    }

    ExtractModel(model: ETABSModel): void {
        this.ExtractFrameSections(model.FrameSections);
        this.ExtractAreaSections(model.PropAreas);

        this.beams.sections = this.framesections;
        this.columns.sections = this.framesections;
        this.slabs.sections = this.slabsections;
        this.walls.sections = this.wallsections;

        this.ExtractBeams(model.RCBeams);
        this.ExtractColumns(model.RCColumns, model.RCBraces);
        this.ExtractSlabs(model.AreaObjects);
        this.ExtractWalls(model.AreaObjects);
    }

    ExtractFrameSections(sections: ETABSFrameSection[]): void {
        let section: FrameSection;
        let shape: THREE.Vector2[];
        let cw: number;
        let ch: number;
        let tw: number;
        let tf: number;

        const n = 16;
        const angle = 360 / n;

        this.framesections = {};

        for (let item of sections) {
            section = new FrameSection();
            section.name = item.N;
            section.sectiontype = item.ST;
            section.h = item.H;
            section.w = item.BF || item.T2B;
            section.bf = item.BF;
            section.t2b = item.T2B;
            section.tf = item.TF;
            section.tfb = item.TFB;
            section.tw = item.TW;
            section.twc = item.TwC;
            section.twf = item.TwF;
            section.twt = item.TwT;
            section.material = item.Mat;
            section.rebarbeam = item.RebarBeam;
            section.rebarcolumn = item.RebarColumn;

            shape = [];
            ch = section.h / 2000;
            cw = section.w / 2000;
            tw = section.tw / this.factor;
            tf = section.tf / this.factor;

            switch (section.sectiontype) {
                case -1:
                    cw = 0.15;
                    ch = 0.15;
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, +ch));
                    shape.push(new THREE.Vector2(+cw, +ch));
                    shape.push(new THREE.Vector2(+cw, -ch));
                    break;

                case 0: //Null
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, +ch));
                    shape.push(new THREE.Vector2(+cw, +ch));
                    shape.push(new THREE.Vector2(+cw, -ch));
                    break;

                case 1: //I
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, -ch + tf));
                    shape.push(new THREE.Vector2(-tw / 2, -ch + tf));
                    shape.push(new THREE.Vector2(-tw / 2, ch - tf));
                    shape.push(new THREE.Vector2(-cw, ch - tf));
                    shape.push(new THREE.Vector2(-cw, ch));
                    shape.push(new THREE.Vector2(cw, ch));
                    shape.push(new THREE.Vector2(cw, ch - tf));
                    shape.push(new THREE.Vector2(tw / 2, ch - tf));
                    shape.push(new THREE.Vector2(tw / 2, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch));
                    shape.push(new THREE.Vector2(-cw, -ch));
                    break;

                case 2: //Channel
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, ch));
                    shape.push(new THREE.Vector2(cw, ch));
                    shape.push(new THREE.Vector2(cw, ch - tf));
                    shape.push(new THREE.Vector2(-cw + tw, ch - tf));
                    shape.push(new THREE.Vector2(-cw + tw, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch));
                    shape.push(new THREE.Vector2(-cw, -ch));
                    break;

                case 3: //Tee
                    shape.push(new THREE.Vector2(-tw / 2, -ch));
                    shape.push(new THREE.Vector2(-tw / 2, ch - tf));
                    shape.push(new THREE.Vector2(-cw, ch - tf));
                    shape.push(new THREE.Vector2(-cw, ch));
                    shape.push(new THREE.Vector2(cw, ch));
                    shape.push(new THREE.Vector2(cw, ch - tf));
                    shape.push(new THREE.Vector2(tw / 2, ch - tf));
                    shape.push(new THREE.Vector2(tw / 2, -ch));
                    break;

                case 4: //Angle
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, ch));
                    shape.push(new THREE.Vector2(-cw + tw, ch));
                    shape.push(new THREE.Vector2(-cw + tw, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch + tf));
                    shape.push(new THREE.Vector2(cw, -ch));
                    shape.push(new THREE.Vector2(-cw, -ch));
                    break;

                case 8: //Rectangle
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, +ch));
                    shape.push(new THREE.Vector2(+cw, +ch));
                    shape.push(new THREE.Vector2(+cw, -ch));
                    break;

                case 7: //Pipe
                case 9: //Circle
                    let ca = 0;
                    let cline: XLine2D;

                    for (let j = 0; j < n; j++) {
                        cline = new XLine2D(0, -ch, 0, ch);
                        ca += angle;
                        cline.Rotate(0, 0, ca);
                        shape.push(new THREE.Vector2(cline.x2, cline.y2));
                    }

                    break;

                default:
                    shape.push(new THREE.Vector2(-cw, -ch));
                    shape.push(new THREE.Vector2(-cw, +ch));
                    shape.push(new THREE.Vector2(+cw, +ch));
                    shape.push(new THREE.Vector2(+cw, -ch));
                    break;

            }

            section.shape = shape;
            this.framesections[section.name] = section;
        }
    }

    ExtractAreaSections(sections: ETABSAreaSection[]): void {
        let slabsection: SlabSection;
        this.slabsections = {};

        for (let item of sections) {
            slabsection = new SlabSection();
            slabsection.name = item.Name;
            slabsection.material = item.MatProp;
            slabsection.thickness = item.SlabThickness / this.factor;

            this.slabsections[slabsection.name] = slabsection;
        }

        let wallsection: WallSection;
        this.wallsections = {};

        for (let item of sections) {
            wallsection = new WallSection();
            wallsection.name = item.Name;
            wallsection.material = item.MatProp;
            wallsection.thickness = item.Thickness / this.factor;

            this.wallsections[wallsection.name] = wallsection;
        }
    }

    ExtractBeams(beams: ETABSRCBeam[]): void {
        let beam: RCBeam;

        for (let item of beams) {
            beam = new RCBeam();
            beam.name = item.N;
            beam.label = item.Label;
            beam.point1 = { x: item.PJ.X / this.factor, y: item.PJ.Y / this.factor, z: item.PJ.Z / this.factor };
            beam.point2 = { x: item.PK.X / this.factor, y: item.PK.Y / this.factor, z: item.PK.Z / this.factor };
            beam.section = item.XS;
            beam.o1 = item.O1;
            beam.o2 = item.O2;
            beam.cp = item.CardinalPoint;
            beam.story = item.SN;
            beam.tid = item.TId;
            beam.angle = item.A;
            beam.eo1 = item.EndOffsetI;
            beam.eo2 = item.EndOffsetJ;
            beam.matrix = item.TransformationMatrix;

            this.beams.rcbeams.push(beam);
        }
    }

    ExtractColumns(columns: ETABSRCColumn[], braces: ETABSRCColumn[]): void {
        let column: RCColumn;

        for (let item of columns) {
            column = new RCColumn();
            column.name = item.N;
            column.label = item.Label;
            column.point1 = { x: item.PJ.X / this.factor, y: item.PJ.Y / this.factor, z: item.PJ.Z / this.factor };
            column.point2 = { x: item.PK.X / this.factor, y: item.PK.Y / this.factor, z: item.PK.Z / this.factor };
            column.section = item.XS;
            column.o1 = item.O1;
            column.o2 = item.O2;
            column.cp = item.CardinalPoint;
            column.story = item.SN;
            column.tid = item.TId;
            column.angle = item.A;
            column.eo1 = item.EndOffsetI;
            column.eo2 = item.EndOffsetJ;
            column.matrix = item.TransformationMatrix;

            this.columns.rccolumns.push(column);
        }

        for (let item of braces) {
            column = new RCColumn();
            column.name = item.N;
            column.label = item.Label;
            column.point1 = { x: item.PJ.X / this.factor, y: item.PJ.Y / this.factor, z: item.PJ.Z / this.factor };
            column.point2 = { x: item.PK.X / this.factor, y: item.PK.Y / this.factor, z: item.PK.Z / this.factor };
            column.section = item.XS;
            column.o1 = item.O1;
            column.o2 = item.O2;
            column.cp = item.CardinalPoint;
            column.story = item.SN;
            column.tid = item.TId;
            column.angle = item.A;
            column.eo1 = item.EndOffsetI;
            column.eo2 = item.EndOffsetJ;
            column.matrix = item.TransformationMatrix;

            this.columns.rccolumns.push(column);
        }
    }

    ExtractSlabs(slabs: ETABSAreaObject[]): void {
        let slab: Slab;
        let tolerance = 0.01;

        for (let item of slabs) {
            if (Math.abs(item.PT[0].Z - item.PT[1].Z) < tolerance && Math.abs(item.PT[0].Z - item.PT[2].Z) < tolerance) {
                slab = new Slab();
                slab.name = item.Name;
                slab.section = item.PN;

                for (let point of item.PT) {
                    slab.points.push(new XPoint3D(point.X / this.factor, point.Y / this.factor, point.Z / this.factor));
                }

                this.slabs.slabs.push(slab);
            }
        }
    }

    ExtractWalls(walls: ETABSAreaObject[]): void {
        let wall: Wall;
        let tolerance = 0.01;

        for (let item of walls) {
            if (!(Math.abs(item.PT[0].Z - item.PT[1].Z) < tolerance && Math.abs(item.PT[0].Z - item.PT[2].Z) < tolerance)) {
                wall = new Wall();
                wall.name = item.Name;
                wall.section = item.PN;

                for (let point of item.PT) {
                    wall.points.push(new XPoint3D(point.X / this.factor, point.Y / this.factor, point.Z / this.factor));
                }

                this.walls.walls.push(wall);
            }
        }

        this.walls.Initialize();
    }

    ShowModel(): void {
        let object = new THREE.Object3D();

        let mesh = this.beams.GenerateMesh();
        mesh[0].castShadow = true;
        mesh[0].receiveShadow = true;
        object.add(mesh[0]);
        object.add(mesh[1]);

        mesh = this.columns.GenerateMesh();
        mesh[0].castShadow = true;
        mesh[0].receiveShadow = true;
        object.add(mesh[0]);
        object.add(mesh[1]);

        mesh = this.slabs.GenerateMesh();
        //mesh[0].castShadow = true;
        mesh[0].receiveShadow = true;
        object.add(mesh[0]);
        object.add(mesh[1]);

        mesh = this.walls.GenerateMesh();
        mesh[0].castShadow = true;
        mesh[0].receiveShadow = true;
        object.add(mesh[0]);
        object.add(mesh[1]);

        //this.canvas3D.ClearObjects();
        this.canvas3D.SetObjects(object);
        this.canvas3D.ZoomAll();
    }
}