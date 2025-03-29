import React, { useEffect, useState  ,useRef } from 'react';
import { NavigationProp } from '@react-navigation/native'
import {StyleSheet ,TouchableOpacity , View, Text , Button ,Image } from 'react-native'
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

interface RouterProps {
    navigation : NavigationProp<any, any>;
}
const FaceScan = ({navigation} : RouterProps) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<Camera | null>(null); // สร้าง reference สำหรับกล้อง
    const [isCameraActive, setIsCameraActive] = useState(true); // ใช้ state เพื่อควบคุมการแสดงกล้อง
    const [photoUri, setPhotoUri] = useState<string | null>(null); // state สำหรับเก็บ URI ของภาพ


      
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    function toggleCameraFacing() {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo taken:', photo.uri);
            setPhotoUri(photo.uri); // เก็บ URI ของภาพใน state
            Alert.alert('Photo Taken', 'Your photo has been taken successfully!\nImage URI: ${photo.uri}');
            // คุณสามารถส่ง `photo.uri` หรือข้อมูลอื่น ๆ ไปหน้าอื่นได้
        } else {
            Alert.alert('Error', 'Unable to take photo.');
        }
        
    };

    const closeCamera = () => {
        setIsCameraActive(false); // ซ่อนกล้องเมื่อกด "ปิด"
        navigation.goBack(); // หรือจะใช้ navigation ไปยังหน้าก่อนหน้า
    };
    const uploadImage = async (uri: string) => {
        const formData = new FormData();
        const response = await fetch(uri);
        const blob = await response.blob(); // แปลง URI เป็น blob
    
        formData.append('file', blob, 'image.jpg'); // ใช้ 'file' เป็นชื่อฟิลด์ที่ API ต้องการ
    
        try {
          const uploadResponse = await fetch('https://your-api-endpoint.com/upload', {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data', // ระบุ Content-Type เป็น multipart/form-data
            },
          });
    
          const result = await uploadResponse.json(); // ดึงผลลัพธ์จาก server
          console.log('Upload successful', result);
          Alert.alert('Upload Successful', 'Image uploaded successfully!');
        } catch (error) {
          console.error('Upload failed:', error);
          Alert.alert('Error', 'Image upload failed');
        }
      };
    
  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>กลับ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.text}>ถ่ายภาพ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={closeCamera}>
                    <Text style={styles.text}>ปิด</Text>
                </TouchableOpacity>
            </View>
        </CameraView>
        {/* แสดงภาพที่ถ่าย */}
      {photoUri && (
        <View style={styles.photoContainer}>
          <Text style={styles.text}>ภาพที่ถ่าย</Text>
          <TouchableOpacity style={styles.buttonUpload} onPress={() => uploadImage(photoUri)}>
            <Text style={styles.textUpload}>อัปโหลดภาพ</Text>
          </TouchableOpacity>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          
        </View>
      )}
  </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
      color: '#000',
     
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    textUpload: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
      },
    photoContainer: {
        position: 'relative',
        alignItems: 'center',
        marginTop: 20,
    },photo: {
        width: 300,
        height: 300,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 50,
    },
    buttonUpload: {
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'center',
        color: '#000',
        right: 10,
       
      }
  });
export default FaceScan