import { model, property} from '@loopback/repository';
import { User } from '@loopback/authentication-jwt';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
  @property({
    type: 'string',
    required: true,
  })
  name: string;
  @property({
    type: 'string',
    required: true,
  })
  surnames: string;
  @property({
    type: 'string',
  })
  profilePhoto?: string;

  @property({
    type: 'string',
  })
  biography?: string;
}

// export interface UserRelations {
// }

// export type UserWithRelations = UserModel & UserRelations;
