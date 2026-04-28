import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { MotifDepart } from 'app/entities/enumerations/motif-depart.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IDepart } from '../depart.model';
import { DepartService } from '../service/depart.service';

import { DepartFormGroup, DepartFormService } from './depart-form.service';

@Component({
  selector: 'jhi-depart-update',
  templateUrl: './depart-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class DepartUpdate implements OnInit {
  readonly isSaving = signal(false);
  depart: IDepart | null = null;
  motifDepartValues = Object.keys(MotifDepart);

  effectifsSharedCollection = signal<IEffectif[]>([]);

  protected departService = inject(DepartService);
  protected departFormService = inject(DepartFormService);
  protected effectifService = inject(EffectifService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DepartFormGroup = this.departFormService.createDepartFormGroup();

  compareEffectif = (o1: IEffectif | null, o2: IEffectif | null): boolean => this.effectifService.compareEffectif(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depart }) => {
      this.depart = depart;
      if (depart) {
        this.updateForm(depart);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const depart = this.departFormService.getDepart(this.editForm);
    if (depart.id === null) {
      this.subscribeToSaveResponse(this.departService.create(depart));
    } else {
      this.subscribeToSaveResponse(this.departService.update(depart));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IDepart | null>): void {
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

  protected updateForm(depart: IDepart): void {
    this.depart = depart;
    this.departFormService.resetForm(this.editForm, depart);

    this.effectifsSharedCollection.update(effectifs =>
      this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, depart.effectif),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.effectifService
      .query()
      .pipe(map((res: HttpResponse<IEffectif[]>) => res.body ?? []))
      .pipe(
        map((effectifs: IEffectif[]) => this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, this.depart?.effectif)),
      )
      .subscribe((effectifs: IEffectif[]) => this.effectifsSharedCollection.set(effectifs));
  }
}
