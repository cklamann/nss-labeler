export const downloadCsv = <T extends Record<string, string | number>>(
  data: T[],
  filename?: string
) => {
  const filtered = data.map((d) =>
    Object.fromEntries(
      Object.entries(d).filter(([, v]) => v === null || typeof v !== "object")
    )
  );

  const headers = Object.keys(filtered[0]).join(",");

  const csv = `${headers}\n${filtered
    .map((row) =>
      Object.values(row)
        .map((item) => `"${item}"`)
        .join(",")
    )
    .join("\n")}`;

  const file = encodeURI(`data:application/csv,${csv}`);

  downloadFile(file, filename || "table-export.csv");
};

const downloadFile = (file: string, filename: string) => {
  const a = document.createElement("a");
  a.download = filename;
  a.target = "_blank";
  a.href = file;
  document.body.append(a);
  a.click();
  a.remove();
};
