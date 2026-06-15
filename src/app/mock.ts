import { Subscription } from 'rxjs';
import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  standalone: true,
  template: ''
})
export abstract class ListComponent<T = unknown> implements OnDestroy {
  subs?: Subscription;

  items = signal(<T[]>[]);

  constructor() {
    this.subs = new Subscription();
  }

  abstract loadAll(force?: boolean): void;

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
