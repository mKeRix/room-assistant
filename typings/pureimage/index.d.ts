declare module 'pureimage' {
  export function make(height: number, width: number): HTMLCanvasElement;
  export function registerFont(path: string, name: string, weight: number, type: string)
  export function encodeJPEGToStream(canvas: HTMLCanvasElement, buffer: Buffer, quality: number)
}
