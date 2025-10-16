import type { Context as IstanbulContext } from 'istanbul-lib-report';

declare module 'istanbul-lib-report' {
  export class ReportBase {
    constructor(options?: { summarizer?: string });
    execute(context: IstanbulContext): void;
  }
}
