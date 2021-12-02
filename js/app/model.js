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
var StructureModel = /** @class */ (function (_super) {
    __extends(StructureModel, _super);
    function StructureModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nodes = new StructureGraphics.Nodes();
        _this.members = new StructureGraphics.Members();
        _this.supports = new StructureGraphics.Supports();
        return _this;
    }
    StructureModel.prototype.Add = function (object) {
        if (object instanceof StructureGraphics.Node)
            this.nodes.Add(object);
        else if (object instanceof StructureGraphics.Member) {
            //Add nodes
            this.nodes.Add(new StructureGraphics.Node(object.x1, object.y1));
            this.nodes.Add(new StructureGraphics.Node(object.x2, object.y2));
            //Add member
            this.members.Add(object);
        }
        else if (object instanceof StructureGraphics.Support) {
            this.supports.Add(object);
        }
        return object;
    };
    StructureModel.prototype.ClearSelection = function () {
        for (var _i = 0, _a = this.nodes.items; _i < _a.length; _i++) {
            var item = _a[_i];
            item.selected = false;
        }
        for (var _b = 0, _c = this.members.items; _b < _c.length; _b++) {
            var item = _c[_b];
            item.selected = false;
        }
    };
    StructureModel.prototype.Render = function (canvas) {
        this.members.Render(canvas);
        this.nodes.Render(canvas);
        this.supports.Render(canvas);
    };
    StructureModel.prototype.SelectByRectangle = function (canvas, mouse) {
        var list = [];
        for (var _i = 0, _a = this.nodes.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.SelectByRectangle(canvas, mouse)) {
                list.push(item);
            }
        }
        for (var _b = 0, _c = this.members.items; _b < _c.length; _b++) {
            var item = _c[_b];
            if (item.SelectByRectangle(canvas, mouse)) {
                list.push(item);
            }
        }
        return list;
    };
    StructureModel.prototype.SnapOnPoint = function (canvas, mouse) {
        if (canvas.settings.snaponpoint)
            for (var _i = 0, _a = this.nodes.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.IsEqual(mouse.current.x, mouse.current.y, canvas.gridinterval)) {
                    mouse.current.x = item.x;
                    mouse.current.y = item.y;
                    return true;
                }
            }
        return false;
    };
    return StructureModel;
}(XCanvas2DModel));
//# sourceMappingURL=model.js.map