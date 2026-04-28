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
import { IResetPassword } from 'app/entities/reset-password/reset-password.model';
import { ResetPasswordService } from 'app/entities/reset-password/service/reset-password.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { TranslateDirective } from 'app/shared/language';
import { IEmailTraite } from '../email-traite.model';
import { EmailTraiteService } from '../service/email-traite.service';

import { EmailTraiteFormGroup, EmailTraiteFormService } from './email-traite-form.service';

@Component({
  selector: 'jhi-email-traite-update',
  templateUrl: './email-traite-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class EmailTraiteUpdate implements OnInit {
  readonly isSaving = signal(false);
  emailTraite: IEmailTraite | null = null;

  effectifsSharedCollection = signal<IEffectif[]>([]);
  resetPasswordsSharedCollection = signal<IResetPassword[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected emailTraiteService = inject(EmailTraiteService);
  protected emailTraiteFormService = inject(EmailTraiteFormService);
  protected effectifService = inject(EffectifService);
  protected resetPasswordService = inject(ResetPasswordService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmailTraiteFormGroup = this.emailTraiteFormService.createEmailTraiteFormGroup();

  compareEffectif = (o1: IEffectif | null, o2: IEffectif | null): boolean => this.effectifService.compareEffectif(o1, o2);

  compareResetPassword = (o1: IResetPassword | null, o2: IResetPassword | null): boolean =>
    this.resetPasswordService.compareResetPassword(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emailTraite }) => {
      this.emailTraite = emailTraite;
      if (emailTraite) {
        this.updateForm(emailTraite);
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
    const emailTraite = this.emailTraiteFormService.getEmailTraite(this.editForm);
    if (emailTraite.id === null) {
      this.subscribeToSaveResponse(this.emailTraiteService.create(emailTraite));
    } else {
      this.subscribeToSaveResponse(this.emailTraiteService.update(emailTraite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IEmailTraite | null>): void {
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

  protected updateForm(emailTraite: IEmailTraite): void {
    this.emailTraite = emailTraite;
    this.emailTraiteFormService.resetForm(this.editForm, emailTraite);

    this.effectifsSharedCollection.update(effectifs =>
      this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, emailTraite.effectif),
    );
    this.resetPasswordsSharedCollection.update(resetPasswords =>
      this.resetPasswordService.addResetPasswordToCollectionIfMissing<IResetPassword>(resetPasswords, emailTraite.resetPassword),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.effectifService
      .query()
      .pipe(map((res: HttpResponse<IEffectif[]>) => res.body ?? []))
      .pipe(
        map((effectifs: IEffectif[]) =>
          this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, this.emailTraite?.effectif),
        ),
      )
      .subscribe((effectifs: IEffectif[]) => this.effectifsSharedCollection.set(effectifs));

    this.resetPasswordService
      .query()
      .pipe(map((res: HttpResponse<IResetPassword[]>) => res.body ?? []))
      .pipe(
        map((resetPasswords: IResetPassword[]) =>
          this.resetPasswordService.addResetPasswordToCollectionIfMissing<IResetPassword>(resetPasswords, this.emailTraite?.resetPassword),
        ),
      )
      .subscribe((resetPasswords: IResetPassword[]) => this.resetPasswordsSharedCollection.set(resetPasswords));
  }
}
