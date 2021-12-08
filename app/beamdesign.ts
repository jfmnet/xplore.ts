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
    db: number,
    phi: number
}

class BeamDesign {
    parameters: BeamDesignParameters;
    container: Xplore;

    constructor() {
        this.parameters = {
            fc: 4350,
            fy: 60000,
            mu: 2422560,
            h: 20,
            b: 12,
            cc: 1.5,
            ds: 1.128,
            db: 0.375,
            phi: 0.9
        };
    }

    Show(): void {
        this.ShowParameters();

        this.container = new Xplore.Container({ classes: ["block-container"] });
        this.container.Show();

        this.ShowDesign();
    }

    ShowParameters(): void {
        let container = new Xplore.Container({ classes: ["block-container"] });

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

        let phi = new Xplore.Input(XINPUTTYPE.NUMBER, { text: "Φ" });
        phi.bind = { object: this.parameters, name: "phi" };
        container.Add(phi);

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

        //Compute Effective depth, d
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Effective Depth" })
        this.container.Add(header);

        let equation = "$$d = h - {cc + d_b + {d_s \\over 2}}$$";
        let parameters = [
            { name: "h", value: this.parameters.h },
            { name: "cc", value: this.parameters.cc },
            { name: "d_s", value: this.parameters.ds },
            { name: "d_b", value: this.parameters.db }
        ];

        let text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);

        let d = text.value;

        //Compute As
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate Initial Reinforcement" })
        this.container.Add(header);

        equation = "$$A_s = {M_u \\over {Φ * f_y * 0.889 * d}}$$";
        parameters = [
            { name: "M_u", value: this.parameters.mu },
            { name: "Φ", value: this.parameters.phi },
            { name: "f_y", value: this.parameters.fy },
            { name: "d", value: d }
        ];

        text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);

        //Compute a
        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate 'a'" })
        this.container.Add(header);

        equation = "$$a = {{A_s * f_y} \\over {0.85 * f_c * b}}$$";
        parameters = [
            { name: "A_s", value: text.value },
            { name: "f_y", value: this.parameters.fy },
            { name: "f_c", value: this.parameters.fc },
            { name: "b", value: this.parameters.b }
        ];

        text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);


        //Compute c
        let a = text.value;

        header = new Xplore.Header({ type: XHEADERTYPE.H4, text: "Calculate 'c'" })
        this.container.Add(header);

        equation = "$$β_1 = 0.85 - ({{0.05 * (f_c - 4000)} \\over {1000}})$$";
        parameters = [
            { name: "f_c", value: this.parameters.fc }
        ];

        text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);

        equation = "$$c = {a \\over β_1}$$";
        parameters = [
            { name: "β_1", value: text.value },
            { name: "a", value: a }
        ];

        text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);


        //Compute Asmin
        equation = "$$A_smin = {200 \\over f_y} * {b_w * d}$$";
        parameters = [
            { name: "f_y", value: this.parameters.fy },
            { name: "b_w", value: this.parameters.b },
            { name: "d", value: d },
        ];

        text = new Xplore.Equation(equation, parameters);
        this.container.Add(text);


        this.container.Refresh();
        Xplore.Equation.Render();
    }
}