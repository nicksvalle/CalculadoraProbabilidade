import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';

@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    CalculadoraComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
