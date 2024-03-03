import mock from './mock'

import './auth/jwt'
import './table'
import './apps/chat'

mock.onAny().passThrough()
