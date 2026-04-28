import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EtatDemande } from 'app/entities/enumerations/etat-demande.model';
import { TypeDemande } from 'app/entities/enumerations/type-demande.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';

import { DemandeFormGroup, DemandeFormService } from './demande-form.service';

@Component({
  selector: 'jhi-demande-update',
  templateUrl: './demande-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class DemandeUpdate implements OnInit {
  readonly isSaving = signal(false);
  demande: IDemande | null = null;
  typeDemandeValues = Object.keys(TypeDemande);
  etatDemandeValues = Object.keys(EtatDemande);

  protected demandeService = inject(DemandeService);
  protected demandeFormService = inject(DemandeFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DemandeFormGroup = this.demandeFormService.createDemandeFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demande }) => {
      this.demande = demande;
      if (demande) {
        this.updateForm(demande);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const demande = this.demandeFormService.getDemande(this.editForm);
    if (demande.id === null) {
      this.subscribeToSaveResponse(this.demandeService.create(demande));
    } else {
      this.subscribeToSaveResponse(this.demandeService.update(demande));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IDemande | null>): void {
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

  protected updateForm(demande: IDemande): void {
    this.demande = demande;
    this.demandeFormService.resetForm(this.editForm, demande);
  }
}
