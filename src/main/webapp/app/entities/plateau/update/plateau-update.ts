import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';

import { PlateauFormGroup, PlateauFormService } from './plateau-form.service';

@Component({
  selector: 'jhi-plateau-update',
  templateUrl: './plateau-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PlateauUpdate implements OnInit {
  readonly isSaving = signal(false);
  plateau: IPlateau | null = null;

  prestatairesSharedCollection = signal<IPrestataire[]>([]);

  protected plateauService = inject(PlateauService);
  protected plateauFormService = inject(PlateauFormService);
  protected prestataireService = inject(PrestataireService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlateauFormGroup = this.plateauFormService.createPlateauFormGroup();

  comparePrestataire = (o1: IPrestataire | null, o2: IPrestataire | null): boolean => this.prestataireService.comparePrestataire(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plateau }) => {
      this.plateau = plateau;
      if (plateau) {
        this.updateForm(plateau);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const plateau = this.plateauFormService.getPlateau(this.editForm);
    if (plateau.id === null) {
      this.subscribeToSaveResponse(this.plateauService.create(plateau));
    } else {
      this.subscribeToSaveResponse(this.plateauService.update(plateau));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPlateau | null>): void {
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

  protected updateForm(plateau: IPlateau): void {
    this.plateau = plateau;
    this.plateauFormService.resetForm(this.editForm, plateau);

    this.prestatairesSharedCollection.update(prestataires =>
      this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, plateau.prestataire),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prestataireService
      .query()
      .pipe(map((res: HttpResponse<IPrestataire[]>) => res.body ?? []))
      .pipe(
        map((prestataires: IPrestataire[]) =>
          this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, this.plateau?.prestataire),
        ),
      )
      .subscribe((prestataires: IPrestataire[]) => this.prestatairesSharedCollection.set(prestataires));
  }
}
