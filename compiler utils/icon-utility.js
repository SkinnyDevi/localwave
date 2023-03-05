const path = require("path");
const fs = require("fs");

/**
 * Writes a noticon.png file to the distribution folders.
 * @param {Buffer} file - File to write to directories
 */
function writeIcon(file) {
  const dists = ["win", "macos"];
  for (let d of dists) {
    fs.writeFileSync(
      path.resolve(
        path.dirname(process.argv[1]),
        "..",
        "server",
        "build",
        `localwave-${d}-dist`,
        "notifier",
        "noticon.png"
      ),
      file
    );

    console.log(`Added notifier icon to localwave-${d}-dist\\notifier.`);
  }
}

/**
 * Deletes build directory for newly packaged distributions.
 */
function deleteFiles() {
  fs.rmSync(path.resolve(__dirname, "..", "server", "build"), {
    recursive: true,
    force: true,
  });
  console.log("Deleted build directory (if any).");
}

const file = fs.readFileSync(
  path.resolve(
    path.dirname(process.argv[1]),
    "..",
    "server",
    "assets",
    "noticon.png"
  )
);

if (0 === process.argv.length - 2 || process.argv.length - 2 > 1)
  throw new Error(`Expected 1 argument, received ${process.argv.length - 2}`);

switch (process.argv[2]) {
  case "-d":
    deleteFiles();
    break;
  case "-w":
    writeIcon(file);
    break;
}
