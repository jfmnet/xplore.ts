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
var XDrawProperties = /** @class */ (function () {
    function XDrawProperties() {
        this.showfill = true;
        this.showline = true;
        this.scale = true;
        this.fillcolor = "rgba(0, 75, 150, 0.3)";
        this.linecolor = "rgba(0, 100, 200, 0.5)";
        this.thickness = 1;
    }
    return XDrawProperties;
}());
;
var XTextProperties = /** @class */ (function () {
    function XTextProperties() {
        this.font = "Arial";
        this.size = 12;
        this.color = "#CCC";
        this.scale = true;
        this.horizontalalignment = "left";
        this.verticalalignment = "middle";
    }
    return XTextProperties;
}());
;
var XCanvas2DGraphics = /** @class */ (function () {
    function XCanvas2DGraphics() {
        this.points = [];
        this.properties = new XDrawProperties();
        this.selectedproperties = new XDrawProperties();
        this.hoverproperties = new XDrawProperties();
        this.textproperties = new XTextProperties();
        this.selected = false;
        this.mouseover = false;
        this.mousedown = 1;
        this.selectedproperties.fillcolor = "rgba(255, 255, 0, 0.3)";
        this.selectedproperties.linecolor = "rgba(200, 150, 0, 0.5)";
        this.hoverproperties.fillcolor = "rgba(255, 255, 0, 0.5)";
        this.hoverproperties.linecolor = "rgba(200, 200, 0, 0.75)";
    }
    XCanvas2DGraphics.prototype.UpdateBounds = function (bounds) {
        if (this.points) {
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var point = _a[_i];
                bounds.Update(point.x, point.y);
            }
        }
    };
    XCanvas2DGraphics.prototype.Property = function () {
        if (this.mouseover && this.hoverproperties)
            return this.hoverproperties;
        else if (this.selected)
            return this.selectedproperties;
        else
            return this.properties;
    };
    XCanvas2DGraphics.prototype.SelectByRectangle = function (canvas, mouse) {
        for (var i = 0; i < this.points.length; i++)
            if (!mouse.IsInside(this.points[i].x, this.points[i].y))
                return false;
        return true;
    };
    XCanvas2DGraphics.prototype.SelectByPoint = function (canvas, mouse) {
        return false;
    };
    XCanvas2DGraphics.prototype.MouseHover = function (mouse) {
    };
    XCanvas2DGraphics.prototype.Update = function (mouse, index) {
    };
    return XCanvas2DGraphics;
}());
(function (XCanvas2DGraphics) {
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line(x1, y1, x2, y2) {
            var _this = _super.call(this) || this;
            _this.points = [];
            _this.points.push(new XPoint2D());
            _this.points.push(new XPoint2D());
            _this.x1 = x1;
            _this.y1 = y1;
            _this.x2 = x2;
            _this.y2 = y2;
            return _this;
        }
        Object.defineProperty(Line.prototype, "x1", {
            //Getter and setter
            get: function () {
                return this.points[0].x;
            },
            set: function (value) {
                this.points[0].x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "y1", {
            get: function () {
                return this.points[0].y;
            },
            set: function (value) {
                this.points[0].y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "x2", {
            get: function () {
                return this.points[1].x;
            },
            set: function (value) {
                this.points[1].x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "y2", {
            get: function () {
                return this.points[1].y;
            },
            set: function (value) {
                this.points[1].y = value;
            },
            enumerable: false,
            configurable: true
        });
        //Render
        Line.prototype.Render = function (canvas) {
            canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2, this.Property());
        };
        Line.prototype.SelectByPoint = function (canvas, mouse) {
            return new XLine2D(this.x1, this.y1, this.x2, this.y2).OnLine(mouse.down.x, mouse.down.y);
        };
        return Line;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Line = Line;
    var Rectangle = /** @class */ (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(x1, y1, x2, y2) {
            var _this = _super.call(this) || this;
            _this.points = [];
            _this.points.push(new XPoint2D());
            _this.points.push(new XPoint2D());
            _this.points.push(new XPoint2D());
            _this.points.push(new XPoint2D());
            _this.x1 = x1;
            _this.y1 = y1;
            _this.x2 = x2;
            _this.y2 = y2;
            return _this;
        }
        Object.defineProperty(Rectangle.prototype, "x1", {
            //Getter and setter
            get: function () {
                return this.points[0].x;
            },
            set: function (value) {
                this.points[0].x = value;
                this.points[1].x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "y1", {
            get: function () {
                return this.points[0].y;
            },
            set: function (value) {
                this.points[1].y = value;
                this.points[2].y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "x2", {
            get: function () {
                return this.points[1].x;
            },
            set: function (value) {
                this.points[2].x = value;
                this.points[3].x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "y2", {
            get: function () {
                return this.points[1].y;
            },
            set: function (value) {
                this.points[0].y = value;
                this.points[3].y = value;
            },
            enumerable: false,
            configurable: true
        });
        Rectangle.prototype.Render = function (canvas) {
            canvas.DrawPolygon_2(this.points, this.Property());
        };
        Rectangle.prototype.SelectByPoint = function (canvas, mouse) {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        };
        Rectangle.prototype.MouseHover = function (mouse) {
            this.mouseover = new XPolygon2D(this.points).IsInside(mouse.current.x, mouse.current.y);
        };
        return Rectangle;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Rectangle = Rectangle;
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, r, fixedsize) {
            if (fixedsize === void 0) { fixedsize = false; }
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.r = r;
            _this.fixedsize = fixedsize;
            _this.points = [];
            _this.points.push(new XPoint2D(x, y));
            return _this;
        }
        //Getter and setter
        Circle.prototype.Render = function (canvas) {
            canvas.DrawCircle_2(this.x, this.y, this.r, this.Property(), this.fixedsize);
        };
        Circle.prototype.SelectByPoint = function (canvas, mouse) {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        };
        return Circle;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Circle = Circle;
    var Pie = /** @class */ (function (_super) {
        __extends(Pie, _super);
        function Pie(x, y, r, startangle, endangle) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.r = r;
            _this.startangle = startangle;
            _this.endangle = endangle;
            return _this;
        }
        //Getter and setter
        Pie.prototype.Render = function (canvas) {
            canvas.DrawPie_2(this.x, this.y, this.r, this.startangle, this.endangle, this.Property());
        };
        Pie.prototype.SelectByPoint = function (canvas, mouse) {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        };
        Pie.prototype.UpdateBounds = function (bounds) {
            bounds.Update(this.x + this.r, this.y);
            bounds.Update(this.x - this.r, this.y);
            bounds.Update(this.x, this.y + this.r);
            bounds.Update(this.x, this.y - this.r);
        };
        return Pie;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Pie = Pie;
    var Polygon = /** @class */ (function (_super) {
        __extends(Polygon, _super);
        function Polygon(points) {
            var _this = _super.call(this) || this;
            _this.points = points;
            return _this;
        }
        //Render
        Polygon.prototype.Render = function (canvas) {
            canvas.DrawPolygon_2(this.points, this.Property());
        };
        Polygon.prototype.SelectByPoint = function (canvas, mouse) {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        };
        Polygon.prototype.MouseHover = function (mouse) {
            this.mouseover = new XPolygon2D(this.points).IsInside(mouse.current.x, mouse.current.y);
            if (this.mouseover && this.onhover)
                this.onhover(this);
        };
        return Polygon;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Polygon = Polygon;
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text(text, x, y) {
            var _this = _super.call(this) || this;
            _this.a = 0;
            _this.scale = true;
            _this.x = x;
            _this.y = y;
            _this.text = text;
            return _this;
        }
        Text.prototype.Render = function (canvas) {
            var font;
            if (this.scale)
                font = this.textproperties.size * canvas.zoomvalue + "px " + this.textproperties.font;
            else
                font = this.textproperties.size + "px " + this.textproperties.font;
            canvas.DrawText(this.text, this.x, this.y, this.a, font, this.textproperties.color, this.textproperties.horizontalalignment, this.textproperties.verticalalignment);
        };
        return Text;
    }(XCanvas2DGraphics));
    XCanvas2DGraphics.Text = Text;
})(XCanvas2DGraphics || (XCanvas2DGraphics = {}));
//# sourceMappingURL=xcanvas2dgraphics.js.map