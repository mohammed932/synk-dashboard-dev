import { Injectable } from "@angular/core";
import { LocalizeRouterService } from "localize-router";
import { TranslateService } from "@ngx-translate/core";
import { Subject, Observable } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
@Injectable({
  providedIn: "root"
})
export class LanguageService {
  public isEnglishLang = "";
  lastLocale = "";
  localSubject = new Subject();
  constructor(
    private localizeRouterService: LocalizeRouterService,
    private translateService: TranslateService,
    private _router: Router,
    private location: Location
  ) {
    this.localizeRouterService.changeLanguage("ar");
    this.initAppUrl();
  }

  changeAppLanguage(local: string) {
    this.lastLocale = local;
    this.setAppLocalizations(local);
    this.changeAppDirection(local);
  }

  changeAppDirection(local) {
    return local !== "ar"
      ? document.getElementsByTagName("html")[0].setAttribute("dir", "ltr")
      : document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
  setAppLocalizations(lang: string) {
    this.localizeRouterService.changeLanguage(lang);
    this.translateService.use(lang);
  }

  initAppUrl() {
    const currentLanaguage =
      localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE") || "ar";
    console.log("current langue", currentLanaguage);
    const availableLanguages = ["en", "ar"];
    const urlLang = this.location.path().split("/")[1];
    if (availableLanguages.indexOf(urlLang) === -1) {
      this.setAppLocalizations(currentLanaguage);
      this.changeAppDirection(currentLanaguage);
      this._router.navigateByUrl(currentLanaguage + this.location.path(), {
        replaceUrl: true
      });
      return;
    }
    this.changeAppDirection(currentLanaguage);
    this.setAppLocalizations(currentLanaguage);
    this._router.navigateByUrl(this.location.path(), {
      replaceUrl: true
    });
    // }

    // initAppUrl() {
    //     let currentLanaguage = 'ar';
    //     const availableLanguages = ["ar", "en"];
    //     const urlLang = this.location.path().split("/")[1];
    //     console.log('console.log path', this.location.path())
    //     if (availableLanguages.indexOf(urlLang) === -1) {
    //         this._router.navigateByUrl(currentLanaguage + this.location.path(), {
    //             replaceUrl: true
    //         });
    //         this.setAppLocalizations(currentLanaguage);
    //         this.changeAppDirection(currentLanaguage);
    //         localStorage.setItem('notFirstTime', 'yes');

    //         return;
    //     }
    //     this.setAppLocalizations(currentLanaguage);
    //     this.changeAppDirection(currentLanaguage);
    //     localStorage.setItem('notFirstTime', 'yes');
    //     this._router.navigateByUrl(this.location.path(), {
    //         replaceUrl: true
    //     });
    // }
  }
}
