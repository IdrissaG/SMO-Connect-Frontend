import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ITemplateModel } from '../template-model.model';

@Component({
  selector: 'jhi-template-model-detail',
  templateUrl: './template-model-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink],
})
export class TemplateModelDetail {
  readonly templateModel = input<ITemplateModel | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
