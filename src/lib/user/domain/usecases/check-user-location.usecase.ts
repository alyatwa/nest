import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckUserLocationUseCase {
  /**
   * Checks if the given latitude and longitude coordinates are within the geographical boundaries of Egypt.
   *
   * @param latitude - The latitude coordinate to check.
   * @param longitude - The longitude coordinate to check.
   * @returns `true` if the coordinates are within Egypt's boundaries, `false` otherwise.
   */
  execute(latitude: number, longitude: number): boolean {
    const egyptLatitudeRange = [22.0, 32.0];
    const egyptLongitudeRange = [24.0, 37.0];
    return (
      latitude >= egyptLatitudeRange[0] &&
      latitude <= egyptLatitudeRange[1] &&
      longitude >= egyptLongitudeRange[0] &&
      longitude <= egyptLongitudeRange[1]
    );
  }
}
