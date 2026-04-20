import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormUtils {
    static readonly cellphonePattern = '^[0-9]+$';
    static readonly pricePattern = '^[0-9]+([\\.,][0-9]{1,2})?$';
    static readonly numberPattern = '^[0-9]+$';
    static readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';


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
                    case 'forbiddenValue':
                        return `'Este campo no puede contener la palabra "${errors['forbiddenValue'].value}"'`
                    case "minlength":
                        return `Mínimo de ${errors['minlength'].requiredLength} carácteres requeridos`;
                    case "maxlength":
                        return `Máximo de ${errors['maxlength'].requiredLength} carácteres`;
                    case "min":
                        return `El valor mínimo es ${errors['min'].min}`;
                    case "email":
                        return `Formato de email inválido`;
                    case "max":
                        return `El valor máximo es ${errors['max'].max}`;
                    case "pattern":
                        const pattern = errors['pattern'].requiredPattern;

                        if (pattern === FormUtils.pricePattern) {
                            return "Formato inválido. Use máximo 2 decimales (ej: 10.99)";
                        } if (pattern === FormUtils.numberPattern) {
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


    //errors validations

    static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ mismatch: true });
            return { mismatch: true };
        }

        return null;
    }

    static forbiddenValues(): ValidatorFn {
        const FORBIDDEN_VALUES: string[] = ['admin', 'root',];
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value.trim().toLowerCase() as string;
            const invalidValue = FORBIDDEN_VALUES.find(v => value.includes(v.trim()));

            return invalidValue ? { forbiddenValue: { value: invalidValue } } : null;
        }
    }

}