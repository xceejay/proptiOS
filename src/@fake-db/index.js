import mock from './mock'

import './auth/jwt'
import './table'

mock.onAny().passThrough()
