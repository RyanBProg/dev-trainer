export const getKeyDownValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  let key = "";

  // Check for macOS-specific modifier keys
  if (e.metaKey) key = "cmd";
  if (e.altKey) key = "option";
  if (e.shiftKey) key = "shift";
  if (e.ctrlKey) key = "ctrl";

  // check for space and enter keys
  if (e.key.toLowerCase() === " ") {
    key = "space";
  }

  return key;
};
