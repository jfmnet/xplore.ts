enum XCanvas3DActions {
    SELECT = 1,
    WINDOWSELECT = 2,
    WINDOWZOOM = 3
}

class XCanvas3DSettings {
    showtoolbar: boolean = false;
    backcolor: number = 0x000000;
    minor = "#11171a";
}

class XCanvas3D extends Xplore {
    canvas: HTMLCanvasElement;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    aspect: number = 1;
    controls: THREE.OrbitControls;
    sunLight: THREE.DirectionalLight;
    modelbounds: XBounds3D;
    settings: XCanvas3DSettings = new XCanvas3DSettings();
    sceneobject: THREE.Object3D;
    action: XCanvas3DActions = XCanvas3DActions.SELECT;
    mousedown: XPoint2D = new XPoint2D();
    mousemove: XPoint2D = new XPoint2D();
    windowselector: HTMLDivElement;

    selectionbox: THREE.SelectionBox;
    selectionhelper: THREE.SelectionHelper;


    static font: THREE.Font;

    //Toolbar
    buttons: Xplore.Button[] = [];


    constructor() {
        super(null, "canvas");
        this.LoadFont();
    }

    Refresh(): void {
        let self = this;

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

    InitializeCamera(): void {
        this.camera = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 0.1, 10000);
        this.camera.position.x = -2;
        this.camera.position.y = -2;
        this.camera.position.z = 2;
        this.camera.up.set(0, 0, 1);
    };

    InitializeRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setClearColor(this.settings.backcolor);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.object.appendChild(this.renderer.domElement);
    };

    InitializeLight(): void {
        this.AddSunlight();

        this.scene.add(new THREE.AmbientLight(0xffffff));

        // let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
        // light1.position.set(750, 1000, 1000);
        // this.scene.add(light1);

        let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(-1000, -750, 500);
        this.scene.add(light2);
    };

    AddSunlight(): void {
        let radius = 100;

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.shadow.camera.left = - radius;
        this.sunLight.shadow.camera.right = radius;
        this.sunLight.shadow.camera.top = radius;
        this.sunLight.shadow.camera.bottom = - radius;
        this.sunLight.shadow.mapSize.width = 4096;
        this.sunLight.shadow.mapSize.height = 4096;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 10000;

        this.sunLight.position.set(3000, 5000, 5000);
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
    };

    AddGround(): void {
        const floorMaterial = new THREE.MeshPhongMaterial({ color: '#252a34' });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 8, 8), floorMaterial);
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    //Toolbar

    ShowToolbar(): void {
        if (this.settings.showtoolbar) {
            let self = this;
            let toolbar = new Xplore.Toolbar();

            for (let button of this.buttons)
                toolbar.Add(button);

            toolbar.Add(new Xplore.Button({
                icon: "magnify-plus-outline",
                onclick: function () {
                    self.ZoomIn();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-minus-outline",
                onclick: function () {
                    self.ZoomOut();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-scan",
                onclick: function () {
                    self.action = XCanvas3DActions.WINDOWZOOM;
                    self.controls.handlemouseevent = false;
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "magnify-close",
                onclick: function () {
                    self.ZoomAll();
                }
            }));

            toolbar.Add(new Xplore.Button({
                icon: "cog-outline",
                onclick: function () {
                    self.ShowSettings();
                }
            }));

            toolbar.Show(this.object);
        }
    }


    //Mouse events

    MouseDown(event: MouseEvent): void {
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
    }

    MouseMove(event: MouseEvent): void {
        switch (this.action) {
            case XCanvas3DActions.WINDOWZOOM:
                break;
        }
    }

    MouseUp(event: MouseEvent): void {
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
    }


    //Zoom

    ZoomWindow(): void {
        this.Resize();

        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;

        let left = this.parent.offsetLeft;
        let top = this.parent.offsetTop;

        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();

        let z = (this.camera.near + this.camera.far) / (this.camera.near - this.camera.far);
        let vector1 = new THREE.Vector3(((this.mousedown.x - left) / width) * 2 - 1, - ((this.mousedown.y - top) / height) * 2 + 1, z).unproject(this.camera);
        let vector2 = new THREE.Vector3(((this.mousemove.x - left) / width) * 2 - 1, - ((this.mousemove.y - top) / height) * 2 + 1, z).unproject(this.camera);

        let bounds = new XBounds3D(Math.min(vector1.x, vector2.x), Math.min(vector1.y, vector2.y), Math.min(vector1.z, vector2.z),
            Math.max(vector1.x, vector2.x), Math.max(vector1.y, vector2.y), Math.max(vector1.z, vector2.z));

        let bx = (bounds.x2 + bounds.x1) / 2;
        let by = (bounds.y2 + bounds.y1) / 2;
        let bz = (bounds.z2 + bounds.z1) / 2;

        let center = new THREE.Vector3(bx, by, bz);
        let radius = Math.max(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1, bounds.z2 - bounds.z1) / 2;

        if (this.canvas.height > this.canvas.width)
            radius *= this.canvas.height / this.canvas.width;

        let fov = this.camera.fov * Math.PI / 180;
        let len = 1.25 * radius / Math.sin(fov);

        this.camera.position.set(center.x - len, center.y - len, center.z + len / 2);
        this.camera.lookAt(center);

        let incline = Math.min(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1, (bounds.x2 - bounds.x1 - bounds.y2 + bounds.y1) / 2) * Math.sin(Math.PI / 4);
        this.controls.target.set(center.x - incline * 1.25, center.y, center.z);

        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    ZoomAll(modelbounds?: XBounds3D): void {
        this.Resize();

        let obj = this.scene;
        let bounds = new THREE.Box3().setFromObject(obj);

        if (modelbounds) {
            this.modelbounds = modelbounds;
            bounds.min.x = modelbounds.x1;
            bounds.min.y = modelbounds.y1;
            bounds.min.z = modelbounds.z1;

            bounds.max.x = modelbounds.x2;
            bounds.max.y = modelbounds.y2;
            bounds.max.z = modelbounds.z2;

        } else if (this.modelbounds) {
            modelbounds = this.modelbounds;

            bounds.min.x = modelbounds.x1;
            bounds.min.y = modelbounds.y1;
            bounds.min.z = modelbounds.z1;

            bounds.max.x = modelbounds.x2;
            bounds.max.y = modelbounds.y2;
            bounds.max.z = modelbounds.z2;
        }

        let bx = (bounds.max.x + bounds.min.x) / 2;
        let by = (bounds.max.y + bounds.min.y) / 2;
        let bz = (bounds.max.z + bounds.min.z) / 2;

        let center = new THREE.Vector3(bx, by, bz);
        let radius = Math.max(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, bounds.max.z - bounds.min.z) / 2;

        if (this.canvas.height * 1.10 > this.canvas.width)
            radius *= this.canvas.height * 1.10 / this.canvas.width;

        let fov = this.camera.fov * Math.PI / 180;
        let len = 1.30 * radius / (Math.sin(fov));

        this.camera.position.set(center.x - len, center.y - len, center.z);

        this.camera.lookAt(center);

        let incline = Math.min(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, (bounds.max.x - bounds.min.x - bounds.max.y + bounds.min.y) / 2) * Math.sin(Math.PI / 4);
        this.controls.target.set(center.x - incline, center.y, center.z);

        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    ZoomOut(): void {
        this.controls.zoomOut();
    }

    ZoomIn(): void {
        this.controls.zoomIn();
    }

    Resize(): void {
        this.canvas.width = this.object.offsetWidth;
        this.canvas.height = this.object.offsetHeight;

        this.aspect = this.canvas.width / this.canvas.height;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.Render();
    };

    Render(): void {
        this.renderer.render(this.scene, this.camera);
    };


    //Objects

    ClearObjects(): void {
        let objects: THREE.Object3D[] = [];

        for (let item of this.scene.children) {
            if (item.type !== "Object3D" && item.type !== "Mesh")
                objects.push(item);
        }

        this.scene.children = objects;
    }

    SetObjects(object: THREE.Object3D): void {
        this.sceneobject = object;
        this.scene.add(object);
    };

    AddObject(object: THREE.Object3D): void {
        this.scene.add(object);
    };

    //Other functionalities

    ShowSettings(): void {
    }

    LoadFont(): void {
        let loader = new THREE.FontLoader();

        loader.load('fonts/arial.json', function (response) {
            XCanvas3D.font = response;
        });
    };
}
