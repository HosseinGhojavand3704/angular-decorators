interface DecoratorState {
  config?: { limit: number };
  validator?: string;
  reloadEnabled?: boolean;
}

const STATES = new Map<string, DecoratorState>();

function getOrCreateState(context: ClassMethodDecoratorContext<any, any>): DecoratorState {
  const key = String(context.name);

  let state = STATES.get(key);

  if (!state) {
    state = {};
    STATES.set(key, state);
  }

  return state;
}

export function Config(limit: number) {
  return <T, A extends unknown[], R>(
    target: (this: T, ...args: A) => R,
    context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => R>,
  ) => {
    const state = getOrCreateState(context);

    console.log('Config before:', { ...state });

    state.config = { limit };

    console.log('Config after:', { ...state });

    return target;
  };
}

export function Validator(rule: string) {
  return <T, A extends unknown[], R>(
    target: (this: T, ...args: A) => R,
    context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => R>,
  ) => {
    const state = getOrCreateState(context);

    console.log('Validator before:', { ...state });

    state.validator = rule;

    console.log('Validator after:', { ...state });

    return target;
  };
}

export function Load<T, A extends unknown[], R>(
  target: (this: T, ...args: A) => R,
  context: ClassMethodDecoratorContext<T, (this: T, ...args: A) => R>,
): (this: T, ...args: A) => R {
  const state = getOrCreateState(context);

  console.log('Load before:', { ...state });

  state.reloadEnabled = true;

  console.log('Load after:', { ...state });

  return function (this: T, ...args: A): R {
    return target.apply(this, args);
  };
}
