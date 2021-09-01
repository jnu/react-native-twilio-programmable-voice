#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNTwilioVoice : RCTEventEmitter <RCTBridgeModule>

- (void)initialize: (NSDictionary *)callKitParams;

- (void)initPushRegistry;

- (void)configureCallKit: (NSDictionary *)params;

@end
