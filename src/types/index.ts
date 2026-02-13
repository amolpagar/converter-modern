declare module 'generate-schema' {
  const generateSchema: {
    json(title: string, obj: unknown): Record<string, unknown>;
  };
  export default generateSchema;
}
