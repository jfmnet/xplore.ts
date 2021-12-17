var ETABSAreaSection = /** @class */ (function () {
    function ETABSAreaSection() {
    }
    return ETABSAreaSection;
}());
var FrameSection = /** @class */ (function () {
    function FrameSection() {
    }
    return FrameSection;
}());
var SlabSection = /** @class */ (function () {
    function SlabSection() {
    }
    return SlabSection;
}());
var WallSection = /** @class */ (function () {
    function WallSection() {
    }
    return WallSection;
}());
var RCBeam = /** @class */ (function () {
    function RCBeam() {
    }
    return RCBeam;
}());
var RCColumn = /** @class */ (function () {
    function RCColumn() {
    }
    return RCColumn;
}());
var Slab = /** @class */ (function () {
    function Slab() {
        this.points = [];
    }
    return Slab;
}());
var Wall = /** @class */ (function () {
    function Wall() {
        this.points = [];
    }
    return Wall;
}());
var ETABSViewer = /** @class */ (function () {
    function ETABSViewer() {
        this.beams = new Beams();
        this.columns = new Columns();
        this.slabs = new Slabs();
        this.walls = new Walls();
        this.factor = 1000;
    }
    ETABSViewer.prototype.Show = function () {
        var view = new Xplore.AppView({
            text: "ETABS Viewer"
        });
        view.buttons = [
            new Xplore.Button({ icon: "magnify" }),
            new Xplore.Button({ icon: "heart" })
        ];
        this.canvas3D = view.Add(new XCanvas3D());
        view.Show();
        this.LoadModel();
    };
    ETABSViewer.prototype.LoadModel = function () {
        var self = this;
        Xplore.GetJSON("resources/model.edj", function (model) {
            self.ExtractModel(model);
            self.ShowModel();
        });
    };
    ETABSViewer.prototype.ExtractModel = function (model) {
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
    };
    ETABSViewer.prototype.ExtractFrameSections = function (sections) {
        var section;
        var shape;
        var cw;
        var ch;
        var tw;
        var tf;
        var n = 16;
        var angle = 360 / n;
        this.framesections = {};
        for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
            var item = sections_1[_i];
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
                    var ca = 0;
                    var cline = void 0;
                    for (var j = 0; j < n; j++) {
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
    };
    ETABSViewer.prototype.ExtractAreaSections = function (sections) {
        var slabsection;
        this.slabsections = {};
        for (var _i = 0, sections_2 = sections; _i < sections_2.length; _i++) {
            var item = sections_2[_i];
            slabsection = new SlabSection();
            slabsection.name = item.Name;
            slabsection.material = item.MatProp;
            slabsection.thickness = item.SlabThickness / this.factor;
            this.slabsections[slabsection.name] = slabsection;
        }
        var wallsection;
        this.wallsections = {};
        for (var _a = 0, sections_3 = sections; _a < sections_3.length; _a++) {
            var item = sections_3[_a];
            wallsection = new WallSection();
            wallsection.name = item.Name;
            wallsection.material = item.MatProp;
            wallsection.thickness = item.Thickness / this.factor;
            this.wallsections[wallsection.name] = wallsection;
        }
    };
    ETABSViewer.prototype.ExtractBeams = function (beams) {
        var beam;
        for (var _i = 0, beams_1 = beams; _i < beams_1.length; _i++) {
            var item = beams_1[_i];
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
    };
    ETABSViewer.prototype.ExtractColumns = function (columns, braces) {
        var column;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var item = columns_1[_i];
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
        for (var _a = 0, braces_1 = braces; _a < braces_1.length; _a++) {
            var item = braces_1[_a];
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
    };
    ETABSViewer.prototype.ExtractSlabs = function (slabs) {
        var slab;
        var tolerance = 0.01;
        for (var _i = 0, slabs_1 = slabs; _i < slabs_1.length; _i++) {
            var item = slabs_1[_i];
            if (Math.abs(item.PT[0].Z - item.PT[1].Z) < tolerance && Math.abs(item.PT[0].Z - item.PT[2].Z) < tolerance) {
                slab = new Slab();
                slab.name = item.Name;
                slab.section = item.PN;
                for (var _a = 0, _b = item.PT; _a < _b.length; _a++) {
                    var point = _b[_a];
                    slab.points.push(new XPoint3D(point.X / this.factor, point.Y / this.factor, point.Z / this.factor));
                }
                this.slabs.slabs.push(slab);
            }
        }
    };
    ETABSViewer.prototype.ExtractWalls = function (walls) {
        var wall;
        var tolerance = 0.01;
        for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
            var item = walls_1[_i];
            if (!(Math.abs(item.PT[0].Z - item.PT[1].Z) < tolerance && Math.abs(item.PT[0].Z - item.PT[2].Z) < tolerance)) {
                wall = new Wall();
                wall.name = item.Name;
                wall.section = item.PN;
                for (var _a = 0, _b = item.PT; _a < _b.length; _a++) {
                    var point = _b[_a];
                    wall.points.push(new XPoint3D(point.X / this.factor, point.Y / this.factor, point.Z / this.factor));
                }
                this.walls.walls.push(wall);
            }
        }
        this.walls.Initialize();
    };
    ETABSViewer.prototype.ShowModel = function () {
        var object = new THREE.Object3D();
        var mesh = this.beams.GenerateMesh();
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
    };
    return ETABSViewer;
}());
//# sourceMappingURL=etabsview.js.map