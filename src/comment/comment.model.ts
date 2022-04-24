import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface CommentModel extends Base {}
export class CommentModel extends TimeStamps {
  @prop()
  userId: string;

  @prop()
  content: string;

  @prop()
  likedBy: string[];

  @prop()
  usefulBy: string[];
}
