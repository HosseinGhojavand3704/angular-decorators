import { AutoInjectable } from '../../decorators/auto-injectable.class-decorator';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Post } from './post.model';
import { Observable } from 'rxjs';

@AutoInjectable()
export class PostService {
  private readonly http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }
}
