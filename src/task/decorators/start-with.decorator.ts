import { registerDecorator } from "class-validator";

export function StartsWith(prefix: string) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'startsWith',
            target: object.constructor,
            propertyName,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && value.startsWith(prefix);
                },
                defaultMessage() {
                    return `Название должно начинаться с ${prefix}`
                }
            }
        })
    }
}