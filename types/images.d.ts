declare module "*.png" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpg" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}
