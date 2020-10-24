import path from 'path'

// Spawn child processes and colored string output
import childProcess from 'child_process'
import 'colors'

// Import esbuild to build the code and chokidar for watching files
import esbuild from 'esbuild'
import chokidar from 'chokidar'

// Extract the helpful bits from the packages
const { startService } = esbuild
const { watch } = chokidar

// Exit process cleanly
function cleanExit () {
  console.log('== Server exited =='.yellow)
  serverProcess = null
}

/**
 * Start a server that will automatically set to null if exited
 */
let serverProcess = null
function spawnServerProcess () {
  // Spawn server process
  serverProcess = childProcess.spawn('node', ['dist/server.js', 'dev'], { cwd: path.resolve() })

  // Echo server output
  serverProcess.stdout.on('data', (data) => {
    process.stdout.write(`[SERVER]: ${data.toString()}`.green)
  })
  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(`[SERVER]: ${data.toString()}`.red)
  })

  // Setup clean exits that set child handle to null
  serverProcess.on('close', cleanExit)
  serverProcess.on('error', cleanExit)
}

/**
 * Start a server that will automatically set to null if exited
 */
function startServer () {
  if (serverProcess === null) {
    console.log('== Starting server =='.yellow)
    spawnServerProcess()
  } else {
    console.log('== Re-starting server =='.yellow)
    try {
      serverProcess.off('close', cleanExit)
      serverProcess.off('error', cleanExit)
      serverProcess.on('close', () => {
        serverProcess = null
        spawnServerProcess()
      })
      serverProcess.kill('SIGINT')
    } catch (e) {
      console.error('== Failed to stop server =='.red)
      console.error(e)
      spawnServerProcess()
    }
  }
}

/**
 * Build the code
 */
let service = null
async function build () {
  // Start build service if not already running
  if (service === null) {
    service = await startService()
  }

  // Begin a build
  let buildSuccess = true
  try {
    // Time the build
    const timerStart = Date.now()

    // Trigger the build
    await service.build({
      color: true,
      entryPoints: ['./src/server.js'],
      outdir: './dist/',
      bundle: true,
      sourcemap: true,
      external: ['bcrypt'],
      platform: 'node',
      logLevel: 'error'
    })

    // Stop timer and output message
    const timerEnd = Date.now()
    console.log(`Built in ${timerEnd - timerStart}ms`.magenta)
  } catch (e) {
    // Output the error
    console.log('Error: build failed')
    buildSuccess = false
  }

  return buildSuccess
}

async function rebuildAndStart () {
  const buildSuccess = await build()
  if (buildSuccess) {
    startServer()
  }
}

// Start the watcher and setup to trigger rebuilds
(async () => {
  // Do first build and start server
  console.log('Building and starting server ...'.cyan)
  await rebuildAndStart()

  // Watch for changes
  const watcher = watch(['src/**/*'])
  console.log('Watching files for changes ...'.cyan)
  watcher.on('change', async (path) => {
    // Change was detected so rebuild
    console.log(`Change detected in ${path}. Rebuilding ...`.cyan)
    rebuildAndStart()
  })
})()
