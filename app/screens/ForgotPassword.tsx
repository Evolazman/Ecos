import React, { useState } from 'react';
import { View, TextInput, Button, Alert ,KeyboardAvoidingView ,StyleSheet , TouchableOpacity ,Text} from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native'

interface RouterProps {
    navigation : NavigationProp<any, any>;
}
const ForgotPassword = ({navigation} : RouterProps) => {
    
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
        Alert.alert('Please enter your email');
        return;
        }

        try {
            await sendPasswordResetEmail(FIREBASE_AUTH, email);
            Alert.alert('Password reset email sent!', 'Check your inbox.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };
  return (
    
    <View  style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
            <Text style={styles.logo}>ECOS</Text>
            <Text style={{fontSize:20 , textAlign:'center' , marginBottom : 30  , color : '#fff'}}>EcoCycle Solutions</Text>
                <TextInput
                
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>        
                    <Text style={styles.btnText}>Reset Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnTextRegister}>Back</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
    </View>
   
    
  )
  
}
const styles = StyleSheet.create({
    container : {
        
        flex : 1,
        justifyContent: 'center',
        backgroundColor : '#181818',
        position : 'relative',
        padding : "10%",
    },
    logo : {
        fontSize : 36,
        textAlign: 'center',
        fontWeight : 800 ,
        color : 'green',
        marginBottom : 10 ,
    },
    input : {
        marginVertical : 4 , 
        height: 50 ,
        borderWidth : 1 ,
        borderRadius : 10 ,
        padding : 10 , 
        backgroundColor : '#fff' , 

    },btn : {
        borderWidth : 1,
        borderColor : '#fff',
        display : 'flex',
        justifyContent : 'center' ,
        alignItems : 'center' ,
        height : 50 , 
        borderRadius : 10 , 
        marginTop : 20

    },
    btnText : {
        fontSize : 16 ,
        color : '#fff'
    },
    btnRegister : {
        // borderWidth : 1,
        borderColor : '#fff',
        display : 'flex',
        justifyContent : 'center' ,
        alignItems : 'center' ,
        height : 50 , 
        borderRadius : 10 , 
        marginTop : 10
    },
    btnTextRegister : {
        fontSize : 16 ,
        color : "green"
    }
    })

export default ForgotPassword