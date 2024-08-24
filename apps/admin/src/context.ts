import { IClassDoc } from "@repo/models"

export type MinifiedUser = {
    _id: string,
    id: string,
    classes: Pick<IClassDoc, "code" | "name" >[],
    meta: {
      isPasswordSet: boolean,
      tokenGeneratedAt: Date,
    }
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
