export {}

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress
    /** MessageBox instance */
    $messageBox?: import('element-plus').IElMessageBox
    /** Message instance */
    $message?: import('element-plus').Message
    /** Notification instance */
    $notification?: import('element-plus').Notify
    config?: Record<Env.Runtime, unknown>
  }

  /** Build time of the project */
  export const BUILD_TIME: string

  /** Build desc of the project */
  export const BUILD_DESC: string
}
