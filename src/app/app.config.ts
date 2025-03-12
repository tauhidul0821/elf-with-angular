import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {IntroGuideService} from '../services/intro-guide.service';
import {TodoService} from '../services/todo.service';
import {TourPrimeNgModule} from 'ngx-ui-tour-primeng';
import { provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
;

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), IntroGuideService, TodoService, TourPrimeNgModule, provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
]
};
