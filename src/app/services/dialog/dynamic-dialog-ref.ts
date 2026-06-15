import { BehaviorSubject } from 'rxjs';

export class DynamicDialogRef<ComponentType = any> {
  private readonly close$ = new BehaviorSubject<string | undefined>(undefined);
  readonly onClose = this.close$.asObservable();

  close(value?: string) {
    console.log(`[DynamicDialogRef -> close()] called with value=${value}`);
    this.close$.next(value);
  }
}
