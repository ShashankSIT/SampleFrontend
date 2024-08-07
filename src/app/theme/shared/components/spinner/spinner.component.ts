import {
  Component,
  Input,
  OnDestroy,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { Spinkit } from './spinkits';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: [
    './spinner.component.scss',
    //'./spinkit-css/sk-line-material.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = false;
  public Spinkit = Spinkit;
  private spinnerSubscription: any;
  @Input() public backgroundColor = '#1dc4e9';
  @Input() public spinner = Spinkit.skLine;
  constructor(
    private router: Router,
    //@Inject(DOCUMENT) private document: Document,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    // this.router.events.subscribe(
    //   (event) => {
    //     if (event instanceof NavigationStart) {
    //       this.isSpinnerVisible = true;
    //     } else if (
    //       event instanceof NavigationEnd ||
    //       event instanceof NavigationCancel ||
    //       event instanceof NavigationError
    //     ) {
    //       //this.isSpinnerVisible = false;
    //     }
    //   },
    //   () => {
    //     //this.isSpinnerVisible = false;
    //   },
    // );
    this.spinnerSubscription = this.sharedService.spinLoader$.subscribe({
      next: (data) => {
        this.isSpinnerVisible = data;
      },
      // complete: () => {
      //   this.isSpinnerVisible = false;
      // }
    });
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
    if (this.spinnerSubscription) {
      this.spinnerSubscription.unsubscribe();
    }
  }
}
