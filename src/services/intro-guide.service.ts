import { Injectable } from '@angular/core';
import * as introJs from 'intro.js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

interface GuideInfo{
  title: string;
  element: string;
  intro: string;
}

@Injectable({ providedIn: 'root'})
export class IntroGuideService{
  guideInfo: GuideInfo[] = [
    {
      title: 'buttons',
      element: '#addNew',
      intro: 'Click to view the buttons111'
    },
    {
      title: 'test',
      element: '#test',
      intro: 'This is test'
    }
  ];
  status= false;
  introJS = introJs.default();
  private readonly baseUrl: string;

  constructor(private http: HttpClient){
    this.baseUrl = `${environment.baseUrl}`;
    this.getStatus().subscribe(res => {
      this.status = res
      console.log('I found status :- ',res);
      // if(res){
      //   this.getGuideInfoData().subscribe(res2 => {
      //     console.log(res2);
      //     this.guideInfo = res2;
      //   })
      // }
    });
  }

  getStatus(): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/guide-info-status');
  }

  getGuideInfoData(): Observable<GuideInfo[]> {
    return this.http.get<GuideInfo[]>(this.baseUrl + '/guide-info-doc');
  }

  fetchGuideInfoData(): void{
    this.getGuideInfoData().subscribe(res => {
      console.log(res);
      this.guideInfo = res;
    })
  }

  initializeGuidTour(): void{
    this.startTour();
  }

  startTour(){
    this.introJS.setOptions({
      steps: this.guideInfo,
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
