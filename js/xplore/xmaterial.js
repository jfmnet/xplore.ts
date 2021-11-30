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
var XMaterialDesign = /** @class */ (function (_super) {
    __extends(XMaterialDesign, _super);
    function XMaterialDesign() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XMaterialDesign;
}(Xplore));
(function (XMaterialDesign) {
    var AppBar = /** @class */ (function (_super) {
        __extends(AppBar, _super);
        function AppBar(text) {
            var _this = _super.call(this) || this;
            _this.text = text;
            return _this;
        }
        AppBar.prototype.Refresh = function () {
            var html = "<header class=\"mdc-top-app-bar\">\n                            <div class=\"mdc-top-app-bar__row\">\n                            <section class=\"mdc-top-app-bar__section mdc-top-app-bar__section--align-start\">\n                                <button class=\"material-icons mdc-top-app-bar__navigation-icon mdc-icon-button\" aria-label=\"Open navigation menu\">menu</button>\n                                <span class=\"mdc-top-app-bar__title\">" + this.text + "</span>\n                            </section>\n                            <section class=\"mdc-top-app-bar__section mdc-top-app-bar__section--align-end\" role=\"toolbar\">\n                                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Favorite\">favorite</button>\n                                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Search\">search</button>\n                                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Options\">more_vert</button>\n                            </section>\n                            </div>\n                        </header>\n                        <main class=\"mdc-top-app-bar--fixed-adjust\">\n                        </main>";
            this.object.innerHTML = html;
            var body = this.object.querySelector(".mdc-top-app-bar--fixed-adjust");
            //Children
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].Show(body);
            }
        };
        return AppBar;
    }(XMaterialDesign));
    XMaterialDesign.AppBar = AppBar;
})(XMaterialDesign || (XMaterialDesign = {}));
//# sourceMappingURL=xmaterial.js.map