export interface IProfile {
  id: string;
  key: string;
  name: string;
  value: string;
  description?: string;
  is_default?: boolean;
}

export interface IProfileItems extends Array<IProfile> {}
