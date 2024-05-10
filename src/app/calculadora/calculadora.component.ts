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
  res1: number = 0;
  res2: number = 0;
  res3: number = 0; // Adicionando res3 para a probabilidade composta
  res4: number = 0; // Adicionando res4 para a probabilidade composta
  temporario: number = 0;
  resultSimples: string = "";
  resultComposta: string = ""; // Resultado para a probabilidade composta
  calculadora: Calculadora[] = [];
  formGroupHistorico: FormGroup;

  constructor(private calculadoraService: CalculadoraService, private formBuilder: FormBuilder) {
    this.formGroupHistorico = formBuilder.group({
      id: [''],
      res1: [0],
      res2: [0],
      res3: [0],
      res4: [0],
      resultSimples: [''],
      resultComposta: ['']
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

  simples() {
    const res1Number = parseFloat(this.formGroupHistorico.value.res1);
    const res2Number = parseFloat(this.formGroupHistorico.value.res2);
    
    if (!isNaN(res1Number) && !isNaN(res2Number) && res2Number !== 0) {
      this.temporario = res1Number / res2Number;
      this.resultSimples = this.temporario.toFixed(2);
    } else {
      this.resultSimples = "NaN";
    }
  }

  composta() {
    const res3Number = parseFloat(this.formGroupHistorico.value.res3);
    const res4Number = parseFloat(this.formGroupHistorico.value.res4);
  
    if (!isNaN(res3Number) && !isNaN(res4Number)) {
      const probabilidadeComposta = (res3Number / res4Number) * 100;
      this.resultComposta = probabilidadeComposta.toFixed(2);
    } else {
      this.resultComposta = "NaN";
    }
  }

  save() {
    if (this.formGroupHistorico.valid) {
      const result = {
        ...this.formGroupHistorico.value,
        resultSimples: this.resultSimples,
        resultComposta: this.resultComposta
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
