import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class PinBoard {
  @prop()
  title: string;

  @prop({ type: () => [String] })
  pins: string[];
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop({ unique: true })
  userId: string;

  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  createdPins: string[];

  @prop({ type: () => [String] })
  savedPins: string[];

  @prop({ type: () => [PinBoard] })
  boards: PinBoard[];
}
