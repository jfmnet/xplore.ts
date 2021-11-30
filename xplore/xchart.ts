class XChartData {
    list: XChartItem[] = [];
    options: XChartOptions;
}

interface XChartItem {
    name: string;
    value: number;
}

interface XChartOptions {
    hover: XDrawProperties;
}

interface Properties {
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

interface Geometry {
    type: string;
    coordinates: any[][][];
}

interface Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
}

interface RootObject {
    type: string;
    features: Feature[];
}

abstract class XChart extends Xplore {
    canvas: XCanvas2D;

    constructor() {
        super(undefined, "chart");
    }

    Refresh(): void {
        this.object.innerHTML = "";
        this.canvas = new XCanvas2D();
        this.canvas.settings.ischart = true;
        this.canvas.Show(this.object);

        this.Render();
    }

    abstract Render();
}

namespace XChart {
    export class BarChart extends XChart {
        data: XChartData;
        width: number = 0.25;

        constructor(data: XChartData) {
            super();
            this.data = data;
        }

        Render(): void {
            let model = new XCanvas2DModel();
            let counter: number = 1;
            let rectangle: XCanvas2DGraphics.Rectangle;

            for (let item of this.data.list) {
                rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter - this.width, item.value, counter + this.width, 0)) as XCanvas2DGraphics.Rectangle;
                rectangle.hover = true;
                rectangle.hoverproperties = this.data.options.hover;
                counter++;
            }

            this.canvas.model = model;
            this.canvas.ZoomAll();
        }
    }

    export class LineChart extends XChart {
        data: XChartData;
        width: number = 0.25;

        constructor(data: XChartData) {
            super();
            this.data = data;
        }

        Render(): void {
            let model = new XCanvas2DModel();
            let counter: number = 1;
            let line: XCanvas2DGraphics.Line;
            let item1: XChartItem;
            let item2: XChartItem;
            let circle: XCanvas2DGraphics.Circle;

            for (let i = 0; i < this.data.list.length - 1; i++) {
                item1 = this.data.list[i];
                item2 = this.data.list[i + 1];

                line = model.Add(new XCanvas2DGraphics.Line(i, item1.value, i + 1, item2.value)) as XCanvas2DGraphics.Line;
                circle = model.Add(new XCanvas2DGraphics.Circle(i, item1.value, 5, true)) as XCanvas2DGraphics.Circle;
                circle.properties.fillcolor = "#FF0";
            }

            // for (let item of this.data.list) {
            //     rectangle = model.Add(new XCanvas2DGraphics.Rectangle(counter - this.width, item.value, counter + this.width, 0)) as XCanvas2DGraphics.Rectangle;
            //     rectangle.hover = true;
            //     rectangle.hoverproperties = this.data.options.hover;
            //     counter++;
            // }

            this.canvas.model = model;
            this.canvas.ZoomAll();
        }
    }
}