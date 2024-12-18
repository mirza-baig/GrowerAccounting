import { NgModule } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    ChartModule,
    ToastModule,
    DialogModule,
    ScrollPanelModule,
    OverlayPanelModule
  ],
  exports: [
    ChartModule,
    ToastModule,
    DialogModule,
    ScrollPanelModule,
    OverlayPanelModule
  ],
  providers: [MessageService]
})
export class PrimeModule {}
