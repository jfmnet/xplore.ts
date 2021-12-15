enum XUnit {
    US = "Kip-in",
    SI = "N-mm"
}

var XUnitLength = {
    MM: { name: "mm", value: 1 },
    CM: { name: "c", value: 0.1 },
    M: { name: "m", value: 0.001 },
    IN: { name: "in", value: 0.0393700787401575 },
    FT: { name: "ft", value: 0.00328083989501312 }
}

var XUnitForce = {
    N: { name: 'N', value: 1 },
    KN: { name: 'kN', value: 0.001 },
    LB: { name: 'lbf', value: 0.224808943099999 },
    KIP: { name: 'kip', value: 0.000224808943099999 },
    KG: { name: 'kgf', value: 0.101971621297793 }
}

class XUnits {
    none: XNameValue = { name: "", value: 1 };
    length: XNameValue;
    area: XNameValue;
    force: XNameValue;
    moment: XNameValue;
    stress: XNameValue;

    constructor(length: XNameValue, force: XNameValue) {
        this.length = length;
        this.force = force;

        this.area = {
            name: length.name + "²",
            value: length.value * length.value
        };

        this.moment = {
            name: force.name + "-" + length.name,
            value: force.value * length.value
        };

        this.stress = {
            name: force.name + "/" + length.name + "²",
            value: force.value / (length.value * length.value)
        };
    }
}

class XStructure {
    static unit: XUnits = new XUnits(XUnitLength.IN, XUnitForce.KIP);
}