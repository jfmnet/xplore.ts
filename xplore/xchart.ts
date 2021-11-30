class XChartDataSet {
    items: XChartData[] = [];
    options: XChartDataSetOptions;
}

interface XChartDataSetOptions {
    label?: { x: string, y: string };
    labels?: XChartDataLabel;
}

class XChartData {
    icon?: string;
    text: string;
    list: XChartItem[] = [];
    properties: XDrawProperties;
    hover?: XDrawProperties;
}

interface XChartItem {
    name: string;
    value: number;
}

interface XChartDataLabel {
    x?: string[];
    y?: string[];
}

interface XChartMapProperties {
    scalerank: number;
    featurecla: string;
    labelrank: number;
    sovereignt: string;
    sov_a3: string;
    adm0_dif: number;
    level: number;
    type: string;
    admin: string;
    adm0_a3: string;
    geou_dif: number;
    geounit: string;
    gu_a3: string;
    su_dif: number;
    subunit: string;
    su_a3: string;
    brk_diff: number;
    name: string;
    name_long: string;
    brk_a3: string;
    brk_name: string;
    brk_group?: any;
    abbrev: string;
    postal: string;
    formal_en: string;
    formal_fr: string;
    note_adm0: string;
    note_brk: string;
    name_sort: string;
    name_alt: string;
    mapcolor7: number;
    mapcolor8: number;
    mapcolor9: number;
    mapcolor13: number;
    pop_est: number;
    gdp_md_est: number;
    pop_year: number;
    lastcensus: number;
    gdp_year: number;
    economy: string;
    income_grp: string;
    wikipedia: number;
    fips_10?: any;
    iso_a2: string;
    iso_a3: string;
    iso_n3: string;
    un_a3: string;
    wb_a2: string;
    wb_a3: string;
    woe_id: number;
    adm0_a3_is: string;
    adm0_a3_us: string;
    adm0_a3_un: number;
    adm0_a3_wb: number;
    continent: string;
    region_un: string;
    subregion: string;
    region_wb: string;
    name_len: number;
    long_len: number;
    abbrev_len: number;
    tiny: number;
    homepart: number;
    filename: string;
}

interface XChartMapGeometry {
    type: string;
    coordinates: any[][][];
}

interface XChartMapFeature {
    type: string;
    properties: XChartMapProperties;
    geometry: XChartMapGeometry;
}

interface XChartMapRootObject {
    type: string;
    features: XChartMapFeature[];
}

interface XChartMapData {
    [key: string]: XChartMapDataItem;
}

interface XChartMapDataItem {
    icon?: string;
    fillcolor: string;
    onhover?: Function;
}

abstract class XChart extends Xplore {
    canvas: XCanvas2D;
    legendposition: XPOSITION = XPOSITION.NONE;
    container: Xplore.Container;

    constructor() {
        super(undefined, "chart");
    }

    Refresh(): void {
        this.object.innerHTML = "";

        let splitter = new Xplore.SplitContainer();
        let index = 0;
        let orientation;

        switch (this.legendposition) {
            case XPOSITION.NONE:
                index = 0;
                splitter.size = [undefined, 0];
                break;

            case XPOSITION.LEFT:
                index = 1;
                splitter.size = [200, undefined];
                orientation = "horizontal";
                break;

            case XPOSITION.TOP:
                index = 1;
                splitter.size = [30, undefined];
                splitter.orientation = XORIENTATION.VERTICAL;
                orientation = "vertical";
                break;

            case XPOSITION.RIGHT:
                index = 0;
                splitter.size = [undefined, 200];
                orientation = "horizontal";
                break;

            case XPOSITION.BOTTOM:
                index = 0;
                splitter.size = [undefined, 30];
                splitter.orientation = XORIENTATION.VERTICAL;
                orientation = "vertical";
                break;
        }

        splitter.Show(this.object);

        this.canvas = new XCanvas2D();
        this.canvas.settings.ischart = true;
        this.canvas.settings.allowzoom = false;
        this.canvas.settings.allowpan = false;
        this.canvas.settings.allowselect = false;
        this.canvas.settings.showtoolbar = false;

        this.canvas.rulersize = 60;
        splitter.Set(this.canvas, index);

        this.container = new Xplore.Container({ classes: ["chart-legend-container", orientation] });
        splitter.Set(this.container, index ? 0 : 1);

        this.Render();
    }

