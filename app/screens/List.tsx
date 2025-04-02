import {StyleSheet ,TouchableOpacity , View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH , FIREBASE_DB } from '../../FirebaseConfig';
import { collection, getDocs , where ,query} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface RouterProps {
    navigation : NavigationProp<any, any>;
}

const list = ({navigation} : RouterProps) => {

    
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
       
      
          // console.log('✅ พบ user_id:', userId);

          checkUserIdInFaceEmbedding(userId);
          
        } else {
            FIREBASE_AUTH.signOut()
            navigation.goBack()
            // alert('❌ ไม่พบ email นี้ใน collection user_id');
            return null;
        }
      };

      const checkUserIdInFaceEmbedding = async (userIdToCheck) => {
        try {
            
          const q = query(
            collection(FIREBASE_DB, 'emp_face_embedding'),
            where('user_id', '==', userIdToCheck)
          );
          
      
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            // alert(`✅ พบ user_id "${userIdToCheck}" ใน emp_face_embedding`);
            return true;
          } else {
            // alert(`❌ ไม่พบ user_id "${userIdToCheck}" ใน emp_face_embedding`);
            alert('กรุณาลงทะเบียนใบหน้า');
            navigation.navigate('faceScan');
            
            return false;
          }
        } catch (error) {
          alert('เกิดข้อผิดพลาดในการตรวจสอบ user_id:'+ userIdToCheck);
          return false;
        }
      };
      

    useEffect(() => {
        getUserIdByEmail();
        
    }, [])

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.btnLogout}  onPress={() => navigation.navigate('details')}>
                <Text style={styles.btnTextLogout}>Detail.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnLogout}  onPress={() => FIREBASE_AUTH.signOut()}>
                <Text style={styles.btnTextLogout}>Logout</Text>
        </TouchableOpacity>
    </View>
  )
}

export default list

const styles = StyleSheet.create({
    container : {
        display : 'flex' ,
        justifyContent : 'center',
        alignItems : 'center'
    },
    btnText : {
        fontSize : 16 ,
        color : '#fff'
    },
    btnLogout : {
        // borderWidth : 1,
        borderColor : '#fff',
        width : "80%",
        display : 'flex',
        justifyContent : 'center' ,
        alignItems : 'center' ,
        height : 50 , 
        borderRadius : 10 , 
        marginTop : 10
    },
    btnTextLogout : {
        fontSize : 16 ,
        color : "green"
    }
    
})
