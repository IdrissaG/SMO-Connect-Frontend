import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IUploadLog } from '../upload-log.model';

@Component({
  selector: 'jhi-upload-log-detail',
  templateUrl: './upload-log-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink],
})
export class UploadLogDetail {
  readonly uploadLog = input<IUploadLog | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
