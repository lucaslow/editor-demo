'use strict'

const isArray = function(obj) {
  const array = []
  return (
    Object.prototype.toString.call(obj) == Object.prototype.toString.call(array)
  )
}

const isObject = function(obj) {
  const object = {}
  return (
    Object.prototype.toString.call(obj) ==
    Object.prototype.toString.call(object)
  )
}

const isString = function(str) {
  const string = 'a'
  return (
    Object.prototype.toString.call(str) ==
    Object.prototype.toString.call(string)
  )
}

module.exports = {
  isArray,
  isObject,
  isString
}
