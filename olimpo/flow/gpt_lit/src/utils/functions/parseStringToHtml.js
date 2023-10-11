export function parseStringToHtml(string) {
  return new DOMParser().parseFromString(string, "text/html").body.children;
}
