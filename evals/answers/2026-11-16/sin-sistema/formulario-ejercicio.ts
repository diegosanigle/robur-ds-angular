import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface NuevoEjercicio {
  nombre: string;
  series: number;
  repeticiones: number;
}

@Component({
  selector: 'app-ejercicio-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="guardar()"
      class="mx-auto flex max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow"
      novalidate
    >
      <h2 class="text-xl font-semibold">Nuevo ejercicio</h2>

      <div class="flex flex-col gap-1">
        <label for="nombre" class="text-sm font-medium">Nombre</label>
        <input
          id="nombre"
          type="text"
          formControlName="nombre"
          autocomplete="off"
          class="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          [attr.aria-invalid]="mostrarError('nombre')"
        />
        @if (mostrarError('nombre')) {
          <p class="text-sm text-red-600" role="alert">El nombre es obligatorio.</p>
        }
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label for="series" class="text-sm font-medium">Series</label>
          <input
            id="series"
            type="number"
            min="1"
            formControlName="series"
            class="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            [attr.aria-invalid]="mostrarError('series')"
          />
          @if (mostrarError('series')) {
            <p class="text-sm text-red-600" role="alert">Indica un número mayor que 0.</p>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label for="repeticiones" class="text-sm font-medium">Repeticiones</label>
          <input
            id="repeticiones"
            type="number"
            min="1"
            formControlName="repeticiones"
            class="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            [attr.aria-invalid]="mostrarError('repeticiones')"
          />
          @if (mostrarError('repeticiones')) {
            <p class="text-sm text-red-600" role="alert">Indica un número mayor que 0.</p>
          }
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          (click)="cancelar()"
          class="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      </div>
    </form>
  `,
})
export class EjercicioFormComponent {
  private readonly fb = new FormBuilder().nonNullable;

  readonly guardado = output<NuevoEjercicio>();
  readonly cancelado = output<void>();

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]],
    series: [3, [Validators.required, Validators.min(1), Validators.max(99)]],
    repeticiones: [10, [Validators.required, Validators.min(1), Validators.max(999)]],
  });

  mostrarError(campo: 'nombre' | 'series' | 'repeticiones'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, series, repeticiones } = this.form.getRawValue();
    this.guardado.emit({ nombre: nombre.trim(), series, repeticiones });
  }

  cancelar(): void {
    this.form.reset({ nombre: '', series: 3, repeticiones: 10 });
    this.cancelado.emit();
  }
}
