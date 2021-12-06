var BeamDesign = /** @class */ (function () {
    function BeamDesign() {
        this.parameters = {
            fc: 4000,
            fy: 60000,
            mu: 100,
            h: 20,
            b: 12,
            cc: 1.5,
            ds: 1.128,
            db: 0.375
        };
    }
    BeamDesign.prototype.Show = function () {
        this.ShowParameters();
        this.container = new Xplore.Container({ classes: ["block-container"] });
        this.container.Show();
        this.ShowDesign();
    };
    BeamDesign.prototype.ShowParameters = function () {
        var container = new Xplore.Container({ classes: ["block-container"] });
        var header = new Xplore.Header({ text: "A. Parameters", type: XHEADERTYPE.H3 });
        container.Add(header);
        var fc = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Compressive Strength, fc'" });
        fc.bind = { object: this.parameters, name: "fc" };
        container.Add(fc);
        var fy = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Yield Strength, fy" });
        fy.bind = { object: this.parameters, name: "fy" };
        container.Add(fy);
        var mu = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Design Moment, mu" });
        mu.bind = { object: this.parameters, name: "mu" };
        container.Add(mu);
        var b = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Width, b" });
        b.bind = { object: this.parameters, name: "b" };
        container.Add(b);
        var h = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Height, h" });
        h.bind = { object: this.parameters, name: "h" };
        container.Add(h);
        var cc = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Clear Cover, cc" });
        cc.bind = { object: this.parameters, name: "cc" };
        container.Add(cc);
        var self = this;
        var button = new Xplore.Button({
            text: "Compute", onclick: function () {
                self.ShowDesign();
            }
        });
        container.Add(button);
        container.Show();
    };
    BeamDesign.prototype.ShowDesign = function () {
        this.container.Clear();
        var header = new Xplore.Header({ text: "B. Design for Longitudinal Bars", type: XHEADERTYPE.H3 });
        this.container.Add(header);
        var equation = "$$d = h- {cc + db + {ds \\over 2}}$$";
        var parameters = [
            { name: "h", value: this.parameters.h },
            { name: "cc", value: this.parameters.cc },
            { name: "ds", value: this.parameters.ds },
            { name: "db", value: this.parameters.db }
        ];
        var text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);
        this.container.Refresh();
        Xplore.Equation.Render();
    };
    return BeamDesign;
}());
//# sourceMappingURL=beamdesign.js.map