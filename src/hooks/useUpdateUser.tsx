import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

type UserData = {
  // Add other fields you want to update
};

const updateUserInformation = async (
  xuserId: string,
  userData: any,
): Promise<void> => {
  try {
    // Get a reference to the user document in Firestore
    const userRef = firestore().collection('users').doc(xuserId);
    // Update the user document with the new data
    await userRef.update(userData);
    // If the update is successful, show a success message
    Alert.alert('User information updated successfully');
  } catch (error) {
    // If there is an error, show an error message
    Alert.alert('Failed to update user information');
  }
};

export {updateUserInformation};
