const vertexShaderSource = `
attribute vec4 p_position;

void main() {
  gl_Position = p_position;
}
`

const fragmentShaderSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0, 1, 0, 1);
}
`

function main() {
  // 1. gl
  const canvas = document.querySelector("#c")
  const gl = canvas.getContext("webgl")
  if (!gl) {
    return
  }

  // 2. shaders
  const shaders = [
    [gl.VERTEX_SHADER, vertexShaderSource],
    [gl.FRAGMENT_SHADER, fragmentShaderSource]
  ].map(([type, source]) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    return shader
  })

  // 3. program
  const program = gl.createProgram()
  shaders.forEach(shader => {
    gl.attachShader(program, shader)
  })
  gl.linkProgram(program)
  gl.useProgram(program)

  // 4. draw
  //
  const positionAttributeLocation = gl.getAttribLocation(program, "p_position")
  const positionBuffer = gl.createBuffer()
  const positions = [
    0, 0,
    0, 0.8,
    0.5, 0,
  ]

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

main()
