var XCanvasActions;
(function (XCanvasActions) {
    XCanvasActions[XCanvasActions["SELECT"] = 1] = "SELECT";
    XCanvasActions[XCanvasActions["DRAW"] = 2] = "DRAW";
    XCanvasActions[XCanvasActions["PAN"] = 3] = "PAN";
    XCanvasActions[XCanvasActions["WINDOWZOOM"] = 4] = "WINDOWZOOM";
})(XCanvasActions || (XCanvasActions = {}));
var XCanvas2DModel = /** @class */ (function () {
    function XCanvas2DModel() {
        this.action = XCanvasActions.SELECT;
        this.list = [];
        this.key = new KeyboardEvent("");
        this.mousedown = 0;
    }
    //List
    XCanvas2DModel.prototype.Add = function (object) {
        this.list.push(object);
        return object;
    };
    XCanvas2DModel.prototype.Clear = function () {
        this.list = [];
    };
    XCanvas2DModel.prototype.Bounds = function () {
        var bounds = new XBounds2D();
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var item = _a[_i];
            item.UpdateBounds(bounds);
        }
        return bounds;
    };
    XCanvas2DModel.prototype.Render = function (canvas) {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var element = _a[_i];
            element.Render(canvas);
        }
    };
    XCanvas2DModel.prototype.ClearSelection = function () {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var item = _a[_i];
            item.selected = false;
        }
    };
    XCanvas2DModel.prototype.Draw = function (draw) {
        this.drawtype = draw;
        this.draw = new draw();
        this.mousedown = 0;
        this.action = XCanvasActions.DRAW;
    };
    //Events
    XCanvas2DModel.prototype.MouseDown = function (canvas, mouse, button) {
        canvas.StoreBuffer();
        switch (button) {
            case 1: //Left Button
                this.HandleMouseDownLeftButton(canvas, mouse);
                break;
            case 2: //Middle Button
            case 3: //Right Button
                this.HandleMouseDownRightButton(canvas, mouse);
                break;
        }
    };
    XCanvas2DModel.prototype.MouseMove = function (canvas, mouse, button) {
        switch (button) {
            case 0: //No button
                this.HandleMouseMoveNoButton(canvas, mouse);
                break;
            case 1: //Left Button
                this.HandleMouseMoveLeftButton(canvas, mouse);
                break;
            case 2: //Middle Button
            case 3: //Right Button
                this.HandleMouseMoveRightButton(canvas, mouse);
                break;
        }
    };
    XCanvas2DModel.prototype.MouseUp = function (canvas, mouse, button) {
        switch (button) {
            case 1: //Left Button
                this.HandleMouseUpLeftButton(canvas, mouse);
                break;
            case 2: //Middle Button
                this.HandleMouseUpMiddleButton(canvas, mouse);
                break;
            case 3: //Right Button
                this.HandleMouseUpRightButton(canvas, mouse);
                break;
        }
    };
    XCanvas2DModel.prototype.KeyUp = function (canvas, event) {
        this.key = event;
        if (event.key === "Escape") {
            this.ClearSelection();
            canvas.StoreBuffer();
        }
    };
    XCanvas2DModel.prototype.KeyDown = function (canvas, event) {
        this.key = event;
    };
    XCanvas2DModel.prototype.HandleMouseMoveNoButton = function (canvas, mouse) {
        switch (this.action) {
            case XCanvasActions.SELECT:
                if (canvas.settings.ischart) {
                    this.MouseHover(canvas, mouse);
                }
                break;
            case XCanvasActions.DRAW:
                canvas.RestoreBuffer();
                this.ShowPointer(canvas, mouse);
                if (this.mousedown !== 0) {
                    this.draw.Update(mouse, this.mousedown);
                    this.draw.Render(canvas);
                }
                break;
        }
    };
    XCanvas2DModel.prototype.HandleMouseDownLeftButton = function (canvas, mouse) {
        this.mousedown++;
        switch (this.action) {
            case XCanvasActions.DRAW:
                if (this.mousedown === 1 && this.draw.mousedown === 1) {
                    this.draw.Update(mouse, this.mousedown - 1);
                    this.Add(this.draw);
                    this.Draw(this.drawtype);
                }
                else if (this.mousedown === this.draw.mousedown) {
                    this.draw.Update(mouse, this.mousedown - 1);
                    this.Add(this.draw);
                    this.Draw(this.drawtype);
                }
                else {
                    this.draw.Update(mouse, this.mousedown - 1);
                }
                canvas.Render();
                break;
        }
    };
    XCanvas2DModel.prototype.HandleMouseDownRightButton = function (canvas, mouse) {
    };
    XCanvas2DModel.prototype.HandleMouseMoveLeftButton = function (canvas, mouse) {
        switch (this.action) {
            case XCanvasActions.PAN:
                this.Pan(canvas, mouse);
                break;
            case XCanvasActions.SELECT:
            case XCanvasActions.WINDOWZOOM:
                this.SelectWindow(canvas, mouse);
                break;
            case XCanvasActions.DRAW:
                break;
        }
    };
    XCanvas2DModel.prototype.HandleMouseMoveRightButton = function (canvas, mouse) {
        this.Pan(canvas, mouse);
        switch (this.action) {
            case XCanvasActions.DRAW:
            // let point = this.Snap(canvas, mouse.current, mouse);
            // if (this.draw) {
            //     this.draw.Update(point);
            //     canvas.SetProperties(this.draw.properties);
            //     this.draw.Render(canvas);
            // }
            // break;
        }
    };
    XCanvas2DModel.prototype.HandleMouseUpLeftButton = function (canvas, mouse) {
        var _this = this;
        switch (this.action) {
            case XCanvasActions.PAN:
                canvas.StoreBuffer();
                break;
            case XCanvasActions.SELECT:
            case XCanvasActions.WINDOWZOOM:
                if (canvas.settings.allowselect) {
                    var selected = [];
                    if (Math.abs(mouse.rawdown.x - mouse.rawcurrent.x) <= 5 && Math.abs(mouse.rawdown.y - mouse.rawcurrent.y) <= 5)
                        selected = this.SelectByPoint(canvas, mouse);
                    else
                        selected = this.SelectByRectangle(canvas, mouse);
                    selected.forEach(function (element) {
                        if (_this.key.ctrlKey)
                            element.selected = !element.selected;
                        else
                            element.selected = true;
                    });
                    canvas.Render();
                }
                break;
        }
    };
    XCanvas2DModel.prototype.HandleMouseUpMiddleButton = function (canvas, mouse) {
    };
    XCanvas2DModel.prototype.HandleMouseUpRightButton = function (canvas, mouse) {
    };
    //Actions
    XCanvas2DModel.prototype.Pan = function (canvas, mouse) {
        if (canvas.settings.allowpan) {
            var x = mouse.rawcurrent.x - mouse.rawprevious.x;
            var y = mouse.rawprevious.y - mouse.rawcurrent.y;
            if (!(x === 0 && y === 0)) {
                canvas.Pan(x, y);
                canvas.Render();
            }
        }
    };
    //Other functionalities
    XCanvas2DModel.prototype.Snap = function (canvas, mouse) {
        this.SnapOnGrid(canvas, mouse);
        this.SnapOnPoint(canvas, mouse);
    };
    XCanvas2DModel.prototype.SnapOnGrid = function (canvas, mouse) {
        if (canvas.settings.snapongrid)
            mouse.current = canvas.SnapOnGrid(mouse.current);
    };
    XCanvas2DModel.prototype.SnapOnPoint = function (canvas, mouse) {
        if (canvas.settings.snaponpoint)
            for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
                var item = _a[_i];
                for (var _b = 0, _c = item.points; _b < _c.length; _b++) {
                    var point = _c[_b];
                    if (point.IsEqual(mouse.current.x, mouse.current.y, canvas.settings.pointtolerance)) {
                        mouse.current.x = point.x;
                        mouse.current.y = point.y;
                        return true;
                    }
                }
            }
        return false;
    };
    XCanvas2DModel.prototype.SelectWindow = function (canvas, mouse) {
        canvas.RestoreBuffer();
        canvas.SelectRectangle(mouse.rawdown.x, mouse.rawdown.y, mouse.rawcurrent.x - mouse.rawdown.x, mouse.rawcurrent.y - mouse.rawdown.y, "#2196F3");
    };
    ;
    XCanvas2DModel.prototype.SelectByRectangle = function (canvas, mouse) {
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].SelectByRectangle(canvas, mouse)) {
                list.push(this.list[i]);
            }
        }
        return list;
    };
    XCanvas2DModel.prototype.SelectByPoint = function (canvas, mouse) {
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].SelectByPoint(canvas, mouse)) {
                list.push(this.list[i]);
            }
        }
        return list;
    };
    XCanvas2DModel.prototype.MouseHover = function (canvas, mouse) {
        for (var i = 0; i < this.list.length; i++)
            this.list[i].MouseHover(mouse);
        canvas.Render();
    };
    XCanvas2DModel.prototype.ShowPointer = function (canvas, mouse) {
        if (canvas.settings.showpointer) {
            this.Snap(canvas, mouse);
            var x = canvas.ToCoordX(mouse.current.x);
            var y = canvas.ToCoordY(mouse.current.y);
            canvas.SetProperties({
                linecolor: canvas.settings.pointer,
                thickness: 1
            });
            canvas.PrimitiveLine(0, y, canvas.width, y, [2, 2]);
            canvas.PrimitiveLine(x, 0, x, canvas.height, [2, 2]);
            canvas.SetTextProperties({
                color: canvas.settings.rulertext,
                verticalalignment: "bottom",
                horizontalalignment: "left"
            });
            var text = "X = " + mouse.current.x.toFixed(3) + "; Y = " + mouse.current.y.toFixed(3);
            canvas.PrimitiveText(text, x + 10, y - 10, 0);
        }
    };
    return XCanvas2DModel;
}());
//# sourceMappingURL=xcanvas2dmodel.js.map