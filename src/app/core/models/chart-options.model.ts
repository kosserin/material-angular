export interface ChartOptions {
  animationEnabled?: boolean;
  title?: {
    text?: string;
  };
  axisX?: {
    labelAngle?: number;
    title?: string;
  };
  axisY?: {
    title?: string;
  };
  axisY2?: {
    title?: string;
  };
  toolTip?: {
    shared?: boolean;
  };
  legend?: {
    cursor?: string;
    itemclick?: (e: any) => void;
  };
  data?: Array<{
    type?: string;
    name?: string;
    legendText?: string;
    showInLegend?: boolean;
    dataPoints?: Array<{
      label: string;
      y: number;
    }>;
    axisYType?: string;
  }>;
}
