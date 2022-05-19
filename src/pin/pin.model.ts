import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface PinModel extends Base {}
export class PinModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  imgId: string;

  @prop()
  userId: string; // mongodb id

  @prop()
  content: string;

  @prop()
  comments?: string[];
}
