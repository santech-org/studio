export interface ICacheConfig {
  directory: string;
  maxAge: number;
  maxSize: number;
}

export interface IIndexItem {
  name: string;
  modificationTime: Date;
  size: number;
}
