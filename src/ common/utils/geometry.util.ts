import proj4 from 'proj4';

// Define the coordinate systems
// Arc1960 / UTM zone 37S (Common in Kenya)
const ARC1960_EPSG_21037 =
  '+proj=utm +zone=37 +south +ellps=clrk80 +towgs84=-160,-6,-302,0,0,0,0 +units=m +no_defs';
// WGS84 (Standard GPS/Google Maps)
const WGS84 = '+proj=longlat +datum=WGS84 +no_defs';

export class GeometryUtil {
  /**
   * Converts a generic [x, y] point from Kenyan Arc1960 to GPS WGS84.
   * Useful when sellers upload survey plans.
   */
  static convertArc1960ToWGS84(
    easting: number,
    northing: number,
  ): [number, number] {
    // proj4 returns [longitude, latitude]
    return proj4(ARC1960_EPSG_21037, WGS84, [easting, northing]);
  }

  /**
   * Calculates the approximate center (centroid) of a Polygon.
   * Useful for placing the "Pin" on the map preview.
   */
  static getCentroid(coordinates: number[][]): { lat: number; lng: number } {
    let x = 0;
    let y = 0;
    const len = coordinates.length;

    coordinates.forEach((coord) => {
      x += coord[0]; // Longitude
      y += coord[1]; // Latitude
    });

    return { lng: x / len, lat: y / len };
  }
}
