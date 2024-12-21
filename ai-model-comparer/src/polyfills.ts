// Polyfill for process
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = {
    env: import.meta.env,
    platform: '',
    version: '',
  };
}

// Polyfill for global
if (typeof window !== 'undefined' && !window.global) {
  (window as any).global = window;
}

// Polyfill for Buffer
import { Buffer } from 'buffer'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

export {}
