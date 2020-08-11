import { Directive, ElementRef, Host, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbPopover, Placement } from '@ng-bootstrap/ng-bootstrap';
import { TourAnchorDirective } from 'ngx-tour-core';

import { NgbTourService } from './ng-bootstrap-tour.service';
import { INgbStepOption } from './step-option.interface';
import { TourStepTemplateService } from './tour-step-template.service';
import {ElementSides, isInviewport} from 'is-inviewport';


@Directive({ selector: '[tourAnchor]' })
export class TourAnchorNgBootstrapPopoverDirective extends NgbPopover { }

@Directive({
  selector: '[tourAnchor]',
})
export class TourAnchorNgBootstrapDirective implements OnInit, OnDestroy, TourAnchorDirective {
  @Input() public tourAnchor: string;

  @HostBinding('class.touranchor--is-active')
  public isActive: boolean;

  constructor(
    private tourService: NgbTourService,
    private tourStepTemplate: TourStepTemplateService,
    private element: ElementRef,
    @Host() private popoverDirective: TourAnchorNgBootstrapPopoverDirective,
  ) {
    this.popoverDirective.autoClose = false;
    this.popoverDirective.triggers = '';
    this.popoverDirective.toggle = () => { };
  }

  public ngOnInit(): void {
    this.tourService.register(this.tourAnchor, this);
  }

  public ngOnDestroy(): void {
    this.tourService.unregister(this.tourAnchor);
  }

  public showTourStep(step: INgbStepOption): void {
    const htmlElement: HTMLElement = this.element.nativeElement;

    this.isActive = true;
    this.popoverDirective.ngbPopover = this.tourStepTemplate.template;
    this.popoverDirective.popoverTitle = step.title;
    this.popoverDirective.container =  'body';
    this.popoverDirective.placement = <Placement>(step.placement || 'top')
      .replace('before', 'left').replace('after', 'right')
      .replace('below', 'bottom').replace('above', 'top');
    step.prevBtnTitle = step.prevBtnTitle || 'Prev';
    step.nextBtnTitle = step.nextBtnTitle || 'Next';
    step.endBtnTitle = step.endBtnTitle || 'End';

    this.popoverDirective.open({ step });
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
    this.popoverDirective.close();
  }
}
