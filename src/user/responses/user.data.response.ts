export class UserDataResponse {
  _id: string;
  username: string;
  displayId: string;
  avatarSrc: string;
  description: string;
  subscribers: string[];
  subscriptions: string[];
  boards: string[];
  createdPins: string[];
  savedPins: string[];
  createdAt: Date;
}
