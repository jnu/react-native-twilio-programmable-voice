import {
    NativeModules,
    NativeEventEmitter,
    Platform,
} from 'react-native'

const ANDROID = 'android'
const IOS = 'ios'

const TwilioVoice = NativeModules.RNTwilioVoice

const NativeAppEventEmitter = new NativeEventEmitter(TwilioVoice)

const _eventHandlers = {
    deviceReady: new Map(),
    deviceNotReady: new Map(),
    deviceDidReceiveIncoming: new Map(),
    connectionDidConnect: new Map(),
    connectionIsReconnecting: new Map(),
    connectionDidReconnect: new Map(),
    connectionDidDisconnect: new Map(),
    callStateRinging: new Map(),
    callInviteCancelled: new Map(),
    callRejected: new Map(),
}

// Function to fetch a token from the server.
let tokenFetcher = () => Promise.resolve('');

NativeAppEventEmitter.addListener('requestAccessToken', async () => {
  const token = await tokenFetcher();
  if (!token) {
    console.warn('[TwilioVoice] Failed to get access token');
    return;
  }

  await TwilioVoice.continueWithToken(token);
});

const Twilio = {
    // Set the access token fetcher function, but don't register device.
    setAccessTokenFetcher(fn) {
      tokenFetcher = fn;
    },
    // Set the access token fetcher function and use it to register this device.
    async registerWithTokenFunction(fn) {
      this.setAccessTokenFetcher(fn);
      const token = await tokenFetcher();
      return this.registerWithToken(token);
    },
    // initialize the library with Twilio access token
    // return {initialized: true} when the initialization started
    // Listen to deviceReady and deviceNotReady events to see whether
    // the initialization succeeded
    async registerWithToken(token) {
        if (typeof token !== 'string') {
            return {
                initialized: false,
                err:         'Invalid token, token must be a string'
            }
        };

        const result = await TwilioVoice.registerWithToken(token)
        // native react promise present only for Android
        // iOS initWithAccessToken doesn't return
        if (Platform.OS === IOS) {
            return {
                initialized: true,
            }
        }
        return result
    },
    connect(params = {}) {
        TwilioVoice.connect(params)
    },
    disconnect: TwilioVoice.disconnect,
    accept() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.accept()
    },
    reject() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.reject()
    },
    ignore() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.ignore()
    },
    setMuted: TwilioVoice.setMuted,
    setSpeakerPhone: TwilioVoice.setSpeakerPhone,
    sendDigits: TwilioVoice.sendDigits,
    hold: TwilioVoice.setOnHold,
    requestPermissions(senderId) {
        if (Platform.OS === ANDROID) {
            TwilioVoice.requestPermissions(senderId)
        }
    },
    getActiveCall: TwilioVoice.getActiveCall,
    getCallInvite: TwilioVoice.getCallInvite,
    configureCallKit(params = {}) {
        if (Platform.OS === IOS) {
            TwilioVoice.configureCallKit(params)
        }
    },
    unregister() {
        if (Platform.OS === IOS) {
            TwilioVoice.unregister()
        }
    },
    addEventListener(type, handler) {
        if (!_eventHandlers.hasOwnProperty(type)) {
            throw new Error('Event handler not found: ' + type)
        }
        if (_eventHandlers[type])
        if (_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].set(handler, NativeAppEventEmitter.addListener(type, rtn => { handler(rtn) }))
    },
    removeEventListener(type, handler) {
        if (!_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].get(handler).remove()
        _eventHandlers[type].delete(handler)
    }
}

export default Twilio
