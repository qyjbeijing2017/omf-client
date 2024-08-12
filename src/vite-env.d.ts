/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_OMF_HOST: string
    readonly VITE_OMF_SSL: string
    readonly VITE_OMF_PORT: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}