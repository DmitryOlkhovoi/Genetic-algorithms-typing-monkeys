const blessed = require('blessed');
const contrib = require('blessed-contrib');

class Log {
    constructor(rows, cols) {
        this.lines = [];
        this.screen = blessed.screen();

        this.grid = new contrib.grid({
            rows,
            cols,
            screen: this.screen
        });

        this.screen.on('resize', () => {
            this.lines.forEach((line) => {
                line.emit('attach');
            })
        });

        this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
            return process.exit(0);
        });
    }

    addLine(x, label, row, col) {
        const line = this.grid.set(row, col, 1, 1, contrib.line, {
            label,
            style: {
                line: "yellow",
                text: "green",
                baseline: "black"
            },
            xLabelPadding: 3,
            xPadding: 5
        });

        this.screen.append(line);

        line.setData([{
            x: x,
            y: x.map(v => v * 100)
        }]);

        return this.lines.push(line) - 1;
    }

    updateLineData(index, x) {
        this.lines[index]
            .setData([{
                x,
                y: x
            }]
        );
    }

    render() {
        this.screen.render();
    }
}

module.exports = Log;