class XPoint2D {
    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    IsEqual(x: number, y: number, tolerance: number = 0): boolean {
        return Math.abs(this.x - x) <= tolerance && Math.abs(this.y - y) <= tolerance;
    }

    Rotate(cx: number, cy: number, angle: number): void {
        let a = Math.PI * angle / 180;
        let x = this.x;
        let y = this.y;

        let sin = Math.sin(a);
        let cos = Math.cos(a);

        this.x = cx + cos * (x - cx) - sin * (y - cy);
        this.y = cy + sin * (x - cx) + cos * (y - cy);
    };
}

class XPoint3D {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
}

class XLine2D {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1?: number, y1?: number, x2?: number, y2?: number) {
        this.x1 = x1 || 0;
        this.y1 = y1 || 0;
        this.x2 = x2 || 0;
        this.y2 = y2 || 0;
    }

    get angle(): number {
        if (this.x1 === this.x2) {
            if (this.y1 > this.y2)
                return 270;
            else
                return 90;

        } else if (this.y1 === this.y2) {
            if (this.x1 < this.x2)
                return 0;
            else
                return 180;

        } else {
            let x = this.x2 - this.x1;
            let y = this.y2 - this.y1;

            let angle = Math.atan(Math.abs(y) / Math.abs(x)) * (180 / Math.PI);

            if (x > 0) {
                if (y > 0)
                    return angle;
                else
                    return 360 - angle;
            } else {
                if (y > 0)
                    return 180 - angle;
                else
                    return 180 + angle;
            }
        }
    }
    get length(): number {
        return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2));
    }

    OnLine(x: number, y: number, tolerance: number = 0.01): boolean {
        if (Math.abs(this.y1 - this.y2) < tolerance) {
            //Horizontal
            if (this.InBetweenX(x) && this.WithinTolerance(this.y1, y, tolerance))
                return true;

        } else if (Math.abs(this.x1 - this.x2) < tolerance) {
            //Vertical
            if (this.InBetweenY(y) && this.WithinTolerance(this.x1, x, tolerance))
                return true;

        } else {
            let dx = this.x1 - this.x2;
            let dy = this.y1 - this.y2;
            let ratio = dy / dx;

            let value = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            let tolerancex = Math.abs(value * tolerance / x);
            let tolerancey = Math.abs(value * tolerance / y);

            if (this.InBetweenXWithTolerance(x, tolerancex) && this.InBetweenYWithTolerance(y, tolerancey)) {
                if (Math.abs(x) > Math.abs(y)) {
                    var compy = this.y1 - (this.x1 - x) * ratio;
                    if (this.WithinTolerance(compy, y, tolerancex))
                        return true;
                } else {
                    var compx = this.x1 - (this.y1 - y) / ratio;
                    if (this.WithinTolerance(compx, x, tolerancey))
                        return true;
                }
            }
        }
    }

    WithinTolerance(value: number, compare: number, tolerance: number): boolean {
        if (((value - tolerance) <= compare) && ((value + tolerance) >= compare))
            return true;

        return false;
    };

    InBetweenX(x: number): boolean {
        if (this.x1 < this.x2) {
            if ((this.x1 < x) && (this.x2 > x))
                return true;

        } else {
            if ((this.x1 > x) && (this.x2 < x))
                return true;
        }

        return false;
    };

    InBetweenY(y: number): boolean {
        if (this.y1 < this.y2) {
            if ((this.y1 < y) && (this.y2 > y))
                return true;

        } else {
            if ((this.y1 > y) && (this.y2 < y))
                return true;
        }

        return false;
    };

    InBetweenXWithTolerance(x: number, tolerance: number): boolean {
        if (this.x1 < this.x2) {
            if (((this.x1 - tolerance) < x) && ((this.x2 + tolerance) > x))
                return true;
            else if (((this.x1 + tolerance) > x) && ((this.x2 - tolerance) < x))
                return true;
        } else {
            if (((this.x2 - tolerance) < x) && ((this.x1 + tolerance) > x))
                return true;
            else if (((this.x2 + tolerance) > x) && ((this.x1 - tolerance) < x))
                return true;
        }

        return false;
    };

    InBetweenYWithTolerance(y: number, tolerance: number): boolean {
        if (this.y1 < this.y2) {
            if (((this.y1 - tolerance) < y) && ((this.y2 + tolerance) > y))
                return true;
        } else {
            if (((this.y1 + tolerance) > y) && ((this.y2 - tolerance) < y))
                return true;
        }

        return false;
    };

    Rotate(cx: number, cy: number, angle: number): void {
        if (angle !== 0) {
            let point1 = new XPoint2D(this.x1, this.y1);
            let point2 = new XPoint2D(this.x2, this.y2);

            point1.Rotate(cx, cy, angle);
            point2.Rotate(cx, cy, angle);

            this.x1 = point1.x;
            this.y1 = point1.y;

            this.x2 = point2.x;
            this.y2 = point2.y;
        }
    };
}

