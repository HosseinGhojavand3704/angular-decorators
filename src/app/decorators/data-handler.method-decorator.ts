import { ListComponent } from '../mock';
import { map, Observable } from 'rxjs';

// ============================================================================
// 1. Core Type
// ============================================================================

type Loader<TData, This> = (this: This, force?: boolean) => Observable<TData[]>;

// ============================================================================
// 2. Shared wrapper
// ============================================================================

function wrap<TData, This extends ListComponent<TData> & { _rangeValue?: number }>(
  fn: Loader<TData, This>,
): Loader<TData, This> {
  return function (this: This, force?: boolean) {
    const result = fn.call(this, force);

    console.log(this._rangeValue);

    result
      .pipe(map((items) => (this._rangeValue ? items.slice(0, this._rangeValue) : items)))
      .subscribe((items) => this.items.set(items));

    return result;
  };
}

// ============================================================================
// 3. Method decorator
// ============================================================================

export function DataHandler<TData, This extends ListComponent<TData>>(
  value: Loader<TData, This>,
  context: ClassMethodDecoratorContext<This, Loader<TData, This>>,
): Loader<TData, This>;

// ============================================================================
// 4. Field decorator (arrow fn)
// ============================================================================

export function DataHandler<TData, This extends ListComponent<TData>>(
  value: undefined,
  context: ClassFieldDecoratorContext<This, Loader<TData, This>>,
): (initialValue: Loader<TData, This>) => Loader<TData, This>;

// ============================================================================
// 5. Factory
// ============================================================================

export function DataHandler(): <TData, This extends ListComponent<TData>>(
  value: Loader<TData, This>,
  context: any,
) => Loader<TData, This>;

// ============================================================================
// 6. Implementation
// ============================================================================

export function DataHandler(): any {
  return function (value?: Loader<any, any>, context?: any) {
    // =========================================================================
    // METHOD decorator
    // =========================================================================
    if (context?.kind === 'method') {
      if (!value) return value;
      return wrap(value);
    }

    // =========================================================================
    // FIELD decorator (arrow fn)
    // =========================================================================
    if (context?.kind === 'field') {
      return (initialValue: Loader<any, any>) => {
        return wrap(initialValue);
      };
    }

    // =========================================================================
    // FACTORY / bare decorator
    // =========================================================================
    if (value) {
      return wrap(value);
    }

    return value;
  };
}
