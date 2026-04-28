import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TypeFichier } from 'app/entities/enumerations/type-fichier.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { UploadLogService } from '../service/upload-log.service';
import { IUploadLog } from '../upload-log.model';

import { UploadLogFormGroup, UploadLogFormService } from './upload-log-form.service';

@Component({
  selector: 'jhi-upload-log-update',
  templateUrl: './upload-log-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class UploadLogUpdate implements OnInit {
  readonly isSaving = signal(false);
  uploadLog: IUploadLog | null = null;
  typeFichierValues = Object.keys(TypeFichier);

  protected uploadLogService = inject(UploadLogService);
  protected uploadLogFormService = inject(UploadLogFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UploadLogFormGroup = this.uploadLogFormService.createUploadLogFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uploadLog }) => {
      this.uploadLog = uploadLog;
      if (uploadLog) {
        this.updateForm(uploadLog);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const uploadLog = this.uploadLogFormService.getUploadLog(this.editForm);
    if (uploadLog.id === null) {
      this.subscribeToSaveResponse(this.uploadLogService.create(uploadLog));
    } else {
      this.subscribeToSaveResponse(this.uploadLogService.update(uploadLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IUploadLog | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(uploadLog: IUploadLog): void {
    this.uploadLog = uploadLog;
    this.uploadLogFormService.resetForm(this.editForm, uploadLog);
  }
}
