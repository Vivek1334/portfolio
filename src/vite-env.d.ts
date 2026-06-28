/// <reference types="vite/client" />

declare module "*.css";

declare module "react" {
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((current: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), dependencies?: unknown[]): void;
}

declare module "react-dom/client" {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: unknown): void;
  };
}

declare module "lucide-react" {
  const Icon: (props: { size?: number; color?: string; className?: string }) => JSX.Element;
  export const Github: typeof Icon;
  export const Linkedin: typeof Icon;
  export const Twitter: typeof Icon;
  export const ArrowUpRight: typeof Icon;
  export const Send: typeof Icon;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
