import { Injectable } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  async getCityFromCoordinates(latitude: number, longitude: number): Promise<string> {
    return 'Cairo';
  }
}
