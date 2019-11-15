import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity, 
  AsyncStorage, 
  FlatList, 
  Alert
} from 'react-native';
import { 
    Button,
    Card
} from 'native-base'

import { Entypo } from '@expo/vector-icons'

export default class HomeScreen extends React.Component {

    constructor( props )
    {
        super( props )
        this.state = {
            hour: "",
            min: "",
            sec: "",
            date: "",
            TodoDetail: [],
            key: "",
            status: "Done..",
        }
    }

    static navigationOptions = {
        title: "My Todo"
    }
  //mount all the component
  componentWillMount(){
    const { navigation } = this.props
    navigation.addListener('willFocus', ()=>{
      this.getTodoDetails()
    })
  }
  getTodoDetails = async () =>{
    await AsyncStorage.getAllKeys()
    .then(keys=>{
      return AsyncStorage.multiGet( keys )
      .then(result =>{
        this.setState({ TodoDetail: result.sort( function(a, b){
          if( JSON.parse( a[1] ).todoDate < JSON.parse( b[1] ).todoDate)
            return -1
          else if( JSON.parse( a[1] ).todoDate > JSON.parse( b[1] ).todoDate)
            return 1
          return 0    
        })
      })
      })
      .catch(error =>{
        console.log('This is multiGet error: '+ error)
      })
    })
    .catch( error =>{
      console.log('This is getAllKeys error: '+ error)
    })
  }

   componentDidMount(){
       this._interval = setInterval( ()=>{
        this.getDate()
        this.getTime()
       }, 1000)
   }

   //find date
   getDate = () =>{
    let date = new Date().toString().substr(0, 15)
    this.setState({date: date})
   }

   //get time
   getTime = () =>{
       let hh = new Date().getHours()
       let mm = new Date().getMinutes()
       let ss = new Date().getSeconds()

       this.setState({hour: hh})
       this.setState({min: mm})
       this.setState({sec: ss})
   }
   //check as mark
   markAsDone = async key =>{
    var result
    await AsyncStorage.getItem( key )
      .then( resultString=>{
         result = JSON.parse( resultString )
        this.setState( result )
      })
      Alert.alert( 'Set to : ', `${this.state.todoStatus === 'Pending..'? 'Done..': 'Pending..'} `,[
        {
          text: 'Cancel',
          onPress: ()=> console.log('Cancel')
        },
        {
          text: 'Ok',
          onPress: async ()=>{
            var update = {
              todoTitle: this.state.todoTitle,
              todoDes: this.state.todoDes,
              todoDate: this.state.todoDate,
              todoStatus: this.state.todoStatus === 'Pending..'? this.state.status : "Pending.."
            }
            await AsyncStorage.mergeItem( key, JSON.stringify( update ))
            .then( this.getTodoDetails() )
          }
        }
      ])
   }

   //delete items
   deleteItem = async key =>{
    Alert.alert('Are You sure ?', `${"Please Confirm !"}`, [
      {
        text: 'Cancel',
        onPress:() =>console.log('calcel pressed')
      },{
        text: 'Ok',
        onPress: async ()=>{
          await AsyncStorage.removeItem( key )
          .then(this.getTodoDetails())
        }
      }
    ])
   }
 render(){

  return (
    <View style={styles.container}>
        <View style={styles.dayDateTimeCon}>
          <Text style={styles.dateText}>{this.state.date} </Text>
          <Text style={styles.timeText}>{this.state.hour} : {this.state.min} : {this.state.sec}</Text>
        </View>
          <FlatList 
          data = {this.state.TodoDetail}
          renderItem = {({ item })=>{
            TodoDetail = JSON.parse( item[1] )
            return(
              <Card style={styles.cardStyle}>
                <View style={styles.todoDetails}>
                  <Text style={styles.todoTitle}>{TodoDetail.todoTitle.toUpperCase()}</Text>
                  <Text style={styles.todoDes}>{TodoDetail.todoDes}</Text>
                  <Text style={styles.todoDate}>{TodoDetail.todoDate}</Text>
                  <Text style={[TodoDetail.todoStatus ==='Done..'? styles.todoDoneStatus: styles.todoPendingStatus]}>
                  {TodoDetail.todoStatus}
                  </Text>
                  
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={[TodoDetail.todoStatus ==='Done..'? styles.btnDoneStatus: styles.btnPendingStatus]}
                    onPress = {()=>{this.markAsDone(item[0].toString())}}
                  >
                    <Entypo 
                     name= {TodoDetail.todoStatus === 'Done..'? "cross": "check"}
                     size = {30}
                     color = "#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDelete}
                    onPress = {()=>{this.deleteItem(item[0].toString())}}
                  >
                    <Entypo 
                      name = 'trash'
                      size = {30}
                      color = '#fff'
                    />
                  </TouchableOpacity>
                </View>      
              </Card>
            )
          }}
          keyExtractor={(item, index) => item[0].toString()}
        />
        
      <Button style = {styles.addTodoButton}
        onPress = {() => this.props.navigation.navigate('Add')}
        >
          <Entypo 
            name = {"plus"}
            size = {35}
            color = "#fff"
            fontWeight = "bold"
            />
          <Text style={styles.addTodoButtonText}>Add Todo</Text>
      </Button>
      <View style={styles.emptyView}></View>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dayDateTimeCon: {
      backgroundColor: "#AE1438",
      padding: 15,
      flexDirection: "row",
      justifyContent: "space-between"
  },

  dateText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
},
timeText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
},
  addTodoButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#616C6F",
    position: "absolute",
    width: 340,
    bottom: 1,
    padding: 5,
    flexDirection: "row",
    borderRadius: 10
  },
  addTodoButtonText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
  todoDetails: {
    padding:5
  },
  todoTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F363F'
  },
  todoDes: {
    fontSize: 17,
    color: '#535C68'
  },
  todoDate: {
    color: '#758AA2'
  },
  todoTime: {
    color: '#758AA2'
  },
  todoDoneStatus: {
    color: '#1287A5',
    fontWeight: 'bold'
  },
  todoPendingStatus: {
    color: '#FF3E4D',
    fontWeight: 'bold'
  },
  cardStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center'
  },
  btnDoneStatus: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",

  },
  btnPendingStatus: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: '#218F76',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",

  },
  btnDelete: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 5,
    backgroundColor: '#FF3E4D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  emptyView:{
    height: 50
  }
});
