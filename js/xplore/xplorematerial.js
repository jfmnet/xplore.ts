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
import '@material/ripple';
var XploreMaterial;
(function (XploreMaterial) {
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(param) {
            return _super.call(this, param, "material-button") || this;
        }
        Button.prototype.Refresh = function () {
            var html = "<button class=\"mdc-button mdc-button--raised\">\n                        <span class=\"mdc-button__label\">Contained Button</span>\n                        </button>";
            this.object.innerHTML = html;
            //const buttonRipple = new window.MDCRipple(this.object);
        };
        return Button;
    }(Xplore));
    XploreMaterial.Button = Button;
})(XploreMaterial || (XploreMaterial = {}));
//# sourceMappingURL=xplorematerial.js.map