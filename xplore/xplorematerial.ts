interface Window {
    MDCRipple: any;
}

namespace XploreMaterial {
    export class Button extends Xplore {
        constructor(param: XploreParam) {
            super(param, "material-button");
        }

        Refresh(): void {
            let html = `<button class="mdc-button mdc-button--raised">
                        <span class="mdc-button__label">Contained Button</span>
                        </button>`;

            this.object.innerHTML = html;
            //const buttonRipple = new window.MDCRipple(this.object);
        }
    }
}