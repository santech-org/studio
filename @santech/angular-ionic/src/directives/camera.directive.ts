import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ICameraOptions } from '../interfaces/camera';
import { CameraService } from '../services/camera.service';

@Directive({
  selector: '[camera]',
})
export class CameraDirective {
  @Output()
  public pictureSuccess = new EventEmitter<File>();

  @Output()
  public pictureError = new EventEmitter<Error>();

  @Input()
  public options: ICameraOptions = {};

  public input: HTMLInputElement;

  private _cameraService: CameraService;
  private _picturePromise: Promise<File> | undefined;

  constructor(cameraService: CameraService, el: ElementRef) {
    this._cameraService = cameraService;

    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.hidden = true;
    this.input = input;

    el.nativeElement.appendChild(this.input);
  }

  @HostListener('click')
  public async onClick() {
    let promise = this._picturePromise;
    if (promise) {
      return promise;
    }

    try {
      promise = this._picturePromise = this._cameraService.takePicture(this.options, this.input);
      this.pictureSuccess.emit(await promise);
    } catch (e) {
      this.pictureError.emit(new Error(e.message));
    } finally {
      delete this._picturePromise;
    }
  }
}
