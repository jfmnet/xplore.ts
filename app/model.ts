class StructureModel extends XCanvas2DModel {
    nodes: StructureGraphics.Nodes = new StructureGraphics.Nodes();
    members: StructureGraphics.Members = new StructureGraphics.Members();
    supports: StructureGraphics.Supports = new StructureGraphics.Supports();

    Add(object: XCanvas2DGraphics): XCanvas2DGraphics {
        if (object instanceof StructureGraphics.Node)
            this.nodes.Add(object);
        else if (object instanceof StructureGraphics.Member) {
            //Add nodes
            this.nodes.Add(new StructureGraphics.Node(object.x1, object.y1));
            this.nodes.Add(new StructureGraphics.Node(object.x2, object.y2));

            //Add member
            this.members.Add(object);
        } else if (object instanceof StructureGraphics.Support) {
            this.supports.Add(object);
        }

        return object;
    }

    ClearSelection(): void {
        for (let item of this.nodes.items)
            item.selected = false;

        for (let item of this.members.items)
            item.selected = false;
    }

    Render(canvas: XCanvas2D): void {
        this.members.Render(canvas);
        this.nodes.Render(canvas);
        this.supports.Render(canvas);
    }

    SelectByRectangle(canvas: XCanvas2D, mouse: XMouse): XCanvas2DGraphics[] {
        let list: XCanvas2DGraphics[] = [];

        for (let item of this.nodes.items) {
            if (item.SelectByRectangle(canvas, mouse)) {
                list.push(item);
            }
        }

        for (let item of this.members.items) {
            if (item.SelectByRectangle(canvas, mouse)) {
                list.push(item);
            }
        }

        return list;
    }

    SnapOnPoint(canvas: XCanvas2D, mouse: XMouse): boolean {
        if (canvas.settings.snaponpoint)
            for (let item of this.nodes.items) {
                if (item.IsEqual(mouse.current.x, mouse.current.y, canvas.gridinterval)) {
                    mouse.current.x = item.x;
                    mouse.current.y = item.y;
                    return true;
                }
            }

        return false;
    }
}