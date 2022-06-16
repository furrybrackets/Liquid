#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv)).argv;
import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs-extra";
import { exec } from "child_process";
import { watchFiles } from "./watch.js";
import { sizeFormatter } from "human-readable";
import prettyMs from "pretty-ms";

// import { registerDirectory } from '@liquid/core';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const currDir = process.cwd();

function log(string) {
  console.log(chalk.blue("(liquid)") + " " + string);
}

function warn(string) {
  console.warn(chalk.yellow(`(warn)`) + " " + string);
}

function errorPrint(string) {
  console.error(chalk.red(`(error)`) + " " + string);
}

function list(array) {
  array.map((el) => {
    console.log(el);
  });
}

const formatSize = sizeFormatter();

function change(file, stats) {
  console.log(
    `${chalk.magenta("(magma)")} File ${chalk.gray(
      path.basename(file)
    )} size changed to ${chalk.green(formatSize(stats.size))}!`
  );
}

function deleted(file) {
  console.log(
    `${chalk.magenta("(magma)")} File ${chalk.gray(
      path.basename(file)
    )} was ${chalk.red("deleted")}!`
  );
}

function deleteDir(file) {
  console.log(
    `${chalk.magenta("(magma)")} Directory ${chalk.gray(
      path.basename(file)
    )} was ${chalk.red("deleted")}!`
  );
}

function add(file, stats) {
  console.log(
    `${chalk.magenta("(magma)")} File ${chalk.gray(
      path.basename(file)
    )} ${chalk.green("was created")} at ${chalk.blue(
      prettyMs(stats.birthtimeMs)
    )}!`
  );
}

function addDir(file, stats) {
  console.log(
    `${chalk.magenta("(magma)")} Directory ${chalk.gray(
      path.basename(file)
    )} ${chalk.green("was created")} at ${chalk.blue(
      prettyMs(stats.birthtimeMs)
    )}!`
  );
}

function createProject(templatePath, projectPath, answers) {
  const Name = answers.name;
  const Author = answers.author;
  const PkgManager = answers.packman;

  if (fs.existsSync(projectPath)) {
    errorPrint(
      `Folder ${projectPath} exists. Either change directories or run: ${chalk.gray(
        `liquid init newFolder`
      )}`
    );
    return false;
  }
  fs.mkdir(projectPath, (err) => {
    if (err) {
      errorPrint(err);
      throw err;
    }
  });
  fs.copy(templatePath, projectPath.trim(), (err) => {
    if (err) {
      errorPrint(err);
      throw err;
    }
  });

  return true;
}

