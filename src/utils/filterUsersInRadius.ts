import { UserData } from "../view/map";
import { generateAvatarData } from "./avatarSelection";


const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number | string,
  lon2: number | string
) => {
  const earthRadiusInKm = 6371; // Earth's radius in kilometers
  const dLat = ((+lat2 - lat1) * Math.PI) / 180;
  const dLon = ((+lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((+lat1 * Math.PI) / 180) *
      Math.cos((+lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusInKm * c;
  return distance;
};

export type MarkerConfig = {
  coords: [number, number];
  color: string;
  nameInitial: string;
  xuserId: string;
};

const getPointsWithinRadius = (
  centerLatitude: number,
  centerLongitude: number,
  radiusInKm: number,
  users: UserData[]
): MarkerConfig[] => {
  const pointsWithinRadius: MarkerConfig[] = [];

  for (const user of users) {
    const { latitude, longitude, name, xuserId } = user;
    if (
      (typeof latitude === 'number' || typeof latitude === 'string') &&
      (typeof longitude === 'number' || typeof longitude === 'string')
    ) {
      const distance = haversineDistance(
        centerLatitude,
        centerLongitude,
        +latitude,
        +longitude
      );

      if (distance <= radiusInKm) {
        // Extract the first letter of the name for the avatar
        const nameInitial = name.charAt(0).toUpperCase();
        const avatar = generateAvatarData(nameInitial)
        pointsWithinRadius.push({
          coords: [+longitude, +latitude],
          color: avatar.color,
          nameInitial: avatar.initials,
          xuserId
        });
      }
    }
  }

  return pointsWithinRadius;
};

export { getPointsWithinRadius };