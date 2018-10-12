import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ICameraDirective, ICameraImage, ICameraOptions } from '../interfaces/camera';
import { CameraService } from '../services/camera.service';

@Directive({
  selector: '[camera]',
})
export class CameraDirective implements ICameraDirective {
  @Output()
  public pictureSuccess = new EventEmitter<ICameraImage>();

  @Output()
  public pictureError = new EventEmitter<Error>();

  @Output()
  public pictureStart = new EventEmitter<void>();

  @Output()
  public pictureCancel = new EventEmitter<void>();

  @Output()
  public pictureProcess = new EventEmitter<void>();

  @Input()
  public options: ICameraOptions = {};

  private _cameraService: CameraService;

  constructor(cameraService: CameraService) {
    this._cameraService = cameraService;
  }

  @HostListener('click')
  public async onClick() {
    try {
      this.pictureStart.emit();
      this.pictureSuccess.emit(await this._cameraService.takePicture(this));
    } catch (e) {
      e
        ? this.pictureError.emit(e)
        : this.pictureCancel.emit();
    }
  }
}
