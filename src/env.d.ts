/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    email: string;
  }
}
interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly JWT_SECRET_KEY: string;
  readonly ADMIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
