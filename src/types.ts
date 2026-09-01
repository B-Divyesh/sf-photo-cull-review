export type Decision = 'undecided' | 'keep' | 'review';

export interface MediaAsset {
  id: string;
  name: string;
  path: string;
  mediaType: 'image' | 'video';
  mime: string;
  size: number;
  lastModified: number;
  /**
   * Camera capture time read from embedded image metadata. It is deliberately
   * separate from the browser's file-system modification time: copied files
   * commonly receive a new modification time.
   */
  captureTimestamp?: number;
  sha256: string;
  perceptualHash?: string;
  thumbnail?: string;
  decision: Decision;
}

export interface ReviewGroup {
  id: string;
  kind: 'exact' | 'similar';
  assetIds: string[];
  explanation: string;
}

export interface ScanSummary {
  scanned: number;
  skipped: number;
  scannedAt: number;
  rootName: string;
}

export interface AppData {
  version: 1;
  assets: MediaAsset[];
  groups: ReviewGroup[];
  scan?: ScanSummary;
  activeGroup: number;
  history: Array<{ at: number; assetId: string; from: Decision; to: Decision }>;
}

export const EMPTY_DATA: AppData = {
  version: 1,
  assets: [],
  groups: [],
  activeGroup: 0,
  history: [],
};
