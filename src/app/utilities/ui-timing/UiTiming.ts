export class UiTiming {
  public static delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms));
  }
}
