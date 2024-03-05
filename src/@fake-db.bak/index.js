import mock from './mock'

import './auth/jwt'
import './table'
import './apps/chat'
import './apps/userList'

mock.onAny().passThrough()
