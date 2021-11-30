import { Object3D } from "../Three";

export class CSMHelper extends Object3D {
    constructor(csm: any);
    csm: any;
    displayFrustum: boolean;
    displayPlanes: boolean;
    displayShadowBounds: boolean;
    frustumLines: any;
    cascadeLines: any[];
    cascadePlanes: any[];
    shadowLines: any[];
    updateVisibility(): void;
    update(): void;
}
