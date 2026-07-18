import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import * as DB from './db';


export default function App() {


const [itemName,setItemName] = useState('');
const [quantity,setQuantity] = useState('');
const [price,setPrice] = useState('');
const [category,setCategory] = useState('');

const [items,setItems] = useState([]);

const [search,setSearch] = useState('');

const [selectedCategory,setSelectedCategory] = useState('All');



useEffect(()=>{

DB.setupDatabase();

loadItems();

},[]);



function loadItems(){

const data = DB.getItems();

setItems(data);

}




function saveItem(){

if(
itemName === '' ||
quantity === '' ||
price === '' ||
category === ''
){

Alert.alert(
"Error",
"Please complete all fields"
);

return;

}


DB.addItem(
itemName,
quantity,
price,
category
);


setItemName('');
setQuantity('');
setPrice('');
setCategory('');

loadItems();

}





function deleteItem(id,name){


Alert.alert(

"Delete Item",

"Delete "+name+"?",

[

{
text:"Cancel"
},

{
text:"Delete",
style:"destructive",

onPress:()=>{

DB.deleteItem(id);

loadItems();

}

}

]

);

}





const categories=[

"All",

...new Set(

items.map(
(item)=>item.category
)

)

];





const filteredItems = items.filter((item)=>{


const searchMatch =

item.itemName
.toLowerCase()
.includes(
search.toLowerCase()
);



const categoryMatch =

selectedCategory === "All"

||

item.category === selectedCategory;



return searchMatch && categoryMatch;


});





return(


<View style={styles.container}>


<ScrollView
showsVerticalScrollIndicator={false}
>


<Text style={styles.title}>
StockMate
</Text>


<Text style={styles.subtitle}>
Inventory Management System
</Text>




<Text style={styles.section}>
Search Inventory
</Text>


<TextInput

style={styles.input}

placeholder="Search item..."

value={search}

onChangeText={setSearch}

/>




<Text style={styles.section}>
Add Item
</Text>



<TextInput
style={styles.input}
placeholder="Item Name"
value={itemName}
onChangeText={setItemName}
/>



<TextInput
style={styles.input}
placeholder="Quantity"
keyboardType="numeric"
value={quantity}
onChangeText={setQuantity}
/>



<TextInput
style={styles.input}
placeholder="Price"
keyboardType="numeric"
value={price}
onChangeText={setPrice}
/>



<TextInput
style={styles.input}
placeholder="Category"
value={category}
onChangeText={setCategory}
/>



<Button
title="Add Item"
onPress={saveItem}
/>





<Text style={styles.section}>
Filter Category
</Text>



<ScrollView

horizontal

showsHorizontalScrollIndicator={false}

>


{

categories.map((cat)=>(


<TouchableOpacity

key={cat}

style={[

styles.categoryButton,

selectedCategory === cat &&
styles.activeCategory

]}


onPress={()=>setSelectedCategory(cat)}

>


<Text

style={

selectedCategory === cat

?

styles.activeText

:

styles.categoryText

}

>

{cat}

</Text>


</TouchableOpacity>


))


}


</ScrollView>





<Text style={styles.section}>
Inventory List
</Text>




<FlatList

scrollEnabled={false}

data={filteredItems}


keyExtractor={(item)=>item.id.toString()}


ListEmptyComponent={

<Text style={styles.empty}>
No inventory found
</Text>

}



renderItem={({item})=>(


<View style={styles.card}>


<Text style={styles.category}>
🏷 Category: {item.category}
</Text>



<Text style={styles.name}>
{item.itemName}
</Text>



<Text>
Quantity: {item.quantity}
</Text>


<Text>
Price: ₱{item.price}
</Text>



<Button

title="Delete"

color="red"

onPress={()=>deleteItem(
item.id,
item.itemName
)}

/>



</View>


)}


/>



</ScrollView>



<StatusBar style="auto"/>


</View>


);

}






const styles = StyleSheet.create({



container:{

flex:1,

backgroundColor:'#F1F5F9',

padding:20,

paddingTop:50

},



title:{

fontSize:36,

fontWeight:'bold',

color:'#2563EB',

textAlign:'center'

},



subtitle:{

fontSize:18,

color:'#64748B',

textAlign:'center',

marginBottom:15

},



section:{

fontSize:20,

fontWeight:'bold',

marginTop:15,

marginBottom:8,

color:'#0F172A'

},



input:{

backgroundColor:'#FFFFFF',

borderWidth:1,

borderColor:'#CBD5E1',

borderRadius:10,

padding:12,

marginBottom:10

},



categoryButton:{

backgroundColor:'#E2E8F0',

paddingVertical:8,

paddingHorizontal:15,

borderRadius:20,

marginRight:8,

marginBottom:10

},



activeCategory:{

backgroundColor:'#2563EB'

},



categoryText:{

color:'#334155'

},



activeText:{

color:'#FFFFFF',

fontWeight:'bold'

},



card:{

backgroundColor:'#FFFFFF',

padding:15,

borderRadius:12,

marginBottom:10

},



category:{

color:'#2563EB',

fontWeight:'bold'

},



name:{

fontSize:20,

fontWeight:'bold',

marginVertical:5

},



empty:{

textAlign:'center',

marginTop:20,

color:'#64748B'

}



});