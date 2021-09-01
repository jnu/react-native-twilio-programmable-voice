// See: https://github.com/hoxfon/react-native-twilio-programmable-voice/issues/189
declare module "react-native-twilio-programmable-voice" {
    enum Event {
      deviceReady = "deviceReady",
      deviceNotReady = "deviceNotReady",
      callRejected = "callRejected",
      connectionDidConnect = "connectionDidConnect",
      callStateRinging = "callStateRinging",
      connectionIsReconnecting = "connectionIsReconnecting",
      connectionDidReconnect = "connectionDidReconnect",
      callInviteCancelled = "callInviteCancelled",
      deviceDidReceiveIncoming = "deviceDidReceiveIncoming",
      connectionDidDisconnect = "connectionDidDisconnect",
      proximity = "proximity",
      wiredHeadset = "wiredHeadset",
    }
    type EventType = keyof typeof Event;
    interface CallParams {
      To: string;
    }
    type CallState = "CONNECTED" | "ACCEPTED" | "CONNECTING" | "RINGING" | "DISCONNECTED" | "CANCELLED";
    type ActiveCall = Readonly<{
      call_sid: string;
      call_from: string;
      call_to: string;
      call_state: CallState;
      custom_params?: Record<string, string>;
    }>;
    type CallInvite = Readonly<{
      call_sid: string;
      call_from: string;
      call_to: string;
      custom_params: Record<string, string>;
    }>;
    type RingingCall = Readonly<{
      call_sid: string;
      call_from: string;
    }>;
    type TokenFn = () => Promise<string>;
    function accept(): void
    function connect<T extends CallParams>(params: T): void
    function disconnect(): void
    function getActiveCall(): Promise<ActiveCall>
    function getCallInvite(): Promise<CallInvite>
    function hold(holdValue: boolean): void
    function ignore(): void
    function setAccessTokenFetcher(tokenFn: TokenFn): void
    function registerWithTokenFunction(tokenFn: TokenFn): Promise<boolean>
    function registerWithToken(accessToken: string): Promise<boolean>
    function reject(): void
    function sendDigits(digits: string): void
    function setMuted(mutedValue: boolean): void
    function setSpeakerPhone(speakerEnabled: boolean): void
    function unregister(): void

    function addEventListener(type: EventType, cb: (value: any) => void): void
    function addEventListener(type: "deviceReady", cb: () => void): void
    function addEventListener(type: "deviceNotReady", cb: (value: { err: string }) => void): void
    function addEventListener(type: "callRejected", cb: (value: "callRejected") => void): void
    function addEventListener(type: "connectionDidConnect", cb: (value: ActiveCall) => void): void
    function addEventListener(type: "callStateRinging", cb: (value: RingingCall) => void): void
    function addEventListener(
        type:
            | "connectionIsReconnecting"
            | "connectionDidReconnect"
            | "callInviteCancelled"
            | "deviceDidReceiveIncoming",
        cb: (data: CallInvite) => void,
    ): void
    function addEventListener(
        type: "connectionDidDisconnect",
        cb: (
            data:
                | null
                | { err: string }
                | {
                      call_sid: string
                      call_state: CallState
                      call_from: string
                      call_to: string
                      err?: string
                  },
        ) => void,
    ): void
    function addEventListener(type: "proximity", cb: (data: { isNear: boolean }) => void): void
    function addEventListener(
        type: "wiredHeadset",
        cb: (data: { isPlugged: boolean; hasMic: boolean; deviceName: string }) => void,
    ): void

    function removeEventListener(type: EventType, cb: Function): void
}
