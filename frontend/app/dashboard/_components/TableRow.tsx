import { TShortcut } from "@/app/_types/types";
import ShortcutKey from "./ShortcutKey";
import DeleteButton from "./DeleteButton";

export default function TableRow({ shortcut }: { shortcut: TShortcut }) {
  return (
    <tr>
      <td className="capitalize font-semibold">{shortcut.shortDescription}</td>
      <td>{shortcut.description}</td>
      <td>
        <div className="flex gap-4">
          {shortcut.keys.map((key) => (
            <ShortcutKey key={key} value={key} />
          ))}
        </div>
      </td>
      <td>
        <DeleteButton shortcutId={shortcut._id} />
      </td>
    </tr>
  );
}
