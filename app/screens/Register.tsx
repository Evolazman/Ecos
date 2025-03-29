import { TouchableOpacity , View, Text , StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH , FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc , getDocs , setDoc, doc} from 'firebase/firestore';


interface RouterProps {
    navigation : NavigationProp<any, any>;
}
const Register = ({navigation} : RouterProps) => {
    const { control, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password'); // ดึงค่าของ password ที่ผู้ใช้กรอกไว้
    const frist_last_name = watch('frist_last_name'); // ดึงค่าของ password ที่ผู้ใช้กรอกไว้
    const department_id = watch('department_id'); // ดึงค่าของ password ที่ผู้ใช้กรอกไว้
    const [email , setEmail] = useState('') ;
    // const [frist_last_name , setFirst_last_name] = useState('') ;
    // const [department_id , setDepartment_id] = useState('') ;
    const [loading , setLoading] = useState(false) ;
    const auth = FIREBASE_AUTH;
    
    const signUp = async (data : any) => {
        setLoading(true) ;
        
        console.log('Register Data:', data);
        try {
            if (frist_last_name == null || department_id == null ) {
                return alert('กรุณากรอกข้อมูลให้ครบถ้วน')
            }else {
                const res = await createUserWithEmailAndPassword(auth ,email, password);
                FIREBASE_AUTH.signOut()
                if (res) {
                    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'user_id'));
                    const ids = [];
    
                    querySnapshot.forEach((doc) => {
                    // กรองเฉพาะที่เป็นตัวเลข
                    if (!isNaN(doc.id)) {
                        ids.push(Number(doc.id));
                    }
                    });
    
                    // หาค่า ID สูงสุด
                    const maxId = ids.length > 0 ? Math.max(...ids) : 65131000; // ค่าเริ่มต้นถ้ายังไม่มี
                    const newId = (maxId + 1).toString();
                    console.log('New ID:+++++++++++++++++++++++++++++++', newId);
                    await setDoc(doc(FIREBASE_DB, 'user_id', newId), {
                        createdAt: new Date(),
                        department_id: department_id,
                        name: frist_last_name,
                        email: email,
                        update_at: new Date(),
                        user_point: 0
                      });
                      
                    
                    navigation.goBack()
                    alert('ลงทะเบียนสำเร็จ')
                    
                }
                // alert('Register Success')
                // navigation.navigate('Scanface')
            }
            
            
            
            
        }catch (error: any) {
            console.log(error);
            alert('Register Failed: ' + error.message);
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

            <Controller
                control={control}
                name="password"
                rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize='none'
                />
                )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                required: 'Please confirm your password',
                validate: value =>
                    value === password || 'Passwords do not match', // ตรวจสอบความตรงกันของ password
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize='none'
                />
                )}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

            <Controller
                control={control}
                name="frist_last_name"
                rules={{
                required: 'First name and Last name is required',
                minLength: { value: 6, message: 'Name must be at least 6 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="First name - Last name"
             
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize='none'
                />
                )}
            />
            {errors.frist_last_name && <Text style={styles.error}>{errors.frist_last_name.message}</Text>}

            <Controller
                control={control}
                name="department_id"
                rules={{
                required: 'Department Id is required',
                minLength: { value: 3, message: 'Department Id must be at least 3 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Department Id"
                    
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize='none'
                />
                )}
            />
            {errors.department_id && <Text style={styles.error}>{errors.department_id.message}</Text>}
            
            {/* <TextInput value={frist_last_name} style={styles.input} placeholder='First name - Last name' autoCapitalize='none' onChangeText={(text) => setFirst_last_name(text)}></TextInput>
            <TextInput value={department_id} style={styles.input} placeholder='Your Department Id' autoCapitalize='none' onChangeText={(text) => setDepartment_id(text)}></TextInput> */}
            {/* <TextInput value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} secureTextEntry={true}></TextInput> */}
            {/* <TextInput value={confirmPassword} style={styles.input} placeholder='Confirm Password' autoCapitalize='none' onChangeText={(text) => setConfirmPassword(text)} secureTextEntry={true}></TextInput>  */}

            {loading ? <ActivityIndicator size='large' color="#000ff" />: <>
                <TouchableOpacity style={styles.btn} onPress={handleSubmit(signUp)}>
                    <Text style={styles.btnText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnTextRegister}>Already have an account?</Text>
                </TouchableOpacity>
            </>
            }
        </View>
        </KeyboardAvoidingView>
        <Text style={styles.version}>Version 1.1</Text>
    </View>
  )
}

export default Register

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
    },
    error: {
        color: 'red',
        marginBottom: 10,
      }
    
})
