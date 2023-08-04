import {useEffect, useState, useCallback} from 'react';
import Geolocation, {
  GeolocationOptions,
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {Alert, Linking, Platform} from 'react-native';

const useCurrentLocation = (): [
  GeolocationResponse | null,
  Error | null,
  boolean,
  () => void,
] => {
  const [locationData, setLocationData] = useState<GeolocationResponse | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const checkLocationPermission = async () => {
    try {
      const status = await checkLocationPermissionStatus();
      if (status === RESULTS.GRANTED) {
        setPermissionGranted(true);
      } else if (status === RESULTS.DENIED) {
        requestLocationPermission();
      } else if (status === RESULTS.BLOCKED) {
        setError(new Error('Location permission blocked'));
      }
    } catch (error) {
      setError(error);
    }
  };

  const checkLocationPermissionStatus = async () => {
    return await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );
  };

  const requestLocationPermission = async () => {
    try {
      const status = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      );
      if (status === RESULTS.GRANTED) {
        setPermissionGranted(true);
      } else if (status === RESULTS.DENIED) {
        setError(new Error('Location permission denied'));
      } else if (status === RESULTS.BLOCKED) {
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

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const performApiCall = useCallback(() => {
    // ... Your API call implementation ...
    if (locationData) {
      // Perform the API call with the location data
    }
  }, [locationData]);

  // Memoize the API call function using useCallback
  const memoizedPerformApiCall = useCallback(performApiCall, [locationData]);

  // Return the memoized function and other values
  return [locationData, error, permissionGranted, memoizedPerformApiCall];
};

export {useCurrentLocation};
