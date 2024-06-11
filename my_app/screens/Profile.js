import * as React from 'react';
import {View,Text,StyleSheet,Image,Pressable,ScrollView,KeyboardAvoidingView,Platform} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import { AuthContext } from "../contexts/AuthContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
export function ImageViewer({ selectedImage , FirstName}) {
  if (selectedImage && selectedImage !== '') {
    const imageSource = { uri: selectedImage };
    return <Image source={imageSource} style={Styles.imageViewer} />;
  }
  return <Avatar title={FirstName ? FirstName[0] : ''} size={70} rounded containerStyle={{ backgroundColor: 'grey', marginLeft: 40, marginTop: 10 }} />;
}

export function ProfilePick({selectedImage,FirstName}) {
  if (selectedImage && selectedImage !== '') {
    const imageSource = { uri: selectedImage };
    return <Image source={imageSource} style={Styles.profileView} />;
  }
  return <Avatar title={FirstName ? FirstName[0] : ''} size={50} rounded containerStyle={{ backgroundColor: 'grey', marginLeft: 50, marginTop: 40, marginBottom: 20 }} />;
}

export function Profile({ navigation }) {
  const RemoveImage = () => {
    setProfile((prevState) => ({
      ...prevState,
      ["image"]: "",
    }));
  }
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [discard, setDiscard] =React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));

        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);
  const { update } = React.useContext(AuthContext);
  const { logout } = React.useContext(AuthContext);

  const maskNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const changePhone = (newPhone) => {
    const masked = maskNumber(newPhone);
    return masked
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setProfile((prevState) => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    } else {
      alert('You did not select any image.');
    }
  };
  const updateProfile = (key, value) => {
    setProfile((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return( 
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 50}>
      <View style={Styles.container}>
        <FontAwesome name="arrow-circle-left" size={50}  color={"#495e57"} style={{marginTop:25,marginLeft:10}} onPress={()=>navigation.navigate("Home")}></FontAwesome>
        <Image source={require("../images/lemon.png")} style={Styles.logo} />
        <Text style={Styles.logo_text}>Little Lemon</Text>
        <ProfilePick selectedImage={profile.image} FirstName={profile.firstName} />
      </View>
      <View style={Styles.container2}>
        <Text style={Styles.prof_header}>Personal information</Text>
        <Text style={Styles.AvatarText}>Avatar</Text>
      </View>
      <View style={Styles.container1}>
        <ImageViewer selectedImage={profile.image} FirstName={profile.firstName} />
        <Pressable onPress={pickImageAsync} style={Styles.change_button}><Text style={Styles.buttonText}>Change</Text></Pressable>
        <Pressable style={Styles.remove_button} onPress={RemoveImage}><Text style={Styles.buttonTextR}>Remove</Text></Pressable>
      </View>
      <ScrollView style={Styles.container2} keyboardDismissMode="interactive">
        <Text style={Styles.AvatarText}>First name</Text>
        <TextInput editable={false} style={Styles.inputBox} placeholder={profile.firstName} />
        <Text style={Styles.AvatarText}>Last name</Text>
        <TextInput editable={true} style={Styles.inputBox} onChangeText={(newValue) => updateProfile("lastName", newValue)} placeholder="Enter your Last Name" clearButtonMode={'while-editing'} value={profile.lastName}/>
        <Text style={Styles.AvatarText}>Email ID</Text>
        <TextInput editable={false} style={Styles.inputBox} placeholder={profile.email} />
        <Text style={Styles.AvatarText}>Phone number</Text>
        <TextInput editable={true} style={Styles.inputBox} onChangeText={(newValue) => updateProfile("phoneNumber", changePhone(newValue))} placeholder="Enter your phone Number" value={profile.phoneNumber} clearButtonMode={'while-editing'}/>
        <Text style={Styles.prof_header}>Email Notifications</Text>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Checkbox style={{ marginLeft: 20, marginTop: 10 }} value={profile.orderStatuses} onValueChange={(newValue) => updateProfile("orderStatuses", newValue)} color={"#495e57"} />
          <Text style={{ fontSize: 14, marginTop: 10, marginLeft: 10 }}>Order status</Text>
        </View>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Checkbox style={{ marginLeft: 20, marginTop: 10 }} value={profile.passwordChanges} onValueChange={(newValue) => updateProfile("passwordChanges", newValue)} color={"#495e57"} />
          <Text style={{ fontSize: 14, marginTop: 10, marginLeft: 10 }}>Password changes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Checkbox style={{ marginLeft: 20, marginTop: 10 }} value={profile.specialOffers} onValueChange={(newValue) => updateProfile("specialOffers", newValue)} color={"#495e57"} />
          <Text style={{ fontSize: 14, marginTop: 10, marginLeft: 10 }}>Special offers</Text>
        </View>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Checkbox style={{ marginLeft: 20, marginTop: 10 }} value={profile.newsletter} onValueChange={(newValue) => updateProfile("newsletter", newValue)} color={"#495e57"} />
          <Text style={{ fontSize: 14, marginTop: 10, marginLeft: 10 }}>Newsletter</Text>
        </View>
        <Pressable style={Styles.logoutbutton} onPress={()=>logout()}><Text style={Styles.logout_text}>Log out</Text></Pressable>
        <View style={Styles.container1}>
          <Pressable style={Styles.discard}><Text style={Styles.buttonTextd} onPress={()=>setDiscard(true)}>Discard changes</Text></Pressable>
          <Pressable onPress={()=>update(profile)} style={Styles.save_button}><Text style={Styles.buttonTextS}>Save changes</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black'
  },
  container: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  logo: {
    height: 50,
    width: 50,
    marginLeft: 55,
    marginBottom: 20,
    paddingRight: 10,
    marginTop: 40,
    resizeMode: 'contain',
  },
  logo_text: {
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495e57'
  },
  icon: {
    marginLeft: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  prof_header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    color: 'black'
  },
  imageViewer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 20,
  },
  change_button: {
    height: 50,
    width: 80,
    marginLeft: 40,
    marginTop: 10,
    backgroundColor: '#495e57',
    borderRadius: 10,
  },
  container1: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18,
    fontWeight: 'bold'
  },
  remove_button: {
    height: 50,
    width: 80,
    marginLeft: 40,
    marginTop: 10,
    borderColor: '#495e57',
    borderWidth: 1
  },
  buttonTextR: {
    fontSize: 12,
    color: '#495e57',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    fontWeight: 'bold'
  },
  profileView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 30,
    marginLeft: 40,
  },
  container2: {
    flexDirection: 'column',
    alignContent: 'center',
  },
  AvatarText: {
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
    color: 'grey'
  },
  inputBox: {
    width: '90%',
    height: 40,
    borderColor: '#495e57',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    marginLeft: 20,
    borderRadius: 5,
    alignContent: 'center'
  },
  logoutbutton: {
    height: 40,
    width: '90%',
    marginLeft: 20,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4CE14',
    borderRadius: 10,
    borderColor: "#DCAE55",
    borderWidth: 1,
    marginTop: 10
  },
  logout_text: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 9
  },
  discard: {
    height: 40,
    width: 120,
    marginLeft: 40,
    marginTop: 30,
    borderColor: '#495e57',
    borderWidth: 1,
    borderRadius: 10,
    alignContent: 'center'
  },
  buttonTextd: {
    fontSize: 12,
    color: '#495e57',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  },
  save_button: {
    height: 40,
    width: 120,
    marginLeft: 80,
    marginTop: 30,
    backgroundColor: '#495e57',
    borderRadius: 10,
  },
  buttonTextS: {
    fontSize: 12,
    color: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
    fontWeight: 'bold'
  },
});
