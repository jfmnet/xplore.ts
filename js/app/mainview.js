var MainView = /** @class */ (function () {
    function MainView() {
    }
    MainView.prototype.Show = function () {
        this.ShowGreetings();
    };
    MainView.prototype.ShowGreetings = function () {
        var self = this;
        var container = new Xplore.Tab();
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
    };
    MainView.prototype.ShowToday = function (container) {
        container.Clear();
        container.Add(new Xplore.TextBlock({ text: Xplore.FormatDate(new Date()), classes: ["date"] }));
        container.Add(new Xplore.TextBlock({ text: '"Behind every beautiful thing, there\'s some kind of pain."<br/>Bob Dylan', classes: ["quote"] }));
        container.Add(new Xplore.TextBlock({ text: "Today's Activity", classes: ["header"] }));
        var today = container.Add(new Xplore.HorizontalContainer());
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
    };
    MainView.prototype.ShowSOS = function (container) {
        var self = this;
        Xplore.GetJSON("resources/sos.json", function (data) {
            container.Clear();
            container.Add(new Xplore.Button({ text: "Call Security", icon: "shield-account", classes: ["app-icon"] }));
            container.Add(new Xplore.Button({ text: "Police", icon: "police-badge-outline", classes: ["app-menu"] }));
            container.Add(new Xplore.Button({ text: "Hospital", icon: "hospital-box-outline", classes: ["app-menu"] }));
            container.Add(new Xplore.Button({ text: "Security", icon: "shield-account", classes: ["app-menu"] }));
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                container.Add(new Xplore.List({
                    text: item.text,
                    icon: item.icon,
                    buttons: [
                        new Xplore.Button({ icon: "map-marker-outline", tag: item, onclick: self.SOSMap }),
                        new Xplore.Button({ icon: "information-outline", tag: item, onclick: self.SOSInfo }),
                        new Xplore.Button({ icon: "phone", tag: item, onclick: self.SOSCall })
                    ]
                }));
            }
            container.Refresh();
        });
        Xplore.GetJSON("resources/hospital.json", function (data) {
            container.Add(new Xplore.TextBlock({ text: "List of Hospitals", classes: ["header", "separator"] }));
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var item = data_2[_i];
                container.Add(new Xplore.List({
                    text: item.text + "<div>" + item.address + "</div>",
                    icon: "hospital",
                    classes: ["list-hospital"],
                    buttons: [
                        new Xplore.Button({ icon: "map-marker-outline", tag: item, onclick: self.SOSMap }),
                        new Xplore.Button({ icon: "information-outline", tag: item, onclick: self.SOSInfo }),
                        new Xplore.Button({ icon: "phone", tag: item, onclick: self.SOSCall })
                    ]
                }));
            }
            container.Refresh();
        });
    };
    MainView.prototype.ShowCalendar = function (container) {
        var self = this;
        Xplore.GetJSON("resources/events.json", function (data) {
            var calendar = new Xplore.Calendar();
            calendar.events = data;
            container.Clear();
            container.Add(calendar);
            container.Refresh();
        });
    };
    MainView.prototype.SOSMap = function (object) {
        var data = object.tag;
        var view = new Xplore.AppView({ text: data.text, icon: "chevron-left" });
        view.onmenu = function () {
            view.Dispose();
        };
        view.Show();
    };
    MainView.prototype.SOSInfo = function (object) {
        var data = object.tag;
        var view = new Xplore.AppView({ text: data.text, icon: "chevron-left" });
        view.onmenu = function () {
            view.Dispose();
        };
        view.Show();
    };
    MainView.prototype.SOSCall = function (object) {
        var data = object.tag;
        alert(data.telno);
    };
    return MainView;
}());
//# sourceMappingURL=mainview.js.map