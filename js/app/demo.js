function SampleApp() {
    var menu = new Xplore.MenuContainer();
    var file = menu.Add(new Xplore.Menu({ icon: "file-document-outline", text: "File" }));
    file.Add(new Xplore.Menu({ icon: "file-outline", text: "New", shortcut: "CTRL+N", onclick: MenuClick }));
    file.Add(new Xplore.Menu({ icon: "folder-open-outline", text: "Open", shortcut: "CTRL+O", onclick: MenuClick }));
    file.Add(new Xplore.Menu({ icon: "content-save-outline", text: "Save", shortcut: "CTRL+S", onclick: MenuClick }));
    var edit = menu.Add(new Xplore.Menu({ text: "Edit" }));
    edit.Add(new Xplore.Menu({ text: "New", onclick: MenuClick }));
    edit.Add(new Xplore.Menu({ text: "Open", onclick: MenuClick }));
    edit.Add(new Xplore.Menu({ text: "Save", onclick: MenuClick }));
    menu.Show();
}
function MenuClick(sender) {
    alert();
}
function ShowInput() {
    var form = new Xplore.Form({
        text: "Inputs",
    });
    form.height = 600;
    var scroll = form.Add(new Xplore.ScrollContainer());
    var input = new Xplore.Input(XINPUTTYPE.BUTTON, {
        text: "Button",
    });
    input.value = "Button";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.CHECKBOX, {
        text: "Checkbox",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.COLOR, {
        text: "Color",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.DATE, {
        text: "Date",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.DATETIME, {
        text: "Date Time",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.EMAIL, {
        text: "Email",
    });
    input.value = "Text";
    scroll.Add(input);
    // input = new Xplore.Input(XINPUTTYPE.FILE, {
    //     text: "File",
    // });
    // input.value = "Text";
    // scroll.Add(input);
    // input = new Xplore.Input(XINPUTTYPE.IMAGE, {
    //     text: "Image",
    // });
    // input.value = "Text";
    // scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.MONTH, {
        text: "Month",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.NUMBER, {
        text: "Number",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.PASSWORD, {
        text: "Password",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.RADIO, {
        text: "Metric",
    });
    input.name = "unit";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.RADIO, {
        text: "US",
    });
    input.name = "unit";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.RADIO, {
        text: "SI",
    });
    input.name = "unit";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.RANGE, {
        text: "Range",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.RESET, {
        text: "Reset",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.TELEPHONE, {
        text: "Telephone",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.SEARCH, {
        text: "Search",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.SUBMIT, {
        text: "Submit",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.WEEK, {
        text: "Week",
    });
    input.value = "Text";
    scroll.Add(input);
    input = new Xplore.Input(XINPUTTYPE.TEXT, {
        text: "Text",
    });
    input.value = "Text";
    scroll.Add(input);
    form.Show();
}
function ShowCanvas() {
    var splitter = new Xplore.SplitContainer();
    splitter.splittersize = 4;
    splitter.Show();
    //Canvas 2D
    var canvas2d = new XCanvas2D();
    splitter.Set(canvas2d, 0);
    var line = new XCanvas2DGraphics.Line(-5, -5, 5, 5);
    canvas2d.model.Add(line);
    var rect = new XCanvas2DGraphics.Rectangle(-3, 3, 3, -3);
    canvas2d.model.Add(rect);
    canvas2d.Render();
    canvas2d.ZoomAll();
    //Canvas 3D
    var canvas3d = new XCanvas3D();
    splitter.Set(canvas3d, 1);
    var object = new THREE.Object3D();
    canvas3d.SetObjects(object);
    var grid = new XCanvas3DGraphics.UniformGridXY(-10, -10, 0, 10, 10, 0, 1);
    object.add(grid.Generate());
    var axis = new XCanvas3DGraphics.Axis();
    object.add(axis.Generate());
    canvas3d.Render();
}
//# sourceMappingURL=demo.js.map