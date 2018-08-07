import { NgModule } from '@angular/core';
import { TempchangePipe } from './tempchange/tempchange';
import { WinddirectionPipe } from './winddirection/winddirection';
@NgModule({
	declarations: [TempchangePipe,
    WinddirectionPipe],
	imports: [],
	exports: [TempchangePipe,
    WinddirectionPipe]
})
export class PipesModule {}
