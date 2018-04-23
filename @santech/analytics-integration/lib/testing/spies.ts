// tslint:disable-next-line:no-implicit-dependencies
import { SantechIntegration } from '@santech/analytics-integration';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const santechIntegrationMethods = Object
  .getOwnPropertyNames(SantechIntegration.prototype).filter(filterPrivate);

let spySantechIntegration: SantechSpyObject<SantechIntegration>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spySantechIntegration = jasmine.createSpyObj('spySantechIntegration', santechIntegrationMethods);
} else if (typeof jest !== 'undefined') {
  spySantechIntegration = createJestSpyObj(santechIntegrationMethods);
}

export {
  spySantechIntegration,
};
