#!/usr/bin/env bun

import { $ } from 'bun'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import { resolve } from 'path'
import packageJson from './package.json'

const VERSION = packageJson.version
const BUILD_DIR = 'build'
const ZIP_NAME = `website-to-markdown-chrome-${VERSION}.zip`

console.log(`📦 Packaging Chrome extension v${VERSION}`)

try {
  // Clean up previous build
  if (existsSync(BUILD_DIR)) {
    console.log('🧹 Cleaning previous build...')
    rmSync(BUILD_DIR, { recursive: true, force: true })
  }

  // Build the app
  console.log('🔨 Building the app...')
  await $`bun run build`

  // Create build directory
  console.log('📁 Creating build directory...')
  mkdirSync(BUILD_DIR, { recursive: true })

  // Copy manifest.json to build directory
  console.log('📋 Copying manifest...')
  await $`cp manifest.json ${BUILD_DIR}/`

  // Copy dist folder to build directory
  console.log('📂 Copying dist folder...')
  await $`cp -r dist ${BUILD_DIR}/`

  // Copy icon.png to build directory
  console.log('🖼️ Copying icon...')
  await $`cp icon.png ${BUILD_DIR}/`

  // Copy LICENSE file to build directory
  console.log('📄 Copying license...')
  await $`cp LICENSE ${BUILD_DIR}/`

  // Create zip file
  console.log('🗜️ Creating zip file...')
  await $`cd ${BUILD_DIR} && zip -r ../${ZIP_NAME} .`

  console.log(`✅ Package created: ${ZIP_NAME}`)
  console.log(`📊 Ready for Chrome Web Store upload!`)

} catch (error) {
  console.error('❌ Packaging failed:', error)
  process.exit(1)
}