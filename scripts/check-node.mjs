const major = Number(process.versions.node.split('.')[0])
if (major < 20) {
  console.error(
    `\nNode ${process.versions.node} is too old for this project (need 20+).\n` +
      `Run: nvm use\n` +
      `Or: export PATH="/opt/homebrew/bin:$PATH"\n`,
  )
  process.exit(1)
}
