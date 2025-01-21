export default function ShortcutKey({ value }: { value: string }) {
  const isCaps = value.length === 1 ? true : false;

  return (
    <div
      className="w-fit min-w-7 h-7 bg-gray-200 border-2 border-gray-800 rounded-md 
              shadow-[4px_4px_0_#888,4px_4px_0_#ddd] flex items-center justify-center">
      <span
        className={`${
          isCaps ? "uppercase" : "lowercase"
        } text-gray-800 text-sm sm:text-lg font-semibold select-none px-1`}>
        {value}
      </span>
    </div>
  );
}
