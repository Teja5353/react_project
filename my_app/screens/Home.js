import * as React from "react";
import { Text, View, FlatList, StyleSheet, Image, Pressable,TouchableOpacity,ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar,Icon } from '@rneui/themed';
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import * as SQLite from "expo-sqlite";
import { AuthContext } from "../contexts/AuthContext";
// export function useUpdateEffect(effect, dependencies = []) {
//   const isInitialMount = React.useRef(true);
//   React.useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//     } else {
//       return effect();
//     }
//   }, dependencies);
// }
let db;
async function initializeDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("MY_APP");
  }
}

export async function createTable() {
  await initializeDb();
  const query = `
  CREATE TABLE IF NOT EXISTS MENU (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    description TEXT,
    image TEXT,
    category TEXT
  )`;
  await db.execAsync(query);
}

export async function getMenuItems() {
  await initializeDb();
  const query = `SELECT * FROM MENU`;
  const menuItems = await db.getAllAsync(query);
  return menuItems;
}

export async function filter(category, query) {
  await initializeDb();
  const qtr = "%" + query + "%";
  if (category.length === 0 && query === "") {
    const allItems = await getMenuItems();
    return allItems;
  } else if (category.length === 0 && query !== "") {
    const q = `SELECT * FROM MENU WHERE name LIKE ?`;
    const menuItems = await db.getAllAsync(q, [qtr]);
    return menuItems;
  } else if (category.length > 0 && query === "") {
    const placeholders = category.map(() => "?").join(", ");
    const q = `SELECT * FROM MENU WHERE category IN (${placeholders})`;
    const menuItems = await db.getAllAsync(q, category);
    return menuItems;
  } else {
    const placeholders = category.map(() => "?").join(", ");
    const q = `SELECT * FROM MENU WHERE name LIKE ? AND category IN (${placeholders})`;
    const menuItems = await db.getAllAsync(q, [qtr, ...category]);
    return menuItems;
  }
}
export async function saveMenuItems(menuItems) {
  await initializeDb();
  for (const item of menuItems) {
    await db.runAsync(
      `INSERT INTO MENU (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)`,
      [item.name, item.price, item.description, item.image, item.category]
    );
  }
  console.log("Inserted");
}
export function ImageViewer({ selectedImage, FirstName }) {
  if (selectedImage && selectedImage !== 'null') {
    const imageSource = { uri: selectedImage };
    return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Image source={imageSource} style={menuStyles.imageViewer} /></TouchableOpacity>;
  }
  return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Avatar title={FirstName ? FirstName[0] : ''} size={70} rounded containerStyle={{ backgroundColor: 'grey', marginLeft: 40, marginTop: 10 }} /></TouchableOpacity>;
}

