import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { FIREBASE_AUTH , FIREBASE_DB } from '../../FirebaseConfig';
import { collection, getDocs , where ,query} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const Details = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const checkUserExists = async (email) => {
      const q_email = query(
        collection(FIREBASE_DB, 'emp_face_embedding'),
        where('user_id', '==', email)
      );

      const querySnapshot = await getDocs(q_email);
      if (!querySnapshot.empty) {
        console.log('✅ user_id นี้มีอยู่แล้วใน Firestore');
        const userDoc = querySnapshot.docs[0];
        // const userData = userDoc.data();
        const userId = userDoc.id;
        
        const q_user_id = query(
          collection(FIREBASE_DB, 'emp_face_embedding'),
          where('user_id', '==', userId)
        );
        if (!querySnapshot.empty) {
          const querySnapshot = await getDocs(q_user_id);
          if (!querySnapshot.empty) {
            alert('user_id นี้มีอยู่แล้วใน Firestore');
          }
          else {
            alert('กรุณาลงทะเบียนใบหน้า');
          }
        }
        
        return true;
      } else {
        console.log('❌ ไม่พบ user_id นี้ใน Firestore');
        alert('❌ ไม่พบ user_id นี้ใน Firestore');
        return false;
      }

    };
    checkUserExists(user);
  }, [])
  
  return (
    <View>
      <Text>Details Page</Text>
    </View>
  )
}

export default Details