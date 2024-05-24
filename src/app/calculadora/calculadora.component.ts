import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalculadoraService } from '../calculadora.service';
import { Calculadora } from '../calculadora';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {
  num1: number = 0;
  num2: number = 0;
  media: number = 0;
  variancia: number = 0;
  desvioPadrao: number = 0;
  calculadora: Calculadora[] = [];
  formGroupHistorico: FormGroup;

  constructor(private calculadoraService: CalculadoraService, private formBuilder: FormBuilder) {
    this.formGroupHistorico = formBuilder.group({
      res1: [0],
      res2: [0],
      res3: [0],
      res4: [0],
    });
  }

  ngOnInit(): void {
    this.loadResult();
  }

  loadResult() {
    this.calculadoraService.getCalculadora().subscribe({
      next: data => this.calculadora = data
    });
  }

  calcularMedia() {
    const res1Number = parseFloat(this.formGroupHistorico.value.res1);
    const res2Number = parseFloat(this.formGroupHistorico.value.res2);
    
    if (!isNaN(res1Number) && !isNaN(res2Number)) {
      this.media = (res1Number + res2Number) / 2;
    } else {
      this.media = NaN;
    }
  }

  calcularVariancia() {
    const res3Number = parseFloat(this.formGroupHistorico.value.res3);
    const res4Number = parseFloat(this.formGroupHistorico.value.res4);
  
    if (!isNaN(res3Number) && !isNaN(res4Number)) {
      this.variancia = ((res3Number - this.media) ** 2 + (res4Number - this.media) ** 2) / 2;
    } else {
      this.variancia = NaN;
    }
  }

  calcularDesvioPadrao(){
    if (!isNaN(this.variancia)) {
      this.desvioPadrao = Math.sqrt(this.variancia);
    } else {
      this.desvioPadrao = NaN;
    }
  }

  save() {
    if (this.formGroupHistorico.valid) {
      this.calcularMedia();
      this.calcularVariancia();
      this.calcularDesvioPadrao();

      const result = {
        ...this.formGroupHistorico.value,
        media: this.media,
        variancia: this.variancia,
        desvioPadrao: this.desvioPadrao
      };
      this.calculadoraService.save(result).subscribe({
        next: data => {
          this.calculadora.push(data);
          this.loadResult();
          this.formGroupHistorico.reset();
        }
      });
    }
  }
}
