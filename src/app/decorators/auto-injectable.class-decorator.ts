// ============================================================================
// 1. Shared Types
// ============================================================================
export type InjectableScope = 'root' | 'any' | 'platform';
type ClassTarget = new (...args: any[]) => any;

// ============================================================================
// 2. Shared Wrapper
// ============================================================================
function applyAutoInjectable<T extends ClassTarget>(
  target: T,
  context: ClassDecoratorContext<T>,
  scope: InjectableScope = 'root',
): void {
  context.addInitializer(function () {
    const cls = this as unknown as Record<string, unknown>;

    cls['ɵprov'] = {
      token: target,
      providedIn: scope === 'root' ? 'root' : null,
      factory: () => new target(),
    };
  });
}

// ============================================================================
// 3. Overload 1: Bare decorator -> @AutoInjectable
// ============================================================================
export function AutoInjectable<T extends ClassTarget>(
  target: T,
  context: ClassDecoratorContext<T>,
): void;

// ============================================================================
// 4. Overload 2: Factory usage -> @AutoInjectable('root')
// ============================================================================
export function AutoInjectable(
  scope?: InjectableScope,
): <T extends ClassTarget>(target: T, context: ClassDecoratorContext<T>) => void;

// ============================================================================
// 5. Main Stage 3 Implementation
// ============================================================================
export function AutoInjectable<T extends ClassTarget>(
  scopeOrTarget: InjectableScope = 'root',
  context?: ClassDecoratorContext<T>,
): ((target: T, ctx: ClassDecoratorContext<T>) => void) | void {
  if (typeof scopeOrTarget === 'string') {
    return (target: T, ctx: ClassDecoratorContext<T>) => {
      applyAutoInjectable(target, ctx, scopeOrTarget);
    };
  }

  if (scopeOrTarget && context) {
    applyAutoInjectable(scopeOrTarget, context, 'root');
  }
}
