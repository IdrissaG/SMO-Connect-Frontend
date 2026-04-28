import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IApplication } from '../application.model';
import { ApplicationService } from '../service/application.service';

import { ApplicationFormGroup, ApplicationFormService } from './application-form.service';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ApplicationUpdate implements OnInit {
  readonly isSaving = signal(false);
  application: IApplication | null = null;

  protected applicationService = inject(ApplicationService);
  protected applicationFormService = inject(ApplicationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ApplicationFormGroup = this.applicationFormService.createApplicationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ application }) => {
      this.application = application;
      if (application) {
        this.updateForm(application);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const application = this.applicationFormService.getApplication(this.editForm);
    if (application.id === null) {
      this.subscribeToSaveResponse(this.applicationService.create(application));
    } else {
      this.subscribeToSaveResponse(this.applicationService.update(application));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IApplication | null>): void {
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

  protected updateForm(application: IApplication): void {
    this.application = application;
    this.applicationFormService.resetForm(this.editForm, application);
  }
}
