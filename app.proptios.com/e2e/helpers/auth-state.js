const fs = require('fs')
const path = require('path')

const AUTH_FILE = path.join(__dirname, '..', '.auth.json')
const USER_FILE = path.join(__dirname, '..', '.auth-user.json')
const AUTH_MODE = process.env.E2E_AUTH_MODE || 'login'

const DEFAULT_USER = {
  email: process.env.E2E_EMAIL || 'joel@example.com',
  password: process.env.E2E_PASSWORD || 'password@123',
  fullName: process.env.E2E_FULL_NAME || 'Joel Amoako',
  siteName: process.env.E2E_SITE_NAME || 'Proptios QA',
  siteId: process.env.E2E_SITE_ID || 'proptios-qa',
}

function readTestUser() {
  if (!fs.existsSync(USER_FILE)) {
    return { ...DEFAULT_USER }
  }

  try {
    return {
      ...DEFAULT_USER,
      ...JSON.parse(fs.readFileSync(USER_FILE, 'utf8')),
    }
  } catch {
    return { ...DEFAULT_USER }
  }
}

function writeTestUser(user) {
  fs.writeFileSync(USER_FILE, JSON.stringify(user, null, 2))
}

function clearAuthState() {
  for (const file of [AUTH_FILE, USER_FILE]) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  }
}

module.exports = {
  AUTH_FILE,
  AUTH_MODE,
  USER_FILE,
  clearAuthState,
  readTestUser,
  writeTestUser,
}
