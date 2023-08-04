import {useEffect, useState, useCallback} from 'react';
import Geolocation, {
  GeolocationOptions,
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {Alert, Linking, Platform} from 'react-native';

type LocationData = GeolocationResponse | null;
type ErrorType = GeolocationError | null;

const useLocationTracking = (): [
  LocationData,
  ErrorType,
  boolean,
  () => void,
] => {
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const checkLocationPermission = async () => {
    try {
      const status = await checkLocationPermissionStatus();
      if (status === 'granted') {
        setPermissionGranted(true);
      } else if (status === 'denied') {
        requestLocationPermission();
      } else if (status === 'blocked') {
        setError(new Error('Location permission blocked'));
      }
    } catch (error) {
      setError(error);
    }
  };

  const checkLocationPermissionStatus = async () => {
    return await Geolocation.requestAuthorization();
  };

  const requestLocationPermission = async () => {
    try {
      const status = await Geolocation.requestAuthorization();
      if (status === 'granted') {
        setPermissionGranted(true);
      } else if (status === 'denied') {
        setError(new Error('Location permission denied'));
      } else if (status === 'blocked') {
        // Location permission is blocked, show an alert and guide the user to settings
        setError(new Error('Location permission blocked'));
        showSettingsAlert();
      }
    } catch (error) {
      setError(error);
    }
  };

  const showSettingsAlert = () => {
    Alert.alert(
      'Location Permission Blocked',
      'To use this app, you need to enable location permission. Please go to Settings and allow location access.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const getLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLocationData(position.coords);
        setError(null);
      },
      error => {
        setError(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  return [locationData, error, permissionGranted, getLocation];
};

export {useLocationTracking};
