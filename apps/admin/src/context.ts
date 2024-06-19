import { IUserDoc } from '@repo/models'

export type ILMSContextState = {
  user: IUserDoc | null,
  token: string | null,
}

export type ILMSContextAction = {
    setUser: (user: IUserDoc) => void,
    setToken: (token: string) => void,
}