class XLine3D extends XLine2D {
    z1: number;
    z2: number;

    get length(): number {
        return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2)+ (this.z1 - this.z2) * (this.z1 - this.z2));
    }
    constructor(x1?: number, y1?: number, z1?: number, x2?: number, y2?: number, z2?: number) {
        super(x1, y1, x2, y2);

        this.z1 = z1;
        this.z2 = z2;
    }
    GetStartOffset(offset: number): XPoint3D {
        let ratio = offset / this.length;
        let diffx = (this.x2 - this.x1);
        let diffy = (this.y2 - this.y1);
        let diffz = (this.z2 - this.z1);
        return { x: ratio * diffx + this.x1, y: ratio * diffy + this.y1, z: ratio * diffz + this.z1 };
    };
    GetEndOffset(offset: number): XPoint3D {
        let ratio = offset / this.length;
        let diffx = (this.x2 - this.x1);
        let diffy = (this.y2 - this.y1);
        let diffz = (this.z2 - this.z1);
        return { x: this.x2 - ratio * diffx, y: this.y2 - ratio * diffy, z: this.z2 - ratio * diffz };
    };
}

class XTriangle {
    point1: XPoint3D;
    point2: XPoint3D;
    point3: XPoint3D;
}

class XPolygon2D {
    points: XPoint2D[] = [];

    constructor(points: XPoint2D[]) {
        this.points = points;
    }

    IsInside(x: number, y: number): boolean {
        let angle = 0;
        let line1 = new XLine2D();
        let line2 = new XLine2D();
        let angle1, angle2;
        let diff;

        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].x === x && this.points[i].y === y)
                return false;

            line1.x1 = x;
            line1.y1 = y;
            line1.x2 = this.points[i].x;
            line1.y2 = this.points[i].y;
            angle1 = line1.angle;

            line2.x1 = x;
            line2.y1 = y;

            if (i === 0) {
                line2.x2 = this.points[this.points.length - 1].x;
                line2.y2 = this.points[this.points.length - 1].y;

            } else {
                line2.x2 = this.points[i - 1].x;
                line2.y2 = this.points[i - 1].y;
            }

            angle2 = line2.angle;

            if (angle2 === 360)
                angle2 = 0;

            diff = angle2 - angle1;

            if (diff < -180)
                diff += 360;

            else if (diff > 180)
                diff -= 360;

            angle += diff;
        }

        return Math.round(Math.abs(angle)) === 360;
    }

    IsInside_2(point: XPoint2D): boolean {
        return this.IsInside(point.x, point.y);
    }
}

class XBounds2D {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1?: number, y1?: number, x2?: number, y2?: number) {
        this.x1 = x1 || Number.POSITIVE_INFINITY;
        this.y1 = y1 || Number.POSITIVE_INFINITY;
        this.x2 = x2 || Number.NEGATIVE_INFINITY;
        this.y2 = y2 || Number.NEGATIVE_INFINITY;
    }

    Update(x: number, y: number): void {
        if (this.x1 > x)
            this.x1 = x;

        if (this.y1 > y)
            this.y1 = y;

        if (this.x2 < x)
            this.x2 = x;

        if (this.y2 < y)
            this.y2 = y;
    }
}

class XBounds3D extends XBounds2D {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;

