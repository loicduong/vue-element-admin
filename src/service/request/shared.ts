import type { RequestInstanceState } from './type'
import { useAuthStore } from '@/store/modules/auth'
import { localStg } from '@/utils/storage'
import { fetchRefreshToken } from '../api'

export function getAuthorization() {
  const token = localStg.get('token')
  const Authorization = token ? `Bearer ${token}` : null

  return Authorization
}

/** refresh token */
export async function handleRefreshToken() {
  const { resetStore } = useAuthStore()

  const rToken = localStg.get('refreshToken') || ''
  const { error, data } = await fetchRefreshToken(rToken)
  if (!error) {
    localStg.set('token', data.token)
    localStg.set('refreshToken', data.refreshToken)
    return true
  }

  resetStore()

  return false
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken()
  }

  const success = await state.refreshTokenFn

  setTimeout(() => {
    state.refreshTokenFn = null
  }, 1000)

  return success
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = []
  }

  const isExist = state.errMsgStack.includes(message)

  if (!isExist) {
    state.errMsgStack.push(message)

    window.$message?.error({
      message,
      onClose: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message)

        setTimeout(() => {
          state.errMsgStack = []
        }, 5000)
      },
    })
  }
}