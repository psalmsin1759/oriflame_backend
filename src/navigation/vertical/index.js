// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import Gamepad from 'mdi-material-ui/Gamepad'
import FileSearch from 'mdi-material-ui/FileSearch'
import CallMade from 'mdi-material-ui/PhoneDial'
import AccountPlus from 'mdi-material-ui/AccountPlus'
import AccountCash from 'mdi-material-ui/AccountCash'
import Account from 'mdi-material-ui/Account'

const navigation = () => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },

    {
      sectionTitle: 'Lottery'
    },

    {
      title: 'Add Games',
      icon: Gamepad,
      path: '/games'
    },

    {
      sectionTitle: 'Player'
    },

    {
      title: 'Add Player',
      icon: AccountPlus,
      path: '/player'
    },
    {
      title: 'Player By Games',
      icon: Account,
      path: '/playerbygames'
    },

    {
      title: 'View All',
      icon: CallMade,
      path: '/all'
    },
    {
      sectionTitle: 'Winner'
    },

    {
      title: 'Winner',
      icon: AccountCash,
      path: '/winner'
    },
    {
      sectionTitle: 'Search'
    },

    {
      title: 'Search',
      icon: FileSearch,
      path: '/search'
    },

    {
      title: 'Search By Games',
      icon: FileSearch,
      path: '/searchbygames'
    }
  ]
}

export default navigation
