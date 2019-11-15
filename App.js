import { createStackNavigator, createAppContainer } from 'react-navigation'

//import screens
import HomeScreen from './screens/HomeScreen'
import AddTodoScreen from './screens/AddTodoScreen'

const MainNavigator = createStackNavigator({
  Home: HomeScreen,
  Add: AddTodoScreen
},{
  defaultNavigationOptions: {
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: "#FF3E4D",
    },
    headerTintColor: "#fff"
  }
})

const App = createAppContainer( MainNavigator )
export default App