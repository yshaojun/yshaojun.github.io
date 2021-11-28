function toString(bytes) {
    return Array.prototype.map.call(bytes, x => String.fromCharCode(x)).join('')
}

function addTo(obj, item) {
  const [key, value] = item
  const val = obj[key]

  if (val === undefined) {
    obj[key] = value
  } else if (Array.isArray(val)) {
    val.push(value)
  } else {
    obj[key] = [val, value]
  }
}

/**
 * Raw decode, copied from https://github.com/konsumer/rawproto
 * @param {string} stringMode 'auto' | 'string' | 'binary'
 */
function pbDecode(buffer, stringMode = 'auto') {
  const reader = window.protobuf.Reader.create(buffer)
  const out = {}

  while (reader.pos < reader.len) {
    const tag = reader.uint64()
    const id = tag >>> 3
    const wireType = tag & 7

    switch (wireType) {
      // int32, int64, uint32, bool, enum, etc
      case 0:
        addTo(out, [id, reader.uint32()])
        break

      // fixed64, sfixed64, double
      case 1:
        addTo(out, [id, reader.fixed64()])
        break

      // string, bytes, sub-message
      case 2:
        const bytes = reader.bytes()
        try {
          const innerMessage = getData(bytes, stringMode)
          addTo(out, [id, innerMessage])
        } catch (e) {
          if (stringMode === 'binary') {
            addTo(out, [id, bytes])
          } else if (stringMode === 'string') {
            addTo(out, [id, toString(bytes)])
          } else {
            // search buffer for extended chars
            let hasExtended = false
            bytes.forEach(b => {
              if (b < 32) {
                hasExtended = true
              }
            })

            if (hasExtended) {
              addTo(out, [id, bytes])
            } else {
              addTo(out, [id, toString(bytes)])
            }
          }
        }
        break

      // IGNORE start_group
      // IGNORE end_group

      // fixed32, sfixed32, float
      case 5: 
        addTo(out, [id, reader.float()])
        break

      default:
        reader.skipType(wireType)
    }
  }
  return out
}

window.pbDecode = pbDecode