    abstract Render();
}

namespace XChart {
    class BaseChart extends XChart {
        data: XChartDataSet;
        form: Xplore.Form;

        selectedindex: number = -1;
        showtooltip: boolean = false;

        uniformscale: boolean = false;

        Render() {
            let self = this;

            this.form = new Xplore.Form({
                classes: ["map-info"],
                width: 200,
                height: 120,
            });

            this.form.showfooter = false;
            this.form.showclose = false;
            this.form.modal = false;

            this.canvas.labelx = this.data.options.labels.x;
            this.canvas.labely = this.data.options.labels.y;

            let list: Xplore.List;
            let index: number = 0;

            for (let data of this.data.items) {
                list = new Xplore.List({
                    icon: data.icon || "circle",
                    text: data.text,
                    onclick: function (object: Xplore) {
                        self.selectedindex = object.tag;

                        model.Clear();
                        self.RenderChart(model);
                        self.canvas.model = model;
                        self.canvas.ZoomAll();
                    }
                });

                list.tag = index++;

                list.iconcolor = data.properties.linecolor;
                this.container.Add(list);
            }

            this.container.Refresh();

            this.canvas.textx = this.data.options.label.x;
            this.canvas.texty = this.data.options.label.y;

            let model = new XCanvas2DModel();
            this.RenderChart(model);

            this.canvas.model = model;
            this.canvas.ZoomAll(this.uniformscale);
        }

        RenderChart(model: XCanvas2DModel): void {
        }

        RenderActive(canvas: XCanvas2D, mouse: XMouse): void {
        }
    }

    export class BarChart extends BaseChart {
        width: number = 0.5;

        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let counter: number = 1;
            let rectangle: XCanvas2DGraphics.Rectangle;
            let datacount = this.data.items.length;
            let width = this.width / datacount;
            let y: number;
            let index = 0;

            for (let data of this.data.items) {
                counter = 1;
                y = - 0.5 * this.width + 0.5 * width + index * width;

                for (let item of data.list) {
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(item.value, counter + y - width / 2, 0, counter + y + width / 2)) as XCanvas2DGraphics.Rectangle;
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;

                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    counter++;
                }

                index++;
            }

            if (this.showtooltip) {
                let self = this;
                let item: XChartItem;
                let list: Xplore.List;

                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        let index = Math.round(mouse.current.y) - 1;
                        let x = canvas.ToCoordX(0);
                        let y = canvas.ToCoordY(index);

                        self.RenderActive(canvas, mouse);

                        self.form.Clear();

                        for (let data of self.data.items) {
                            item = data.list[index];

                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });

                                list.iconcolor = data.properties.linecolor;

