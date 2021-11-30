var ChartView = /** @class */ (function () {
    function ChartView() {
    }
    ChartView.prototype.Show = function () {
        var container = new Xplore.Container({ classes: ["chart"] });
        var data = new XChartData();
        var hover = new XDrawProperties();
        hover.fillcolor = "rgba(255, 255, 0, 0.5)";
        hover.linecolor = "rgba(255, 255, 255, 0.5)";
        data.options = { hover: hover };
        for (var i = 0; i < 100; i++)
            data.list.push({ name: "X", value: Math.random() * 10 });
        container.Add(new XChart.LineChart(data));
        container.Show();
    };
    return ChartView;
}());
//# sourceMappingURL=chart.js.map