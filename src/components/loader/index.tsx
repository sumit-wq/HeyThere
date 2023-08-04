import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <Modal visible transparent>
      <View style={styles.modalView}>
        <View style={styles.mainView}>
          <ActivityIndicator size={'large'} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContents: 'center',
    alignContent: 'center',
    backgroundColor: 'gray',
  },
  mainView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContents: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
});
