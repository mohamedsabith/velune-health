/* eslint-disable @typescript-eslint/no-unused-vars -- interface merging must repeat the type parameter */
import 'react';

/** Declarative WebMCP attributes (https://developer.chrome.com/docs/ai/webmcp/declarative-api). */
declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
  }
  interface InputHTMLAttributes<T> {
    toolparamdescription?: string;
  }
  interface SelectHTMLAttributes<T> {
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
