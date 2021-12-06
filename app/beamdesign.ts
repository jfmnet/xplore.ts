interface Window {
    MathJax: any,
    math: any
}

interface BeamDesignParameters {
    fc: number,
    fy: number,
    mu: number,
    b: number,
    h: number,
    cc: number,
    ds: number,
    db: number
}

class BeamDesign {
    parameters: BeamDesignParameters;
    container: Xplore;

    constructor() {
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

    Show(): void {
        this.ShowParameters();

        this.container = new Xplore.Container({ classes: [ "block-container" ] });
        this.container.Show();

        this.ShowDesign();
    }

    ShowParameters(): void {
        let container = new Xplore.Container({ classes: [ "block-container" ] });

        let header = new Xplore.Header({ text: "A. Parameters", type: XHEADERTYPE.H3 });
        container.Add(header);

        let fc = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Compressive Strength, fc'" });
        fc.bind = { object: this.parameters, name: "fc" };
        container.Add(fc);

        let fy = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Yield Strength, fy" });
        fy.bind = { object: this.parameters, name: "fy" };
        container.Add(fy);

        let mu = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Design Moment, mu" });
        mu.bind = { object: this.parameters, name: "mu" };
        container.Add(mu);

        let b = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Width, b" });
        b.bind = { object: this.parameters, name: "b" };
        container.Add(b);

        let h = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Height, h" });
        h.bind = { object: this.parameters, name: "h" };
        container.Add(h);

        let cc = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Clear Cover, cc" });
        cc.bind = { object: this.parameters, name: "cc" };
        container.Add(cc);

        let self = this;
        let button = new Xplore.Button({
            text: "Compute", onclick: function () {
                self.ShowDesign();
            }
        });

        container.Add(button);
        container.Show();
    }

    ShowDesign(): void {
        this.container.Clear();

        let header = new Xplore.Header({ text: "B. Design for Longitudinal Bars", type: XHEADERTYPE.H3 });
        this.container.Add(header);

        let equation = "$$d = h- {cc + db + {ds \\over 2}}$$";
        let parameters = [
            { name: "h", value: this.parameters.h },
            { name: "cc", value: this.parameters.cc },
            { name: "ds", value: this.parameters.ds },
            { name: "db", value: this.parameters.db }
        ];

        let text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);

        this.container.Refresh();
        Xplore.Equation.Render();
    }
}