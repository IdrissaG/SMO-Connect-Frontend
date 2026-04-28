import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { TypeFaute } from 'app/entities/enumerations/type-faute.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { IBlacklist } from '../blacklist.model';
import { BlacklistService } from '../service/blacklist.service';

import { BlacklistFormGroup, BlacklistFormService } from './blacklist-form.service';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

@Component({
  selector: 'jhi-blacklist-update',
  templateUrl: './blacklist-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class BlacklistUpdate implements OnInit {
  readonly isSaving = signal(false);
  blacklist: IBlacklist | null = null;
  typeFauteValues = Object.keys(TypeFaute);

  prestatairesSharedCollection = signal<IPrestataire[]>([]);
  plateausSharedCollection = signal<IPlateau[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected blacklistService = inject(BlacklistService);
  protected blacklistFormService = inject(BlacklistFormService);
  protected prestataireService = inject(PrestataireService);
  protected plateauService = inject(PlateauService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BlacklistFormGroup = this.blacklistFormService.createBlacklistFormGroup();

  comparePrestataire = (o1: IPrestataire | null, o2: IPrestataire | null): boolean => this.prestataireService.comparePrestataire(o1, o2);

  comparePlateau = (o1: IPlateau | null, o2: IPlateau | null): boolean => this.plateauService.comparePlateau(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ blacklist }) => {
      this.blacklist = blacklist;
      if (blacklist) {
        this.updateForm(blacklist);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertErrorModel>('smoConnectFrontendApp.error', { ...err, key: `error.file.${err.key}` }),
        ),
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const blacklist = this.blacklistFormService.getBlacklist(this.editForm);
    if (blacklist.id === null) {
      this.subscribeToSaveResponse(this.blacklistService.create(blacklist));
    } else {
      this.subscribeToSaveResponse(this.blacklistService.update(blacklist));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IBlacklist | null>): void {
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

  protected updateForm(blacklist: IBlacklist): void {
    this.blacklist = blacklist;
    this.blacklistFormService.resetForm(this.editForm, blacklist);

    this.prestatairesSharedCollection.update(prestataires =>
      this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, blacklist.prestataire),
    );
    this.plateausSharedCollection.update(plateaus =>
      this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, blacklist.plateau),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prestataireService
      .query()
      .pipe(map((res: HttpResponse<IPrestataire[]>) => res.body ?? []))
      .pipe(
        map((prestataires: IPrestataire[]) =>
          this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, this.blacklist?.prestataire),
        ),
      )
      .subscribe((prestataires: IPrestataire[]) => this.prestatairesSharedCollection.set(prestataires));

    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, this.blacklist?.plateau)))
      .subscribe((plateaus: IPlateau[]) => this.plateausSharedCollection.set(plateaus));
  }
}
