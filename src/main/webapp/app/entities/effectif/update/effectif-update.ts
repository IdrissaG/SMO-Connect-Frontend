import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Fonction } from 'app/entities/enumerations/fonction.model';
import { Genre } from 'app/entities/enumerations/genre.model';
import { TypeContrat } from 'app/entities/enumerations/type-contrat.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { IEffectif } from '../effectif.model';
import { EffectifService } from '../service/effectif.service';

import { EffectifFormGroup, EffectifFormService } from './effectif-form.service';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { TypeCompte } from 'app/entities/enumerations/type-compte.model';

@Component({
  selector: 'jhi-effectif-update',
  templateUrl: './effectif-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class EffectifUpdate implements OnInit {
  readonly isSaving = signal(false);
  effectif: IEffectif | null = null;
  genreValues = Object.keys(Genre);
  typeContratValues = Object.keys(TypeContrat);
  typeCompteValues = Object.keys(TypeCompte);
  fonctionValues = Object.keys(Fonction);

  prestatairesSharedCollection = signal<IPrestataire[]>([]);
  plateausSharedCollection = signal<IPlateau[]>([]);

  protected effectifService = inject(EffectifService);
  protected effectifFormService = inject(EffectifFormService);
  protected prestataireService = inject(PrestataireService);
  protected plateauService = inject(PlateauService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EffectifFormGroup = this.effectifFormService.createEffectifFormGroup();

  comparePrestataire = (o1: IPrestataire | null, o2: IPrestataire | null): boolean => this.prestataireService.comparePrestataire(o1, o2);

  comparePlateau = (o1: IPlateau | null, o2: IPlateau | null): boolean => this.plateauService.comparePlateau(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ effectif }) => {
      this.effectif = effectif;
      if (effectif) {
        this.updateForm(effectif);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const effectif = this.effectifFormService.getEffectif(this.editForm);
    if (effectif.id === null) {
      this.subscribeToSaveResponse(this.effectifService.create(effectif));
    } else {
      this.subscribeToSaveResponse(this.effectifService.update(effectif));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IEffectif | null>): void {
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

  protected updateForm(effectif: IEffectif): void {
    this.effectif = effectif;
    this.effectifFormService.resetForm(this.editForm, effectif);

    this.prestatairesSharedCollection.update(prestataires =>
      this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, effectif.prestataire),
    );
    this.plateausSharedCollection.update(plateaus =>
      this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, effectif.plateau),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prestataireService
      .query()
      .pipe(map((res: HttpResponse<IPrestataire[]>) => res.body ?? []))
      .pipe(
        map((prestataires: IPrestataire[]) =>
          this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, this.effectif?.prestataire),
        ),
      )
      .subscribe((prestataires: IPrestataire[]) => this.prestatairesSharedCollection.set(prestataires));

    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, this.effectif?.plateau)))
      .subscribe((plateaus: IPlateau[]) => this.plateausSharedCollection.set(plateaus));
  }
}
