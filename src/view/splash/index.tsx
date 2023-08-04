import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import colors from '../../theme/defaultColor';
import {useCurrentLocation} from '../../hooks/useLocationTracking';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigations/navigationRoutes';
import {ASYNC_ENUM} from '../../hooks/useAsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PERMISSIONS, check} from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';

const Splash = () => {
  const navigation = useNavigation();
  const [loadingError, setLoadingError] = useState(false);

  const [location] = useCurrentLocation();
  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_ENUM.X_USER_ID);
      if (!location && data) {
        const userData = await firestore().collection('users').doc(data).get();
        const {latitude, longitude} = userData._data;
        await AsyncStorage.setItem(
          ASYNC_ENUM.LATITUDE,
          JSON.stringify(latitude),
        );
        await AsyncStorage.setItem(
          ASYNC_ENUM.LONGITUDE,
          JSON.stringify(longitude),
        );
      }

      const locationPermissionStatus = await checkLocationPermissionStatus();
      navigation.navigate(
        locationPermissionStatus ? SCREENS.MAP : SCREENS.LOGIN,
        {location: location},
      );
    } catch (error) {
      // Handle or log the error
      console.warn('Error while loading user data:', error);
      setLoadingError(true);
    }
  };

  const checkLocationPermissionStatus = async () => {
    try {
      return await check(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      );
    } catch (error) {
      // Handle or log the error
      console.warn('Error while checking location permission status:', error);
      setLoadingError(true);
      return false; // Return a default value or handle the error state accordingly
    }
  };

  useEffect(() => {
    loadUserData();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loadingError ? (
        <Text style={styles.errorText}>
          Error while loading data. Please try again later.
        </Text>
      ) : (
        <Text style={styles.txt}>{'Hey👋👋👋 \n There'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {fontSize: 30, color: colors.white},
  errorText: {fontSize: 18, color: colors.error, textAlign: 'center'},
});

export {Splash};