export function ProfilePick({ selectedImage, FirstName }) {
  if (selectedImage && selectedImage !== "") {
    const imageSource = { uri: selectedImage };
    return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Image source={imageSource} style={menuStyles.profileView} /></TouchableOpacity>;
  }
  return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Avatar title={FirstName ? FirstName[0] : ''} size={50} rounded containerStyle={{ backgroundColor: 'grey', marginLeft: 50, marginTop: 40, marginBottom: 20 }} /></TouchableOpacity>
}
export function Home({navigation}) {
  function ProfilePick({ selectedImage, FirstName }) {
    if (selectedImage && selectedImage !== "") {
      const imageSource = { uri: selectedImage };
      return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Image source={imageSource} style={menuStyles.profileView} /></TouchableOpacity>;
    }
    return <TouchableOpacity onPress={()=>navigation.navigate("Profile")}><Avatar title={FirstName ? FirstName[0] : ''} size={50} rounded containerStyle={{ backgroundColor: 'grey', marginLeft: 50, marginTop: 40, marginBottom: 20 }} /></TouchableOpacity>
  }
  const separator = () => {
    return <View style={{height: 1, backgroundColor:'#4A5F58',width:"90%",marginLeft:20}} />;
  };
  const [query, setQuery] = React.useState("");
  const [searchBarText, setSearchBarText] = React.useState("");
  const [activeCategories,setActiveCategories] = React.useState([]);
  const [menuItems, setmenuItems] = React.useState([]);
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

  const lookup = React.useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = React.useMemo(() => debounce(lookup, 1000), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };
  const fetchData = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json")
      const json = await response.json()
      return json.menu
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (menuItems.length <= 0) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);
        }
          setmenuItems(menuItems);
          const getProfile = await AsyncStorage.getItem("profile");
          setProfile(JSON.parse(getProfile));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (activeCategories.length > 0 || query!="") {
        const filteredItems = await filter(activeCategories,query);
        setmenuItems(filteredItems);
      }
      else {
        const allItems = await getMenuItems();
        setmenuItems(allItems);
      }
    })();
  }, [activeCategories,query]);

  const handleCategoryPress = (category) => {
    setActiveCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat != category);
      } else {
        return [...prevCategories, category];
      }
    });
  };
  return (
    <View style={menuStyles.container}>
      <View style={menuStyles.container1}>
        <Image source={require("../images/lemon.png")} style={menuStyles.logo} />
        <Text style={menuStyles.logo_text}>Little Lemon</Text>
        <ProfilePick selectedImage={profile.image} FirstName={profile.firstName} />
      </View>
      <View style={menuStyles.bannerContainer}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={menuStyles.main_Text}>Little Lemon</Text>
          <Text style={menuStyles.Chicago}>Chicago</Text>
          <View style={menuStyles.container2}>
            <Text style={menuStyles.descriptionText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist</Text>
            <Image source={require("../images/Hero image.png")} style={menuStyles.heroImage} />
          </View>
          <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={menuStyles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
        </View>
      </View>
      <View style={{alignContent:'center'}}>
        <Text style={{fontSize:18,fontWeight:'bold',marginTop:30,marginLeft:30}}>ORDER FOR DELIVERY!</Text>
      </View>
      <View style={{flexDirection:'row'}}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} alignItems='center' showsVerticalScrollIndicator={false} style={{height:80}} automaticallyAdjustContentInsets={false}>
        <TouchableOpacity onPress={()=>handleCategoryPress('starters')} style={[menuStyles.save_button,{backgroundColor: !activeCategories.includes('starters')?'#CFD4D2':'#495e57'}]}>
          <Text style={[menuStyles.buttonTextS,{color: activeCategories.includes('starters')?'#eee':'#495E57'}]}>Starters</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleCategoryPress('mains')}  style={[menuStyles.save_button,{backgroundColor: !activeCategories.includes('mains')?'#CFD4D2':'#495e57'}]}>
          <Text style={[menuStyles.buttonTextS,{color: activeCategories.includes('mains')?'#eee':'#495E57'}]}>Mains</Text>
        </TouchableOpacity>
        <Pressable onPress={()=>handleCategoryPress('desserts')}  style={[menuStyles.save_button,{backgroundColor: !activeCategories.includes('desserts')?'#CFD4D2':'#495e57'}]}>
          <Text style={[menuStyles.buttonTextS,{color: activeCategories.includes('desserts')?'#eee':'#495E57'}]}>Desserts</Text>
        </Pressable>
        <Pressable onPress={()=>handleCategoryPress('drinks')} style={[menuStyles.save_button,{backgroundColor: !activeCategories.includes('drinks')?'#CFD4D2':'#495e57'}]}>
          <Text style={[menuStyles.buttonTextS,{color: activeCategories.includes('drinks')?'#eee':'#495E57'}]}>Drinks</Text>
        </Pressable>
      </ScrollView>
      </View>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <View style={menuStyles.innerContainer}>
            <Text style={menuStyles.ItemTitle}>{item.name}</Text>
            <View style={{flexDirection:'row'}}>
            <Text style={menuStyles.itemText}>{item.description}</Text>
            <Image source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }} style={menuStyles.menuImage} />
            </View>
            <Text style={menuStyles.itemText1}>{`$`+item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={separator}
      />
    </View>
  )
}

const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingVertical: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  itemText: {
    color: '#4A5F58',
    fontSize: 15,
    flex:1,
    marginLeft:25,
    marginRight:10,
    marginTop:10
  },
  headerText: {
    color: '#495E57',
    fontSize: 30,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',

  },
  container1: {
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
  imageViewer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 20,
  },
  profileView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 30,
    marginLeft: 40,
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
  icon: {
    marginTop: 10,
    marginLeft: 20,
  },
  buttonTextS: {
    fontSize: 11,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 13,
    fontWeight: 'bold'
  },
  save_button: {
    height: 40,
    width: 65,
    marginLeft: 25,
    marginTop: 10,
    marginBottom:10,
    borderRadius: 10,
  },
  menuImage:{
    height:100,
    width:100,
    marginRight:20
  },
  ItemTitle:{
    fontWeight:'bold',
    fontSize:15,
    marginBottom:10,
    marginLeft:25
  },
  itemText1: {
    color: '#4A5F58',
    fontSize: 17,
    flex:1,
    marginLeft:25,
    marginRight:10,
    marginTop:10,
    fontWeight:'bold'
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});
