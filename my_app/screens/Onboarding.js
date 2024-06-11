import { Text, View, TextInput, StyleSheet, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import React, { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Onboarding({ navigation }) {
  const [text, setText] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isTrue, setTrue] = React.useState(false);

  const { onboard } = useContext(AuthContext);

  const onChange = text => setText(text);
  const onChangeEmail = email => setEmail(email);

  const validateName = text => /^[a-zA-Z]+$/.test(text.trim());
  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  React.useEffect(() => {
    if (text !== "" && validateEmail(email) && validateName(text)) {
      setTrue(true);
    } else {
      setTrue(false);
    }
  }, [text, email]);

  const press = () => {
    onboard({ firstName: text, email });
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 50}>
      <View style={Styles.container}>
        <Image source={require("../images/lemon.png")} style={Styles.logo} />
        <Text style={Styles.textStyle}>Little Lemon</Text>
      </View>
      <ScrollView keyboardDismissMode="interactive">
        <View style={Styles.bannerContainer}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={Styles.main_Text}>Little Lemon</Text>
            <Text style={Styles.Chicago}>Chicago</Text>
            <View style={Styles.container2}>
              <Text style={Styles.descriptionText}>We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist</Text>
              <Image source={require("../images/Hero image.png")} style={Styles.heroImage} />
            </View>
          </View>
        </View>
        <View>
          <Text style={Styles.InputText}>First Name *</Text>
          <TextInput onChangeText={onChange} value={text} style={Styles.inputBox} />
          <Text style={Styles.InputText}>Email *</Text>
          <TextInput onChangeText={onChangeEmail} value={email} style={Styles.inputBox} keyboardType='ascii-capable' />
        </View>
        <View style={Styles.buttonView}>
          <Pressable style={[Styles.button, { backgroundColor: !isTrue ? 'grey' : "#495e57" }]} onPress={press} disabled={!isTrue}>
            <Text style={{ color: !isTrue ? "#000" : "#eee" }}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  textStyle: {
    marginTop: 70,
    fontWeight: "bold",
    color: '#495e57',
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 20,
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
    marginLeft: 100,
    marginBottom: 20,
    paddingRight: 10,
    marginTop: 70,
    resizeMode: 'contain',
  },
  mainText: {
    marginTop: 150,
    marginBottom: 80,
    textAlign: 'center',
    color: "white",
    fontSize: 25,
    fontWeight: "bold"
  },
  InputText: {
    fontSize: 20,
    marginTop: 40,
    color: '#959595',
    marginLeft: 20
  },
  inputBox: {
    width: '85%',
    height: 40,
    borderColor: '#DEDFE5',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    marginLeft: 20,
    borderRadius: 5
  },
  buttonView: {
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 50,
    width: 80,
    marginLeft: 210,
    marginTop: 70,
    backgroundColor: 'grey'
  },
  bannerContainer: {
    backgroundColor: "#495e57",
    padding: 20,
  },
  main_Text: {
    color: '#F4CE14',
    fontSize: 35,
    marginBottom: 5,
  },
  Chicago: {
    color: 'white',
    fontSize: 28,
    marginBottom: 10,
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    marginLeft: 5,
    marginTop: 20,
  },
  heroImage: {
    height: 140,
    width: 150,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
});
