import { TouchableOpacity , View, Text , StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native'


interface RouterProps {
    navigation : NavigationProp<any, any>;
}


const Login = ({navigation} : RouterProps) => {
    const [email , setEmail] = useState('') ;
    const [password , setPassword] = useState('') ;
    const [loading , setLoading] = useState(false) ;
    const auth = FIREBASE_AUTH;
    

    const signIn = async () => {

        setLoading(true) ;
        try {
            const res = await signInWithEmailAndPassword(auth ,email, password);
            console.log(res); 
            // alert('Login Success')
        }catch (error: any) {
            console.log(error);
            alert('Login Failed: ' + error.message);
        }finally {
            setLoading(false);
        }
    }
    
  return (
    <View  style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
        <Text style={styles.logo}>ECOS</Text>
        <Text style={{fontSize:20 , textAlign:'center' , marginBottom : 30  , color : '#fff'}}>EcoCycle Solutions</Text>
        <View style={styles.containerLogin}>
            <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
            <TextInput value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}></TextInput>
            {loading ? <ActivityIndicator size='large' color="#000ff" />: <>
            <TouchableOpacity style={styles.btn} onPress={signIn}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.btnTextRegister}>Create account ?</Text>
            </TouchableOpacity>
             
            </>
            }
        </View>
        </KeyboardAvoidingView>
        <Text style={styles.version}>Version 1.1</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container : {
        
        flex : 1,
        justifyContent: 'center',
        backgroundColor : '#181818',
        position : 'relative'
    },
    containerLogin : {
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center'
    },
    input : {
        marginVertical : 4 , 
        height: 50 ,
        borderWidth : 1 ,
        borderRadius : 10 ,
        padding : 10 , 
        backgroundColor : '#fff' , 
        width : '80%',
        
    },
    logo : {
        fontSize : 36,
        textAlign: 'center',
        fontWeight : 800 ,
        color : 'green',
        marginBottom : 10 ,
    },
    btn : {
        borderWidth : 1,
        borderColor : '#fff',
        width : "80%",
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
        width : "80%",
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
    },
    version : {
        textAlign : 'center' ,
        color : "#fff" , 
        position : 'absolute' ,
        bottom : 40,
        left : 30
    }
    
})
