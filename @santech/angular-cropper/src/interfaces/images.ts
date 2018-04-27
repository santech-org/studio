export interface IFileProcess {
  reader: FileReader;
  promise: Promise<string>;
}
