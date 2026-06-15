import { AutoInjectable } from '../../decorators/auto-injectable.class-decorator';
import { Type } from '@angular/core';
import { DynamicDialogRef } from './dynamic-dialog-ref';

@AutoInjectable()
export class DialogService {
  open<T>(componentType: Type<T>): DynamicDialogRef {
    console.log(`[DialogService -> open()] called with componentType=${componentType.name}`);
    return new DynamicDialogRef<T>();
  }
}
