import type { SVGProps } from "react";

const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  search: "m20 20-4.5-4.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  shield: "m12 3 8 3v5c0 5-8 10-8 10S4 16 4 11V6l8-3Zm-4 9 3 3 5-6",
  truck: "M14 17H9m-4 0H3V5h11v12Zm0-9h4l3 4v5h-3m-4-5h7M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  box: "m12 3 9 5-9 5-9-5 9-5Zm9 5v9l-9 5-9-5V8m9 5v9M7.5 5.5l9 5",
  check: "m5 12 4 4L19 6",
  pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  chat: "M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.4-4.5A9 9 0 1 1 21 11.5ZM8 10h8m-8 4h5",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  bag: "M5 7h14l1 14H4L5 7Zm3 0V6a4 4 0 0 1 8 0v1",
} as const;

export function Icon({ name, className = "h-5 w-5", ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
