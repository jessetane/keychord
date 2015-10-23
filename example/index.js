var keychord = require('../')
var selection = require('field-selection')
var ispow2 = require('is-power-of-two')

var alphabet = ' abcdefghijklmnopqrstuvwxyz\n'.split('') // etaonrishdlfcmugypwbvkjxqz
var keys = [
  { code: 83, value: 16 },  // s
  { code: 68, value: 4 },   // d
  { code: 70, value: 1 },   // f
  { code: 71, value: 0 },   // g
  { code: 72, value: 27 },  // h
  { code: 74, value: 2 },   // j
  { code: 75, value: 8 },   // k
  { code: 76, value: 32 },  // l
]

// make keyCode to value map
var map = {}
for (var i in keys) {
  var key = keys[i]
  map[key.code] = key.value
}

// render numbers
var template = document.querySelector('.number')
var row = template.parentNode
row.removeChild(template)
for (var i in alphabet) {
  var col = template.cloneNode()
  col.setAttribute('data-output-id', i)
  col.textContent = parseInt(i)
  row.appendChild(col)
}

// render letters
template = document.querySelector('.letter')
row = template.parentNode
row.removeChild(template)
for (var i in alphabet) {
  var col = template.cloneNode()
  col.setAttribute('data-output-id', i)
  col.textContent = alphabet[i] === '\n' ? '␤' : alphabet[i]
  row.appendChild(col)
}

// render keys
template = document.querySelector('.key')
row = template.parentNode
row.removeChild(template)
for (var i in keys) {
  var key = keys[i]
  var col = template.cloneNode(true)
  col.setAttribute('data-input-id', key.value)
  col.querySelector('#value').textContent = key.value
  col.querySelector('#label').textContent = String.fromCharCode(key.code, 10)
  if (key.value !== 0 && key.value !== 27) {
    col.classList.add('resting')
  }
  row.appendChild(col)
}

// textarea keychords
keychord(document.querySelector('textarea'), map, function (evt) {
  var letter = alphabet[evt.chord]
  letter && selection.replace(this, letter)
}, keychange)

// body keychords
keychord(document.body, map, function (evt) {
  console.log(evt.chord)
}, keychange)

function keychange (evt) {
  each('[data-output-id]', function (el) {
    if (el.getAttribute('data-output-id') === String(evt.chord)) {
      el.classList.add('hover')
    } else {
      el.classList.remove('hover')
    }
  })
  hoverkey(evt.chord)
}

// handle number / letter hover
each('.letter, .number', function (el) {
  el.addEventListener('mouseenter', mouseenter)
  el.addEventListener('mouseleave', mouseleave)
})

function mouseenter (evt) {
  var chord = parseInt(evt.target.getAttribute('data-output-id'), 10)
  each('[data-output-id="' + chord + '"]', function (el) {
    el.classList.add('hover')
  })
  hoverkey(chord)
}

function mouseleave (evt) {
  each('[data-output-id]', function (el) {
    el.classList.remove('hover')
  })
  each('[data-input-id]', function (el) {
    el.classList.remove('hover')
  })
}

function hoverkey (chord) {
  each('[data-input-id]', function (el) {
    var id = parseInt(el.getAttribute('data-input-id'), 10)
    if (id === chord) {
      el.classList.add('hover')
    } else if (ispow2(id) && chord !== null && chord & id) {
      el.classList.add('hover')
    } else {
      el.classList.remove('hover')
    }
  })
}

function each (selector, fn) {
  Array.prototype.slice.call(
    document.querySelectorAll(selector)
  ).forEach(fn)
}
