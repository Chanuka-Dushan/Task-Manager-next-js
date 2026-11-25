import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Ensures a date string (YYYY-MM-DD) is today or in the future.
 * We compare calendar dates only, so the user's local "today" is respected
 * regardless of time zone differences.
 */
export function IsTodayOrFuture(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTodayOrFuture',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return true; // let @IsDateString handle format
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const date = new Date(value);
          return date >= today;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be today or a future date`;
        },
      },
    });
  };
}
