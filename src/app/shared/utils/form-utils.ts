import { AbstractControl, ValidationErrors } from "@angular/forms";

export class FormUtils {
    static cellphonePattern = '^[0-9]+$';
    static pricePattern = '^[0-9]+([\\.,][0-9]{1,2})?$';
    static numberPattern = '^[0-9]+$';

    static getTextError(formControl: AbstractControl): string | null {
        if (formControl == null) {
            return null;
        }

        if (formControl.errors == null) {
            return null;
        }

        if (formControl.touched) {
            const errors = formControl.errors;

            for (const key of Object.keys(errors)) {

                switch (key) {
                    case 'required':
                        return 'Este campo es requerido'
                    case "minlength":
                        return `Mínimo de ${errors['minlength'].requiredLength} carácteres requeridos`;
                    case "maxlength":
                        return `Máximo de ${errors['maxlength'].requiredLength} carácteres`;
                    case "min":
                        return `El valor mínimo es ${errors['min'].min}`;
                    case "max":
                        return `El valor máximo es ${errors['max'].max}`;
                    case "pattern":
                        const pattern = errors['pattern'].requiredPattern;

                        if (pattern === FormUtils.pricePattern) {
                            return "Formato inválido. Use máximo 2 decimales (ej: 10.99)";
                        }if (pattern === FormUtils.numberPattern) {
                            return "Solo se permiten números enteros";
                        }
                        return "Solo se permiten números";

                    default:
                        break;
                }
            }
        }

        return null;
    }

   
}