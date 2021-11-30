enum XCanvasActions {
    SELECT = 1,
    DRAW = 2,
    PAN = 3,
    WINDOWZOOM = 4
}

class XCanvas2DModel {
    action: XCanvasActions = XCanvasActions.SELECT;
    list: XCanvas2DGraphics[] = [];

    private key: KeyboardEvent = new KeyboardEvent("");
    private draw: XCanvas2DGraphics;
    private mousedown: number = 0;
    private drawtype: XCanvas2DGraphics;

    //List

    Add(object: XCanvas2DGraphics): XCanvas2DGraphics {
        this.list.push(object);
        return object;
    }

    Clear(): void {
        this.list = [];
    }
    Bounds(): XBounds2D {
        let bounds = new XBounds2D();

        for (let item of this.list) {
            item.UpdateBounds(bounds);
        }

        return bounds;
    }

    Render(canvas: XCanvas2D): void {
        for (let element of this.list)
            element.Render(canvas);
    }

    ClearSelection(): void {
        for (let item of this.list)
            item.selected = false;
    }

    Draw(draw: any): void {
        this.drawtype = draw;

        this.draw = new draw();
        this.mousedown = 0;
        this.action = XCanvasActions.DRAW;
    }



    //Events

    MouseDown(canvas: XCanvas2D, mouse: XMouse, button: number): void {
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
    }

    MouseMove(canvas: XCanvas2D, mouse: XMouse, button: number): void {
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
    }

    MouseUp(canvas: XCanvas2D, mouse: XMouse, button: number): void {
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
    }

    KeyUp(canvas: XCanvas2D, event: KeyboardEvent): void {
        this.key = event;

        if (event.key === "Escape") {
            this.ClearSelection();
            canvas.StoreBuffer();
        }
    }

    KeyDown(canvas: XCanvas2D, event: KeyboardEvent): void {
        this.key = event;
    }

    HandleMouseMoveNoButton(canvas: XCanvas2D, mouse: XMouse): void {
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
    }

    HandleMouseDownLeftButton(canvas: XCanvas2D, mouse: XMouse) {
        this.mousedown++;

        switch (this.action) {
            case XCanvasActions.DRAW:
                if (this.mousedown === 1 && this.draw.mousedown === 1) {
                    this.draw.Update(mouse, this.mousedown - 1);
                    this.Add(this.draw);
                    this.Draw(this.drawtype);

                } else if (this.mousedown === this.draw.mousedown) {
                    this.draw.Update(mouse, this.mousedown - 1);
                    this.Add(this.draw);
                    this.Draw(this.drawtype);

                } else {
                    this.draw.Update(mouse, this.mousedown - 1);
                }

                canvas.Render();
                break;
        }
    }

    HandleMouseDownRightButton(canvas: XCanvas2D, mouse: XMouse): void {
    }

    HandleMouseMoveLeftButton(canvas: XCanvas2D, mouse: XMouse) {
        switch (this.action) {
            case XCanvasActions.PAN:
                this.Pan(canvas, mouse);
                break;

            case XCanvasActions.SELECT:
            case XCanvasActions.WINDOWZOOM:
                if (canvas.settings.allowselect)
                    this.SelectWindow(canvas, mouse);

                break;

            case XCanvasActions.DRAW:
                break;
        }
    }

    HandleMouseMoveRightButton(canvas: XCanvas2D, mouse: XMouse): void {
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
    }

    HandleMouseUpLeftButton(canvas: XCanvas2D, mouse: XMouse) {
        switch (this.action) {
            case XCanvasActions.PAN:
                canvas.StoreBuffer();
                break;

            case XCanvasActions.SELECT:
            case XCanvasActions.WINDOWZOOM:
                if (canvas.settings.allowselect) {
                    let selected: XCanvas2DGraphics[] = [];

                    if (Math.abs(mouse.rawdown.x - mouse.rawcurrent.x) <= 5 && Math.abs(mouse.rawdown.y - mouse.rawcurrent.y) <= 5)
                        selected = this.SelectByPoint(canvas, mouse);
                    else
                        selected = this.SelectByRectangle(canvas, mouse);

                    selected.forEach(element => {
                        if (this.key.ctrlKey)
                            element.selected = !element.selected;
                        else
                            element.selected = true;
                    });

                    canvas.Render();
                }

                break;
        }
    }

    HandleMouseUpMiddleButton(canvas: XCanvas2D, mouse: XMouse) {
    }

    HandleMouseUpRightButton(canvas: XCanvas2D, mouse: XMouse) {
    }


    //Actions

    Pan(canvas: XCanvas2D, mouse: XMouse): void {
        if (canvas.settings.allowpan) {
            let x = mouse.rawcurrent.x - mouse.rawprevious.x;
            let y = mouse.rawprevious.y - mouse.rawcurrent.y;

            if (!(x === 0 && y === 0)) {
                canvas.Pan(x, y);
                canvas.Render();
            }
        }
    }


    //Other functionalities

    Snap(canvas: XCanvas2D, mouse: XMouse): void {
        this.SnapOnGrid(canvas, mouse);
        this.SnapOnPoint(canvas, mouse);
    }

    SnapOnGrid(canvas: XCanvas2D, mouse: XMouse): void {
        if (canvas.settings.snapongrid)
            mouse.current = canvas.SnapOnGrid(mouse.current);
    }

    SnapOnPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
        if (canvas.settings.snaponpoint)
            for (let item of this.list) {
                for (let point of item.points) {
                    if (point.IsEqual(mouse.current.x, mouse.current.y, canvas.settings.pointtolerance)) {
                        mouse.current.x = point.x;
                        mouse.current.y = point.y;
                        return true;
                    }
                }
            }

        return false;
    }

    SelectWindow(canvas: XCanvas2D, mouse: XMouse) {
        canvas.RestoreBuffer();
        canvas.SelectRectangle(
            mouse.rawdown.x,
            mouse.rawdown.y,
            mouse.rawcurrent.x - mouse.rawdown.x,
            mouse.rawcurrent.y - mouse.rawdown.y,
            "#2196F3"
        );
    };

    SelectByRectangle(canvas: XCanvas2D, mouse: XMouse): XCanvas2DGraphics[] {
        let list: XCanvas2DGraphics[] = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].SelectByRectangle(canvas, mouse)) {
                list.push(this.list[i]);
            }
        }

        return list;
    }

    SelectByPoint(canvas: XCanvas2D, mouse: XMouse): XCanvas2DGraphics[] {
        let list: XCanvas2DGraphics[] = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].SelectByPoint(canvas, mouse)) {
                list.push(this.list[i]);
            }
        }

        return list;
    }

    MouseHover(canvas: XCanvas2D, mouse: XMouse): void {
        for (let i = 0; i < this.list.length; i++)
            this.list[i].MouseHover(mouse);

        canvas.Render();
    }

    ShowPointer(canvas: XCanvas2D, mouse: XMouse): void {
        if (canvas.settings.showpointer) {
            this.Snap(canvas, mouse);

            let x = canvas.ToCoordX(mouse.current.x);
            let y = canvas.ToCoordY(mouse.current.y);

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

            let text = "X = " + mouse.current.x.toFixed(3) + "; Y = " + mouse.current.y.toFixed(3);
            canvas.PrimitiveText(text, x + 10, y - 10, 0);
        }
    }
}