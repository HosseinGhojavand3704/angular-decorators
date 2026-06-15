import { Component, inject } from '@angular/core';
import { ListComponent } from './mock';
import { ReloadAfterResult } from './decorators/reload-after-result.method-decorator';
import { DialogService } from './services/dialog/dialog.service';
import { DynamicDialogRef } from './services/dialog/dynamic-dialog-ref';
import { PostService } from './services/http-service/post.service';
import { Observable } from 'rxjs';
import { Post } from './services/http-service/post.model';
import { DataHandler } from './decorators/data-handler.method-decorator';
import { FormsModule } from '@angular/forms';
import { Clamp } from './decorators/clamp.setter-decorator';
import {
  Config,
  Load,
  Validator,
} from './sample-decorators/decorator-transfer-data.method-decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormsModule],
})
export class AppComponent extends ListComponent<Post> {
  private readonly dialogService = inject(DialogService);
  private readonly postService = inject(PostService);

  private _rangeValue = 10;

  get rangeValue(): number {
    return this._rangeValue;
  }

  @Clamp
  set rangeValue(value: number) {
    this._rangeValue = value;
    this.loadAll(true);
  }

  @ReloadAfterResult
  edit(): DynamicDialogRef {
    const appDynamicDialogRef = this.dialogService.open(AppComponent);
    appDynamicDialogRef.close('123');
    return appDynamicDialogRef;
  }

  // @UnregisterController
  // @DataHandler
  // loadAll(force?: boolean): Observable<Post[]> {
  //   return this.postService.getPosts();
  // }

  @DataHandler
  loadAll = (force?: boolean): Observable<Post[]> => this.postService.getPosts();

  @Config(10)
  @Validator('required')
  @Load
  transferData() {
    console.log('transferData called');
  }
}
