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
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IConge } from '../conge.model';
import { CongeService } from '../service/conge.service';

import { CongeFormGroup, CongeFormService } from './conge-form.service';

@Component({
  selector: 'jhi-conge-update',
  templateUrl: './conge-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class CongeUpdate implements OnInit {
  readonly isSaving = signal(false);
  conge: IConge | null = null;

  effectifsSharedCollection = signal<IEffectif[]>([]);
  usersSharedCollection = signal<IUser[]>([]);

  protected congeService = inject(CongeService);
  protected congeFormService = inject(CongeFormService);
  protected effectifService = inject(EffectifService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CongeFormGroup = this.congeFormService.createCongeFormGroup();

  compareEffectif = (o1: IEffectif | null, o2: IEffectif | null): boolean => this.effectifService.compareEffectif(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conge }) => {
      this.conge = conge;
      if (conge) {
        this.updateForm(conge);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const conge = this.congeFormService.getConge(this.editForm);
    if (conge.id === null) {
      this.subscribeToSaveResponse(this.congeService.create(conge));
    } else {
      this.subscribeToSaveResponse(this.congeService.update(conge));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IConge | null>): void {
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

  protected updateForm(conge: IConge): void {
    this.conge = conge;
    this.congeFormService.resetForm(this.editForm, conge);

    this.effectifsSharedCollection.update(effectifs =>
      this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, conge.effectif),
    );
    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, conge.createdBy));
  }

  protected loadRelationshipsOptions(): void {
    this.effectifService
      .query()
      .pipe(map((res: HttpResponse<IEffectif[]>) => res.body ?? []))
      .pipe(
        map((effectifs: IEffectif[]) => this.effectifService.addEffectifToCollectionIfMissing<IEffectif>(effectifs, this.conge?.effectif)),
      )
      .subscribe((effectifs: IEffectif[]) => this.effectifsSharedCollection.set(effectifs));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.conge?.createdBy)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));
  }
}
