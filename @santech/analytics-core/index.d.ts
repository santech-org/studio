// tslint:disable:max-line-length

/// <reference types="segment-analytics" />

export interface ISegmentIntegrationStatic {
  new(options: any): ISegmentIntegration;
  option(key: string, value: any): ISegmentIntegrationStatic;
  mapping(name: string): ISegmentIntegrationStatic;
  global(key: string): ISegmentIntegrationStatic;
  assumesPageview(): ISegmentIntegrationStatic;
  readyOnLoad(): ISegmentIntegrationStatic;
  readyOnInitialize(): ISegmentIntegrationStatic;
  tag(name: string, tag: string | null): ISegmentIntegrationStatic;
  on(event: string, listener: () => void): ISegmentIntegrationStatic;
  once(event: string, listener: () => void): ISegmentIntegrationStatic;
  off(event?: string, listener?: () => void): ISegmentIntegrationStatic;
  emit(event: string, ...args: any[]): boolean;
  listeners(event: string): Array<() => void>;
  hasListeners(event: string): boolean;
}

export interface ISegmentIntegration {
  // public
  defaults: any;
  globals: string[];
  templates: any;
  options: any;
  name: string;
  analytics: IAnalyticsJS;
  initialize(): void;
  page(pageDto: any): void;
  track(pageDto: any): void;
  map(options: any | any[], key: string): any[];
  load(name: string, locals?: any, callback?: () => void): HTMLElement;
  locals(locals?: any): any;
  ready(): void;

  // protected
  loaded(): boolean;
  invoke(method: string): any;
  queue(method: string, ...args: any[]): void;
  flush(): void;
  reset(): void;
  on(event: string, listener: () => void): ISegmentIntegration;
  once(event: string, listener: () => void): ISegmentIntegration;
  off(event?: string, listener?: () => void): ISegmentIntegration;
  emit(event: string, ...args: any[]): boolean;
  listeners(event: string): Array<() => void>;
  hasListeners(event: string): boolean;
  debug(...args: any[]): void;

  // private
  _wrapInitialize(): void;
  _wrapPage(): void;
  _wrapTrack(): void;
}

export interface ISegmentUser {
  initialize(): void;
  storage(): any;
  id(): string;
  logout(): void;
  reset(): void;
  anonymousId(newId?: string): string;
  traits(newTraits?: any): void;
}

export interface ISegmentGroup {
  id(): string;
  traits(newTraits?: any): void;
}

export interface IAnalyticsJS {
  on(event: string, listener: (event: string, properties: any, options: SegmentAnalytics.SegmentOpts) => void): IAnalyticsJS;
  once(event: string, listener: (event: string, properties: any, options: SegmentAnalytics.SegmentOpts) => void): IAnalyticsJS;
  off(event?: string, listener?: (event: string, properties: any, options: SegmentAnalytics.SegmentOpts) => void): IAnalyticsJS;
  emit(event: string, ...args: any[]): boolean;
  listeners(event: string): Array<() => void>;
  hasListeners(event: string): boolean;

  use(plugin: ISegmentIntegration): IAnalyticsJS;
  add(integration: ISegmentIntegration): IAnalyticsJS;
  addIntegration(integration: ISegmentIntegrationStatic): IAnalyticsJS;
  init(setting?: any, options?: any): IAnalyticsJS;
  initialize(setting: any, options: any): IAnalyticsJS;
  setAnonymousId(id: string): IAnalyticsJS;
  identify(userId: string, traits?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  identify(userId: string, traits: any, callback?: () => void): IAnalyticsJS;
  identify(userId: string, callback?: () => void): IAnalyticsJS;
  identify(traits?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  identify(traits?: any, callback?: () => void): IAnalyticsJS;
  identify(callback: () => void): IAnalyticsJS;
  user(): ISegmentUser;
  group(groupId?: string, traits?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  group(groupId?: string, traits?: any, callback?: () => void): IAnalyticsJS;
  group(groupId?: string, callback?: () => void): IAnalyticsJS;
  track(event: string, properties?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  track(event: string, properties?: any, callback?: () => void): IAnalyticsJS;
  track(event: string, callback?: () => void): IAnalyticsJS;
  trackClick(elements: JQuery | Element[] | Element, event: string | ((elm: Element) => string), properties?: any | ((elm: Element) => any)): IAnalyticsJS;
  trackForm(elements: JQuery | Element[] | Element, event: string | ((elm: Element) => string), properties?: any | ((elm: Element) => any)): IAnalyticsJS;
  trackLink(elements: JQuery | Element[] | Element, event: string | ((elm: Element) => string), properties?: any | ((elm: Element) => any)): IAnalyticsJS;
  trackSubmit(elements: JQuery | Element[] | Element, event: string | ((elm: Element) => string), properties?: any | ((elm: Element) => any)): IAnalyticsJS;
  page(category: string, name: string, properties?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  page(name?: string, properties?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  page(name?: string, properties?: any, callback?: () => void): IAnalyticsJS;
  page(name?: string, callback?: () => void): IAnalyticsJS;
  page(properties?: any, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  page(callback?: () => void): IAnalyticsJS;
  alias(userId: string, previousId?: string, options?: SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  alias(userId: string, previousIdOrOptions?: string | SegmentAnalytics.SegmentOpts, callback?: () => void): IAnalyticsJS;
  alias(userId: string, callback?: () => void): IAnalyticsJS;
  timeout(milliseconds: number): void;
  ready(callback: () => void): void;
  debug(state?: boolean): void;
  reset(): void;
}

export const analytics: IAnalyticsJS;

export const integration: (name: string) => ISegmentIntegrationStatic;
