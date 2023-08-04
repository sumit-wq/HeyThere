import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageItem = string | null;

export const enum ASYNC_ENUM {
  X_USER_ID = 'xuserId',
  LATITUDE = "latitude",
  LONGITUDE='longitude',

}

const useAsyncStorage = (key: string): [StorageItem, (data: StorageItem) => void, () => void] => {
  const [storageItem, setStorageItem] = useState<StorageItem>(null);

  async function getStorageItem() {
    try {
      const data = await AsyncStorage.getItem(key);
      setStorageItem(data);
    } catch (error) {
    }
  }

  async function updateStorageItem(data: StorageItem) {
    try {
      if (typeof data === 'string') {
        await AsyncStorage.setItem(key, data);
     
        setStorageItem(data);
      }
    } catch (error) {
      // Handle error if any
    }
  }

  async function clearStorageItem() {
    try {
      await AsyncStorage.removeItem(key);
      setStorageItem(null);
    } catch (error) {
      // Handle error if any
    }
  }

  useEffect(() => {
    getStorageItem(); // Call this function after the component mounts
  }, []);

  return [storageItem, updateStorageItem, clearStorageItem];
};

export  {useAsyncStorage};
