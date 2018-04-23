export function platformLocationFactory(window: Window) {
  const location = window.location;
  if (location) {
    return location;
  }
  throw new Error('platformLocationFactory: cannot find global location !');
}
