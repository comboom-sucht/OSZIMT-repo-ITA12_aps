'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
/*
 * Copyright (c) 2020 Payara Foundation and/or its affiliates and others.
 * All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0, which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the
 * Eclipse Public License v. 2.0 are satisfied: GNU General Public License,
 * version 2 with the GNU Classpath Exception, which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 */
const fs = require("fs");
const vscode_1 = require("vscode");
class TaskManager {
    getPayaraConfig(workspaceFolder, defaultDefinition) {
        let definition = undefined;
        for (const def of this.getDefinitions(workspaceFolder.uri)) {
            if (def.label && def.label === defaultDefinition.label) {
                definition = def;
            }
        }
        if (!definition) {
            definition = this.createDefinition(workspaceFolder, defaultDefinition);
        }
        return definition;
    }
    getDefinitions(target) {
        let workspaceConfiguration = vscode_1.workspace.getConfiguration('tasks', target);
        let configurations = workspaceConfiguration.get('tasks');
        return configurations ? configurations : [];
    }
    createDefinition(workspaceFolder, defaultConfig) {
        let vscodeDir = this.getVSCodeDir(workspaceFolder);
        let tasksFile = vscodeDir + '/tasks.json';
        let definitions = [];
        let tasks = vscode_1.workspace.getConfiguration('tasks', workspaceFolder.uri);
        if (!fs.existsSync(tasksFile)) {
            tasks.update('version', "2.0.0");
            tasks.update('tasks', []);
        }
        else {
            let definition = tasks.get('tasks');
            if (definition) {
                definitions = definition;
            }
        }
        definitions.push(defaultConfig);
        tasks.update('tasks', definitions, false);
        return defaultConfig;
    }
    getVSCodeDir(workspaceFolder) {
        let vscodeDir = workspaceFolder.uri.fsPath + '/.vscode';
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir);
        }
        return vscodeDir;
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=TaskManager.js.map