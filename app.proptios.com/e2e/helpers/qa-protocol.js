const fs = require('fs')
const path = require('path')

const STATE_FILE = path.join(process.cwd(), 'test-results', 'qa-protocol-state.json')

let protocolState = {
  metadata: {},
  entities: {},
  notes: [],
}

function persist() {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  fs.writeFileSync(STATE_FILE, JSON.stringify(protocolState, null, 2))
}

function resetProtocolState(metadata = {}) {
  protocolState = {
    metadata: {
      startedAt: new Date().toISOString(),
      ...metadata,
    },
    entities: {},
    notes: [],
  }
  persist()
}

function recordEntity(key, value) {
  protocolState.entities[key] = {
    ...(protocolState.entities[key] || {}),
    ...value,
  }
  persist()

  return protocolState.entities[key]
}

function getEntity(key) {
  return protocolState.entities[key]
}

function appendNote(note) {
  protocolState.notes.push({
    recordedAt: new Date().toISOString(),
    ...note,
  })
  persist()
}

module.exports = {
  STATE_FILE,
  appendNote,
  getEntity,
  recordEntity,
  resetProtocolState,
}
