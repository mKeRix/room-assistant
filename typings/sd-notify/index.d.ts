declare module 'sd-notify' {
  export function ready(): void
  export function stopping(): void
  export function watchdogInterval(): number
  export function watchdog(): void
}
