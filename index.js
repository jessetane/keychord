module.exports = keychord

function keychord (el, map, onchord, onchange) {
  el._map = map
  el._touches = {}
  el._onchord = onchord
  el._onchange = onchange
  el._onkeydown = onkeydown.bind(el)
  el._onkeyup = onkeyup.bind(el)
  el._getChord = getChord.bind(el)
  el.addEventListener('keydown', el._onkeydown)
  el.addEventListener('keyup', el._onkeyup)
  return el
}

function onkeydown (evt) {
  if (this !== document.activeElement) return
  if (this._map[evt.keyCode] === undefined) return
  clearTimeout(this._releaseTimer)
  delete this._releaseTimer
  this._touches[evt.keyCode] = true
  evt.chord = this._getChord()
  evt.preventDefault()
  this._onchange && this._onchange(evt)
}

function onkeyup (evt) {
  if (this !== document.activeElement) return
  if (this._map[evt.keyCode] === undefined) return
  if (!this._releaseTimer) {
    evt.chord = this._getChord()
    this._onchord(evt)
  }
  delete this._touches[evt.keyCode]
  evt.chord = this._getChord()
  this._onchange && this._onchange(evt)
  if (Object.keys(this._touches).length > 0) {
    this._releaseTimer = setTimeout(function () {
      delete this._releaseTimer
    }.bind(this), 100)
  }
}

function getChord () {
  var chord = null
  for (var code in this._touches) {
    chord = chord || 0
    chord |= this._map[code]
  }
  return chord
}
