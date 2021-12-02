class MainView {
    Show(): void {
        this.ShowTable();
    }

    ShowTable(): void {
        let data = [];

        for (let i = 0; i < 100; i++)
            data.push({ cell1: 1 + i, cell2: 2 + i, cell3: 3 + i, cell4: 4 + i, cell5: 5 + i });

        let table = new Xplore.Table({
            columns: [
                { name: "cell1", text: "Column 1" },
                { name: "cell2", text: "Column 2" },
                { name: "cell3", text: "Column 3" },
                { name: "cell4", text: "Column 4" },
                { name: "cell5", text: "Column 5" }
            ],
            data: data
        });

        table.Show();
    }
}