import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Linking} from 'react-native';
import colors from '../../theme/defaultColor';
import {useLocationTracking} from '../../hooks/useLocationTracking';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigations/navigationRoutes';
import {ASYNC_ENUM} from '../../hooks/useAsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';

const Splash = () => {
  const navigation = useNavigation();
  const [loadingError, setLoadingError] = useState(false);

  const [location, locationError, permissionGranted, getLocation] =
    useLocationTracking();

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem(ASYNC_ENUM.X_USER_ID);
      if (!location && data) {
        const userDataSnapshot = await firestore()
          .collection('users')
          .doc(data)
          .get();
        if (userDataSnapshot.exists) {
          const userData = userDataSnapshot.data();
          const {latitude, longitude} = userData;
          await AsyncStorage.setItem(
            ASYNC_ENUM.LATITUDE,
            JSON.stringify(latitude),
          );
          await AsyncStorage.setItem(
            ASYNC_ENUM.LONGITUDE,
            JSON.stringify(longitude),
          );
        } else {
          // Handle case where the document doesn't exist
          Alert.alert('User data not found', 'Please try logging in again.');
          setLoadingError(true);
          return;
        }
      }

      if (!permissionGranted) {
        // Handle case where location permission is not granted
        Alert.alert(
          'Location Permission Required',
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
        setLoadingError(true);
        return;
      }

      navigation.navigate(SCREENS.MAP);
    } catch (error) {
      // Handle or log the error
      console.warn('Error while loading user data:', error);
      setLoadingError(true);
    }
  };

  useEffect(() => {
    getLocation(); // Call this to ensure we have the latest location
    loadUserData();
  }, [getLocation, navigation]);

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
