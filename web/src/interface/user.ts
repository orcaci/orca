export interface IUser {
  id?: String;
  key?: String;
  name: String;
  first_name: String;
  last_name: String;
  email: String;
  roles?: (String | undefined)[];
}

export interface IUserList extends Array<IUser> {}
