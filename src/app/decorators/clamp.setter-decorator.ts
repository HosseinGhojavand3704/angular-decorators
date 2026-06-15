import { signal, Signal } from '@angular/core'; // فرض بر این است که در محیط انگولار هستید

// ============================================================================
// 1. Shared Types (Strict Stage 3 Compliant)
// ============================================================================
type SetterTarget<This> = (this: This, value: number) => void;
type SetterResult<This> = (this: This, value: number) => void;
type DecoratorCtx<This> = ClassSetterDecoratorContext<This, number>;

// ============================================================================
// 2. Shared Wrapper
// ============================================================================
const applyClamp = <This>(
  target: SetterTarget<This>,
  min: number,
  max: number,
): SetterResult<This> =>
  function (this: This, value: number): void {
    const clampedValue = Math.min(Math.max(value, min), max);
    target.call(this, clampedValue);
  };

// ============================================================================
// 3. Overload 1: Bare decorator -> @Clamp
// ============================================================================
export function Clamp<This>(
  target: SetterTarget<This>,
  context: DecoratorCtx<This>,
): SetterResult<This>;

// ============================================================================
// 4. Overload 2: Factory usage -> @Clamp(0, 100)
// ============================================================================
export function Clamp(
  min: number,
  max: number,
): <This>(target: SetterTarget<This>, context: DecoratorCtx<This>) => SetterResult<This>;

// ============================================================================
// 5. Main Stage 3 Implementation
// ============================================================================
export function Clamp<This>(
  targetOrMin?: SetterTarget<This> | number,
  contextOrMax?: DecoratorCtx<This> | number,
): unknown {
  // Bare usage: @Clamp
  if (
    typeof targetOrMin === 'function' &&
    contextOrMax !== undefined &&
    typeof contextOrMax === 'object'
  ) {
    if (contextOrMax.kind !== 'setter') {
      throw new Error('@Clamp can only be used on a setter.');
    }
    return applyClamp<This>(targetOrMin, 0, 100); // مقادیر پیش‌فرض برای حالت بدون پارامتر
  }

  // Factory usage: @Clamp(min, max)
  const min = typeof targetOrMin === 'number' ? targetOrMin : 0;
  const max = typeof contextOrMax === 'number' ? contextOrMax : 100;

  return <FThis>(
    actualTarget: SetterTarget<FThis>,
    actualContext: DecoratorCtx<FThis>,
  ): SetterResult<FThis> => {
    if (actualContext.kind !== 'setter') {
      throw new Error('@Clamp can only be used on a setter.');
    }
    return applyClamp<FThis>(actualTarget, min, max);
  };
}
