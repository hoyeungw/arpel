/**
 * keys.js - emit key presses
 * Copyright (c) 2010-2015, Joyent, Inc. and other contributors (MIT License)
 * https://github.com/chjj/blessed
 */
import { DATA, KEYPRESS, NEW_LISTENER } from '@pres/enum-events'
import { StringDecoder } from 'string_decoder'
import { parseKeycodes } from './parser'

export class KeyCodeEvent {
  static registerKeypress(stream, keypressEventName = KEYPRESS) {
    if (stream.keycodeDecoder) {
      return void 0
    }
    else {
      stream.keycodeDecoder = new StringDecoder('utf8')
    }

    function dataHandler(buffer) {
      if (stream.listenerCount(KEYPRESS) > 0) {
        /** @type {StringDecoder }*/ const keycodeDecoder = stream.keycodeDecoder
        const text = keycodeDecoder.write(buffer)
        if (text) {
          const buffers = parseKeycodes(text)
          for (let { key, ch } of buffers) {
            if (key || ch) stream.emit(keypressEventName, ch, key)
          }
        }
      }
      else { // Nobody's watching anyway
        stream.off(DATA, dataHandler)
        stream.on(NEW_LISTENER, enrollHandler)
      }
    }

    function enrollHandler(event) {
      if (event === KEYPRESS) {
        stream.on(DATA, dataHandler)
        stream.off(NEW_LISTENER, enrollHandler)
      }
    }

    if (stream.listenerCount(KEYPRESS) > 0) {
      stream.on(DATA, dataHandler)
    }
    else {
      stream.on(NEW_LISTENER, enrollHandler)
    }
  }
}

