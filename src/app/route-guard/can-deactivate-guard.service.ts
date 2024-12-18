import { Component } from '@angular/compiler/src/core';
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<Component> {
  canDeactivate(component): boolean {
    if (component.hasUnsavedData()) {
      if (
        confirm(
          'You have unsaved changes! If you leave, your changes will be lost.'
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      // cleanup: this was logging 'hasUnsavedData returned false' do we need something here?
    }
    return true;
  }
}
