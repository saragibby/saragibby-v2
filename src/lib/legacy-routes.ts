const retiredPaths = new Set([
  "/blog",
  "/eats",
  "/brooklynn-karate",
  "/recaps/7-03-20",
  "/recaps/7-10-20",
  "/recaps/7-17-20",
  "/recaps/7-24-20",
  "/recaps/7-31-20",
  "/recaps/8-7-20",
  "/recaps/8-14-20",
  "/recaps/8-21-20",
  "/recaps/8-28-20",
  "/recaps/9-4-20",
  "/recaps/9-11-20",
  "/recaps/9-18-20",
  "/recaps/9-25-20",
  "/recaps/10-2-20",
  "/recaps/10-9-20",
  "/recaps/10-16-20",
  "/recaps/10-23-20",
])

export function isRetiredPath(pathname: string): boolean {
  return retiredPaths.has(pathname.replace(/\/+$/, "") || "/")
}
