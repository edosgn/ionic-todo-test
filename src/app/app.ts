import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagDemoComponent } from './presentation/components/feature-flag-demo/feature-flag-demo.component';

@Component({
  imports: [RouterModule, IonicModule, FeatureFlagDemoComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'ionic-todo-test';
}
