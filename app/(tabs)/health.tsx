import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';

import { styles } from '@/styles/(tabs)/health';

interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string;
  role: string;
  username: string;
  age?: number;
  cp?: number;
  exang?: number;
  sex?: number;
  trestbps?: number;
}

interface DropdownOption {
  label: string;
  value: number;
}

const cpOptions: DropdownOption[] = [
  { label: "Typical angina", value: 1 },
  { label: "Atypical angina", value: 2 },
  { label: "Non-anginal pain", value: 3 },
  { label: "Asymptomatic", value: 4 }
];

const exangOptions: DropdownOption[] = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 }
];

const sexOptions: DropdownOption[] = [
  { label: "Male", value: 1 },
  { label: "Female", value: 0 }
];

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: number | undefined;
  onSelect: (value: number) => void;
  placeholder: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  selectedValue, 
  onSelect, 
  placeholder, 
  disabled = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: number) => {
    onSelect(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.dropdownButton, disabled && styles.disabledInput]} 
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownText, 
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={[styles.dropdownArrow, disabled && styles.disabledText]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const HealthScreen: React.FC = () => {
  // Mock existing user data - simulate data from backend
  const mockUserData: UserData = {
    email: "songokupkj@gmail.com",
    id: 1,
    is_verified: true,
    phonenumber: "0865942420",
    role: "user",
    username: "songokupkj",
    age: 50,
    cp: 1,
    exang: 1,
    sex: 1,
    trestbps: 120
  };

  // Check if health data exists
  const hasHealthData = mockUserData.age !== undefined && 
                       mockUserData.cp !== undefined && 
                       mockUserData.exang !== undefined && 
                       mockUserData.sex !== undefined && 
                       mockUserData.trestbps !== undefined;

  // State management
  const [isEditing, setIsEditing] = useState(!hasHealthData);
  const [formData, setFormData] = useState({
    age: mockUserData.age?.toString() || '',
    cp: mockUserData.cp,
    exang: mockUserData.exang,
    sex: mockUserData.sex,
    trestbps: mockUserData.trestbps?.toString() || ''
  });

  const [originalData, setOriginalData] = useState({
    age: mockUserData.age?.toString() || '',
    cp: mockUserData.cp,
    exang: mockUserData.exang,
    sex: mockUserData.sex,
    trestbps: mockUserData.trestbps?.toString() || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.age || !formData.trestbps || 
        formData.cp === undefined || formData.exang === undefined || formData.sex === undefined) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate numeric inputs
    const age = parseInt(formData.age);
    const trestbps = parseInt(formData.trestbps);

    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert('Error', 'Please enter a valid age (1-120)');
      return;
    }

    if (isNaN(trestbps) || trestbps < 50 || trestbps > 300) {
      Alert.alert('Error', 'Please enter a valid blood pressure (50-300 mm Hg)');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Success', 
      hasHealthData ? 'Health data updated successfully!' : 'Health data submitted successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            setOriginalData({ ...formData });
          }
        }
      ]
    );
  };

  const isFormDisabled = hasHealthData && !isEditing;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Health Information</Text>
          <Text style={styles.description}>
            {hasHealthData 
              ? 'Review and update your health information' 
              : 'Please provide your health information for cardiovascular risk assessment'
            }
          </Text>

          <View style={styles.formContainer}>
            {/* Age Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age (years) *</Text>
              <TextInput
                style={[styles.input, isFormDisabled && styles.disabledInput]}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Enter your age"
                keyboardType="numeric"
                editable={!isFormDisabled}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Sex Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sex *</Text>
              <Dropdown
                options={sexOptions}
                selectedValue={formData.sex}
                onSelect={(value) => setFormData({ ...formData, sex: value })}
                placeholder="Select sex"
                disabled={isFormDisabled}
              />
            </View>

            {/* Chest Pain Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Chest Pain Type *</Text>
              <Dropdown
                options={cpOptions}
                selectedValue={formData.cp}
                onSelect={(value) => setFormData({ ...formData, cp: value })}
                placeholder="Select chest pain type"
                disabled={isFormDisabled}
              />
            </View>

            {/* Exercise Induced Angina Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Exercise Induced Angina *</Text>
              <Dropdown
                options={exangOptions}
                selectedValue={formData.exang}
                onSelect={(value) => setFormData({ ...formData, exang: value })}
                placeholder="Select exercise induced angina"
                disabled={isFormDisabled}
              />
            </View>

            {/* Resting Blood Pressure Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Resting Blood Pressure (mm Hg) *</Text>
              <TextInput
                style={[styles.input, isFormDisabled && styles.disabledInput]}
                value={formData.trestbps}
                onChangeText={(text) => setFormData({ ...formData, trestbps: text })}
                placeholder="Enter resting blood pressure"
                keyboardType="numeric"
                editable={!isFormDisabled}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {hasHealthData && !isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                      {hasHealthData ? 'Update' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                  
                  {hasHealthData && (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthScreen;