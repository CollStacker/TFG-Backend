import {Friend} from '../models'

export function parseFriendRequestBody(userIdParam: string): Omit<Friend, '_id'>  {
  return {
    userId: userIdParam,
    friendId: '',
    getId: () => {},
    getIdObject: Object,
    toJSON: Object,
    toObject: Object
  }
}
