import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TypeUtilisateur } from 'app/entities/enumerations/type-utilisateur.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IProfile } from '../profile.model';
import { ProfileService } from '../service/profile.service';

import { ProfileFormGroup, ProfileFormService } from './profile-form.service';

@Component({
  selector: 'jhi-profile-update',
  templateUrl: './profile-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ProfileUpdate implements OnInit {
  readonly isSaving = signal(false);
  profile: IProfile | null = null;
  typeUtilisateurValues = Object.keys(TypeUtilisateur);

  prestatairesSharedCollection = signal<IPrestataire[]>([]);
  plateausSharedCollection = signal<IPlateau[]>([]);

  protected profileService = inject(ProfileService);
  protected profileFormService = inject(ProfileFormService);
  protected prestataireService = inject(PrestataireService);
  protected plateauService = inject(PlateauService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProfileFormGroup = this.profileFormService.createProfileFormGroup();

  comparePrestataire = (o1: IPrestataire | null, o2: IPrestataire | null): boolean => this.prestataireService.comparePrestataire(o1, o2);

  comparePlateau = (o1: IPlateau | null, o2: IPlateau | null): boolean => this.plateauService.comparePlateau(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profile }) => {
      this.profile = profile;
      if (profile) {
        this.updateForm(profile);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const profile = this.profileFormService.getProfile(this.editForm);
    if (profile.id === null) {
      this.subscribeToSaveResponse(this.profileService.create(profile));
    } else {
      this.subscribeToSaveResponse(this.profileService.update(profile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IProfile | null>): void {
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

  protected updateForm(profile: IProfile): void {
    this.profile = profile;
    this.profileFormService.resetForm(this.editForm, profile);

    this.prestatairesSharedCollection.update(prestataires =>
      this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, profile.prestataire),
    );
    this.plateausSharedCollection.update(plateaus =>
      this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, profile.plateau),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.prestataireService
      .query()
      .pipe(map((res: HttpResponse<IPrestataire[]>) => res.body ?? []))
      .pipe(
        map((prestataires: IPrestataire[]) =>
          this.prestataireService.addPrestataireToCollectionIfMissing<IPrestataire>(prestataires, this.profile?.prestataire),
        ),
      )
      .subscribe((prestataires: IPrestataire[]) => this.prestatairesSharedCollection.set(prestataires));

    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, this.profile?.plateau)))
      .subscribe((plateaus: IPlateau[]) => this.plateausSharedCollection.set(plateaus));
  }
}
