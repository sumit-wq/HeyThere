import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import colors from '../../theme/defaultColor';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigations/navigationRoutes';
import firestore from '@react-native-firebase/firestore';
import {useAsyncStorage, ASYNC_ENUM} from '../../hooks/useAsyncStorage';
import {updateUserInformation} from '../../hooks/useUpdateUser';
import {useGeolocation} from '../../hooks/useLocation';

const initialData = {
  phoneNumber: '',
  password: '',
};

function Login() {
  const [loginData, setLoginData] = useState({
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    password?: string;
  }>({});
  const [storageItem, updateStorageItem, clearStorageItem] = useAsyncStorage(
    ASYNC_ENUM.X_USER_ID,
  );
  const [location, error, getLocation] = useGeolocation();

  const navigation = useNavigation();

  const handleNavigateToSignup = () => {
    setLoginData(initialData);
    navigation.navigate(SCREENS.SIGNUP);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!loginData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Number should not be empty';
    }

    if (!loginData.password.trim()) {
      newErrors.password = 'Password should not be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleUpdateCurrentLocation(xuserId: string, userData: any) {
    try {
      const locationData = await getLocation();
      if (locationData) {
        const {latitude, longitude} = locationData;
        await updateUserInformation(xuserId, {
          latitude,
          longitude,
          ...userData._data,
        });
      }
    } catch {
      Alert.alert('Something went wrong in location access');
    }
  }

  const loginUser = (formData: typeof loginData) => {
    firestore()
      .collection('users')
      .where('phoneNumber', '==', formData.phoneNumber)
      .get()
      .then(async res => {
        if (res?.docs && res?.docs[0]) {
          const {xuserId, password: storedPassword} = res?.docs[0]._data;
          if (formData.password === storedPassword) {
            await handleUpdateCurrentLocation(xuserId, res?.docs[0]);
            await updateStorageItem(xuserId);
            navigation.navigate(SCREENS.MAP);
          } else {
            Alert.alert('Incorrect password. Please try again.');
          }
        } else {
          Alert.alert('User not found=>');
        }
      })
      .catch(err => Alert.alert('User not found'));
  };

  const handleSubmitForm = () => {
    if (validateForm()) {
      loginUser(loginData);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.txt}>Login Screen</Text>
        <TextInput
          placeholder="Enter Number"
          style={[styles.textInput, errors.phoneNumber && styles.errorInput]}
          keyboardType="phone-pad"
          onChangeText={text =>
            setLoginData(prevState => ({...prevState, phoneNumber: text}))
          }
          value={loginData.phoneNumber}
        />
        {errors.phoneNumber ? (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        ) : null}
        <TextInput
          placeholder="Enter Password"
          style={[styles.textInput, errors.password && styles.errorInput]}
          secureTextEntry
          onChangeText={text =>
            setLoginData(prevState => ({...prevState, password: text}))
          }
          value={loginData.password}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
        <Button title="Login" onPress={handleSubmitForm} />
        <TouchableOpacity
          style={{marginTop: 24}}
          onPress={handleNavigateToSignup}>
          <Text style={styles.txtSmall}>Or Signup</Text>
          <Text style={styles.underline}></Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // Adjust this value based on the height of your bottom tab navigator
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 25,
    marginBottom: 12,
  },
  errorText: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 0.2,
    width: Dimensions.get('window').width - 30,
    height: 48,
    borderRadius: 2,
    borderStyle: 'solid',
    borderColor: colors.primary,
    paddingHorizontal: 4,
    marginBottom: 10,
    paddingLeft: 12,
  },
  errorInput: {
    color: colors.error,
  },
  txtSmall: {
    fontSize: 12,
  },
  underline: {
    marginTop: -5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export {Login};
