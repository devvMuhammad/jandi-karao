import { $ } from "bun";
import { mkdir } from "fs/promises";

const codeFile = process.argv[2] || "examples/hello.js";
const outputFile = `output_${Date.now()}.png`;

function getCommand(file: string): string {
  const ext = file.split(".").pop()!.toLowerCase();
  switch (ext) {
    case "py":
      return `python3 ${file}`;
    case "js":
    case "ts":
      return `bun run ${file}`;
    case "c":
      const cOut = file.replace(".c", "");
      return `gcc ${file} -o ${cOut} && ./${cOut}`;
    case "cpp":
      const cppOut = file.replace(".cpp", "");
      return `g++ ${file} -o ${cppOut} && ./${cppOut}`;
    case "java":
      const className = file.split("/").pop()?.replace(".java", "");
      return `javac ${file} && java ${className}`;
    default:
      return `bun run ${file}`;
  }
}

async function captureTerminalExecution() {
  await mkdir("outputs", { recursive: true });

  const cwd = process.cwd();
  const command = getCommand(codeFile);
  console.log(`Running: ${command}`);

  const script = `
    tell application "Terminal"
      do script "cd '${cwd}' && ${command}"
      set winId to id of front window
      return winId
    end tell
  `;

  const result = await $`osascript -e '${script}'`.text();
  const windowId = result.trim();

  // give some time for terminal to open
  await new Promise((res) => setTimeout(res, 100));

  console.log("windowId", windowId);
  const outputPath = `outputs/${outputFile}`;
  await $`screencapture -l ${windowId} ${outputPath}`.quiet();

  console.log(`Screenshot saved: ${outputPath}`);

  // close the app, commenting it for now
  // await $`osascript -e 'tell application "Terminal" to close (first window whose id is ${windowId})'`
  //   .nothrow()
  //   .quiet();
}

captureTerminalExecution().catch(console.error);
