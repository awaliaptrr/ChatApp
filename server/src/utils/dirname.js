import path from "path";

export const dirname = (url) => {
  return path.dirname(new URL(url).pathname).substring(1);
};
