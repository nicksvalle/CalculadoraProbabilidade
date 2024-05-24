import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalculadoraService } from '../calculadora.service';
import { Calculadora } from '../calculadora';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit {
  numeros: string = '';
  media: number = 0;
  variancia: number = 0;
  desvioPadrao: number = 0;
  calculadora: Calculadora[] = [];
  formGroupHistorico: FormGroup;

  constructor(private calculadoraService: CalculadoraService, private formBuilder: FormBuilder) {
    this.formGroupHistorico = formBuilder.group({
      id: [''],
      numInput: [''],
    });
  }

  ngOnInit(): void {
    this.loadResult();
  }

  loadResult() {
    this.calculadoraService.getCalculadora().subscribe({
      next: (data: Calculadora[]) => this.calculadora = data
    });
  }

  calcularMedia() {
    const numerosArray: number[] = this.formGroupHistorico.value.numInput.split(',').map((num: string) => parseFloat(num));
    const numerosValidos: number[] = numerosArray.filter((num: number) => !isNaN(num));
    if (numerosValidos.length > 0) {
      this.media = numerosValidos.reduce((acc, val) => acc + val, 0) / numerosValidos.length;
    } else {
      this.media = NaN;
    }
  }

  calcularVariancia() {
    const numerosArray: number[] = this.formGroupHistorico.value.numInput.split(',').map((num: string) => parseFloat(num));
    const numerosValidos: number[] = numerosArray.filter((num: number) => !isNaN(num));
    if (numerosValidos.length > 0) {
      const somaQuadrados: number = numerosValidos.reduce((acc, val) => acc + val ** 2, 0);
      const soma: number = numerosValidos.reduce((acc, val) => acc + val, 0);
      this.variancia = (somaQuadrados / numerosValidos.length) - (soma / numerosValidos.length) ** 2;
    } else {
      this.variancia = NaN;
    }
  }

  calcularDesvioPadrao() {
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
        ...this.formGroupHistorico.value, // Include all form fields
        numInput: this.formGroupHistorico.value.numInput, // Add numInput to the result object
        media: this.media,
        variancia: this.variancia,
        desvioPadrao: this.desvioPadrao
      };
  
      this.calculadoraService.save(result).subscribe({
        next: (data: Calculadora) => {
          this.calculadora.push(data);
          this.loadResult();
          this.formGroupHistorico.reset();
        }
      });
    }
  }
  
  
}
