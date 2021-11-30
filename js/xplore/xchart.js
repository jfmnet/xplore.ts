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
var XChartData = /** @class */ (function () {
    function XChartData() {
        this.list = [];
    }
    return XChartData;
}());
var XChart = /** @class */ (function (_super) {
    __extends(XChart, _super);
    function XChart() {
        return _super.call(this, undefined, "chart") || this;
    }
    XChart.prototype.Refresh = function () {
        this.object.innerHTML = "";
        this.canvas = new XCanvas2D();
        this.canvas.settings.ischart = true;
        this.canvas.Show(this.object);
        this.Render();
    };
    return XChart;
}(Xplore));
(function (XChart) {
    var BarChart = /** @class */ (function (_super) {
        __extends(BarChart, _super);
        function BarChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.25;
            _this.data = data;
            return _this;
        }
        BarChart.prototype.Render = function () {
            var model = new XCanvas2DModel();
            var counter = 1;
            var rectangle;
            for (var _i = 0, _a = this.data.list; _i < _a.length; _i++) {
                var item = _a[_i];
                rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter - this.width, item.value, counter + this.width, 0));
                rectangle.hover = true;
                rectangle.hoverproperties = this.data.options.hover;
                counter++;
            }
            this.canvas.model = model;
            this.canvas.ZoomAll();
        };
        return BarChart;
    }(XChart));
    XChart.BarChart = BarChart;
    var LineChart = /** @class */ (function (_super) {
        __extends(LineChart, _super);
        function LineChart(data) {
            var _this = _super.call(this) || this;
            _this.width = 0.25;
            _this.data = data;
            return _this;
        }
        LineChart.prototype.Render = function () {
            var model = new XCanvas2DModel();
            var counter = 1;
            var line;
            var item1;
            var item2;
            var circle;
            for (var i = 0; i < this.data.list.length - 1; i++) {
                item1 = this.data.list[i];
                item2 = this.data.list[i + 1];
                line = model.Add(new XCanvas2DGraphics.Line(i, item1.value, i + 1, item2.value));
                circle = model.Add(new XCanvas2DGraphics.Circle(i, item1.value, 5, true));
                circle.properties.fillcolor = "#FF0";
            }
            // for (let item of this.data.list) {
            //     rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter - this.width, item.value, counter + this.width, 0)) as XCanvas2DGraphics.Rectangle;
            //     rectangle.hover = true;
            //     rectangle.hoverproperties = this.data.options.hover;
            //     counter++;
            // }
            this.canvas.model = model;
            this.canvas.ZoomAll();
        };
        return LineChart;
    }(XChart));
    XChart.LineChart = LineChart;
})(XChart || (XChart = {}));
//# sourceMappingURL=xchart.js.map