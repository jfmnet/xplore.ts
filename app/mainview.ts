interface SOSItem {
    icon: string;
    text: string;
    address: string;
    map: string;
    info: string;
    telno: string;
}

class MainView {
    Show(): void {
        this.ShowGreetings();
    }

    ShowGreetings(): void {
        let self = this;

        let container = new Xplore.Tab();
        container.position = XPOSITION.BOTTOM;

        container.tabs = [
            {
                button: new Xplore.Button({ icon: "home", text: "Home" }),
                container: new Xplore.ScrollContainer()
            },
            {
                button: new Xplore.Button({ icon: "virus", text: "COVID-19" }),
                container: new Xplore.ScrollContainer()
            },
            {
                button: new Xplore.Button({ icon: "bell-alert", text: "Alerts" }),
                container: new Xplore.ScrollContainer()
            },
            {
                button: new Xplore.Button({ icon: "calendar", text: "Calendar" }),
                container: new Xplore.ScrollContainer(),
                onclick: function () {
                    self.ShowCalendar(container.tabs[3].container);
                }
            },
            {
                button: new Xplore.Button({ icon: "alert-decagram", text: "SOS" }),
                container: new Xplore.ScrollContainer(),
                onclick: function () {
                    self.ShowSOS(container.tabs[4].container);
                }
            },
        ];

        container.Show();

        this.ShowToday(container.tabs[0].container);
        container.RefreshTab();
    }

    ShowToday(container: Xplore): void {
        container.Clear();
        container.Add(new Xplore.TextBlock({ text: Xplore.FormatDate(new Date()), classes: ["date"] }));
        container.Add(new Xplore.TextBlock({ text: '"Behind every beautiful thing, there\'s some kind of pain."<br/>Bob Dylan', classes: ["quote"] }));
        container.Add(new Xplore.TextBlock({ text: "Today's Activity", classes: ["header"] }));

        let today = container.Add(new Xplore.HorizontalContainer());
        today.Add(new Xplore.Card({ text: "Webinar", icon: "resources/images/image1.jpg" }));
        today.Add(new Xplore.Card({ text: "Meeting", icon: "resources/images/image1.jpg" }));
        today.Add(new Xplore.Card({ text: "Conversation", icon: "resources/images/image1.jpg" }));
        today.Add(new Xplore.Card({ text: "Meeting", icon: "resources/images/image1.jpg" }));
        today.Add(new Xplore.Card({ text: "Webinar", icon: "resources/images/image1.jpg" }));

        container.Add(new Xplore.TextBlock({ text: "Menu", classes: ["header"] }));

        container.Add(new Xplore.Button({ text: "Phonebook", icon: "phone", classes: ["app-menu"] }));
        container.Add(new Xplore.Button({ text: "Dine", icon: "food", classes: ["app-menu"] }));
        container.Add(new Xplore.Button({ text: "Map", icon: "map", classes: ["app-menu"] }));
        container.Add(new Xplore.Button({ text: "SIS", icon: "account-multiple", classes: ["app-menu"] }));
        container.Add(new Xplore.Button({ text: "HRIS", icon: "account-multiple", classes: ["app-menu"] }));
        container.Add(new Xplore.Button({ text: "FIMS", icon: "home", classes: ["app-menu"] }));
    }

    ShowSOS(container: Xplore): void {
        let self = this;

        Xplore.GetJSON("resources/sos.json", function (data: SOSItem[]) {
            container.Clear();
            container.Add(new Xplore.Button({ text: "Call Security", icon: "shield-account", classes: ["app-icon"] }));

            container.Add(new Xplore.Button({ text: "Police", icon: "police-badge-outline", classes: ["app-menu"] }));
            container.Add(new Xplore.Button({ text: "Hospital", icon: "hospital-box-outline", classes: ["app-menu"] }));
            container.Add(new Xplore.Button({ text: "Security", icon: "shield-account", classes: ["app-menu"] }));

            for (let item of data) {
                container.Add(new Xplore.List({
                    text: item.text,
                    icon: item.icon,
                    buttons: [
                        new Xplore.Button({ icon: "map-marker-outline", tag: item, onclick: self.SOSMap }),
                        new Xplore.Button({ icon: "information-outline", tag: item, onclick: self.SOSInfo }),
                        new Xplore.Button({ icon: "phone", tag: item, onclick: self.SOSCall })]
                }));
            }

            container.Refresh();
        });

        Xplore.GetJSON("resources/hospital.json", function (data: SOSItem[]) {
            container.Add(new Xplore.TextBlock({ text: "List of Hospitals", classes: ["header", "separator"] }));

            for (let item of data) {
                container.Add(new Xplore.List({
                    text: item.text + "<div>" + item.address + "</div>",
                    icon: "hospital",
                    classes: ["list-hospital"],
                    buttons: [
                        new Xplore.Button({ icon: "map-marker-outline", tag: item, onclick: self.SOSMap }),
                        new Xplore.Button({ icon: "information-outline", tag: item, onclick: self.SOSInfo }),
                        new Xplore.Button({ icon: "phone", tag: item, onclick: self.SOSCall })]
                }));
            }

            container.Refresh();
        });
    }

    ShowCalendar(container: Xplore): void {
        let self = this;

        Xplore.GetJSON("resources/events.json", function (data: XCalendarItem[]) {
            let calendar = new Xplore.Calendar();
            calendar.events = data;

            container.Clear();
            container.Add(calendar);
            container.Refresh();
        });
    }

    SOSMap(object: Xplore.List): void {
        let data = object.tag as SOSItem;

        let view = new Xplore.AppView({ text: data.text, icon: "chevron-left" });
        view.onmenu = function () {
            view.Dispose();
        };
        view.Show();
    }

    SOSInfo(object: Xplore.List): void {
        let data = object.tag as SOSItem;

        let view = new Xplore.AppView({ text: data.text, icon: "chevron-left" });
        view.onmenu = function () {
            view.Dispose();
        };
        view.Show();
    }

    SOSCall(object: Xplore.List): void {
        let data = object.tag as SOSItem;
        alert(data.telno);
    }
}