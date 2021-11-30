class XDrawProperties {
    showfill?: boolean = true;
    showline?: boolean = true;
    scale?: boolean = true;

    fillcolor?: string = "rgba(0, 75, 150, 0.3)";
    linecolor?: string = "rgba(0, 100, 200, 0.5)";
    thickness?: number = 1;
};

class XTextProperties {
    font?: string = "Arial";
    size?: number = 12;
    color?: string = "#CCC";
    scale?: boolean = true;
    horizontalalignment?: CanvasTextAlign = "left";
    verticalalignment?: CanvasTextBaseline = "middle";
};

abstract class XCanvas2DGraphics {
    points: XPoint2D[] = [];
    properties: XDrawProperties = new XDrawProperties();
    selectedproperties: XDrawProperties = new XDrawProperties();
    hoverproperties: XDrawProperties = new XDrawProperties();
    textproperties: XTextProperties = new XTextProperties();
    hover: boolean;
    onhover: Function;
    selected: boolean = false;
    mouseover: boolean = false;
    mousedown: number = 1;

    constructor() {
        this.selectedproperties.fillcolor = "rgba(255, 255, 0, 0.3)";
        this.selectedproperties.linecolor = "rgba(200, 150, 0, 0.5)";
        this.hoverproperties.fillcolor = "rgba(255, 255, 0, 0.5)";
        this.hoverproperties.linecolor = "rgba(200, 200, 0, 0.75)";
    }

    UpdateBounds(bounds: XBounds2D): void {
        if (this.points) {
            for (let point of this.points)
                bounds.Update(point.x, point.y);
        }
    }

    abstract Render(canvas: XCanvas2D): void;

    Property(): XDrawProperties {
        if (this.mouseover && this.hoverproperties)
            return this.hoverproperties;
        else if (this.selected)
            return this.selectedproperties;
        else
            return this.properties;
    }

    SelectByRectangle(canvas: XCanvas2D, mouse: XMouse): boolean {
        for (let i = 0; i < this.points.length; i++)
            if (!mouse.IsInside(this.points[i].x, this.points[i].y))
                return false;

        return true;
    }

    SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
        return false;
    }

    MouseHover(mouse: XMouse): void {
    }

    Update(mouse: XMouse, index: number): void {
    }
}

namespace XCanvas2DGraphics {
    export class Line extends XCanvas2DGraphics {
        constructor(x1: number, y1: number, x2: number, y2: number) {
            super();

            this.points = [];
            this.points.push(new XPoint2D());
            this.points.push(new XPoint2D());

            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }


        //Getter and setter

        get x1(): number {
            return this.points[0].x;
        }

        set x1(value: number) {
            this.points[0].x = value;
        }

        get y1(): number {
            return this.points[0].y;
        }

        set y1(value: number) {
            this.points[0].y = value;
        }

        get x2(): number {
            return this.points[1].x;
        }

        set x2(value: number) {
            this.points[1].x = value;
        }

        get y2(): number {
            return this.points[1].y;
        }

        set y2(value: number) {
            this.points[1].y = value;
        }


        //Render
        Render(canvas: XCanvas2D): void {
            canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2, this.Property());
        }

        SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
            return new XLine2D(this.x1, this.y1, this.x2, this.y2).OnLine(mouse.down.x, mouse.down.y);
        }
    }

    export class Rectangle extends XCanvas2DGraphics {
        constructor(x1: number, y1: number, x2: number, y2: number) {
            super();

            this.points = [];
            this.points.push(new XPoint2D());
            this.points.push(new XPoint2D());
            this.points.push(new XPoint2D());
            this.points.push(new XPoint2D());

            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }

        //Getter and setter

        get x1(): number {
            return this.points[0].x;
        }

        set x1(value: number) {
            this.points[0].x = value;
            this.points[1].x = value;
        }

        get y1(): number {
            return this.points[0].y;
        }

        set y1(value: number) {
            this.points[1].y = value;
            this.points[2].y = value;
        }

        get x2(): number {
            return this.points[1].x;
        }

        set x2(value: number) {
            this.points[2].x = value;
            this.points[3].x = value;
        }

        get y2(): number {
            return this.points[1].y;
        }

        set y2(value: number) {
            this.points[0].y = value;
            this.points[3].y = value;
        }

        Render(canvas: XCanvas2D): void {
            canvas.DrawPolygon_2(this.points, this.Property());
        }

        SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        }

        MouseHover(mouse: XMouse): void {
            this.mouseover = new XPolygon2D(this.points).IsInside(mouse.current.x, mouse.current.y);
        }
    }

    export class Circle extends XCanvas2DGraphics {
        x: number;
        y: number;
        r: number;
        fixedsize: boolean;

        constructor(x: number, y: number, r: number, fixedsize: boolean = false) {
            super();

            this.x = x;
            this.y = y;
            this.r = r;
            this.fixedsize = fixedsize;

            this.points = [];
            this.points.push(new XPoint2D(x, y));
        }


        //Getter and setter

        Render(canvas: XCanvas2D): void {
            canvas.DrawCircle_2(this.x, this.y, this.r, this.Property(), this.fixedsize);
        }

        SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        }
    }

    export class Pie extends XCanvas2DGraphics {
        x: number;
        y: number;
        r: number;
        startangle: number;
        endangle: number;

        constructor(x: number, y: number, r: number, startangle: number, endangle: number) {
            super();

            this.x = x;
            this.y = y;
            this.r = r;
            this.startangle = startangle;
            this.endangle = endangle;
        }

        //Getter and setter

        Render(canvas: XCanvas2D): void {
            canvas.DrawPie_2(this.x, this.y, this.r, this.startangle, this.endangle, this.Property());
        }

        SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        }

        UpdateBounds(bounds: XBounds2D): void {
            bounds.Update(this.x + this.r, this.y);
            bounds.Update(this.x - this.r, this.y);
            bounds.Update(this.x, this.y + this.r);
            bounds.Update(this.x, this.y - this.r);
        }
    }

    export class Polygon extends XCanvas2DGraphics {
        points: XPoint2D[];

        constructor(points?: XPoint2D[]) {
            super();
            this.points = points;
        }

        //Render
        Render(canvas: XCanvas2D): void {
            canvas.DrawPolygon_2(this.points, this.Property());
        }

        SelectByPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
            return new XPolygon2D(this.points).IsInside(mouse.down.x, mouse.down.y);
        }

        MouseHover(mouse: XMouse): void {
            this.mouseover = new XPolygon2D(this.points).IsInside(mouse.current.x, mouse.current.y);

            if (this.mouseover && this.onhover)
                this.onhover(this);
        }
    }

    export class Text extends XCanvas2DGraphics {
        x: number;
        y: number;
        a: number = 0;
        text: string;
        scale: boolean = true;

        constructor(text: string, x: number, y: number) {
            super();

            this.x = x;
            this.y = y;
            this.text = text;
        }

        Render(canvas: XCanvas2D): void {
            let font: string;

            if (this.scale)
                font = this.textproperties.size * canvas.zoomvalue + "px " + this.textproperties.font;
            else
                font = this.textproperties.size + "px " + this.textproperties.font;

            canvas.DrawText(this.text, this.x, this.y, this.a, font, this.textproperties.color, this.textproperties.horizontalalignment, this.textproperties.verticalalignment);
        }
    }
}