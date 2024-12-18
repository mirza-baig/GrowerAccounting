import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {RouteGuardService} from '../route-guard/route-guard.service';

@Directive({
  selector: '[appDisabledForRole]'
})
export class DisabledForRoleDirective implements AfterViewInit {

  element: ElementRef;
  @Input() appDisabledForRole = '';
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.element = el;
  }


  ngAfterViewInit(): void {
    const routeGuardService = new RouteGuardService(null);
    if (this.appDisabledForRole && routeGuardService.checkRoles(this.appDisabledForRole)) {
      this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
    }
  }

}
