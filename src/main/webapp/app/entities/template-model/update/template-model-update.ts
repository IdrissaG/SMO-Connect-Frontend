import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { TemplateModelService } from '../service/template-model.service';
import { ITemplateModel } from '../template-model.model';

import { TemplateModelFormGroup, TemplateModelFormService } from './template-model-form.service';

@Component({
  selector: 'jhi-template-model-update',
  templateUrl: './template-model-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class TemplateModelUpdate implements OnInit {
  readonly isSaving = signal(false);
  templateModel: ITemplateModel | null = null;

  protected templateModelService = inject(TemplateModelService);
  protected templateModelFormService = inject(TemplateModelFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TemplateModelFormGroup = this.templateModelFormService.createTemplateModelFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ templateModel }) => {
      this.templateModel = templateModel;
      if (templateModel) {
        this.updateForm(templateModel);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const templateModel = this.templateModelFormService.getTemplateModel(this.editForm);
    if (templateModel.id === null) {
      this.subscribeToSaveResponse(this.templateModelService.create(templateModel));
    } else {
      this.subscribeToSaveResponse(this.templateModelService.update(templateModel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ITemplateModel | null>): void {
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

  protected updateForm(templateModel: ITemplateModel): void {
    this.templateModel = templateModel;
    this.templateModelFormService.resetForm(this.editForm, templateModel);
  }
}
