import { ListComponent } from '../mock';
import { DynamicDialogRef } from '../services/dialog/dynamic-dialog-ref';
// ============================================================================
// 1. Shared Types
// ============================================================================

type TargetMethod<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;
type DecoratorCtx<This, Args extends unknown[], Return> = ClassMethodDecoratorContext<
  This,
  TargetMethod<This, Args, Return>
>;

// ============================================================================
// 2. Shared Wrapper
// ============================================================================
const loadAll = <
  TData,
  TDialog,
  This extends ListComponent<TData>,
  Args extends unknown[],
  Return extends DynamicDialogRef<TDialog>,
>(
  target: TargetMethod<This, Args, Return>,
): TargetMethod<This, Args, Return> =>
  function (this: This, ...args: Args): Return {
    const result = target.apply(this, args);
    this.subs = result.onClose?.subscribe((_data?: unknown) => this.loadAll(true));
    return result;
  };

// ============================================================================
// 3. Overload 1: Bare decorator -> @ReloadAfterResult
// ============================================================================
export function ReloadAfterResult<
  TData,
  TDialog,
  This extends ListComponent<TData>,
  Args extends unknown[],
  Return extends DynamicDialogRef<TDialog>,
>(
  target: TargetMethod<This, Args, Return>,
  context: DecoratorCtx<This, Args, Return>,
): TargetMethod<This, Args, Return>;

// ============================================================================
// 4. Overload 2: Factory usage -> @ReloadAfterResult()
// ============================================================================
export function ReloadAfterResult(): <
  TData,
  TDialog,
  This extends ListComponent<TData>,
  Args extends unknown[],
  Return extends DynamicDialogRef<TDialog>,
>(
  target: TargetMethod<This, Args, Return>,
  context: DecoratorCtx<This, Args, Return>,
) => TargetMethod<This, Args, Return>;

// ============================================================================
// 5. Main Stage 3 Implementation
// ============================================================================
export function ReloadAfterResult<
  TData,
  TDialog,
  This extends ListComponent<TData>,
  Args extends unknown[],
  Return extends DynamicDialogRef<TDialog>,
>(target?: TargetMethod<This, Args, Return>, context?: DecoratorCtx<This, Args, Return>): unknown {
  if (target !== undefined && context !== undefined) {
    return loadAll<TData, TDialog, This, Args, Return>(target);
  }

  return <
    FData,
    FDialog,
    FThis extends ListComponent<FData>,
    FArgs extends unknown[],
    FReturn extends DynamicDialogRef<FDialog>,
  >(
    actualTarget: TargetMethod<FThis, FArgs, FReturn>,
    _actualContext: DecoratorCtx<FThis, FArgs, FReturn>,
  ): TargetMethod<FThis, FArgs, FReturn> =>
    loadAll<FData, FDialog, FThis, FArgs, FReturn>(actualTarget);
}
