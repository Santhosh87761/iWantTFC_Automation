export enum Platform {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
  TV = "TV"
}

export class PlatformHelper {

  static getCurrentPlatform(): Platform {

    if ((driver as any).isAndroid) return Platform.ANDROID

    if ((driver as any).isIOS) return Platform.IOS

    return Platform.WEB
  }

}
