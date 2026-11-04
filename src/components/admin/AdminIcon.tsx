import type { SVGProps } from "react";

const paths = {
  overview: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  orders: "M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6",
  products: "m12 3 9 5-9 5-9-5 9-5Zm9 5v9l-9 5-9-5V8m9 5v9M7.5 5.5l9 5",
  inventory: "M3 9h18v12H3V9Zm-1-5h20v5H2V4Zm7 9h6",
  discount: "m3 3 9 0 9 9-9 9-9-9V3Zm4 4h.01m2 9 7-7",
  categories: "M3 4h7l2 3h9v13H3V4Z",
  brands: "m12 3 2.8 5.7L21 10l-4.5 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 10l6.2-1.3L12 3Z",
  homepage: "M3 4h18v16H3V4Zm0 5h18M8 9v11",
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3.9a4 4 0 0 1 0 7.8",
  delivery: "M14 17H9m-4 0H3V5h11v12Zm0-9h4l3 4v5h-3m-4-5h7M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  analytics: "M3 3v18h18M7 14l4-4 4 3 6-8",
  account: "M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2m12-15a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  logout: "M9 4H4v16h5m5-13 5 5-5 5m-6-5h13",
  external: "M14 3h7v7m0-7L10 14m0-10H3v17h17v-7",
  search: "m21 21-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  plus: "M12 5v14M5 12h14",
  menu: "M4 6h16M4 12h16M4 18h16",
  chevron: "m9 5 7 7-7 7",
  calendar: "M4 5h16v16H4V5Zm0 5h16M8 3v4m8-4v4",
  money: "M3 5h18v14H3V5Zm3 0a3 3 0 0 1-3 3m18 0a3 3 0 0 1-3-3M6 19a3 3 0 0 0-3-3m18 0a3 3 0 0 0-3 3m-3-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2",
  check: "m5 12 4 4L19 6",
  alert: "m12 3 10 18H2L12 3Zm0 6v4m0 4h.01",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  lock: "M5 10h14v11H5V10Zm3 0V7a4 4 0 0 1 8 0v3m-4 5v2",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
} as const;

export type AdminIconName = keyof typeof paths;

export function AdminIcon({ name, className = "h-5 w-5", ...props }: SVGProps<SVGSVGElement> & { name: AdminIconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...props}><path d={paths[name]} /></svg>;
}
