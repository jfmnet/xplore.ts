class XCanvas2DSettings {
    pointtolerance: number = 0.001;
    showruler: boolean = true;
    showusergrid: boolean = true;
    showgrid: boolean = true;
    showtoolbar: boolean = true;
    showpointer: boolean = true;

    allowzoom: boolean = true;
    allowpan: boolean = true;
    allowselect: boolean = true;

    snapongrid: boolean = true;
    snaponpoint: boolean = true;

    background: string = "#FFFFFF";

    axis: string = "#AAA";
    minor: string = "#EEEEEE";
    major: string = "#DDD";

    ruler: string = "#EEE";
    rulerposition: number = 0;
    rulertext: string = "#555";
    rulerline: string = "#AAA";
    fontcolor: string = "#000";
    usergrid: string = "#880";
    pointer: string = "#224";
    ischart: boolean = false;

    constructor() {
        this.DarkTheme();
    }

    LightTheme(): void {
        this.background = "#FFF";
        this.axis = "#CCC";
        this.major = "#DDD";
        this.minor = "#EEE";
        this.ruler = "#FFF";
        this.rulerposition = 1;     //0 - Outer; 1 - At (0, 0)
        this.rulertext = "#555";
        this.rulerline = "#AAA";
        this.fontcolor = "#000";
        this.usergrid = "#880";
    }

    DarkTheme(): void {
        this.background = "#0b0e10";
        this.axis = "#2d3b42";
        this.major = "#1f292e";
        this.minor = "#11171a";
        this.ruler = "#182024";
        this.rulerposition = 1;     //0 - Outer; 1 - At (0, 0)
        this.rulertext = "#888";
        this.rulerline = "#2d3b42";
        this.fontcolor = "#000";
        this.usergrid = "#880";
    }
}

class XCanvas2DSettingsModel {
    showgrid: Xplore.Checkbox;
    showusergrid: Xplore.Checkbox;
    showruler: Xplore.Checkbox;
    snapongrid: Xplore.Checkbox;
    snaponusergrid: Xplore.Checkbox;

    constructor(settings: XCanvas2DSettings) {
        this.showgrid = new Xplore.Checkbox({ text: "Show Grid", value: settings.showgrid, bind: { name: "showgrid", object: settings } });
        this.showusergrid = new Xplore.Checkbox({ text: "Show Custom Grid", value: settings.showusergrid, bind: { name: "showusergrid", object: settings } });
        this.showruler = new Xplore.Checkbox({ text: "Show Ruler", value: settings.showruler, bind: { name: "showruler", object: settings } });
    
        this.snapongrid = new Xplore.Checkbox({ text: "Snap On Grid", value: settings.snapongrid, bind: { name: "snapongrid", object: settings } });
        //this.snaponusergrid = new Xplore.Checkbox({ text: "Snap On Custom Grid", value: settings.snaponusergrid, bind: { name: "snaponusergrid", object: settings } });
    }
};

class XCanvas2D extends Xplore {
    //Canvas
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    buffer: HTMLCanvasElement;

    //Settings
    settings: XCanvas2DSettings = new XCanvas2DSettings();

    //Position
    top: number;
    left: number;

    //Dimensions
    width: number = 100;
    height: number = 100;
    rulersize: number = 30;

    //Grid
    defaultgridsize: number = 100;
    gridsize: number = 100;
    gridvalue: XPoint2D = new XPoint2D(1, 1);
    middle: XPoint2D = new XPoint2D();
    center: XPoint2D = new XPoint2D();
    gridinterval: number = 1;

    //Usergrid
    gridx: number[] = [];
    gridy: number[] = [];
    drawgrid: number = 0;

    //Mouse
    mouse: XMouse;

    //Events
    lock: string;
    shiftkey: boolean;
    ctrlkey: boolean;

    //Toolbar
    buttons: Xplore.Button[] = [];

    //Model
    model: XCanvas2DModel = new XCanvas2DModel();

    constructor() {
        super(null, "canvas");
    }


    //Initialization

    Refresh(): void {
        this.object.innerHTML = "";

        //Canvas and context
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("tabindex", "1");
        this.object.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        //Mouse
        this.mouse = new XMouse(this);

        this.Resize();
        this.Events();
        this.ShowToolbar();

        //Subscribe to the resize event
        if (!window.onresize) {
            let self = this;
            window.onresize = function () {
                self.Resize();
            };
        }
    }

