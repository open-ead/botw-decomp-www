"use strict";

async function loadEntries() {
    const entries = [];
    const csv = await fetch("https://botw.link/progress.csv?v=" + new Date().getTime()).then(response => response.text());

    for (const line of csv.split("\n")) {
        if (!line)
            continue;

        const row = line.split(",");
        if (row.length != 11)
            throw new Error("Invalid row: " + row);

        const version = row[0];
        if (version != "1")
            throw new Error("Unexpected version: " + version);

        const time = moment.unix(row[1]);
        const rev = row[2];
        const totalCount = parseInt(row[3], 10);
        const totalSize = parseInt(row[4], 10);
        const matchingCount = parseInt(row[5], 10);
        const matchingSize = parseInt(row[6], 10);
        const nmMinorCount = parseInt(row[7], 10);
        const nmMinorSize = parseInt(row[8], 10);
        const nmMajorCount = parseInt(row[9], 10);
        const nmMajorSize = parseInt(row[10], 10);

        entries.push({
            version,
            time,
            rev,
            total: {count: totalCount, size: totalSize},
            decompiled: {
                count: matchingCount + nmMinorCount + nmMajorCount,
                size: matchingSize + nmMinorSize + nmMajorSize,
            },
            matching: {count: matchingCount, size: matchingSize},
            nmMinor: {count: nmMinorCount, size: nmMinorSize},
            nmMajor: {count: nmMajorCount, size: nmMajorSize},
        });
    }

    return entries;
}

function findField(key) {
    return document.querySelector(".z-info-row[data-key='" + key + "']");
}

function setValue(el, value) {
    el.querySelector(".value").innerText = value;
}

function formatPercent(x, digits=3) {
    return (100 * x).toFixed(digits) + "%";
}

function formatProgress(category, total) {
    return `${formatPercent(category.size / total.size)}`;
}

async function main() {
    const entries = await loadEntries();
    const last = entries[entries.length - 1];

    setValue(findField("decompiled"), `${last.decompiled.size}/${last.total.size} bytes - ${formatProgress(last.decompiled, last.total)}`);
    setValue(findField("matching"), `${formatProgress(last.matching, last.total)}`);
    setValue(findField("nonmatching-minor"), `${formatProgress(last.nmMinor, last.total)}`);
    setValue(findField("nonmatching-major"), `${formatProgress(last.nmMajor, last.total)}`);
    setValue(findField("functions"), `${last.decompiled.count}/${last.total.count} - ${formatPercent(last.decompiled.count / last.total.count)}`);

    const ctx = document.getElementById("botw-chart").getContext("2d");
    Chart.defaults.global.defaultFontColor = "#999";
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Decompiled size%",
                    data: entries.map(entry => {
                        return {
                            x: entry.time,
                            y: entry.decompiled.size / entry.total.size,
                        };
                    }),
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointBackgroundColor: "#20adff",
                    borderColor: "#20adff",
                    cubicInterpolationMode: "monotone",
                },
                // {
                //     label: "Decompiled function count%",
                //     data: entries.map(entry => {
                //         return {
                //             x: entry.time,
                //             y: entry.decompiled.count / entry.total.count,
                //         };
                //     }),
                //     pointRadius: 0,
                //     pointHoverRadius: 0,
                //     pointBackgroundColor: "#ffaa00",
                //     borderColor: "#ffaa00",
                //     cubicInterpolationMode: "monotone",
                // },
            ],
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    type: "time",
                    labelString: "Date",
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Decompiled %",
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: (value, index, values) => formatPercent(value, 2),
                    },
                }],
            },
            hover: {
                intersect: false,
            },
            tooltips: {
                mode: "index",
                intersect: false,
                position: "nearest",
                callbacks: {
                    label: (item, data) => {
                        const entry_i = entries[item.index];
                        const lines = [];
                        lines.push(data.datasets[item.datasetIndex].label + ": " + formatPercent(item.value));
                        if (item.datasetIndex == 1)
                            return lines;
                        lines.push(`Decompiled size: ${entry_i.decompiled.size} bytes`);
                        lines.push("Matching: " + formatProgress(entry_i.matching, entry_i.total));
                        lines.push("Commit: " + entry_i.rev);
                        return lines;
                    },
                },
                displayColors: false,
                borderColor: "#fff",
                borderWidth: 1,
            }
        }
    });
}

main();
