export const getKeyDownValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
  e.preventDefault();

  // Check for macOS-specific modifier keys
  if (e.metaKey) return "cmd";
  if (e.altKey) return "option";
  if (e.shiftKey) return "shift";
  if (e.ctrlKey) return "ctrl";

  // check for space and enter keys
  if (e.key.toLowerCase() === " ") {
    return "space";
  }

  return e.key;
};
