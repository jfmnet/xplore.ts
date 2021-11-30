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
var XPoint2D = /** @class */ (function () {
    function XPoint2D(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    XPoint2D.prototype.IsEqual = function (x, y, tolerance) {
        if (tolerance === void 0) { tolerance = 0; }
        return Math.abs(this.x - x) <= tolerance && Math.abs(this.y - y) <= tolerance;
    };
    XPoint2D.prototype.Rotate = function (cx, cy, angle) {
        var a = Math.PI * angle / 180;
        var x = this.x;
        var y = this.y;
        var sin = Math.sin(a);
        var cos = Math.cos(a);
        this.x = cx + cos * (x - cx) - sin * (y - cy);
        this.y = cy + sin * (x - cx) + cos * (y - cy);
    };
    ;
    return XPoint2D;
}());
var XPoint3D = /** @class */ (function () {
    function XPoint3D(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    return XPoint3D;
}());
var XLine2D = /** @class */ (function () {
    function XLine2D(x1, y1, x2, y2) {
        this.x1 = x1 || 0;
        this.y1 = y1 || 0;
        this.x2 = x2 || 0;
        this.y2 = y2 || 0;
    }
    Object.defineProperty(XLine2D.prototype, "angle", {
        get: function () {
            if (this.x1 === this.x2) {
                if (this.y1 > this.y2)
                    return 270;
                else
                    return 90;
            }
            else if (this.y1 === this.y2) {
                if (this.x1 < this.x2)
                    return 0;
                else
                    return 180;
            }
            else {
                var x = this.x2 - this.x1;
                var y = this.y2 - this.y1;
                var angle = Math.atan(Math.abs(y) / Math.abs(x)) * (180 / Math.PI);
                if (x > 0) {
                    if (y > 0)
                        return angle;
                    else
                        return 360 - angle;
                }
                else {
                    if (y > 0)
                        return 180 - angle;
                    else
                        return 180 + angle;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XLine2D.prototype, "length", {
        get: function () {
            return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2));
        },
        enumerable: false,
        configurable: true
    });
    XLine2D.prototype.OnLine = function (x, y, tolerance) {
        if (tolerance === void 0) { tolerance = 0.01; }
        if (Math.abs(this.y1 - this.y2) < tolerance) {
            //Horizontal
            if (this.InBetweenX(x) && this.WithinTolerance(this.y1, y, tolerance))
                return true;
        }
        else if (Math.abs(this.x1 - this.x2) < tolerance) {
            //Vertical
            if (this.InBetweenY(y) && this.WithinTolerance(this.x1, x, tolerance))
                return true;
        }
        else {
            var dx = this.x1 - this.x2;
            var dy = this.y1 - this.y2;
            var ratio = dy / dx;
            var value = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var tolerancex = Math.abs(value * tolerance / x);
            var tolerancey = Math.abs(value * tolerance / y);
            if (this.InBetweenXWithTolerance(x, tolerancex) && this.InBetweenYWithTolerance(y, tolerancey)) {
                if (Math.abs(x) > Math.abs(y)) {
                    var compy = this.y1 - (this.x1 - x) * ratio;
                    if (this.WithinTolerance(compy, y, tolerancex))
                        return true;
                }
                else {
                    var compx = this.x1 - (this.y1 - y) / ratio;
                    if (this.WithinTolerance(compx, x, tolerancey))
                        return true;
                }
            }
        }
    };
    XLine2D.prototype.WithinTolerance = function (value, compare, tolerance) {
        if (((value - tolerance) <= compare) && ((value + tolerance) >= compare))
            return true;
        return false;
    };
    ;
    XLine2D.prototype.InBetweenX = function (x) {
        if (this.x1 < this.x2) {
            if ((this.x1 < x) && (this.x2 > x))
                return true;
        }
        else {
            if ((this.x1 > x) && (this.x2 < x))
                return true;
        }
        return false;
    };
    ;
    XLine2D.prototype.InBetweenY = function (y) {
        if (this.y1 < this.y2) {
            if ((this.y1 < y) && (this.y2 > y))
                return true;
        }
        else {
            if ((this.y1 > y) && (this.y2 < y))
                return true;
        }
        return false;
    };
    ;
    XLine2D.prototype.InBetweenXWithTolerance = function (x, tolerance) {
        if (this.x1 < this.x2) {
            if (((this.x1 - tolerance) < x) && ((this.x2 + tolerance) > x))
                return true;
            else if (((this.x1 + tolerance) > x) && ((this.x2 - tolerance) < x))
                return true;
        }
        else {
            if (((this.x2 - tolerance) < x) && ((this.x1 + tolerance) > x))
                return true;
            else if (((this.x2 + tolerance) > x) && ((this.x1 - tolerance) < x))
                return true;
        }
        return false;
    };
    ;
    XLine2D.prototype.InBetweenYWithTolerance = function (y, tolerance) {
        if (this.y1 < this.y2) {
            if (((this.y1 - tolerance) < y) && ((this.y2 + tolerance) > y))
                return true;
        }
        else {
            if (((this.y1 + tolerance) > y) && ((this.y2 - tolerance) < y))
                return true;
        }
        return false;
    };
    ;
    XLine2D.prototype.Rotate = function (cx, cy, angle) {
        if (angle !== 0) {
            var point1 = new XPoint2D(this.x1, this.y1);
            var point2 = new XPoint2D(this.x2, this.y2);
            point1.Rotate(cx, cy, angle);
            point2.Rotate(cx, cy, angle);
            this.x1 = point1.x;
            this.y1 = point1.y;
            this.x2 = point2.x;
            this.y2 = point2.y;
        }
    };
    ;
    return XLine2D;
}());
var XLine3D = /** @class */ (function (_super) {
    __extends(XLine3D, _super);
    function XLine3D(x1, y1, z1, x2, y2, z2) {
        var _this = _super.call(this, x1, y1, x2, y2) || this;
        _this.z1 = z1;
        _this.z2 = z2;
        return _this;
    }
    Object.defineProperty(XLine3D.prototype, "length", {
        get: function () {
            return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2) + (this.z1 - this.z2) * (this.z1 - this.z2));
        },
        enumerable: false,
        configurable: true
    });
    XLine3D.prototype.GetStartOffset = function (offset) {
        var ratio = offset / this.length;
        var diffx = (this.x2 - this.x1);
        var diffy = (this.y2 - this.y1);
        var diffz = (this.z2 - this.z1);
        return { x: ratio * diffx + this.x1, y: ratio * diffy + this.y1, z: ratio * diffz + this.z1 };
    };
    ;
    XLine3D.prototype.GetEndOffset = function (offset) {
        var ratio = offset / this.length;
        var diffx = (this.x2 - this.x1);
        var diffy = (this.y2 - this.y1);
        var diffz = (this.z2 - this.z1);
        return { x: this.x2 - ratio * diffx, y: this.y2 - ratio * diffy, z: this.z2 - ratio * diffz };
    };
    ;
    return XLine3D;
}(XLine2D));
var XTriangle = /** @class */ (function () {
    function XTriangle() {
    }
    return XTriangle;
}());
var XPolygon2D = /** @class */ (function () {
    function XPolygon2D(points) {
        this.points = [];
        this.points = points;
    }
    XPolygon2D.prototype.IsInside = function (x, y) {
        var angle = 0;
        var line1 = new XLine2D();
        var line2 = new XLine2D();
        var angle1, angle2;
        var diff;
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
            }
            else {
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
    };
    XPolygon2D.prototype.IsInside_2 = function (point) {
        return this.IsInside(point.x, point.y);
    };
    return XPolygon2D;
}());
var XBounds2D = /** @class */ (function () {
    function XBounds2D(x1, y1, x2, y2) {
        this.x1 = x1 || Number.POSITIVE_INFINITY;
        this.y1 = y1 || Number.POSITIVE_INFINITY;
        this.x2 = x2 || Number.NEGATIVE_INFINITY;
        this.y2 = y2 || Number.NEGATIVE_INFINITY;
    }
    Object.defineProperty(XBounds2D.prototype, "midx", {
        get: function () {
            return (this.x1 + this.x2) / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XBounds2D.prototype, "midy", {
        get: function () {
            return (this.y1 + this.y2) / 2;
        },
        enumerable: false,
        configurable: true
    });
    XBounds2D.prototype.Update = function (x, y) {
        if (this.x1 > x)
            this.x1 = x;
        if (this.y1 > y)
            this.y1 = y;
        if (this.x2 < x)
            this.x2 = x;
        if (this.y2 < y)
            this.y2 = y;
    };
    XBounds2D.prototype.IsInside = function (x, y) {
        return ((x >= this.x1 && x <= this.x2) && (y >= this.y1 && y <= this.y2));
    };
    ;
    return XBounds2D;
}());
var XBounds3D = /** @class */ (function (_super) {
    __extends(XBounds3D, _super);
    function XBounds3D(x1, y1, z1, x2, y2, z2) {
        var _this = _super.call(this, x1, y1, x2, y2) || this;
        _this.x1 = x1 || Number.POSITIVE_INFINITY;
        _this.y1 = y1 || Number.POSITIVE_INFINITY;
        _this.z1 = z1 || Number.POSITIVE_INFINITY;
        _this.x2 = x2 || Number.NEGATIVE_INFINITY;
        _this.y2 = y2 || Number.NEGATIVE_INFINITY;
        _this.z2 = z2 || Number.NEGATIVE_INFINITY;
        return _this;
    }
    XBounds3D.prototype.Update = function (x, y, z) {
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
    };
    return XBounds3D;
}(XBounds2D));
var XVector = /** @class */ (function () {
    function XVector() {
    }
    XVector.prototype.cross = function (a, b) {
        a = a.length === 2 ? [a[0], a[1], 0] : a;
        b = b.length === 2 ? [b[0], b[1], 0] : b;
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    };
    XVector.prototype.length = function (v) {
        return Math.sqrt(v.slice(0, 3).reduce(function (p, w, i) {
            return p + w * w;
        }, 0));
    };
    XVector.prototype.dot = function (a, b) {
        return a.reduce(function (p, v, i) {
            return p + v * b[i];
        }, 0);
    };
    XVector.prototype.normalize = function (v) {
        var len = this.length(v);
        return v.slice(0, 3).map(function (i) { return i / len; });
    };
    XVector.prototype.add = function (a, b) {
        return a.slice(0, 3).map(function (v, i) { return v + b[i]; });
    };
    XVector.prototype.subtract = function (a, b) {
        return a.slice(0, 3).map(function (v, i) { return v - b[i]; });
    };
    return XVector;
}());
var XMouse = /** @class */ (function () {
    function XMouse(canvas) {
        this.down = new XPoint2D();
        this.rawdown = new XPoint2D();
        this.current = new XPoint2D();
        this.rawcurrent = new XPoint2D();
        this.previous = new XPoint2D();
        this.rawprevious = new XPoint2D();
        this.page = new XPoint2D();
        this.delta = 0;
        this.canvas = canvas;
    }
    XMouse.prototype.ToPoints = function () {
        return new XBounds2D(this.canvas.ToPointX(this.down.x), this.canvas.ToPointY(this.down.y), this.canvas.ToPointX(this.current.x), this.canvas.ToPointY(this.current.y));
    };
    ;
    XMouse.prototype.ToBounds = function () {
        if (this.down.x < this.current.x) {
            if (this.down.y > this.current.y) {
                return new XBounds2D(this.canvas.ToPointX(this.down.x), this.canvas.ToPointY(this.down.y), this.canvas.ToPointX(this.current.x), this.canvas.ToPointY(this.current.y));
            }
            else {
                return new XBounds2D(this.canvas.ToPointX(this.down.x), this.canvas.ToPointY(this.current.y), this.canvas.ToPointX(this.current.x), this.canvas.ToPointY(this.down.y));
            }
        }
        else {
            if (this.down.y > this.current.y) {
                return new XBounds2D(this.canvas.ToPointX(this.current.x), this.canvas.ToPointY(this.down.y), this.canvas.ToPointX(this.down.x), this.canvas.ToPointY(this.current.y));
            }
            else {
                return new XBounds2D(this.canvas.ToPointX(this.current.x), this.canvas.ToPointY(this.current.y), this.canvas.ToPointX(this.down.x), this.canvas.ToPointY(this.down.y));
            }
        }
    };
    ;
    XMouse.prototype.IsInside = function (x, y) {
        return ((x >= this.down.x && x <= this.current.x) || (x >= this.current.x && x <= this.down.x)) &&
            ((y >= this.down.y && y <= this.current.y) || (y >= this.current.y && y <= this.down.y));
    };
    ;
    return XMouse;
}());
;
//# sourceMappingURL=xentities.js.map