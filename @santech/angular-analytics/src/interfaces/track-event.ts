export interface IAnalyticsService<T, U> {
  resolveAnalyticsKey: (model: U) => Promise<T>;
}

export interface IAnalyticsResolver<T, U> {
  key: string;
  service: IAnalyticsService<T, U>;
}
