import { IUserDoc } from '@repo/models'


type MinifiedUser = {
    _id: string,
    id: string,
    classes: string[],
    gender: string,
    email: string,
    firstName: string,
    lastName: string,
    otherNames: string,
    role: string,
    modeOfClass: string,
    completedLessons: string[],
}

export type ILMSContextState = {
  user: MinifiedUser | null,
  token: string | null,
}

export type ILMSContextAction = {
    setUser: (user: MinifiedUser) => void,
    setToken: (token: string) => void,
}
