import { TShortcut } from "@/utils/types/types";
import ShortcutKey from "./ShortcutKey";
import DeleteButton from "./DeleteButton";

export default function TableRow({ shortcut }: { shortcut: TShortcut }) {
  return (
    <tr className="[&>*]:py-2 [&>*]:px-3 sm:[&>*]:py-3 sm:[&>*]:px-4">
      <td className="capitalize font-semibold bg-accent text-base-300 min-w-[150px]">
        {shortcut.shortDescription}
      </td>
      <td className="min-w-[300px] first-letter:uppercase">
        {shortcut.description}
      </td>
      <td className="bg-primary-content">
        <div className="flex gap-3 sm:gap-4">
          {shortcut.keys.map((key) => (
            <ShortcutKey key={key} value={key} />
          ))}
        </div>
      </td>
      <td className="w-6">
        <DeleteButton shortcutId={shortcut._id} />
      </td>
    </tr>
  );
}
