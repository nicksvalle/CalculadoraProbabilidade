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
  temporario: number = 0;
  result: string = "";
  calculadora: Calculadora[] = [];
  formGroupHistorico: FormGroup;

  constructor(private calculadoraService: CalculadoraService, private formBuilder: FormBuilder) {
    this.formGroupHistorico = formBuilder.group({
      id: [''],
      res1: [0],
      res2: [0],
      result: ['']
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

  operacao() {
    // Converter os valores de res1 e res2 para números
    const res1Number = parseFloat(this.formGroupHistorico.value.res1);
    const res2Number = parseFloat(this.formGroupHistorico.value.res2);
    
    // Verificar se os valores são válidos antes de realizar a divisão
    if (!isNaN(res1Number) && !isNaN(res2Number) && res2Number !== 0) {
      this.temporario = res1Number / res2Number;
      this.result = this.temporario.toFixed(2);
    } else {
      this.result = "NaN";
    }
  }

  save() {
    if (this.formGroupHistorico.valid) {
      const result = {
        ...this.formGroupHistorico.value,
        result: this.result
      };
      this.calculadoraService.save(result).subscribe({
        next: data => {
          this.calculadora.push(data);
          this.loadResult(); // Recarrega os dados após salvar
          this.formGroupHistorico.reset(); // Limpa o formulário
        }
      });
    }
  }
}
