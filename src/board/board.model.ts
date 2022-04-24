import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface BoardModel extends Base {} // to implement ids
export class BoardModel extends TimeStamps {
  @prop()
  pins: string[];

  @prop()
  title: string;

  @prop()
  userId: string; // user mongo id like really big one dsgfdg323dfdsfda254gf
}
