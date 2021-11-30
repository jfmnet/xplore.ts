var BridgeView = /** @class */ (function () {
    function BridgeView() {
        this.transparency = 1;
        this.animationtimer = null;
    }
    BridgeView.prototype.Show = function () {
        this.ShowContainer();
        var self = this;
        Xplore.GetJSON("resources/mesh.msh", function (model) {
            self.ShowModel(model, true);
        });
    };
    BridgeView.prototype.ShowContainer = function () {
        this.canvas = new XCanvas3D();
        this.canvas.settings.showtoolbar = true;
        this.canvas.Show();
    };
    BridgeView.prototype.ShowModel = function (model, zoomextent) {
        this.model = model.Meshes;
        this.Convert();
        this.GenerateModel(zoomextent);
    };
    BridgeView.prototype.GenerateModel = function (zoomextent) {
        var object = new THREE.Object3D();
        var bounds = new XBounds3D();
        var triangles;
        var triangle;
        var color;
        var textgeo;
        var lines = new XCanvas3DGraphics.LineSegments();
        var line;
        var opacity;
        var meshcolor;
        for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
            var geometry = _a[_i];
            if (!geometry.Color) {
                geometry.Color = {
                    Alpha: 1,
                    Red: 0.5,
                    Green: 0.60,
                    Blue: 0.75
                };
            }
            opacity = Math.min(geometry.Color.Alpha, 1) * this.transparency;
            meshcolor = this.RGBToHex(geometry.Color.Red, geometry.Color.Green, geometry.Color.Blue);
            triangles = new XCanvas3DGraphics.Triangles();
            triangles.usepointcolor = geometry.UsePointColor;
            triangles.material = new THREE.MeshPhongMaterial({
                color: meshcolor,
                emissive: 0x111111,
                side: THREE.DoubleSide,
                transparent: opacity < 1 ? true : false,
                opacity: opacity
            });
            for (var _b = 0, _c = geometry.Triangles; _b < _c.length; _b++) {
                var item = _c[_b];
                triangle = new XTriangle();
                triangle.point1 = new XPoint3D(item.Vertices[0].X, item.Vertices[0].Y, item.Vertices[0].Z);
                triangle.point2 = new XPoint3D(item.Vertices[1].X, item.Vertices[1].Y, item.Vertices[1].Z);
                triangle.point3 = new XPoint3D(item.Vertices[2].X, item.Vertices[2].Y, item.Vertices[2].Z);
                triangles.triangles.push(triangle);
                color = new XTriangle();
                color.point1 = new XPoint3D(item.Colors[0].X, item.Colors[0].Y, item.Colors[0].Z);
                color.point2 = new XPoint3D(item.Colors[1].X, item.Colors[1].Y, item.Colors[1].Z);
                color.point3 = new XPoint3D(item.Colors[2].X, item.Colors[2].Y, item.Colors[2].Z);
                triangles.colors.push(color);
                bounds.Update(item.Vertices[0].X, item.Vertices[0].Y, item.Vertices[0].Z);
                bounds.Update(item.Vertices[1].X, item.Vertices[1].Y, item.Vertices[1].Z);
                bounds.Update(item.Vertices[2].X, item.Vertices[2].Y, item.Vertices[2].Z);
            }
            for (var _d = 0, _e = geometry.Quads; _d < _e.length; _d++) {
                var item = _e[_d];
                triangle = new XTriangle();
                triangle.point1 = new XPoint3D(item.Vertices[0].X, item.Vertices[0].Y, item.Vertices[0].Z);
                triangle.point2 = new XPoint3D(item.Vertices[1].X, item.Vertices[1].Y, item.Vertices[1].Z);
                triangle.point3 = new XPoint3D(item.Vertices[2].X, item.Vertices[2].Y, item.Vertices[2].Z);
                triangles.triangles.push(triangle);
                color = new XTriangle();
                color.point1 = new XPoint3D(item.Colors[0].X, item.Colors[0].Y, item.Colors[0].Z);
                color.point2 = new XPoint3D(item.Colors[1].X, item.Colors[1].Y, item.Colors[1].Z);
                color.point3 = new XPoint3D(item.Colors[2].X, item.Colors[2].Y, item.Colors[2].Z);
                triangles.colors.push(color);
                triangle = new XTriangle();
                triangle.point1 = new XPoint3D(item.Vertices[0].X, item.Vertices[0].Y, item.Vertices[0].Z);
                triangle.point2 = new XPoint3D(item.Vertices[2].X, item.Vertices[2].Y, item.Vertices[2].Z);
                triangle.point3 = new XPoint3D(item.Vertices[3].X, item.Vertices[3].Y, item.Vertices[3].Z);
                triangles.triangles.push(triangle);
                color = new XTriangle();
                color.point1 = new XPoint3D(item.Colors[0].X, item.Colors[0].Y, item.Colors[0].Z);
                color.point2 = new XPoint3D(item.Colors[2].X, item.Colors[2].Y, item.Colors[2].Z);
                color.point3 = new XPoint3D(item.Colors[3].X, item.Colors[3].Y, item.Colors[3].Z);
                triangles.colors.push(color);
                bounds.Update(item.Vertices[0].X, item.Vertices[0].Y, item.Vertices[0].Z);
                bounds.Update(item.Vertices[1].X, item.Vertices[1].Y, item.Vertices[1].Z);
                bounds.Update(item.Vertices[2].X, item.Vertices[2].Y, item.Vertices[2].Z);
                bounds.Update(item.Vertices[3].X, item.Vertices[3].Y, item.Vertices[3].Z);
            }
            for (var _f = 0, _g = geometry.Lines; _f < _g.length; _f++) {
                var item = _g[_f];
                line = new XLine3D(item.Point1.X, item.Point1.Y, item.Point1.Z, item.Point2.X, item.Point2.Y, item.Point2.Z);
                lines.lines.push(line);
                bounds.Update(item.Point1.X, item.Point1.Y, item.Point1.Z);
                bounds.Update(item.Point2.X, item.Point2.Y, item.Point2.Z);
            }
            for (var _h = 0, _j = geometry.Texts; _h < _j.length; _h++) {
                var item = _j[_h];
                textgeo = new XCanvas3DGraphics.Text(item.Text, item.X, item.Y, item.Z);
                object.add(textgeo.Generate());
            }
            if (triangles.triangles.length)
                object.add(triangles.Generate());
        }
        if (lines.lines.length)
            object.add(lines.Generate());
        //Texts
        //Grid
        var interval = 5;
        var midx = (bounds.x1 + bounds.x2) / 2;
        var midy = (bounds.y1 + bounds.y2) / 2;
        var length = Math.max(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
        var ext = Math.round(length / (2 * interval)) + 5;
        var grid = new XCanvas3DGraphics.UniformGridXY(midx - interval * ext, midy - interval * ext, 0, midx + interval * ext, midy + interval * ext, 0, interval);
        object.add(grid.Generate());
        //Axis
        var size = 3;
        var axis = new XCanvas3DGraphics.Axis();
        axis.size = size;
        object.add(axis.Generate());
        this.canvas.ClearObjects();
        this.canvas.SetObjects(object);
        this.canvas.modelbounds = bounds;
        if (zoomextent)
            this.canvas.ZoomAll(bounds);
        else
            this.canvas.Render();
    };
    BridgeView.prototype.Convert = function () {
        for (var _i = 0, _a = this.model; _i < _a.length; _i++) {
            var geometry = _a[_i];
            for (var _b = 0, _c = geometry.Triangles; _b < _c.length; _b++) {
                var item = _c[_b];
                item.Vertices[0].X /= 1000;
                item.Vertices[1].X /= 1000;
                item.Vertices[2].X /= 1000;
                item.Vertices[0].Y /= 1000;
                item.Vertices[1].Y /= 1000;
                item.Vertices[2].Y /= 1000;
                item.Vertices[0].Z /= 1000;
                item.Vertices[1].Z /= 1000;
                item.Vertices[2].Z /= 1000;
            }
            for (var _d = 0, _e = geometry.Lines; _d < _e.length; _d++) {
                var item = _e[_d];
                item.Point1.X /= 1000;
                item.Point1.Y /= 1000;
                item.Point1.Z /= 1000;
                item.Point2.X /= 1000;
                item.Point2.Y /= 1000;
                item.Point2.Z /= 1000;
            }
            for (var _f = 0, _g = geometry.Quads; _f < _g.length; _f++) {
                var item = _g[_f];
                item.Vertices[0].X /= 1000;
                item.Vertices[1].X /= 1000;
                item.Vertices[2].X /= 1000;
                item.Vertices[3].X /= 1000;
                item.Vertices[0].Y /= 1000;
                item.Vertices[1].Y /= 1000;
                item.Vertices[2].Y /= 1000;
                item.Vertices[3].Y /= 1000;
                item.Vertices[0].Z /= 1000;
                item.Vertices[1].Z /= 1000;
                item.Vertices[2].Z /= 1000;
                item.Vertices[3].Z /= 1000;
            }
        }
    };
    BridgeView.prototype.Animate = function (models, refresh) {
        this.animationframes = [];
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            this.ShowModel(model, refresh);
            this.animationframes.push(this.canvas.sceneobject);
        }
        this.animationindex = 0;
        this.animationforward = true;
        BridgeView.animatemodel = this;
        if (this.animationtimer) {
            clearInterval(this.animationtimer);
            this.animationtimer = null;
            return;
        }
        this.PlayAnimation();
    };
    BridgeView.prototype.PlayAnimation = function () {
        var self = BridgeView.animatemodel;
        if (self.animate) {
            setTimeout(function () {
                requestAnimationFrame(self.PlayAnimation);
                self.AnimateFrame();
                self.canvas.Render();
            }, self.animationspeed);
        }
    };
    BridgeView.prototype.AnimateFrame = function () {
        var self = BridgeView.animatemodel;
        self.canvas.ClearObjects();
        self.canvas.SetObjects(self.animationframes[self.animationindex]);
        if (self.animationforward) {
            self.animationindex++;
            if (self.animationindex === self.animationframes.length - 1)
                self.animationforward = false;
        }
        else {
            self.animationindex--;
            if (self.animationindex === 0)
                self.animationforward = true;
        }
    };
    BridgeView.prototype.RGBToHex = function (r, g, b) {
        return "#" + this.ComponentToHex(Math.round(r * 255)) + this.ComponentToHex(Math.round(g * 255)) + this.ComponentToHex(Math.round(b * 255));
    };
    BridgeView.prototype.ComponentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    BridgeView.prototype.ZoomAll = function () {
        this.canvas.ZoomAll();
    };
    BridgeView.prototype.ZoomIn = function () {
        this.canvas.ZoomIn();
    };
    BridgeView.prototype.ZoomOut = function () {
        this.canvas.ZoomOut();
    };
    BridgeView.prototype.ZoomWindow = function () {
    };
    BridgeView.prototype.ZoomSelection = function () {
    };
    BridgeView.prototype.ZoomObject = function () {
    };
    BridgeView.prototype.ZoomGroup = function () {
    };
    return BridgeView;
}());
//# sourceMappingURL=bridgeview.js.map