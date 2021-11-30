abstract class StructureGraphics extends XCanvas2DGraphics {
}

namespace StructureGraphics {
    export class Nodes extends StructureGraphics {
        items: Node[] = [];

        Add(node: Node): void {
            this.items.push(node);
        }

        Render(canvas: XCanvas2D): void {
            canvas.SetProperties({
                fillcolor: "#00F",
                linecolor: "#FFF"
            });

            for (let item of this.items) {
                if (!item.selected)
                    item.Render(canvas);
            }

            canvas.SetProperties({
                fillcolor: "#FF0",
                linecolor: "#FF0"
            });

            for (let item of this.items) {
                if (item.selected)
                    item.Render(canvas);
            }
        }
    }

    export class Node extends StructureGraphics {
        x: number;
        y: number;
        z: number;

        constructor(x: number, y: number, z: number = 0) {
            super();
            this.x = x;
            this.y = y;
            this.z = z;
        }

        Render(canvas: XCanvas2D): void {
            let width = canvas.ToPointWidth(10);
            canvas.DrawRectangle(this.x, this.y, width, width);
        }

        Update(mouse: XMouse): void {
            this.x = mouse.current.x;
            this.y = mouse.current.y;
        }

        SelectByRectangle(canvas: XCanvas2D, mouse: XMouse): boolean {
            return mouse.IsInside(this.x, this.y);
        }

        IsEqual(x: number, y: number, tolerance: number = 0): boolean {
            return Math.abs(this.x - x) <= tolerance && Math.abs(this.y - y) <= tolerance;
        }
    }

    export class Members extends StructureGraphics {
        items: Member[] = [];

        Add(member: Member): void {
            this.items.push(member);
        }

        Render(canvas: XCanvas2D): void {
            canvas.SetProperties({
                fillcolor: "#00F",
                linecolor: "#FFF"
            });

            for (let item of this.items) {
                if (!item.selected)
                    item.Render(canvas);
            }

            canvas.SetProperties({
                fillcolor: "#FF0",
                linecolor: "#FF0"
            });

            for (let item of this.items) {
                if (item.selected)
                    item.Render(canvas);
            }
        }
    }

    export class Member extends StructureGraphics {
        x1: number;
        y1: number;
        x2: number;
        y2: number;

        constructor(x: number, y: number) {
            super();
            this.x1 = x;
            this.y1 = y;
            this.mousedown = 2;
        }

        Render(canvas: XCanvas2D): void {
            let width = canvas.ToPointWidth(10);
            canvas.DrawLine(this.x1, this.y1, this.x2, this.y2);
        }

        Update(mouse: XMouse, index: number): void {
            if (index === 0) {
                this.x1 = mouse.current.x;
                this.y1 = mouse.current.y;
            } else {
                this.x2 = mouse.current.x;
                this.y2 = mouse.current.y;
            }
        }

        SelectByRectangle(canvas: XCanvas2D, mouse: XMouse): boolean {
            return mouse.IsInside(this.x1, this.y1) && mouse.IsInside(this.x2, this.y2);
        }
    }

    export class Supports extends StructureGraphics {
        items: Support[] = [];

        Add(support: Support): void {
            this.items.push(support);
        }

        Render(canvas: XCanvas2D): void {
            canvas.SetProperties({
                fillcolor: "#840",
                linecolor: "#FFF"
            });

            for (let item of this.items)
                item.Render(canvas);
        }
    }

    export class Support extends StructureGraphics {
        x: number;
        y: number;
        z: number;
        fx: boolean;
        fy: boolean;
        fz: boolean;
        rx: boolean;
        ry: boolean;
        rz: boolean;

        constructor() {
            super();
        }

        Update(mouse: XMouse): void {
            this.x = mouse.current.x;
            this.y = mouse.current.y;
        }

        Render(canvas: XCanvas2D): void {
            let width = 10;
            let x = canvas.ToCoordX(this.x);
            let y = canvas.ToCoordY(this.y);

            //X
            let points = [
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
        }
    }
}