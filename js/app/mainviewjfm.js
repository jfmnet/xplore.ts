var MainViewJFM = /** @class */ (function () {
    function MainViewJFM() {
    }
    MainViewJFM.prototype.Show = function () {
        this.InitializeShortCuts();
        this.ShowInterface();
    };
    MainViewJFM.prototype.InitializeShortCuts = function () {
        var self = this;
        Xplore.shortcuts["escape"] = {
            action: function () { self.Select(); }
        };
    };
    MainViewJFM.prototype.ShowInterface = function () {
        var splitter = new Xplore.SplitContainer();
        splitter.orientation = XORIENTATION.VERTICAL;
        splitter.size = [56];
        splitter.Show();
        this.ShowMenuToolbar(splitter);
        this.ShowCanvas(splitter);
    };
    MainViewJFM.prototype.ShowMenuToolbar = function (container) {
        var splitter = new Xplore.SplitContainer();
        splitter.orientation = XORIENTATION.VERTICAL;
        splitter.size = [24];
        container.Set(splitter, 0);
        this.ShowMenu(splitter);
        this.ShowToolbar(splitter);
    };
    MainViewJFM.prototype.ShowCanvas = function (container) {
        var splitter = new Xplore.SplitContainer();
        container.Set(splitter, 1);
        this.canvas2D = new XCanvas2D();
        this.canvas2D.model = new StructureModel();
        splitter.Set(this.canvas2D, 0);
        this.canvas3D = new XCanvas3D();
        this.canvas3D.settings.backcolor = 0x000000;
        this.canvas3D.settings.showtoolbar = true;
        splitter.Set(this.canvas3D, 1);
        var object = new THREE.Object3D;
        var axis = new XCanvas3DGraphics.Axis();
        object.add(axis.Generate());
        this.canvas3D.SetObjects(object);
    };
    MainViewJFM.prototype.ShowMenu = function (splitter) {
        var menu = new Xplore.MenuContainer();
        this.ShowFileMenu(menu);
        this.ShowEditMenu(menu);
        this.ShowViewMenu(menu);
        this.ShowDrawMenu(menu);
        this.ShowAssignMenu(menu);
        this.ShowAnalyzeMenu(menu);
        this.ShowResultsMenu(menu);
        this.ShowToolsMenu(menu);
        this.ShowHelpMenu(menu);
        splitter.Set(menu, 0);
    };
    MainViewJFM.prototype.ShowFileMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "File" }));
        container.Add(new Xplore.Menu({ text: "New Project", icon: "file-outline", shortcut: "CTRL+N" }));
        container.Add(new Xplore.Menu({ text: "Open Project", icon: "folder-outline", shortcut: "CTRL+O" }));
        container.Add(new Xplore.Menu({ text: "Save Project", icon: "content-save-outline", shortcut: "CTRL+S" }));
        container.Add(new Xplore.Menu({ text: "Save Project As", icon: "file" }));
    };
    MainViewJFM.prototype.ShowEditMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Edit" }));
    };
    MainViewJFM.prototype.ShowViewMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "View" }));
    };
    MainViewJFM.prototype.ShowDrawMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Draw" }));
    };
    MainViewJFM.prototype.ShowAssignMenu = function (menu) {
        var self = this;
        var container = menu.Add(new Xplore.Menu({ text: "Assign" }));
        container.Add(new Xplore.Menu({ text: "Support", icon: "file-outline", shortcut: "CTRL+N", onclick: function () { self.AssignSupport(); } }));
        container.Add(new Xplore.Menu({ text: "Open Project", icon: "folder-outline", shortcut: "CTRL+O" }));
    };
    MainViewJFM.prototype.ShowAnalyzeMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Analyze" }));
    };
    MainViewJFM.prototype.ShowResultsMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Results" }));
    };
    MainViewJFM.prototype.ShowToolsMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Tools" }));
    };
    MainViewJFM.prototype.ShowHelpMenu = function (menu) {
        var container = menu.Add(new Xplore.Menu({ text: "Help" }));
    };
    MainViewJFM.prototype.ShowToolbar = function (splitter) {
        var container = new Xplore.ToolbarContainer();
        var self = this;
        var toolbar = container.Add(new Xplore.Toolbar());
        toolbar.Add(new Xplore.Button({
            icon: "file-outline",
            onclick: this.FileNew
        }));
        toolbar.Add(new Xplore.Button({ icon: "folder-outline" }));
        toolbar.Add(new Xplore.Button({ icon: "content-save-outline" }));
        toolbar = container.Add(new Xplore.Toolbar());
        toolbar.Add(new Xplore.Button({
            icon: "play",
            onclick: this.Analyze
        }));
        toolbar = container.Add(new Xplore.Toolbar());
        toolbar.Add(new Xplore.Button({
            icon: "square-medium",
            onclick: function () {
                self.DrawNode();
            }
        }));
        toolbar.Add(new Xplore.Button({
            icon: "ray-start-end",
            onclick: function () {
                self.DrawMember();
            }
        }));
        toolbar.Add(new Xplore.Button({
            icon: "download-lock-outline",
            onclick: function () {
                self.AssignSupport();
            }
        }));
        splitter.Set(container, 1);
    };
    //Menu and toolbar handlers
    MainViewJFM.prototype.FileNew = function () {
    };
    MainViewJFM.prototype.Analyze = function () {
    };
    MainViewJFM.prototype.DrawNode = function () {
        this.canvas2D.model.Draw(StructureGraphics.Node);
    };
    MainViewJFM.prototype.DrawMember = function () {
        this.canvas2D.model.Draw(StructureGraphics.Member);
    };
    MainViewJFM.prototype.AssignSupport = function () {
        var form = new Xplore.Form({
            text: "Assign Support",
            width: 300,
            height: 500
        });
        var grid = form.Add(new Xplore.Grid({ classes: ["support-grid"] }));
        grid.Set(new Xplore.Button({
            text: "Roller-X",
            onclick: function () {
                x.checked = true;
                y.checked = false;
                z.checked = false;
                rx.checked = false;
                ry.checked = false;
                rz.checked = false;
            }
        }), 0, 0);
        grid.Set(new Xplore.Button({
            text: "Roller-Y",
            onclick: function () {
                x.checked = false;
                y.checked = true;
                z.checked = false;
                rx.checked = false;
                ry.checked = false;
                rz.checked = false;
            }
        }), 0, 1);
        grid.Set(new Xplore.Button({
            text: "Hinge",
            onclick: function () {
                x.checked = true;
                y.checked = true;
                z.checked = false;
                rx.checked = false;
                ry.checked = false;
                rz.checked = false;
            }
        }), 1, 0);
        grid.Set(new Xplore.Button({
            text: "Fixed",
            onclick: function () {
                x.checked = true;
                y.checked = true;
                z.checked = false;
                rx.checked = true;
                ry.checked = true;
                rz.checked = false;
            }
        }), 1, 1);
        var x = form.Add(new Xplore.Checkbox({ text: "Translation X" }));
        var y = form.Add(new Xplore.Checkbox({ text: "Translation Y" }));
        var z = form.Add(new Xplore.Checkbox({ text: "Translation Z" }));
        var rx = form.Add(new Xplore.Checkbox({ text: "Rotation X" }));
        var ry = form.Add(new Xplore.Checkbox({ text: "Rotation Y" }));
        var rz = form.Add(new Xplore.Checkbox({ text: "Rotation Z" }));
        form.Show();
    };
    MainViewJFM.prototype.Select = function () {
        this.canvas2D.model.action = XCanvasActions.SELECT;
        this.canvas2D.model.ClearSelection();
        this.canvas2D.Render();
    };
    return MainViewJFM;
}());
//# sourceMappingURL=mainviewjfm.js.map