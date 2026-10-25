import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class StringToLowercasePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (
            metadata.type === 'body' &&
            value &&
            typeof value.title === 'string'
        ) {
            value.title = value.title.toLocaleLowerCase();
        }

        return value;
    }
}