import React, { useEffect, useState  ,useRef } from 'react';
import { NavigationProp } from '@react-navigation/native'
import {StyleSheet ,TouchableOpacity , View, Text , Button ,Image , ActivityIndicator  } from 'react-native'
import { Alert } from 'react-native';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { getAuth } from 'firebase/auth';
import { FIREBASE_AUTH , FIREBASE_DB } from '../../FirebaseConfig';
import { collection, getDocs , where ,query ,setDoc , doc , addDoc} from 'firebase/firestore';

import * as FileSystem from 'expo-file-system';
import FaceRecognitionPolicyModal from '../../component/FaceRecognitionPolicyModal';
interface RouterProps {
    navigation : NavigationProp<any, any>;
}
const FaceScan = ({navigation} : RouterProps) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<Camera | null>(null); // สร้าง reference สำหรับกล้อง
    const [isCameraActive, setIsCameraActive] = useState(true); // ใช้ state เพื่อควบคุมการแสดงกล้อง
    const [photoUri, setPhotoUri] = useState<string | null>(null); // state สำหรับเก็บ URI ของภาพ
    const [userId, setUserId] = useState<string | null>(null); // state สำหรับเก็บ userId
    const canvasRef = useRef(null);
    const [base64Image, setBase64Image] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true); // state สำหรับ modal

    const [showPolicyModal, setShowPolicyModal] = useState(true); // Show modal immediately
    

    const handlePolicyAccept = () => {
      setShowPolicyModal(false);
      handleSetDataPolicyAccept(); // Call the function to set data policy acceptance
    };

    const handleSetDataPolicyAccept = async () => {
      await addDoc(collection(FIREBASE_DB, 'Consent_Log'), {
        consentGiven: true,
        consentType: "biometric",
        policyVersion: "1.0",
        timestamp : new Date(),
        user_id: userId,
      });
      // const q = query(
      //   collection(FIREBASE_DB, 'Consent_Log'),
      //   where('user_id', '==', userId)
      // );
    
      // const querySnapshot = await getDocs(q);
    
      // if (querySnapshot.empty) {
      //   alert('❌ ข้อมูลการยินยอมนี้มีอยู่แล้วในฐานข้อมูล');
      //   return;
      // }else {
      //   alert('❌ ข้อมูลการยินยอมนี้มีอยู่แล้วในฐานข้อมูล');
        
      // }
    }



    const handlePolicyDecline = () => {
      // Redirect to login if they decline the policy
      FIREBASE_AUTH.signOut()
    };

    const getUserIdByEmail = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
          alert('❌ ยังไม่มีผู้ใช้ login อยู่');
          return null;
        }
      
        const q = query(
          collection(FIREBASE_DB, 'user_id'),
          where('email', '==', user.email)
        );
      
        const querySnapshot = await getDocs(q);
      
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userId = userDoc.id; // ✅ นี่คือ Document ID
          setUserId(userId); // เก็บ userId ใน state
        }
    }

    useEffect(()  => {
      getUserIdByEmail();
    }, [])
    


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
            // Alert.alert('Photo Taken', 'Your photo has been taken successfully!\nImage URI: ${photo.uri}');
            // คุณสามารถส่ง `photo.uri` หรือข้อมูลอื่น ๆ ไปหน้าอื่นได้
        } else {
            Alert.alert('Error', 'Unable to take photo.');
        }
        
    };

    const closeCamera = () => {
      setIsCameraActive(false); // ซ่อนกล้องเมื่อกด "ปิด"
      navigation.navigate('home'); // หรือจะใช้ navigation ไปยังหน้าหลัก
    };

    // useEffect(() => {
    //   const drawImage = async (canvas) => {
    //     const context = canvas.getContext('2d');
    //     const img = new Image();
    //     img.src = photoUri;
        
    //     img.onload = () => {
    //       context.drawImage(img, 0, 0);  // วาดภาพลงบน canvas
    //       // แปลง canvas เป็น base64
    //       const base64 = canvas.toDataURL();  // ได้ผลลัพธ์เป็น base64 string
    //       setBase64Image(base64);  // เก็บ base64 ใน state
    //     };
    //   };
  
    //   if (canvasRef.current) {
    //     drawImage(canvasRef.current);
    //   }
    // }, [photoUri]);

    const uriToBase64 = async (uri: string): Promise<string> => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    };

    const uploadImage = async (uri: string) => {
      try {
        setLoading(true);
        // const base64 = await uriToBase64(uri_send);

        const fileName = uri.split('/').pop() ?? 'image.jpg';
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
    
        const formData = new FormData();
        console.log(userId);
        formData.append('user_id', userId); // เพิ่ม user_id
        formData.append('file', {
          uri,
          name: fileName,
          type,
        } as any); 

        
        // formData.append('image', blob, 'image.jpg');
        // formData.append('file', blob, 'image.jpg'); // เพิ่มไฟล์ใน FormData
        // formData.append('image', `data:image/jpeg;base64,${base64}`);
    
        const uploadResponse = await fetch('http://192.168.1.121:8000/register_face_emp/', {
          method: 'POST',
          
          body: formData,
        });
        console.log('Response:', uploadResponse);
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
    
        const result = await uploadResponse.json();
        if (result.message === 'success') {
          Alert.alert('Success', 'สร้างใบหน้าเสร็จสิ้นแล้ว');
          navigation.navigate('home'); // เปลี่ยนไปยังหน้าหลักหลังจากอัปโหลดเสร็จ
        }else{
          Alert.alert('Error', 'ไม่สามารถสร้างใบหน้าได้ กรุณาลองใหม่อีกครั้ง');
        }
        setLoading(false);
      } catch (error) {
        console.error('Upload failed:', error);
        Alert.alert('Error');
        setLoading(false);
      }
      };
  
  return (
    <View style={styles.container}>
      <FaceRecognitionPolicyModal
          visible={showPolicyModal}
          onAccept={handlePolicyAccept}
          onDecline={handlePolicyDecline}
        />
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // Android back button
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
            <ScrollView >
              <Text style={styles.headerMessage}>นโยบายความเป็นส่วนตัวเกี่ยวกับการจัดเก็บข้อมูลใบหน้า</Text>
              <Text style={styles.midMessage}>วัตถุประสงค์ในการเก็บข้อมูล</Text>
              
              <Text style={styles.smallMessage}>เรามีการจัดเก็บข้อมูลใบหน้าของท่านเพื่อใช้ในการยืนยันตัวตน การลงทะเบียนเข้าใช้งานระบบ และเพิ่มความปลอดภัยในการใช้งาน โดยข้อมูลใบหน้าของท่านจะถูกใช้เฉพาะตามวัตถุประสงค์ที่แจ้งไว้เท่านั้น ไม่มีการใช้เพื่อวัตถุประสงค์อื่นใดโดยไม่ได้รับอนุญาตจากท่าน</Text>
              
              <Text style={styles.midMessage}>ข้อมูลที่เราเก็บรวบรวม</Text>
              <Text style={styles.smallMessage}>1. รูปภาพหรือวิดีโอของใบหน้าเพื่อใช้ในการระบุหรือยืนยันตัวตน</Text>
              <Text style={styles.smallMessage}>2. ข้อมูลโครงสร้างใบหน้า (facial landmarks) ซึ่งระบบจะใช้ในการจดจำใบหน้า</Text>
              

              <Text style={styles.midMessage}>วิธีการเก็บข้อมูล</Text>
              <Text style={styles.smallMessage}>ข้อมูลใบหน้าของท่านจะถูกเก็บผ่านระบบสแกนใบหน้า หรือการอัปโหลดภาพจากอุปกรณ์ของท่านเอง โดยเราจะดำเนินการเข้ารหัสข้อมูล (encryption) เพื่อความปลอดภัยและป้องกันการเข้าถึงจากบุคคลที่ไม่ได้รับอนุญาต</Text>

              <Text style={styles.midMessage}>การจัดเก็บและระยะเวลา</Text>
              <Text style={styles.smallMessage}>ข้อมูลใบหน้าของท่านจะถูกจัดเก็บอย่างปลอดภัยในฐานข้อมูลที่มีการควบคุมการเข้าถึงอย่างเคร่งครัด โดยจะถูกเก็บไว้เฉพาะในช่วงระยะเวลาที่ท่านยังคงใช้งานบริการหรือจนกว่าท่านจะแจ้งยกเลิกหรือถอนความยินยอม และเราจะดำเนินการลบข้อมูลใบหน้าของท่านทันทีเมื่อหมดวัตถุประสงค์ในการใช้งาน</Text>
              
              <Text style={styles.midMessage}>การเปิดเผยข้อมูลต่อบุคคลที่สาม</Text>
              <Text style={styles.smallMessage}>เราจะไม่เปิดเผยข้อมูลใบหน้าของท่านให้แก่บุคคลภายนอกหรือองค์กรอื่น เว้นแต่จะได้รับความยินยอมจากท่านเป็นลายลักษณ์อักษร หรือเป็นกรณีที่จำเป็นตามข้อกฎหมายเท่านั้น</Text>

              <Text style={styles.midMessage}>สิทธิของเจ้าของข้อมูล</Text>
              <Text style={styles.smallMessage}>1. ท่านมีสิทธิที่จะขอเข้าถึงข้อมูลของท่านเองได้ทุกเมื่อ</Text>
              <Text style={styles.smallMessage}>2. ท่านสามารถขอให้มีการแก้ไข อัปเดต หรือเปลี่ยนแปลงข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์ได้</Text>
              <Text style={styles.smallMessage}>3. ท่านมีสิทธิขอถอนความยินยอมในการจัดเก็บข้อมูลใบหน้าของท่านได้ทุกเมื่อ</Text>

              <Text style={styles.midMessage}>ช่องทางติดต่อสอบถาม</Text>
              <Text style={styles.smallMessage}>หากท่านมีข้อสงสัยเกี่ยวกับการจัดเก็บข้อมูลใบหน้าของท่าน หรือต้องการใช้สิทธิของเจ้าของข้อมูล สามารถติดต่อได้ที่ : </Text>
              <Text style={styles.smallMessage}>อีเมล: Ecos@EcoCycle.com</Text>
              <Text style={styles.smallMessage}>เบอร์โทรศัพท์: 02-888-2999</Text>

              <Text style={styles.smallMessage}>ทางเราขอขอบคุณที่ท่านไว้วางใจและให้ความร่วมมือในการดูแลข้อมูลส่วนบุคคลของท่าน</Text>

              <Text style={styles.smallMessage}>การให้ความยินยอม

ข้าพเจ้าได้อ่าน ทำความเข้าใจ และยินยอมให้มีการจัดเก็บและใช้ข้อมูลใบหน้าตามรายละเอียดในนโยบายฉบับนี้ โดยสมัครใจ ไม่มีการบังคับ หรือถูกชักจูงแต่อย่างใด

[  ] ข้าพเจ้ายินยอมให้เก็บข้อมูลใบหน้า</Text>

              <Button title="Close" onPress={() => setModalVisible(false)} />
              </ScrollView>
            </View>
          </View>
        </Modal> */}
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
        {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
        {/* แสดงภาพที่ถ่าย */}
        
      {photoUri && (
        // <View style={styles.photoContainer}>
          
        //   <TouchableOpacity style={styles.topBar} onPress={() => uploadImage(photoUri)}>
        //     <Text style={styles.textUpload}>อัปโหลดภาพ</Text>
        //   </TouchableOpacity>
        //   <Image source={{ uri: photoUri }} style={styles.photo} />
          
        // </View>
        <View style={styles.container_photo}>
        {/* Top Bar */}
          <TouchableOpacity style={styles.topBar} onPress={() => uploadImage(photoUri)}>
            <Text style={styles.topBarSmallBox}>อัปโหลดภาพ</Text>
          </TouchableOpacity>
  
        {/* Main Content Area */}
          <View style={styles.contentBox}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
          </View>
      </View>
        
      )}
  </View>
  )
}
const styles = StyleSheet.create({
  headerMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ba0900',
    paddingBottom: 10,
  },midMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 10,
  },smallMessage: {
    fontSize: 14,
    color: '#000',
    paddingBottom: 10,
  },
  modalBackground: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: "90%", 
    paddingTop: 60, 
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white', 
    borderRadius: 10,
    height: '90%',
  },
  container_photo: {
    flex: 0.8,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  topBar: {
    height: 60,
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5,
  },
  topBarSmallBox: {
    width: '30%',
    height: '100%',
    color: '#000',
    textAlign: 'center',
    padding : 10,
    color: '#ba0900',
    fontSize: 18,
    fontWeight: 'bold',
    
    
    // backgroundColor: 'black',
  },
  contentBox: {
    flex: 1,
    // backgroundColor: 'gray',
    
    alignItems: 'center',
  },
    container: {
      flex: 1,
      justifyContent: 'center',
      
      backgroundColor: '#181818',
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
      color: '#fff',
    },
    textUpload: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
      },
    photoContainer: {
        position: 'relative',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
    },photo: {
        width: 300,
        height: 300,
        borderRadius: 10,

    },
    buttonUpload: {
        position: 'absolute',
        alignSelf: 'flex-end',
        alignItems: 'center',
        color: '#000',
        right: 10,
       
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width : '100%',
        height : '100%',

        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });
  
export default FaceScan