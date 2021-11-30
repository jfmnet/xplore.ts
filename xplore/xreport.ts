interface Window {
    REPORT: any;
}

class XReport extends Xplore {
    document: XReportDocument = new XReportDocument();
    page: NodeListOf<HTMLElement>;
    combo: Xplore.Combobox;

    Refresh(): void {
        let self = this;

        let splitter = new Xplore.SplitContainer();
        splitter.orientation = XORIENTATION.VERTICAL;
        splitter.size = [32];
        splitter.Show(this.object);

        //Toolbar
        let toolbarcontainer = new Xplore.ToolbarContainer();
        let toolbar = toolbarcontainer.Add(new Xplore.Toolbar());
        toolbar.Add(new Xplore.Button({
            icon: "printer",
            onclick: function () {
                self.Print();
            }
        }));

        // toolbar.Add(new Xplore.Button({ icon: "magnify-plus-outline" }));
        // toolbar.Add(new Xplore.Button({ icon: "magnify-minus-outline" }));

        this.combo = toolbar.Add(new Xplore.Combobox()) as Xplore.Combobox;
        this.combo.options = [
            "Page Width",
            "25%",
            "50%",
            "100%",
            // "125%",
            // "150%",
            // "200%",
            // "250%",
            // "300%",
        ];
        this.combo.value = "100%";
        this.combo.onchange = function () {
            self.page[0].style.transform = "scale(1)";
            let value: number;

            switch (self.combo.value) {
                case "Page Width":
                    let width = self.document.object.scrollWidth;
                    let pwidth = self.page[0].scrollWidth;
                    value = 0.95 * width / pwidth;
                    break;

                default:
                    let percent: string = self.combo.value.toString();
                    value = parseFloat(percent.replace("%", "")) / 100;
                    break;
            }

            self.Zoom(value);
        };

        splitter.Set(toolbarcontainer, 0);

        //Add report document
        splitter.Set(this.document, 1);
    }

    Render(): void {
        this.document.Render();
        this.page = this.document.object.querySelectorAll(".page");
    }

    Zoom(value: number): void {
        if (value === 1) {
            this.page[0].style.transform = null;

            this.page.forEach(item => {
                item.style.marginBottom = null;
                item.style.marginTop = null;

                item.style.transform = null;
            });

            this.page[0].style.marginTop = null;

        } else {
            this.page[0].style.transform = "scale(1)";
            let pheight = this.page[0].scrollHeight;

            this.page.forEach(item => {
                item.style.marginBottom = (value - 1) * pheight + 16 + "px";
                item.style.marginTop = (value - 1) * pheight / 2 + "px";

                item.style.transform = `scale(${value})`;
            });

            this.page[0].style.marginTop = (value - 1) * pheight / 2 + 16 + "px";
        }
    }

    Print(): void {
        let self = this;
        this.Zoom(1);

        window.REPORT = this.document;
        window.REPORT.onprint = function () {
            frame.Dispose();
        };

        let frame = new Xplore.iFrame("report.html");
        frame.classes.push("hidden");
        frame.Show();
    }
}

class XReportDocument extends Xplore {
    pagenumber: number = 0;
    currenty: number;
    container: DocumentFragment;
    page: HTMLElement;
    pages: HTMLElement[] = [];
    measure: HTMLElement;

    height: number = 9.4 * 96;

    header: string;
    footer: string;
    showdate: boolean = true;
    showpagenumber: boolean = true;

    spaceheight: number = 0;

    constructor() {
        super(undefined, "report");
    }

    Refresh(): void {
        this.object.innerHTML = "";

        let innerpage = document.createElement("div");
        innerpage.classList.add("page-inner");
        this.object.appendChild(innerpage);
        this.measure = innerpage;

        this.container = document.createDocumentFragment();
        this.NewPage();
    }

    Render(): void {
        this.object.appendChild(this.container);
    }

    NewPage(): void {
        this.pagenumber++;
        this.currenty = 0;

        this.page = document.createElement("div");
        this.page.classList.add("page");
        this.container.appendChild(this.page);

        this.pages.push(this.page);

        //Header
        if (this.header) {
            let pageheader = document.createElement("div");
            pageheader.classList.add("page-header");
            pageheader.innerHTML = this.header;
            this.page.appendChild(pageheader);
        }

        if (this.showdate) {
            let date = new Date();

            let pagedate = document.createElement("div");
            pagedate.classList.add("page-date");
            pagedate.innerHTML = Xplore.FormatDate(date);
            this.page.appendChild(pagedate);
        }

        //Footer
        if (this.footer) {
            let pagefooter = document.createElement("div");
            pagefooter.classList.add("page-footer");
            pagefooter.innerHTML = this.footer;
            this.page.appendChild(pagefooter);
        }

        //Page Number
        if (this.showpagenumber) {
            let pageno = document.createElement("div");
            pageno.classList.add("page-number");
            pageno.innerHTML = this.pagenumber.toString();
            this.page.appendChild(pageno);
        }
    }

    AddText(text: string): void {
        let element = document.createElement("p");
        element.innerText = text;
        this.AddString(element);
    }

    AddSpace(): void {
        let element = document.createElement("div");
        element.innerHTML = "&nbsp;";
        this.AddString(element);
    }

    AddTable(header: string[], data: string[][], classname?: string): void {
        let y: number = 0;
        let index: number = 0;
        let td: HTMLElement;
        let tbl: HTMLElement;

        let table = document.createElement("table");

        if (classname)
            table.classList.add(classname);

        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let th: HTMLElement;

        //Add header
        for (let column of header) {
            th = document.createElement("th");
            th.innerHTML = column;
            tr.appendChild(th);
        }

        //Measure header
        tbl = document.createElement("table");
        tbl.classList.add(classname);
        tbl.appendChild(tr);
        this.measure.innerHTML = tbl.innerHTML;
        y = this.measure.scrollHeight + 2.33;
        this.currenty += y;

        thead.appendChild(tr);
        table.appendChild(thead);

        let tbody = document.createElement("tbody");

        for (let row of data) {
            tr = document.createElement("tr");

            //Add row
            for (let column of row) {
                td = document.createElement("td");
                td.innerHTML = column;
                tr.appendChild(td);
            }

            //Measure row
            this.measure.innerHTML = "";
            this.measure.appendChild(tr);

            y = this.measure.scrollHeight - 1;

            if (this.currenty + y >= this.height) {
                //Won't fit. Create new page and continue add table.
                table.appendChild(tbody);
                this.page.appendChild(table);

                this.NewPage();
                this.AddTable(header, data.slice(index, data.length - 1), classname);

                return;
            } else {
                //Row fits the page.
                this.currenty += y;
                tbody.appendChild(tr);
            }

            index++;
        }

        table.appendChild(tbody);

        this.page.appendChild(table);
        this.currenty += y;
    }

    private AddString(text: HTMLElement): void {
        let y = 0;

        this.measure.innerHTML = "";
        this.measure.appendChild(text);

        y = this.measure.scrollHeight;

        if (this.currenty !== 0 && this.currenty + y >= this.height) {
            this.NewPage();
        }

        //Fits the page
        this.page.appendChild(text);
        this.currenty += y;
    }
}