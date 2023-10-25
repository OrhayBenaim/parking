/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    email: string;
  }
}
interface ImportMetaEnv {
  readonly DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
