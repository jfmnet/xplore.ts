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
var XChartDataSet = /** @class */ (function () {
    function XChartDataSet() {
        this.items = [];
    }
    return XChartDataSet;
}());
var XChartData = /** @class */ (function () {
    function XChartData() {
        this.list = [];
    }
    return XChartData;
}());
var XChart = /** @class */ (function (_super) {
    __extends(XChart, _super);
    function XChart() {
        var _this = _super.call(this, undefined, "chart") || this;
        _this.legendposition = XPOSITION.NONE;
        return _this;
    }
    XChart.prototype.Refresh = function () {
        this.object.innerHTML = "";
        var splitter = new Xplore.SplitContainer();
        var index = 0;
        var orientation;
        switch (this.legendposition) {
            case XPOSITION.NONE:
                index = 0;
                splitter.size = [undefined, 0];
                break;
            case XPOSITION.LEFT:
                index = 1;
                splitter.size = [200, undefined];
                orientation = "horizontal";
                break;
            case XPOSITION.TOP:
                index = 1;
                splitter.size = [30, undefined];
                splitter.orientation = XORIENTATION.VERTICAL;
                orientation = "vertical";
                break;
            case XPOSITION.RIGHT:
                index = 0;
                splitter.size = [undefined, 200];
                orientation = "horizontal";
                break;
            case XPOSITION.BOTTOM:
                index = 0;
                splitter.size = [undefined, 30];
                splitter.orientation = XORIENTATION.VERTICAL;
                orientation = "vertical";
                break;
        }
        splitter.Show(this.object);
        this.canvas = new XCanvas2D();
        this.canvas.settings.ischart = true;
        this.canvas.settings.allowzoom = false;
        this.canvas.settings.allowpan = false;
        this.canvas.settings.allowselect = false;
        this.canvas.settings.showtoolbar = false;
        this.canvas.rulersize = 60;
        splitter.Set(this.canvas, index);
        this.container = new Xplore.Container({ classes: ["chart-legend-container", orientation] });
        splitter.Set(this.container, index ? 0 : 1);
        this.Render();
    };
    return XChart;
}(Xplore));
(function (XChart) {
    var BaseChart = /** @class */ (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.selectedindex = -1;
            _this.showtooltip = false;
            _this.uniformscale = false;
            return _this;
        }
        BaseChart.prototype.Render = function () {
            var self = this;
            this.form = new Xplore.Form({
                classes: ["map-info"],
                width: 200,
                height: 120,
            });
            this.form.showfooter = false;
            this.form.showclose = false;
            this.form.modal = false;
            this.canvas.labelx = this.data.options.labels.x;
            this.canvas.labely = this.data.options.labels.y;
            var list;
            var index = 0;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                list = new Xplore.List({
                    icon: data.icon || "circle",
                    text: data.text,
                    onclick: function (object) {
                        self.selectedindex = object.tag;
                        model.Clear();
                        self.RenderChart(model);
                        self.canvas.model = model;
                        self.canvas.ZoomAll();
                    }
                });
                list.tag = index++;
                list.iconcolor = data.properties.linecolor;
                this.container.Add(list);
            }
            this.container.Refresh();
            this.canvas.textx = this.data.options.label.x;
            this.canvas.texty = this.data.options.label.y;
            var model = new XCanvas2DModel();
            this.RenderChart(model);
            this.canvas.model = model;
            this.canvas.ZoomAll(this.uniformscale);
        };
        BaseChart.prototype.RenderChart = function (model) {
        };
        BaseChart.prototype.RenderActive = function (canvas, mouse) {
        };
        return BaseChart;
    }(XChart));
    var BarChart = /** @class */ (function (_super) {
        __extends(BarChart, _super);
        function BarChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.5;
            _this.data = data;
            return _this;
        }
        BarChart.prototype.RenderChart = function (model) {
            var counter = 1;
            var rectangle;
            var datacount = this.data.items.length;
            var width = this.width / datacount;
            var y;
            var index = 0;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                counter = 1;
                y = -0.5 * this.width + 0.5 * width + index * width;
                for (var _b = 0, _c = data.list; _b < _c.length; _b++) {
                    var item = _c[_b];
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(item.value, counter + y - width / 2, 0, counter + y + width / 2));
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;
                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    counter++;
                }
                index++;
            }
            if (this.showtooltip) {
                var self_1 = this;
                var item_1;
                var list_1;
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        var index_1 = Math.round(mouse.current.y) - 1;
                        var x = canvas.ToCoordX(0);
                        var y_1 = canvas.ToCoordY(index_1);
                        self_1.RenderActive(canvas, mouse);
                        self_1.form.Clear();
                        for (var _i = 0, _a = self_1.data.items; _i < _a.length; _i++) {
                            var data = _a[_i];
                            item_1 = data.list[index_1];
                            if (item_1) {
                                list_1 = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item_1.value
                                });
                                list_1.iconcolor = data.properties.linecolor;
                                self_1.form.Add(list_1);
                            }
                        }
                        if (item_1) {
                            if (!self_1.form.object) {
                                self_1.form.Show();
                            }
                            self_1.form.text = self_1.data.items[0].list[index_1].name;
                            self_1.form.RefreshHeader();
                            x = mouse.rawcurrent.x;
                            y_1 = canvas.ToCoordY(index_1 + 1);
                            self_1.form.RefreshBody();
                            self_1.form.Resize();
                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y_1 -= self_1.form.object.scrollHeight + 20;
                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self_1.form.object.scrollWidth + 20;
                            self_1.form.SetLocation(x + 10, y_1 + 10);
                        }
                        else {
                            self_1.form.Close();
                        }
                    }
                    else {
                        self_1.form.Close();
                    }
                };
            }
        };
        return BarChart;
    }(BaseChart));
    XChart.BarChart = BarChart;
    var StackedBarChart = /** @class */ (function (_super) {
        __extends(StackedBarChart, _super);
        function StackedBarChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.5;
            _this.data = data;
            return _this;
        }
        StackedBarChart.prototype.RenderChart = function (model) {
            var self = this;
            var rectangle;
            var item;
            var length = this.data.items[0].list.length;
            var x;
            var list;
            var index = 0;
            for (var i = 0; i < length; i++) {
                x = 0;
                index = 0;
                for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                    var data = _a[_i];
                    item = data.list[i];
                    if (self.selectedindex !== -1 && self.selectedindex !== index) {
                        index++;
                        continue;
                    }
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(x, i - this.width / 2 + 1, x + item.value, i + this.width / 2 + 1));
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;
                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    x += item.value;
                    index++;
                }
            }
            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        var index_2 = Math.round(mouse.current.y) - 1;
                        var x_1 = canvas.ToCoordX(0);
                        var y = canvas.ToCoordY(index_2);
                        self.RenderActive(canvas, mouse);
                        self.form.Clear();
                        for (var _i = 0, _a = self.data.items; _i < _a.length; _i++) {
                            var data = _a[_i];
                            item = data.list[index_2];
                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });
                                list.iconcolor = data.properties.linecolor;
                                self.form.Add(list);
                            }
                        }
                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }
                            self.form.text = self.data.items[0].list[index_2].name;
                            self.form.RefreshHeader();
                            x_1 = mouse.rawcurrent.x;
                            y = canvas.ToCoordY(index_2 + 1);
                            self.form.RefreshBody();
                            self.form.Resize();
                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;
                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x_1 -= self.form.object.scrollWidth + 20;
                            self.form.SetLocation(x_1 + 10, y + 10);
                        }
                        else {
                            self.form.Close();
                        }
                    }
                    else {
                        self.form.Close();
                    }
                };
            }
        };
        return StackedBarChart;
    }(BaseChart));
    XChart.StackedBarChart = StackedBarChart;
    var ColumnChart = /** @class */ (function (_super) {
        __extends(ColumnChart, _super);
        function ColumnChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.5;
            _this.data = data;
            return _this;
        }
        ColumnChart.prototype.RenderChart = function (model) {
            var counter = 1;
            var rectangle;
            var datacount = this.data.items.length;
            var width = this.width / datacount;
            var x;
            var index = 0;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                counter = 1;
                x = -0.5 * this.width + 0.5 * width + index * width;
                for (var _b = 0, _c = data.list; _b < _c.length; _b++) {
                    var item_2 = _c[_b];
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter + x - width / 2, item_2.value, counter + x + width / 2, 0));
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;
                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    counter++;
                }
                index++;
            }
            var self = this;
            var item;
            var list;
            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        var index_3 = Math.round(mouse.current.x) - 1;
                        var x_2 = canvas.ToCoordX(index_3);
                        var y = canvas.ToCoordY(0);
                        self.RenderActive(canvas, mouse);
                        self.form.Clear();
                        for (var _i = 0, _a = self.data.items; _i < _a.length; _i++) {
                            var data = _a[_i];
                            item = data.list[index_3];
                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });
                                list.iconcolor = data.properties.linecolor;
                                self.form.Add(list);
                            }
                        }
                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }
                            self.form.text = self.data.items[0].list[index_3].name;
                            self.form.RefreshHeader();
                            x_2 = canvas.ToCoordX(index_3 + 1);
                            y = mouse.rawcurrent.y;
                            self.form.RefreshBody();
                            self.form.Resize();
                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;
                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x_2 -= self.form.object.scrollWidth + 20;
                            self.form.SetLocation(x_2 + 10, y + 10);
                        }
                        else {
                            self.form.Close();
                        }
                    }
                    else {
                        self.form.Close();
                    }
                };
            }
        };
        return ColumnChart;
    }(BaseChart));
    XChart.ColumnChart = ColumnChart;
    var StackedColumnChart = /** @class */ (function (_super) {
        __extends(StackedColumnChart, _super);
        function StackedColumnChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.5;
            _this.data = data;
            return _this;
        }
        StackedColumnChart.prototype.RenderChart = function (model) {
            var self = this;
            var rectangle;
            var item;
            var length = this.data.items[0].list.length;
            var y = 0;
            var list;
            var index = 0;
            for (var i = 0; i < length; i++) {
                y = 0;
                index = 0;
                for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                    var data = _a[_i];
                    item = data.list[i];
                    if (self.selectedindex !== -1 && self.selectedindex !== index) {
                        index++;
                        continue;
                    }
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(i - this.width / 2 + 1, y, i + this.width / 2 + 1, y + item.value));
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;
                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    y += item.value;
                    index++;
                }
            }
            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        var index_4 = Math.round(mouse.current.x) - 1;
                        var x = canvas.ToCoordX(index_4);
                        var y_2 = canvas.ToCoordY(0);
                        self.RenderActive(canvas, mouse);
                        self.form.Clear();
                        for (var _i = 0, _a = self.data.items; _i < _a.length; _i++) {
                            var data = _a[_i];
                            item = data.list[index_4];
                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });
                                list.iconcolor = data.properties.linecolor;
                                self.form.Add(list);
                            }
                        }
                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }
                            self.form.text = self.data.items[0].list[index_4].name;
                            self.form.RefreshHeader();
                            x = canvas.ToCoordX(index_4 + 1);
                            y_2 = mouse.rawcurrent.y;
                            self.form.RefreshBody();
                            self.form.Resize();
                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y_2 -= self.form.object.scrollHeight + 20;
                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self.form.object.scrollWidth + 20;
                            self.form.SetLocation(x + 10, y_2 + 10);
                        }
                        else {
                            self.form.Close();
                        }
                    }
                    else {
                        self.form.Close();
                    }
                };
            }
        };
        return StackedColumnChart;
    }(BaseChart));
    XChart.StackedColumnChart = StackedColumnChart;
    var LineChart = /** @class */ (function (_super) {
        __extends(LineChart, _super);
        function LineChart(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            return _this;
        }
        LineChart.prototype.RenderChart = function (model) {
            var line;
            var item1;
            var item2;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                for (var i = 0; i < data.list.length - 1; i++) {
                    item1 = data.list[i];
                    item2 = data.list[i + 1];
                    line = model.Add(new XCanvas2DGraphics.Line(i, item1.value, i + 1, item2.value));
                    line.properties.linecolor = data.properties.linecolor;
                }
            }
            if (this.showtooltip) {
                var self_2 = this;
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    var index = Math.round(mouse.current.x);
                    var x = canvas.ToCoordX(index);
                    var y = canvas.ToCoordY(0);
                    canvas.SetProperties({ thickness: 1 });
                    canvas.PrimitiveLine(x, 0, x, y);
                    for (var _i = 0, _a = self_2.data.items; _i < _a.length; _i++) {
                        var data = _a[_i];
                        if (data.list[index])
                            canvas.PrimitiveCircle(x, canvas.ToCoordY(data.list[index].value), 5, true, true);
                    }
                };
            }
        };
        return LineChart;
    }(BaseChart));
    XChart.LineChart = LineChart;
    var AreaChart = /** @class */ (function (_super) {
        __extends(AreaChart, _super);
        function AreaChart(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            return _this;
        }
        AreaChart.prototype.RenderChart = function (model) {
            var poly;
            var item;
            var points;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                points = [];
                for (var i = 0; i < data.list.length; i++) {
                    item = data.list[i];
                    points.push(new XPoint2D(i, item.value));
                }
                points.push(new XPoint2D(data.list.length - 1, 0));
                points.push(new XPoint2D(0, 0));
                poly = model.Add(new XCanvas2DGraphics.Polygon(points));
                poly.properties.linecolor = data.properties.linecolor;
                poly.properties.fillcolor = data.properties.fillcolor;
            }
            if (this.showtooltip) {
                var self_3 = this;
                model.HandleMouseMoveNoButton = function (canvas, mouse) {
                    canvas.Render();
                    var index = Math.round(mouse.current.x);
                    var x = canvas.ToCoordX(index);
                    var y = canvas.ToCoordY(0);
                    canvas.SetProperties({ thickness: 1 });
                    canvas.PrimitiveLine(x, 0, x, y);
                    for (var _i = 0, _a = self_3.data.items; _i < _a.length; _i++) {
                        var data = _a[_i];
                        if (data.list[index])
                            canvas.PrimitiveCircle(x, canvas.ToCoordY(data.list[index].value), 5, true, true);
                    }
                };
            }
        };
        return AreaChart;
    }(BaseChart));
    XChart.AreaChart = AreaChart;
    var PieChart = /** @class */ (function (_super) {
        __extends(PieChart, _super);
        function PieChart(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            _this.uniformscale = true;
            return _this;
        }
        PieChart.prototype.RenderChart = function (model) {
            var pie;
            var item;
            var total = 0;
            var startangle = 0;
            var endangle = 0;
            for (var _i = 0, _a = this.data.items; _i < _a.length; _i++) {
                var data = _a[_i];
                item = data.list[0];
                total += item.value;
            }
            for (var _b = 0, _c = this.data.items; _b < _c.length; _b++) {
                var data = _c[_b];
                item = data.list[0];
                endangle = 2 * Math.PI * item.value / total;
                pie = model.Add(new XCanvas2DGraphics.Pie(0, 0, 1, startangle, startangle + endangle));
                pie.properties.linecolor = data.properties.linecolor;
                pie.properties.fillcolor = data.properties.fillcolor;
                startangle += endangle;
            }
            this.canvas.settings.showgrid = false;
            this.canvas.settings.showruler = false;
        };
        return PieChart;
    }(BaseChart));
    XChart.PieChart = PieChart;
    var MapChart = /** @class */ (function (_super) {
        __extends(MapChart, _super);
        function MapChart(data) {
            var _this = _super.call(this) || this;
            var self = _this;
            _this.data = data;
            Xplore.GetJSON("resources/map-small.json", function (data) {
                self.map = data.features;
                self.Render();
            });
            return _this;
        }
        MapChart.prototype.Render = function () {
            if (this.map) {
                var model = new XCanvas2DModel();
                var mappoints = void 0;
                var polygon = void 0;
                var text = void 0;
                var bounds = void 0;
                var feature = void 0;
                var self_4 = this;
                //Polygon
                for (var _i = 0, _a = this.map; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.geometry.type === "Polygon") {
                        mappoints = [];
                        for (var _b = 0, _c = item.geometry.coordinates; _b < _c.length; _b++) {
                            var points = _c[_b];
                            for (var _d = 0, points_1 = points; _d < points_1.length; _d++) {
                                var point = points_1[_d];
                                mappoints.push(new XPoint2D(point[0], point[1]));
                            }
                        }
                        polygon = new XCanvas2DGraphics.Polygon(mappoints);
                        polygon.hover = true;
                        polygon.hoverproperties.fillcolor = "#FF0";
                        model.Add(polygon);
                        bounds = new XBounds2D();
                        polygon.UpdateBounds(bounds);
                    }
                    else {
                        bounds = new XBounds2D();
                        for (var _e = 0, _f = item.geometry.coordinates; _e < _f.length; _e++) {
                            var points = _f[_e];
                            mappoints = [];
                            for (var _g = 0, points_2 = points; _g < points_2.length; _g++) {
                                var point = points_2[_g];
                                for (var _h = 0, point_1 = point; _h < point_1.length; _h++) {
                                    var inpoint = point_1[_h];
                                    mappoints.push(new XPoint2D(inpoint[0], inpoint[1]));
                                }
                            }
                            polygon = new XCanvas2DGraphics.Polygon(mappoints);
                            polygon.hover = true;
                            polygon.hoverproperties.fillcolor = "#FF0";
                            polygon.UpdateBounds(bounds);
                            model.Add(polygon);
                        }
                    }
                    // text = new XCanvas2DGraphics.Text(item.properties.name, bounds.midx, bounds.midy);
                    // text.scale = false;
                    // model.Add(text);
                    //Features
                    // feature = this.data[item.properties.postal];
                    // if (feature) {
                    //     if (feature.fillcolor)
                    //         polygon.properties.fillcolor = feature.fillcolor;
                    //     if (feature.onhover)
                    //         polygon.onhover = function (object: XCanvas2DGraphics.Polygon) {
                    //             let map = document.body.querySelector(".map-info");
                    //             if (!map) {
                    //                 self.form = new Xplore.Form({
                    //                     text: item.properties.name,
                    //                     classes: ["map-info"],
                    //                     width: 240,
                    //                     height: 300
                    //                 });
                    //                 self.form.modal = false;
                    //                 self.form.showfooter = false;
                    //                 self.form.Show();
                    //             }
                    //             let bounds = new XBounds2D();
                    //             object.UpdateBounds(bounds);
                    //             if (self.form.text !== item.properties.name) {
                    //                 self.form.text = item.properties.name;
                    //                 self.form.RefreshHeader();
                    //             }
                    //             self.form.SetLocation(self.canvas.ToCoordX(bounds.x1), self.canvas.ToCoordY(bounds.y1));
                    //         };
                    //     if (feature.icon) {
                    //         text = new XCanvas2DGraphics.Text(feature.icon, bounds.midx, bounds.midy);
                    //         text.textproperties.font = "Material Icons";
                    //         text.textproperties.size = 24;
                    //         text.scale = false;
                    //         model.Add(text);
                    //     }
                    // }
                }
                this.canvas.settings.showgrid = false;
                this.canvas.settings.showruler = false;
                this.canvas.settings.allowzoom = true;
                this.canvas.settings.allowpan = true;
                this.canvas.model = model;
                this.canvas.ZoomAll(true);
            }
        };
        return MapChart;
    }(XChart));
    XChart.MapChart = MapChart;
})(XChart || (XChart = {}));
//# sourceMappingURL=xchart.js.map