import {useState, useEffect, useCallback} from 'react';
import Geolocation, {
  GeolocationOptions,
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';

type Location = GeolocationResponse['coords'] | null;
type Error = GeolocationError | null;

const useGeolocation = (): [
  Location,
  Error,
  () => Promise<Location | null>,
] => {
  const [location, setLocation] = useState<Location>(null);
  const [error, setError] = useState<Error>(null);

  const getLocation = useCallback((): Promise<Location | null> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position.coords);
          setError(null);
          resolve(position.coords);
        },
        error => {
          setError(error);
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return [location, error, getLocation];
};

export {useGeolocation};
