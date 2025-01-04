import { TShortcut } from "@/app/_types/types";

type TTableCategory = {
  type: string;
  shortcuts: TShortcut[];
};

export function createShortcutTable(data: TShortcut[]) {
  const tableHeadings = new Set<string>();

  data.forEach((shortcut) => {
    tableHeadings.add(shortcut.type);
  });

  const table = [] as TTableCategory[];

  tableHeadings.forEach((heading) => {
    const typeTable = { type: heading, shortcuts: [] as TShortcut[] };
    data.forEach((shortcut) => {
      if (shortcut.type === heading) typeTable.shortcuts.push(shortcut);
    });
    table.push(typeTable);
  });

  return table;
}
