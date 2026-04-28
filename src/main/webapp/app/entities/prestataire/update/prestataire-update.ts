import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IPrestataire } from '../prestataire.model';
import { PrestataireService } from '../service/prestataire.service';

import { PrestataireFormGroup, PrestataireFormService } from './prestataire-form.service';

@Component({
  selector: 'jhi-prestataire-update',
  templateUrl: './prestataire-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PrestataireUpdate implements OnInit {
  readonly isSaving = signal(false);
  prestataire: IPrestataire | null = null;

  protected prestataireService = inject(PrestataireService);
  protected prestataireFormService = inject(PrestataireFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PrestataireFormGroup = this.prestataireFormService.createPrestataireFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prestataire }) => {
      this.prestataire = prestataire;
      if (prestataire) {
        this.updateForm(prestataire);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const prestataire = this.prestataireFormService.getPrestataire(this.editForm);
    if (prestataire.id === null) {
      this.subscribeToSaveResponse(this.prestataireService.create(prestataire));
    } else {
      this.subscribeToSaveResponse(this.prestataireService.update(prestataire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPrestataire | null>): void {
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

  protected updateForm(prestataire: IPrestataire): void {
    this.prestataire = prestataire;
    this.prestataireFormService.resetForm(this.editForm, prestataire);
  }
}
