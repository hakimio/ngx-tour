import { Directive, ElementRef, Host, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap';
import { TourAnchorDirective } from 'ngx-tour-core';
import { INgxbStepOption as IStepOption } from './step-option.interface';

import { NgxbTourService } from './ngx-bootstrap-tour.service';
import { TourStepTemplateService } from './tour-step-template.service';
import {ElementSides, isInviewport} from 'is-inviewport';

@Directive({ selector: '[tourAnchor]' })
export class TourAnchorNgxBootstrapPopoverDirective extends PopoverDirective { }

@Directive({
  selector: '[tourAnchor]'
})
export class TourAnchorNgxBootstrapDirective
  implements OnInit, OnDestroy, TourAnchorDirective {
  @Input() public tourAnchor: string;

  @HostBinding('class.touranchor--is-active')
  public isActive: boolean;

  constructor(
    private tourService: NgxbTourService,
    private tourStepTemplate: TourStepTemplateService,
    private element: ElementRef,
    @Host() private popoverDirective: TourAnchorNgxBootstrapPopoverDirective
  ) {
    this.popoverDirective.triggers = '';
  }

  public ngOnInit(): void {
    this.tourService.register(this.tourAnchor, this);
  }

  public ngOnDestroy(): void {
    this.tourService.unregister(this.tourAnchor);
  }

  public showTourStep(step: IStepOption): void {
    const htmlElement: HTMLElement = this.element.nativeElement;

    this.isActive = true;
    this.popoverDirective.popover = this.tourStepTemplate.template;
    this.popoverDirective.popoverContext = { step };
    this.popoverDirective.popoverTitle = step.title;
    this.popoverDirective.container = 'body';
    this.popoverDirective.containerClass = 'ngx-bootstrap';
    if (step.containerClass) {
      this.popoverDirective.containerClass += ` ${step.containerClass}`;
    }
    this.popoverDirective.placement = step.placement || 'top';
    step.prevBtnTitle = step.prevBtnTitle || 'Prev';
    step.nextBtnTitle = step.nextBtnTitle || 'Next';
    step.endBtnTitle = step.endBtnTitle || 'End';
    this.popoverDirective.show();
    if (!step.preventScrolling) {
      if (!isInviewport(htmlElement, ElementSides.Bottom)) {
        htmlElement.scrollIntoView(false);
      } else if (!isInviewport(htmlElement, ElementSides.Top)) {
        htmlElement.scrollIntoView(true);
      }
    }
  }

  public hideTourStep(): void {
    this.isActive = false;
    this.popoverDirective.hide();
  }
}
