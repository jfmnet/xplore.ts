class MainView {
    canvas2D: XCanvas2D;
    canvas3D: XCanvas3D;

    Show(): void {
        this.InitializeShortCuts();
        this.ShowInterface();
    }

    InitializeShortCuts(): void {
        let self = this;

        Xplore.shortcuts["escape"] = {
            action: () => { self.Select(); }
        };
    }

    ShowInterface(): void {
        let splitter = new Xplore.SplitContainer();
        splitter.orientation = XORIENTATION.VERTICAL;
        splitter.size = [56];
        splitter.Show();

        this.ShowMenuToolbar(splitter);
        this.ShowCanvas(splitter);
    }

    ShowMenuToolbar(container: Xplore.SplitContainer): void {
        let splitter = new Xplore.SplitContainer();
        splitter.orientation = XORIENTATION.VERTICAL;
        splitter.size = [24];
        container.Set(splitter, 0);

        this.ShowMenu(splitter);
        this.ShowToolbar(splitter);
    }

    ShowCanvas(container: Xplore.SplitContainer): void {
        let splitter = new Xplore.SplitContainer();
        container.Set(splitter, 1);

        this.canvas2D = new XCanvas2D();
        this.canvas2D.model = new StructureModel();

        splitter.Set(this.canvas2D, 0);

        this.canvas3D = new XCanvas3D();
        this.canvas3D.settings.backcolor = 0x000000;
        this.canvas3D.settings.showtoolbar = true;
        splitter.Set(this.canvas3D, 1);

        let object = new THREE.Object3D;
        let axis = new XCanvas3DGraphics.Axis();

        object.add(axis.Generate());
        this.canvas3D.SetObjects(object);
    }

    ShowMenu(splitter: Xplore.SplitContainer): void {
        let menu = new Xplore.MenuContainer();

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
    }

    ShowFileMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "File" }));
        container.Add(new Xplore.Menu({ text: "New Project", icon: "file-outline", shortcut: "CTRL+N" }));
        container.Add(new Xplore.Menu({ text: "Open Project", icon: "folder-outline", shortcut: "CTRL+O" }));
        container.Add(new Xplore.Menu({ text: "Save Project", icon: "content-save-outline", shortcut: "CTRL+S" }));
        container.Add(new Xplore.Menu({ text: "Save Project As", icon: "file" }));
    }

    ShowEditMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Edit" }));
    }

    ShowViewMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "View" }));
    }

    ShowDrawMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Draw" }));
    }

    ShowAssignMenu(menu: Xplore.MenuContainer): void {
        let self = this;

        let container = menu.Add(new Xplore.Menu({ text: "Assign" }));
        container.Add(new Xplore.Menu({ text: "Support", icon: "file-outline", shortcut: "CTRL+N", onclick: function () { self.AssignSupport(); } }));
        container.Add(new Xplore.Menu({ text: "Open Project", icon: "folder-outline", shortcut: "CTRL+O" }));
    }

    ShowAnalyzeMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Analyze" }));
    }

    ShowResultsMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Results" }));
    }

    ShowToolsMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Tools" }));
    }

    ShowHelpMenu(menu: Xplore.MenuContainer): void {
        let container = menu.Add(new Xplore.Menu({ text: "Help" }));
    }

    ShowToolbar(splitter: Xplore.SplitContainer): void {
        let container = new Xplore.ToolbarContainer();
        let self = this;

        let toolbar = container.Add(new Xplore.Toolbar());
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
            onclick: () => {
                self.DrawNode();
            }
        }));

        toolbar.Add(new Xplore.Button({
            icon: "ray-start-end",
            onclick: () => {
                self.DrawMember();
            }
        }));

        toolbar.Add(new Xplore.Button({
            icon: "download-lock-outline",
            onclick: () => {
                self.AssignSupport();
            }
        }));

        splitter.Set(container, 1);
    }


    //Menu and toolbar handlers

    FileNew(): void {
    }

    Analyze(): void {
    }

    DrawNode(): void {
        this.canvas2D.model.Draw(StructureGraphics.Node);
    }

    DrawMember(): void {
        this.canvas2D.model.Draw(StructureGraphics.Member);
    }

    AssignSupport(): void {
        let form = new Xplore.Form({
            text: "Assign Support",
            width: 300,
            height: 500
        });

        let grid = form.Add(new Xplore.Grid({ classes: ["support-grid"] })) as Xplore.Grid;
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

        let x = form.Add(new Xplore.Checkbox({ text: "Translation X" })) as Xplore.Checkbox;
        let y = form.Add(new Xplore.Checkbox({ text: "Translation Y" })) as Xplore.Checkbox;
        let z = form.Add(new Xplore.Checkbox({ text: "Translation Z" })) as Xplore.Checkbox;

        let rx = form.Add(new Xplore.Checkbox({ text: "Rotation X" })) as Xplore.Checkbox;
        let ry = form.Add(new Xplore.Checkbox({ text: "Rotation Y" })) as Xplore.Checkbox;
        let rz = form.Add(new Xplore.Checkbox({ text: "Rotation Z" })) as Xplore.Checkbox;

        form.Show();
    }

    Select(): void {
        this.canvas2D.model.action = XCanvasActions.SELECT;
        this.canvas2D.model.ClearSelection();
        this.canvas2D.Render();
    }
}