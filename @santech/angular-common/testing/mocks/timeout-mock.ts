export class MockTimeoutService {
  private _cb: (() => void) | null;

  public setTimeout(cb: () => void): () => void {
    this._cb = cb;
    return () => { this._cb = null; };
  }

  public tick() {
    // This throw if no timeout registered
    (this._cb as () => void)();
    this._cb = null;
  }
}
