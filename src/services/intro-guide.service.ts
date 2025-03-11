import { Injectable } from '@angular/core';
import * as introJs from 'intro.js';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../environments/environment';
import {BehaviorSubject, catchError, Observable, Subject, switchMap, tap} from 'rxjs';

interface GuideInfo{
  title: string;
  element: string;
  intro: string;
}

@Injectable()
export class IntroGuideService{
  guideInfo: GuideInfo[] = [];
  status= false;
  introJS = introJs.default();
  private readonly baseUrl: string;
  guideInfo$ = new Subject<GuideInfo[]>

  private statusSubject = new BehaviorSubject<boolean | null>(null);
  status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient){
    this.baseUrl = `${environment.baseUrl}`;
    // this.getStatus().subscribe(res => {
    //   this.status = res
    //   console.log('I found status :- ',res);
    //   if(res){
    //     this.getGuideInfoData().pipe(
    //       tap((res3)=> {
    //         this.guideInfo$.next(res3)
    //         console.log(res3)
    //         this.initializeGuidTour(res3);
    //       })
    //     ).subscribe();
    //   }
    // });

    this.getStatus().pipe(
      tap(status => this.statusSubject.next(status)),
      switchMap(status => (status ? this.getGuideInfoData() : [])),
      tap(guideInfo => {
        this.guideInfo = guideInfo;
        this.guideInfo$.next(guideInfo);
        this.initializeGuidTour(guideInfo);
      }),
      catchError((err: HttpErrorResponse)=> {
        console.error('Error fetching guide data', err);
        return [];
      })
    ).subscribe()
  }

  getStatus(): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/guide-info-status');
  }

  getGuideInfoData(): Observable<GuideInfo[]> {
    return this.http.get<GuideInfo[]>(this.baseUrl + '/guide-info-doc');
  }

  fetchGuideInfoData(): void{
    this.getGuideInfoData().subscribe(res => {
      this.guideInfo = res;
    })
  }

  initializeGuidTour(guideInfo: GuideInfo[]): void{
    this.introJS.setOptions({
      steps: guideInfo,
      showProgress: true,
      disableInteraction: false
    });
  }

  startGuideTour(){
    if(this.guideInfo.length === 0){
      console.log('Tour steps are not loaded yet.')
      return;
    }
    this.introJS.start();
  }

}
