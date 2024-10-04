/// <reference types="vite-plugin-svgr/client" />

/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_PATH: string;
  // more env variables...
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
