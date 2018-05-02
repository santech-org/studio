import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ICameraImage, ICameraOptions } from '../interfaces/camera';
import { CameraService } from '../services/camera.service';

@Directive({
  selector: '[camera]',
})
export class CameraDirective {
  @Output()
  public pictureSuccess = new EventEmitter<ICameraImage>();

  @Output()
  public pictureError = new EventEmitter<Error>();

  @Input()
  public options: ICameraOptions = {};

  public input: HTMLInputElement;

  private _cameraService: CameraService;
  private _picturePromise: Promise<void> | undefined;

  constructor(cameraService: CameraService, el: ElementRef) {
    this._cameraService = cameraService;

    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.hidden = true;
    this.input = input;

    el.nativeElement.appendChild(this.input);
  }

  @HostListener('click')
  public onClick() {
    return this._picturePromise
      ? this._picturePromise
      : this._picturePromise = this._cameraService.takePicture(this.options, this.input)
        .then((picture) => this.pictureSuccess.emit(picture))
        .catch((err) => this.pictureError.emit(new Error(err.message)))
        .then(() => this._picturePromise = undefined);
  }
}
