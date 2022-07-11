import { initializeApp} from 'firebase/app';
import { getAuth,signInWithRedirect,signInWithPopup,GoogleAuthProvider,OAuthProvider } 
from 'firebase/auth';
import { 
    getFirestore,
    doc,
    getDoc,
    setDoc
    } from 'firebase/firestore';
    

const firebaseConfig = { 

    apiKey: "AIzaSyB8f8W19vwU-6DJmIKNaCmO6lD9CfGXYiU", 
  
    authDomain: "myproject1-de01c.firebaseapp.com", 
  
    projectId: "myproject1-de01c", 
  
    storageBucket: "myproject1-de01c.appspot.com", 
  
    messagingSenderId: "793259553764", 
  
    appId: "1:793259553764:web:61ea06ea1e7dca21ae8df1" 
  
  }; 
  
  
  // Initialize Firebase 
  
  const firebaseApp = initializeApp(firebaseConfig);

  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt:'select_account'
  });


  
  const provider1=new OAuthProvider('microsoft.com');
  provider1.setCustomParameters({
    prompt:'select_account'
  });
  export const db =getFirestore();

  
  export const auth=getAuth();
  export const signInWithGooglePopup=()=>signInWithPopup(auth,provider);
  export const signInWithMicrosoftPopup=()=>signInWithPopup(auth,provider1);
  
  

  export {firebaseApp}  ;

  export const createUserDocumentFromAuth=async (userAuth)=>{
  
  const userDocRef=doc(db,'users',userAuth.uid);
  
  const userSnapshot= await getDoc(userDocRef);
  
  if(!userSnapshot.exists())
  {
    const {displayName,email}=userAuth;
    const createdAt=new Date();

    try{
        await setDoc(userDocRef,{displayName,email,createdAt});

    }
    catch(error)
    {
      console.log('Error creating user',error.message);

    }
  }
  return userDocRef;
  }
  
  