if (argv._[0] == "init") {
  const templatePath = path.join(__dirname, "init");
  const projectPath = path.resolve(
    argv._[1] ? path.join(currDir, argv._[1]) : "" || currDir
  );

  const questions = [
    {
      type: "input",
      name: "name",
      message: "Name",
      prefix: chalk.blue.dim("question"),
      suffix: ":",
      transformer: (text, answers, flags) => {
        return chalk.greenBright(text);
      },
      default: "project",
    },
    {
      type: "input",
      name: "packman",
      message: "Package Manager",
      prefix: chalk.blue.dim("question"),
      suffix: ":",
      transformer: (text, answers, flags) => {
        return chalk.greenBright(text);
      },
      default: "yarn",
    },
    {
      type: "input",
      name: "author",
      message: "Author",
      prefix: chalk.blue.dim("question"),
      suffix: ":",
      transformer: (text, answers, flags) => {
        return chalk.greenBright(text);
      },
      default: "John Doe",
    },
  ];
  inquirer.prompt(questions).then((answers) => {
    console.log("");
    log(
      "Scaffolding in: " +
        chalk.green(projectPath.toString()) +
        " with the options:"
    );
    list([
      `- - ${chalk.green("Name:")} ${answers.name}`,
      `- - ${chalk.green("Package Manager:")} ${answers.packman}`,
      `- - ${chalk.green("Author:")} ${answers.author}`,
    ]);

    if (!createProject(templatePath, projectPath, answers)) {
      process.exit(1);
    }

    console.log("");

    console.log(
      chalk.magenta("(success)") +
        " " +
        "Successfully created Liquid project at: " +
        chalk.gray(projectPath.toString())
    );

    // generate liquid.config.tc
    const gen = (name, author) => {
      return `module.exports = {
    name: "${name}",
    author: "${author}"
  }`;
    };

    fs.writeFileSync(
      path.join(projectPath, "liquid.config.js"),
      gen(answers.name, answers.author),
      (err) => {
        if (err) {
          errorPrint(err);
          throw err;
        } else {
          console.log(
            "file written successfully: " +
              path.join(projectPath, "liquid.config.js")
          );
        }
      }
    );

    const packConf = (name, author) => {
      return `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "My new Liquid project!",
    "main": "src/main.js",
    "author": "${author}",
    "license": "MIT",
    "scripts": {
        "dev": "liquid dev",
        "build": "liquid build"
        }
}`;
    };

    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      packConf(answers.name, answers.author),
      (err) => {
        if (err) {
          errorPrint(err);
          throw err;
        }
      }
    );

    process.chdir(projectPath);

    exec(
      answers.packman == "yarn" ? "yarn" : "npm",
      (error, stdout, stderr) => {
        if (error) {
          errorPrint(stderr);
          throw error;
        }
        console.log("");
        if (answers.packman == "yarn") {
          console.log("Yarn:");
        } else {
          console.log("NPM:");
        }
        console.log(chalk.gray.dim(stdout));

        console.log("");

        console.log(`${chalk.cyan(
          "(try)"
        )} Try entering your new project: ${chalk.gray(
          "cd " + projectPath.toString()
        )}.
${chalk.cyan("(try)")} Run ${chalk.gray(
          (answers.packman == "yarn" ? "yarn" : "npm run") + " dev"
        )} and go to ${chalk.green("https://localhost:3000")}!`);
      }
    );
  });
}

if (argv._[0] == "dev") {
  // read config file
  let config;
  try {
    if (fs.existsSync(path.join(process.cwd(), "liquid.config.js"))) {
      //file exists
      import(pathToFileURL(path.join(process.cwd(), "liquid.config.js"))).then(
        (cfg) => {
          config = cfg;
          console.log(chalk.magenta("(config)") + " " + "Loaded config file! ");
          const file = fs
            .readFileSync(path.join(process.cwd(), "liquid.config.js"), "utf8")
            .toString();
          if (file) {
            console.log(chalk.gray(`\n${file}\n`));
          } else {
            console.log(chalk.gray.italic("\nempty file\n"));
          }
        }
      );
    } else {
      warn("No liquid.config.js found. Using default config.");
      console.log(
        chalk.gray(
          `\n${fs
            .readFileSync(
              path.join(__dirname, "init", "liquid.config.js"),
              "utf8"
            )
            .toString()}\n`
        )
      );
    }
  } catch (err) {
    console.error(err);
  }
  // const compInstance = registerDirectory(process.cwd()); // adds all the files.
  // hot reload
  watchFiles(process.cwd(), (type, path, stats) => {
    if (type == "add") {
      // compInstance.add(path, stats);
      // compInstance.compile();
      add(path, stats);
    }
    if (type == "change") {
      if (path.endsWith("liquid.config.js")) {
        console.log(
          chalk.magenta("(magma)") +
            " " +
            chalk.gray("liquid.config.js") +
            " updated!  New size: " +
            chalk.green(formatSize(stats.size))
        );
        // compInstance.registerNewConfig(path, stats);
        // compInstance.compile();
      } else {
        change(path, stats);
        // compInstance.change(path, stats);
        // compInstance.compile();
      }
    }
    if (type == "unlink") {
      // compInstance.delete(path);
      // compInstance.compile();
      deleted(path);
    }
    if (type == "unlinkDir") {
      // compInstance.deleteDir(path);
      // compInstance.compile();
      deleteDir(path);
    }
    if (type == "addDir") {
      // compInstance.addDir(path, stats);
      // compInstance.compile();
      addDir(path, stats);
    }
    if (type == "error") {
      // compInstance.stop(true);
    }
  });
}
