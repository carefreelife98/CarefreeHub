// packages/shared/src/types/api.ts

import type { ErrorCode } from "./events.js"

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: ErrorCode
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.success === true
}
