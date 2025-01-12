export const internalEventName = "internal-event";
export type InternalEventDetails = {
  dragged?: {
    deltaX: number;
    deltaY: number;
  };
  hide?: boolean;
};
