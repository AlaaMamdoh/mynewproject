import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";


//import CreateCommunityScreen from './screens/CreateCommunityScreen'
//import AddMembersScreen from './screens/AddMembersScreen'
import CommunityOverViewScreen from './screens/CommunityOverViewScreen'
import CreateNewPostScreen from './screens/CreateNewPostScreen'
//import CommunitesList from './screens/CommunitesList'
//import StackAuthentication from './screens/Authentication/StackAuthentication'
//import NewsFeedScreen from './screens/NewsFeedScreen'
//import StackRooms from './screens/Rooms/StackRooms'
//import StackRooms from './screens/Rooms/StackRooms'
const AppNavigator = createStackNavigator(
    {
        //StackRoomss : StackRooms,
        //StackAuthenticationS : StackAuthentication ,
        //CommunitesListS:CommunitesList,
        //Rooms : StackRooms,
        //AddMembers : AddMembersScreen,
        //CreateCommunity : CreateCommunityScreen,
        //NewsFeed: NewsFeedScreen,
        CommunityOverView : CommunityOverViewScreen,
        CreateNewPost : CreateNewPostScreen
    },
);

export default createAppContainer(AppNavigator);
