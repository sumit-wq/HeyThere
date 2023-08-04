import React, {memo, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import colors from '../../theme/defaultColor';
import Mapbox, {Camera, MapView, MarkerView} from '@rnmapbox/maps';
import {useAsyncStorage, ASYNC_ENUM} from '../../hooks/useAsyncStorage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DistanceFilterModal from '../../components/filter';
import distanceFilterIcon from '../../../assets/icons/distanceFilterIcon.png';
import {
  getPointsWithinRadius,
  MarkerConfig,
} from '../../utils/filterUsersInRadius';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigations/navigationRoutes';

export type UserData = {
  xuserId: string;
  name: string;
  phoneNumber: string;
  email: string;
  latitude: number | string;
  longitude: number | string;
};

const Map = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState<number[]>([]);
  const [markers, setMarkers] = useState<MarkerConfig[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [anchor, setAnchor] = useState({x: 0.5, y: 0.5});
  const [allowOverlap, setAllowOverlap] = useState(true);
  // const [show, setShow] = useState(true);
  const [xuserId] = useAsyncStorage(ASYNC_ENUM.X_USER_ID);
  const [chattingUsers, setChattingUsers] = useState<UserData[]>([]);
  const [distanceFilterVisible, setDistanceFilterVisible] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(1);

  /****FIlter logic */

  const handleApplyDistanceFilter = (distance: number) => {
    // Update the selected distance
    setSelectedDistance(distance);
    // Apply the distance filter logic here based on the selected distance value
    // For example, filter the markers within the specified distance from the user's current location
  };

  const handleOpenDistanceFilter = () => {
    setDistanceFilterVisible(true);
  };

  const handleCloseDistanceFilter = () => {
    setDistanceFilterVisible(false);
  };

  const getChatUsers = useCallback(async () => {
    try {
      const res = await firestore()
        .collection('users')
        .where('xuserId', '!=', xuserId)
        .get();

      if (res?.docs && res?.docs) {
        const usersData: UserData[] = res.docs.map(
          doc => doc.data() as UserData,
        );

        setChattingUsers(usersData);
      }
    } catch (error) {
      Alert.alert('Something went wrong');
    }
  }, [xuserId]);

  useEffect(() => {
    getChatUsers();
  }, [getChatUsers]);

  useEffect(() => {
    Mapbox.setAccessToken(
      '', //Enter secret key
    );
  }, []);

  const handleChattingUsers = useCallback(async () => {
    const latitude = await AsyncStorage.getItem(ASYNC_ENUM.LATITUDE);
    const longitude = await AsyncStorage.getItem(ASYNC_ENUM.LONGITUDE);
    setCurrentLocation([+longitude, +latitude]);
    const nearByUsers = getPointsWithinRadius(
      +latitude,
      +longitude,
      selectedDistance,
      chattingUsers,
    );
    setMarkers(nearByUsers);
  }, [chattingUsers]);

  useEffect(() => {
    handleChattingUsers();
  }, [handleChattingUsers, chattingUsers]);

  const handleChatClick = (marker, index) => {
    navigation.navigate(SCREENS.CHATTING, {data: marker.xuserId, id: xuserId});
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={handleOpenDistanceFilter}
        style={styles.filterIconContainer}>
        <Image source={distanceFilterIcon} style={styles.filterIcon} />
      </TouchableOpacity>
      <MapView style={{flex: 1}}>
        <Camera
          defaultSettings={{centerCoordinate: currentLocation, zoomLevel: 14}}
          centerCoordinate={currentLocation}
          zoomLevel={14}
        />

        {markers.map((marker, i) => {
          return (
            <MarkerView
              key={`MarkerView-${marker.coords.join('-')}_${i}`}
              coordinate={marker.coords}
              anchor={anchor}
              allowOverlap={allowOverlap}
              style={{display: 'flex'}}>
              <TouchableOpacity
                style={[
                  styles.markerBox,
                  {backgroundColor: marker.color, padding: 4},
                ]}
                onPress={() => handleChatClick(marker, i)}>
                <Text style={styles.markerText}>{marker.nameInitial}</Text>
              </TouchableOpacity>
            </MarkerView>
          );
        })}
      </MapView>
      <DistanceFilterModal
        isVisible={distanceFilterVisible}
        selectedDistance={selectedDistance}
        onApply={handleApplyDistanceFilter}
        onClose={handleCloseDistanceFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 25,
  },
  btn: {},
  markerBox: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    borderRadius: 12,
    height: 24,
    width: 24,
    padding: 4,
    borderWidth: 0.5,
  },
  markerText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  filterIcon: {width: 32, height: 32, margin: 4},
  filterIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
});

export default memo(Map);
