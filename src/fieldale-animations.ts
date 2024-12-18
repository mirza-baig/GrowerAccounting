import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  group,
  stagger
} from '@angular/animations';

export const fade =
  // the fade-in/fade-out animation.
  trigger('fade', [
    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({ opacity: 1 })),
    state('out', style({ opacity: 0 })),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [style({ opacity: 0 }), animate(600)]),

    // fade out when destroyed. this could also be written as transition('void => *')
    transition(':leave', [style({ opacity: 1 }), animate(600)])
  ]);

export const fadeInSlideOutRight = trigger('fadeInSlideOutRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(10%)' }),
    animate(
      '300ms ease-out',
      style({ opacity: 1, transform: 'translateX(0%)' })
    )
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ opacity: 0, transform: 'translateX(10%)' })
    )
  ])
]);

// Parent - Child animation attempt
// export const parentIconSlide = trigger('parentIconSlide', [
//   transition(':enter', [
//     //   style({ transform: 'translateX(-100%)', opacity: 0 }),
//     //   animate(
//     //     '300ms 1s ease-in',
//     //     style({ transform: 'translateX(0%)', opacity: 1 })
//     //   )
//   ])
// ]);

// export const childIconSlide = trigger('childIconSlide', [
//   transition(':enter', [
//     style({ opacity: 0 }),
//     animate('300ms ease-in', style({ opacity: 1 }))
//   ])
// ]);

// Used by progress tracker
export const progressSlide = trigger('progressSlide', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
  ])
]);

export const fadeInOnly =
  // the fade-in/fade-out animation.
  trigger('fadeInOnly', [
    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({ opacity: 1 })),

    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [
      style({ opacity: 0 }),
      animate('0.6s cubic-bezier(.8, -0.6, 0.26, 1.6)')
    ])
  ]);

export const routerTransitionFade = trigger('routerTransitionFade', [
  transition('* <=> *', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ width: '100%' }), {
      optional: true
    }),
    /* 2 */ group([
      // block executes in parallel
      query(
        ':enter',
        [
          style({
            position: 'absolute',
            width: '100%',
            height: '100%'
          }),
          animate('.3s ease-in-out', style({ width: '100%', opacity: 1 }))
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({
            position: 'absolute',
            width: '100%',
            height: '100%'
          }),
          animate('.3s ease-in-out', style({ width: '100%', opacity: 0 }))
        ],
        { optional: true }
      )
    ])
  ])
]);

export const slide = trigger('slideIn', [
  state(
    '*',
    style({
      transform: 'translateX(100%)'
    })
  ),
  state(
    'in',
    style({
      transform: 'translateX(0)'
    })
  ),
  state(
    'out',
    style({
      transform: 'translateX(-100%)'
    })
  ),
  transition('* => in', animate('600ms ease-in')),
  transition('in => out', animate('600ms ease-in'))
]);

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    /* order */
    /* 1 */ query(
      ':enter, :leave',
      style({ position: 'fixed', width: '100%' }),
      { optional: true }
    ),
    /* 2 */ group([
      // block executes in parallel
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
        ],
        { optional: true }
      )
    ])
  ])
]);

export const sidenavAnimation = trigger('sidenavAnimation', [
  state(
    'initial',
    style({
      transform: 'translateX(0px)'
    })
  ),
  state(
    'final',
    style({
      transform: 'translateX(-340px)'
    })
  ),
  transition('initial=>final', animate('200ms ease-out')),
  transition('final=>initial', animate('200ms ease-out'))
]);

export const leftChevronAnimation = trigger('leftChevronAnimation', [
  state(
    'initial',
    style({
      transform: 'translateX(0px)'
    })
  ),
  state(
    'final',
    style({
      transform: 'translateX(--100%)'
    })
  ),
  transition('initial=>final', animate('200ms ease-out')),
  transition('final=>initial', animate('200ms ease-out'))
]);

export const rightChevronAnimation = trigger('rightChevronAnimation', [
  state(
    'initial',
    style({
      transform: 'translateX(100%)'
    })
  ),
  state(
    'final',
    style({
      transform: 'translateX(0px)'
    })
  ),
  transition('initial=>final', animate('200ms ease-out')),
  transition('final=>initial', animate('200ms ease-out'))
]);
