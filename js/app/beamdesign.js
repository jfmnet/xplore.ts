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
var BeamDesign = /** @class */ (function () {
    function BeamDesign() {
        this.parameters = {
            fc: 4350 / XStructure.unit.stress.value,
            fy: 60000 / XStructure.unit.stress.value,
            mu: 2422560 / XStructure.unit.moment.value,
            vu: 28.52 / XStructure.unit.force.value,
            h: 20 / XStructure.unit.length.value,
            b: 12 / XStructure.unit.length.value,
            cc: 1.5 / XStructure.unit.length.value,
            ds: 1.128 / XStructure.unit.length.value,
            db: 0.375 / XStructure.unit.length.value,
            phi: 0.9
        };
        this.model = new BeamDesignModel(this.parameters);
    }
    BeamDesign.prototype.Show = function () {
        this.ShowParameters();
        this.longcontainer = new Xplore.Container({ classes: ["block-container"] });
        this.longcontainer.Show();
        this.DesignLongitudinalBars();
        this.shearcontainer = new Xplore.Container({ classes: ["block-container"] });
        this.shearcontainer.Show();
        this.DesignShear();
        Xplore.Equation.Render();
    };
    BeamDesign.prototype.ShowParameters = function () {
        var container = new Xplore.Container({ classes: ["block-container"] });
        var header = new Xplore.Header({ text: "A. Parameters", type: XHEADERTYPE.H3 });
        container.Add(header);
        container.AddRange(this.model);
        var self = this;
        var button = new Xplore.Button({
            text: "Compute",
            onclick: function () {
                self.DesignLongitudinalBars();
                self.DesignShear();
                Xplore.Equation.Render();
            },
            classes: ["compute-button"]
        });
        container.Add(button);
        var table = container.Add(new Xplore.Table({
            columns: [
                { name: "b", text: "Width" },
                { name: "h", text: "Height" },
                { name: "cc", text: "Clear Cover" },
                { name: "fc", text: "Concrete<br/>Compressive Strength" },
                { name: "fy", text: "Steel<br/>Yield Strength" },
            ],
            data: [],
        }));
        table.AddRows(10);
        container.Show();
    };
    BeamDesign.prototype.DesignLongitudinalBars = function () {
        this.longcontainer.Clear();
        var header = new Xplore.Header({ text: "B. Design for Longitudinal Bars", type: XHEADERTYPE.H3 });
        this.longcontainer.Add(header);
        //Compute Effective depth, d
        // let canvas = new XCanvas2D();
        // this.longcontainer.Add(canvas);
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Effective Depth" });
        this.longcontainer.Add(header);
        var equation = "$$d = h - { cc + d_b + { d_s \\over 2 }}$$";
        var parameters = [
            { name: "h", value: this.model.h },
            { name: "cc", value: this.model.cc },
            { name: "d_s", value: this.model.ds },
            { name: "d_b", value: this.model.db }
        ];
        var text = new Xplore.Equation(equation, parameters, XStructure.unit.length);
        this.longcontainer.Add(text);
        this.de = text.value;
        //Compute As
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Initial Reinforcement" });
        this.longcontainer.Add(header);
        equation = "$$A_s = { M_u \\over { Φ * f_y * 0.889 * d }}$$";
        parameters = [
            { name: "M_u", value: this.model.mu },
            { name: "Φ", value: this.model.phi },
            { name: "f_y", value: this.model.fy },
            { name: "d", value: this.de }
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.area);
        this.longcontainer.Add(text);
        //Compute a
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate 'a'" });
        this.longcontainer.Add(header);
        equation = "$$a = {{ A_s * f_y } \\over {0.85 * f_c * b }}$$";
        parameters = [
            { name: "A_s", value: text.value },
            { name: "f_y", value: this.model.fy },
            { name: "f_c", value: this.model.fc },
            { name: "b", value: this.model.b }
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.length);
        this.longcontainer.Add(text);
        //Compute c
        var a = text.value;
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate 'c'" });
        this.longcontainer.Add(header);
        equation = "$$β_1 = 0.85 - ({{0.05 * ( f_c - 4000 )} \\over {1000}})$$";
        parameters = [
            { name: "f_c", value: this.model.fc }
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.none);
        this.longcontainer.Add(text);
        equation = "$$c = { a \\over β_1 }$$";
        parameters = [
            { name: "β_1", value: text.value },
            { name: "a", value: a }
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.length);
        this.longcontainer.Add(text);
        //Compute Asmin
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Asmin" });
        this.longcontainer.Add(header);
        equation = "$$A_{smin1} = {200 \\over f_y } * { b * d }$$";
        parameters = [
            { name: "f_y", value: this.model.fy },
            { name: "b", value: this.model.b },
            { name: "d", value: this.de },
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.area);
        this.longcontainer.Add(text);
        var asmin1 = text.value;
        equation = "$$A_{smin2} = { 3 * {\\sqrt{ f_c } \\over f_y } * b * d }$$";
        parameters = [
            { name: "f_c", value: this.model.fc },
            { name: "f_y", value: this.model.fy },
            { name: "b", value: this.model.b },
            { name: "d", value: this.de },
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.area);
        this.longcontainer.Add(text);
        var asmin2 = text.value;
        //Asmin
        equation = "$$\\therefore A_{smin} = { max( A_{smin1} , A_{smin2} ) }$$";
        parameters = [
            { name: "A_{smin1}", value: asmin1 },
            { name: "A_{smin2}", value: asmin2 },
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.area);
        this.longcontainer.Add(text);
        this.longcontainer.Refresh();
    };
    BeamDesign.prototype.DesignShear = function () {
        this.shearcontainer.Clear();
        var header = new Xplore.Header({ text: "C. Design for Shear Bars", type: XHEADERTYPE.H3 });
        this.shearcontainer.Add(header);
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Shear Strength Provided by Concrete" });
        this.shearcontainer.Add(header);
        var phi = new Xplore.NumberInput({ value: 0.75, unit: XStructure.unit.none });
        var equation = "$$V_c = {{ Φ * 2 * \\sqrt { f_c } * b * d } \\over 1000 } $$";
        var parameters = [
            { name: "Φ", value: phi },
            { name: "f_c", value: this.model.fc },
            { name: "b", value: this.model.b },
            { name: "d", value: this.de },
        ];
        var text = new Xplore.Equation(equation, parameters, XStructure.unit.force);
        this.shearcontainer.Add(text);
        var phivc = text.value;
        var vc = Xplore.NumberInput.FormatValue(text.value.UnitValue() / 2);
        equation = "$${ΦV_c \\ove r 2} = " + vc + " \\lt V_u = " + this.model.vu.FormattedValue() + "\\therefore \\text { shear reinforcement is required.}$$";
        this.shearcontainer.Add(new Xplore.Text({ text: equation }));
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Nominal Shear Strength" });
        this.shearcontainer.Add(header);
        equation = "$$V_s = { V_u \\over Φ } - { V_c \\over Φ } $$";
        parameters = [
            { name: "Φ", value: phi },
            { name: "V_u", value: this.model.vu },
            { name: "V_c", value: phivc },
        ];
        text = new Xplore.Equation(equation, parameters, XStructure.unit.force);
        this.shearcontainer.Add(text);
        this.shearcontainer.Refresh();
    };
    return BeamDesign;
}());
var BeamDesignModel = /** @class */ (function (_super) {
    __extends(BeamDesignModel, _super);
    function BeamDesignModel(parameters) {
        var _this = _super.call(this) || this;
        _this.fc = new Xplore.NumberInput({ text: "Comp. Strength, fc'", unit: XStructure.unit.stress });
        _this.fy = new Xplore.NumberInput({ text: "Yield Strength, fy", unit: XStructure.unit.stress });
        _this.mu = new Xplore.NumberInput({ text: "Design Moment, mu", unit: XStructure.unit.moment });
        _this.vu = new Xplore.NumberInput({ text: "Design Shear, vu", unit: XStructure.unit.force });
        _this.b = new Xplore.NumberInput({ text: "Width, b", unit: XStructure.unit.length });
        _this.h = new Xplore.NumberInput({ text: "Height, h", unit: XStructure.unit.length });
        _this.cc = new Xplore.NumberInput({ text: "Clear Cover, cc", unit: XStructure.unit.length });
        _this.ds = new Xplore.NumberInput({ text: "ds", unit: XStructure.unit.length });
        _this.db = new Xplore.NumberInput({ text: "db", unit: XStructure.unit.length });
        _this.phi = new Xplore.NumberInput({ text: "Φ", unit: XStructure.unit.none });
        _this.fc.bind = { object: parameters, name: "fc" };
        _this.fy.bind = { object: parameters, name: "fy" };
        _this.mu.bind = { object: parameters, name: "mu" };
        _this.vu.bind = { object: parameters, name: "vu" };
        _this.b.bind = { object: parameters, name: "b" };
        _this.h.bind = { object: parameters, name: "h" };
        _this.cc.bind = { object: parameters, name: "cc" };
        _this.phi.bind = { object: parameters, name: "phi" };
        _this.ds.bind = { object: parameters, name: "ds" };
        _this.db.bind = { object: parameters, name: "db" };
        return _this;
    }
    return BeamDesignModel;
}(XModelBase));
//# sourceMappingURL=beamdesign.js.map