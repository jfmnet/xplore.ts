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
var StructureGraphics = /** @class */ (function (_super) {
    __extends(StructureGraphics, _super);
    function StructureGraphics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StructureGraphics;
}(XCanvas2DGraphics));
(function (StructureGraphics) {
    var Nodes = /** @class */ (function (_super) {
        __extends(Nodes, _super);
        function Nodes() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.items = [];
            return _this;
        }
        Nodes.prototype.Add = function (node) {
            this.items.push(node);
        };
        Nodes.prototype.Render = function (canvas) {
            canvas.SetProperties({
                fillcolor: "#00F",
                linecolor: "#FFF"
            });
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.selected)
                    item.Render(canvas);
            }
            canvas.SetProperties({
                fillcolor: "#FF0",
                linecolor: "#FF0"
            });
            for (var _b = 0, _c = this.items; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.selected)
                    item.Render(canvas);
            }
        };
        return Nodes;
    }(StructureGraphics));
    StructureGraphics.Nodes = Nodes;
    var Node = /** @class */ (function (_super) {
        __extends(Node, _super);
        function Node(x, y, z) {
            if (z === void 0) { z = 0; }
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.z = z;
            return _this;
        }
        Node.prototype.Render = function (canvas) {
            var width = canvas.ToPointWidth(10);
            canvas.DrawRectangle(this.x, this.y, width, width);
        };
        Node.prototype.Update = function (mouse) {
            this.x = mouse.current.x;
            this.y = mouse.current.y;
        };
        Node.prototype.SelectByRectangle = function (canvas, mouse) {
            return mouse.IsInside(this.x, this.y);
        };
        Node.prototype.IsEqual = function (x, y, tolerance) {
            if (tolerance === void 0) { tolerance = 0; }
            return Math.abs(this.x - x) <= tolerance && Math.abs(this.y - y) <= tolerance;
        };
        return Node;
    }(StructureGraphics));
    StructureGraphics.Node = Node;
    var Members = /** @class */ (function (_super) {
        __extends(Members, _super);
        function Members() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.items = [];
            return _this;
        }
        Members.prototype.Add = function (member) {
            this.items.push(member);
        };
        Members.prototype.Render = function (canvas) {
            canvas.SetProperties({
                fillcolor: "#00F",
                linecolor: "#FFF"
            });
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.selected)
                    item.Render(canvas);
            }
            canvas.SetProperties({
                fillcolor: "#FF0",
                linecolor: "#FF0"
            });
            for (var _b = 0, _c = this.items; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.selected)
                    item.Render(canvas);
            }
        };
        return Members;
    }(StructureGraphics));
    StructureGraphics.Members = Members;
    var Member = /** @class */ (function (_super) {
        __extends(Member, _super);
        function Member(x, y) {
            var _this = _super.call(this) || this;
            _this.x1 = x;
            _this.y1 = y;
            _this.mousedown = 2;
            return _this;
        }
        Member.prototype.Render = function (canvas) {
            var width = canvas.ToPointWidth(10);
            canvas.DrawLine(this.x1, this.y1, this.x2, this.y2);
        };
        Member.prototype.Update = function (mouse, index) {
            if (index === 0) {
                this.x1 = mouse.current.x;
                this.y1 = mouse.current.y;
            }
            else {
                this.x2 = mouse.current.x;
                this.y2 = mouse.current.y;
            }
        };
        Member.prototype.SelectByRectangle = function (canvas, mouse) {
            return mouse.IsInside(this.x1, this.y1) && mouse.IsInside(this.x2, this.y2);
        };
        return Member;
    }(StructureGraphics));
    StructureGraphics.Member = Member;
    var Supports = /** @class */ (function (_super) {
        __extends(Supports, _super);
        function Supports() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.items = [];
            return _this;
        }
        Supports.prototype.Add = function (support) {
            this.items.push(support);
        };
        Supports.prototype.Render = function (canvas) {
            canvas.SetProperties({
                fillcolor: "#840",
                linecolor: "#FFF"
            });
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                item.Render(canvas);
            }
        };
        return Supports;
    }(StructureGraphics));
    StructureGraphics.Supports = Supports;
    var Support = /** @class */ (function (_super) {
        __extends(Support, _super);
        function Support() {
            return _super.call(this) || this;
        }
        Support.prototype.Update = function (mouse) {
            this.x = mouse.current.x;
            this.y = mouse.current.y;
        };
        Support.prototype.Render = function (canvas) {
            var width = 10;
            var x = canvas.ToCoordX(this.x);
            var y = canvas.ToCoordY(this.y);
            //X
            var points = [
                new XPoint2D(x - width / 2, y),
                new XPoint2D(x - width * 2, y + width),
                new XPoint2D(x - width * 2, y - width)
            ];
            canvas.PrimitivePolygon(points, true, false);
            // points = [
            //     new XPoint2D(x + width / 2, y),
            //     new XPoint2D(x + width * 2, y + width),
            //     new XPoint2D(x + width * 2, y - width)
            // ];
            // canvas.PrimitivePolygon(points, true, false);
            //Y
            // points = [
            //     new XPoint2D(x, y - width / 2),
            //     new XPoint2D(x + width, y - width * 2),
            //     new XPoint2D(x - width, y - width * 2)
            // ];
            // canvas.PrimitivePolygon(points, true, false);
            points = [
                new XPoint2D(x, y + width / 2),
                new XPoint2D(x + width, y + width * 2),
                new XPoint2D(x - width, y + width * 2)
            ];
            canvas.PrimitivePolygon(points, true, false);
        };
        return Support;
    }(StructureGraphics));
    StructureGraphics.Support = Support;
})(StructureGraphics || (StructureGraphics = {}));
//# sourceMappingURL=graphics.js.map