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
var XCanvas3DActions;
(function (XCanvas3DActions) {
    XCanvas3DActions[XCanvas3DActions["SELECT"] = 1] = "SELECT";
    XCanvas3DActions[XCanvas3DActions["WINDOWSELECT"] = 2] = "WINDOWSELECT";
    XCanvas3DActions[XCanvas3DActions["WINDOWZOOM"] = 3] = "WINDOWZOOM";
})(XCanvas3DActions || (XCanvas3DActions = {}));
var XCanvas3DSettings = /** @class */ (function () {
    function XCanvas3DSettings() {
        this.showtoolbar = false;
        this.backcolor = 0x000000;
        this.minor = "#11171a";
    }
    return XCanvas3DSettings;
}());
var XCanvas3D = /** @class */ (function (_super) {
    __extends(XCanvas3D, _super);
    function XCanvas3D() {
        var _this = _super.call(this, null, "canvas") || this;
        _this.aspect = 1;
        _this.settings = new XCanvas3DSettings();
        _this.action = XCanvas3DActions.SELECT;
        _this.mousedown = new XPoint2D();
        _this.mousemove = new XPoint2D();
        //Toolbar
        _this.buttons = [];
        _this.LoadFont();
        return _this;
    }
    XCanvas3D.prototype.Refresh = function () {
        var self = this;
        this.object.innerHTML = "";
        this.scene = new THREE.Scene();
        this.InitializeCamera();
        this.InitializeRenderer();
        this.InitializeLight();
        this.AddGround();
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', function () { self.Render(); });
        this.canvas = this.renderer.domElement;
        this.canvas.addEventListener('pointerdown', function (event) { self.MouseDown(event); });
        this.canvas.addEventListener('pointermove', function (event) { self.MouseMove(event); });
        this.canvas.addEventListener('pointerup', function (event) { self.MouseUp(event); });
        //Subscribe to the resize event
        if (!window.onresize) {
            window.onresize = function () {
                self.Resize();
            };
        }
        setTimeout(function () {
            self.Resize();
            clearTimeout();
        }, 100);
        this.Resize();
        this.ShowToolbar();
    };
    ;
    XCanvas3D.prototype.InitializeCamera = function () {
        this.camera = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 0.1, 10000);
        this.camera.position.x = -2;
        this.camera.position.y = -2;
        this.camera.position.z = 2;
        this.camera.up.set(0, 0, 1);
    };
    ;
    XCanvas3D.prototype.InitializeRenderer = function () {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setClearColor(this.settings.backcolor);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.object.appendChild(this.renderer.domElement);
    };
    ;
    XCanvas3D.prototype.InitializeLight = function () {
        this.AddSunlight();
        this.scene.add(new THREE.AmbientLight(0xffffff));
        // let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
        // light1.position.set(750, 1000, 1000);
        // this.scene.add(light1);
        var light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-1000, -750, 500);
        this.scene.add(light2);
    };
    ;
    XCanvas3D.prototype.AddSunlight = function () {
        var radius = 100;
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.shadow.camera.left = -radius;
        this.sunLight.shadow.camera.right = radius;
        this.sunLight.shadow.camera.top = radius;
        this.sunLight.shadow.camera.bottom = -radius;
        this.sunLight.shadow.mapSize.width = 4096;
        this.sunLight.shadow.mapSize.height = 4096;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 10000;
        this.sunLight.position.set(3000, 5000, 5000);
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
    };
    ;
    XCanvas3D.prototype.AddGround = function () {
        var floorMaterial = new THREE.MeshPhongMaterial({ color: '#252a34' });
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 8, 8), floorMaterial);
        floor.receiveShadow = true;
        this.scene.add(floor);
    };
    //Toolbar
    XCanvas3D.prototype.ShowToolbar = function () {
        if (this.settings.showtoolbar) {
            var self_1 = this;
            var toolbar_1 = new Xplore.Toolbar();
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var button = _a[_i];
                toolbar_1.Add(button);
            }
            toolbar_1.Add(new Xplore.Button({
                icon: "magnify-plus-outline",
                onclick: function () {
                    self_1.ZoomIn();
                }
            }));
            toolbar_1.Add(new Xplore.Button({
                icon: "magnify-minus-outline",
                onclick: function () {
                    self_1.ZoomOut();
                }
            }));
            toolbar_1.Add(new Xplore.Button({
                icon: "magnify-scan",
                onclick: function () {
                    self_1.action = XCanvas3DActions.WINDOWZOOM;
                    self_1.controls.handlemouseevent = false;
                }
            }));
            toolbar_1.Add(new Xplore.Button({
                icon: "magnify-close",
                onclick: function () {
                    self_1.ZoomAll();
                }
            }));
            toolbar_1.Add(new Xplore.Button({
                icon: "cog-outline",
                onclick: function () {
                    self_1.ShowSettings();
                }
            }));
            toolbar_1.Show(this.object);
        }
    };
    //Mouse events
    XCanvas3D.prototype.MouseDown = function (event) {
        // switch (this.action) {
        //     case XCanvas3DActions.WINDOWZOOM:
        //         if (event.buttons === 1) {
        //             this.mousedown.x = event.clientX;
        //             this.mousedown.y = event.clientY;
        //             let material: THREE.MeshPhongMaterial;
        //             if (this.selectionbox) {
        //                 for (let i = 0; i < this.selectionbox.collection.length; i++) {
        //                     if (this.selectionbox.collection[i].material instanceof THREE.MeshPhongMaterial) {
        //                         material = this.selectionbox.collection[i].material as THREE.MeshPhongMaterial;
        //                         material.emissive.set(0x111111);
        //                     }
        //                 }
        //             } else {
        //                 this.selectionbox = new THREE.SelectionBox(this.camera, this.scene);
        //                 this.selectionhelper = new THREE.SelectionHelper(this.selectionbox, this.renderer, 'window-selector');
        //             }
        //             this.selectionbox.startPoint.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        //         } else {
        //             this.selectionbox = null;
        //             this.selectionhelper = null;
        //         }
        //         break;
        // }
    };
    XCanvas3D.prototype.MouseMove = function (event) {
        switch (this.action) {
            case XCanvas3DActions.WINDOWZOOM:
                break;
        }
    };
    XCanvas3D.prototype.MouseUp = function (event) {
        switch (this.action) {
            case XCanvas3DActions.WINDOWZOOM:
                this.mousemove.x = event.clientX;
                this.mousemove.y = event.clientY;
                // this.action = XCanvas3DActions.SELECT;
                // this.controls.handlemouseevent = true;
                // let material: THREE.MeshPhongMaterial;
                // for (let i = 0; i < this.selectionbox.collection.length; i++) {
                //     if (this.selectionbox.collection[i].material instanceof THREE.MeshPhongMaterial) {
                //         material = this.selectionbox.collection[i].material as THREE.MeshPhongMaterial;
                //         material.emissive.set(0x111111);
                //     }
                // }
                // this.selectionbox.endPoint.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
                // const allSelected = this.selectionbox.select();
                // for (let i = 0; i < allSelected.length; i++) {
                //     if (allSelected[i].material instanceof THREE.MeshPhongMaterial) {
                //         material = allSelected[i].material as THREE.MeshPhongMaterial;
                //         material.emissive.set(0x666600);
                //     }
                // }
                // this.Render();
                this.ZoomWindow();
                break;
        }
    };
    //Zoom
    XCanvas3D.prototype.ZoomWindow = function () {
        this.Resize();
        var width = this.canvas.clientWidth;
        var height = this.canvas.clientHeight;
        var left = this.parent.offsetLeft;
        var top = this.parent.offsetTop;
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();
        var z = (this.camera.near + this.camera.far) / (this.camera.near - this.camera.far);
        var vector1 = new THREE.Vector3(((this.mousedown.x - left) / width) * 2 - 1, -((this.mousedown.y - top) / height) * 2 + 1, z).unproject(this.camera);
        var vector2 = new THREE.Vector3(((this.mousemove.x - left) / width) * 2 - 1, -((this.mousemove.y - top) / height) * 2 + 1, z).unproject(this.camera);
        var bounds = new XBounds3D(Math.min(vector1.x, vector2.x), Math.min(vector1.y, vector2.y), Math.min(vector1.z, vector2.z), Math.max(vector1.x, vector2.x), Math.max(vector1.y, vector2.y), Math.max(vector1.z, vector2.z));
        var bx = (bounds.x2 + bounds.x1) / 2;
        var by = (bounds.y2 + bounds.y1) / 2;
        var bz = (bounds.z2 + bounds.z1) / 2;
        var center = new THREE.Vector3(bx, by, bz);
        var radius = Math.max(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1, bounds.z2 - bounds.z1) / 2;
        if (this.canvas.height > this.canvas.width)
            radius *= this.canvas.height / this.canvas.width;
        var fov = this.camera.fov * Math.PI / 180;
        var len = 1.25 * radius / Math.sin(fov);
        this.camera.position.set(center.x - len, center.y - len, center.z + len / 2);
        this.camera.lookAt(center);
        var incline = Math.min(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1, (bounds.x2 - bounds.x1 - bounds.y2 + bounds.y1) / 2) * Math.sin(Math.PI / 4);
        this.controls.target.set(center.x - incline * 1.25, center.y, center.z);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    };
    XCanvas3D.prototype.ZoomAll = function (modelbounds) {
        this.Resize();
        var obj = this.scene;
        var bounds = new THREE.Box3().setFromObject(obj);
        if (modelbounds) {
            this.modelbounds = modelbounds;
            bounds.min.x = modelbounds.x1;
            bounds.min.y = modelbounds.y1;
            bounds.min.z = modelbounds.z1;
            bounds.max.x = modelbounds.x2;
            bounds.max.y = modelbounds.y2;
            bounds.max.z = modelbounds.z2;
        }
        else if (this.modelbounds) {
            modelbounds = this.modelbounds;
            bounds.min.x = modelbounds.x1;
            bounds.min.y = modelbounds.y1;
            bounds.min.z = modelbounds.z1;
            bounds.max.x = modelbounds.x2;
            bounds.max.y = modelbounds.y2;
            bounds.max.z = modelbounds.z2;
        }
        var bx = (bounds.max.x + bounds.min.x) / 2;
        var by = (bounds.max.y + bounds.min.y) / 2;
        var bz = (bounds.max.z + bounds.min.z) / 2;
        var center = new THREE.Vector3(bx, by, bz);
        var radius = Math.max(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, bounds.max.z - bounds.min.z) / 2;
        if (this.canvas.height * 1.10 > this.canvas.width)
            radius *= this.canvas.height * 1.10 / this.canvas.width;
        var fov = this.camera.fov * Math.PI / 180;
        var len = 1.30 * radius / (Math.sin(fov));
        this.camera.position.set(center.x - len, center.y - len, center.z);
        this.camera.lookAt(center);
        var incline = Math.min(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, (bounds.max.x - bounds.min.x - bounds.max.y + bounds.min.y) / 2) * Math.sin(Math.PI / 4);
        this.controls.target.set(center.x - incline, center.y, center.z);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    };
    XCanvas3D.prototype.ZoomOut = function () {
        this.controls.zoomOut();
    };
    XCanvas3D.prototype.ZoomIn = function () {
        this.controls.zoomIn();
    };
    XCanvas3D.prototype.Resize = function () {
        this.canvas.width = this.object.offsetWidth;
        this.canvas.height = this.object.offsetHeight;
        this.aspect = this.canvas.width / this.canvas.height;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.Render();
    };
    ;
    XCanvas3D.prototype.Render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    ;
    //Objects
    XCanvas3D.prototype.ClearObjects = function () {
        var objects = [];
        for (var _i = 0, _a = this.scene.children; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.type !== "Object3D" && item.type !== "Mesh")
                objects.push(item);
        }
        this.scene.children = objects;
    };
    XCanvas3D.prototype.SetObjects = function (object) {
        this.sceneobject = object;
        this.scene.add(object);
    };
    ;
    XCanvas3D.prototype.AddObject = function (object) {
        this.scene.add(object);
    };
    ;
    //Other functionalities
    XCanvas3D.prototype.ShowSettings = function () {
    };
    XCanvas3D.prototype.LoadFont = function () {
        var loader = new THREE.FontLoader();
        loader.load('fonts/arial.json', function (response) {
            XCanvas3D.font = response;
        });
    };
    ;
    return XCanvas3D;
}(Xplore));
//# sourceMappingURL=xcanvas3d.js.map