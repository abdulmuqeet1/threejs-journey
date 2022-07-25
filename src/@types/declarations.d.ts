declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.less" {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.json' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare const IS_PROD: boolean;
declare const IS_DEV: boolean;
declare const IS_DEV_SERVER: boolean;
