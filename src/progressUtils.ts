import useSWR from 'swr';

export type Counts = {
  /// Number of functions.
  count: number,
  /// Number of bytes.
  size: number,
};

export type Entry = {
  version: string,
  time: Date,
  rev: string,
  total: Counts,
  decompiled: Counts,
  matching: Counts,
  nmMajor: Counts,
  nmMinor: Counts,
};

const PROGRESS_CSV_PATH = "https://botw.link/progress.csv";
const CURRENT_PROGRESS_JSON_PATH = "https://botw.link/badges/progress.json";

export async function loadEntries(): Promise<Entry[]> {
  const entries: Entry[] = [];
  const csv = await fetch(PROGRESS_CSV_PATH).then(response => response.text());

  for (const line of csv.split("\n")) {
    if (!line)
      continue;

    const row = line.split(",");
    if (row.length != 11)
      throw new Error("Invalid row: " + row);

    const version = row[0];
    if (version != "1")
      throw new Error("Unexpected version: " + version);

    const time = new Date(parseInt(row[1], 10) * 1000);
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
      total: { count: totalCount, size: totalSize },
      decompiled: {
        count: matchingCount + nmMinorCount + nmMajorCount,
        size: matchingSize + nmMinorSize + nmMajorSize,
      },
      matching: { count: matchingCount, size: matchingSize },
      nmMinor: { count: nmMinorCount, size: nmMinorSize },
      nmMajor: { count: nmMajorCount, size: nmMajorSize },
    });
  }

  for (const entry of entries) {
    // use the last entry to find out the total number of functions / bytes to decompile
    entry.total = entries[entries.length - 1].total;
  }

  return entries;
}

export async function getCurrentProgressText(): Promise<string> {
  const res = await fetch(CURRENT_PROGRESS_JSON_PATH).then(res => res.json());
  return res.message;
}

export function useCurrentProgressText() {
  return useSWR("*progressText", getCurrentProgressText);
}
