import { IVwLiveApdist } from './vw-live-ap-dist.interface';
import { IVwLiveApopen } from './vw-live-ap-open.interface';
import { IVwTestApdist } from './vw-test-ap-dist.interface';
import { IVwTestApopen } from './vw-test-ap-open.interface';

export interface IAPComparisonVM {
    liveDists: IVwLiveApdist[];
    liveOpens: IVwLiveApopen[];
    testDists: IVwTestApdist[];
    testOpens: IVwTestApopen[];
}
