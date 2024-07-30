import { ClassModel, UserModel } from "@repo/models";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class AssignedService {

  async isAdminOrSudo(userId: string, classCode: string): Promise<boolean> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    //if user be SUDO then we return true.
    if (user.role === "SUDO") {
      return true; 
    }

    const classDoc = await ClassModel.findOne({ code: classCode });

    if (!classDoc) {
      throw new NotFoundException("Specified class not found");
    }

    // then we go ahead to check to see if he be admin
    const isAssigned = classDoc.administrators.some((admin) =>
      admin.equals(new Types.ObjectId(userId))
    );

    return isAssigned;
  }
}
