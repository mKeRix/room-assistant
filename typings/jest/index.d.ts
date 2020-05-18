declare namespace jest {
  // override until DefinitelyTyped is updated
  export function useFakeTimers(implementation?: 'modern' | 'legacy'): typeof jest;
}
