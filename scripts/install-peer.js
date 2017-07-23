const path = require('path');
const { execSync } = require('child_process');

const argv = process.argv.slice(2);

if (argv.length === 0) {
  throw new Error(
    `Usage: node path/to/${path.basename(__filename)} <package-name>`,
  );
}

const package_json = require(`${__dirname}/../package.json`);

const target_name = argv[0];
const target_version_range = package_json.peerDependencies[target_name];

if (target_version_range === undefined) {
  throw new Error(`Invalid peer-dependency name '${target_name}'`);
}

const target_version = target_version_range.slice(1);
const command = `yarn upgrade ${target_name}@${target_version} --no-lockfile`;

console.log(`> ${command}`);
execSync(command, { stdio: [0, 1, 2] });
