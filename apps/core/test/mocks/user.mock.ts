import { Types } from "mongoose";
import { modeOfClassType, IUser } from "@repo/models";
import { faker } from "@faker-js/faker";

type UserFactoryProps = {
  role?: "SUDO" | "ADMIN" | "STUDENT",
  gender?: "Male" | "Female",
  classes?: Types.ObjectId[],
  modeOfClass?: modeOfClassType,
  completedLessons?: Types.ObjectId,
  isDeleted?: boolean,
  isSuspended?: boolean,
  creator?: Types.ObjectId,
  password?: string,
  email?: string,
  phone?: string,
}

export function UserFactory(length: number, {
  role,
  email,
  phone,
  gender,
  classes,
  modeOfClass,
  completedLessons,
  isDeleted,
  isSuspended,
  password,
  creator,
  }: UserFactoryProps
): (IUser & { _id: Types.ObjectId })[] {

  const users: (IUser & { _id: Types.ObjectId })[] = []

  for(let i = 0; i < length; i++){
    users.push({
      _id: new Types.ObjectId(),
      code: faker.number.int().toString(),
      role: role ?? "SUDO",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      otherNames: "",
      gender: gender ?? "Male",
  
      email: email ?? faker.internet.email(),
      phone: phone ?? faker.phone.number(),
  
      classes: classes ?? [],
      modeOfClass: modeOfClass ?? "In-Person",
      
      completedLessons: completedLessons ?? new Types.ObjectId(),
      meta: {
        isDeleted: isDeleted ?? false,
        isSuspended: isSuspended ?? false,
        isPasswordSet: false,
        lastLoggedIn: new Date(),
      },
  
      auth: {
        password:  password ?? faker.internet.password(),
      },
      locker: {},
      createdBy: creator ?? new Types.ObjectId(),
  
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    })
  }

  return users;

}