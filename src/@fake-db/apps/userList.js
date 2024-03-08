// ** Mock
import mock from 'src/@fake-db/mock'

const data = {
  users: [
    {
      id: 35,
      billing: 'Manual - Paypal',
      fullName: 'Stephen MacGilfoyle',
      company: 'Browseblab PVT LTD',
      role: 'maintainer',
      username: 'smacgilfoyley',
      country: 'Japan',
      contact: '(350) 589-8520',
      email: 'smacgilfoyley@bigcartel.com',
      currentPlan: 'company',
      status: 'pending',
      avatar: '',
      avatarColor: 'error',
      property: 'Sunset View Estates'
    },
    {
      id: 36,
      billing: 'Automatic - Credit Card',
      fullName: 'Amanda Smith',
      company: 'DreamHomes Inc.',
      role: 'administrator',
      username: 'asmith',
      country: 'United States',
      contact: '(555) 123-4567',
      email: 'asmith@dreamhomes.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Greenwood Gardens'
    },
    {
      id: 37,
      billing: 'Automatic - Bank Transfer',
      fullName: 'David Johnson',
      company: 'Riverwalk Residences',
      role: 'user',
      username: 'davidj',
      country: 'Canada',
      contact: '(123) 456-7890',
      email: 'davidj@riverwalk.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Riverwalk Residences'
    },
    {
      id: 38,
      billing: 'Automatic - Credit Card',
      fullName: 'Emily Brown',
      company: 'Lakeside Manor Realty',
      role: 'user',
      username: 'ebrown',
      country: 'United States',
      contact: '(987) 654-3210',
      email: 'ebrown@lakesidemanor.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Lakeside Manor'
    },
    {
      id: 39,
      billing: 'Manual - Bank Transfer',
      fullName: 'Michael White',
      company: 'Pinecrest Place Properties',
      role: 'maintainer',
      username: 'mwhite',
      country: 'Australia',
      contact: '(001) 234-5678',
      email: 'mwhite@pinecrestplace.com',
      currentPlan: 'company',
      status: 'pending',
      avatar: '',
      avatarColor: 'error',
      property: 'Pinecrest Place'
    },
    {
      id: 40,
      billing: 'Automatic - Credit Card',
      fullName: 'Sarah Davis',
      company: 'Oakridge Heights Realty',
      role: 'user',
      username: 'sdavis',
      country: 'United States',
      contact: '(555) 987-6543',
      email: 'sdavis@oakridgeheights.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Oakridge Heights'
    },
    {
      id: 41,
      billing: 'Manual - Paypal',
      fullName: 'John Thompson',
      company: 'Golden Gate Apartments',
      role: 'user',
      username: 'jthompson',
      country: 'Canada',
      contact: '(987) 654-3210',
      email: 'jthompson@goldengate.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Golden Gate Apartments'
    },
    {
      id: 42,
      billing: 'Automatic - Credit Card',
      fullName: 'Jessica Lee',
      company: 'Harbor Pointe Condos Realty',
      role: 'user',
      username: 'jlee',
      country: 'United States',
      contact: '(123) 456-7890',
      email: 'jlee@harborpointe.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Harbor Pointe Condos'
    },
    {
      id: 43,
      billing: 'Automatic - Bank Transfer',
      fullName: 'Andrew Turner',
      company: 'Valley Vista Homes',
      role: 'administrator',
      username: 'aturner',
      country: 'United Kingdom',
      contact: '(987) 654-3210',
      email: 'aturner@valleyvista.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Valley Vista Homes'
    },
    {
      id: 44,
      billing: 'Manual - Paypal',
      fullName: 'Lisa Smith',
      company: 'Silver Oaks Estates Realty',
      role: 'user',
      username: 'lsmith',
      country: 'United States',
      contact: '(001) 234-5678',
      email: 'lsmith@silveroaks.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Silver Oaks Estates'
    },
    {
      id: 45,
      billing: 'Automatic - Credit Card',
      fullName: 'Kevin Wilson',
      company: 'Maplewood Villas',
      role: 'maintainer',
      username: 'kwilson',
      country: 'Canada',
      contact: '(350) 589-8520',
      email: 'kwilson@maplewoodvillas.com',
      currentPlan: 'company',
      status: 'pending',
      avatar: '',
      avatarColor: 'error',
      property: 'Maplewood Villas'
    },
    {
      id: 46,
      billing: 'Automatic - Bank Transfer',
      fullName: 'Rachel Roberts',
      company: 'Seaside Retreat Realty',
      role: 'user',
      username: 'rroberts',
      country: 'Australia',
      contact: '(555) 123-4567',
      email: 'rroberts@seasideretreat.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Seaside Retreat'
    },
    {
      id: 47,
      billing: 'Manual - Paypal',
      fullName: 'Mark Anderson',
      company: 'Hilltop Haven Properties',
      role: 'user',
      username: 'manderson',
      country: 'United States',
      contact: '(123) 456-7890',
      email: 'manderson@hilltophaven.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Hilltop Haven'
    },
    {
      id: 48,
      billing: 'Automatic - Credit Card',
      fullName: 'Julia Garcia',
      company: 'Meadowbrook Meadows Realty',
      role: 'user',
      username: 'jgarcia',
      country: 'Canada',
      contact: '(987) 654-3210',
      email: 'jgarcia@meadowbrookmeadows.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Meadowbrook Meadows'
    },
    {
      id: 49,
      billing: 'Manual - Bank Transfer',
      fullName: 'Ryan Carter',
      company: 'Creekside Estates',
      role: 'user',
      username: 'rcarter',
      country: 'United States',
      contact: '(001) 234-5678',
      email: 'rcarter@creeksideestates.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Creekside Estates'
    },
    {
      id: 50,
      billing: 'Automatic - Credit Card',
      fullName: 'Olivia Adams',
      company: 'Royal Palms Condominiums',
      role: 'maintainer',
      username: 'oadams',
      country: 'Canada',
      contact: '(350) 589-8520',
      email: 'oadams@royalpalms.com',
      currentPlan: 'company',
      status: 'pending',
      avatar: '',
      avatarColor: 'error',
      property: 'Royal Palms Condominiums'
    },
    {
      id: 51,
      billing: 'Automatic - Bank Transfer',
      fullName: 'Daniel Brown',
      company: 'Whispering Pines Realty',
      role: 'user',
      username: 'dbrown',
      country: 'United Kingdom',
      contact: '(555) 123-4567',
      email: 'dbrown@whisperingpines.com',
      currentPlan: 'premium',
      status: 'active',
      avatar: '',
      avatarColor: 'success',
      property: 'Whispering Pines'
    },
    {
      id: 52,
      billing: 'Manual - Paypal',
      fullName: 'Emma Wilson',
      company: 'Summerfield Square',
      role: 'user',
      username: 'ewilson',
      country: 'United States',
      contact: '(123) 456-7890',
      email: 'ewilson@summerfieldsquare.com',
      currentPlan: 'basic',
      status: 'pending',
      avatar: '',
      avatarColor: 'warning',
      property: 'Summerfield Square'
    }
  ]
}

