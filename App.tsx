import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import Register from './app/screens/Register';
import FaceScan from './app/screens/FaceScan';
// import Scanface from './app/screens/Scanface';


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='home' component={List} options={{headerShown : false}}/> 
      <InsideStack.Screen name='details' component={Details}  options={{headerShown : false}}/> 
      <InsideStack.Screen name='faceScan' component={FaceScan} options={{headerShown : false}} /> 
    </InsideStack.Navigator>
  );
}
function loginRegister() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Login' component={Login} options={{headerShown : false}} /> 
      <InsideStack.Screen name='Register' component={Register} options={{headerShown : false}} /> 

    </InsideStack.Navigator>
  );
}


export default function App() {
  const [user , setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH , (user) => {
      console.log('user' , user);
      setUser(user);
    });
  },[]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='My todo' component={InsideLayout} options={{headerShown : false}} ></Stack.Screen>
        ) :
        (
          <Stack.Screen name='Login' component={loginRegister} options={{headerShown : false}} ></Stack.Screen>
        )
      }
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
