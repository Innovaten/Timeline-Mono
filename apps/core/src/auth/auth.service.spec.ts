import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUser, UserModel } from '@repo/models';
import { Types } from 'mongoose';
import { UserFactory } from '../../test/mocks';
import { JwtService } from '../common/services/jwt.service';
import { UserService } from '../common/services/user.service';
import { KafkaService } from '../common/services/kafka.service';

describe('AuthService', () => {
  let service: AuthService;
  let validUser: IUser & { _id: Types.ObjectId } 

  beforeAll( async () => {
    validUser = UserFactory(1, { 
      email: "user1@example.com",
      password: "AVerySecurePassword" 
    })[0]
    await UserModel.insertMany(validUser);
  })
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UserService, KafkaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user data and an access token for a valid user', async () => {

      const result = await service.login(validUser.email, validUser.auth.password, "");

      expect(result).toBeDefined()
      expect(result.error).toBeNull()
      expect(result.success).toEqual(true)
      expect(result.data?.access_token).toBeDefined()
      expect(result.data?.user).toBeDefined()
      expect(result.data?.user.email).toEqual(validUser.email)
    })
  })

});
