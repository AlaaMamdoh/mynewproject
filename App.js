import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import CreateCommunityScreen from './screens/CreateCommunityScreen'
import AddMembersScreen from './screens/AddMembersScreen'
import CommunityOverViewScreen from './screens/CommunityOverViewScreen'
const AppNavigator = createStackNavigator(
    {
        //AddMembers : AddMembersScreen,
        CreateCommunity : CreateCommunityScreen,
        CommunityOverView : CommunityOverViewScreen
        
    },
);

export default createAppContainer(AppNavigator);
