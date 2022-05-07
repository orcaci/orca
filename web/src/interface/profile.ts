export interface IProfile {
  id: String;
  key: String;
  name: String;
  value: String;
  description?: String;
  is_default?: Boolean;
}

export interface IProfileItems extends Array<IProfile> {}
