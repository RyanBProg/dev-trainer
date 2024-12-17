import { TShortcut } from "@/app/types/types";
import ShortcutKey from "./ShortcutKey";

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
        <div className="flex gap-3">
          <button className="btn btn-square btn-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button className="btn btn-square btn-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button className="btn btn-square btn-xs bg-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
