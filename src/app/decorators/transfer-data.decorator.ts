const META_KEY = Symbol('meta');

type Meta = {
  message: string;
};

type Method<T, A extends unknown[], R> = (this: T, ...args: A) => R;

type Annotated<T> = T & {
  [META_KEY]?: Meta;
};

export function SourceTransferDataDecorator(message: string) {
  return <T, A extends unknown[], R>(
    value: Annotated<Method<T, A, R>>,
    _context: ClassMethodDecoratorContext<T, Method<T, A, R>>,
  ) => {
    value[META_KEY] = { message };
  };
}

export function TargetTransferDataDecorator() {
  return <This, Args extends unknown[], Return>(
    value: Annotated<Method<This, Args, Return>>,
    _context: ClassMethodDecoratorContext<This, Method<This, Args, Return>>,
  ) => {
    return function (this: This, ...args: Args): Return {
      const meta = value[META_KEY];

      console.log('[TargetTransferDataDecorator] Received:', meta?.message);

      return value.apply(this, args);
    };
  };
}
