import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../../../shared/services/language/language.service';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
    }
    handleGuard() {
        return this.authService.getUserRole() === 'admin' ? true : this.router.navigateByUrl(`${localStorage.getItem('language')}`);
    }

    canActivate() {
        return this.handleGuard();
    }
}