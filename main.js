#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).argv
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const currDir = process.cwd();

function log(string) {
    console.log(chalk.blue('(liquid)') + ' ' + string);
};

function warn(string) {
    console.warn(chalk.yellow(`(warn)`) + ' ' + string);
}

function error(string) {
    console.error(chalk.red(`(error)`) + ' ' + string);
}

function list(array) {
    array.map(el => {
        console.log(el);
    })
}


function createProject(templatePath, projectPath, answers) {
    const Name = answers.name;
    const Author = answers.author;
    const PkgManager = answers.packman;

    if (fs.existsSync(projectPath)) {
        error(`Folder ${projectPath} exists. Either change directories or run: ${chalk.gray(`liquid init newFolder`)}`);
        return false;
    }
    fs.mkdir(projectPath, (err) => {
        if (err) {
            error(err);
            throw err;
        };
    });
    fs.copy(templatePath, projectPath.trim(), (err) => {
        if (err) {
            error(err);
            throw err;
        };
    });

    // generate liquid.config.tc
    const gen = (name, author) => {
        return (
`module.exports = {
    name: '${name}',
    author: '${author}'
}`
        )
    };

    fs.writeFile(path.join(templatePath, 'liquid.config.js'), gen(Name, Author), (err) => {
        if (err) {
            error(err);
            throw err;
        };
    });

    const packConf = (name, author) => {
        return `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "My new Liquid project!",
    "main": "src/main.js",
    "author": "${author}",
    "license": "MIT"
}`
    };

    fs.writeFile(path.join(templatePath, 'package.json'), packConf(Name, Author), (err) => {
        if (err) {
            error(err);
            throw err;
        };
    });

    
    
    return true;
}

if (argv._[0] == 'init') {
    const templatePath = path.join(__dirname, 'init');
    const projectPath = path.resolve(argv._[1] ? path.join(currDir, argv._[1]) : '' || currDir);

    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Name',
            prefix: chalk.blue.dim('question'),
            suffix: ':',
            transformer: (text, answers, flags) => {
                return chalk.greenBright(text);
            },
            default: 'project'
        },
        {
            type: 'input',
            name: 'packman',
            message: 'Package Manager',
            prefix: chalk.blue.dim('question'),
            suffix: ':',
            transformer: (text, answers, flags) => {
                return chalk.greenBright(text);
            },
            default: 'yarn'
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author',
            prefix: chalk.blue.dim('question'),
            suffix: ':',
            transformer: (text, answers, flags) => {
                return chalk.greenBright(text);
            },
            default: 'John Doe'
        },

    ]
    inquirer.prompt(questions).then((answers) => {
        console.log('');
        log('Scaffolding in: ' + chalk.green(projectPath.toString()) + ' with the options:');
        list([
            `- - ${chalk.green('Name:')} ${answers.name}`,
            `- - ${chalk.green('Package Manager:')} ${answers.packman}`,
            `- - ${chalk.green('Author:')} ${answers.author}`
        ])

        if (!createProject(templatePath, projectPath, answers)) {
            process.exit(1);
        };

        console.log('');

        console.log(
            chalk.magenta('(success)') + ' ' + 'Sucessfully created Liquid project at: ' + chalk.gray(projectPath.toString())
        );

        process.chdir(projectPath);

        exec(answers.packman == 'yarn' ? 'yarn' : 'npm', (error, stdout, stderr) => {
            if (error) {
                error(stderr);
                throw error;
            };
            console.log(
                'Yarn:'
            );
            console.log(chalk.gray.dim(stdout));
        })
    });
}