import React from 'react';
import { StyleSheet, Text, View, ScrollView, Keyboard, Alert, AsyncStorage } from 'react-native';
import { 
    Button,
    Form,
    Item,
    Input,
    DatePicker,
    Label
} from 'native-base'
import { Entypo } from '@expo/vector-icons'

export default class AddTodoScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
          chosenDate: new Date(),
          todoTitle: "",
          todoDes: "",
          todoDate: "",
          todoTime: "",
          todoStatus: "Pending.."
        };
        this.setDate = this.setDate.bind(this);

      }
      setDate(newDate) {
        this.setState({ chosenDate: newDate });
      }

    static navigationOptions = {
        title: "Create My Todo"
  }
  //get all the todo details
  getAllTodoDetails = async () =>{
    if(
      (this.state.todoTitle !== "") &&
      (this.state.todoDes !== "")
      // (this.state.todoDate !== "")
    ){
      var Todo = {
        todoTitle: this.state.todoTitle,
        todoDes: this.state.todoDes,
        todoDate: this.state.chosenDate.toString().substr(0, 15),
        todoStatus: this.state.todoStatus
      }
        await AsyncStorage.setItem( Date.now().toString(), JSON.stringify( Todo ) )
        .then( ()=>{ this.props.navigation.goBack()})
        .catch( error =>{
          console.log( "this is AddTodo AsyncStorage error: " + error)
        })
    }
     else{
      Alert.alert('Please fill atleast Title, Description')
    }
  }
 render(){
  return (
    <ScrollView style={styles.container}>
        <Form>
            <Item style={styles.inputItem}>
                <Input 
                    style={[styles.input, { borderColor: "#1abc9c"}]}         
                    autoCorrect = {false}
                    autoCapitalize = "none"
                    keyboardType = "default"
                    placeholder = "Type Todo Title"
                    onChangeText = { todoTitle => this.setState({todoTitle}) }
                />
            </Item>
            <Item style={styles.inputItem}>
                <Input 
                    style={[styles.input, { borderColor: "#EA425C",}]}         
                    autoCorrect = {false}
                    autoCapitalize = "none"
                    keyboardType = "default"
                    placeholder = "Type Todo description"
                    onChangeText = { todoDes=> this.setState({todoDes}) }
                />
            </Item>
            <Item style={styles.inputItem}>
                <Input
                    style={styles.input}
                    value = {this.state.chosenDate.toString().substr(0, 15)} 
                    onChangeText = { todoDate=> this.setState({todoDate})}             
                />
               <DatePicker
            defaultDate={new Date().getDate()}
            minimumDate={new Date()}
            maximumDate={new Date(2080, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#000" }}
            onDateChange={this.setDate}
            disabled={false}
            />
            </Item>
            <Item style={[styles.inputItem, { flexDirection:"row" }]}>
              <Input style={[styles.input, {marginRight: 10}]}
                placeholder ="Set alarm"
                onChangeText = {todoTime=> this.setState({todoTime})}
              />
              <Entypo 
                name = "clock"
                size = {30}
              />
            </Item>
            <Button style={styles.saveBtn} success onPress={()=> this.getAllTodoDetails()}>
              <Text style={styles.saveBtnText}>Save as Todo</Text>
            </Button>
        </Form>
        <View style={styles.emptyView}></View>
    </ScrollView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputItem: {
    borderBottomWidth: 0,
    marginTop: 20,
    margin: 5
  },
  inputLabel: {
      fontWeight: "bold",
      fontSize: 22
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    color:"#333945"
  },
  saveBtn: {
    margin: 10,
    marginTop: 30,
    justifyContent: "center",
    alignItems :"center",
    padding: 10,
    borderRadius: 10
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  },
  emptyView:{
    height: 400
  }
});
