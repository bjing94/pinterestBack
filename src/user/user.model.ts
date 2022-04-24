import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  username: string;

  @prop()
  description: string;

  @prop({ unique: true })
  displayId: string;

  @prop({ unique: true })
  email: string;

  @prop()
  avatarSrc: string;

  @prop()
  passwordHash: string;

  @prop()
  createdPins: string[];

  @prop({ type: () => [String] })
  savedPins: string[];

  @prop({ type: () => [String] })
  boards: string[];

  @prop({ type: () => [String] })
  subscribers: string[];

  @prop({ type: () => [String] })
  subscriptions: string[];
}
