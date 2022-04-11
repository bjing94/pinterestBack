import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface FileModel extends Base {}
export class FileModel {
  @prop()
  fileName: string;

  @prop()
  url: string;
}
