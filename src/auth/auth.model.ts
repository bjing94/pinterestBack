import { prop } from '@typegoose/typegoose';

export class AuthModel {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;
}