    Resize(): void {
        let rect = this.object.getBoundingClientRect();
        this.top = rect.top;
        this.left = rect.left;

        this.width = this.object.clientWidth;
        this.height = this.object.clientHeight;

        if (!this.height) {
            this.width = this.canvas.clientWidth;
            this.height = this.canvas.clientHeight;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.UpdateCenter();
        this.UpdateCanvasScaleRatio();
        this.Render();
    }

    UpdateCenter(): void {
        if (this.settings.showruler && this.settings.rulerposition === 0)
            this.center = new XPoint2D(this.rulersize + Math.round((this.width - this.rulersize) / 2), this.rulersize + Math.round((this.height - this.rulersize) / 2));
        else
            this.center = new XPoint2D(this.width / 2, this.height / 2);
    }

    UpdateCanvasScaleRatio(): void {
        let ratio = window.devicePixelRatio || 1;
        let width = this.width;
        let height = this.height;

        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.context.scale(ratio, ratio);
    }

    StoreBuffer(): void {
        let self = this;

        this.buffer = this.RenderToCanvas(function (context) {
            self.context = context;
            self.Render();
        });

        this.context = this.canvas.getContext('2d');
    };

    RestoreBuffer(): void {
        if (!this.buffer)
            this.StoreBuffer();

        this.context.drawImage(this.buffer, 0, 0);
    };

    RenderToCanvas(renderFunction): HTMLCanvasElement {
        let canvas = document.createElement('canvas');
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        let context = canvas.getContext('2d');

        renderFunction(context);

        return canvas;
    };


    //Toolbar

    ShowToolbar(): void {
        if (this.settings.showtoolbar) {
            let self = this;
            let toolbar = new Xplore.Toolbar();

            for (let button of this.buttons)
                toolbar.Add(button);

            toolbar.Add(new Xplore.Button({
                icon: "magnify-plus-outline",
                onclick: function () {
                    self.ZoomIn();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-minus-outline",
                onclick: function () {
                    self.ZoomOut();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-scan",
                onclick: function () {
                    self.ZoomWindow();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-close",
                onclick: function () {
                    self.ZoomAll();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "cog-outline",
                onclick: function () {
                    self.ShowSettings();
                }
            }));

            toolbar.Show(this.object);
        }
    }


    //Rendering

    Render(): void {
        //Clear
        this.PrimitiveRectangle(0, 0, this.width, this.height, this.settings.background);

        if (this.settings.showgrid)
            this.DrawGrid();

        this.model.Render(this);

        if (this.settings.showruler)
            this.DrawRuler();

        // if (this.settings.showusergrid)
        //     this.DrawUserGrid();
    }

    DrawGrid(): void {
        let root: number = Math.pow(10, Math.round(Math.log(this.gridsize * this.gridvalue.x) / Math.LN10)) / 100;
        let gridinterval: number = this.gridvalue.x / root;

        let x1: number = this.ToCoordX(0);
        let x2: number = x1;
        let y1: number = this.ToCoordY(0);
        let y2: number = y1;

        let axisx: number = x1;
        let axisy: number = y1;

        let minorinterval: number = this.gridsize * gridinterval / 10;
        let majorinterval: number = minorinterval * 10;

        if (minorinterval < 10) {
            minorinterval *= 10;
            majorinterval *= 10;
        }

        this.gridinterval = this.ToPointWidth(minorinterval);

        this.SetProperties({
            linecolor: this.settings.minor,
            thickness: 1
        });

        //Minor x
        if (minorinterval >= 10) {
            while (x1 > 0 || x2 < this.width) {
                this.PrimitiveLine(x1, 0, x1, this.height);
                x1 -= minorinterval;
                x2 += minorinterval;
                this.PrimitiveLine(x2, 0, x2, this.height);
            }

            //Minor Y
            while (y1 > 0 || y2 < this.height) {
                this.PrimitiveLine(0, y1, this.width, y1);
                y1 -= minorinterval;
                y2 += minorinterval;
                this.PrimitiveLine(0, y2, this.width, y2);
            }
        }

        x1 = axisx;
        x2 = x1;
        y1 = axisy;
        y2 = y1;

        this.SetProperties({
            linecolor: this.settings.major
        });

        //Major x
        while (x1 > 0 || x2 < this.width) {
            this.PrimitiveLine(x1, 0, x1, this.height);

            x1 -= majorinterval;
            x2 += majorinterval;

            this.PrimitiveLine(x2, 0, x2, this.height);
        }

        //Major Y
        while (y1 > 0 || y2 < this.height) {
            this.PrimitiveLine(0, y1, this.width, y1);
            y1 -= majorinterval;
            y2 += majorinterval;
            this.PrimitiveLine(0, y2, this.width, y2);
        }

        //Axis
        x1 = axisx;
        x2 = x1;
        y1 = axisy;
        y2 = y1;

        this.SetProperties({
            linecolor: this.settings.axis,
            thickness: 1
        });

        this.PrimitiveLine(x1, 0, x1, this.height);
        this.PrimitiveLine(0, y1, this.width, y1);
    };

    DrawUserGrid(): void {
        let counter: number = 0;
        let coord: number = 7;

        this.SetTextProperties({
            horizontalalignment: "center",
            verticalalignment: "middle"
        });

        if (this.gridx.length > 1) {
            let x1: number;
            let x2: number
            let xm: number;

            for (let i = 0; i < this.gridx.length - 1; i++) {
                x1 = this.ToCoordX(this.gridx[i]);
                x2 = this.ToCoordX(this.gridx[i + 1]);
                xm = (x1 + x2) / 2;

                this.SetFillColor("#FFF");
                this.PrimitiveText((this.gridx[i + 1] - this.gridx[i]).toFixed(3), xm, this.rulersize - coord);
            }
        }

        if (this.gridy.length > 1) {
            let y1: number;
            let y2: number
            let ym: number;

            for (let i = 0; i < this.gridy.length - 1; i++) {
                y1 = this.ToCoordY(this.gridy[i]);
                y2 = this.ToCoordY(this.gridy[i + 1]);
                ym = (y1 + y2) / 2;

                this.SetFillColor("#FFF");
                this.PrimitiveText((this.gridy[i + 1] - this.gridy[i]).toFixed(3), this.rulersize - coord, ym, -Math.PI / 2);
            }
        }

        this.SetProperties({
            linecolor: this.settings.usergrid,
            thickness: 0.5,
            fillcolor: "#FF0"
        });

        for (let x of this.gridx) {
            x = this.ToCoordX(x);
            this.PrimitiveLine(x, 0, x, this.height, [2, 2]);

            this.PrimitiveText(String.fromCharCode(65 + counter), x, this.rulersize - coord);
            counter++;
        }

        counter = 1;

        for (let y of this.gridy) {
            y = this.ToCoordY(y);
            this.PrimitiveLine(0, y, this.width, y, [2, 2]);

            this.PrimitiveText(counter.toString(), this.rulersize - coord, y);
            counter++;
        }
    };

    DrawRuler(): void {
        if (this.settings.rulerposition === 0)
            this.DrawRulerOuter();
        else
            this.DrawRulerInner();
    };

    DrawRulerOuter(): void {
        let font: string = "normal 10px sans-serif";
        let fontcolor: string = this.settings.rulertext;

        let x1: number = 0;
        let y1: number = 0;
        let angle: number = Math.PI * 270 / 180;

        let root: number = Math.pow(10, Math.round(Math.log(this.gridsize) / Math.LN10)) / 100;
        let intervalx: number = this.gridvalue.x / root;
        let intervaly: number = this.gridvalue.y / root;
        let intervalsize: number = this.ToCoordWidth(intervalx);

        if (intervalsize <= 50) {
            intervalx *= 5;
            intervaly *= 5;
        }
        else if (intervalsize <= 75) {
            intervalx *= 2;
            intervaly *= 2;
        }

        let x2: number = x1 + intervalx;
        let y2: number = y1 + intervaly;

        let round: number = 0;

        if (intervalx <= 10)
            round = 2;

        let x: number = this.rulersize;
        let y: number = this.rulersize;
        let cy: number = this.height - y;

        //Major x
        let px1: number = this.ToCoordX(x1);
        let px2: number = this.ToCoordX(x2);

        let labelpos: number = 10;

        this.PrimitiveRectangle(0, 0, this.rulersize, this.height, this.settings.ruler, this.settings.ruler);
        this.PrimitiveRectangle(0, 0, this.width, this.rulersize, this.settings.ruler, this.settings.ruler);

        this.SetTextProperties({
            horizontalalignment: "center",
            verticalalignment: "top",
            font: font,
            color: fontcolor
        });

        while (px1 >= 0 || px2 < this.width) {
            if (this.gridvalue.x >= 1 && this.gridvalue.x <= 100) {
                if (px1 >= x && px1 < this.width) {
                    if (Math.abs(x1) >= 10000)
                        this.PrimitiveText(x1.toExponential(1), px1, labelpos);
                    else
                        this.PrimitiveText(x1.toFixed(round), px1, labelpos);

                    this.PrimitiveLine_2(px1, this.rulersize - 5, px1, this.rulersize, this.settings.rulerline, 2);
                }

                if (px2 < this.width && px2 >= x) {
                    if (Math.abs(x2) >= 10000)
                        this.PrimitiveText(x2.toExponential(1), px2, labelpos);
                    else
                        this.PrimitiveText(x2.toFixed(round), px2, labelpos);

                    this.PrimitiveLine_2(px2, this.rulersize - 5, px2, this.rulersize, this.settings.rulerline, 2);
                }
            } else {
                if (px1 >= x && px1 < this.width) {
                    if (Math.abs(x1) >= 10000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(x1.toExponential(1), px1, labelpos);
                    else
                        this.PrimitiveText(x1.toFixed(round), px1, labelpos);

                    this.PrimitiveLine_2(px1, this.rulersize - 5, px1, this.rulersize, this.settings.rulerline, 2);
                }

                if (px2 < this.width && px2 >= x) {
                    if (Math.abs(x2) >= 10000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(x2.toExponential(1), px2, labelpos);
                    else
                        this.PrimitiveText(x2.toFixed(round), px2, labelpos);

                    this.PrimitiveLine_2(px2, this.rulersize - 5, px2, this.rulersize, this.settings.rulerline, 2);
                }
            }

            x1 -= intervalx;
            x2 += intervalx;

            px1 = this.ToCoordX(x1);
            px2 = this.ToCoordX(x2);
        }

        //Major Y
        let py1: number = this.ToCoordY(y1);
        let py2: number = this.ToCoordY(y2);

        this.SetTextProperties({
            horizontalalignment: "center",
            verticalalignment: "bottom",
            font: font,
            color: fontcolor
        });

        while (py2 > y || py1 <= this.height) {
            if (this.gridvalue.y >= 1 && this.gridvalue.y <= 100) {
                if (py1 > y && py1 <= this.height) {
                    if (Math.abs(y1) >= 10000)
                        this.PrimitiveText(y1.toExponential(1), x - labelpos, py1, angle);
                    else
                        this.PrimitiveText(y1.toFixed(round), x - labelpos, py1, angle);

                    this.PrimitiveLine_2(x - 5, py1, x, py1, this.settings.rulerline, 2);
                }

                if (py2 <= this.height && py2 > y) {
                    if (Math.abs(y2) >= 10000)
                        this.PrimitiveText(y2.toExponential(1), x - labelpos, py2, angle);
                    else
                        this.PrimitiveText(y2.toFixed(round), x - labelpos, py2, angle);

                    this.PrimitiveLine_2(x - 5, py2, x, py2, this.settings.rulerline, 2);
                }
            } else {
                if (py1 > y && py1 <= this.height) {
                    if (Math.abs(y1) >= 10000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(y1.toExponential(1), x - labelpos, py1, angle);
                    else
                        this.PrimitiveText(y1.toFixed(round), x - labelpos, py1, angle);

                    this.PrimitiveLine_2(x - 5, py1, x, py1, this.settings.rulerline, 2);
                }

                if (py2 <= this.height && py2 > y) {
                    if (Math.abs(y1) >= 10000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(y2.toExponential(1), x - labelpos, py2, angle);
                    else
                        this.PrimitiveText(y2.toFixed(round), x - labelpos, py2, angle);

                    this.PrimitiveLine_2(x - 5, py2, x, py2, this.settings.rulerline, 2);
                }
            }

            y1 -= intervaly;
            y2 += intervaly;

            py1 = this.ToCoordY(y1);
            py2 = this.ToCoordY(y2);
        }

        this.PrimitiveLine_2(x, y, x, this.height, this.settings.rulerline, 2);
        this.PrimitiveLine_2(x, y, this.width, y, this.settings.rulerline, 2);
    };

    DrawRulerInner(): void {
        let font: string = "normal 10px sans-serif";
        let fontcolor: string = this.settings.rulertext;

        let x1: number = 0;
        let y1: number = 0;

        let root: number = Math.pow(10, Math.round(Math.log(this.gridsize) / Math.LN10)) / 100;
        let intervalx: number = this.gridvalue.x / root;
        let intervaly: number = this.gridvalue.y / root;
        let intervalsize: number = this.ToCoordWidth(intervalx);

        if (intervalsize <= 50) {
            intervalx *= 5;
            intervaly *= 5;
        }
        else if (intervalsize <= 75) {
            intervalx *= 2;
            intervaly *= 2;
        }

        let x2: number = x1;
        let y2: number = y1;

        let round: number = 0;

        if (intervalx <= 10)
            round = 2;

        let x: number = this.rulersize;
        let y: number = this.rulersize;
        let cy: number = this.height - y;

        //X
        let px1: number = this.ToCoordX(0);
        let px2: number = this.ToCoordX(0);

        let labelpos: number = this.ToCoordY(0) + 10;
        let align: CanvasTextBaseline = "top";

        if (labelpos < 10) {
            labelpos = 10;
            this.PrimitiveRectangle(0, 0, this.width, y, this.settings.ruler, this.settings.ruler);
            this.PrimitiveLine_2(0, y, this.width, y, this.settings.rulerline, 2);
        }

        if (labelpos > this.height - 10) {
            labelpos = this.height - 10;
            align = "bottom";

            y = this.height - this.rulersize;
            this.PrimitiveRectangle(0, y, this.width, this.height, this.settings.ruler, this.settings.ruler);
            this.PrimitiveLine_2(0, y, this.width, y, this.settings.rulerline, 2);
        }

        x = 0;
        y = 0;

        while (px1 >= 0 || px2 < this.width) {
            if (this.gridvalue.x >= 1 && this.gridvalue.x <= 100) {
                if (px1 >= x && px1 < this.width) {
                    if (x1 !== 0) {
                        if (Math.abs(x1) >= 100000)
                            this.PrimitiveText_2(x1.toExponential(1), px1, labelpos, font, fontcolor, 0, "center", align);
                        else
                            this.PrimitiveText_2(x1.toFixed(round), px1, labelpos, font, fontcolor, 0, "center", align);
                    } else
                        this.PrimitiveText_2(x1.toFixed(round), px1 + 5, labelpos, font, fontcolor, 0, "left", align);

                    this.PrimitiveLine_2(px1, labelpos - 10, px1, labelpos - 5, this.settings.axis, 2);
                }

                if (px2 < this.width && px2 >= x) {
                    if (x2 !== 0) {
                        if (Math.abs(x2) >= 100000)
                            this.PrimitiveText_2(x2.toExponential(1), px2, labelpos, font, fontcolor, 0, "center", align);
                        else
                            this.PrimitiveText_2(x2.toFixed(round), px2, labelpos, font, fontcolor, 0, "center", align);
                    }

                    this.PrimitiveLine_2(px2, labelpos - 10, px2, labelpos - 5, this.settings.axis, 2);
                }
            } else {
                if (px1 >= x && px1 < this.width) {
                    if (x1 !== 0) {
                        if (Math.abs(x1) >= 100000 || this.gridvalue.x <= 0.01)
                            this.PrimitiveText_2(x1.toExponential(1), px1, labelpos, font, fontcolor, 0, "center", align);
                        else
                            this.PrimitiveText_2(x1.toFixed(round), px1, labelpos, font, fontcolor, 0, "center", align);
                    } else
                        this.PrimitiveText_2(x1.toFixed(round), px1 + 5, labelpos, font, fontcolor, 0, "left", align);

                    this.PrimitiveLine_2(px1, labelpos - 10, px1, labelpos - 5, this.settings.axis, 2);
                }

                if (px2 < this.width && px2 >= x) {
                    if (x2 !== 0) {
                        if (Math.abs(x2) >= 100000 || this.gridvalue.x <= 0.01)
                            this.PrimitiveText_2(x2.toExponential(1), px2, labelpos, font, fontcolor, 0, "center", align);
                        else
                            this.PrimitiveText_2(x2.toFixed(round), px2, labelpos, font, fontcolor, 0, "center", align);
                    }

                    this.PrimitiveLine_2(px2, labelpos - 10, px2, labelpos - 5, this.settings.axis, 2);
                }
            }

            x1 -= intervalx;
            x2 += intervalx;

            px1 = this.ToCoordX(x1);
            px2 = this.ToCoordX(x2);
        }

        //Y
        let py1: number = this.ToCoordY(y1);
        let py2: number = this.ToCoordY(y2);

        let halign: CanvasTextAlign = "left";
        let angle: number = 0;

        x = this.ToCoordX(0) + 10;

        if (x < 10) {
            halign = "center";
            x = 10;
            angle = Math.PI * 1.5;

            this.PrimitiveRectangle(0, 0, this.rulersize, this.height, this.settings.ruler, this.settings.ruler);
            this.PrimitiveLine_2(this.rulersize, y, this.rulersize, this.height, this.settings.rulerline, 2);
        }

        if (x > this.width - 10) {
            x = this.width - 10;
            halign = "center";
            angle = Math.PI / 2;

            y = this.width - this.rulersize;
            this.PrimitiveRectangle(y, 0, this.width, this.height, this.settings.ruler, this.settings.ruler);
            this.PrimitiveLine_2(y, 0, y, this.height, this.settings.rulerline, 2);
        }

        y = 0;

        while (py2 > y || py1 <= this.height) {
            if (this.gridvalue.y >= 1 && this.gridvalue.y <= 100) {
                if (py1 > y && py1 <= this.height) {
                    if (y1 !== 0) {
                        if (Math.abs(y1) >= 10000)
                            this.PrimitiveText_2(y1.toExponential(1), x, py1, font, fontcolor, angle, halign, "middle");
                        else
                            this.PrimitiveText_2(y1.toFixed(round), x, py1, font, fontcolor, angle, halign, "middle");
                    }

                    this.PrimitiveLine_2(x - 10, py1, x - 5, py1, this.settings.axis, 2);
                }

                if (py2 <= this.height && py2 > y) {
                    if (y2 !== 0) {
                        if (Math.abs(y2) >= 100000)
                            this.PrimitiveText_2(y2.toExponential(1), x, py2, font, fontcolor, angle, halign, "middle");
                        else
                            this.PrimitiveText_2(y2.toFixed(round), x, py2, font, fontcolor, angle, halign, "middle");
                    }

                    this.PrimitiveLine_2(x - 10, py2, x - 5, py2, this.settings.axis, 2);
                }
            } else {
                if (py1 > y && py1 <= this.height) {
                    if (y1 !== 0) {
                        if (Math.abs(y1) >= 100000 || this.gridvalue.x <= 0.01)
                            this.PrimitiveText_2(y1.toExponential(1), x, py1, font, fontcolor, angle, halign, "middle");
                        else
                            this.PrimitiveText_2(y1.toFixed(round), x, py1, font, fontcolor, angle, halign, "middle");
                    }

                    this.PrimitiveLine_2(x - 10, py1, x - 5, py1, this.settings.axis, 2);
                }

                if (py2 <= this.height && py2 > y) {
                    if (y2 !== 0) {
                        if (Math.abs(y1) >= 100000 || this.gridvalue.x <= 0.01)
                            this.PrimitiveText_2(y2.toExponential(1), x, py2, font, fontcolor, angle, halign, "bottom");
                        else
                            this.PrimitiveText_2(y2.toFixed(round), x, py2, font, fontcolor, angle, halign, "bottom");
                    }

                    this.PrimitiveLine_2(x - 10, py2, x - 5, py2, this.settings.axis, 2);
                }
            }

            y1 -= intervaly;
            y2 += intervaly;

            py1 = this.ToCoordY(y1);
            py2 = this.ToCoordY(y2);
        }
    };


    //Properties

    SetProperties(properties: XDrawProperties): void {
        if (properties.linecolor)
            this.context.strokeStyle = properties.linecolor;

        if (properties.thickness) {
            if (properties.scale)
                this.context.lineWidth = properties.thickness * this.gridsize / (this.defaultgridsize * this.gridvalue.x);
            else
                this.context.lineWidth = properties.thickness;

            if (this.context.lineWidth < 1)
                this.context.lineWidth = 1;
        }

        if (properties.fillcolor)
            this.context.fillStyle = properties.fillcolor;
    };

    SetTextProperties(properties: XTextProperties): void {
        if (properties.horizontalalignment)
            this.context.textAlign = properties.horizontalalignment;
        else
            this.context.textAlign = 'center';

        if (properties.verticalalignment)
            this.context.textBaseline = properties.verticalalignment;
        else
            this.context.textBaseline = "bottom";

        if (properties.color)
            this.context.fillStyle = properties.color;

        if (properties.font)
            this.context.font = properties.font;
    };

    SetFillColor(color: string): void {
        this.context.fillStyle = color;
    };


    //Primitives

    PrimitiveLine(x1: number, y1: number, x2: number, y2: number, dashline?: number[]): void {
        this.context.beginPath();

        if (dashline) {
            this.context.save();

            if (dashline) {
                let linedash = [];

                for (let i = 0; i < dashline.length; i++)
                    linedash.push(dashline[i] * 2);

                this.context.setLineDash(linedash);
            }
        }

        this.context.moveTo(x1 - 0.5, y1 - 0.5);
        this.context.lineTo(x2 - 0.5, y2 - 0.5);
        this.context.stroke();

        if (dashline)
            this.context.restore();
    };

    PrimitiveLine_2(x1: number, y1: number, x2: number, y2: number, color: string, linewidth: number, dashline?: number[]): void {
        this.context.beginPath();

        if (dashline) {
            this.context.save();

            if (dashline) {
                let linedash = [];

                for (let i = 0; i < dashline.length; i++)
                    linedash.push(dashline[i] * 2);

                this.context.setLineDash(linedash);
            }
        }

        this.context.moveTo(x1 - 0.5, y1 - 0.5);
        this.context.lineTo(x2 - 0.5, y2 - 0.5);
        this.context.strokeStyle = color;

        if (isNaN(linewidth))
            this.context.lineWidth = 1;
        else
            this.context.lineWidth = linewidth;

        this.context.stroke();

        if (dashline)
            this.context.restore();
    };

    PrimitiveRectangle(x: number, y: number, w: number, h: number, fillcolor?: string, linecolor?: string, linewidth: number = 1): void {
        if (fillcolor) {
            this.context.fillStyle = fillcolor;
            this.context.fillRect(x, y, w, h);
        }

        if (linecolor) {
            this.context.strokeStyle = linecolor;
            this.context.lineWidth = linewidth;
            this.context.strokeRect(x, y, w, h);
        }
    };

    PrimitivePolygon(points: XPoint2D[], showfill?: boolean, showline?: boolean) {
        if (points.length !== 0) {
            let context = this.context;

            context.beginPath();

            //First point
            let x = points[0].x;
            let y = points[0].y;
            context.moveTo(x, y);

            //Second to the last point
            for (let i = 1; i < points.length; i++) {
                x = points[i].x;
                y = points[i].y;
                context.lineTo(x, y);
            }

            context.closePath();

            if (showfill)
                context.fill();

            if (showline)
                context.stroke();
        }
    }

    PrimitiveText(text: string, x: number, y: number, a: number = 0): void {
        if (a === 0) {
            this.context.fillText(text, x, y);

        } else {
            this.context.save();
            this.context.translate(x, y);
            this.context.rotate(a);
            this.context.fillText(text, 0, 0);
            this.context.restore();
        }
    };

    PrimitiveText_2(text: string, x: number, y: number, font: string, color: string, a: number, ha: CanvasTextAlign, va: CanvasTextBaseline): void {
        if (a === null) {
            if (ha !== undefined)
                this.context.textAlign = ha;

            if (va !== undefined)
                this.context.textBaseline = va;

            this.context.fillStyle = color;
            this.context.font = font;
            this.context.fillText(text, x, y);

        } else {
            this.context.save();

            if (ha !== undefined)
                this.context.textAlign = ha;
            else
                this.context.textAlign = 'center';

            if (va !== undefined)
                this.context.textBaseline = va;
            else
                this.context.textBaseline = "bottom";

            this.context.fillStyle = color;
            this.context.font = font;
            this.context.translate(x, y);
            this.context.rotate(a);
            this.context.fillText(text, 0, 0);
            this.context.restore();
        }
    };

    DrawLine(x1: number, y1: number, x2: number, y2: number): void {
        x1 = this.ToCoordX(x1);
        y1 = this.ToCoordY(y1);

        x2 = this.ToCoordX(x2);
        y2 = this.ToCoordY(y2);

        this.context.beginPath();
        this.context.moveTo(x1 - 0.5, y1 - 0.5);
        this.context.lineTo(x2 - 0.5, y2 - 0.5);
        this.context.stroke();
    }

    DrawLine_2(x1: number, y1: number, x2: number, y2: number, properties: XDrawProperties): void {
        x1 = this.ToCoordX(x1);
        y1 = this.ToCoordY(y1);

        x2 = this.ToCoordX(x2);
        y2 = this.ToCoordY(y2);

        this.context.beginPath();
        this.context.moveTo(x1 - 0.5, y1 - 0.5);
        this.context.lineTo(x2 - 0.5, y2 - 0.5);
        this.context.strokeStyle = properties.linecolor;

        if (isNaN(properties.thickness))
            this.context.lineWidth = 1;
        else
            this.context.lineWidth = properties.thickness;

        this.context.stroke();
    }

    DrawRectangle(x: number, y: number, w: number, h: number, showfill?: boolean, showline?: boolean) {
        let ratio: number = this.gridsize / this.gridvalue.x;
        w = ratio * w;
        h = ratio * h;

        x = this.ToCoordX(x) - w / 2;
        y = this.ToCoordY(y) - h / 2;

        let context: CanvasRenderingContext2D = this.context;

        if (showfill || showfill === undefined)
            context.fillRect(x, y, w, h);

        if (showline || showline === undefined)
            context.strokeRect(x, y, w, h);
    };

    DrawPolygon_2(points: XPoint2D[], properties: XDrawProperties) {
        if (points.length !== 0) {
            let context = this.context;

            this.SetProperties(properties);

            context.beginPath();

            //First point
            let x = this.ToCoordX(points[0].x);
            let y = this.ToCoordY(points[0].y);
            context.moveTo(x, y);

            //Second to the last point
            for (let i = 1; i < points.length; i++) {
                x = this.ToCoordX(points[i].x);
                y = this.ToCoordY(points[i].y);
                context.lineTo(x, y);
            }

            context.closePath();

            if (properties.showfill)
                context.fill();

            if (properties.showline)
                context.stroke();
        }
    }

    DrawCircle(x: number, y: number, r: number, properties: XDrawProperties, fixedsize: boolean = false): void {
        if (!fixedsize)
            r = this.gridsize * r / this.gridvalue.x;

        x = this.ToCoordX(x);
        y = this.ToCoordY(y);

        let context = this.context;

        this.SetProperties(properties);

        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.closePath();

        if (properties.showfill)
            context.fill();

        if (properties.showline)
            context.stroke();
    };
    SelectRectangle(x: number, y: number, w: number, h: number, linecolor: string) {
        this.context.save();
        this.context.strokeStyle = linecolor;
        this.context.lineWidth = 1;

        this.context.setLineDash([4, 2]);
        this.context.lineDashOffset = 2;
        this.context.strokeRect(x, y, w, h);
        this.context.restore();
    };


    //Conversion

    ToCoordX(pointx: number): number {
        return Math.round(this.center.x + (pointx / this.gridvalue.x - this.middle.x) * this.gridsize);
    };

    ToCoordY(pointy: number): number {
        return Math.round(this.center.y - (pointy / this.gridvalue.y - this.middle.y) * this.gridsize);
    };

    ToPointX(coordx: number): number {
        return (this.middle.x - (this.center.x - coordx) / this.gridsize) * this.gridvalue.x;
    };

    ToPointY(coordy: number): number {
        return (this.middle.y + (this.center.y - coordy) / this.gridsize) * this.gridvalue.y;
    };

    ToPointWidth(pointwidth: number): number {
        return (pointwidth / this.gridsize) * this.gridvalue.y;
    };

    ToCoordWidth(coordwidth: number): number {
        return (coordwidth * this.gridsize) / this.gridvalue.x;
    };


    //Drawing
    Draw(draw: any): void {
        this.model.Draw(draw);
    }


    //Zoom

    ZoomAll(): void {
        if (this.settings.ischart)
            this.ZoomChart();
        else
            this.ZoomNormal();
    }

    private ZoomNormal(): void {
        let bounds: XBounds2D;
        let factor: number = 1.25;

        //Compute bounds
        bounds = this.model.Bounds();

        this.Resize();

        if (bounds.x1 > 1000000000 && this.gridx.length > 1 && this.gridy.length > 1) {
            bounds.x1 = this.gridx[0];
            bounds.x2 = this.gridx[this.gridx.length - 1];

            bounds.y1 = this.gridy[0];
            bounds.y2 = this.gridy[this.gridy.length - 1];
        }

        //Check if width and height is already available
        if (this.width && this.height && bounds.x1 < 1000000000) {
            let x1: number = bounds.x1;
            let y1: number = bounds.y1;

            let x2: number = bounds.x2;
            let y2: number = bounds.y2;

            let mid = new XPoint2D((x1 + x2) / 2, (y1 + y2) / 2);
            let difference = new XPoint2D(Math.abs(x1 - x2) / this.gridvalue.x, Math.abs(y1 - y2) / this.gridvalue.y);

            if ((difference.x / difference.y >= this.width / this.height)) {
                if (difference.x === 0)
                    return;

                this.gridsize = this.width / (factor * difference.x);

            } else {
                if (difference.y === 0)
                    return;

                this.gridsize = this.height / (factor * difference.y);
            }

            if (this.gridsize > 1000) {
                this.gridsize /= 10;
                this.gridvalue.x /= 10;
                this.gridvalue.y /= 10;

            } else if (this.gridsize >= 10) {

            } else if (this.gridsize >= 1) {
                this.gridsize *= 5;
                this.gridvalue.x *= 5;
                this.gridvalue.y *= 5;

            } else {
                this.gridsize *= 10;
                this.gridvalue.x *= 10;
                this.gridvalue.y *= 10;
            }

            this.middle.x = mid.x / this.gridvalue.x;
            this.middle.y = mid.y / this.gridvalue.y;

            this.Render();

        } else {
            this.gridvalue = new XPoint2D(5, 5);
            this.gridsize = 20;

            this.Render();
        }

        this.StoreBuffer();
    }

    private ZoomChart(): void {
        //Compute bounds
        let bounds: XBounds2D = this.model.Bounds();
        let uniformscale: boolean = false;

        this.Resize();

        //Check if width and height is already available
        if (bounds && this.width && this.height && bounds.x1 < 1000000000) {
            bounds.Update(0, 0);

            var x1 = bounds.x1;
            var y1 = bounds.y1;
            var x2 = bounds.x2;
            var y2 = bounds.y2;

            let factor = 1.1;
            var mid = new XPoint2D((x1 + x2) / 2, (y1 + y2) / 2);

            if (uniformscale) {
                let max = Math.max((x2 - x1) * this.gridsize / this.width * factor, (y2 - y1) * this.gridsize / this.height * factor);
                this.gridvalue.x = max;
                this.gridvalue.y = max;

            } else {
                this.gridvalue.x = (x2 - x1) * this.gridsize / this.width * factor;
                this.gridvalue.y = (y2 - y1) * this.gridsize / this.height * factor;
            }

            if (this.gridvalue.x === 0)
                this.gridvalue.x = 1;

            if (this.gridvalue.y === 0)
                this.gridvalue.y = 1;

            if (this.settings.showruler) {
                this.middle.x = mid.x / this.gridvalue.x;
                this.middle.y = mid.y / this.gridvalue.y;
            } else {
                this.middle.x = mid.x / this.gridvalue.x;
                this.middle.y = mid.y / this.gridvalue.y;
            }

            this.Render();
        }
    };

    Zoom(x: number, y: number, d: number): void {
        let prev: XPoint2D = new XPoint2D(this.ToPointX(x), this.ToPointY(y));
        this.ZoomRealtime(d);

        let curr: XPoint2D = new XPoint2D(this.ToPointX(x), this.ToPointY(y));
        this.MoveByPoint(curr, prev);

        this.Render();
    }

    ZoomIn(): void {
        this.gridsize *= 1.15;

        if (this.gridvalue.x <= 1 && this.gridsize > 200)
            this.gridsize = 200;

        this.Render();
        this.StoreBuffer();
    }

    ZoomOut(): void {
        this.gridsize /= 1.15;

        if (this.gridvalue.x <= 1 && this.gridsize > 200)
            this.gridsize = 200;

        this.Render();
        this.StoreBuffer();
    }

    ZoomRealtime(d: number): void {
        let mult = this.gridsize * d;
        let size = this.gridsize + (mult / 100);

        if (size > 1000) {
            this.gridsize = Math.round(size) / 10;
            this.gridvalue.x /= 10;
            this.gridvalue.y /= 10;

        } else if (size >= 10)
            this.gridsize = Math.round(size);

        else {
            this.gridsize = size * 10;
            this.gridvalue.x *= 10;
            this.gridvalue.y *= 10;
        }
    }

    ZoomWindow(): void {
    }

    MoveByPoint(current: XPoint2D, previous: XPoint2D): void {
        if (!(current.x === previous.x && current.y === previous.y)) {
            this.middle.x -= (current.x - previous.x) / this.gridvalue.x;
            this.middle.y -= (current.y - previous.y) / this.gridvalue.y;
        }
    }

    Pan(x, y): void {
        this.middle.x -= x / this.gridsize;
        this.middle.y -= y / this.gridsize;
    }

    //Events

    Events(): void {
        let self: XCanvas2D = this;
        let button: number = 0;
        let ontouch: number = 0;
        let onenter: boolean = false;
        let onfocus: boolean = true;
        let start: number = 0;
        let onmousedown: boolean = false;

        document.body.onkeydown = function (event) {
            let active = document.activeElement;

            if (active.localName === "canvas") {
                if (self.drawgrid && event.key === "Escape") {
                    self.RestoreBuffer();
                    self.drawgrid = -1;
                }
                else {
                    if (!event.ctrlKey && event.key === "x")
                        self.lock = "X";
                    else if (!event.ctrlKey && event.key === "y")
                        self.lock = "Y";
                    else if (!event.ctrlKey && event.key === "a")
                        self.lock = "A";
                    else if (!event.ctrlKey && event.key === "u")
                        self.lock = "";

                    self.shiftkey = event.shiftKey;
                    self.ctrlkey = event.ctrlKey;
                    self.model.KeyDown(self, event);
                }
            }
        };

        document.body.onkeyup = function (event) {
            let active = document.activeElement;

            if (active.localName === "canvas") {
                self.shiftkey = event.shiftKey;
                self.ctrlkey = event.ctrlKey;
                self.model.KeyUp(self, event);
            }
        };

        this.canvas.addEventListener("mouseleave", function (event) {
            onfocus = false;
        });

        this.canvas.addEventListener("mouseenter", function (event) {
            event.preventDefault();
            onenter = true;
        });

        this.canvas.addEventListener("mouseleave", function (event) {
            event.preventDefault();
            onenter = false;
            onfocus = true;
        });

        this.canvas.addEventListener("dblclick", function (event) {
            event.preventDefault();
            button = event.button;

            let x = event.pageX;
            let y = event.pageY;

            self.DoubleClick(x, y, button);
            onmousedown = false;
        });

        this.canvas.addEventListener("mousedown", function (event) {
            event.preventDefault();
            onmousedown = true;
            button = event.buttons;

            let x = event.pageX - self.left;
            let y = event.pageY - self.top;

            self.MouseDown(x, y, button, event.pageX, event.pageY);

            onfocus = true;
        });

        this.canvas.addEventListener("mousemove", function (event) {
            if (onfocus) {
                event.preventDefault();
                button = event.buttons;

                let x = event.pageX - self.left;
                let y = event.pageY - self.top;

                self.MouseMove(x, y, button);
            }
        });

        this.canvas.addEventListener("mouseup", function (event) {
            event.preventDefault();
            onmousedown = false;
            let movebutton = button;

            button = 0;

            let x = event.pageX - self.left;
            let y = event.pageY - self.top;

            self.MouseUp(x, y, movebutton);
        });

        this.canvas.addEventListener('wheel', function (event) {
            event.preventDefault();

            if (onenter) {
                let delta = event.detail ? -event.detail / 4 : event.deltaY / 240

                if (event.deltaY)
                    delta = event.deltaY / 240;

                let x = event.pageX - self.left;
                let y = event.pageY - self.top;

                self.MouseWheel(x, y, -delta);
            }
        });
    }

    DoubleClick(x: number, y: number, button: number): void {
        //On ruler
        if (this.settings.rulerposition === 0) {
            if (x < this.rulersize + 20) {
                if (this.gridy.length > 1) {
                    let y1: number, y2: number, ym: number;

                    for (let i = 0; i < this.gridy.length - 1; i++) {
                        y1 = this.ToCoordY(this.gridy[i]);
                        y2 = this.ToCoordY(this.gridy[i + 1]);
                        ym = (y1 + y2) / 2;

                        if (y > ym - 20 && x < ym + 20) {
                            this.EditUserGrid("Y");
                            break;
                        }
                    }
                }

            } else if (y < this.rulersize + 20) {
                if (this.gridx.length > 1) {
                    let x1: number, x2: number, xm: number;

                    for (let i = 0; i < this.gridx.length - 1; i++) {
                        x1 = this.ToCoordX(this.gridx[i]);
                        x2 = this.ToCoordX(this.gridx[i + 1]);
                        xm = (x1 + x2) / 2;

                        if (x > xm - 20 && x < xm + 20) {
                            this.EditUserGrid("X");
                            break;
                        }
                    }
                }
            }
        }
    }

    MouseDown(x: number, y: number, button: number, px: number, py: number): void {
        this.canvas.focus();

        //On ruler
        if (this.settings.rulerposition === 0) {
            if (x < this.rulersize) {
                this.StoreBuffer();
                this.drawgrid = 1;

            } else if (y < this.rulersize) {
                this.StoreBuffer();
                this.drawgrid = 2;
            }
        }

        this.mouse.page = new XPoint2D(px, py);

        this.mouse.down.x = this.ToPointX(x);
        this.mouse.down.y = this.ToPointY(y);

        this.mouse.rawdown.x = x;
        this.mouse.rawdown.y = y;

        this.mouse.previous.x = this.mouse.down.x;
        this.mouse.previous.y = this.mouse.down.y;

        this.mouse.rawprevious.x = x;
        this.mouse.rawprevious.y = y;

        if (!this.drawgrid)
            this.model.MouseDown(this, this.mouse, button);
    }

    MouseMove(x: number, y: number, button: number): void {
        this.mouse.current.x = this.ToPointX(x);
        this.mouse.current.y = this.ToPointY(y);

        this.mouse.rawcurrent.x = x;
        this.mouse.rawcurrent.y = y;

        if (this.drawgrid === 1) {
            if (this.settings.snapongrid)
                x = this.ToCoordX(this.SnapOnGrid(this.mouse.current).x);

            this.RestoreBuffer();
            this.PrimitiveLine_2(x, 0, x, this.height, "#F80", 0.5, [4, 2]);

        } else if (this.drawgrid === 2) {
            this.RestoreBuffer();
            this.PrimitiveLine_2(0, y, this.width, y, "#F80", 0.5, [4, 2]);

        } else {
            this.model.MouseMove(this, this.mouse, button);

            this.mouse.previous.x = this.mouse.current.x;
            this.mouse.previous.y = this.mouse.current.y;

            this.mouse.rawprevious.x = x;
            this.mouse.rawprevious.y = y;
        }
    }

    MouseUp(x: number, y: number, button: number): void {
        this.mouse.current.x = this.ToPointX(x);
        this.mouse.current.y = this.ToPointY(y);

        if (this.drawgrid === 1) {
            this.drawgrid = 0;

            if (x > this.rulersize) {
                this.gridx.push(this.mouse.current.x);

                this.gridx.sort(function (a, b) {
                    if (a > b)
                        return 1;
                    else if (a < b)
                        return -1;
                    else
                        return 0;
                });

                this.Render();
            }

        } else if (this.drawgrid === 2) {
            this.drawgrid = 0;

            if (y > this.rulersize) {
                this.gridy.push(this.mouse.current.y);

                this.gridy.sort(function (a, b) {
                    if (a > b)
                        return 1;
                    else if (a < b)
                        return -1;
                    else
                        return 0;
                });

                this.Render();
            }

        } else if (this.drawgrid === -1) {
            this.drawgrid = 0;

        } else {
            this.model.MouseUp(this, this.mouse, button);
        }

        this.StoreBuffer();
    }

    MouseWheel(x: number, y: number, delta: number): void {
        if (this.settings.allowzoom) {
            //Set current mouse position
            this.mouse.current.x = x;
            this.mouse.current.y = y;
            this.mouse.delta = delta * 10;

            //Zoom
            this.Zoom(this.mouse.current.x, this.mouse.current.y, this.mouse.delta);
            this.StoreBuffer();
        }
    }


    //Other functionalities

    EditUserGrid(axis): void {
        //let self = this;

        // let form = new xplore.Form({
        //     text: "Edit Grid",
        //     onok: function () {
        //         if (axis === "X") {
        //             for (let i = 1; i < self.gridx.length; i++) {
        //                 self.gridx[i] = self.gridx[i - 1] + parseFloat(data[i - 1][1]);
        //             }
        //         } else {
        //             for (let i = 1; i < self.gridy.length; i++) {
        //                 self.gridy[i] = self.gridy[i - 1] + parseFloat(data[i - 1][1]);
        //             }
        //         }

        //         self.Render();
        //     }
        // });

        // let columns = ["Name", "Length"];
        // let data = [];

        // if (axis === "X") {
        //     for (let i = 0; i < this.gridx.length - 1; i++) {
        //         data.push([String.fromCharCode(65 + i) + "-" + String.fromCharCode(65 + i + 1), (this.gridx[i + 1] - this.gridx[i]).toFixed(3)]);
        //     }
        // } else {
        //     for (let i = 0; i < this.gridy.length - 1; i++) {
        //         data.push([(i + 1) + "-" + (i + 2), (this.gridy[i + 1] - this.gridy[i]).toFixed(3)]);
        //     }
        // }

        // form.Add(new xplore.Table({
        //     columns: columns,
        //     data: data
        // }));

        // form.Show();
    }

    SnapOnGrid(mouse: XPoint2D): XPoint2D {
        return new XPoint2D(this.Round(mouse.x, this.gridinterval), this.Round(mouse.y, this.gridinterval));
    }

    SnapOnKey(mouse: XMouse): boolean {
        if (this.lock === "X") {
            mouse.current.y = mouse.down.y;
            mouse.rawcurrent.y = mouse.rawdown.y;

            return true;

        } else if (this.lock === "Y") {
            mouse.current.x = mouse.down.x;
            mouse.rawcurrent.x = mouse.rawdown.x;

            return true;

        } else if (this.lock === "A") {
            if (Math.abs(mouse.down.x - mouse.current.x) > Math.abs(mouse.down.y - mouse.current.y)) {
                mouse.current.y = mouse.down.y;
                mouse.rawcurrent.y = this.ToCoordY(mouse.rawdown.y);

            } else {
                mouse.current.x = mouse.down.x;
                mouse.rawcurrent.x = this.ToCoordX(mouse.rawdown.x);
            }

            return true;
        }
    }

    Round(num: number, precision: number): number {
        if (!precision) return num;
        return Math.round(num / precision) * precision;
    }

    ShowSettings() {
        let self = this;

        let form = new Xplore.Form({
            text: "Edit Preferences",
        });

        form.onok = () => {
            self.Render();
            self.StoreBuffer();
        }

        form.Bind(new XCanvas2DSettingsModel(this.settings));

        form.Show();
    }
}