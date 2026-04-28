import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { TranslateDirective } from 'app/shared/language';
import { IResetPassword } from '../reset-password.model';
import { ResetPasswordService } from '../service/reset-password.service';

import { ResetPasswordFormGroup, ResetPasswordFormService } from './reset-password-form.service';

@Component({
  selector: 'jhi-reset-password-update',
  templateUrl: './reset-password-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ResetPasswordUpdate implements OnInit {
  readonly isSaving = signal(false);
  resetPassword: IResetPassword | null = null;

  effectifsSharedCollection = signal<IEffectif[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected resetPasswordService = inject(ResetPasswordService);
  protected resetPasswordFormService = inject(ResetPasswordFormService);
  protected effectifService = inject(EffectifService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ResetPasswordFormGroup = this.resetPasswordFormService.createResetPasswordFormGroup();

  compareEffectif = (o1: IEffectif | null, o2: IEffectif | null): boolean => this.effectifService.compareEffectif(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resetPassword }) => {
      this.resetPassword = resetPassword;
      if (resetPassword) {
        this.updateForm(resetPassword);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertErrorModel>('smoConnectFrontendApp.error', { ...err, key: `error.file.${err.key}` }),
        ),
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const resetPassword = this.resetPasswordFormService.getResetPassword(this.editForm);
    if (resetPassword.id === null) {
      this.subscribeToSaveResponse(this.resetPasswordService.create(resetPassword));
    } else {
      this.subscribeToSaveResponse(this.resetPasswordService.update(resetPassword));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IResetPassword | null>): void {
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

  protected updateForm(resetPassword: IResetPassword): void {
    this.resetPassword = resetPassword;
    this.resetPasswordFormService.resetForm(this.editForm, resetPassword);

    this.effectifsSharedCollection.update(effectifs =>
      this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, resetPassword.effectif),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.effectifService
      .query()
      .pipe(map((res: HttpResponse<IEffectif[]>) => res.body ?? []))
      .pipe(
        map((effectifs: IEffectif[]) =>
          this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, this.resetPassword?.effectif),
        ),
      )
      .subscribe((effectifs: IEffectif[]) => this.effectifsSharedCollection.set(effectifs));
  }
}
