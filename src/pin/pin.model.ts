import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface PinModel extends Base {}
export class PinModel extends TimeStamps {
  @prop()
  title: string;

  // image id in our folder
  @prop()
  imgId: string;

  @prop()
  username: string;

  @prop()
  userId: string; // mongodb id

  @prop()
  content: string;

  @prop()
  comments?: string[];
}