                                self.form.Add(list);
                            }
                        }

                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }

                            self.form.text = self.data.items[0].list[index].name;
                            self.form.RefreshHeader();

                            x = mouse.rawcurrent.x;
                            y = canvas.ToCoordY(index + 1);

                            self.form.RefreshBody();
                            self.form.Resize();

                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;

                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self.form.object.scrollWidth + 20;

                            self.form.SetLocation(x + 10, y + 10);

                        } else {
                            self.form.Close();
                        }

                    } else {
                        self.form.Close();
                    }
                };
            }
        }
    }

    export class StackedBarChart extends BaseChart {
        width: number = 0.5;

        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let self = this;
            let rectangle: XCanvas2DGraphics.Rectangle;
            let item: XChartItem;
            let length = this.data.items[0].list.length;
            let x: number;
            let list: Xplore.List;
            let index: number = 0;

            for (let i = 0; i < length; i++) {
                x = 0;
                index = 0;

                for (let data of this.data.items) {
                    item = data.list[i];

                    if (self.selectedindex !== -1 && self.selectedindex !== index) {
                        index++;
                        continue;
                    }

                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(x, i - this.width / 2 + 1, x + item.value, i + this.width / 2 + 1)) as XCanvas2DGraphics.Rectangle;
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;

                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;

                    x += item.value;
                    index++;
                }
            }

            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        let index = Math.round(mouse.current.y) - 1;
                        let x = canvas.ToCoordX(0);
                        let y = canvas.ToCoordY(index);

                        self.RenderActive(canvas, mouse);

                        self.form.Clear();

                        for (let data of self.data.items) {
                            item = data.list[index];

                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });

                                list.iconcolor = data.properties.linecolor;

                                self.form.Add(list);
                            }
                        }

                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }

                            self.form.text = self.data.items[0].list[index].name;
                            self.form.RefreshHeader();

                            x = mouse.rawcurrent.x;
                            y = canvas.ToCoordY(index + 1);

                            self.form.RefreshBody();
                            self.form.Resize();

                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;

                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self.form.object.scrollWidth + 20;

                            self.form.SetLocation(x + 10, y + 10);

                        } else {
                            self.form.Close();
                        }

                    } else {
                        self.form.Close();
                    }
                };
            }
        }
    }

    export class ColumnChart extends BaseChart {
        width: number = 0.5;

        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let counter: number = 1;
            let rectangle: XCanvas2DGraphics.Rectangle;
            let datacount = this.data.items.length;
            let width = this.width / datacount;
            let x: number;
            let index = 0;

            for (let data of this.data.items) {
                counter = 1;
                x = - 0.5 * this.width + 0.5 * width + index * width;

                for (let item of data.list) {
                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter + x - width / 2, item.value, counter + x + width / 2, 0)) as XCanvas2DGraphics.Rectangle;
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;

                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;
                    counter++;
                }

                index++;
            }

            let self = this;
            let item: XChartItem;
            let list: Xplore.List;

            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        let index = Math.round(mouse.current.x) - 1;
                        let x = canvas.ToCoordX(index);
                        let y = canvas.ToCoordY(0);

                        self.RenderActive(canvas, mouse);

                        self.form.Clear();

                        for (let data of self.data.items) {
                            item = data.list[index];

                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });

                                list.iconcolor = data.properties.linecolor;

                                self.form.Add(list);
                            }
                        }

                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }

                            self.form.text = self.data.items[0].list[index].name;
                            self.form.RefreshHeader();

                            x = canvas.ToCoordX(index + 1);
                            y = mouse.rawcurrent.y;

                            self.form.RefreshBody();
                            self.form.Resize();

                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;

                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self.form.object.scrollWidth + 20;

                            self.form.SetLocation(x + 10, y + 10);

                        } else {
                            self.form.Close();
                        }

                    } else {
                        self.form.Close();
                    }
                };
            }
        }
    }

    export class StackedColumnChart extends BaseChart {
        width: number = 0.5;

        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let self = this;
            let rectangle: XCanvas2DGraphics.Rectangle;
            let item: XChartItem;
            let length = this.data.items[0].list.length;
            let y: number = 0;
            let list: Xplore.List;
            let index: number = 0;

            for (let i = 0; i < length; i++) {
                y = 0;
                index = 0;

                for (let data of this.data.items) {
                    item = data.list[i];

                    if (self.selectedindex !== -1 && self.selectedindex !== index) {
                        index++;
                        continue;
                    }

                    rectangle = model.Add(new XCanvas2DGraphics.Rectangle(i - this.width / 2 + 1, y, i + this.width / 2 + 1, y + item.value)) as XCanvas2DGraphics.Rectangle;
                    rectangle.properties.linecolor = data.properties.linecolor;
                    rectangle.properties.fillcolor = data.properties.fillcolor;

                    rectangle.hover = true;
                    rectangle.hoverproperties = data.hover;

                    y += item.value;
                    index++;
                }
            }

            if (this.showtooltip) {
                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    if (mouse.current.x >= 0 && mouse.current.y >= 0) {
                        let index = Math.round(mouse.current.x) - 1;
                        let x = canvas.ToCoordX(index);
                        let y = canvas.ToCoordY(0);

                        self.RenderActive(canvas, mouse);

                        self.form.Clear();

                        for (let data of self.data.items) {
                            item = data.list[index];

                            if (item) {
                                list = new Xplore.List({
                                    icon: data.icon,
                                    text: data.text + ": " + item.value
                                });

                                list.iconcolor = data.properties.linecolor;

                                self.form.Add(list);
                            }
                        }

                        if (item) {
                            if (!self.form.object) {
                                self.form.Show();
                            }

                            self.form.text = self.data.items[0].list[index].name;
                            self.form.RefreshHeader();

                            x = canvas.ToCoordX(index + 1);
                            y = mouse.rawcurrent.y;

                            self.form.RefreshBody();
                            self.form.Resize();

                            if (mouse.rawcurrent.y > window.innerHeight / 2)
                                y -= self.form.object.scrollHeight + 20;

                            if (mouse.rawcurrent.x > window.innerWidth / 2)
                                x -= self.form.object.scrollWidth + 20;

                            self.form.SetLocation(x + 10, y + 10);

                        } else {
                            self.form.Close();
                        }

                    } else {
                        self.form.Close();
                    }
                };
            }
        }
    }

    export class LineChart extends BaseChart {
        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let line: XCanvas2DGraphics.Line;
            let item1: XChartItem;
            let item2: XChartItem;

            for (let data of this.data.items) {
                for (let i = 0; i < data.list.length - 1; i++) {
                    item1 = data.list[i];
                    item2 = data.list[i + 1];

                    line = model.Add(new XCanvas2DGraphics.Line(i, item1.value, i + 1, item2.value)) as XCanvas2DGraphics.Line;
                    line.properties.linecolor = data.properties.linecolor;
                }
            }

            if (this.showtooltip) {
                let self = this;

                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    let index = Math.round(mouse.current.x);
                    let x = canvas.ToCoordX(index);
                    let y = canvas.ToCoordY(0);

                    canvas.SetProperties({ thickness: 1 });
                    canvas.PrimitiveLine(x, 0, x, y);

                    for (let data of self.data.items) {
                        if (data.list[index])
                            canvas.PrimitiveCircle(x, canvas.ToCoordY(data.list[index].value), 5, true, true);
                    }
                };
            }
        }
    }

    export class AreaChart extends BaseChart {
        constructor(data: XChartDataSet) {
            super();
            this.data = data;
        }

        RenderChart(model: XCanvas2DModel): void {
            let poly: XCanvas2DGraphics.Polygon;
            let item: XChartItem;
            let points: XPoint2D[];

            for (let data of this.data.items) {
                points = [];

                for (let i = 0; i < data.list.length; i++) {
                    item = data.list[i];
                    points.push(new XPoint2D(i, item.value));
                }

                points.push(new XPoint2D(data.list.length - 1, 0));
                points.push(new XPoint2D(0, 0));

                poly = model.Add(new XCanvas2DGraphics.Polygon(points)) as XCanvas2DGraphics.Polygon;
                poly.properties.linecolor = data.properties.linecolor;
                poly.properties.fillcolor = data.properties.fillcolor;
            }

            if (this.showtooltip) {
                let self = this;

                model.HandleMouseMoveNoButton = function (canvas: XCanvas2D, mouse: XMouse): void {
                    canvas.Render();

                    let index = Math.round(mouse.current.x);
                    let x = canvas.ToCoordX(index);
                    let y = canvas.ToCoordY(0);

                    canvas.SetProperties({ thickness: 1 });
                    canvas.PrimitiveLine(x, 0, x, y);

                    for (let data of self.data.items) {
                        if (data.list[index])
                            canvas.PrimitiveCircle(x, canvas.ToCoordY(data.list[index].value), 5, true, true);
                    }
                };
            }
        }
    }

    export class PieChart extends BaseChart {
        constructor(data: XChartDataSet) {
            super();
            this.data = data;
            this.uniformscale = true;
        }

        RenderChart(model: XCanvas2DModel): void {
            let pie: XCanvas2DGraphics.Pie;
            let item: XChartItem;
            let total: number = 0;
            let startangle: number = 0;
            let endangle: number = 0;

            for (let data of this.data.items) {
                item = data.list[0];
                total += item.value;
            }

            for (let data of this.data.items) {
                item = data.list[0];

                endangle = 2 * Math.PI * item.value / total;

                pie = model.Add(new XCanvas2DGraphics.Pie(0, 0, 1, startangle, startangle + endangle)) as XCanvas2DGraphics.Pie;
                pie.properties.linecolor = data.properties.linecolor;
                pie.properties.fillcolor = data.properties.fillcolor;

                startangle += endangle;
            }

            this.canvas.settings.showgrid = false;
            this.canvas.settings.showruler = false;
        }
    }

    export class MapChart extends XChart {
        map: XChartMapFeature[];
        data: XChartMapData;
        form: Xplore.Form;

        constructor(data?: XChartMapData) {
            super();

            let self = this;
            this.data = data;

            Xplore.GetJSON("resources/map-small.json", function (data: XChartMapRootObject) {
                self.map = data.features;
                self.Render();
            });
        }

        Render() {
            if (this.map) {
                let model = new XCanvas2DModel();
                let mappoints: XPoint2D[];
                let polygon: XCanvas2DGraphics.Polygon;
                let text: XCanvas2DGraphics.Text;
                let bounds: XBounds2D;
                let feature: XChartMapDataItem;

                let self = this;

                //Polygon
                for (let item of this.map) {
                    if (item.geometry.type === "Polygon") {
                        mappoints = [];

                        for (let points of item.geometry.coordinates) {
                            for (let point of points) {
                                mappoints.push(new XPoint2D(<number>point[0], <number>point[1]));
                            }
                        }

                        polygon = new XCanvas2DGraphics.Polygon(mappoints);
                        polygon.hover = true;
                        polygon.hoverproperties.fillcolor = "#FF0";

                        model.Add(polygon);

                        bounds = new XBounds2D();
                        polygon.UpdateBounds(bounds);

                    } else {
                        bounds = new XBounds2D();

                        for (let points of item.geometry.coordinates) {
                            mappoints = [];

                            for (let point of points) {
                                for (let inpoint of point) {
                                    mappoints.push(new XPoint2D(<number>inpoint[0], <number>inpoint[1]));
                                }
                            }

                            polygon = new XCanvas2DGraphics.Polygon(mappoints);
                            polygon.hover = true;
                            polygon.hoverproperties.fillcolor = "#FF0";
                            polygon.UpdateBounds(bounds);

                            model.Add(polygon);
                        }
                    }

                    // text = new XCanvas2DGraphics.Text(item.properties.name, bounds.midx, bounds.midy);
                    // text.scale = false;
                    // model.Add(text);

                    //Features
                    // feature = this.data[item.properties.postal];

                    // if (feature) {
                    //     if (feature.fillcolor)
                    //         polygon.properties.fillcolor = feature.fillcolor;

                    //     if (feature.onhover)
                    //         polygon.onhover = function (object: XCanvas2DGraphics.Polygon) {
                    //             let map = document.body.querySelector(".map-info");
                    //             if (!map) {
                    //                 self.form = new Xplore.Form({
                    //                     text: item.properties.name,
                    //                     classes: ["map-info"],
                    //                     width: 240,
                    //                     height: 300
                    //                 });
                    //                 self.form.modal = false;
                    //                 self.form.showfooter = false;
                    //                 self.form.Show();
                    //             }

                    //             let bounds = new XBounds2D();
                    //             object.UpdateBounds(bounds);

                    //             if (self.form.text !== item.properties.name) {
                    //                 self.form.text = item.properties.name;
                    //                 self.form.RefreshHeader();
                    //             }

                    //             self.form.SetLocation(self.canvas.ToCoordX(bounds.x1), self.canvas.ToCoordY(bounds.y1));
                    //         };

                    //     if (feature.icon) {
                    //         text = new XCanvas2DGraphics.Text(feature.icon, bounds.midx, bounds.midy);
                    //         text.textproperties.font = "Material Icons";
                    //         text.textproperties.size = 24;
                    //         text.scale = false;

                    //         model.Add(text);
                    //     }
                    // }

                }

                this.canvas.settings.showgrid = false;
                this.canvas.settings.showruler = false;
                this.canvas.settings.allowzoom = true;
                this.canvas.settings.allowpan = true;
                this.canvas.model = model;
                this.canvas.ZoomAll(true);
            }
        }
    }
}