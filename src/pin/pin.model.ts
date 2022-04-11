import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Comment extends TimeStamps {
  @prop()
  username: string;

  @prop()
  content: string;

  @prop()
  likes: number;

  @prop()
  timeStamp: Date;
}
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
  userId: string;

  @prop()
  content: string;

  @prop({ type: () => [Comment] })
  comments?: Comment[];
}
