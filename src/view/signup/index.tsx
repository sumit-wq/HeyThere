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
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {SCREENS} from '../../navigations/navigationRoutes';
import {useNavigation} from '@react-navigation/native';
import {useAsyncStorage, ASYNC_ENUM} from '../../hooks/useAsyncStorage';
import {useGeolocation} from '../../hooks/useLocation';
import {useSignupForm, initialData} from '../../hooks/useSignupForm';

type SignupProps = {};

const Signup: React.FC<SignupProps> = (props: SignupProps) => {
  const [, updateStorageItem] = useAsyncStorage(ASYNC_ENUM.X_USER_ID);
  const [, , getLocation] = useGeolocation();
  const navigation = useNavigation();

  const {formData, setFormData, errors, validateForm} = useSignupForm();

  const registerUser = async () => {
    try {
      const locationData = await getLocation();
      const xuserId: string = uuid.v4();

      // Remove "confirmPassword" field from the formData
      const {confirmPassword, ...formDataWithoutConfirmPassword} = formData;

      const dataToSave: {[key: string]: string | number} = {
        xuserId: xuserId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        ...Object.fromEntries(
          Object.entries(formDataWithoutConfirmPassword).map(([key, value]) => [
            key,
            value.toString(),
          ]),
        ),
      };

      // Check if a user with the same mobile number already exists
      const phoneNumber = formData.phoneNumber.trim();

      const querySnapshot = await firestore()
        .collection('users')
        .where('phoneNumber', '==', phoneNumber)
        .get();

      if (!querySnapshot.empty) {
        // User with the same mobile number already exists
        Alert.alert('A user with the same mobile number already exists.');
        return;
      }

      // Save the new user data to Firestore if no existing user with the same mobile number
      await firestore().collection('users').doc(xuserId).set(dataToSave);

      setFormData(initialData);
      await updateStorageItem(xuserId);
      navigation.navigate(SCREENS.MAP);
    } catch (error) {
      Alert.alert('Something went wrong, unable to signup');
    }
  };

  const handleSubmitForm = () => {
    if (validateForm()) {
      registerUser();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Signup Screen</Text>
      <TextInput
        placeholder="Enter Name"
        style={[styles.textInput, errors.name && styles.errorInput]}
        onChangeText={text =>
          setFormData(prevState => ({...prevState, name: text}))
        }
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Enter Number"
        style={[styles.textInput, errors.phoneNumber && styles.errorInput]}
        keyboardType="phone-pad"
        onChangeText={text =>
          setFormData(prevState => ({...prevState, phoneNumber: text}))
        }
      />
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      )}

      <TextInput
        placeholder="Enter Password"
        style={[styles.textInput, errors.password && styles.errorInput]}
        secureTextEntry
        onChangeText={text =>
          setFormData(prevState => ({...prevState, password: text}))
        }
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TextInput
        style={[styles.textInput, errors.confirmPassword && styles.errorInput]}
        placeholder="Enter Confirm Password"
        secureTextEntry
        onChangeText={text =>
          setFormData(prevState => ({...prevState, confirmPassword: text}))
        }
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <Button title="Sign Up" onPress={handleSubmitForm} />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Or Login</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  errorText: {
    color: 'red',
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
    borderColor: 'red',
  },
});

export {Signup};