const projectListData = [
  {
    id: 1,
    hours: '18:42',
    progressValue: 78,
    totalTask: '122/240',
    progressColor: 'success',
    projectType: 'React Project',
    projectTitle: 'BGC eCommerce App',
    img: '/images/icons/project-icons/react.png'
  },
  {
    id: 2,
    hours: '20:42',
    progressValue: 18,
    totalTask: '9/56',
    progressColor: 'error',
    projectType: 'Figma Project',
    projectTitle: 'Falcon Logo Design',
    img: '/images/icons/project-icons/figma.png'
  },
  {
    id: 3,
    hours: '120:87',
    progressValue: 62,
    totalTask: '290/320',
    progressColor: 'primary',
    projectType: 'VueJs Project',
    projectTitle: 'Dashboard Design',
    img: '/images/icons/project-icons/vue.png'
  },
  {
    id: 4,
    hours: '89:19',
    progressValue: 8,
    totalTask: '7/63',
    progressColor: 'error',
    projectType: 'Xamarin Project',
    projectTitle: 'Foodista Mobile App',
    img: '/images/icons/project-icons/xamarin.png'
  },
  {
    id: 5,
    hours: '230:10',
    progressValue: 49,
    totalTask: '120/186',
    progressColor: 'warning',
    projectType: 'Python Project',
    projectTitle: 'Dojo React Project',
    img: '/images/icons/project-icons/python.png'
  },
  {
    id: 6,
    hours: '342:41',
    progressValue: 92,
    totalTask: '99/109',
    progressColor: 'success',
    projectType: 'Sketch Project',
    projectTitle: 'Blockchain Website',
    img: '/images/icons/project-icons/sketch.png'
  },
  {
    id: 7,
    hours: '12:45',
    progressValue: 88,
    totalTask: '98/110',
    progressColor: 'success',
    projectType: 'HTML Project',
    projectTitle: 'Hoffman Website',
    img: '/images/icons/project-icons/html5.png'
  }
]

// POST: Add new user
mock.onPost('/apps/users/add-user').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data).data
  const lastId = Math.max(...data.users.map(u => u.id), 0)
  user.id = lastId + 1
  data.users.unshift({ ...user, avatar: '', avatarColor: 'primary', status: 'active' })

  return [201, { user }]
})

// GET: DATA
mock.onGet('/apps/users/list').reply(config => {
  const { q = '', role = null, status = null, currentPlan = null } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.users.filter(
    user =>
      (user.username.toLowerCase().includes(queryLowered) ||
        user.fullName.toLowerCase().includes(queryLowered) ||
        user.role.toLowerCase().includes(queryLowered) ||
        (user.email.toLowerCase().includes(queryLowered) &&
          user.currentPlan.toLowerCase().includes(queryLowered) &&
          user.status.toLowerCase().includes(queryLowered))) &&
      user.role === (role || user.role) &&
      user.currentPlan === (currentPlan || user.currentPlan) &&
      user.status === (status || user.status)
  )

  return [
    200,
    {
      allData: data.users,
      users: filteredData,
      params: config.params,
      total: filteredData.length
    }
  ]
})

// DELETE: Deletes User
mock.onDelete('/apps/users/delete').reply(config => {
  // Get user id from URL
  const userId = config.data
  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)

  return [200]
})

// GET: DATA
mock.onGet('/apps/users/project-list').reply(config => {
  const { q = '' } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = projectListData.filter(
    user =>
      user.projectTitle.toLowerCase().includes(queryLowered) ||
      user.projectType.toLowerCase().includes(queryLowered) ||
      user.totalTask.toLowerCase().includes(queryLowered) ||
      user.hours.toLowerCase().includes(queryLowered) ||
      String(user.progressValue).toLowerCase().includes(queryLowered)
  )

  return [200, filteredData]
})
