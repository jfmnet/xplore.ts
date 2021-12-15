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
var XploreMaterial;
(function (XploreMaterial) {
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(param) {
            return _super.call(this, param, "material-button") || this;
        }
        Button.prototype.Refresh = function () {
            var html = '<button class="mdc-button mdc-button--raised mdc-button--icon-leading">';
            html += '<span class="mdc-button__ripple">';
            html += '</span><span class="mdc-button__touch"></span>';
            html += '<i class="material-icons mdc-button__icon" aria-hidden="true">' + this.icon + '</i>';
            html += '<span class="mdc-button__label">' + this.text + '</span>';
            html += '</button>';
            this.object.innerHTML = html;
            var buttonRipple = new window.mdc.ripple.MDCRipple(this.object.firstChild);
        };
        return Button;
    }(Xplore));
    XploreMaterial.Button = Button;
    var TopAppBar = /** @class */ (function (_super) {
        __extends(TopAppBar, _super);
        function TopAppBar(param) {
            return _super.call(this, param, "material-top-appbar") || this;
        }
        TopAppBar.prototype.Refresh = function () {
            var html = "<header class=\"mdc-top-app-bar\">\n            <div class=\"mdc-top-app-bar__row\">\n              <section class=\"mdc-top-app-bar__section mdc-top-app-bar__section--align-start\">\n                <button class=\"material-icons mdc-top-app-bar__navigation-icon mdc-icon-button\" aria-label=\"Open navigation menu\">menu</button>\n                <span class=\"mdc-top-app-bar__title\">Page title</span>\n              </section>\n              <section class=\"mdc-top-app-bar__section mdc-top-app-bar__section--align-end\" role=\"toolbar\">\n                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Favorite\">favorite</button>\n                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Search\">search</button>\n                <button class=\"material-icons mdc-top-app-bar__action-item mdc-icon-button\" aria-label=\"Options\">more_vert</button>\n              </section>\n            </div>\n          </header>\n          <main class=\"mdc-top-app-bar--fixed-adjust\">\n            App content\n          </main>";
            this.object.innerHTML = html;
            var topAppBarElement = this.object.querySelector('.mdc-top-app-bar');
            var topAppBar = new window.mdc.topAppBar.MDCTopAppBar(topAppBarElement);
            var topAppBarButton = this.object.querySelector('.mdc-icon-button');
            var buttonRipple = new window.mdc.ripple.MDCRipple(topAppBarButton);
        };
        return TopAppBar;
    }(Xplore));
    XploreMaterial.TopAppBar = TopAppBar;
    var Drawer = /** @class */ (function (_super) {
        __extends(Drawer, _super);
        function Drawer(param) {
            return _super.call(this, param, "material-top-appbar") || this;
        }
        Drawer.prototype.Refresh = function () {
            var html = "<aside class=\"mdc-drawer mdc-drawer--modal\">\n            <div class=\"mdc-drawer__header\">\n              <h3 class=\"mdc-drawer__title\">Mail</h3>\n              <h6 class=\"mdc-drawer__subtitle\">email@material.io</h6>\n            </div>\n            <div class=\"mdc-drawer__content\">\n              <nav class=\"mdc-list\">\n                <a class=\"mdc-list-item mdc-list-item--activated\" href=\"#\" aria-current=\"page\">\n                  <span class=\"mdc-list-item__ripple\"></span>\n                  <i class=\"material-icons mdc-list-item__graphic\" aria-hidden=\"true\">inbox</i>\n                  <span class=\"mdc-list-item__text\">Inbox</span>\n                </a>\n                <a class=\"mdc-list-item\" href=\"#\">\n                  <span class=\"mdc-list-item__ripple\"></span>\n                  <i class=\"material-icons mdc-list-item__graphic\" aria-hidden=\"true\">send</i>\n                  <span class=\"mdc-list-item__text\">Outgoing</span>\n                </a>\n                <a class=\"mdc-list-item\" href=\"#\">\n                  <span class=\"mdc-list-item__ripple\"></span>\n                  <i class=\"material-icons mdc-list-item__graphic\" aria-hidden=\"true\">drafts</i>\n                  <span class=\"mdc-list-item__text\">Drafts</span>\n                </a>\n              </nav>\n            </div>\n          </aside>";
            this.object.innerHTML = html;
            var drawer = this.object.querySelector('.mdc-drawer');
            var list = new window.mdc.drawer.MDCDrawer.attachTo(drawer);
        };
        return Drawer;
    }(Xplore));
    XploreMaterial.Drawer = Drawer;
})(XploreMaterial || (XploreMaterial = {}));
//# sourceMappingURL=xplorematerial.js.map