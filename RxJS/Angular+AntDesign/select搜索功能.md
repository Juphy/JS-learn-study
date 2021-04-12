```html
<nz-select
    nzMode="multiple"
    nzPlaceHolder="Select users"
    nzAllowClear
    nzShowSearch
    nzServerSearch
    [(ngModel)]="selectedUser"
    (nzOnSearch)="onSearch($event)"
>
    <ng-container *ngFor="let o of optionList">
        <nz-option *ngIf="!isLoading" [nzValue]="o" [nzLabel]="o"></nz-option>
    </ng-container>
    <nz-option *ngIf="isLoading" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i> Loading Data...
    </nz-option>    
</nz-select>
```
```script
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

randomUserUrl = 'https://api.randomuser.me/?results=5';
searchChange$ = new BehaviorSubject('');
optionList: string[] = [];
selectedUser: string;
isLoading = false;

onSearch(value: string): void {
  this.isLoading = true;
  this.searchChange$.next(value);
}

constructor(private http: HttpClient) {}
ngOnInit(): void {
    // tslint:disable:no-any
    // 这里的getRandomNameList是有return的。。。。。
    const getRandomNameList = (name: string) =>
      this.http
        .get(`${this.randomUserUrl}`)
        .pipe(map((res: any) => res.results))
        .pipe(
          map((list: any) => {
            return list.map((item: any) => `${item.name.first} ${name}`);
          })
        );
    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.optionList = data;
      this.isLoading = false;
    });
}
```