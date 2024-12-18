import { Injectable } from '@angular/core';

@Injectable()
/** Helper for generating colors to use for the charts */
export class ColorGenerator {

  constructor() {}

  // can get more from locking the first at https://coolors.co/002359-731963-fffdfd-cbd2d0-f0e100
  private colors = [
    '#002359',
    // '#F3E8EE',
    '#BACDB0',
    '#729B79',
    '#475B63',
    // '#F1E4E8',
    '#CEB1BE',
    '#B97375',
    '#2541B2',
    '#06BEE1',
    // '#EF476F',
    '#FFD166',
    // '#FFFCF9',
    '#06D6A0',
    '#FFE66D',
    '#86CB92',
    '#71B48D',
    '#404E7C',
    '#260F26',
    '#55286F',
    '#BC96E6',
    // '#FBFCFF',
    '#177E89',
    '#EEB4B3',
    '#A42CD6',
    // '#FCFCFC',
    '#D2F898',
    '#F6F930',
    '#EAE0D5',
    '#5E503F',
    '#DB3A34',
    '#323031',
    '#A6A57A',
    '#A33B20',
    '#C2F9BB',
    '#62C370',
    '#EDAE49',
    '#30638E',
    '#370031',
    '#EAF27C',

    '#BACDB0',
    '#729B79',
    '#385F71',
    '#6A7FDB',
    '#45CB85',
  ];

  GetRandomColor(): string {
    const i = Math.floor(Math.random() * this.colors.length);
    return this.colors[i];
  }

  /** convert hex color to red value for RGB */
  hexToRed(h: string) {
    return parseInt((this.cutHex(h)).substring(0, 2), 16);
  }

  /** convert hex color to green value for RGB */
  hexToGreen(h: string) {
    return parseInt((this.cutHex(h)).substring(2, 4), 16);
  }

  /** convert hex color to blue value for RGB */
  hexToBlue(h: string) {
    return parseInt((this.cutHex(h)).substring(4, 6), 16);
  }

  /** compute the Luma value for a hex color  */
  getLuma(hex: string) {
    return 0.2126 * this.hexToRed(hex)
          + 0.7152 * this.hexToGreen(hex)
          + 0.0722 * this.hexToBlue(hex);
  }

  getTextColorForBackground(hex: string) {
    return this.getLuma(hex) < 128 ? '#FFFFFF' : '#000000';
  }

  private cutHex(h: string) {
    return (h.charAt(0) === '#') ? h.substring(1, 7) : h;
  }
}
