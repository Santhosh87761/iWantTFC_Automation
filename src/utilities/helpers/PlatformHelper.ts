// helpers/PlatformHelper.ts
import { Platform } from '../enum/Platform'

export class PlatformHelper {
  static getCurrentPlatform(): Platform {
    if (driver.isAndroid) return Platform.ANDROID
    if (driver.isIOS) return Platform.IOS
    return Platform.WEB
  }
}