    constructor(x1?: number, y1?: number, z1?: number, x2?: number, y2?: number, z2?: number) {
        super(x1, y1, x2, y2);
        
        this.x1 = x1 || Number.POSITIVE_INFINITY;
        this.y1 = y1 || Number.POSITIVE_INFINITY;
        this.z1 = z1 || Number.POSITIVE_INFINITY;

        this.x2 = x2 || Number.NEGATIVE_INFINITY;
        this.y2 = y2 || Number.NEGATIVE_INFINITY;
        this.z2 = z2 || Number.NEGATIVE_INFINITY;
    }

    Update(x: number, y: number, z?: number): void {
        if (this.x1 > x)
            this.x1 = x;

        if (this.y1 > y)
            this.y1 = y;

        if (this.z1 > z)
            this.z1 = z;

        if (this.x2 < x)
            this.x2 = x;

        if (this.y2 < y)
            this.y2 = y;

        if (this.z2 < z)
            this.z2 = z;
    }
}

class XVector {
    cross(a: number[], b: number[]): number[] {
        a = a.length === 2 ? [a[0], a[1], 0] : a;
        b = b.length === 2 ? [b[0], b[1], 0] : b;
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    length(v: number[]) {
        return Math.sqrt(v.slice(0, 3).reduce((p, w, i) => {
            return p + w * w;
        }, 0));
    }

    dot(a: number[], b: number[]): number {
        return a.reduce((p, v, i) => {
            return p + v * b[i];
        }, 0);
    }

    normalize(v: number[]) {
        let len = this.length(v);
        return v.slice(0, 3).map(i => i / len);
    }

    add(a: number[], b: number[]): number[] {
        return a.slice(0, 3).map((v, i) => v + b[i]);
    }

    subtract(a: number[], b: number[]): number[] {
        return a.slice(0, 3).map((v, i) => v - b[i]);
    }
}

class XMouse {
    down: XPoint2D = new XPoint2D();
    rawdown: XPoint2D = new XPoint2D();
    current: XPoint2D = new XPoint2D();
    rawcurrent: XPoint2D = new XPoint2D();
    previous: XPoint2D = new XPoint2D();
    rawprevious: XPoint2D = new XPoint2D();
    page: XPoint2D = new XPoint2D();

    delta: number = 0;
    canvas: XCanvas2D;

    constructor(canvas: XCanvas2D) {
        this.canvas = canvas;
    }

    ToPoints() {
        return new XBounds2D(
            this.canvas.ToPointX(this.down.x),
            this.canvas.ToPointY(this.down.y),
            this.canvas.ToPointX(this.current.x),
            this.canvas.ToPointY(this.current.y),
        );
    };

    ToBounds() {
        if (this.down.x < this.current.x) {
            if (this.down.y > this.current.y) {
                return new XBounds2D(
                    this.canvas.ToPointX(this.down.x),
                    this.canvas.ToPointY(this.down.y),
                    this.canvas.ToPointX(this.current.x),
                    this.canvas.ToPointY(this.current.y),
                );
            }
            else {
                return new XBounds2D(
                    this.canvas.ToPointX(this.down.x),
                    this.canvas.ToPointY(this.current.y),
                    this.canvas.ToPointX(this.current.x),
                    this.canvas.ToPointY(this.down.y),
                );
            }
        }
        else {
            if (this.down.y > this.current.y) {
                return new XBounds2D(
                    this.canvas.ToPointX(this.current.x),
                    this.canvas.ToPointY(this.down.y),
                    this.canvas.ToPointX(this.down.x),
                    this.canvas.ToPointY(this.current.y),
                );
            }
            else {
                return new XBounds2D(
                    this.canvas.ToPointX(this.current.x),
                    this.canvas.ToPointY(this.current.y),
                    this.canvas.ToPointX(this.down.x),
                    this.canvas.ToPointY(this.down.y),
                );
            }
        }
    };

    IsInside(x: number, y: number) {
        return ((x >= this.down.x && x <= this.current.x) || (x >= this.current.x && x <= this.down.x)) &&
            ((y >= this.down.y && y <= this.current.y) || (y >= this.current.y && y <= this.down.y));
    };
};