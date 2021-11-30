class ChartView {
    Show(): void {
        let container = new Xplore.Container({ classes: ["chart"] });
        let data = new XChartData();

        let hover = new XDrawProperties();
        hover.fillcolor = "rgba(255, 255, 0, 0.5)";
        hover.linecolor = "rgba(255, 255, 255, 0.5)";

        data.options = { hover: hover };

        for (let i = 0; i < 100; i++)
            data.list.push({ name: "X", value: Math.random() * 10 });

        container.Add(new XChart.LineChart(data));
        container.Show();
    }
}