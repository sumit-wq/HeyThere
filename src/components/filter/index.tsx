import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '../../theme/defaultColor';

const windowWidth = Dimensions.get('window').width;

interface DistanceFilterModalProps {
  isVisible: boolean;
  selectedDistance: number;
  onApply: (distance: number) => void;
  onClose: () => void;
}

const DistanceFilterModal: React.FC<DistanceFilterModalProps> = ({
  isVisible,
  selectedDistance,
  onApply,
  onClose,
}) => {
  const [distance, setDistance] = useState(selectedDistance);

  const handleApply = () => {
    onApply(distance);
    onClose();
  };
  const handleClose = () => {
    setDistance(selectedDistance);
    onClose();
  };
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Distance (in km)</Text>
          <Slider
            style={[styles.slider, {width: windowWidth * 0.8}]} // Set the width to 90% of the display
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={distance}
            onValueChange={setDistance}
          />
          <Text style={styles.distanceText}>{distance} km</Text>
          <View style={styles.filterBtns}>
            <TouchableOpacity style={styles.applyButton} onPress={handleClose}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    alignSelf: 'center',
  },
  distanceText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  applyButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  filterBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default DistanceFilterModal;
