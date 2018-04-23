import { createJestSpyObj, SantechSpyObject } from '@santech/core/testing';

export const locationMethods = ['reload'];
export const localstorageMethods = ['getItem', 'setItem', 'removeItem'];

let spyLocation: SantechSpyObject<Location>;
let spyLocalstorage: SantechSpyObject<Storage>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyLocation = jasmine.createSpyObj('spyLocation', locationMethods);
  spyLocalstorage = jasmine.createSpyObj('spyLocalstorage', localstorageMethods);
} else if (typeof jest !== 'undefined') {
  spyLocation = createJestSpyObj(locationMethods);
  spyLocalstorage = createJestSpyObj(localstorageMethods);
}

export {
  spyLocalstorage,
  spyLocation,
};
