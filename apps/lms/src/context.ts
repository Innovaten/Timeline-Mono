import { IUserDoc } from '@repo/models'

export type ILMSContextState = {
  user: IUserDoc | null,
}

export type ILMSContextAction = {
    setUser: (user: IUserDoc) => void,
}
